import type { NextApiResponse, PageConfig } from 'next';
import type { Browser } from 'puppeteer';
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

  let browser: Browser | undefined;
  const startTime = Date.now();
  try {
    const url = new URL('https://fonts.googleapis.com/css2');
    url.searchParams.append('family', fontId);
    url.searchParams.append('display', 'swap');
    const markup = SVG.create(
      backgroundImageSrc,
      dimensions,
      fileNameTemplate,
      selectedName,
      textStyle,
      url.href,
    );

    if (format === 'svg') {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.status(200).send(markup);
    } else {
      browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(markup);
      await page.evaluateHandle('document.fonts.ready');

      if (format === 'pdf') {
        const file = await page.pdf({
          height: dimensions.height,
          width: dimensions.width,
          pageRanges: '1',
          printBackground: true,
        });
        res.setHeader('Content-Type', 'application/pdf');
        res.status(200).send(file);
      } else {
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
      }
    }
  } catch (e) {
    res.status(400).json({ msg: JSON.stringify(e) });
    console.error(e);
  } finally {
    if (browser) {
      await browser.close();
    }
    const endTime = Date.now();
    const difference = (endTime - startTime) / 1000;
    console.info(
      `${format.toUpperCase()} download finished in ${difference.toFixed(2)}s.`,
    );
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
