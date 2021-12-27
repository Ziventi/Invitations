import path from 'path';

import { Guest } from './classes';
import { Loader } from './settings';

import { Utils, ZGenerator } from '../../../utils';

export default async function main(): Promise<void> {
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
      }
    },
    loadingOptions: {
      loader: Loader,
      processor: (guests: Guest[]) => {
        return guests.filter((g) => g.status === 'Confirmed');
      }
    },
    rootDir: path.resolve(__dirname, '..')
  });

  await Generator.execute({
    name: 'Aruna'
  });
}
