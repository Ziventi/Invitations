import type { GenerateOptions } from '@ziventi/utils';
import { Utils, ZGenerator } from '@ziventi/utils';

import { GuestRow } from '../utils/classes';
import { Loader, PROJECT_ROOT } from '../utils/shared';

const Generator = new ZGenerator({
  fontsUrl: Utils.buildFontUrl({ Tangerine: 'wght@400;700' }),
  formatOptions: {
    nomenclator: (name: string) => name,
    pngOptions: {
      viewportOptions: {
        width: '3.5in',
        height: '2in',
        scale: 2,
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
