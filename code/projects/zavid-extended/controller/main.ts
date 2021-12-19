import type { GenerateOptions } from '@ziventi/utils';
import { CLI, Utils, ZGenerator } from '@ziventi/utils';

import { GuestRow } from './classes';
import { Loader } from './settings';

(async () => {
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
    }
  });

  CLI({
    generate: (options: GenerateOptions) => {
      Generator.execute<GuestRow>(options, {
        loader: Loader,
        filter: (g) => g.status === 'Confirmed'
      });
    }
  });
})();
