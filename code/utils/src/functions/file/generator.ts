import ejs from 'ejs';
import { ExifTool } from 'exiftool-vendored';
import express, { Express } from 'express';
import fs from 'fs-extra';
import sass from 'node-sass';
import puppeteer, { Browser, PaperFormat, Viewport } from 'puppeteer';
import invariant from 'tiny-invariant';

import { Server } from 'http';

import { GenerateHTMLOptions, TGuest } from '../../../types';
import { Utils } from '../utils';

export class ZGenerator<G extends TGuest = TGuest> {
  app!: Express;
  browser!: Browser;
  exiftool!: ExifTool;
  imageServer!: Server;

  htmlOptions: HTMLOptions;
  formatOptions: FormatOptions;
  paths: ResourcePaths;

  /**
   * Constructors a new generator.
   * @param options The generator constructor options.
   */
  constructor({ htmlOptions, formatOptions, root }: GeneratorConstructor) {
    const outputDir = `${root}/.out`;
    const viewsDir = `${root}/views`;
    const imagesDir = `${viewsDir}/images`;

    this.app = express();
    this.app.use(express.static(viewsDir));

    this.htmlOptions = htmlOptions;
    this.formatOptions = formatOptions;
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
      this.createHTMLPage(`${templatesDir}/index.ejs`, outputFile, guest);
    });
  }

  /**
   * Generates the PDF files from each of the guest HTML files.
   */
  async generatePDFFiles(): Promise<void> {
    const { outputDir, templatesDir } = this.paths;
    const { pdfOptions } = this.formatOptions;

    invariant(pdfOptions, 'No PDF options specified.');

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
    const { pngOptions } = this.formatOptions;
    invariant(pngOptions, 'No PNG options specified.');

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
  createHTMLPage<T>(templateFile: string, outputFile: string, guest: T): void {
    const { fontsUrl, locals } = this.htmlOptions;
    const { viewsDir, stylesOutputFile } = this.paths;
    try {
      const data = fs.readFileSync(templateFile, 'utf8');
      const template = ejs.compile(data, { root: viewsDir });
      const html = template({
        guest,
        cssFile: stylesOutputFile,
        fontsUrl,
        ...locals
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
    const { outputDir, stylesOutputFile } = this.paths;
    const { nomenclator, pdfOptions } = this.formatOptions;

    const pdfFileName = nomenclator(name);
    const outputPath = `${outputDir}/pdf/${pdfFileName}.pdf`;

    try {
      const page = await this.browser.newPage();
      await page.goto(`data:text/html,${encodeURIComponent(html)}`);
      await page.addStyleTag({ url: this.htmlOptions.fontsUrl });
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
    const { outputDir, stylesOutputFile } = this.paths;
    const { nomenclator, pngOptions } = this.formatOptions;

    const filename = nomenclator(guestName);
    const outputPath = `${outputDir}/png/${filename}.png`;

    try {
      const page = await this.browser.newPage();
      await page.goto(`data:text/html,${encodeURIComponent(html)}`);
      await page.addStyleTag({ url: this.htmlOptions.fontsUrl });
      await page.addStyleTag({ path: stylesOutputFile });
      await page.setViewport(pngOptions!.viewportOptions);
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
  formatOptions: FormatOptions;
  root: string;
}

interface HTMLOptions {
  fontsUrl: string;
  locals: Record<string, unknown>;
}

interface FormatOptions {
  nomenclator: (name: string) => string;
  pdfOptions?: PDFOptions;
  pngOptions?: PNGOptions;
}

interface PDFOptions {
  format?: PaperFormat;
}

interface PNGOptions {
  viewportOptions: Pick<Viewport, 'width' | 'height' | 'deviceScaleFactor'>;
}

interface ResourcePaths {
  outputDir: string;
  viewsDir: string;
  imagesDir: string;
  templatesDir: string;
  stylesInputFile: string;
  stylesOutputFile: string;
}
