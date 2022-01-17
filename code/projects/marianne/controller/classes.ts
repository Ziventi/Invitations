import type Ziventi from '@ziventi/utils';

export class Guest implements Ziventi.TGuest {
  name!: string;
  category?: Category;
  from?: string;
  round?: number;
  wlid?: string;
  status!: ConfirmStatus;
}

export class GuestRow implements Ziventi.TGuestRow {
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
  C: 3,
};

export type Category = 'Friends' | 'Family';
export type ConfirmStatus =
  | 'Awaiting'
  | 'Tentative'
  | 'Confirmed'
  | 'Unavailable';
