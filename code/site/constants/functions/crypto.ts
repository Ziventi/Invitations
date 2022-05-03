import * as AES from 'crypto-js/aes';
import * as UTF8 from 'crypto-js/enc-utf8';

/**
 * Encrypts JSON and forms a URL-encoded hash.
 * @param json The JSON to encrypt.
 * @returns The encrypted hash.
 */
export function encryptJSON<T>(json: T): string {
  try {
    const jsonString = JSON.stringify(json);
    const hash = AES.encrypt(
      jsonString,
      process.env.NEXT_PUBLIC_HASH_ENCRYPTION_KEY!,
    ).toString();
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
    const value = AES.decrypt(
      component,
      process.env.NEXT_PUBLIC_HASH_ENCRYPTION_KEY!,
    ).toString(UTF8);
    const json = JSON.parse(value);
    return json;
  } catch (e) {
    throw new Error(e as string);
  }
}
