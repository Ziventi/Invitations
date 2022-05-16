import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const names = ['Adebusola Emiola', 'Victory Azekumen'];

(async () => {
  await main();
})();

async function main(): Promise<void> {
  const outputDir = path.resolve(__dirname, 'dist');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto(`http://localhost:8080?name=${encodeURIComponent(names[0])}`);
  await page.evaluateHandle('document.fonts.ready');
  // await page.waitForSelector('#name');
  await page.pdf({
    format: 'a4',
    path: `${outputDir}/hey.pdf`,
    pageRanges: '1',
    printBackground: true,
  });

  await browser.close();
}
