import { test, expect } from '@playwright/test';

test.describe('resource-list', () => {
  test.skip('renders block root', async ({ page }) => {
    await page.goto('/tests/resource-list-test.html');
    await expect(page.locator('.resource-list')).toBeVisible();
  });
});
