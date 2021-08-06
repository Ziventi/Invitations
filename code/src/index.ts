import ejs from 'ejs';
import fs from 'fs-extra';
import puppeteer from 'puppeteer';

import path from 'path';

import { Guest, GuestRecord } from './classes';
import { DOCUMENT, OUTPUT_DIR } from './config';
import { clean, exit } from './utils';

const TEMPLATE_FILE = path.resolve(__dirname, './assets/template.ejs');

(async () => {
  await generateHTMLFiles();
  await generatePDFFiles();
})();

/**
 * Retrieves the full guest list.
 * @returns
 */
async function retrieveGuestList() {
  await DOCUMENT.loadInfo();
  const [sheet] = DOCUMENT.sheetsByIndex;
  const records = await sheet.getRows();
  return records;
}

/**
 * Generates the HTML files for each member on the guest list from the
 * template.
 */
async function generateHTMLFiles() {
  clean();
  fs.ensureDirSync(`${OUTPUT_DIR}/html`);

  const records = <GuestRecord[]>await retrieveGuestList();

  const promises = records.slice(0, 1).map((record) => {
    const guest = new Guest();
    guest.name = record['Name'];
    guest.invitability = GuestRecord.getInviteValue(record);
    return generateHTML(guest);
  });

  return Promise.all(promises);
}

async function generatePDFFiles() {
  fs.ensureDirSync(`${OUTPUT_DIR}/pdf`);
  const filenames = fs.readdirSync(`${OUTPUT_DIR}/html`);

  const promises = filenames.map((filename) => {
    const [name] = filename.split('.');
    const html = fs.readFileSync(`${OUTPUT_DIR}/html/${name}.html`, {
      encoding: 'utf8'
    });
    return generatePDF(html, name);
  });

  return Promise.all(promises);
}

async function generateHTML(guest: Guest) {
  return Promise.resolve()
    .then(() => fs.readFile(TEMPLATE_FILE, 'utf8'))
    .then((data) => {
      const template = ejs.compile(data);
      const html = template({ guest });
      const outputFile = `${OUTPUT_DIR}/html/${guest.name}.html`;
      return fs.outputFile(outputFile, html);
    })
    .catch(exit);
}

async function generatePDF(html: string, name: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html);
  await page.emulateMediaType('screen');
  await page.pdf({
    format: 'a4',
    path: `${OUTPUT_DIR}/pdf/${name}.pdf`,
    printBackground: true
  });
  return browser.close();
}
