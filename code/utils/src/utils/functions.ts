import CryptoJS from 'crypto-js';
import fs from 'fs-extra';

import path from 'path';

import { logger } from './logger';

const ENCRYPTION_KEY = 'key';

export namespace Utils {
  /**
   * Builds the Google Fonts URL with specified fonts parameters.
   * @returns The full URL.
   */
  export function buildFontUrl(fonts: Record<string, string | null>): string {
    const url = new URL('https://fonts.googleapis.com/css2');
    Object.entries(fonts).forEach(([font, weights]) => {
      const fontWeights = weights ? `${font}:${weights}` : font;
      url.searchParams.append('family', fontWeights);
    });
    url.searchParams.append('display', 'swap');
    return url.href;
  }

  /**
   * Compiles the list of resource files for use as EJS locals.
   * @returns The map of resource names to contents.
   */
  export function compileResources(): Record<string, any> {
    const resources: Record<string, any> = {};
    const resourcesDir = path.join(process.cwd(), './views/resources');

    fs.readdirSync(resourcesDir).forEach((filename) => {
      const filePath = path.join(resourcesDir, filename);
      const file = fs.readFileSync(filePath, { encoding: 'utf8' });
      const { name } = path.parse(filePath);
      resources[name] = JSON.parse(file);
    });

    return resources;
  }

  /**
   * Encrypts JSON and forms a URL-encoded hash.
   * @param json The JSON to encrypt.
   * @returns The encrypted hash.
   */
  export function encryptJSON<T>(json: T): string {
    const jsonString = JSON.stringify(json);
    const hash = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
    const component = encodeURIComponent(hash);
    return component;
  }
  
  /**
   * Decrypts an encrypted component with the encryption key.
   * @param hash The hash to decrypt.
   * @returns The decrypted JSON.
   */
  export function decryptJSON<T>(hash: string): T {
    const component = decodeURIComponent(hash);
    const value = CryptoJS.AES.decrypt(component, ENCRYPTION_KEY).toString(
      CryptoJS.enc.Utf8
    );
    const json = JSON.parse(value);
    return json;
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
      logger.error('Error: ' + err.message);
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
    clean(outDir);
    fs.ensureDirSync(outDir);
  }
}
