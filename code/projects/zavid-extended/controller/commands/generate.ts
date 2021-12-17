import type { GenerateOptions } from '@ziventi/utils';
import { Utils, ZGenerator, ZLoader } from '@ziventi/utils';
import * as dotenv from 'dotenv';

import path from 'path';

import { marshalGuests } from '../utils/shared';

dotenv.config();

const PROJECT_ROOT = path.resolve(__dirname, '../..');

const url = new URL('https://fonts.googleapis.com/css2');
url.searchParams.append('family', 'Tangerine:wght@400;700');
url.searchParams.append('display', 'swap');
export const FONTS_URL = url.href;

const Generator = new ZGenerator({
  fontsUrl: FONTS_URL,
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
  root: PROJECT_ROOT
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

  Utils.setup(`${PROJECT_ROOT}/.out`);
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
