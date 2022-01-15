import * as AES from 'crypto-js/aes';
import * as UTF8 from 'crypto-js/enc-utf8';
import * as dotenv from 'dotenv';
import fs from 'fs-extra';

import * as path from 'path';

import { Paths } from './constants';
import { logger } from './logger';

checkDotenv(
  dotenv.config({
    path: `${Paths.PROJECT_ROOT}/utils/.env`
  })
);

const { ENCRYPTION_KEY } = process.env;

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
 * @param projectRoot The root path of the project.
 * @returns The map of resource names to contents.
 */
export function compileResources(projectRoot: string): Record<string, any> {
  const resources: Record<string, any> = {};
  const resourcesDir = path.join(projectRoot || process.cwd(), './views/resources');

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
  try {
    const jsonString = JSON.stringify(json);
    const hash = AES.encrypt(jsonString, ENCRYPTION_KEY!).toString();
    const component = encodeURIComponent(hash);
    return component;
  } catch (e) {
    throw new Error(e as string);
  }
}

/**
 * Decrypts an encrypted component with the encryption key.
 * @param hash The hash to decrypt.
 * @returns The decrypted JSON.
 */
export function decryptJSON<T>(hash: string): T {
  try {
    const component = decodeURIComponent(hash);
    const value = AES.decrypt(component, ENCRYPTION_KEY!).toString(UTF8);
    const json = JSON.parse(value);
    return json;
  } catch (e) {
    throw new Error(e as string);
  }
}

/**
 * Catch error, log to console and exit process.
 * @param err The caught error.
 */
export function error(err: any): never {
  logger.error('Error: ' + err.message);
  process.exit(0);
}

/**
 * Reads content from a specified file.
 * @param file The file path to read from.
 * @returns The content as a string.
 */
export function readFileContent(file: string): string {
  return fs.readFileSync(file, { encoding: 'utf8' });
}

export function checkDotenv({ error }: dotenv.DotenvConfigOutput): void {
  const envs = ['development', 'test'];
  if (process.env.CIRCLECI) return;
  if (envs.includes(process.env.NODE_ENV!) && error) throw error;
}
