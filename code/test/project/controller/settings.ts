import { ConfirmStatus, ZLoader } from '@ziventi/utils';
import * as dotenv from 'dotenv';

import path from 'path';

import { Guest, GuestRow, Rank } from './classes';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const rootDir = path.resolve(__dirname, '..');

export const Loader = new ZLoader({
  spreadsheetId: process.env.SS_PRIVATE_ID!,
  guestMarshaler: marshalGuests,
  rootDir
});

/**
 * Marshals records to guest objects.
 * @param records The guest spreadsheet records.
 * @returns The list of marshaled guests.
 */
function marshalGuests(records: GuestRow[]): Guest[] {
  return records.map((record) => {
    let confirmStatus: ConfirmStatus;

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
      guest.tagline = tagline.substr(0, 1).toLowerCase() + tagline.substr(1);
    }

    return guest;
  });
}
