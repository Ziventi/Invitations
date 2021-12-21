import {
  CLI,
  GenerateOptions,
  PublishOptions,
  Utils,
  ZGenerator,
  ZPublisher
} from '@ziventi/utils';

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
    }
  });

  const Publisher = new ZPublisher<Guest, GuestRow>();

  CLI({
    generate: (options: GenerateOptions) => {
      Generator.execute(options, {
        loader: Loader
      });
    },
    publish: (options: PublishOptions) => {
      Publisher.execute(options, {
        loader: Loader,
        reducer: {
          property: 'category',
          sheetMap: {
            Family: 'Guest List (Family)',
            Friends: 'Guest List (Friends)'
          }
        }
      });
    }
  });
})();
