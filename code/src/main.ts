import { Command } from 'commander';
import fs from 'fs-extra';

import { Rank } from './lib/classes';
import {
  generateHTMLFiles,
  generatePDFFiles,
  loadGuestList
} from './lib/functions';
import * as Paths from './lib/paths';
import { getSpreadsheet } from './lib/spreadsheet';
import { clean, setup, tearDown } from './lib/utils';

main();

async function main() {
  const program = new Command();

  program
    .command('generate')
    .description('Generates the view files from the templates.')
    .option('-p, --with-pdf', 'Also generate the PDF files.', false)
    .option('-r, --refresh', 'Reload and cache the external dataset.', false)
    .action(async (options) => {
      const { withPdf, refresh } = options;
      const refreshCache = refresh || !fs.existsSync(Paths.CACHED_DATA);

      setup();
      await generateHTMLFiles(refreshCache);
      if (withPdf) {
        await generatePDFFiles();
      }
      tearDown();
    });

  program
    .command('update')
    .description('Updates the public guest list.')
    .option('-r, --refresh', 'Reload and cache the external dataset.', false)
    .action(async (options) => {
      const { refresh } = options;
      const refreshCache = refresh || !fs.existsSync(Paths.CACHED_DATA);

      const guests = await loadGuestList(refreshCache);
      const rows = guests
        .filter((g) => g.rank <= Rank.D)
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map(({ name, known, confirmed }) => {
          return [name, known, confirmed];
        });

      const spreadsheet = await getSpreadsheet(
        process.env.PUBLIC_SPREADSHEET_ID!
      );
      const [sheet] = spreadsheet.sheetsByIndex;
      await sheet.clear();
      await sheet.setHeaderRow(['Name', 'Known', 'Confirmed?']);
      await sheet.addRows(rows);
    });

  program.command('clean').action(clean);
  program.addHelpCommand(false);

  await program.parseAsync();
}
