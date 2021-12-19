// import fs from 'fs-extra';
// import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

// import * as Utils from '../utils/functions';
// import * as Paths from '../utils/paths';
// import { getSpreadsheet } from '../utils/spreadsheet';

// let sheet: GoogleSpreadsheetWorksheet;

// /**
//  * Updates the public spreadsheet with the currently invited and confirmed
//  * guests.
//  * @param options The update options.
//  */
// export default async function update(options: UpdateOptions) {
//   const { refresh } = options;
//   const refreshCache = refresh || !fs.existsSync(Paths.CACHED_DATA);

//   const guests = await Utils.loadGuestList(refreshCache);
//   const familyRows: string[][] = [];
//   const friendsRows: string[][] = [];

//   guests
//     .sort((a, b) => (a.name > b.name ? 1 : -1))
//     .map(({ name, category, status }) => {
//       let attendance = '';

//       switch (status) {
//         case 'Confirmed':
//           attendance = '\u2714  Confirmed';
//           break;
//         case 'Tentative':
//           attendance = '\uD83D\uDD38 Tentative';
//           break;
//         case 'Unavailable':
//           attendance = '\u274C Unavailable';
//           break;
//         case 'Awaiting':
//         default:
//           attendance = '\uD83D\uDD57  Awaiting response';
//           break;
//       }

//       if (category === 'Family') {
//         familyRows.push([name, attendance]);
//       } else {
//         friendsRows.push([name, attendance]);
//       }
//     });

//   await updateSpreadsheet(friendsRows, 0);
//   await updateSpreadsheet(familyRows, 1);
// }

// /**
//  * Updates a particular worksheet.
//  * @param rows The rows to update the sheet with.
//  * @param sheetIndex The worksheet index.
//  */
// async function updateSpreadsheet(rows: string[][], sheetIndex: number) {
//   const spreadsheet = await getSpreadsheet(process.env.SS_PUBLIC_LISTS_ID!);
//   sheet = spreadsheet.sheetsByIndex[sheetIndex];
//   await sheet.clear();
//   await sheet.setHeaderRow(['Name', 'Status']);
//   await sheet.addRows(rows);
// }

// type UpdateOptions = {
//   refresh?: boolean;
// };
