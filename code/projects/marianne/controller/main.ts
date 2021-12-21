import { CLI, Utils, ZGenerator, ZPublisher } from '@ziventi/utils';

import { Guest, GuestRow } from './classes';
import { Loader } from './settings';

(async () => {
  const Generator = new ZGenerator<Guest, GuestRow>({
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
    },
    loadingOptions: {
      loader: Loader
    }
  });

  const Publisher = new ZPublisher<Guest, GuestRow>({
    loadingOptions: {
      loader: Loader,
      reducer: {
        property: 'category',
        sheetMap: {
          Family: 'Guest List (Family)',
          Friends: 'Guest List (Friends)'
        }
      }
    }
  });

  CLI({
    generate: Generator.execute,
    publish: Publisher.execute
  });
})();
