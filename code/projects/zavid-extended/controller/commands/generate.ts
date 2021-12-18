import type { GenerateOptions } from '@ziventi/utils';
import { ZGenerator } from '@ziventi/utils';

import path from 'path';

import { GuestRow } from '../utils/classes';
import { Loader } from '../utils/shared';

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

/**
 * Generates the invitation files.
 * @param options The options supplied via the CLI.
 */
export default async function generate(options: GenerateOptions) {
  Generator.execute<GuestRow>(options, {
    loader: Loader,
    filter: (g) => g.status === 'Confirmed'
  });
}
