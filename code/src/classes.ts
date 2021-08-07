import { GoogleSpreadsheetRow } from 'google-spreadsheet';

export class Guest {
  name = '';
  tagline = '';
  invitability = 0;
}

export class GuestRecord extends GoogleSpreadsheetRow {
  Name = '';
  Tagline = '';
  Invitability = '';

  /**
   * Retrieve the numeric invitability value.
   * @param record The guest record.
   * @returns The invitability value.
   */
  static getInviteValue(record: GuestRecord): number {
    return INVITABILITY[record['Invitability']];
  }
}

const INVITABILITY: Record<string, number> = {
  'A - Very High': 1,
  'B - High': 2,
  'C - Medium': 3,
  'D - Low': 4,
  'E - Very Low': 5
};
