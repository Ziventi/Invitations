import { CLI, Utils, ZGenerator } from '@ziventi/utils';

import { Guest } from './classes';
import { Loader } from './settings';

(async () => {
  const Generator = new ZGenerator({
    fontsUrl: Utils.buildFontUrl({ Tangerine: 'wght@400;700' }),
    formatOptions: {
      nomenclator: (name: string) => name,
      pdfOptions: {
        format: 'a4'
      }
    },
    loadingOptions: {
      loader: Loader,
      processor: (guests: Guest[]) => {
        return guests.filter((g) => g.status === 'Confirmed');
      }
    }
  });

  await CLI({
    generate: Generator.execute
  });
})();
