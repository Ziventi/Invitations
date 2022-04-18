import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  const { html } = req.body;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`data:text/html,${encodeURIComponent(html)}`);
  await page.waitForSelector('#draggable', { timeout: 5000 });

  const canvas = await page.$('#draggable');
  if (!canvas) throw new Error('Canvas element not found.');

  const image = await canvas.screenshot({
    type: 'png',
  });

  // await page.addStyleTag({ url: this.fontsUrl });
  // await page.addStyleTag({ path: stylesOutputFile });
  // await page.setViewport({
  //   width: 800,
  //   height: 800,
  //   deviceScaleFactor: 1,
  // });
  // await page.evaluateHandle('document.fonts.ready');

  await browser.close();

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Disposition', 'attachment; filename="ziventi.png"');
  res.status(200).send(image);
}
