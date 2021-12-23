import { ConfirmStatus, logger, Spreadsheet } from '@ziventi/utils';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
import express from 'express';

const app = express();
const port = 3000;

dotenv.config();

const { SS_PRIVATE_ID, SS_PUBLIC_ID } = process.env;
const ENCRYPTION_KEY = 'key';

(async () => {
  const privateSpreadsheet = await Spreadsheet.getSpreadsheet(SS_PRIVATE_ID!);
  const privateSheet = privateSpreadsheet.sheetsByTitle['Guests'];
  const privateSheetRows = await privateSheet.getRows();

  const guestName: string = privateSheetRows[0]['Name'];
  const hash = encodeURIComponent(
    CryptoJS.AES.encrypt(guestName, ENCRYPTION_KEY).toString()
  );
  logger.debug('Hash:', hash);

  const decryptedName = CryptoJS.AES.decrypt(
    decodeURIComponent(hash),
    ENCRYPTION_KEY
  ).toString(CryptoJS.enc.Utf8);
  logger.debug('Name:', decryptedName);

  const publicSpreadsheet = await Spreadsheet.getSpreadsheet(SS_PUBLIC_ID!);
  const publicSheet = publicSpreadsheet.sheetsByTitle['Guest List'];
  const publicSheetRows = await publicSheet.getRows();
  const { rowIndex } = publicSheetRows.find(
    (row) => row['Name'] === decryptedName
  )!;
  const cellToEdit = `B${rowIndex}`;
  await publicSheet.loadCells(cellToEdit);

  const status: ConfirmStatus = 'Confirmed';

  const cell = publicSheet.getCellByA1(cellToEdit);
  cell.value = status;

  await publicSheet.saveUpdatedCells();
  logger.info(`Updated guest '${decryptedName}' with status ${status}.`);
})();

app.get('/', (req, res) => {
  if (isProduction()) {
    // const sheetUrl = Spreadsheet.getSpreadsheetUrl(SS_PUBLIC_ID!);
    // res.redirect(sheetUrl);
  } else {
    res.send(
      '<body style="background-color:black;"><p style="color:white;">Yooo</p></body>'
    );
  }
});

app.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}`);
});

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
