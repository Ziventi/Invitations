import { NAMES_LIST } from '@test/constants';
import { expect, test } from '@test/fixtures';

test.describe('Design Setup - Step #1', () => {
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
  test('Populate names and click through to step two', async ({
    locators,
    page,
  }) => {
    await expect(locators.nextStepButton).toBeDisabled();
    await expect(locators.nameslistInput).toBeDisabled();

    await locators.enterNamesButton.click();
    await expect(locators.nameslistInput).toBeEnabled();
    await locators.nameslistInput.fill(NAMES_LIST.join('\n'));

    await locators.namesModalConfirmButton.click();
    await expect(locators.nameslistInput).toBeDisabled();
    await expect(locators.nextStepButton).toBeEnabled();

    (await locators.nameslistItems.allTextContents()).forEach((name, i) => {
      expect(name).toBe(NAMES_LIST[i]);
    });

    await locators.nextStepButton.click();
    const url = new URL(page.url());
    expect(url.pathname, '/design');
    expect(url.hash, '#2');
  });

  /**
   * 1. Opens the modal for name input and fills it.
   * 2. Cancels the input and closed the modal.
   * 3. Asserts buttons remain disabled and no names previewed.
   */
  test('Abort populating names', async ({ locators }) => {
    await locators.enterNamesButton.click();
    await locators.nameslistInput.fill(NAMES_LIST.join('\n'));
    await locators.namesModalCancelButton.click();

    await expect(locators.nameslistInput).toBeDisabled();
    await expect(locators.nextStepButton).toBeDisabled();
    expect(await locators.nameslistItems.allTextContents()).toHaveLength(0);
  });

  /**
   * 1. Opens modal, populates the names input and confirms.
   * 2. Re-opens modal, clears input and confirms.
   * 3. Asserts buttons remain disabled and no names previewed.
   */
  test('Populate names then depopulate names', async ({ locators }) => {
    await locators.enterNamesButton.click();
    await locators.nameslistInput.fill(NAMES_LIST.join('\n'));
    await locators.namesModalConfirmButton.click();

    await locators.enterNamesButton.click();
    await locators.nameslistInput.fill('');
    await locators.namesModalConfirmButton.click();

    await expect(locators.nameslistInput).toBeDisabled();
    await expect(locators.nextStepButton).toBeDisabled();
    expect(await locators.nameslistItems.allTextContents()).toHaveLength(0);
  });

  /**
   * Asserts navigation when clicking back to home page.
   */
  test('Click back to home page', async ({ locators, page }) => {
    await locators.backHomeButton.click();
    const url = new URL(page.url());
    expect(url.pathname, '/');
  });
});
