import type Ziventi from '@ziventi/utils';
import { ZLoader, Utils } from '@ziventi/utils';
import * as dotenv from 'dotenv';

import type { Category, Guest, GuestRow } from './classes';
import { InviteRound } from './classes';

const dotenvOutput = dotenv.config();
Utils.checkDotenv(dotenvOutput);

export const Loader = new ZLoader({
  spreadsheetId: process.env.SS_PRIVATE_GUESTLIST_ID!,
  guestMarshaler: marshalGuests,
});

/**
 * Marshals records to guest objects.
 * @param records The guest spreadsheet records.
 * @returns The list of marshaled guests.
 */
function marshalGuests(records: GuestRow[]): Guest[] {
  return records.map((record) => {
    const guest: Guest = {
      name: record['Name'],
      category: record['Category'] as Category,
      from: record['From'],
      round: InviteRound[record['Invite Round'] as keyof typeof InviteRound],
      wlid: record['Wishlist ID'],
      status: record['Status'] as Ziventi.ConfirmStatus,
    };

    return guest;
  });
}
