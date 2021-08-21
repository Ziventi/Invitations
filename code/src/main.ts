import { Command } from 'commander';
import fs from 'fs-extra';

import { generateHTMLFiles, generatePDFFiles } from './lib/functions';
import * as Paths from './lib/paths';
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

    // program
    // .command('update')
    // .description('Updates the public guest list.')
    // .action(async (options) => {
      
    // });

  program.command('clean').action(clean);
  program.addHelpCommand(false);

  await program.parseAsync();
}
