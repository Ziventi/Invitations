import Ziventi, {
  Emojis,
  logger,
  Spreadsheet,
  Utils
} from '@ziventi/utils/src/production';
import express from 'express';
import invariant from 'tiny-invariant';

const app = express();
const port = 3000;

// app.use((req, res, next) => {
//   logger.debug(req.params);
//   next();
// });

app.get('/api/:hash', async (req, res, next) => {
  try {
    const { hash } = req.params;
    const json = Utils.decryptJSON<Ziventi.HashParams>(hash);
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
  } catch (error) {
    const { message } = error as Error;
    logger.error(message);
    res.status(400).send({ message });
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
