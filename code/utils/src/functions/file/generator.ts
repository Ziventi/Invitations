import ejs from 'ejs';
import { ExifTool } from 'exiftool-vendored';
import express from 'express';
import fs from 'fs-extra';
import sass from 'node-sass';
import puppeteer, { Browser, PaperFormat, Viewport } from 'puppeteer';

import { Server } from 'http';

import { GenerateHTMLOptions, TGuest } from '../../../types';
import { Paths } from '../../paths';
import { Utils } from '../utils';

const app = express();
app.use(express.static(`${Paths.ROOT}/projects/zavid-extended/views/images`));

export class ZGenerator<G extends TGuest = TGuest> {
  browser!: Browser;
  exiftool!: ExifTool;
  imageServer!: Server;

  htmlOptions: HTMLOptions;
  paths: ResourcePaths;
  pdfOptions?: PDFOptions;
  pngOptions?: PNGOptions;

  /**
   * Constructors a new generator.
   * @param options The generator constructor options.
   */
  constructor({
    htmlOptions,
    pdfOptions,
    pngOptions,
    paths
  }: GeneratorConstructor) {
    this.htmlOptions = htmlOptions;
    this.pdfOptions = pdfOptions;
    this.pngOptions = pngOptions;
    this.paths = paths;
  }

  /**
   * Generates the HTML files for each member on the guest list from the template.
   * @param guests The list of guests to generate files for.
   * @param options The options for generating HTML.
   */
  generateHTMLFiles(guests: G[], { all, name }: GenerateHTMLOptions): void {
    if (!guests.length) {
      throw new Error('No guests.');
    }

    const { outputDir, templatesDir } = this.paths;
    console.info('Generating HTML files...');

    if (name) {
      try {
        const matchingGuest = guests.find((g) =>
          g.name.toLowerCase().startsWith(name.toLowerCase())
        );
        if (matchingGuest) {
          guests = [matchingGuest];
        } else {
          throw new Error(`No guest found with name starting with '${name}'.`);
        }
      } catch (e) {
        Utils.error(e);
      }
    } else if (!all) {
      guests = guests.slice(0, 10);
    }

    guests.forEach((guest) => {
      const outputFile = `${outputDir}/html/${guest.name}.html`;
      this.createHTMLPage(`${templatesDir}/index.ejs`, outputFile, guest);
    });
  }

  /**
   * Generates the PDF files from each of the guest HTML files.
   */
  async generatePDFFiles(): Promise<void> {
    const { outputDir, templatesDir } = this.paths;

    fs.ensureDirSync(`${outputDir}/pdf`);
    console.info('Generating PDF files...');

    this.browser = await puppeteer.launch();
    this.exiftool = new ExifTool();
    this.imageServer = app.listen(3000);

    const filenames = fs.readdirSync(`${outputDir}/html`);
    const pageCount = fs.readdirSync(`${templatesDir}/pages`).length;
    const promises = filenames.map((filename) => {
      const [name] = filename.split('.');
      const html = Utils.readFileContent(`${outputDir}/html/${name}.html`);
      return this.createPDFPage(html, name, pageCount);
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
    const { outputDir } = this.paths;

    fs.ensureDirSync(`${outputDir}/png`);
    console.info('Generating PNG files...');

    this.browser = await puppeteer.launch();
    this.imageServer = app.listen(3000);

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
  createHTMLPage<T>(templateFile: string, outputFile: string, guest: T): void {
    const { viewsDir } = this.paths;
    try {
      const data = fs.readFileSync(templateFile, 'utf8');
      const template = ejs.compile(data, { root: viewsDir });
      const html = template({
        guest,
        ...this.htmlOptions.locals
      });
      fs.outputFileSync(outputFile, html);
    } catch (err) {
      Utils.error(err);
    }
  }

  /**
   * Creates a single PDF file for a guest from the HTML file.
   * @param html The HTML string to be used for generating the PDF.
   * @param name The name of the guest.
   * @param pageCount The number of pages to print.
   */
  async createPDFPage(
    html: string,
    name: string,
    pageCount: number
  ): Promise<void> {
    if (!this.pdfOptions) return;

    const { fileNamer, format = 'a4' } = this.pdfOptions;
    const { outputDir, fontsUrl, stylesOutputFile } = this.paths;

    const pdfFileName = fileNamer(name);
    const outputPath = `${outputDir}/pdf/${pdfFileName}.pdf`;
    if (!this.browser) {
      throw new Error('No browser.');
    }

    try {
      const page = await this.browser.newPage();
      await page.goto(`data:text/html,${encodeURIComponent(html)}`);
      await page.addStyleTag({ url: fontsUrl });
      await page.addStyleTag({ path: stylesOutputFile });
      await page.evaluateHandle('document.fonts.ready');
      await page.pdf({
        format,
        path: outputPath,
        pageRanges: `1-${pageCount}`,
        printBackground: true
      });
    } catch (err) {
      Utils.error(err);
    }
  }

  async createPNGFile(html: string, guestName: string) {
    if (!this.pngOptions) return;

    const { outputDir, fontsUrl, stylesOutputFile } = this.paths;
    const { fileNamer, viewportOptions } = this.pngOptions;

    const filename = fileNamer(guestName);
    const outputPath = `${outputDir}/png/${filename}.png`;

    try {
      const page = await this.browser.newPage();
      await page.goto(`data:text/html,${encodeURIComponent(html)}`);
      await page.addStyleTag({ url: fontsUrl });
      await page.addStyleTag({ path: stylesOutputFile });
      await page.setViewport(viewportOptions);
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

interface GeneratorConstructor {
  htmlOptions: HTMLOptions;
  paths: ResourcePaths;
  pdfOptions?: PDFOptions;
  pngOptions?: PNGOptions;
}

interface HTMLOptions {
  locals: Record<string, unknown>;
}

interface FormatOptions {
  fileNamer: (name: string) => string;
}

interface PDFOptions extends FormatOptions {
  format?: PaperFormat;
}

interface PNGOptions extends FormatOptions {
  viewportOptions: Pick<Viewport, 'width' | 'height' | 'deviceScaleFactor'>;
}

interface ResourcePaths {
  fontsUrl: string;
  imagesDir: string;
  outputDir: string;
  stylesInputFile: string;
  stylesOutputFile: string;
  templatesDir: string;
  viewsDir: string;
}
