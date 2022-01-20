import Ziventi, {
  CLI,
  Spreadsheet,
  Utils,
  ZGenerator,
  ZPublisher,
} from '@ziventi/utils';

import { Guest, Rank } from './classes';
import { Loader } from './settings';

const {
  NUMBER_BOLA,
  NUMBER_CHIDERA,
  NUMBER_DEBORAH,
  SS_PUBLIC_LISTS_ID,
  SS_WISHLIST_SHEET_ID,
} = process.env;

const PUBLIC_LISTS_URL = Spreadsheet.getSpreadsheetUrl(SS_PUBLIC_LISTS_ID!);
const WISHLIST_URL = `${PUBLIC_LISTS_URL}#gid=${SS_WISHLIST_SHEET_ID!}`;
const SHEET_NAME = 'Guest List';

(async () => {
  const Generator = new ZGenerator({
    htmlOptions: {
      ejsLocals: {
        contacts: {
          Bola: NUMBER_BOLA,
          Chidera: NUMBER_CHIDERA,
          Deborah: NUMBER_DEBORAH,
        },
        resources: Utils.compileResources(process.cwd()),
        lists: {
          guest: PUBLIC_LISTS_URL,
          wish: WISHLIST_URL,
        },
      },
    },
    fontsUrl: Utils.buildFontUrl({
      Courgette: null,
      'Great Vibes': null,
      Poppins: 'wght@400;700',
      'Style Script': null,
      Tangerine: 'wght@400;700',
    }),
    formatOptions: {
      archiveTitle: '#Z25 Invites',
      nomenclator: (guestName) => `#Z25 Invitation to ${guestName}`,
      pdfOptions: {
        format: 'a4',
      },
    },
    loadingOptions: {
      loader: Loader,
    },
  });

  const Publisher = new ZPublisher({
    loadingOptions: {
      loader: Loader,
      processor: (guests: Guest[]) => {
        return guests
          .filter((g) => g.invited)
          .sort((a, b) => (a.name > b.name ? 1 : -1));
      },
      sheet: SHEET_NAME,
    },
    postPublish: {
      sheet: SHEET_NAME,
      range: 'D3:E14',
      updater: (guests: Guest[]) => {
        const getTotalMatching = (
          matcher: Ziventi.ConfirmStatus | ((g: Guest) => boolean)
        ): string => {
          return guests
            .filter((g) => {
              if (typeof matcher === 'function') {
                return matcher(g);
              } else {
                return g.invited && g.status === matcher;
              }
            })
            .length.toString();
        };

        return {
          D3: 'Only people who have received invites so far will appear here; this list will be updated gradually. Check back here occasionally to see people you know whom you can tag along with.',
          D9: 'Current Total of Invitees:',
          E9: getTotalMatching((g) => g.invited),
          D10: '\u2714  No. of Confirmed:',
          E10: getTotalMatching('Confirmed'),
          D11: '\uD83D\uDD38 No. of Tentative:',
          E11: getTotalMatching('Tentative'),
          D12: '\uD83D\uDD57 No. of Awaiting:',
          E12: getTotalMatching('Awaiting'),
          D13: '\u274C No. of Unavailable:',
          E13: getTotalMatching('Unavailable'),
          D14: 'No. of Invites Remaining:',
          E14: getTotalMatching((g) => !g.invited && g.rank <= Rank.D),
        };
      },
    },
  });

  await CLI({
    generate: Generator.execute,
    publish: Publisher.execute,
  });
})();
