import * as dotenv from 'dotenv';
import fs from 'fs-extra';

import { Guest, GuestRecord, Rank } from './classes';
import { OUTPUT_DIR } from './paths';
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
    let records: GuestRecord[] = [];

    try {
      const spreadsheet = await getSpreadsheet(
        process.env.SS_PRIVATE_GUESTLIST_ID!
      );
      const [sheet] = spreadsheet.sheetsByIndex;
      records = <GuestRecord[]>await sheet.getRows();
    } catch (err) {
      error(err);
    }

    const guests = records.map((record) => {
      const guest = new Guest();
      guest.name = record['Name'];
      guest.rank = Rank[record['Rank']];
      guest.origin = record['Origin'];
      guest.confirmed = !!record['Confirmed'];

      const tagline = record['Tagline'];
      if (tagline) {
        guest.tagline = tagline.substr(0, 1).toLowerCase() + tagline.substr(1);
      }

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
  return `https://docs.google.com/spreadsheets/d/${spreadsheetID}/edit`;
}

/**
 * Cleans the output directory.
 */
export function clean() {
  fs.removeSync(OUTPUT_DIR);
}

/**
 * Catch error, log to console and exit process.
 * @param err The caught error.
 */
export function error(err: NodeJS.ErrnoException | null) {
  if (err) {
    console.error(err.message);
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
  fs.ensureDirSync(OUTPUT_DIR);
}

/**
 * Stop and display execution timer.
 */
export function tearDown() {
  console.timeEnd('Time');
}
