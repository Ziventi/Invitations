import { Command } from 'commander';

import generate from './commands/generate';
import update from './commands/update';
import { clean } from './lib/utils';

main();

async function main() {
  const program = new Command();

  program
    .command('generate')
    .description('Generates the invitations from the templates.')
    .option('-p, --with-pdf', 'Also generate the PDF files.', false)
    .option('-r, --refresh', 'Reload and cache the external dataset.', false)
    .action(generate);

  program
    .command('update')
    .description('Updates the public guest list.')
    .option('-r, --refresh', 'Reload and cache the external dataset.', false)
    .action(update);

  program.command('clean').action(clean);
  program.addHelpCommand(false);

  await program.parseAsync();
}
