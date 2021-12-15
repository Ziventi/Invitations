import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

import type { TGuest } from '../../../types';
import { Spreadsheet } from '../../spreadsheet';

export class ZPublisher<G extends TGuest = TGuest> {
  sheet!: GoogleSpreadsheetWorksheet;

  /**
   * Updates the public spreadsheet with the currently invited and confirmed
   * guests.
   * @param options The update options.
   */
  async publish(guests: G[]) {
    const rows = guests.map(({ name, status }) => {
      let attendance = '';

      switch (status) {
        case 'Confirmed':
          attendance = '\u2714  Confirmed';
          break;
        case 'Tentative':
          attendance = '\uD83D\uDD38 Tentative';
          break;
        case 'Unavailable':
          attendance = '\u274C Unavailable';
          break;
        case 'Awaiting':
        default:
          attendance = '\uD83D\uDD57 Awaiting response';
          break;
      }

      return [name, attendance];
    });

    const spreadsheet = await Spreadsheet.getSpreadsheet(
      process.env.SS_PUBLIC_LISTS_ID!
    );
    this.sheet = spreadsheet.sheetsByIndex[0];
    await this.sheet.clear();
    await this.sheet.setHeaderRow(['Name', 'Attendance']);
    await this.sheet.addRows(rows);

    // await updateInformation();
  }

  /**
   * Updates the information cells on the spreadsheet.
   */
  // async function updateInformation() {
  //   const guests = await Utils.loadGuestList(false);
  //   await sheet.loadCells('D3:E14');

  //   setCellText(
  //     'D3',
  //     'Only people who have received invites so far will appear here; this list will be updated gradually. Check back here occasionally to see people you know whom you can tag along with.'
  //   );
  //   setCellText('D9', 'Current Total of Invitees:');
  //   setCellText('E9', guests.filter((g) => g.invited).length.toString());
  //   setCellText('D10', '\u2714  No. of Confirmed:');
  //   setCellText(
  //     'E10',
  //     guests
  //       .filter((g) => g.invited && g.confirmStatus === 'confirmed')
  //       .length.toString()
  //   );
  //   setCellText('D11', '\uD83D\uDD38 No. of Tentative:');
  //   setCellText(
  //     'E11',
  //     guests
  //       .filter((g) => g.invited && g.confirmStatus === 'tentative')
  //       .length.toString()
  //   );
  //   setCellText('D12', '\uD83D\uDD57 No. of Awaiting:');
  //   setCellText(
  //     'E12',
  //     guests
  //       .filter((g) => g.invited && g.confirmStatus === 'awaiting')
  //       .length.toString()
  //   );
  //   setCellText('D13', '\u274C No. of Unavailable:');
  //   setCellText(
  //     'E13',
  //     guests
  //       .filter((g) => g.invited && g.confirmStatus === 'unavailable')
  //       .length.toString()
  //   );
  //   setCellText('D14', 'No. of Invites Remaining:');
  //   setCellText(
  //     'E14',
  //     guests.filter((g) => !g.invited && g.rank <= Rank.D).length.toString()
  //   );

  //   await sheet.saveUpdatedCells();
}

// /**
//  * Set the text of a specified spreadsheet cell.
//  * @param cellId The ID of the cell.
//  * @param text The text to set as the value.
//  */
// function setCellText(cellId: string, text: string) {
//   const cell = sheet.getCellByA1(cellId);
//   cell.value = text;

// }
