const dotenv = require('dotenv');
const ejs = require('ejs');
const fs = require('fs');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const path = require('path');
const rimraf = require('rimraf');
const slugify = require('slugify');

dotenv.config();

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
doc.useApiKey(process.env.GOOGLE_API_KEY);

(async () => {
  await retrieveGuestList();
})();

/**
 * Retrieves the full guest
 */
async function retrieveGuestList() {
  clean();

  await doc.loadInfo();
  const [sheet] = doc.sheetsByIndex;
  const rows = await sheet.getRows();

  rows.forEach((row) => {
    const name = row['Name'];
    const invitability = row['Invitability'];
    generateHTMLFiles({ name, invitability });
  });
}

/**
 * Generates the HTML files for each member on the guest list from the template.
 * @param {string} member.name The full name of the member.
 * @param {string} member.invitability The rank of invitability.
 */
function generateHTMLFiles({ name, invitability }) {
  const templateFile = path.resolve(__dirname, './index.ejs');
  // name = slugify(name, { lower: true });
  const outputFile = path.resolve(__dirname, `./output/${name}.html`);

  fs.readFile(templateFile, 'utf8', (err, data) => {
    const template = ejs.compile(data);
    const html = template({ value: name });

    fs.writeFile(outputFile, html, (err) => {
      if (err) console.error(err);
    });
  });
}

/**
 * Cleans the output directory.
 */
function clean() {
  rimraf(path.resolve(__dirname, './output/*'), (err) => {
    if (err) console.error(err);
  });
}
