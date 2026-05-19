import { test, expect } from '@playwright/test';

test.describe('banner', () => {
  test('renders block container', async ({ page }) => {
    await page.goto('/tests/banner-test.html');
    await expect(page.locator('.banner .banner-inner')).toBeVisible();
  });
});
