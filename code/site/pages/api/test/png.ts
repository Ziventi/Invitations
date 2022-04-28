import AdmZip from 'adm-zip';
import { createCanvas, registerFont, Image } from 'canvas';
import fs from 'fs';
import type { NextApiResponse, PageConfig } from 'next';

import { drawOnCanvas } from 'constants/functions/canvas';
import { ZiventiNextApiRequest } from 'constants/types';
import { GOOGLE_FONT_HOST } from 'constants/variables';

export default async function handler(
  req: ZiventiNextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  const { backgroundImageSrc, dimensions, fontId, namesList, textStyle } = req.body;

  let backgroundImage;
  try {
    backgroundImage = await loadImage(backgroundImageSrc);
  } catch (e) {
    return res.status(400).json({ msg: JSON.stringify(e) });
  }

  const url = new URL(`${GOOGLE_FONT_HOST}/${fontId}`);
  url.searchParams.append('download', 'zip');
  url.searchParams.append('formats', 'ttf');
  const response = await fetch(url.href);
  const blob = await response.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());
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
  } catch (e) {
    console.error(JSON.stringify(e));
  }

  const canvas = createCanvas(dimensions.width, dimensions.height);
  drawOnCanvas(canvas, namesList[0], textStyle, backgroundImage);

  if (fs.existsSync(downloadPath)) {
    fs.rmSync(downloadPath, { force: true, recursive: true });
  }

  const image = canvas.toDataURL();
  res.setHeader('Content-Type', 'image/png');
  res.status(200).send(image);
}

function loadImage(src: string): Promise<Image> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export const config: PageConfig = {
  api: {
    bodyParser: {
      sizeLimit: '2MB',
    },
    responseLimit: '15MB',
  },
};
