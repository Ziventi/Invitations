import * as dotenv from 'dotenv';
import ejs from 'ejs';
import { ExifTool } from 'exiftool-vendored';
import express from 'express';
import fs from 'fs-extra';
import sass from 'node-sass';
import puppeteer, { Browser } from 'puppeteer';

import { Server } from 'http';
import path from 'path';

import { Guest } from '../utils/classes';
import * as Utils from '../utils/functions';
import * as Paths from '../utils/paths';

dotenv.config();

const app = express();
const {
  NUMBER_BOLA,
  NUMBER_CHIDERA,
  NUMBER_DEBORAH,
  SS_PUBLIC_LISTS_ID,
  SS_WISHLIST_SHEET_ID
} = process.env;

app.use(express.static(Paths.IMAGES_DIR));

const PUBLIC_LISTS_URL = Utils.getSpreadsheetUrl(SS_PUBLIC_LISTS_ID!);
const WISHLIST_URL = `${PUBLIC_LISTS_URL}#gid=${SS_WISHLIST_SHEET_ID!}`;

let browser: Browser;
let exiftool: ExifTool;
let imageServer: Server;

const resources: Record<string, unknown> = {};

(async () => {
  const menu = await import(`${Paths.RESOURCES_DIR}/menu.json`);
  const notices = await import(`${Paths.RESOURCES_DIR}/notices.json`);
  resources.menu = menu.default;
  resources.notices = notices.default;
})();

/**
 * Generates the invitation files.
 * @param options The options supplied via the CLI.
 */
export default async function generate(options: GenerateOptions) {
  const { refresh, withPdf } = options;
  const refreshCache = refresh || !fs.existsSync(Paths.CACHED_DATA);

  Utils.setup();
  transpileSass();
  await generateHTMLFiles(refreshCache);
  if (withPdf) {
    await generatePDFFiles();
  }
  Utils.tearDown();
}

/**
 * Transpiles the SCSS files to CSS.
 */
function transpileSass() {
  console.info('Transpiling SCSS to CSS...');
  fs.ensureDirSync(`${Paths.STYLES_DIR}/css`);
  const output = sass.renderSync({
    file: Paths.STYLES_INPUT_FILE,
    sourceMap: false
  });
  fs.writeFileSync(Paths.STYLES_OUTPUT_FILE, output.css);
}

/**
 * Generates the HTML files for each member on the guest list from the template.
 * @param refreshCache Indicates whether the data cache should be refreshed.
 * @returns A promise fulfilled when all HTML files have been generated.
 */
async function generateHTMLFiles(refreshCache: boolean): Promise<void> {
  console.info('Generating HTML files...');
  const TEST_NUMBER = 17;

  const guests = await Utils.loadGuestList(refreshCache);
  const promises = guests.slice(TEST_NUMBER, TEST_NUMBER + 1).map((guest) => {
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
  const promises = filenames.map((filename) => {
    const [name] = filename.split('.');
    const html = Utils.readFileContent(`${Paths.OUTPUT_DIR}/html/${name}.html`);
    return createPDFPage(html, name);
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
    const template = ejs.compile(data, { root: Paths.TEMPLATES_DIR });

    const html = template({
      contacts: {
        Bola: NUMBER_BOLA,
        Chidera: NUMBER_CHIDERA,
        Deborah: NUMBER_DEBORAH
      },
      cssFile: Paths.STYLES_OUTPUT_FILE,
      guest,
      hostname: 'http://localhost:3000',
      imagesDir: Paths.IMAGES_DIR,
      resources,
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
 */
async function createPDFPage(html: string, name: string): Promise<void> {
  const outputPath = `${Paths.OUTPUT_DIR}/pdf/${name}.pdf`;
  try {
    const page = await browser.newPage();
    await page.goto(`data:text/html,${encodeURIComponent(html)}`);
    await page.addStyleTag({ url: Paths.FONTS_URL });
    await page.addStyleTag({ path: Paths.STYLES_OUTPUT_FILE });
    await page.evaluateHandle('document.fonts.ready');
    await page.pdf({
      format: 'a4',
      path: outputPath,
      printBackground: true
    });
    await exiftool.write(outputPath, { Title: `Invite to ${name}` }, [
      '-overwrite_original'
    ]);
  } catch (err) {
    Utils.error(err);
  }
}

type GenerateOptions = {
  refresh?: boolean;
  withPdf?: boolean;
};
