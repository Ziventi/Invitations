import { GoogleSpreadsheetRow } from 'google-spreadsheet';

export class Guest {
  name!: string;
  category?: Category;
  from?: string;
  round?: number;
  wlid?: string;
  status?: ConfirmStatus;
}

export class GuestSpreadsheetRow extends GoogleSpreadsheetRow {
  Name!: string;
  Category!: string;
  From!: string;
  'Invite Round'!: string;
  'Wishlist ID'!: string;
  Status!: string;
}

export const InviteRound = {
  A: 1,
  B: 2,
  C: 3
};

export type Category = 'Friends' | 'Family';
export type ConfirmStatus =
  | 'Awaiting'
  | 'Tentative'
  | 'Confirmed'
  | 'Unavailable';
