import { CLI, Utils, ZGenerator, ZPublisher } from '@ziventi/utils';

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
    },
    loadingOptions: {
      loader: Loader
    }
  });

  const Publisher = new ZPublisher({
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

  await CLI({
    generate: Generator.execute,
    publish: Publisher.execute
  });
})();
