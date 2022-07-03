import { TEST_IMAGE_PATH } from '@test/constants';
import { expect, test } from '@test/fixtures';

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
  test('Upload image and click to editor', async ({
    locators,
    stepTwoPage,
  }) => {
    await expect(locators.previousStepButton).toBeEnabled();
    await expect(locators.startEditingButton).toBeDisabled();

    const [fileChooser] = await Promise.all([
      stepTwoPage.waitForEvent('filechooser'),
      locators.fileSelector.click(),
    ]);
    await fileChooser.setFiles(TEST_IMAGE_PATH);
    await locators.startEditingButton.waitFor({ state: 'visible' });
    await expect(locators.startEditingButton).toBeEnabled();
    await locators.startEditingButton.click();
    expect(new URL(stepTwoPage.url()).pathname, '/design/editor');
  });

  /**
   * 1. Starts from editor page.
   * 2. Navigates back to step two and asserts the buttons are enabled.
   */
  test('Should enable buttons when image is already uploaded', async ({
    locators,
    editorPage,
  }) => {
    await editorPage.goto('/design#2', { waitUntil: 'load' });
    await expect(locators.previousStepButton).toBeEnabled();
    await expect(locators.startEditingButton).toBeEnabled();
  });

  /**
   * 1. Starts from step two.
   * 2. Clicks the previous button and asserts navigation is on step one.
   */
  test('Go back to previous step', async ({ locators, stepTwoPage }) => {
    await locators.previousStepButton.click();
    const url = new URL(stepTwoPage.url());
    expect(url.pathname, '/design');
    expect(url.hash, '#1');
  });
});
