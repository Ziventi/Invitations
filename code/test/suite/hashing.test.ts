import type Ziventi from '@ziventi/utils';
import { Paths, Server, Utils } from '@ziventi/utils';
import * as dotenv from 'dotenv';
import type { GoogleSpreadsheetRow } from 'google-spreadsheet';
import NodeCache from 'node-cache';
import path from 'path';

dotenv.config({ path: path.resolve(Paths.PROJECT_ROOT, '.env') });

const cache = new NodeCache({
  checkperiod: 30,
  deleteOnExpire: true,
  stdTTL: 30,
});
const payload: Partial<Ziventi.HashParams> = {
  guestName: 'Aruna Jalloh',
  status: 'Confirmed',
  sheetTitle: 'Guest List',
};

async function mockServerResponse(
  cache: NodeCache,
  hash: string,
): Promise<GoogleSpreadsheetRow> {
  const payload = Utils.decryptJSON<Ziventi.HashParams>(hash);
  const publicSheet = await Server.retrievePublicWorksheet(cache, payload);
  return Server.retrieveRowMatchingGuest(publicSheet, payload.guestName);
}

describe('Hashing', () => {
  test('Caching is performed', async () => {
    payload.publicSpreadsheetId = process.env.TEST_SS_PUBLIC_ID;
    const cacheGetSpy = jest.spyOn(cache, 'get');
    const cacheSetSpy = jest.spyOn(cache, 'set');

    let hash = Utils.encryptJSON(payload);
    let row = await mockServerResponse(cache, hash);
    expect(row['Name']).toBe(payload.guestName);

    payload.guestName = 'Abidemi Ajayi';

    hash = Utils.encryptJSON(payload);
    row = await mockServerResponse(cache, hash);
    expect(row['Name']).toBe(payload.guestName);

    expect(cacheGetSpy).toBeCalledTimes(1);
    expect(cacheGetSpy).toBeCalledWith(payload.publicSpreadsheetId);
    expect(cacheSetSpy).toBeCalledTimes(2);
  });
});
