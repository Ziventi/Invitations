
import { logger } from '@ziventi/utils';

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('PDF Tests', () => {
  beforeAll(async () => {
    const cwd = path.resolve(process.cwd(), 'project');
    spawnSync('rm', ['-rf', '.dist', '.out'], { cwd });
    spawnSync('tsc', { cwd });
    spawnSync('node', ['./.dist/main.js', 'generate', '-n', 'Aruna'], {
      cwd
    });

    const filePath = path.resolve(
      __dirname,
      '../project/.out/html/Aruna Jalloh.html'
    );
    const html = fs.readFileSync(filePath, { encoding: 'utf8' });
    await page.goto(`data:text/html,${encodeURIComponent(html)}`);
  });

  it('Page should have correct title', async () => {
    await expect(page.title()).resolves.toMatch('Aruna Jalloh | Ziventi');
  });

  it('Status hyperlinks', async () => {
    await page.$eval('body', (element) => element.innerHTML);
    await Promise.all([page.click('a#unavailable'), page.waitForNavigation()]);
    const htmlBody = await page.$eval('body', (element) => element.textContent);
    logger.debug(htmlBody);
    expect(htmlBody).toBe(JSON.stringify({ message: 'ok' }));
  });
});
