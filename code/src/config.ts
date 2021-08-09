import * as dotenv from 'dotenv';
import { ExifTool } from 'exiftool-vendored';
import { GoogleSpreadsheet } from 'google-spreadsheet';

import path from 'path';

import credentials from '../key.json';

dotenv.config();

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
doc.useServiceAccountAuth(credentials);

export const DOCUMENT = doc;
export const EXIFTOOL = new ExifTool({ taskTimeoutMillis: 10000 });
export const OUTPUT_DIR = path.resolve(__dirname, `../dist`);
