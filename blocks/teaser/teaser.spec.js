import { test, expect } from '@playwright/test';

test.describe('teaser', () => {
  test('renders block container', async ({ page }) => {
    await page.goto('/tests/teaser-test.html');
    await expect(page.locator('.teaser .teaser-inner')).toBeVisible();
  });
});
