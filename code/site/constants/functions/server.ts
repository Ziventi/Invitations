import AdmZip from 'adm-zip';

import { Image, registerFont } from 'canvas';
import { TextStyle } from 'constants/types';
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
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = new URL(`${GOOGLE_FONT_HOST}/${fontId}`);
    url.searchParams.append('download', 'zip');
    url.searchParams.append('formats', 'ttf');

    fetch(url.href)
      .then((res) => res.blob())
      .then((blob) => blob.arrayBuffer())
      .then((arrayBuffer) => {
        const buffer = Buffer.from(arrayBuffer);
        const zip = new AdmZip(buffer);

        const downloadId = `${fontId}-${Date.now()}`;
        const downloadPath = `./fonts/${downloadId}`;
        zip.extractAllTo(downloadPath);

        try {
          const fontFile = zip.getEntries().shift();
          if (fontFile) {
            registerFont(`./fonts/${downloadId}/${fontFile.entryName}`, {
              family: textStyle.fontFamily,
            });
          }

          resolve(downloadPath);
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
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
