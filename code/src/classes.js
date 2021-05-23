class Guest {
  name = '';
  invitability = 0;
}

class GuestRecord {
  Name = '';
  Invitability = '';

  constructor() {}

  /**
   * Retrieve the numeric invitability value.
   * @param {GuestRecord} record The guest record.
   * @returns The invitability value.
   */
  static getInvitValue(record) {
    return INVITABILITY[record['Invitability']];
  }
}

module.exports = {
  Guest,
  GuestRecord,
};

const INVITABILITY = {
  'A - Very High': 1,
  'B - High': 2,
  'C - Medium': 3,
  'D - Low': 4,
  'E - Very Low': 5,
};
