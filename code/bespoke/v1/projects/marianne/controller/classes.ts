import type Ziventi from '@ziventi/utils';

export class Guest implements Ziventi.TGuest {
  public name!: string;
  public category?: Category;
  public from?: string;
  public round?: number;
  public wlid?: string;
  public status!: ConfirmStatus;
}

export class GuestRow implements Ziventi.TGuestRow {
  public 'Name'!: string;
  public 'Category'!: string;
  public 'From'!: string;
  public 'Invite Round'!: string;
  public 'Wishlist ID'!: string;
  public 'Status'!: string;
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
