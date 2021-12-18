import fs from 'fs-extra';

export namespace Utils {
  /**
   * Builds the Google Fonts URL with specified fonts parameters.
   * @returns The full URL.
   */
  export function buildFontUrl(fonts: Record<string, string>): string {
    const url = new URL('https://fonts.googleapis.com/css2');
    Object.entries(fonts).forEach(([font, weights]) => {
      url.searchParams.append('family', `${font}:${weights}`);
    });
    url.searchParams.append('display', 'swap');
    return url.href;
  }

  /**
   * Cleans the output directory.
   * @param outDir The path to the output directory.
   */
  export function clean(outDir: string): void {
    fs.removeSync(outDir);
  }

  /**
   * Catch error, log to console and exit process.
   * @param err The caught error.
   */
  export function error(err: any): void {
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
  export function readFileContent(file: string): string {
    return fs.readFileSync(file, { encoding: 'utf8' });
  }

  /**
   * Start execution timer, clean and ensure output directory exists.
   * @param outDir The path to the output directory.
   */
  export function setup(outDir: string): void {
    console.time('Time');
    clean(outDir);
    fs.ensureDirSync(outDir);
  }

  /**
   * Stop and display execution timer.
   */
  export function tearDown(): void {
    console.timeEnd('Time');
  }
}
