import type { GenerateOptions } from '@ziventi/utils';
import { Generator, Loader, Utils } from '@ziventi/utils';
import * as dotenv from 'dotenv';

import * as Paths from '../utils/paths';
import { marshalGuests } from '../utils/shared';

dotenv.config();

const ZGenerator = new Generator({
  htmlOptions: {
    locals: {
      cssFile: Paths.STYLES_OUTPUT_FILE,
      fontsUrl: Paths.FONTS_URL
    }
  },
  pdfOptions: {
    namer: (name) => name
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
  const { all, name, refreshCache, withPdf } = options;

  Utils.setup(Paths.OUTPUT_DIR);
  ZGenerator.transpileSass();
  ZGenerator.copyImages();
  const guests = (await ZLoader.load(refreshCache)).filter(
    (g) => g.status === 'Confirmed'
  );

  ZGenerator.generateHTMLFiles(guests, { all, name });

  if (withPdf) {
    await ZGenerator.generatePNGFiles();
  }
  Utils.tearDown();
}
