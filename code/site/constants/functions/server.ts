import AdmZip from 'adm-zip';

import { Image, registerFont } from 'canvas';
import type { TextStyle } from 'constants/types';
import { GOOGLE_FONT_HOST } from 'constants/variables';

/**
 * Download specified Google fonts to disk and register them for the canvas.
 * @param fontId The ID of the font.
 * @param textStyle The text style.
 * @returns A promise resolving to the download path.
 */
export function loadFonts(
  fontId: string,
  textStyle: TextStyle,
): Promise<[string, string | undefined]> {
  return new Promise((resolve, reject) => {
    const url = new URL(`${GOOGLE_FONT_HOST}/${fontId}`);
    url.searchParams.append('download', 'zip');
    url.searchParams.append('formats', 'ttf');
    url.searchParams.append('variants', textStyle.fontStyle);

    // TODO: Allow duplicate fonts. Check for existing fontIDs and don't
    // download new ones if they already exist.
    fetch(url.href)
      .then((res) => res.blob())
      .then((blob) => blob.arrayBuffer())
      .then((arrayBuffer) => {
        const buffer = Buffer.from(arrayBuffer);
        const zip = new AdmZip(buffer);

        const downloadDir = `./fonts/${fontId}-${Date.now()}`;
        zip.extractAllTo(downloadDir);

        try {
          const fontFile = zip.getEntries().shift();
          if (fontFile) {
            registerFont(`./${downloadDir}/${fontFile.entryName}`, {
              family: textStyle.fontFamily,
            });
          }

          resolve([downloadDir, fontFile?.entryName]);
        } catch (e) {
          throw new Error(e as string);
        }
      })
      .catch(reject);
  });
}

/**
 * Loads the background image to be used for the canvas.
 * @param src The image source.
 * @returns A promise resolving to the image.
 */
export function loadImage(src: string): Promise<Image> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}
