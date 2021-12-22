import {
  CLI,
  Spreadsheet,
  Utils,
  ZGenerator,
  ZPublisher
} from '@ziventi/utils';

import { Loader } from './settings';

const {
  NUMBER_BOLA,
  NUMBER_CHIDERA,
  NUMBER_DEBORAH,
  SS_PUBLIC_LISTS_ID,
  SS_WISHLIST_SHEET_ID
} = process.env;

const PUBLIC_LISTS_URL = Spreadsheet.getSpreadsheetUrl(SS_PUBLIC_LISTS_ID!);
const WISHLIST_URL = `${PUBLIC_LISTS_URL}#gid=${SS_WISHLIST_SHEET_ID!}`;

(async () => {
  const Generator = new ZGenerator({
    htmlOptions: {
      locals: {
        contacts: {
          Bola: NUMBER_BOLA,
          Chidera: NUMBER_CHIDERA,
          Deborah: NUMBER_DEBORAH
        },
        resources: Utils.compileResources(),
        lists: {
          guest: PUBLIC_LISTS_URL,
          wish: WISHLIST_URL
        }
      }
    },
    fontsUrl: Utils.buildFontUrl({
      Courgette: null,
      'Great Vibes': null,
      Poppins: 'wght@400;700',
      'Style Script': null,
      Tangerine: 'wght@400;700'
    }),
    formatOptions: {
      nomenclator: (guestName) => `#Z25 Invitation to ${guestName}`,
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
      sheet: 'Guest List'
    }
  });

  await CLI({
    generate: Generator.execute,
    publish: Publisher.execute
  });
})();
