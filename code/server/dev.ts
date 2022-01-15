import Ziventi, { Utils } from '@ziventi/utils/src/production';
import type { Express } from 'express';

import * as Helper from './helpers';

export default function addDevEndpoints(app: Express): void {
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
