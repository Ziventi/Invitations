import type Ziventi from '@ziventi/utils';
import { Paths, Utils } from '@ziventi/utils';
import type { AxiosError } from 'axios';
import Axios from 'axios';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(Paths.PROJECT_ROOT, '.env') });

const axios = Axios.create({ baseURL: 'http://localhost:3000/api/test' });
const payload: Partial<Ziventi.HashParams> = {
  guestName: 'Aruna Jalloh',
  status: 'Confirmed',
  sheetTitle: 'Guest List',
};

describe('Server', () => {
  test('Correct payload, server responds with 200', async () => {
    payload.publicSpreadsheetId = process.env.TEST_SS_PUBLIC_ID;
    const hash = Utils.encryptJSON(payload);
    const response = await axios.get(hash);
    expect(response.status).toBe(200);
  });

  test('Bad payload, server responds with 400', async () => {
    payload.publicSpreadsheetId = '123xyz';
    const hash = Utils.encryptJSON(payload);
    try {
      await axios.get(hash);
    } catch (err) {
      expect((err as AxiosError).response?.status).toBe(400);
    }
  });
});
