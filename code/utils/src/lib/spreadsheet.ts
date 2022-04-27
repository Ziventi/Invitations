import { GoogleSpreadsheet } from 'google-spreadsheet';

import { Paths } from './constants';

let spreadsheet: GoogleSpreadsheet;

/**
 * Retrieves the Google spreadsheet instance.
 * @param spreadsheetId The Google Sheets spreadsheet ID.
 * @returns The spreadsheet instance
 */
export async function getSpreadsheet(
  spreadsheetId: string,
): Promise<GoogleSpreadsheet> {
  if (spreadsheet && spreadsheet.spreadsheetId === spreadsheetId) {
    return spreadsheet;
  }

  const credentials = process.env.CIRCLECI
    ? JSON.parse(process.env.KEY_JSON!)
    : await import(Paths.KEY_JSON);

  spreadsheet = new GoogleSpreadsheet(spreadsheetId);
  await spreadsheet.useServiceAccountAuth(credentials);
  await spreadsheet.loadInfo();
  return spreadsheet;
}

/**
 * Retrieves the full accessible spreadsheet URL using a specified ID.
 * @param spreadsheetId The spreadsheet ID.
 * @returns The full URL of the spreadsheet.
 */
export function getSpreadsheetUrl(spreadsheetId: string): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
}
