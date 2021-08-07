import ejs from 'ejs';
import fs from 'fs-extra';
import type { GoogleSpreadsheetRow } from 'google-spreadsheet';
import PDFMerger from 'pdf-merger-js';
import puppeteer from 'puppeteer';

import path from 'path';

import { Guest, GuestRecord } from './classes';
import { DOCUMENT, OUTPUT_DIR } from './config';
import { clean, logErrorAndExit } from './utils';

const ASSETS_DIR = path.resolve(__dirname, './assets');
const INFO_HTML = `${ASSETS_DIR}/info.html`;
const INFO_PDF = `${OUTPUT_DIR}/info.pdf`;
const TEMPLATE_FILE = `${ASSETS_DIR}/template.ejs`;

(async () => {
  clean();
  fs.ensureDirSync(OUTPUT_DIR);

  await Promise.all([generateHTMLFiles(), createInfoPage()]);
  await generatePDFFiles();
})();

/**
 * Generates the HTML files for each member on the guest list from the template.
 * @returns A promise fulfilled when all HTML files have been generated.
 */
async function generateHTMLFiles(): Promise<Array<void>> {
  const records = <GuestRecord[]>await loadGuestList();
  const promises = records.slice(0, 1).map((record) => {
    const guest = new Guest();
    guest.name = record['Name'];
    guest.invitability = GuestRecord.getInviteValue(record);
    return createGuestHTML(guest);
  });

  return Promise.all(promises);
}

/**
 * Generates the PDF files from each of the guest HTML files.
 * @returns A promise fulfilled when all PDF files have been generated.
 */
function generatePDFFiles(): Promise<Array<void>> {
  fs.ensureDirSync(`${OUTPUT_DIR}/pdf`);

  const filenames = fs.readdirSync(`${OUTPUT_DIR}/html`);
  const promises = filenames.map((filename) => {
    const [name] = filename.split('.');
    const html = loadHTML(`${OUTPUT_DIR}/html/${name}.html`);
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
  try {
    const data = await fs.readFile(TEMPLATE_FILE, 'utf8');
    const template = ejs.compile(data);
    const html = template({ guest });
    const outputFile = `${OUTPUT_DIR}/html/${guest.name}.html`;
    return await fs.outputFile(outputFile, html);
  } catch (err) {
    return logErrorAndExit(err);
  }
}

/**
 * Creates a single PDF file for a guest from the HTML file.
 * @param html The HTML string to be used for generating the PDF.
 * @param name The name of the guest.
 * @returns A promise fulfilled when the PDF file is created.
 */
async function createGuestPDFPage(html: string, name: string): Promise<void> {
  const path = `${OUTPUT_DIR}/pdf/${name}.pdf`;
  await createPDFPage(html, path);
  return mergePDFs(path);
}

/**
 * Creates a single PDF for the second information page.
 * @returns A promise fulfilled when the PDF file is created.
 */
async function createInfoPage() {
  const html = loadHTML(INFO_HTML);
  return createPDFPage(html, INFO_PDF);
}

/**
 * Merges a specified guest PDF page and the information page.
 * @param pdf The PDF for the page.
 * @returns A promise fulfilled when the PDF files have been merged.
 */
async function mergePDFs(pdf: string) {
  const merger = new PDFMerger();
  merger.add(pdf);
  merger.add(INFO_PDF);
  return await merger.save(pdf);
}

/**
 * Helper function for creating PDF pages.
 * @param html The HTML content to be used for the page.
 * @param outputPath The path to which the PDF will be saved.
 * @returns A promise fulfilled when the PDF page is created.
 */
async function createPDFPage(html: string, outputPath: string) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html);
    await page.emulateMediaType('screen');
    await page.pdf({
      format: 'a4',
      path: outputPath,
      printBackground: true
    });
    return await browser.close();
  } catch (err) {
    return logErrorAndExit(err);
  }
}

/**
 * Retrieves the full guest list.
 * @returns A promise which resolves to the list of guest records.
 */
async function loadGuestList(): Promise<Array<GoogleSpreadsheetRow>> {
  await DOCUMENT.loadInfo();
  const [sheet] = DOCUMENT.sheetsByIndex;
  return await sheet.getRows();
}

/**
 * Reads the HTML from a specified file.
 * @param file The HTML file path to read from.
 * @returns The HTML content as a string.
 */
function loadHTML(file: string) {
  const html = fs.readFileSync(file, { encoding: 'utf8' });
  return html;
}
