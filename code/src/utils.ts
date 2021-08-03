import rimraf from 'rimraf';

import fs from 'fs';

import { OUTPUT_DIR } from './config';

/**
 * Cleans the output directory.
 */
export function clean() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  rimraf(OUTPUT_DIR + '/*', module.exports.exit);
}

/**
 * Catch error, log to console and exit process.
 * @param err The caught error.
 */
export function exit(err: NodeJS.ErrnoException | null) {
  if (err) {
    console.error(err);
    process.exit(0);
  }
}
