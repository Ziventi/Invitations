import { Command } from 'commander';

import { CLIOptions } from '../types';

export async function CLI(options: CLIOptions = {}): Promise<void> {
  const { generate, publish } = options;
  const program = new Command();

  if (generate) {
    program
      .command('generate')
      .description('Generates the invitations from the templates.')
      .option(
        '-a, --all',
        'Generates files for all guests. Void if name is specified.',
        false
      )
      .option('-f, --format <format>', 'The rich format of files to generate')
      .option(
        '-l, --limit <limit>',
        'The limit or quantity of files to generate',
        '10'
      )
      .option('-n, --name <name>', 'The name of a guest to specify')
      .option('-o, --open', 'Open the generated files in the browser.', false)
      .option(
        '-r, --refresh-cache',
        'Reload and cache the external dataset.',
        false
      )

      .action(generate);
  }

  if (publish) {
    program
      .command('publish')
      .description('Publishes to the public guest list.')
      .option(
        '-r, --refresh-cache',
        'Reload and cache the external dataset.',
        false
      )
      .action(publish);
  }

  program.addHelpCommand(false);

  await program.parseAsync();
}
