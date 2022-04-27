import type { Response } from 'express';
import type {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import type NodeCache from 'node-cache';
import invariant from 'tiny-invariant';

import type { HashParams } from '../types';

import Log4JS from './logger';
import * as Spreadsheet from './spreadsheet';

/** The logger for the production server. */
export const logger = Log4JS.getLogger('server');

/**
 * Retrieves a Google worksheet from the specified spreadsheet ID defined in the
 * payload hash.
 * @param cache The cache for the payload.
 * @param payload The hash payload.
 * @returns The matching worksheet.
 */
export async function retrievePublicWorksheet(
  cache: NodeCache,
  payload: HashParams,
): Promise<GoogleSpreadsheetWorksheet> {
  const { publicSpreadsheetId, sheetTitle } = payload;

  logger.trace(`Loading public spreadsheet...`);
  let publicSpreadsheet;
  if (cache.has(publicSpreadsheetId)) {
    publicSpreadsheet = cache.get<GoogleSpreadsheet>(publicSpreadsheetId);
  } else {
    publicSpreadsheet = await Spreadsheet.getSpreadsheet(publicSpreadsheetId);
  }
  invariant(
    publicSpreadsheet,
    'No spreadsheet found with specified spreadsheet ID.',
  );
  cache.set(publicSpreadsheetId, publicSpreadsheet);

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
  guestName: string,
): Promise<GoogleSpreadsheetRow> {
  // TODO: Cache rows
  const sheetRows = await sheet.getRows();
  const matchingRow = sheetRows.find((row) => row['Name'] === guestName);
  invariant(
    matchingRow,
    `No row found with 'Name' column matching '${guestName}'.`,
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
