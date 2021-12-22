// import type { GenerateOptions } from '@ziventi/utils';
// import { Generator, Loader, Spreadsheet, Utils } from '@ziventi/utils';
// import * as dotenv from 'dotenv';
// import express from 'express';

// import * as Paths from '../utils/paths';
// import { marshalGuests } from '../utils/shared';

// dotenv.config();

// const app = express();
// const {
//   NUMBER_BOLA,
//   NUMBER_CHIDERA,
//   NUMBER_DEBORAH,
//   SS_PUBLIC_LISTS_ID,
//   SS_WISHLIST_SHEET_ID
// } = process.env;

// app.use(express.static(Paths.IMAGES_DIR));

// const PUBLIC_LISTS_URL = Spreadsheet.getSpreadsheetUrl(SS_PUBLIC_LISTS_ID!);
// const WISHLIST_URL = `${PUBLIC_LISTS_URL}#gid=${SS_WISHLIST_SHEET_ID!}`;

// const resources: Record<string, unknown> = {};

// (async () => {
//   const notices = await import(`${Paths.RESOURCES_DIR}/notices.json`);
//   const agenda = await import(`${Paths.RESOURCES_DIR}/agenda.json`);
//   resources.notices = notices.default;
//   resources.agenda = agenda.default;
// })();

// const ZGenerator = new Generator({
//   htmlOptions: {
//     locals: {
//       cssFile: Paths.STYLES_OUTPUT_FILE,
//       contacts: {
//         Bola: NUMBER_BOLA,
//         Chidera: NUMBER_CHIDERA,
//         Deborah: NUMBER_DEBORAH
//       },
//       resources,
//       lists: {
//         guest: PUBLIC_LISTS_URL,
//         wish: WISHLIST_URL
//       }
//     }
//   },
//   pdfOptions: {
//     namer: (name) => `#Z25 Invitation to ${name}`
//   },
//   paths: {
//     imagesDir: Paths.IMAGES_DIR,
//     fontsUrl: Paths.FONTS_URL,
//     outputDir: Paths.OUTPUT_DIR,
//     stylesInputFile: Paths.STYLES_INPUT_FILE,
//     stylesOutputFile: Paths.STYLES_OUTPUT_FILE,
//     templatesDir: Paths.TEMPLATES_DIR,
//     viewsDir: Paths.VIEWS_DIR
//   }
// });

// const ZLoader = new Loader({
//   cacheName: 'zavid',
//   spreadsheetId: process.env.SS_PRIVATE_GUESTLIST_ID!,
//   guestMarshaler: marshalGuests
// });

// /**
//  * Generates the invitation files.
//  * @param options The options supplied via the CLI.
//  */
// export default async function generate(options: GenerateOptions) {
//   const { all, name, refreshCache, withPdf } = options;

//   Utils.setup(Paths.OUTPUT_DIR);
//   ZGenerator.transpileSass();
//   const guests = await ZLoader.load(refreshCache);
//   await ZGenerator.generateHTMLFiles(guests, {
//     all,
//     name
//   });
//   if (withPdf) {
//     await ZGenerator.generatePDFFiles();
//   }
//   Utils.tearDown();
// }
