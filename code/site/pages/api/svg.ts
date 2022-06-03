import type { NextApiResponse, PageConfig } from 'next';
import puppeteer from 'puppeteer';

import * as SVG from 'constants/functions/svg';
import type { ZiventiNextApiRequest } from 'constants/types';

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

  try {
    const url = new URL('https://fonts.googleapis.com/css2');
    url.searchParams.append('family', fontId);
    url.searchParams.append('display', 'swap');
    const markup = SVG.create(req.body, url.href);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(markup);
    await page.evaluateHandle('document.fonts.ready');
    await page.setViewport({
      height: dimensions.height,
      width: dimensions.width,
    });
    const file = await page.screenshot({
      encoding: 'base64',
      fullPage: true,
      type: 'png',
    });

    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(`data:image/png;base64,${file}`);
  } catch (e) {
    res.status(400).json({ msg: JSON.stringify(e) });
    console.error(e);
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
