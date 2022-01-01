import ejs from 'ejs';
import { ExifTool } from 'exiftool-vendored';
import express, { Express } from 'express';
import fs from 'fs-extra';
import sass from 'node-sass';
import puppeteer, { Browser } from 'puppeteer';
import invariant from 'tiny-invariant';

import { spawnSync } from 'child_process';
import { Server } from 'http';
import path from 'path';

import {
  ConfirmStatus,
  GenerateOptions,
  HashParams,
  Paths,
  TGuestRow
} from '../..';
import { GenerateHTMLOptions, LoadingOptions, TGuest } from '../../types';
import { Timed } from '../utils/decorators';
import { Utils } from '../utils/functions';
import { logger } from '../utils/logger';

export class ZGenerator<G extends TGuest, R extends TGuestRow> {
  private app?: Express;
  private browser?: Browser;
  private exiftool?: ExifTool;
  private imageServer?: Server;

  private fontsUrl: string;
  private loadingOptions: LoadingOptions<G, R>;
  private paths: ResourcePaths;

  private formatOptions?: FormatOptions;
  private htmlOptions?: HTMLOptions;

  /**
   * Constructors a new generator.
   * @param options The generator constructor options.
   */
  constructor(options: GeneratorConstructor<G, R>) {
    const { fontsUrl, formatOptions, htmlOptions, loadingOptions, rootDir } =
      options;
    const root = rootDir || process.cwd();
    const outputDir = `${root}/.out`;
    const viewsDir = `${root}/views`;
    const imagesDir = `${viewsDir}/images`;

    if (fs.existsSync(imagesDir)) {
      this.app = express();
      this.app.use(express.static(imagesDir));
      this.app.use(express.static(Paths.LIB_DIR));
    }

    this.fontsUrl = fontsUrl;
    this.formatOptions = formatOptions;
    this.loadingOptions = loadingOptions;
    this.htmlOptions = htmlOptions;
    this.paths = {
      outputDir,
      viewsDir,
      imagesDir,
      templatesDir: `${viewsDir}/templates`,
      stylesInputFile: `${viewsDir}/styles/App.scss`,
      stylesOutputFile: `${outputDir}/css/main.css`
    };

    this.execute = this.execute.bind(this);
  }

  /**
   * Triggers the generate method.
   * @param options The generate CLI options.
   */
  @Timed
  public async execute(options: GenerateOptions): Promise<void> {
    const { all, format, limit, name, open, refreshCache } = options;
    const { loader, processor } = this.loadingOptions;

    logger.info(`Generating files for '${path.basename(process.cwd())}'...`);

    if (all && format) {
      logger.warn(`Generating ${format.toUpperCase()} files for ALL guests.`);
    }

    if (open) {
      logger.warn('Will open first file after generation.');
    }

    Utils.setup(this.paths.outputDir);
    this.transpileSass();
    this.copyImages();

    let guests = await loader.execute(refreshCache);
    if (processor) {
      guests = processor(guests);
    }

    this.generateHTMLFiles(guests, { all, limit, name });

    if (format === 'png') {
      await this.generatePNGFiles();
    } else if (format === 'pdf') {
      await this.generatePDFFiles();
    }

    if (open) {
      this.openFileInBrowser(format);
    }
  }

  /**
   * Generates the HTML files for each member on the guest list from the template.
   * @param guests The list of guests to generate files for.
   * @param options The options for generating HTML.
   */
  private generateHTMLFiles(
    guests: G[],
    { all, limit = 10, name }: GenerateHTMLOptions
  ): void {
    invariant(guests.length, 'There are no guests to generate files for.');

    logger.info('Generating HTML files...');
    const { outputDir, templatesDir } = this.paths;

    if (name) {
      const matchingGuests = guests.filter((g) => {
        return g.name.toLowerCase().startsWith(name.toLowerCase());
      });
      invariant(
        matchingGuests.length > 0,
        `No guests found with name starting with '${name}'.`
      );
      guests = matchingGuests;
    }

    if (!all) {
      const quantity = Number(limit);
      guests = guests.slice(0, quantity);
    }

    const templateEjs = fs.readFileSync(`${templatesDir}/index.ejs`, 'utf8');
    const templater = ejs.compile(templateEjs, {
      root: this.paths.viewsDir,
      views: [Paths.LIB_DIR]
    });

    guests.forEach((guest) => {
      const outputFile = `${outputDir}/html/${guest.name}.html`;
      this.createHTMLFile(templater, outputFile, guest, guests);
    });
  }

  /**
   * Generates the PDF files from each of the guest HTML files.
   */
  private async generatePDFFiles(): Promise<void> {
    if (!this.formatOptions) return;
    invariant(this.formatOptions.pdfOptions, 'No PDF options specified.');

    const { outputDir, templatesDir } = this.paths;
    fs.ensureDirSync(`${outputDir}/pdf`);
    logger.info('Generating PDF files...');

    await this.startInstances('pdf');

    const pagesDir = `${templatesDir}/pages`;
    const pageCount = fs.existsSync(pagesDir)
      ? fs.readdirSync(pagesDir).length
      : 1;
    const filenames = fs.readdirSync(`${outputDir}/html`);
    const promises = filenames.map((filename) => {
      const [name] = filename.split('.');
      const html = Utils.readFileContent(`${outputDir}/html/${name}.html`);
      return this.createPDFFile(html, name, pageCount);
    });

    await Promise.all(promises);
    await this.stopInstances();
  }

  /**
   * Generates the PNG files from each of the guest HTML files.
   */
  private async generatePNGFiles(): Promise<void> {
    if (!this.formatOptions) return;
    invariant(this.formatOptions.pngOptions, 'No PNG options specified.');

    const { outputDir } = this.paths;
    fs.ensureDirSync(`${outputDir}/png`);
    logger.info('Generating PNG files...');

    await this.startInstances('png');

    const filenames = fs.readdirSync(`${outputDir}/html`);
    const promises = filenames.map((filename) => {
      const [name] = filename.split('.');
      const html = Utils.readFileContent(`${outputDir}/html/${name}.html`);
      return this.createPNGFile(html, name);
    });

    await Promise.all(promises);
    await this.stopInstances();
  }

  /**
   * Helper function for generating HTML pages.
   * @param templater The EJS template function.
   * @param outputFile The HTML file output path.
   * @param guest The current guest whose details will go on the invite.
   * @param allGuests The list of all guests.
   */
  private createHTMLFile(
    templater: ejs.TemplateFunction,
    outputFile: string,
    guest: G,
    allGuests: G[]
  ): void {
    let locals: Record<string, any> = {
      guest,
      allGuests,
      cssFile: this.paths.stylesOutputFile,
      fontsUrl: this.fontsUrl
    };

    if (this.htmlOptions) {
      const { hashParams, ejsLocals } = this.htmlOptions;
      locals = {
        ...locals,
        ...ejsLocals
      };

      if (hashParams) {
        const statuses: ConfirmStatus[] = [
          'Confirmed',
          'Tentative',
          'Unavailable'
        ];
        statuses.forEach((status) => {
          const params: HashParams = {
            guestName: guest.name,
            status,
            ...hashParams
          };
          locals.guest._hashes = {
            ...(locals.guest._hashes || {}),
            [status]: Utils.encryptJSON(params)
          };
        });
      }
    }

    try {
      const html = templater(locals);
      fs.outputFileSync(outputFile, html);
    } catch (err) {
      Utils.error(err);
    }
  }

  /**
   * Creates a single PDF file for a guest from the HTML file.
   * @param html The HTML string to be used for generating the PDF.
   * @param guestName The name of the guest.
   * @param pageCount The number of pages to print.
   */
  private async createPDFFile(
    html: string,
    guestName: string,
    pageCount: number
  ): Promise<void> {
    if (!this.formatOptions) return;
    const { outputDir, stylesOutputFile } = this.paths;
    const { nomenclator, pdfOptions } = this.formatOptions;

    const pdfFileName = nomenclator(guestName);
    const outputPath = `${outputDir}/pdf/${pdfFileName}.pdf`;

    try {
      const page = await this.browser!.newPage();
      await page.goto(`data:text/html,${encodeURIComponent(html)}`);
      await page.addStyleTag({ url: this.fontsUrl });
      if (fs.existsSync(stylesOutputFile)) {
        await page.addStyleTag({ path: stylesOutputFile });
      }
      await page.evaluateHandle('document.fonts.ready');
      await page.pdf({
        format: pdfOptions!.format || 'a4',
        path: outputPath,
        pageRanges: `1-${pageCount}`,
        printBackground: true
      });
    } catch (err) {
      Utils.error(err);
    }
  }

  /**
   * Creates a single PNG file for a guest from the HTML file.
   * @param html The HTML string to be used for generating the PDF.
   * @param guestName The name of the guest.
   */
  private async createPNGFile(html: string, guestName: string): Promise<void> {
    if (!this.formatOptions) return;
    const { outputDir, stylesOutputFile } = this.paths;
    const { nomenclator } = this.formatOptions;

    const filename = nomenclator(guestName);
    const outputPath = `${outputDir}/png/${filename}.png`;
    const viewport = this.translateViewportOptions();

    try {
      const page = await this.browser!.newPage();
      await page.goto(`data:text/html,${encodeURIComponent(html)}`);
      await page.addStyleTag({ url: this.fontsUrl });
      if (fs.existsSync(stylesOutputFile)) {
        await page.addStyleTag({ path: stylesOutputFile });
      }
      await page.setViewport(viewport);
      await page.evaluateHandle('document.fonts.ready');
      await page.screenshot({
        type: 'png',
        path: outputPath
      });
    } catch (err) {
      Utils.error(err);
    }
  }

  /**
   * Transpiles the SCSS files to CSS.
   */
  private transpileSass(): void {
    const { outputDir, stylesInputFile, stylesOutputFile } = this.paths;

    if (!fs.existsSync(stylesInputFile!)) {
      logger.warn('Skipping transpilation of SCSS since no style file found.');
      return;
    }

    logger.info('Transpiling SCSS to CSS...');
    fs.ensureDirSync(`${outputDir}/css`);
    try {
      const output = sass.renderSync({
        file: stylesInputFile,
        sourceMap: false
      });
      fs.writeFileSync(stylesOutputFile, output.css);
    } catch (e) {
      Utils.error(e);
    }
  }

  /**
   * Copies images to output folder.
   */
  private copyImages(): void {
    const { outputDir, imagesDir } = this.paths;
    const imagesOutputDir = `${outputDir}/images`;

    try {
      fs.ensureDirSync(imagesOutputDir);
      if (fs.existsSync(imagesDir)) {
        logger.info('Copying project images to output...');
        fs.copySync(imagesDir, imagesOutputDir);
      }

      logger.info('Copying library images to output...');
      fs.copySync(`${Paths.LIB_DIR}/svg`, imagesOutputDir);
    } catch (e) {
      Utils.error(e);
    }
  }

  /**
   * Opens the first generated file in Chrome.
   * @param format The format of the file to open.
   */
  private openFileInBrowser(format?: GenerateOptions['format']): void {
    const openFile = (ext: string, app: 'chrome' | 'vscode'): void => {
      const outputDir = `${this.paths.outputDir}/${ext}`;
      const firstFile = fs.readdirSync(outputDir)[0];
      if (app === 'chrome') {
        spawnSync('open', ['-a', 'Google Chrome', firstFile], {
          cwd: outputDir
        });
      } else {
        spawnSync('code', [firstFile], { cwd: outputDir });
      }
    };

    if (format) {
      if (format === 'pdf') {
        openFile('pdf', 'chrome');
      } else if (format === 'png') {
        openFile('png', 'vscode');
      }
    } else {
      openFile('html', 'chrome');
    }
  }

  /**
   * Translates the incoming viewport options to values acceptable by puppeteer.
   * @returns The puppeteer viewport options.
   */
  private translateViewportOptions(): puppeteer.Viewport {
    const {
      width,
      height,
      deviceScaleFactor = 1,
      scale = 1
    } = this.formatOptions!.pngOptions!.viewportOptions;

    const convert = (measurement: number | string): number => {
      if (typeof measurement === 'string') {
        measurement = parseFloat(measurement.replace('in', '')) * 96;
      }
      return measurement * scale;
    };

    return {
      width: convert(width),
      height: convert(height),
      deviceScaleFactor
    };
  }

  /**
   * Start the Puppeteer browser, the Exiftool if generating PDFs, and the
   * Express server if images require hosting.
   * @param format The file format.
   */
  private async startInstances(
    format: GenerateOptions['format']
  ): Promise<void> {
    this.browser = await puppeteer.launch();
    if (format === 'pdf') {
      this.exiftool = new ExifTool();
    }
    if (this.app) {
      logger.trace('Starting Express image server...');
      this.imageServer = this.app.listen(3000);
    }
  }

  /**
   * Stops the instances Puppeteer browser, Exiftool and Express server.
   */
  private async stopInstances(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
    if (this.exiftool) {
      await this.exiftool.end();
    }
    if (this.imageServer) {
      logger.trace('Stopping Express image server...');
      this.imageServer.close();
    }
  }
}

interface GeneratorConstructor<G extends TGuest, R extends TGuestRow> {
  fontsUrl: string;
  loadingOptions: LoadingOptions<G, R>;
  htmlOptions?: HTMLOptions;
  formatOptions?: FormatOptions;
  rootDir?: string;
}

interface HTMLOptions {
  ejsLocals?: Record<string, unknown>;
  hashParams?: Required<Pick<HashParams, 'spreadsheetId' | 'sheetTitle'>>;
}

interface FormatOptions {
  nomenclator: (name: string) => string;
  pdfOptions?: PDFOptions;
  pngOptions?: PNGOptions;
}
interface PDFOptions {
  format?: puppeteer.PaperFormat;
}

interface PNGOptions {
  viewportOptions: ViewportOptions;
}

interface ViewportOptions {
  width: number | string;
  height: number | string;
  scale?: number;
  deviceScaleFactor?: number;
}

interface ResourcePaths {
  outputDir: string;
  viewsDir: string;
  imagesDir: string;
  templatesDir: string;
  stylesInputFile: string;
  stylesOutputFile: string;
}
