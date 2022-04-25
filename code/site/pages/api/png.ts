import { createCanvas, Image } from 'canvas';
import type { NextApiResponse, PageConfig } from 'next';

import { drawOnCanvas } from 'pages/constants/functions';
import { ZiventiNextApiRequest } from 'pages/constants/types';

export default async function handler(
  req: ZiventiNextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  const { backgroundImage, dimensions, names, textStyle } = req.body;

  let img;
  try {
    img = await loadImage(backgroundImage);
  } catch (e) {
    return res.status(400).json({ msg: JSON.stringify(e) });
  }

  const canvas = createCanvas(dimensions.width, dimensions.height);
  drawOnCanvas(canvas, names, textStyle, img);

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
    responseLimit: '15MB'
  },
};
