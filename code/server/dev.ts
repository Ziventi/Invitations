import Ziventi, { Server, Utils } from '@ziventi/utils/src/production';
import type { Express } from 'express';
import NodeCache from 'node-cache';

export default function addDevEndpoints(app: Express, cache: NodeCache): void {
  app.get('/api/test/:hash', async (req, res) => {
    try {
      const { hash } = req.params;
      const payload = Utils.decryptJSON<Ziventi.HashParams>(hash);

      const publicSheet = await Server.retrievePublicWorksheet(cache, payload);
      await Server.retrieveRowMatchingGuest(publicSheet, payload.guestName);

      res.status(200).send({ message: 'ok' });
    } catch (err) {
      Server.handleError(err, res);
    }
  });
}
