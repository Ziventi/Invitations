import type Ziventi from '@ziventi/utils';
import { Emojis, Utils } from '@ziventi/utils';

import { TEST_PROJECT_ROOT } from '../constants';

describe('Utils', () => {
  test('Encrypt and decrypt hash parameters', () => {
    const expectedParams: Ziventi.HashParams = {
      guestName: 'Aruna Jalloh',
      status: 'Confirmed',
      sheetTitle: 'Guests',
      publicSpreadsheetId: '123xyz',
    };

    const hash = Utils.encryptJSON(expectedParams);
    const actualParams = Utils.decryptJSON<Ziventi.HashParams>(hash);
    expect(actualParams).toMatchObject(expectedParams);
  });

  test('Build font URLs', () => {
    const expectedUrl =
      'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins%3Awght%40400%3B700&display=swap';
    const actualUrl = Utils.buildFontUrl({
      'Great Vibes': null,
      'Poppins': 'wght@400;700',
    });
    expect(actualUrl).toBe(expectedUrl);
  });

  test('Compile resources', () => {
    const resources = Utils.compileResources(TEST_PROJECT_ROOT);
    expect(resources).toHaveProperty('agenda');
    expect(resources).toHaveProperty('notices');
  });

  test('Get emoji status text', () => {
    expect(Emojis.getStatusText('Confirmed')).toBe(
      `${Emojis.CONFIRMED}  Confirmed`,
    );
    expect(Emojis.getStatusText('Tentative')).toBe(
      `${Emojis.TENTATIVE} Tentative`,
    );
    expect(Emojis.getStatusText('Unavailable')).toBe(
      `${Emojis.UNAVAILABLE} Unavailable`,
    );
    expect(Emojis.getStatusText('Awaiting')).toBe(
      `${Emojis.AWAITING} Awaiting response`,
    );
  });
});
