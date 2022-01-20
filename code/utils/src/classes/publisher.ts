import type {
  PublishLoadingOptions,
  PublishOptions,
  PublishSheet,
  TGuestRow,
  TGuest,
} from '../types';
import type { GoogleSpreadsheet } from 'google-spreadsheet';

import path from 'path';
import invariant from 'tiny-invariant';

import { Timed } from '../lib/decorators';
import { logger } from '../lib/logger';
import * as Spreadsheet from '../lib/spreadsheet';

export default class ZPublisher<G extends TGuest, R extends TGuestRow> {
  private loadingOptions: PublishLoadingOptions<G, R>;
  private postPublish?: PostPublish<G>;
  private spreadsheet!: GoogleSpreadsheet;

  constructor(options: PublisherConstructor<G, R>) {
    const { loadingOptions, postPublish } = options;
    this.loadingOptions = loadingOptions;
    this.postPublish = postPublish;
    this.execute = this.execute.bind(this);
  }

  /**
   * Updates the public spreadsheet with the currently invited and confirmed
   * guests.
   * @param options The update options.
   */
  @Timed
  public async execute(options: PublishOptions): Promise<void> {
    logger.trace('Executing ZPublisher...');
    const { refreshCache } = options;
    const { loader, processor, sheet } = this.loadingOptions;

    let guests = await loader.execute(refreshCache);
    if (processor) {
      guests = processor(guests);
    }

    logger.info(
      `Publishing guest list for '${path.basename(process.cwd())}'...`
    );
    await this.marshalGuestsToRows(sheet, guests);
    logger.info(`Guest list published.`);

    if (this.postPublish) {
      logger.info(`Executing post-publish...`);
      const { sheet, range, updater } = this.postPublish;
      await this.updateCells(sheet, range, updater(guests));
      logger.info(`Post post-publish complete.`);
    }
  }

  /**
   * Directly updates cells on a specified worksheet.
   * @param sheetName The name of the worksheet.
   * @param range The range of cells to load.
   * @param valuesByCell The map of cell id-value pairs.
   */
  private async updateCells(
    sheetName: string,
    range: string,
    valuesByCell: Record<string, string>
  ): Promise<void> {
    const sheet = this.spreadsheet.sheetsByTitle[sheetName];
    invariant(sheet, `No sheet exists with name '${sheetName}'.`);
    await sheet.loadCells(range);

    Object.entries(valuesByCell).forEach(([cellId, text]) => {
      const cell = sheet.getCellByA1(cellId);
      cell.value = text;
    });

    await sheet.saveUpdatedCells();
  }

  /**
   * Marshals guests to rows to publish on a specified sheet.
   * @param sheet The sheet(s) to publish to.
   * @param guests The list of guests.
   */
  private async marshalGuestsToRows(
    sheet: PublishSheet<G>,
    guests: G[]
  ): Promise<void> {
    let guestCollection: Record<string, G[]> = {};

    if (typeof sheet === 'string') {
      guestCollection[sheet] = guests;
    } else {
      const { property, sheetMap } = sheet;

      guestCollection = guests.reduce((builder, guest) => {
        const sheetKey = String(guest[property]);
        const sheetName = sheetMap[sheetKey];
        const currentPropertyState = builder[sheetName] || [];
        return {
          ...builder,
          [sheetName]: [...currentPropertyState, guest],
        };
      }, {} as Record<string, G[]>);
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
}

interface PublisherConstructor<G extends TGuest, R extends TGuestRow> {
  loadingOptions: PublishLoadingOptions<G, R>;
  postPublish?: PostPublish<G>;
}

interface PostPublish<G> {
  sheet: string;
  range: string;
  updater: (guests: G[]) => Record<string, string>;
}
