import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Draggable text changes with input', async ({ page }) => {
  const text = 'Hello';

  await page.fill('#names-list', text);

  const draggable = page.locator('#draggable');
  await expect(draggable).toHaveText(text);
});