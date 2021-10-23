import { GoogleSpreadsheet } from 'google-spreadsheet';

import * as Paths from './paths';

let spreadsheet: GoogleSpreadsheet;

/**
 * Retrieves the Google spreadsheet instance.
 * @param spreadsheetId The Google Sheets spreadsheet ID.
 * @returns The spreadsheet instance
 */
export async function getSpreadsheet(spreadsheetId: string) {
  if (spreadsheet && spreadsheet.spreadsheetId === spreadsheetId) {
    return spreadsheet;
  }

  const credentials = await import(Paths.KEY_JSON);
  spreadsheet = new GoogleSpreadsheet(spreadsheetId);
  await spreadsheet.useServiceAccountAuth(credentials);
  await spreadsheet.loadInfo();
  return spreadsheet;
}
