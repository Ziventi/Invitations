import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const names = ['Victory'];

(async () => {
  await main();
})();

async function main(): Promise<void> {
  const outputDir = path.resolve(__dirname, 'dist');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const browser = await puppeteer.launch();
  const screenshot = async (name: string): Promise<void> => {
    const page = await browser.newPage();
    await page.goto(`http://localhost:8080?name=${encodeURIComponent(name)}`);
    await page.evaluateHandle('document.fonts.ready');
    await page.pdf({
      format: 'a4',
      path: `${outputDir}/${name}.pdf`,
      pageRanges: '1',
      printBackground: true,
      preferCSSPageSize: true
    });
  };

  const promises = names.map(screenshot);
  await Promise.all(promises);

  await browser.close();

  openFileInBrowser('pdf', outputDir);
}

/**
 * Opens the first generated file in Chrome.
 * @param format The format of the file to open.
 */
function openFileInBrowser(format: FileFormat, outputDir: string): void {
  const openFile = (app: 'chrome' | 'vscode'): void => {
    const firstFile = fs.readdirSync(outputDir)[0];
    if (app === 'chrome') {
      spawnSync('open', ['-a', 'Google Chrome', firstFile], {
        cwd: outputDir,
      });
    } else {
      spawnSync('code', [firstFile], { cwd: outputDir });
    }
  };

  if (format === 'pdf') {
    openFile('chrome');
  } else if (format === 'png') {
    openFile('vscode');
  }
}

export type FileFormat = 'pdf' | 'png';
