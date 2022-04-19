import type { NextApiResponse, PageConfig } from 'next';
import PDFDocument from 'pdfkit';

import { ZiventiNextApiRequest } from 'pages/constants/types';

export const config: PageConfig = {
  api: {
    bodyParser: {
      sizeLimit: '2MB',
    },
  },
};

export default function handler(
  req: ZiventiNextApiRequest,
  res: NextApiResponse<any>,
): void {
  const { backgroundImage, dimensions, names, textStyle } = req.body;

  const doc = new PDFDocument({
    size: [dimensions.width, dimensions.height],
  });
  doc.image(backgroundImage, 0, 0, { width: dimensions.width });
  doc.fontSize(textStyle.fontSize);
  doc.text(names, textStyle.left, textStyle.top, {
    align: 'center',
    width: textStyle.maxWidth,
  });
  doc.pipe(res);
  doc.end();

  res.setHeader('Content-Type', 'application/pdf');
}
