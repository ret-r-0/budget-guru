import { test as base, expect } from '@playwright/test';

const test = base;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });
});

export { test, expect };
