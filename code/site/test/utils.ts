import type { Locator, Page } from '@playwright/test';

import { expect } from '@test/fixtures';
import { names, imageSource } from '@test/resources/data.json';

/**
 * Steps through the setup sequence in preparation for running tests.
 * @param page The page.
 * @param locators The element locators.
 * @param callback The methods to be run after setup.
 * @param onlyStepOne True if should stop after step one is complete.
 */
export async function stepThroughSetup(
  page: Page,
  locators: Record<string, Locator>,
  callback: () => void,
  onlyStepOne?: boolean,
): Promise<void> {
  await page.goto('/design#1', { waitUntil: 'domcontentloaded' });
  await locators.enterNamesButton.click();
  await locators.nameslistInput.fill(names.join('\n'));
  await locators.namesModalConfirmButton.click();
  await locators.nextStepButton.click();

  if (onlyStepOne) {
    return callback();
  }

  await page.locator('label#file-selector').click();
  page.on('filechooser', async (fileSelector) => {
    await fileSelector.setFiles({
      name: 'zavid',
      mimeType: 'image/jpeg',
      buffer: Buffer.from(imageSource),
    });
    await locators.startEditingButton.click();
    expect(new URL(page.url()).pathname, '/design/editor');
    callback();
  });
}
