import fs from 'fs-extra';

import { Rank } from '../utils/classes';
import * as Utils from '../utils/functions';
import * as Paths from '../utils/paths';
import { getSpreadsheet } from '../utils/spreadsheet';

export default async function update(options: UpdateOptions) {
  const { refresh } = options;
  const refreshCache = refresh || !fs.existsSync(Paths.CACHED_DATA);

  const guests = await Utils.loadGuestList(refreshCache);
  const rows = guests
    .filter((g) => g.rank <= Rank.D)
    .sort((a, b) => a.name > b.name ? 1 : -1)
    .map(({ name, origin, confirmed }) => {
      const hasConfirmed = confirmed ? 'Yes' : '';
      return [name, origin, hasConfirmed];
    });

  const spreadsheet = await getSpreadsheet(process.env.SS_PUBLIC_LISTS_ID!);
  const [sheet] = spreadsheet.sheetsByIndex;
  await sheet.clear();
  await sheet.setHeaderRow(['Name', 'Origin', 'Confirmed?']);
  await sheet.addRows(rows);
}

type UpdateOptions = {
  refresh?: boolean;
};
