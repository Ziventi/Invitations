import fs from 'fs';
import path from 'path';

import * as API from '../project/controller/api';

jest.setTimeout(10000);

describe.skip('PDF Interaction', () => {
  beforeAll(async () => {
    const cwd = path.resolve(process.cwd(), 'test/project');
    await API.generate({ limit: 1 });

    const filePath = path.resolve(cwd, './.out/html/Abidemi Ajayi.html');
    const html = fs.readFileSync(filePath, { encoding: 'utf8' });
    await page.goto(`data:text/html,${encodeURIComponent(html)}`);
  });

  test('Page should have correct title', async () => {
    await expect(page.title()).resolves.toMatch('Abidemi Ajayi | Ziventi');
  });

  test('Click status hyperlinks', async () => {
    await page.$eval('body', (element) => element.innerHTML);
    await Promise.all([page.click('a#Unavailable'), page.waitForNavigation()]);
    const htmlBody = await page.$eval('body', (element) => element.textContent);
    expect(htmlBody).toBe(JSON.stringify({ message: 'ok' }));
  });
});
