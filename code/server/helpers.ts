import Ziventi, { Log4JS, Spreadsheet } from '@ziventi/utils/src/production';
import type { Response } from 'express';
import type {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet
} from 'google-spreadsheet';
import NodeCache from 'node-cache';
import invariant from 'tiny-invariant';

const cache = new NodeCache({
  checkperiod: 3 * 60,
  deleteOnExpire: true,
  stdTTL: 5 * 60
});

export const logger = Log4JS.getLogger('server');

/**
 * Retrieves a Google worksheet from the specified spreadsheet ID defined in the
 * payload hash.
 * @param payload The hash payload.
 * @returns The matching worksheet.
 */
export async function retrievePublicWorksheet(
  payload: Ziventi.HashParams
): Promise<GoogleSpreadsheetWorksheet> {
  const { spreadsheetId, sheetTitle } = payload;

  logger.trace(`Loading public spreadsheet...`);
  let publicSpreadsheet;
  if (cache.has(spreadsheetId)) {
    publicSpreadsheet = cache.get<GoogleSpreadsheet>(spreadsheetId);
  } else {
    publicSpreadsheet = await Spreadsheet.getSpreadsheet(spreadsheetId);
  }
  invariant(
    publicSpreadsheet,
    'No spreadsheet found with specified spreadsheet ID.'
  );
  cache.set(spreadsheetId, publicSpreadsheet);

  const publicSheet = publicSpreadsheet.sheetsByTitle[sheetTitle];
  invariant(publicSheet, `No sheet found matching title '${sheetTitle}'.`);
  return publicSheet;
}

/**
 * Retrieve the matching spreadsheet row on a worksheet containing the specified name of a guest.
 * @param sheet The Google worsksheet.
 * @param guestName The name of the guest.
 * @returns The matching row, if it exists.
 */
export async function retrieveRowMatchingGuest(
  sheet: GoogleSpreadsheetWorksheet,
  guestName: string
): Promise<GoogleSpreadsheetRow> {
  // TODO: Cache rows
  const sheetRows = await sheet.getRows();
  const matchingRow = sheetRows.find((row) => row['Name'] === guestName);
  invariant(
    matchingRow,
    `No row found with 'Name' column matching '${guestName}'.`
  );
  return matchingRow;
}

/**
 * Checks if service is running in production.
 * @returns True if in production.
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function handleError(err: any, res: Response): void {
  const { message } = err;
  logger.error(message);
  res.status(400).send({ message });
}
