import fs from 'fs-extra';
import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

import { Rank } from '../utils/classes';
import * as Utils from '../utils/functions';
import * as Paths from '../utils/paths';
import { getSpreadsheet } from '../utils/spreadsheet';

let sheet: GoogleSpreadsheetWorksheet;

/**
 * Updates the public spreadsheet with the currently invited and confirmed
 * guests.
 * @param options The update options.
 */
export default async function update(options: UpdateOptions) {
  const { refresh } = options;
  const refreshCache = refresh || !fs.existsSync(Paths.CACHED_DATA);

  const guests = await Utils.loadGuestList(refreshCache);
  const rows = guests
    .filter((g) => g.invited)
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .map(({ name, confirmStatus }) => {
      let status = '';
      switch (confirmStatus) {
        case 'confirmed':
          status = '\u2714 Confirmed';
          break;
        case 'tentative':
          status = '\uD83D\uDD38 Tentative';
          break;
        case 'unavailable':
          status = '\u274C Unavailable';
          break;
        case 'awaiting':
        default:
          status = '\uD83D\uDD57 Awaiting response';
          break;
      }
      return [name, status];
    });

  const spreadsheet = await getSpreadsheet(process.env.SS_PUBLIC_LISTS_ID!);
  sheet = spreadsheet.sheetsByIndex[0];
  await sheet.clear();
  await sheet.setHeaderRow(['Name', 'Status']);
  await sheet.addRows(rows);

  await updateInformation();
}

/**
 * Updates the information cells on the spreadsheet.
 */
async function updateInformation() {
  const guests = await Utils.loadGuestList(false);
  await sheet.loadCells('D3:E14');

  setCellText(
    'D3',
    'Only people who have received invites so far will appear here; this list will be updated gradually. Check back here occasionally to see people you know whom you can tag along with.'
  );
  setCellText('D9', 'Current Total of Invitees:');
  setCellText('E9', guests.filter((g) => g.invited).length.toString());
  setCellText('D10', '\u2714 No. of Confirmed:');
  setCellText(
    'E10',
    guests.filter((g) => g.invited && g.confirmStatus === 'confirmed').length.toString()
  );
  setCellText('D11', '\uD83D\uDD38 No. of Tentative:');
  setCellText(
    'E11',
    guests.filter((g) => g.invited && g.confirmStatus === 'tentative').length.toString()
  );
  setCellText('D12', '\uD83D\uDD57 No. of Awaiting:');
  setCellText(
    'E12',
    guests.filter((g) => g.invited && g.confirmStatus === 'awaiting').length.toString()
  );
  setCellText('D13', '\u274C No. of Unavailable:');
  setCellText(
    'E13',
    guests.filter((g) => g.invited && g.confirmStatus === 'unavailable').length.toString()
  );
  setCellText('D14', 'No. of Invites Remaining:');
  setCellText(
    'E14',
    guests.filter((g) => !g.invited && g.rank <= Rank.D).length.toString()
  );

  await sheet.saveUpdatedCells();
}

/**
 * Set the text of a specified spreadsheet cell.
 * @param cellId The ID of the cell.
 * @param text The text to set as the value.
 */
function setCellText(cellId: string, text: string) {
  const cell = sheet.getCellByA1(cellId);
  cell.value = text;
}

type UpdateOptions = {
  refresh?: boolean;
};
