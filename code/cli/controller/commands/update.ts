import fs from 'fs-extra';

import { Rank } from '../lib/classes';
import * as Paths from '../lib/paths';
import { getSpreadsheet } from '../lib/spreadsheet';
import * as Utils from '../lib/utils';

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

  const spreadsheet = await getSpreadsheet(process.env.SS_PUBLIC_GUESTLIST_ID!);
  const [sheet] = spreadsheet.sheetsByIndex;
  await sheet.clear();
  await sheet.setHeaderRow(['Name', 'Origin', 'Confirmed?']);
  await sheet.addRows(rows);
}

type UpdateOptions = {
  refresh?: boolean;
};
