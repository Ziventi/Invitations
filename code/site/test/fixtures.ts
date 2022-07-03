import type { Locator } from '@playwright/test';
import { test as base } from '@playwright/test';

export const test = base.extend<DesignSetupFixture>({
  locators: async ({ page }, use) => {
    await use({
      enterNamesButton: page.locator('button#enter-names'),
      namesModalConfirmButton: page.locator('button#names-modal-confirm'),
      namesModalCancelButton: page.locator('button#names-modal-cancel'),
      nameslistItems: page.locator('ol#nameslist li'),
      nameslistInput: page.locator('textarea#nameslist-input'),
      backHomeButton: page.locator('button#back-home'),
      nextStepButton: page.locator('button#next-step'),
      previousStepButton: page.locator('button#previous-step'),
      startEditingButton: page.locator('button#start-editing'),
    });
  },
});

export { expect } from '@playwright/test';

interface DesignSetupFixture {
  locators: Record<string, Locator>;
}
