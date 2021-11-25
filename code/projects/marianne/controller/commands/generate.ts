import * as dotenv from 'dotenv';
import ejs from 'ejs';
import { ExifTool } from 'exiftool-vendored';
import express from 'express';
import fs from 'fs-extra';
import sass from 'node-sass';
import puppeteer, { Browser } from 'puppeteer';

import { Server } from 'http';

import { Guest } from '../utils/classes';
import * as Utils from '../utils/functions';
import * as Paths from '../utils/paths';

dotenv.config();

const app = express();
const { SS_PUBLIC_LISTS_ID, SS_WISHLIST_SHEET_ID } = process.env;

app.use(express.static(Paths.IMAGES_DIR));

const PUBLIC_LISTS_URL = Utils.getSpreadsheetUrl(SS_PUBLIC_LISTS_ID!);
const WISHLIST_URL = `${PUBLIC_LISTS_URL}#gid=${SS_WISHLIST_SHEET_ID!}`;

let browser: Browser;
let exiftool: ExifTool;
let imageServer: Server;

/**
 * Generates the invitation files.
 * @param options The options supplied via the CLI.
 */
export default async function generate(options: GenerateOptions) {
  const { all, name, refreshCache, withPdf } = options;

  Utils.setup();
  transpileSass();
  copyImages();
  await generateHTMLFiles({
    all,
    name,
    refreshCache: refreshCache || !fs.existsSync(Paths.CACHED_DATA)
  });
  if (withPdf) {
    await generatePDFFiles();
  }
  Utils.tearDown();
}

/**
 * Copies images to output folder.
 */
function copyImages() {
  console.info('Copying images to output...');
  fs.ensureDirSync(Paths.IMAGES_OUTPUT_DIR);
  try {
    fs.copySync(Paths.IMAGES_DIR, Paths.IMAGES_OUTPUT_DIR);
  } catch (e) {
    Utils.error(e);
  }
}

/**
 * Transpiles the SCSS files to CSS.
 */
function transpileSass() {
  console.info('Transpiling SCSS to CSS...');
  fs.ensureDirSync(`${Paths.OUTPUT_DIR}/css`);
  try {
    const output = sass.renderSync({
      file: Paths.STYLES_INPUT_FILE,
      sourceMap: false
    });
    fs.writeFileSync(Paths.STYLES_OUTPUT_FILE, output.css);
  } catch (e) {
    Utils.error(e);
  }
}

/**
 * Generates the HTML files for each member on the guest list from the template.
 * @param options The options for generating HTML.
 * @returns A promise fulfilled when all HTML files have been generated.
 */
async function generateHTMLFiles({
  all,
  name,
  refreshCache
}: GenerateHTMLOptions): Promise<void> {
  console.info('Generating HTML files...');
  const TEST_NUMBER = 17;

  let guests = await Utils.loadGuestList(refreshCache);
  if (name) {
    try {
      const matchingGuest = guests.find((g) =>
        g.name.toLowerCase().startsWith(name.toLowerCase())
      );
      if (matchingGuest) {
        guests = [matchingGuest];
      } else {
        throw new Error(`No guest found with name starting with '${name}'.`);
      }
    } catch (e) {
      Utils.error(e);
    }
  } else if (!all) {
    guests = guests.slice(TEST_NUMBER, TEST_NUMBER + 1);
  } else {
    guests = guests.filter((g) => g.invited && g.confirmStatus === 'awaiting');
  }

  const promises = guests.map((guest) => {
    const outputFile = `${Paths.OUTPUT_DIR}/html/${guest.name}.html`;
    return createHTMLPage(Paths.TEMPLATE_FILE, outputFile, guest);
  });
  await Promise.all(promises);
}

/**
 * Generates the PDF files from each of the guest HTML files.
 * @param refreshCache Indicates whether the data cache should be refreshed.
 */
async function generatePDFFiles(): Promise<void> {
  fs.ensureDirSync(`${Paths.OUTPUT_DIR}/pdf`);
  console.info('Generating PDF files...');

  browser = await puppeteer.launch();
  exiftool = new ExifTool();
  imageServer = app.listen(3000);

  const filenames = fs.readdirSync(`${Paths.OUTPUT_DIR}/html`);
  const pageCount = fs.readdirSync(`${Paths.TEMPLATES_DIR}/pages`).length;
  const promises = filenames.map((filename) => {
    const [name] = filename.split('.');
    const html = Utils.readFileContent(`${Paths.OUTPUT_DIR}/html/${name}.html`);
    return createPDFPage(html, name, pageCount);
  });

  await Promise.all(promises);
  await browser.close();
  await exiftool.end();
  imageServer.close();
}

/**
 * Helper function for generating HTML pages.
 * @param templateFile The input template EJS file.
 * @param outputFile The HTML file output path.
 * @param guest The guest whose details will go on the invite.
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
      cssFile: Paths.STYLES_OUTPUT_FILE,
      guest,
      lists: {
        guest: PUBLIC_LISTS_URL,
        wish: WISHLIST_URL
      }
    });
    await fs.outputFile(outputFile, html);
  } catch (err) {
    Utils.error(err);
  }
}

/**
 * Creates a single PDF file for a guest from the HTML file.
 * @param html The HTML string to be used for generating the PDF.
 * @param name The name of the guest.
 * @param pageCount The number of pages to print..
 */
async function createPDFPage(
  html: string,
  name: string,
  pageCount: number
): Promise<void> {
  const outputPath = `${Paths.OUTPUT_DIR}/pdf/#Z25 Invitation to ${name}.pdf`;
  try {
    const page = await browser.newPage();
    await page.goto(`data:text/html,${encodeURIComponent(html)}`);
    await page.addStyleTag({ url: Paths.FONTS_URL });
    await page.addStyleTag({ path: Paths.STYLES_OUTPUT_FILE });
    await page.evaluateHandle('document.fonts.ready');
    await page.pdf({
      format: 'a4',
      path: outputPath,
      pageRanges: `1-${pageCount}`,
      printBackground: true
    });
    await exiftool.write(outputPath, { Title: `Invite to ${name}` }, [
      '-overwrite_original'
    ]);
  } catch (err) {
    Utils.error(err);
  }
}

interface GenerateOptions extends Partial<GenerateHTMLOptions> {
  withPdf?: boolean;
}

interface GenerateHTMLOptions {
  all?: boolean;
  name?: string;
  refreshCache: boolean;
}
