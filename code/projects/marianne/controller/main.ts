import type { GenerateOptions } from '@ziventi/utils';
import { CLI, Utils, ZGenerator } from '@ziventi/utils';

import { GuestRow } from './classes';
import { Loader } from './settings';

(async () => {
  const Generator = new ZGenerator({
    fontsUrl: Utils.buildFontUrl({
      Tangerine: 'wght@400;700',
      Courgette: 'wght@400;700',
      Montserrat: 'wght@400;700',
      Playball: null
    }),
    formatOptions: {
      nomenclator: (name: string) => name,
      pdfOptions: {
        format: 'a4'
      }
    }
  });

  CLI({
    generate: (options: GenerateOptions) => {
      Generator.execute<GuestRow>(options, {
        loader: Loader
      });
    }
  });
})();
