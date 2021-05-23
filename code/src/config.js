const { GoogleSpreadsheet } = require('google-spreadsheet');

const path = require('path');

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
doc.useApiKey(process.env.GOOGLE_API_KEY);

module.exports = {
  DOCUMENT: doc,
  OUTPUT_DIR: path.resolve(__dirname, `../dist`),
};
