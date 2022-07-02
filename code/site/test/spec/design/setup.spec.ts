import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { imageSource } from '@test/resources/data.json';

const NAMES = ['Victory Uchenna', 'Chidera Onyeukwu'];

test.describe('Design Setup', () => {
  let enterNamesButton: Locator;
  let namesModalConfirmButton: Locator;
  let namesModalCancelButton: Locator;
  let nameslistItems: Locator;
  let nameslistInput: Locator;
  let backHomeButton: Locator;
  let nextStepButton: Locator;
  let previousStepButton: Locator;
  let startEditingButton: Locator;

  /**
   * Instantiates all element handle locators.
   */
  test.beforeEach(({ page }) => {
    enterNamesButton = page.locator('button#enter-names');
    namesModalConfirmButton = page.locator('button#names-modal-confirm');
    namesModalCancelButton = page.locator('button#names-modal-cancel');
    nameslistItems = page.locator('ol#nameslist li');
    nameslistInput = page.locator('textarea#nameslist-input');
    backHomeButton = page.locator('button#back-home');
    nextStepButton = page.locator('button#next-step');
    previousStepButton = page.locator('button#previous-step');
    startEditingButton = page.locator('button#start-editing');
  });

  /**
   * Steps through the setup sequence in preparation for running tests.
   * @param page The page.
   * @param callback The methods to be run after setup.
   * @param onlyStepOne True if should stop after step one is complete.
   */
  async function stepThroughSetup(
    page: Page,
    callback: () => void,
    onlyStepOne?: boolean,
  ): Promise<void> {
    await page.goto('/design#1', { waitUntil: 'domcontentloaded' });
    await enterNamesButton.click();
    await nameslistInput.fill(NAMES.join('\n'));
    await namesModalConfirmButton.click();
    await nextStepButton.click();

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
      await startEditingButton.click();
      expect(new URL(page.url()).pathname, '/design/editor');
      callback();
    });
  }

  test.describe('Step #1', () => {
    /**
     * Navigates to step one before each test.
     */
    test.beforeEach(async ({ page }) => {
      await page.goto('/design#1', { waitUntil: 'networkidle' });
    });

    /**
     * 1. Asserts buttons are disabled.
     * 2. Opens the modal containing the name input and fills it.
     * 3. Confirms the input and checks that the next button is enabled.
     * 4. Asserts the list of names is previewed.
     * 5. Navigates to the second step.
     */
    test('Populate names and click through to next step', async ({ page }) => {
      await expect(nextStepButton).toBeDisabled();
      await expect(nameslistInput).toBeDisabled();

      await enterNamesButton.click();
      await expect(nameslistInput).toBeEnabled();
      await nameslistInput.fill(NAMES.join('\n'));

      await namesModalConfirmButton.click();
      await expect(nameslistInput).toBeDisabled();
      await expect(nextStepButton).toBeEnabled();

      (await nameslistItems.allTextContents()).forEach((name, i) => {
        expect(name).toBe(NAMES[i]);
      });

      await nextStepButton.click();
      const url = new URL(page.url());
      expect(url.pathname, '/design');
      expect(url.hash, '#2');
    });

    /**
     * 1. Opens the modal for name input and fills it.
     * 2. Cancels the input and closed the modal.
     * 3. Asserts buttons remain disabled and no names previewed.
     */
    test('Abort populating names', async () => {
      await enterNamesButton.click();
      await nameslistInput.fill(NAMES.join('\n'));
      await namesModalCancelButton.click();

      await expect(nameslistInput).toBeDisabled();
      await expect(nextStepButton).toBeDisabled();
      expect(await nameslistItems.allTextContents()).toHaveLength(0);
    });

    /**
     * 1. Opens modal, populates the names input and confirms.
     * 2. Re-opens modal, clears input and confirms.
     * 3. Asserts buttons remain disabled and no names previewed.
     */
    test('Populate names then depopulate names', async () => {
      await enterNamesButton.click();
      await nameslistInput.fill(NAMES.join('\n'));
      await namesModalConfirmButton.click();

      await enterNamesButton.click();
      await nameslistInput.fill('');
      await namesModalConfirmButton.click();

      await expect(nameslistInput).toBeDisabled();
      await expect(nextStepButton).toBeDisabled();
      expect(await nameslistItems.allTextContents()).toHaveLength(0);
    });

    /**
     * Asserts navigation when clicking back to home page.
     */
    test('Click back to home page', async ({ page }) => {
      await backHomeButton.click();
      const url = new URL(page.url());
      expect(url.pathname, '/');
    });
  });

  test.describe('Step #2', () => {
    /**
     * 1. Navigates to step two
     * 2. Asserts that the navigation as switched to step one page.
     */
    test('Should jump back to step one if no names populated', async ({
      page,
    }) => {
      await page.goto('/design#2', { waitUntil: 'networkidle' });
      const url = new URL(page.url());
      expect(url.pathname, '/design');
      expect(url.hash, '#1');
    });

    /**
     * 1. Steps through to step two.
     * 2. Asserts previous button enabled and next button disabled.
     * 3. Triggers the file chooser and uploads an image.
     * 4. Asserts next button enabled, clicks it and asserts navigation to the editor.
     */
    test('Upload image and click to editor', async ({ page }) => {
      await stepThroughSetup(
        page,
        async () => {
          await expect(previousStepButton).toBeEnabled();
          await expect(startEditingButton).toBeDisabled();

          await page.locator('label#file-selector').click();
          page.on('filechooser', async (fileSelector) => {
            await fileSelector.setFiles({
              name: 'zavid',
              mimeType: 'image/jpeg',
              buffer: Buffer.from(imageSource),
            });

            await expect(startEditingButton).toBeEnabled();
            await startEditingButton.click();
            expect(new URL(page.url()).pathname, '/design/editor');
          });
        },
        true,
      );
    });

    /**
     * 1. Steps through to setup sequence.
     * 2. Navigates back to step two and asserts the buttons are enabled.
     */
    test('Should enable buttons when image is already uploaded', async ({
      page,
    }) => {
      await stepThroughSetup(page, async () => {
        await page.goto('/design#2', { waitUntil: 'domcontentloaded' });
        await expect(previousStepButton).toBeEnabled();
        await expect(startEditingButton).toBeEnabled();
      });
    });

    /**
     * 1. Steps through to step two.
     * 2. Clicks the previous button and asserts navigation is on step one.
     */
    test('Go back to previous step', async ({ page }) => {
      await stepThroughSetup(
        page,
        async () => {
          await previousStepButton.click();
          const url = new URL(page.url());
          expect(url.pathname, '/design');
          expect(url.hash, '#1');
        },
        true,
      );
    });
  });
});
