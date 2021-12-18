import ejs from 'ejs';
import { ExifTool } from 'exiftool-vendored';
import express, { Express } from 'express';
import fs from 'fs-extra';
import sass from 'node-sass';
import puppeteer, { Browser } from 'puppeteer';
import invariant from 'tiny-invariant';

import { Server } from 'http';

import { ZLoader } from './loader';

import { GenerateOptions, TGuestRow } from '../../..';
import { GenerateHTMLOptions, TGuest } from '../../../types';
import { Utils } from '../utils';

export class ZGenerator<G extends TGuest = TGuest> {
  app!: Express;
  browser!: Browser;
  exiftool!: ExifTool;
  imageServer!: Server;

  fontsUrl: string;
  formatOptions?: FormatOptions;
  htmlOptions?: HTMLOptions;
  paths: ResourcePaths;

  /**
   * Constructors a new generator.
   * @param options The generator constructor options.
   */
  constructor(options: GeneratorConstructor) {
    const { fontsUrl, formatOptions, htmlOptions, root } = options;
    const outputDir = `${root}/.out`;
    const viewsDir = `${root}/views`;
    const imagesDir = `${viewsDir}/images`;

    this.app = express();
    this.app.use(express.static(imagesDir));

    this.fontsUrl = fontsUrl;
    this.formatOptions = formatOptions;
    this.htmlOptions = htmlOptions;
    this.paths = {
      outputDir,
      viewsDir,
      imagesDir,
      templatesDir: `${viewsDir}/templates`,
      stylesInputFile: `${viewsDir}/styles/App.scss`,
      stylesOutputFile: `${outputDir}/css/main.css`
    };
  }

  /**
   * Triggers the generate method.
   * @param options The generate CLI options.
   * @param loadingOptions The generate loading options.
   */
  async execute<R extends TGuestRow>(
    options: GenerateOptions,
    loadingOptions: GenerateLoadingOptions<G, R>
  ): Promise<void> {
    const { all, format, name, refreshCache } = options;
    const { loader, filter } = loadingOptions;

    Utils.setup(this.paths.outputDir);
    this.transpileSass();

    if (format) {
      this.copyImages();
    }

    let guests = await loader.load(refreshCache);
    if (filter) {
      guests = guests.filter(filter);
    }

    this.generateHTMLFiles(guests, { all, name });

    if (format === 'png') {
      await this.generatePNGFiles();
    } else if (format === 'pdf') {
      await this.generatePDFFiles();
    }

    Utils.tearDown();
  }

  /**
   * Generates the HTML files for each member on the guest list from the template.
   * @param guests The list of guests to generate files for.
   * @param options The options for generating HTML.
   */
  generateHTMLFiles(guests: G[], { all, name }: GenerateHTMLOptions): void {
    invariant(guests.length, 'There are no guests to generate files for.');

    console.info('Generating HTML files...');
    const { outputDir, templatesDir } = this.paths;

    if (name) {
      const matchingGuest = guests.find((g) => {
        return g.name.toLowerCase().startsWith(name.toLowerCase());
      });
      invariant(
        matchingGuest,
        `No guest found with name starting with '${name}'.`
      );
      guests = [matchingGuest];
    } else if (!all) {
      guests = guests.slice(0, 10);
    }

    guests.forEach((guest) => {
      const outputFile = `${outputDir}/html/${guest.name}.html`;
      this.createHTMLFile(`${templatesDir}/index.ejs`, outputFile, guest);
    });
  }

  /**
   * Generates the PDF files from each of the guest HTML files.
   */
  async generatePDFFiles(): Promise<void> {
    if (!this.formatOptions) return;
    invariant(this.formatOptions.pdfOptions, 'No PDF options specified.');

    const { outputDir, templatesDir } = this.paths;
    fs.ensureDirSync(`${outputDir}/pdf`);
    console.info('Generating PDF files...');

    this.browser = await puppeteer.launch();
    this.exiftool = new ExifTool();
    this.imageServer = this.app.listen(3000);

    const filenames = fs.readdirSync(`${outputDir}/html`);
    const pageCount = fs.readdirSync(`${templatesDir}/pages`).length;
    const promises = filenames.map((filename) => {
      const [name] = filename.split('.');
      const html = Utils.readFileContent(`${outputDir}/html/${name}.html`);
      return this.createPDFFile(html, name, pageCount);
    });

    await Promise.all(promises);
    await this.browser.close();
    await this.exiftool.end();
    this.imageServer.close();
  }

  /**
   * Generates the PNG files from each of the guest HTML files.
   */
  async generatePNGFiles(): Promise<void> {
    if (!this.formatOptions) return;
    invariant(this.formatOptions.pngOptions, 'No PNG options specified.');

    const { outputDir } = this.paths;
    fs.ensureDirSync(`${outputDir}/png`);
    console.info('Generating PNG files...');

    this.browser = await puppeteer.launch();
    this.imageServer = this.app.listen(3000);

    const filenames = fs.readdirSync(`${outputDir}/html`);
    const promises = filenames.map((filename) => {
      const [name] = filename.split('.');
      const html = Utils.readFileContent(`${outputDir}/html/${name}.html`);
      return this.createPNGFile(html, name);
    });

    await Promise.all(promises);
    await this.browser.close();
    this.imageServer.close();
  }

  /**
   * Helper function for generating HTML pages.
   * @param templateFile The input template EJS file.
   * @param outputFile The HTML file output path.
   * @param guest The guest whose details will go on the invite.
   */
  createHTMLFile(templateFile: string, outputFile: string, guest: G): void {
    const { viewsDir, stylesOutputFile } = this.paths;
    try {
      const data = fs.readFileSync(templateFile, 'utf8');
      const template = ejs.compile(data, { root: viewsDir });
      const html = template({
        guest,
        cssFile: stylesOutputFile,
        fontsUrl: this.fontsUrl,
        ...this.htmlOptions?.locals
      });
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
  async createPDFFile(
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
      const page = await this.browser.newPage();
      await page.goto(`data:text/html,${encodeURIComponent(html)}`);
      await page.addStyleTag({ url: this.fontsUrl });
      await page.addStyleTag({ path: stylesOutputFile });
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

  async createPNGFile(html: string, guestName: string) {
    if (!this.formatOptions) return;
    const { outputDir, stylesOutputFile } = this.paths;
    const { nomenclator, pngOptions } = this.formatOptions;

    const filename = nomenclator(guestName);
    const outputPath = `${outputDir}/png/${filename}.png`;
    const viewport = translateViewportOptions(pngOptions!.viewportOptions);

    try {
      const page = await this.browser.newPage();
      await page.goto(`data:text/html,${encodeURIComponent(html)}`);
      await page.addStyleTag({ url: this.fontsUrl });
      await page.addStyleTag({ path: stylesOutputFile });
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
  transpileSass(): void {
    const { outputDir, stylesInputFile, stylesOutputFile } = this.paths;
    console.info('Transpiling SCSS to CSS...');
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
  copyImages(): void {
    const { outputDir, imagesDir } = this.paths;
    const imagesOutputDir = `${outputDir}/images`;

    console.info('Copying images to output...');
    fs.ensureDirSync(imagesOutputDir);
    try {
      fs.copySync(imagesDir, imagesOutputDir);
    } catch (e) {
      Utils.error(e);
    }
  }
}

/**
 * Translates the incoming viewport options to values acceptable by puppeteer.
 * @param options The viewport options.
 * @returns The puppeteer viewport options.
 */
function translateViewportOptions(
  options: ViewportOptions
): puppeteer.Viewport {
  const CONVERSION_FACTOR = 96;
  const { deviceScaleFactor = 1, scale = 1 } = options;

  const convert = (measurement: number | string): number => {
    if (typeof measurement === 'string') {
      measurement = parseFloat(measurement.replace('in', '')) * CONVERSION_FACTOR;
    }
    return measurement * scale;
  };

  const width = convert(options.width);
  const height = convert(options.height);

  return {
    width,
    height,
    deviceScaleFactor
  };
}

interface GeneratorConstructor {
  fontsUrl: string;
  root: string;
  htmlOptions?: HTMLOptions;
  formatOptions?: FormatOptions;
}

type GenerateLoadingOptions<G extends TGuest, R extends TGuestRow> = {
  loader: ZLoader<G, R>;
  filter?: (g: G) => boolean;
};

interface HTMLOptions {
  locals?: Record<string, unknown>;
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

type ViewportOptions = {
  width: number | string;
  height: number | string;
  scale?: number;
  deviceScaleFactor?: number;
};

interface ResourcePaths {
  outputDir: string;
  viewsDir: string;
  imagesDir: string;
  templatesDir: string;
  stylesInputFile: string;
  stylesOutputFile: string;
}
