import ejs from 'ejs';
import { ExifTool } from 'exiftool-vendored';
import express from 'express';
import fs from 'fs-extra';
import sass from 'node-sass';
import puppeteer, { Browser } from 'puppeteer';

import { Server } from 'http';

import { GenerateHTMLOptions, TGuest } from '../../../types';
import { Paths } from '../../paths';
import { Utils } from '../utils';

const app = express();

export class Generator<G extends TGuest = TGuest> {
  browser!: Browser;
  exiftool!: ExifTool;
  imageServer!: Server;

  htmlOptions: HTMLOptions;
  paths: Paths;
  pdfOptions: PDFOptions;

  constructor({ htmlOptions, paths, pdfOptions }: FileConstructor) {
    this.htmlOptions = htmlOptions;
    this.paths = paths;
    this.pdfOptions = pdfOptions;
  }

  /**
   * Generates the HTML files for each member on the guest list from the template.
   * @param guests The list of guests to generate files for.
   * @param options The options for generating HTML.
   * @returns A promise fulfilled when all HTML files have been generated.
   */
  async generateHTMLFiles(
    guests: G[],
    { all, name }: GenerateHTMLOptions
  ): Promise<void> {
    const { outputDir, templatesDir } = this.paths;

    console.info('Generating HTML files...');
    const TEST_NUMBER = 17;

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
      guests = guests.slice(TEST_NUMBER, TEST_NUMBER + 1);
    }
    // else {
    //   guests = guests.filter(
    //     (g) => g.invited && g.confirmStatus === 'awaiting'
    //   );
    // }

    const promises = guests.map((guest) => {
      const outputFile = `${outputDir}/html/${guest.name}.html`;
      return this.createHTMLPage(
        `${templatesDir}/index.ejs`,
        outputFile,
        guest
      );
    });
    await Promise.all(promises);
  }

  /**
   * Generates the PDF files from each of the guest HTML files.
   * @param refreshCache Indicates whether the data cache should be refreshed.
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
   * Helper function for generating HTML pages.
   * @param templateFile The input template EJS file.
   * @param outputFile The HTML file output path.
   * @param guest The guest whose details will go on the invite.
   */
  async createHTMLPage<T>(
    templateFile: string,
    outputFile: string,
    guest: T
  ): Promise<void> {
    const { viewsDir } = this.paths;
    try {
      const data = await fs.readFile(templateFile, 'utf8');
      const template = ejs.compile(data, { root: viewsDir });

      const html = template({
        guest,
        ...this.htmlOptions.locals
      });
      await fs.outputFile(outputFile, html);
    } catch (err) {
      Utils.error(err);
    }
  }

  /**
   * Creates a single PDF file for a guest from the HTML file.
   * @param html The HTML string to be used for generating the PDF.
   * @param name The name of the guest.
   * @param pageCount The number of pages to print..
   */
  async createPDFPage(
    html: string,
    name: string,
    pageCount: number
  ): Promise<void> {
    const { outputDir, fontsUrl, stylesOutputFile } = this.paths;

    const pdfFileName = this.pdfOptions.namer(name);
    const outputPath = `${outputDir}/pdf/${pdfFileName}.pdf`;
    if (!this.browser) return;

    try {
      const page = await this.browser.newPage();
      await page.goto(`data:text/html,${encodeURIComponent(html)}`);
      await page.addStyleTag({ url: fontsUrl });
      await page.addStyleTag({ path: stylesOutputFile });
      await page.evaluateHandle('document.fonts.ready');
      await page.pdf({
        format: 'a4',
        path: outputPath,
        pageRanges: `1-${pageCount}`,
        printBackground: true
      });

      if (this.exiftool) {
        await this.exiftool.write(outputPath, { Title: pdfFileName }, [
          '-overwrite_original'
        ]);
      }
    } catch (err) {
      Utils.error(err);
    }
  }

  /**
   * Transpiles the SCSS files to CSS.
   */
  transpileSass() {
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
}

interface FileConstructor {
  htmlOptions: HTMLOptions;
  paths: Paths;
  pdfOptions: PDFOptions;
}

interface HTMLOptions {
  locals: Record<string, unknown>;
}

interface PDFOptions {
  namer: (name: string) => string;
}

interface Paths {
  fontsUrl: string;
  outputDir: string;
  templatesDir: string;
  stylesInputFile: string;
  stylesOutputFile: string;
  viewsDir: string;
}
