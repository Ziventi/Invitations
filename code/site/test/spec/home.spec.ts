import { expect, test } from '@playwright/test';

test.describe('Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('Click to Design', async ({ page }) => {
    await page.click('button#start');

    // Assert navigation to design page.
    const url = new URL(page.url());
    expect(url.pathname, '/design');
    expect(url.hash, '#1');
  });
});
