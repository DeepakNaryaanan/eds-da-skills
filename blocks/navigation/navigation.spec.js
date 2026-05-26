import { test, expect } from '@playwright/test';

test.describe('navigation block (standalone)', () => {
  test('renders a list of links from authored rows', async ({ page }) => {
    await page.goto('/tests/navigation-test.html');
    await page.waitForSelector('.navigation .navigation-list');

    const items = page.locator('.navigation .navigation-item');
    expect(await items.count()).toBeGreaterThanOrEqual(3);
    await expect(items.first().locator('a')).toHaveAttribute('href', /.+/);
  });
});
