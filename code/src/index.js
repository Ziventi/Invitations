const dotenv = require('dotenv');
const ejs = require('ejs');
const fs = require('fs');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const path = require('path');
const rimraf = require('rimraf');
const slugify = require('slugify');

dotenv.config({ path: path.resolve(__dirname, './.env') });

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
doc.useApiKey(process.env.GOOGLE_API_KEY);

const INVITABILITY = {
  'A - Very High': 1,
  'B - High': 2,
  'C - Medium': 3,
  'D - Low': 4,
  'E - Very Low': 5,
};
const OUTPUT_DIR = path.resolve(__dirname, `./output`);

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

  rows.slice(0, 1).some((row) => {
    const name = row['Name'];
    const invitability = INVITABILITY[row['Invitability']];

    if (invitability > 1) return true;
    generateHTMLFiles({ name, invitability });
  });
}

/**
 * Generates the HTML files for each member on the guest list from the template.
 * @param {string} member.name The full name of the member.
 * @param {number} member.invitability The rank of invitability.
 */
function generateHTMLFiles({ name, invitability }) {
  const templateFile = path.resolve(__dirname, './template.ejs');
  // name = slugify(name, { lower: true });
  const outputFile = OUTPUT_DIR + `/${name}.html`;

  fs.readFile(templateFile, 'utf8', (err, data) => {
    const template = ejs.compile(data);
    const html = template({ invitee: { name, invitability } });
    fs.writeFile(outputFile, html, logError);
  });
}

/**
 * Cleans the output directory.
 */
function clean() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  rimraf(OUTPUT_DIR + '/*', logError);
}

function logError(err) {
  if (err) {
    console.error(err);
    process.exit(0);
  }
}
