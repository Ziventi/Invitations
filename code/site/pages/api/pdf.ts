import type { NextApiResponse, PageConfig } from 'next';
import PDFDocument from 'pdfkit';

import { ZiventiNextApiRequest } from 'pages/constants/types';
import { DRAGGABLE_PADDING } from 'pages/constants/variables';

export const config: PageConfig = {
  api: {
    bodyParser: {
      sizeLimit: '2MB',
    },
  },
};

export default function handler(
  req: ZiventiNextApiRequest,
  res: NextApiResponse,
): void {
  const { backgroundImage, dimensions, names, textStyle } = req.body;
  const { fontSize, left, width, top, scale, scaleX, scaleY } = textStyle;

  const doc = new PDFDocument({
    size: [dimensions.width, dimensions.height],
  });
  doc.image(backgroundImage, 0, 0, { width: dimensions.width });
  doc.fontSize(fontSize * scale);
  doc.text(
    names,
    (left + DRAGGABLE_PADDING / 6) * scaleX,
    (top + DRAGGABLE_PADDING) * scaleY,
    {
      align: 'center',
      width: (width - DRAGGABLE_PADDING / 6) * scale,
    },
  );
  doc.pipe(res);
  doc.end();

  res.setHeader('Content-Type', 'application/pdf');
}
