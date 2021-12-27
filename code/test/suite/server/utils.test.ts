import { HashParams, Utils } from '@ziventi/utils';

describe('Utils', () => {
  test('Encryption / Decryption', () => {
    const expectedParams: HashParams = {
      guestName: 'Aruna Jalloh',
      status: 'Confirmed',
      sheetTitle: 'Guests',
      spreadsheetId: '123xyz'
    };

    const hash = Utils.encryptJSON(expectedParams);
    const actualParams = Utils.decryptJSON<HashParams>(hash);

    expect(actualParams).toMatchObject(expectedParams);
  });

  test('Font Urls', () => {
    const expectedUrl =
      'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins%3Awght%40400%3B700&display=swap';
    const actualUrl = Utils.buildFontUrl({
      'Great Vibes': null,
      Poppins: 'wght@400;700'
    });

    expect(actualUrl).toBe(expectedUrl);
  });
});
