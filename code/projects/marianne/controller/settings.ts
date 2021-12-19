import type { ConfirmStatus } from '@ziventi/utils';
import { ZLoader } from '@ziventi/utils';

import * as dotenv from 'dotenv';

import { Guest, GuestRow, InviteRound, Category } from './classes';

dotenv.config();

export const Loader = new ZLoader({
  spreadsheetId: process.env.SS_PRIVATE_GUESTLIST_ID!,
  guestMarshaler: marshalGuests
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
      status: record['Status'] as ConfirmStatus
    };

    return guest;
  });
}
