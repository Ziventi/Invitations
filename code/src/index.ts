import { Command } from 'commander';
import fs from 'fs-extra';

import { EXIFTOOL } from './config';
import * as Paths from './paths';
import { clean } from './utils/common';
import { generateHTMLFiles, generatePDFFiles } from './utils/helper';

const program = new Command();

main();

async function setup() {
  console.time('Time');
  clean();
  fs.ensureDirSync(Paths.OUTPUT_DIR);
}

async function tearDown() {
  await EXIFTOOL.end();
  console.timeEnd('Time');
}

async function main() {
  program
    .command('generate')
    .description('Generates the view files from the templates.')
    .option('-p, --with-pdf', 'Also generate the PDF files.', false)
    .option(
      '-r, --refresh',
      'Reload the external dataset and refresh the cache.',
      false
    )
    .action(async (options) => {
      const { withPdf, refresh } = options;
      const refreshCache = refresh || !fs.existsSync(Paths.CACHED_DATA);

      await setup();
      await generateHTMLFiles(refreshCache);
      if (withPdf) {
        console.info('Generating PDF files...');
        await generatePDFFiles();
      }

      await tearDown();
    });

  program.command('clean').action(clean);
  program.addHelpCommand(false);

  await program.parseAsync();
}
