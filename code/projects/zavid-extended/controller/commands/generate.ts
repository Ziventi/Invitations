import type { GenerateOptions } from '@ziventi/utils';
import { ZGenerator, ZLoader, Utils } from '@ziventi/utils';
import * as dotenv from 'dotenv';

import * as Paths from '../utils/paths';
import { marshalGuests } from '../utils/shared';

dotenv.config();

const Generator = new ZGenerator({
  htmlOptions: {
    fontsUrl: Paths.FONTS_URL,
    locals: {
      cssFile: Paths.STYLES_OUTPUT_FILE,
      fontsUrl: Paths.FONTS_URL
    }
  },
  formatOptions: {
    nomenclator: (name: string) => name,
    pngOptions: {
      viewportOptions: {
        width: 672,
        height: 384,
        deviceScaleFactor: 4
      }
    }
  },
  root: Paths.PROJECT_ROOT
});

const Loader = new ZLoader({
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

  const guests = (await Loader.load(refreshCache)).filter(
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
