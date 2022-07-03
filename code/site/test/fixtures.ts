import type { Locator, Page } from '@playwright/test';
import { test as base } from '@playwright/test';

import { NAMES_LIST, TEST_IMAGE_PATH } from './constants';

export { expect } from '@playwright/test';

export const test = base.extend<DesignSetupFixture>({
  locators: async ({ page }, use) => {
    await use({
      enterNamesButton: page.locator('button#enter-names'),
      namesModalConfirmButton: page.locator('button#names-modal-confirm'),
      namesModalCancelButton: page.locator('button#names-modal-cancel'),
      nameslistItems: page.locator('ol#nameslist li'),
      nameslistInput: page.locator('textarea#nameslist-input'),
      fileSelector: page.locator('label#file-selector'),
      fileInput: page.locator('input#file-input'),
      backHomeButton: page.locator('button#back-home'),
      nextStepButton: page.locator('button#next-step'),
      previousStepButton: page.locator('button#previous-step'),
      startEditingButton: page.locator('button#start-editing'),
    });
  },
  stepTwoPage: async ({ locators, page }, use) => {
    await page.goto('/design#1', { waitUntil: 'load' });
    await locators.enterNamesButton.click();
    await locators.nameslistInput.fill(NAMES_LIST.join('\n'));
    await locators.namesModalConfirmButton.click();
    await locators.nextStepButton.click();
    await use(page);
  },
  editorPage: async ({ locators, stepTwoPage }, use) => {
    await locators.fileInput.setInputFiles(TEST_IMAGE_PATH);
    await locators.startEditingButton.click();
    await use(stepTwoPage);
  },
});

interface DesignSetupFixture {
  locators: Locators;
  stepTwoPage: Page;
  editorPage: Page;
}

interface Locators {
  enterNamesButton: Locator;
  namesModalConfirmButton: Locator;
  namesModalCancelButton: Locator;
  nameslistItems: Locator;
  nameslistInput: Locator;
  fileSelector: Locator;
  fileInput: Locator;
  backHomeButton: Locator;
  nextStepButton: Locator;
  previousStepButton: Locator;
  startEditingButton: Locator;
}
