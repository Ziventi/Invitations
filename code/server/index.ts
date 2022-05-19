import type Ziventi from '@ziventi/utils/src/production';
import {
  Emojis,
  Server,
  Spreadsheet,
  Utils,
} from '@ziventi/utils/src/production';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';

import addDevEndpoints from './dev';

const app = express();
const cache = new NodeCache({
  checkperiod: 3 * 60,
  deleteOnExpire: true,
  stdTTL: 5 * 60,
});
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const { logger } = Server;

app.set('trust proxy', 1);

if (Server.isProduction()) {
  app.use(
    '/api',
    rateLimit({
      legacyHeaders: false,
      message: 'Too many requests, please try again later.',
      max: 15,
      standardHeaders: true,
      windowMs: 5 * 60 * 1000,
    }),
  );
} else {
  addDevEndpoints(app, cache);
}

app.get('/api/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const payload = Utils.decryptJSON<Ziventi.HashParams>(hash);
    const { guestName, status, publicSpreadsheetId } = payload;

    const publicSheet = await Server.retrievePublicWorksheet(cache, payload);
    const matchingRow = await Server.retrieveRowMatchingGuest(
      publicSheet,
      guestName,
    );

    logger.trace(`Loading cell to edit...`);
    const cellToEdit = `B${matchingRow.rowIndex}`;
    await publicSheet.loadCells(cellToEdit);

    logger.trace(`Editing cell...`);
    const cell = publicSheet.getCellByA1(cellToEdit);
    cell.value = Emojis.getStatusText(status);
    await publicSheet.saveUpdatedCells();
    logger.info(`Updated guest '${guestName}' with status '${status}'.`);

    if (Server.isProduction()) {
      const sheetUrl = Spreadsheet.getSpreadsheetUrl(publicSpreadsheetId);
      res.redirect(sheetUrl);
    } else {
      res.status(200).send({ message: 'ok' });
    }
  } catch (err) {
    Server.handleError(err, res);
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _: Request, res: Response, __: NextFunction) => {
  Server.handleError(err, res);
});

app.listen(port, () => {
  console.info(`Listening at http://localhost:${port}`);
});
