import AdmZip from 'adm-zip';
import { createCanvas } from 'canvas';
import fs from 'fs';
import type { NextApiResponse, PageConfig } from 'next';

import { clearCanvas, drawOnCanvas } from 'constants/functions/canvas';
import * as Server from 'constants/functions/server';
import * as Utils from 'constants/functions/utils';
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
    namesList: names,
    textStyle,
  } = req.body;

  let downloadPath;

  try {
    const backgroundImage = await Server.loadImage(backgroundImageSrc);
    downloadPath = await Server.loadFonts(fontId, textStyle);

    // Generate image and add to archive.
    const canvasType = format === 'pdf' ? 'pdf' : undefined;
    const canvas = createCanvas(
      dimensions.width,
      dimensions.height,
      canvasType,
    );
    const archiver = new AdmZip();
    names.forEach((name) => {
      drawOnCanvas(canvas, name, textStyle, backgroundImage);
      const filename = Utils.substituteName(fileNameTemplate, name);

      let file;
      if (format === 'pdf') {
        file = canvas.toBuffer('application/pdf', {
          title: filename,
          author: 'Ziventi',
        });
      } else {
        file = canvas.toBuffer('image/png');
      }

      archiver.addFile(`${filename}.${format}`, file);
      clearCanvas(canvas);
    });

    const archive = archiver.toBuffer();
    res.setHeader('Content-Type', 'application/zip');
    res.status(200).send(archive);
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
    responseLimit: '2GB',
  },
};
