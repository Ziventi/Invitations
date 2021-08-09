import { GoogleSpreadsheetRow } from 'google-spreadsheet';

export class Guest {
  name = '';
  rank = 0;
  tagline = '';
}

export class GuestRecord extends GoogleSpreadsheetRow {
  Name = '';
  Rank = '';
  Tagline = '';

  /**
   * Retrieve the numeric invitability value.
   * @param record The guest record.
   * @returns The invitability value.
   */
  static getRank(record: GuestRecord): number {
    return Rank[record['Rank']];
  }
}

const Rank: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6
};
