import { test, expect } from '@playwright/test';

test.describe('carousel', () => {
  test('renders block container', async ({ page }) => {
    await page.goto('/tests/carousel-test.html');
    await expect(page.locator('.carousel .carousel-inner')).toBeVisible();
  });
});
