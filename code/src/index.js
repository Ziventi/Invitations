require('dotenv').config();

const ejs = require('ejs');
const slugify = require('slugify');

const fs = require('fs');
const path = require('path');

const { Guest, GuestRecord } = require('./classes');
const { DOCUMENT, OUTPUT_DIR } = require('./config');
const { clean, exit } = require('./utils');

(async () => {
  const guests = await retrieveGuestList();
  generateHTMLFiles(guests);
})();

/**
 * Retrieves the full guest list.
 * @returns
 */
async function retrieveGuestList() {
  clean();

  await DOCUMENT.loadInfo();
  const [sheet] = DOCUMENT.sheetsByIndex;
  const records = await sheet.getRows();
  return records;
}

/**
 * Generates the HTML files for each member on the guest list from the
 * template.
 * @param {GuestRecord[]} records The guests on the list.
 */
function generateHTMLFiles(records) {
  records.slice(0, 1).some((record) => {
    const guest = new Guest();
    guest.name = record['Name'];
    guest.invitability = GuestRecord.getInvitValue(record);

    if (guest.invitability > 1) return true;

    const templateFile = path.resolve(__dirname, './styling/template.ejs');
    // guest.name = slugify(guest.name, { lower: true });
    const outputFile = OUTPUT_DIR + `/${guest.name}.html`;

    fs.readFile(templateFile, 'utf8', (err, data) => {
      const template = ejs.compile(data);
      const html = template({ guest });
      fs.writeFile(outputFile, html, exit);
    });
  });
}
