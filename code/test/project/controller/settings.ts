import Ziventi, { Paths, Utils, ZGenerator, ZLoader } from '@ziventi/utils';
import * as dotenv from 'dotenv';

import path from 'path';

import { Guest, GuestRow, Rank } from './classes';

const dotenvOutput = dotenv.config({
  path: path.resolve(Paths.PROJECT_ROOT, '.env')
});
Utils.checkDotenv(dotenvOutput);

const rootDir = path.resolve(__dirname, '..');

export const Loader = new ZLoader({
  spreadsheetId: process.env.TEST_SS_PRIVATE_ID!,
  guestMarshaler: marshalGuests,
  rootDir
});

export const Generator = new ZGenerator({
  fontsUrl: Utils.buildFontUrl({ Tangerine: 'wght@400;700' }),
  formatOptions: {
    archiveTitle: 'Test Project',
    nomenclator: (name: string) => name,
    pdfOptions: {
      format: 'a4'
    },
    pngOptions: {
      viewportOptions: {
        height: '11.75in',
        width: '8.25in'
      }
    }
  },
  loadingOptions: {
    loader: Loader,
    processor: (guests: Guest[]) => {
      return guests.filter((g) => g.status === 'Confirmed');
    }
  },
  rootDir
});

/**
 * Marshals records to guest objects.
 * @param records The guest spreadsheet records.
 * @returns The list of marshaled guests.
 */
function marshalGuests(records: GuestRow[]): Guest[] {
  return records.map((record) => {
    let confirmStatus: Ziventi.ConfirmStatus;

    switch (record['Status']) {
      case 'x':
        confirmStatus = 'Confirmed';
        break;
      case 'T':
        confirmStatus = 'Tentative';
        break;
      case 'D':
        confirmStatus = 'Unavailable';
        break;
      default:
        confirmStatus = 'Awaiting';
        break;
    }

    const guest = new Guest();
    guest.name = record['Name'];
    guest.rank = Rank[record['Rank']];
    guest.origin = record['Origin'];
    guest.invited = record['Invited'] === 'x';
    guest.status = confirmStatus;
    guest.wlid = record['WLID'];

    const tagline = record['Tagline'];
    if (tagline) {
      guest.tagline =
        tagline.substring(0, 1).toLowerCase() + tagline.substring(1);
    }

    // TODO: Turn to utils function.
    Ziventi.PublicConfirmStatuses.forEach((status) => {
      const params: Ziventi.HashParams = {
        guestName: guest.name,
        status,
        spreadsheetId: process.env.TEST_SS_PUBLIC_ID!,
        sheetTitle: 'Guest List'
      };
      guest.hashes = {
        ...(guest.hashes || {}),
        [status]: Utils.encryptJSON(params)
      };
    });

    return guest;
  });
}
