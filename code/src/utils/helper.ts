import ejs from 'ejs';
import { ExifTool } from 'exiftool-vendored';
import fs from 'fs-extra';
import puppeteer, { Browser } from 'puppeteer';

import { Guest, GuestRecord } from './classes';
import { SPREADSHEET } from './conf';
import * as Paths from './paths';

import RULES from '../../views/data/rules.json';
import { error, readFileContent } from '../utils/common';

let browser: Browser;
let exiftool: ExifTool;

/**
 * Generates the HTML files for each member on the guest list from the template.
 * @param refreshCache Indicates whether the data cache should be refreshed.
 * @returns A promise fulfilled when all HTML files have been generated.
 */
export async function generateHTMLFiles(
  refreshCache: boolean
): Promise<Array<void>> {
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
export async function generatePDFFiles(): Promise<void> {
  fs.ensureDirSync(`${Paths.OUTPUT_DIR}/pdf/guests`);
  
  browser = await puppeteer.launch();
  exiftool = new ExifTool();

  const filenames = fs.readdirSync(`${Paths.OUTPUT_DIR}/html/guests`);
  const promises = filenames.map((filename) => {
    const [name] = filename.split('.');
    const html = readFileContent(
      `${Paths.OUTPUT_DIR}/html/guests/${name}.html`
    );
    return createGuestPDFPage(html, name);
  });

  await Promise.all(promises);
  await browser.close();
  await exiftool.end();
}

/**
 * Creates a single HTML file for a guest from the template.
 * @param guest The guest whose information is on the page.
 * @returns A promise fulfilled when the HTML file is created.
 */
async function createGuestHTML(guest: Guest): Promise<void> {
  const outputFile = `${Paths.OUTPUT_DIR}/html/guests/${guest.name}.html`;
  await createHTMLPage(Paths.TEMPLATE_FILE, outputFile, guest);
}

/**
 * Creates a single PDF file for a guest from the HTML file.
 * @param html The HTML string to be used for generating the PDF.
 * @param name The name of the guest.
 * @returns A promise fulfilled when the PDF file is created.
 */
async function createGuestPDFPage(html: string, name: string): Promise<void> {
  const path = `${Paths.OUTPUT_DIR}/pdf/guests/${name}.pdf`;
  try {
    await createPDFPage(html, path);
    await exiftool.write(path, { Title: `Invite to ${name}` }, [
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
    const template = ejs.compile(data, { root: Paths.VIEWS_DIR });
    const html = template({
      cssFile: Paths.STYLES_FILE,
      images: {
        signature: Paths.SIGNATURE_IMG,
        waves: Paths.WAVES_SVG
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
    await page.addStyleTag({ url: Paths.FONTS_URL });
    await page.addStyleTag({ path: Paths.STYLES_FILE });
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

    await SPREADSHEET.loadInfo();
    const [sheet] = SPREADSHEET.sheetsByIndex;
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
    fs.outputFileSync(Paths.CACHED_DATA, JSON.stringify(guests, null, 2));
  }
  const guests = readFileContent(Paths.CACHED_DATA);
  return <Array<Guest>>JSON.parse(guests);
}
