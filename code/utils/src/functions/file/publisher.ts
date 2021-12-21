import type { GoogleSpreadsheet } from 'google-spreadsheet';

import { LoadingOptions, PublishOptions } from '../../..';
import type { TGuest, TGuestRow } from '../../../types';
import { Spreadsheet } from '../../spreadsheet';

export class ZPublisher<
  G extends TGuest = TGuest,
  R extends TGuestRow = TGuestRow
> {
  private spreadsheet!: GoogleSpreadsheet;

  /**
   * Updates the public spreadsheet with the currently invited and confirmed
   * guests.
   * @param options The update options.
   */
  public async execute(
    options: PublishOptions,
    loadingOptions: LoadingOptions<G, R>
  ) {
    const { refreshCache } = options;
    const { loader, filter, reducer } = loadingOptions;

    let guests = await loader.load(refreshCache);
    if (filter) {
      guests = guests.filter(filter);
    }

    let guestCollection: Record<string, G[]> = {};
    if (reducer) {
      const { property, sheetMap } = reducer;

      guestCollection = guests.reduce((builder, guest) => {
        const sheetKey = String(guest[property]);
        const sheetName = sheetMap[sheetKey];
        const currentPropertyState = builder[sheetName] || [];
        return {
          ...builder,
          [sheetName]: [...currentPropertyState, guest]
        };
      }, {} as Record<string, G[]>);
    } else {
      guestCollection['Sheet1'] = guests;
    }

    this.spreadsheet = await Spreadsheet.getSpreadsheet(
      process.env.SS_PUBLIC_LISTS_ID!
    );

    const promises = Object.entries(guestCollection).map(
      ([sheetName, guests]) => {
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

        const sheet = this.spreadsheet.sheetsByTitle[sheetName];
        if (!sheet) return;

        return (async () => {
          await sheet.clear();
          await sheet.setHeaderRow(['Name', 'Attendance']);
          await sheet.addRows(rows);
        })();
      }
    );

    await Promise.all(promises);
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
