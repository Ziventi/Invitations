import { createCanvas, Image } from 'canvas';
import type { NextApiResponse, PageConfig } from 'next';

import { ZiventiNextApiRequest } from 'pages/constants/types';
import { DRAGGABLE_PADDING } from 'pages/constants/variables';

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
  const ctx = canvas.getContext('2d');

  const { fontSize, fontFamily, color, left, top, width, height, scale } =
    textStyle;
  const textX = (left + width / 2) * scale;
  const textY = (top + height / 2) * scale + DRAGGABLE_PADDING;

  ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
  ctx.font = `${fontSize * scale}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = color;
  ctx.fillText(names, textX, textY);

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
  },
};
