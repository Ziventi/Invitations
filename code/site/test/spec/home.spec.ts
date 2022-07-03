import { expect, test } from '@playwright/test';

test.describe('Home', () => {
  /**
   * Navigate to home page before each test.
   */
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  /**
   * Click start button and assert navigation to design setup page.
   */
  test('Click to design setup', async ({ page }) => {
    await page.click('button#start');

    const url = new URL(page.url());
    expect(url.pathname, '/design');
    expect(url.hash, '#1');
  });
});
