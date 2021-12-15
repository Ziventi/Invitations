import type { GenerateOptions } from '@ziventi/utils';
import { ZGenerator, Loader, Utils } from '@ziventi/utils';
import * as dotenv from 'dotenv';

import * as Paths from '../utils/paths';
import { marshalGuests } from '../utils/shared';

dotenv.config();

const fileNamer = (name: string) => name;

const Generator = new ZGenerator({
  htmlOptions: {
    locals: {
      cssFile: Paths.STYLES_OUTPUT_FILE,
      fontsUrl: Paths.FONTS_URL
    }
  },
  pdfOptions: {
    fileNamer
  },
  pngOptions: {
    fileNamer,
    viewportOptions: {
      width: 672,
      height: 384,
      deviceScaleFactor: 4
    }
  },
  paths: {
    imagesDir: Paths.IMAGES_DIR,
    fontsUrl: Paths.FONTS_URL,
    outputDir: Paths.OUTPUT_DIR,
    stylesInputFile: Paths.STYLES_INPUT_FILE,
    stylesOutputFile: Paths.STYLES_OUTPUT_FILE,
    templatesDir: Paths.TEMPLATES_DIR,
    viewsDir: Paths.VIEWS_DIR
  }
});

const ZLoader = new Loader({
  cacheName: 'zavid-extended',
  spreadsheetId: process.env.SS_PRIVATE_GUESTLIST_ID!,
  guestMarshaler: marshalGuests
});

/**
 * Generates the invitation files.
 * @param options The options supplied via the CLI.
 */
export default async function generate(options: GenerateOptions) {
  const { all, format, name, refreshCache } = options;

  Utils.setup(Paths.OUTPUT_DIR);
  Generator.transpileSass();

  if (format) {
    Generator.copyImages();
  }

  const guests = (await ZLoader.load(refreshCache)).filter(
    (g) => g.status === 'Confirmed'
  );

  Generator.generateHTMLFiles(guests, { all, name });

  if (format === 'png') {
    await Generator.generatePNGFiles();
  } else if (format === 'pdf') {
    await Generator.generatePDFFiles();
  }

  Utils.tearDown();
}
