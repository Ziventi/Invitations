import {
  ConfirmStatus,
  Emojis,
  logger,
  Spreadsheet,
  Utils
} from '@ziventi/utils';
import express from 'express';

import path from 'path';

const app = express();
const port = 3000;

if (!isProduction()) {
  app.use('/', express.static(__dirname));
  app.use(express.json());

  app.get('/', (_, res) => {
    res.sendFile(path.resolve(__dirname, './test/index.html'));
  });

  app.post('/api/raw', (req, res) => {
    const { json } = req.body;
    const hash = Utils.encryptJSON(json);
    res.redirect(`/api/${hash}`);
  });
}

app.get('/api/:hash', async (req, res) => {
  const { hash } = req.params;

  try {
    const json = Utils.decryptJSON<HashParams>(hash);
    logger.debug(json);

    const { guestName, status, spreadsheetId, sheetTitle } = json;

    logger.trace(`Loading public spreadsheet...`);
    const publicSpreadsheet = await Spreadsheet.getSpreadsheet(spreadsheetId);
    const publicSheet = publicSpreadsheet.sheetsByTitle[sheetTitle];
    const publicSheetRows = await publicSheet.getRows();
    const { rowIndex } = publicSheetRows.find(
      (row) => row['Name'] === guestName
    )!;

    logger.trace(`Loading cell to edit...`);
    const cellToEdit = `B${rowIndex}`;
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
      return res.sendStatus(200);
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

interface HashParams {
  guestName: string;
  status: ConfirmStatus;
  spreadsheetId: string;
  sheetTitle: string;
}
