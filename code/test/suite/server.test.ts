import path from 'path';

import { Paths, Utils } from '@ziventi/utils';
import Axios, { AxiosError } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(Paths.PROJECT_ROOT, '.env') });

const axios = Axios.create({ baseURL: 'http://localhost:3000/api/test' });

describe('Server', () => {
  test('Correct payload, server responds with 200', async () => {
    const hash = Utils.encryptJSON({
      guestName: 'Aruna Jalloh',
      status: 'Confirmed',
      sheetTitle: 'Guest List',
      spreadsheetId: process.env.TEST_SS_PUBLIC_ID
    });

    const response = await axios.get(hash);
    expect(response.status).toBe(200);
  });

  test('Bad payload, server responds with 400', async () => {
    const hash = Utils.encryptJSON({
      guestName: 'Aruna Jalloh',
      status: 'Confirmed',
      sheetTitle: 'Guest List',
      spreadsheetId: '123xyz'
    });

    try {
      await axios.get(hash);
    } catch (err) {
      expect((err as AxiosError).response?.status).toBe(400);
    }
  });
});
