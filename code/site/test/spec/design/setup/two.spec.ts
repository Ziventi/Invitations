import { expect, test } from '@test/fixtures';
import { imageSource } from '@test/resources/data.json';
import * as Utils from '@test/utils';

test.describe('Design Setup - Step #2', () => {
  /**
   * 1. Navigates to step two.
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
  test('Upload image and click to editor', async ({ locators, page }) => {
    await Utils.stepThroughSetup(
      page,
      locators,
      async () => {
        await expect(locators.previousStepButton).toBeEnabled();
        await expect(locators.startEditingButton).toBeDisabled();

        await page.locator('label#file-selector').click();
        page.on('filechooser', async (fileSelector) => {
          await fileSelector.setFiles({
            name: 'zavid',
            mimeType: 'image/jpeg',
            buffer: Buffer.from(imageSource),
          });

          await expect(locators.startEditingButton).toBeEnabled();
          await locators.startEditingButton.click();
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
    locators,
    page,
  }) => {
    await Utils.stepThroughSetup(page, locators, async () => {
      await page.goto('/design#2', { waitUntil: 'domcontentloaded' });
      await expect(locators.previousStepButton).toBeEnabled();
      await expect(locators.startEditingButton).toBeEnabled();
    });
  });

  /**
   * 1. Steps through to step two.
   * 2. Clicks the previous button and asserts navigation is on step one.
   */
  test('Go back to previous step', async ({ locators, page }) => {
    await Utils.stepThroughSetup(
      page,
      locators,
      async () => {
        await locators.previousStepButton.click();
        const url = new URL(page.url());
        expect(url.pathname, '/design');
        expect(url.hash, '#1');
      },
      true,
    );
  });
});
