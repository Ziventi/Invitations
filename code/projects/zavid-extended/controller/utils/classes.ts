import type { TGuest, TGuestRow, ConfirmStatus } from '@ziventi/utils';

export class Guest implements TGuest {
  name!: string;
  status!: ConfirmStatus;
  rank!: typeof Rank[string];
  origin!: string;
  invited!: boolean;
  wlid!: string;
  tagline?: string;
}

export class GuestRow implements TGuestRow {
  Name!: string;
  Rank!: string;
  Origin!: string;
  Invited!: string;
  Status!: string;
  WLID!: string;
  Tagline?: string;
}

export const Rank: Record<string, number> = {
  S: 0,
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6
};
