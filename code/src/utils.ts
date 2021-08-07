import fs from 'fs-extra';

import { OUTPUT_DIR } from './config';

/**
 * Cleans the output directory.
 */
export function clean() {
  fs.removeSync(OUTPUT_DIR);
}

/**
 * Catch error, log to console and exit process.
 * @param err The caught error.
 */
export function logErrorAndExit(err: NodeJS.ErrnoException | null) {
  if (err) {
    console.error(err);
    process.exit(0);
  }
}
