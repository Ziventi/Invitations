import { expect } from '@playwright/test';

export function toExist<T>(value: T | null | undefined): asserts value is T {
  expect(value).toBeDefined();
  expect(value).not.toBeNull();
}
