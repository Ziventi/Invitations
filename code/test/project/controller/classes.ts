import type Ziventi from '@ziventi/utils';

export class Guest implements Ziventi.TGuest {
  public name!: string;
  public status!: Ziventi.ConfirmStatus;
  public hashes!: Ziventi.GuestHashes;
  public rank!: typeof Rank[string];
  public origin!: string;
  public invited!: boolean;
  public wlid!: string;
  public tagline?: string;
}

export class GuestRow implements Ziventi.TGuestRow {
  public Name!: string;
  public Rank!: string;
  public Origin!: string;
  public Invited!: string;
  public Status!: string;
  public WLID!: string;
  public Tagline?: string;
}

export const Rank: Record<string, number> = {
  S: 0,
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
};
