import { Argument, Command } from 'commander';

import Generator from './generate';

(async () => {
  const program = new Command();
  program
    .description('Generates the invitations from the templates.')
    .addArgument(
      new Argument('<format>', 'The rich format of files to generate').choices([
        'png',
        'pdf',
      ]),
    )
    .option(
      '-a, --all',
      'Generates files for all guests. Void if name is specified.',
      false,
    )
    .option(
      '-l, --limit <limit>',
      'The limit or quantity of files to generate',
      '10',
    )
    .option(
      '-n, --name <name>',
      'The name of a guest to specify. Overrides the "all" flag.',
    )
    .option('-o, --open', 'Open the generated files in the browser.', false)
    .option(
      '-z, --zip',
      'Archives the generated format files into a ZIP.',
      false,
    )
    .action(async (format, generate) => {
      const generator = new Generator();
      await generator.execute(format, generate);
    });

  program.addHelpCommand(false);
  await program.parseAsync();
})();
