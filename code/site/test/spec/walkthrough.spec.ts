import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

const NAMES = ['Victory Uchenna', 'Chidera Onyeukwu'];

test('Click from homepage to design step #1', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.click('button#start');
  await page.waitForNavigation();

  const url = new URL(page.url());
  expect(url.pathname, '/design');
  expect(url.hash, '#1');
});

test('Populate names and click through to design step #2', async ({ page }) => {
  const {
    enterNamesButton,
    namesModalConfirmButton,
    nameslistItems,
    nameslistInput,
    nextStepButton,
  } = getLocators(page);

  // Assert initial state.
  await page.goto('/design#1', { waitUntil: 'domcontentloaded' });
  await expect(nextStepButton).toBeDisabled();
  await expect(nameslistInput).toBeDisabled();

  // Open names modal.
  await enterNamesButton.click();
  await expect(nameslistInput).toBeEnabled();
  await nameslistInput.fill(NAMES.join('\n'));

  // Confirm input names.
  await namesModalConfirmButton.click();
  await expect(nameslistInput).toBeDisabled();
  await expect(nextStepButton).toBeEnabled();

  // Assert input names are previewed.
  (await nameslistItems.allTextContents()).forEach((name, i) => {
    expect(name).toBe(NAMES[i]);
  });

  // Click to Step #2
  await nextStepButton.click();
  const url = new URL(page.url());
  expect(url.pathname, '/design');
  expect(url.hash, '#2');
});

test('Cancel populating names', async ({ page }) => {
  const {
    enterNamesButton,
    namesModalCancelButton,
    nameslistItems,
    nameslistInput,
    nextStepButton,
  } = getLocators(page);

  // Open names list modal and populate.
  await page.goto('/design#1', { waitUntil: 'domcontentloaded' });
  await enterNamesButton.click();
  await nameslistInput.fill(NAMES.join('\n'));

  // Cancel the modal input.
  await namesModalCancelButton.click();
  await expect(nameslistInput).toBeDisabled();
  await expect(nextStepButton).toBeDisabled();

  // Check no names are previewed.
  expect(await nameslistItems.allTextContents()).toHaveLength(0);
});

test('Remove populated names', async ({ page }) => {
  const {
    enterNamesButton,
    namesModalConfirmButton,
    nameslistItems,
    nameslistInput,
    nextStepButton,
  } = getLocators(page);

  // Open names list modal and populate.
  await page.goto('/design#1', { waitUntil: 'domcontentloaded' });
  await enterNamesButton.click();
  await nameslistInput.fill(NAMES.join('\n'));
  await namesModalConfirmButton.click();

  // Remove names.
  await enterNamesButton.click();
  await nameslistInput.fill('');
  await namesModalConfirmButton.click();

  await expect(nameslistInput).toBeDisabled();
  await expect(nextStepButton).toBeDisabled();
  expect(await nameslistItems.allTextContents()).toHaveLength(0);
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getLocators(page: Page) {
  return {
    enterNamesButton: page.locator('button#enter-names'),
    namesModalConfirmButton: page.locator('button#names-modal-confirm'),
    namesModalCancelButton: page.locator('button#names-modal-cancel'),
    nameslistItems: page.locator('ol#nameslist li'),
    nameslistInput: page.locator('textarea#nameslist-input'),
    nextStepButton: page.locator('button#next-step'),
  };
}
