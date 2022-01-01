import { Guest } from './classes';
import { Loader, rootDir } from './settings';

import { GenerateOptions, Utils, ZGenerator } from '../../../utils';

export default async function main(options: GenerateOptions): Promise<void> {
  const Generator = new ZGenerator({
    htmlOptions: {
      hashParams: {
        spreadsheetId: process.env.SS_PUBLIC_ID!,
        sheetTitle: 'Guest List'
      }
    },
    fontsUrl: Utils.buildFontUrl({ Tangerine: 'wght@400;700' }),
    formatOptions: {
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
