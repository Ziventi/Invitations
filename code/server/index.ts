import Ziventi, {
  Emojis,
  Spreadsheet,
  Utils
} from '@ziventi/utils/src/production';
import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

import * as Helper from './helpers';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const { logger } = Helper;

app.set('trust proxy', 1);

if (Helper.isProduction()) {
  app.use(
    '/api',
    rateLimit({
      legacyHeaders: false,
      message: 'Too many requests, please try again later.',
      max: 15,
      standardHeaders: true,
      windowMs: 5 * 60 * 1000
    })
  );
}

app.get('/api/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const payload = Utils.decryptJSON<Ziventi.HashParams>(hash);
    const { guestName, status, spreadsheetId } = payload;

    const publicSheet = await Helper.retrievePublicWorksheet(payload);
    const matchingRow = await Helper.retrieveRowMatchingGuest(
      publicSheet,
      guestName
    );

    logger.trace(`Loading cell to edit...`);
    const cellToEdit = `B${matchingRow.rowIndex}`;
    await publicSheet.loadCells(cellToEdit);

    logger.trace(`Editing cell...`);
    const cell = publicSheet.getCellByA1(cellToEdit);
    cell.value = Emojis.getStatusText(status);
    await publicSheet.saveUpdatedCells();
    logger.info(`Updated guest '${guestName}' with status '${status}'.`);

    if (Helper.isProduction()) {
      const sheetUrl = Spreadsheet.getSpreadsheetUrl(spreadsheetId);
      res.redirect(sheetUrl);
    } else {
      res.status(200).send({ message: 'ok' });
    }
  } catch (err) {
    Helper.handleError(err, res);
  }
});

if (!Helper.isProduction()) {
  app.get('/api/test/:hash', async (req, res) => {
    try {
      const { hash } = req.params;
      const payload = Utils.decryptJSON<Ziventi.HashParams>(hash);

      const publicSheet = await Helper.retrievePublicWorksheet(payload);
      await Helper.retrieveRowMatchingGuest(publicSheet, payload.guestName);

      res.status(200).send({ message: 'ok' });
    } catch (err) {
      Helper.handleError(err, res);
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _: Request, res: Response, __: NextFunction) => {
  Helper.handleError(err, res);
});

app.listen(port, () => {
  console.info(`Listening at http://localhost:${port}`);
});
