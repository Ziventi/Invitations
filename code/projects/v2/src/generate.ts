import { Logger } from '@ziventi/utils';
import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import puppeteer from 'puppeteer';

export default class Generator {
  private static NAMES_TXT = 'names.txt';
  private static MAX_FILE_SIZE = 5;

  private outputDir: string;
  private names: string[];

  public constructor() {
    this.outputDir = path.resolve(__dirname, '../dist');
    this.names = fs
      .readFileSync(Generator.NAMES_TXT, { encoding: 'utf8' })
      .split(/\n/)
      .map((e) => e.trim());
  }

  /**
   * Execute the generation of files.
   * @param format The format of the output files.
   * @param options The generation options.
   */
  public async execute(
    format: FileFormat,
    options: GenerateOptions,
  ): Promise<void> {
    Logger.info('Cleaning output directory.');
    fs.removeSync(this.outputDir);
    fs.ensureDirSync(this.outputDir);

    if (options.limit) {
      this.names = this.names.slice(0, parseInt(options.limit));
    }

    if (format === 'pdf') {
      await this.generatePDFs();
    }

    if (options.open) {
      this.openSampleFiles(format);
    }
  }

  /**
   * Generate PDF files for each name..
   */
  private async generatePDFs(): Promise<void> {
    Logger.info('Generating PDF files.');
    let maxFileSize = 0;
    const browser = await puppeteer.launch();

    await Promise.all(
      this.names.map(async (name) => {
        const page = await browser.newPage();
        await page.goto(
          `http://localhost:8080?name=${encodeURIComponent(name)}`,
        );
        await page.evaluateHandle('document.fonts.ready');
        const file = await page.pdf({
          format: 'a4',
          path: `${this.outputDir}/${name}.pdf`,
          pageRanges: '1',
          printBackground: true,
        });
        const size = Buffer.byteLength(file);
        maxFileSize = Math.max(size, maxFileSize);
      }),
    );

    if (maxFileSize > Generator.MAX_FILE_SIZE * 1024 * 1024) {
      Logger.warn(
        `There exists at least one file which is larger than ${Generator.MAX_FILE_SIZE}MB limit.`,
      );
    }

    await browser.close();
  }

  /**
   * Opens the generated files in Chrome or VSCode.
   * @param format The format of the file to open.
   */
  private openSampleFiles(format: FileFormat): void {
    const files = fs.readdirSync(this.outputDir);

    if (format === 'pdf') {
      spawnSync('open', ['-a', 'Google Chrome', ...files], {
        cwd: this.outputDir,
      });
    } else if (format === 'png') {
      spawnSync('code', [...files], { cwd: this.outputDir });
    }
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
