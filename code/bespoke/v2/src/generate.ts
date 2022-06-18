import { Logger as logger } from '@ziventi/utils';
import axios from 'axios';
import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer';

import type { ProjectSettings } from '../types';

export default class Generator {
  private static BASE_URL = 'http://localhost:8080';
  private static MAX_FILE_SIZE = 5;

  private browser?: Browser;
  private outputDir: string;
  private names: string[];
  private projectSettings: ProjectSettings;

  constructor() {
    this.outputDir = path.resolve(__dirname, '../dist');
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
    logger.info('Cleaning output directory.');
    fs.removeSync(this.outputDir);
    fs.ensureDirSync(this.outputDir);

    await this.retrieveProjectConfiguration();

    if (options.limit) {
      this.names = this.names.slice(0, parseInt(options.limit));
    }

    try {
      await this.generateFiles(format);

      if (options.open) {
        this.openSampleFiles(format);
      }
    } catch (e) {
      logger.error(e);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  /**
   * Generate files for each name.
   */
  private async generateFiles(format: FileFormat): Promise<void> {
    this.browser = await puppeteer.launch();
    logger.info(
      format === 'pdf' ? 'Generating PDF files.' : 'Generate PNG images.',
    );

    let maxFileSize = 0;
    await Promise.all(
      this.names.map(async (name) => {
        const filename = this.projectSettings.fileNameTemplate.replace(
          '{name}',
          name,
        );
        const url = new URL(Generator.BASE_URL);
        url.searchParams.append('name', name);

        const page = await this.browser!.newPage();
        await page.goto(url.href, {
          waitUntil: 'networkidle0',
        });
        await page.evaluateHandle('document.fonts.ready');

        let file: Buffer | string;
        if (format === 'pdf') {
          file = await page.pdf({
            format: 'a4',
            path: `${this.outputDir}/${filename}.pdf`,
            pageRanges: `1-${this.projectSettings.pagesLength}`,
            printBackground: true,
          });
        } else {
          const viewportOptions = this.translateViewportOptions({
            width: '8.25in',
            height: '11.75in',
          });
          await page.setViewport(viewportOptions);
          file = await page.screenshot({
            encoding: 'binary',
            fullPage: true,
            path: `${this.outputDir}/${filename}.png`,
            type: 'png',
          });
        }
        const size = Buffer.byteLength(file);
        maxFileSize = Math.max(size, maxFileSize);
      }),
    );

    if (maxFileSize > Generator.MAX_FILE_SIZE * 1024 * 1024) {
      logger.warn(
        `There exists at least one file which is larger than ${Generator.MAX_FILE_SIZE}MB limit.`,
      );
    }
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

  /**
   * Translates the incoming viewport options to values acceptable by puppeteer.
   * @returns The puppeteer viewport options.
   */
  private translateViewportOptions(
    options: ViewportOptions,
  ): puppeteer.Viewport {
    const { width, height, deviceScaleFactor = 2.5 } = options;

    const convert = (measurement: number | string): number => {
      if (typeof measurement === 'string') {
        measurement = parseFloat(measurement.replace('in', '')) * 96;
      }
      return measurement;
    };

    return {
      width: convert(width),
      height: convert(height),
      deviceScaleFactor,
    };
  }

  /**
   * Request for the project specific names and configuration.
   */
  private async retrieveProjectConfiguration(): Promise<void> {
    const [namesResponse, settingsResponse] = await Promise.all([
      await axios.get<string>(`${Generator.BASE_URL}/names.txt`),
      await axios.get<ProjectSettings>(`${Generator.BASE_URL}/settings.json`),
    ]);

    this.names = namesResponse.data.split(/\n/).map((e) => e.trim());
    this.projectSettings = settingsResponse.data;
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

interface ViewportOptions extends Omit<puppeteer.Viewport, 'width' | 'height'> {
  width: number | string;
  height: number | string;
}
