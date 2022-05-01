import { expect, test } from '@playwright/test';

import * as Expects from '../expects';

test.beforeEach(async ({ page }) => {
  await page.goto('/design');
});

test('Move draggable', async ({ page }) => {
  const draggable = page.locator('#draggable');
  let bounds = await draggable.boundingBox();
  expect(bounds).not.toBeNull();

  const { x, y, height, width } = bounds!;
  const fromX = x + width / 2;
  const fromY = y + height / 2;
  const toX = fromX + 200;
  const toY = fromY + 200;
  await page.mouse.move(fromX, fromY);
  await page.mouse.down();
  await page.mouse.move(toX, toY);

  bounds = (await draggable.boundingBox())!;
  expect(bounds.x).toBe(x + 200);
  expect(bounds.y).toBe(200);
});

['east', 'west'].forEach((handleId) => {
  const deltaX = 100;
  const deltaWidth = handleId === 'east' ? deltaX : -deltaX;

  test(`Resized draggable with ${handleId} handle`, async ({ page }) => {
    const draggable = page.locator('#draggable');
    let draggableBounds = await draggable.boundingBox();
    Expects.toExist(draggableBounds);
    const initialWidth = draggableBounds.width;

    await page.click('#draggable');
    const handle = page.locator(`#${handleId}`);
    let handleBounds = await handle.boundingBox();
    Expects.toExist(handleBounds);

    const { x, y, height, width } = handleBounds;
    const fromX = x + width / 2;
    const fromY = y + height / 2;
    const toX = fromX + deltaX;
    const toY = fromY;
    await page.mouse.move(fromX, fromY);
    await page.mouse.down();
    await page.mouse.move(toX, toY);

    handleBounds = await handle.boundingBox();
    Expects.toExist(handleBounds);
    expect(handleBounds.x).toBeCloseTo(x + deltaX, 1);

    draggableBounds = await draggable.boundingBox();
    Expects.toExist(draggableBounds);
    const expectedWidth = initialWidth + deltaWidth;
    const actualWidth = draggableBounds.width;
    expect(
      actualWidth,
      `Expected draggable width of ${expectedWidth}; received ${actualWidth}.`,
    ).toBeCloseTo(expectedWidth, 1);
  });
});
