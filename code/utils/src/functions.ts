import fs from 'fs-extra';

/**
 * Retrieves the full accessible spreadsheet URL using a specified ID.
 * @param spreadsheetID The spreadsheet ID.
 * @returns The full URL of the spreadsheet.
 */
export function getSpreadsheetUrl(spreadsheetID: string) {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetID}`;
}

/**
 * Cleans the output directory.
 * @param outDir The path to the output directory.
 */
export function clean(outDir: string) {
  fs.removeSync(outDir);
}

/**
 * Catch error, log to console and exit process.
 * @param err The caught error.
 */
export function error(err: any) {
  if (err) {
    console.error('Error: ' + err.message);
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
 * @param outDir The path to the output directory.
 */
export function setup(outDir: string) {
  console.time('Time');
  clean(outDir);
  fs.ensureDirSync(outDir);
}

/**
 * Stop and display execution timer.
 */
export function tearDown() {
  console.timeEnd('Time');
}
