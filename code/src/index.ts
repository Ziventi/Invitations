import ejs from 'ejs';
import fs from 'fs-extra';
import puppeteer, { Browser } from 'puppeteer';
import { Command } from 'commander';

import path from 'path';

import { Guest, GuestRecord } from './classes';
import { DOCUMENT, EXIFTOOL, OUTPUT_DIR } from './config';
import RULES from './templates/rules.json';
import { clean, error } from './utils';

const ASSETS_DIR = path.resolve(__dirname, './assets');
const CACHE_DIR = path.resolve(__dirname, './cache');
const TEMPLATES_DIR = path.resolve(__dirname, './templates');

const CACHED_DATA = `${CACHE_DIR}/data.json`;
const STYLES_FILE = `${TEMPLATES_DIR}/styles.css`;
const TEMPLATE_FILE = `${TEMPLATES_DIR}/template.ejs`;

const SIGNATURE_IMG = `${ASSETS_DIR}/signature.svg`;
const WAVES_SVG = `${ASSETS_DIR}/waves.svg`;

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Tangerine:wght@700&display=swap';
const program = new Command();

let browser: Browser;

main();

async function setup() {
  console.time('Time');
  clean();
  fs.ensureDirSync(OUTPUT_DIR);
  browser = await puppeteer.launch();
}

async function tearDown() {
  await browser.close();
  await EXIFTOOL.end();
  console.timeEnd('Time');
}

/**
 * Main program.
 */
async function main() {
  program
    .command('generate')
    .description('Generates the view files from the templates.')
    .option('-p, --with-pdf', 'Also generate the PDF files.', false)
    .option('-r, --refresh', 'Reload the external dataset and refresh the cache.', false)
    .action(async (options) => {
      const { withPdf, refresh } = options;
      const refreshCache = refresh || !fs.existsSync(CACHED_DATA);

      await setup();
      await generateHTMLFiles(refreshCache);
      if (withPdf) {
        console.info('Generating PDF files...');
        await generatePDFFiles();
      }

      await tearDown();
    });

  program.command('clean').action(clean);
  program.addHelpCommand(false);
  
  if (!program.args.length){
    program.help();
    process.exit(0);
  }
  
  await program.parseAsync();
}

/**
 * Generates the HTML files for each member on the guest list from the template.
 * @param refreshCache Indicates whether the data cache should be refreshed.
 * @returns A promise fulfilled when all HTML files have been generated.
 */
async function generateHTMLFiles(refreshCache: boolean): Promise<Array<void>> {
  console.info('Generating HTML files...');
  const guests = await loadGuestList(refreshCache);
  const promises = guests.slice(18, 19).map(createGuestHTML);
  return Promise.all(promises);
}

/**
 * Generates the PDF files from each of the guest HTML files.
 * @param refreshCache Indicates whether the data cache should be refreshed.
 * @returns A promise fulfilled when all PDF files have been generated.
 */
function generatePDFFiles(): Promise<Array<void>> {
  fs.ensureDirSync(`${OUTPUT_DIR}/pdf/guests`);

  const filenames = fs.readdirSync(`${OUTPUT_DIR}/html/guests`);
  const promises = filenames.map((filename) => {
    const [name] = filename.split('.');
    const html = readFileContent(`${OUTPUT_DIR}/html/guests/${name}.html`);
    return createGuestPDFPage(html, name);
  });

  return Promise.all(promises);
}

/**
 * Creates a single HTML file for a guest from the template.
 * @param guest The guest whose information is on the page.
 * @returns A promise fulfilled when the HTML file is created.
 */
async function createGuestHTML(guest: Guest): Promise<void> {
  const outputFile = `${OUTPUT_DIR}/html/guests/${guest.name}.html`;
  await createHTMLPage(TEMPLATE_FILE, outputFile, guest);
}

/**
 * Creates a single PDF file for a guest from the HTML file.
 * @param html The HTML string to be used for generating the PDF.
 * @param name The name of the guest.
 * @returns A promise fulfilled when the PDF file is created.
 */
async function createGuestPDFPage(html: string, name: string): Promise<void> {
  const path = `${OUTPUT_DIR}/pdf/guests/${name}.pdf`;
  try {
    await createPDFPage(html, path);
    await EXIFTOOL.write(path, { Title: `Invite to ${name}` }, [
      '-overwrite_original'
    ]);
  } catch (err) {
    return error(err);
  }
}

/**
 * Helper function for generating HTML pages.
 * @param templateFile The input template EJS file.
 * @param outputFile The HTML file output path.
 * @param guest The guest whose details will go on the invite.
 * @returns A promise fulfilled when the HTML page is created.
 */
async function createHTMLPage(
  templateFile: string,
  outputFile: string,
  guest: Guest
): Promise<void> {
  try {
    const data = await fs.readFile(templateFile, 'utf8');
    const template = ejs.compile(data, { root: TEMPLATES_DIR });
    const html = template({
      cssFile: STYLES_FILE,
      images: {
        signature: SIGNATURE_IMG,
        waves: WAVES_SVG
      },
      rules: RULES,
      lists: {
        guest: process.env.GUESTLIST_URL,
        wish: process.env.WISHLIST_URL
      },
      guest
    });
    return await fs.outputFile(outputFile, html);
  } catch (err) {
    return error(err);
  }
}

/**
 * Helper function for creating PDF pages.
 * @param html The HTML content to be used for the page.
 * @param outputPath The path to which the PDF will be saved.
 * @returns A promise fulfilled when the PDF page is created.
 */
async function createPDFPage(html: string, outputPath: string) {
  try {
    const page = await browser.newPage();
    await page.setContent(html);
    await page.addStyleTag({ url: FONTS_URL });
    await page.addStyleTag({ path: STYLES_FILE });
    await page.emulateMediaType('screen');
    await page.evaluateHandle('document.fonts.ready');
    return await page.pdf({
      format: 'a4',
      path: outputPath,
      printBackground: true
    });
  } catch (err) {
    return error(err);
  }
}

/**
 * Retrieves the full guest list.
 * @returns A promise which resolves to the list of guest records.
 */
async function loadGuestList(refreshCache: boolean): Promise<Array<Guest>> {
  if (refreshCache) {
    console.info('Refreshing cache...');

    await DOCUMENT.loadInfo();
    const [sheet] = DOCUMENT.sheetsByIndex;
    const records = <Array<GuestRecord>>await sheet.getRows();
    const guests = records.map((record) => {
      const guest = new Guest();
      guest.name = record['Name'];
      guest.rank = GuestRecord.getRank(record);
      const tagline = record['Tagline'];
      if (tagline) {
        guest.tagline = tagline.substr(0, 1).toLowerCase() + tagline.substr(1);
      }
      return guest;
    });
    fs.outputFileSync(CACHED_DATA, JSON.stringify(guests, null, 2));
  }
  const guests = readFileContent(CACHED_DATA);
  return <Array<Guest>>JSON.parse(guests);
}

/**
 * Reads content from a specified file.
 * @param file The file path to read from.
 * @returns The content as a string.
 */
function readFileContent(file: string) {
  const html = fs.readFileSync(file, { encoding: 'utf8' });
  return html;
}
