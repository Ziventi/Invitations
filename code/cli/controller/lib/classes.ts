import { GoogleSpreadsheetRow } from 'google-spreadsheet';

export class Guest {
  name = '';
  rank = 0;
  tagline = '';
  origin = '';
  confirmed = false;
  wlid = ''
}

export class GuestRecord extends GoogleSpreadsheetRow {
  Name = '';
  Rank = '';
  Tagline = '';
  Origin = '';
  Confirmed = false;
  WLID = '';
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
