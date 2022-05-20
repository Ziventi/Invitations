import { spawnSync } from 'child_process';
import { Argument, Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import puppeteer from 'puppeteer';

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
    .action(async (format, options: GenerateOptions) => {
      const outputDir = path.resolve(__dirname, 'dist');

      fs.removeSync(outputDir);
      fs.ensureDirSync(outputDir);

      if (format === 'pdf') {
        await generatePDFs(outputDir, options);
      }

      if (options.open) {
        openSampleFiles('pdf', outputDir);
      }
    });

  program.addHelpCommand(false);
  await program.parseAsync();
})();

async function generatePDFs(
  outputDir: string,
  options: GenerateOptions,
): Promise<void> {
  const browser = await puppeteer.launch();

  const txtContent = fs.readFileSync('names.txt', { encoding: 'utf8' });
  const names = txtContent
    .split(/\n/)
    .map((e) => e.trim())
    .slice(0, parseInt(options.limit));

  const screenshot = async (name: string): Promise<void> => {
    const page = await browser.newPage();
    await page.goto(`http://localhost:8080?name=${encodeURIComponent(name)}`);
    await page.evaluateHandle('document.fonts.ready');
    await page.emulateMediaType('screen');
    await page.pdf({
      format: 'a4',
      path: `${outputDir}/${name}.pdf`,
      pageRanges: '1',
      printBackground: true,
    });
  };

  const promises = names.map(screenshot);
  await Promise.all(promises);

  await browser.close();
}

/**
 * Opens the first generated file in Chrome.
 * @param format The format of the file to open.
 */
function openSampleFiles(format: FileFormat, outputDir: string): void {
  const files = fs.readdirSync(outputDir);

  if (format === 'pdf') {
    spawnSync('open', ['-a', 'Google Chrome', ...files], {
      cwd: outputDir,
    });
  } else if (format === 'png') {
    spawnSync('code', [...files], { cwd: outputDir });
  }
}

type FileFormat = 'pdf' | 'png';
interface GenerateOptions {
  all?: boolean;
  format?: FileFormat;
  limit?: string;
  name?: string;
  open?: boolean;
  zip?: boolean;
}
