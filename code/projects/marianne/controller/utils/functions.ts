import * as dotenv from 'dotenv';
import fs from 'fs-extra';

import {
  ConfirmStatus,
  Guest,
  GuestSpreadsheetRow,
  InviteRound,
  Category
} from './classes';
import * as Paths from './paths';
import { getSpreadsheet } from './spreadsheet';

dotenv.config();

/**
 * Retrieves the full guest list.
 * @returns A promise which resolves to the list of guest records.
 */
export async function loadGuestList(refreshCache: boolean): Promise<Guest[]> {
  if (refreshCache) {
    console.info('Refreshing cache...');
    let records: GuestSpreadsheetRow[] = [];

    try {
      const spreadsheet = await getSpreadsheet(
        process.env.SS_PRIVATE_GUESTLIST_ID!
      );
      const [sheet] = spreadsheet.sheetsByIndex;
      records = <GuestSpreadsheetRow[]>await sheet.getRows();
    } catch (err) {
      error(err);
    }

    const guests = records.map((record) => {
      const guest: Guest = {
        name: record['Name'],
        category: record['Category'] as Category,
        from: record['From'],
        round: InviteRound[record['Invite Round'] as keyof typeof InviteRound],
        wlid: record['Wishlist ID'],
        status: record['Status'] as ConfirmStatus
      };

      return guest;
    });

    fs.outputFileSync(Paths.CACHED_DATA, JSON.stringify(guests, null, 2));
  }
  const guests = readFileContent(Paths.CACHED_DATA);
  return <Guest[]>JSON.parse(guests);
}

/**
 * Retrieves the full accessible spreadsheet URL using a specified ID.
 * @param spreadsheetID The spreadsheet ID.
 * @returns The full URL of the spreadsheet.
 */
export function getSpreadsheetUrl(spreadsheetID: string) {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetID}`;
}

/**
 * Cleans the output directory.
 */
export function clean() {
  fs.removeSync(Paths.OUTPUT_DIR);
}

/**
 * Catch error, log to console and exit process.
 * @param err The caught error.
 */
export function error(err: any) {
  if (err) {
    console.error('Error: ' + err.message);
    process.exit(0);
  }
}

/**
 * Reads content from a specified file.
 * @param file The file path to read from.
 * @returns The content as a string.
 */
export function readFileContent(file: string) {
  const html = fs.readFileSync(file, { encoding: 'utf8' });
  return html;
}

/**
 * Start execution timer, clean and ensure output directory exists.
 */
export function setup() {
  console.time('Time');
  clean();
  fs.ensureDirSync(Paths.OUTPUT_DIR);
}

/**
 * Stop and display execution timer.
 */
export function tearDown() {
  console.timeEnd('Time');
}
