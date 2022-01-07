import Ziventi, { Utils, ZGenerator } from '@ziventi/utils';

import { Guest } from './classes';
import { Loader, rootDir } from './settings';

export default async function main(
  options: Ziventi.GenerateOptions
): Promise<void> {
  const Generator = new ZGenerator({
    htmlOptions: {
      hashParams: {
        spreadsheetId: process.env.TEST_SS_PUBLIC_ID!,
        sheetTitle: 'Guest List'
      }
    },
    fontsUrl: Utils.buildFontUrl({ Tangerine: 'wght@400;700' }),
    formatOptions: {
      archiveTitle: 'Test Project',
      nomenclator: (name: string) => name,
      pdfOptions: {
        format: 'a4'
      },
      pngOptions: {
        viewportOptions: {
          height: '11.75in',
          width: '8.25in'
        }
      }
    },
    loadingOptions: {
      loader: Loader,
      processor: (guests: Guest[]) => {
        return guests.filter((g) => g.status === 'Confirmed');
      }
    },
    rootDir
  });

  await Generator.execute(options);
}
