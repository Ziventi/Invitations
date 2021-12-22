import fs from 'fs-extra';

import path from 'path';

import { TGuest, TGuestRow } from '../../../types';
import { Paths } from '../../paths';
import { Spreadsheet } from '../../spreadsheet';
import { logger } from '../logger';
import { Utils } from '../utils';

export class ZLoader<
  G extends TGuest = TGuest,
  R extends TGuestRow = TGuestRow
> {
  private loadOptions: LoadOptions<G, R>;

  constructor(options: LoadOptions<G, R>) {
    logger.debug('Constructing ZLoader...');
    this.loadOptions = options;
  }

  /**
   * Retrieves the full guest list.
   * @returns A promise which resolves to the list of guest records.
   */
  public async execute(refreshCache?: boolean): Promise<G[]> {
    logger.debug('Executing ZLoader...');
    const { guestMarshaler, spreadsheetId } = this.loadOptions;
    const cacheName = path.basename(process.cwd());
    const cachePath = `${Paths.CACHE_DIR}/${cacheName}.json`;

    if (refreshCache || !fs.existsSync(cachePath)) {
      logger.info('Refreshing cache...');
      let records: R[] = [];

      try {
        const spreadsheet = await Spreadsheet.getSpreadsheet(spreadsheetId);
        const [sheet] = spreadsheet.sheetsByIndex;
        records = (await sheet.getRows()) as unknown as R[];
      } catch (err) {
        Utils.error(err);
      }

      const guests = guestMarshaler(records);
      fs.outputFileSync(cachePath, JSON.stringify(guests, null, 2));
    }
    const guests = Utils.readFileContent(cachePath);
    return <G[]>JSON.parse(guests);
  }
}

interface LoadOptions<G, R> {
  spreadsheetId: string;
  guestMarshaler: (records: R[]) => G[];
}
