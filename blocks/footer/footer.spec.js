import { test, expect } from '@playwright/test';

test.describe('footer block', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/footer-test.html');
    await page.waitForSelector('footer .footer-inner');
  });

  test('renders the footer inner wrapper', async ({ page }) => {
    await expect(page.locator('footer .footer-inner')).toBeVisible();
  });

  test('renders multi-column link groups', async ({ page }) => {
    const cols = page.locator('footer .footer-columns');
    await expect(cols).toBeVisible();
    expect(await cols.locator('h3, h4').count()).toBeGreaterThanOrEqual(2);
    expect(await cols.locator('ul li a').count()).toBeGreaterThanOrEqual(4);
  });

  test('renders a legal bar after the horizontal rule', async ({ page }) => {
    const legal = page.locator('footer .footer-legal');
    await expect(legal).toBeVisible();
    await expect(legal).toContainText(/©|copyright|all rights reserved/i);
  });
});
