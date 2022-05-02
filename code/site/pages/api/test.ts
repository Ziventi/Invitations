import { createCanvas } from 'canvas';
import fs from 'fs';
import type { NextApiResponse, PageConfig } from 'next';

import { drawOnCanvas } from 'constants/functions/canvas';
import * as File from 'constants/functions/file';
import * as Server from 'constants/functions/server';
import { ZiventiNextApiRequest } from 'constants/types';

export default async function handler(
  req: ZiventiNextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  const {
    backgroundImageSrc,
    dimensions,
    fileNameTemplate,
    format,
    fontId,
    selectedName,
    textStyle,
  } = req.body;

  let downloadPath;
  try {
    const backgroundImage = await Server.loadImage(backgroundImageSrc);
    downloadPath = await Server.loadFonts(fontId, textStyle);

    const filename = File.substituteName(fileNameTemplate, selectedName);

    let file;
    if (format === 'pdf') {
      const canvas = createCanvas(dimensions.width, dimensions.height, 'pdf');
      drawOnCanvas(canvas, selectedName, textStyle, backgroundImage);
      file = canvas.toBuffer('application/pdf', {
        title: filename,
        author: 'Ziventi',
      });
      res.setHeader('Content-Type', 'application/pdf');
    } else {
      const canvas = createCanvas(dimensions.width, dimensions.height);
      drawOnCanvas(canvas, selectedName, textStyle, backgroundImage);
      file = canvas.toDataURL();
      res.setHeader('Content-Type', 'image/png');
    }
    res.status(200).send(file);
  } catch (e) {
    res.status(400).json({ msg: JSON.stringify(e) });
  } finally {
    if (downloadPath && fs.existsSync(downloadPath)) {
      fs.rmSync(downloadPath, { force: true, recursive: true });
    }
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: {
      sizeLimit: '10MB',
    },
    responseLimit: '15MB',
  },
};
