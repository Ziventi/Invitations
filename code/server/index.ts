import { Emojis, HashParams, logger, Spreadsheet, Utils } from '@ziventi/utils';
import express from 'express';
import invariant from 'tiny-invariant';

const app = express();
const port = 3000;

app.get('/api/:hash', async (req, res) => {
  const { hash } = req.params;

  try {
    const json = Utils.decryptJSON<HashParams>(hash);
    const { guestName, status, spreadsheetId, sheetTitle } = json;

    logger.trace(`Loading public spreadsheet...`);
    const publicSpreadsheet = await Spreadsheet.getSpreadsheet(spreadsheetId);
    invariant(
      publicSpreadsheet,
      'No spreadsheet found with specified spreadsheet ID.'
    );
    const publicSheet = publicSpreadsheet.sheetsByTitle[sheetTitle];
    invariant(publicSheet, `No sheet found matching title '${sheetTitle}'.`);

    const publicSheetRows = await publicSheet.getRows();
    const matchingRow = publicSheetRows.find(
      (row) => row['Name'] === guestName
    );
    invariant(
      matchingRow,
      `No row found with 'Name' column matching '${guestName}'.`
    );

    logger.trace(`Loading cell to edit...`);
    const cellToEdit = `B${matchingRow.rowIndex}`;
    await publicSheet.loadCells(cellToEdit);

    logger.trace(`Editing cell...`);
    const cell = publicSheet.getCellByA1(cellToEdit);
    cell.value = Emojis.getStatusText(status);
    await publicSheet.saveUpdatedCells();
    logger.info(`Updated guest '${guestName}' with status '${status}'.`);

    if (isProduction()) {
      const sheetUrl = Spreadsheet.getSpreadsheetUrl(spreadsheetId);
      return res.redirect(sheetUrl);
    } else {
      return res.status(200).send({ message: 'ok' });
    }
  } catch (e) {
    logger.error(e);
    res.status(400).send({ message: e });
  }
});

app.listen(port, () => {
  console.info(`Listening at http://localhost:${port}`);
});

/**
 * Checks if service is running in production.
 * @returns True if in production.
 */
function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
