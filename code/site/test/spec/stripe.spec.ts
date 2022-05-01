import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/design');
});

test('Can access payment page', async ({ page }) => {
  await page.click('#pay');
  await page.waitForNavigation();
  expect(page.url()).toContain('/payment');
  // await page.waitForSelector('#payment-form');
  // await page.fill("#payment-form [name='number']", '5555555555554444');
});
