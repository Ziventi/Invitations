import fs from 'fs-extra';

import { OUTPUT_DIR } from './paths';

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
export function error(err: NodeJS.ErrnoException | null) {
  if (err) {
    console.error(err.message);
    process.exit(0);
  }
}

/**
 * Reads content from a specified file.
 * @param file The file path to read from.
 * @returns The content as a string.
 */
export function readFileContent(file: string) {
  const html = fs.readFileSync(file, { encoding: 'utf8' });
  return html;
}

/**
 * Start execution timer, clean and ensure output directory exists.
 */
export function setup() {
  console.time('Time');
  clean();
  fs.ensureDirSync(OUTPUT_DIR);
}

/**
 * Stop and display execution timer.
 */
export function tearDown() {
  console.timeEnd('Time');
}
