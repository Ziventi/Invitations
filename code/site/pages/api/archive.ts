import AdmZip from 'adm-zip';
import type { NextApiResponse, PageConfig } from 'next';
import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer';

import * as SVG from 'constants/functions/svg';
import * as Utils from 'constants/functions/utils';
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
    namesList,
    textStyle,
  } = req.body;

  let browser: Browser | undefined;
  const startTime = Date.now();
  try {
    const url = new URL('https://fonts.googleapis.com/css2');
    url.searchParams.append('family', fontId);
    url.searchParams.append('display', 'swap');

    if (format !== 'svg') {
      browser = await puppeteer.launch();
    }

    const archiver = new AdmZip();
    await Promise.all(
      namesList.map(async (name) => {
        const markup = SVG.create(
          backgroundImageSrc,
          dimensions,
          fileNameTemplate,
          name,
          textStyle,
          url.href,
        );

        let file: Buffer;
        if (format === 'svg') {
          file = Buffer.from(markup);
        } else {
          const page = await browser!.newPage();
          await page.setContent(markup);
          await page.evaluateHandle('document.fonts.ready');

          if (format === 'pdf') {
            file = await page.pdf({
              height: dimensions.height,
              width: dimensions.width,
              pageRanges: '1',
              printBackground: true,
            });
          } else {
            await page.setViewport({
              height: dimensions.height,
              width: dimensions.width,
            });
            file = <Buffer>await page.screenshot({
              encoding: 'binary',
              fullPage: true,
              type: 'png',
            });
          }
        }

        const filename = Utils.substituteName(fileNameTemplate, name);
        archiver.addFile(`${filename}.${format}`, file);
      }),
    );

    const archive = archiver.toBuffer();
    res.setHeader('Content-Type', 'application/zip');
    res.status(200).send(archive);
  } catch (e) {
    res.status(400).json({ msg: JSON.stringify(e) });
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
    responseLimit: '2GB',
  },
};
