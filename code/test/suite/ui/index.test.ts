import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import main from '../../project/controller/main';

describe('PDF Generation', () => {
  beforeAll(async () => {
    const cwd = path.resolve(process.cwd(), 'test/project');
    spawnSync('rm', ['-rf', '.dist', '.out'], { cwd });
    spawnSync('tsc', { cwd});

    await main();

    const filePath = path.resolve(cwd, './.out/html/Aruna Jalloh.html');
    const html = fs.readFileSync(filePath, { encoding: 'utf8' });
    await page.goto(`data:text/html,${encodeURIComponent(html)}`);
  });

  test('Page should have correct title', async () => {
    await expect(page.title()).resolves.toMatch('Aruna Jalloh | Ziventi');
  });

  test('Status hyperlinks', async () => {
    await page.$eval('body', (element) => element.innerHTML);
    await Promise.all([page.click('a#unavailable'), page.waitForNavigation()]);
    const htmlBody = await page.$eval('body', (element) => element.textContent);
    expect(htmlBody).toBe(JSON.stringify({ message: 'ok' }));
  });
});
