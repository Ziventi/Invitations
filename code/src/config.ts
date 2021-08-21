import * as dotenv from 'dotenv';
import { ExifTool } from 'exiftool-vendored';
import { GoogleSpreadsheet } from 'google-spreadsheet';

import credentials from '../key.json';

dotenv.config();

const spreadsheet = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
spreadsheet.useServiceAccountAuth(credentials);

export const EXIFTOOL = new ExifTool();
export const SPREADSHEET = spreadsheet;