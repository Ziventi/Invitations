import { HashParams, Utils } from '@ziventi/utils';

test('Encrypt', () => {
  const expectedParams: HashParams = {
    guestName: 'Aruna Jalloh',
    status: 'Confirmed',
    sheetTitle: 'Guests',
    spreadsheetId: '123xyz'
  };

  const hash = Utils.encryptJSON(expectedParams);
  const actualParams = Utils.decryptJSON<HashParams>(hash);

  expect(expectedParams).toMatchObject(actualParams);
});
