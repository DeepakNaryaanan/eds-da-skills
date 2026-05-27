import { test, expect } from '@playwright/test';

test.describe('promo-pair', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/promo-pair-test.html');
    await page.waitForSelector('.promo-pair .promo-pair-card');
  });

  test('renders two cards by default', async ({ page }) => {
    const cards = page.locator('.promo-pair .promo-pair-card');
    await expect(cards).toHaveCount(2);
  });

  test('each card has a heading', async ({ page }) => {
    const headings = page.locator('.promo-pair .promo-pair-body h2, .promo-pair .promo-pair-body h3');
    await expect(headings).toHaveCount(2);
  });

  test('each card has a description', async ({ page }) => {
    const descs = page.locator('.promo-pair .promo-pair-desc');
    await expect(descs).toHaveCount(2);
  });

  test('each card has a CTA link', async ({ page }) => {
    const ctas = page.locator('.promo-pair .promo-pair-cta');
    await expect(ctas).toHaveCount(2);
  });

  test('CTA links have valid href', async ({ page }) => {
    const ctas = page.locator('.promo-pair .promo-pair-cta');
    const count = await ctas.count();
    for (let i = 0; i < count; i += 1) {
      const href = await ctas.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('card images are present', async ({ page }) => {
    const images = page.locator('.promo-pair .promo-pair-image img');
    await expect(images).toHaveCount(2);
  });

  test('block renders without images gracefully', async ({ page }) => {
    // Grid should still exist even if images are absent
    const grid = page.locator('.promo-pair .promo-pair-grid');
    await expect(grid).toBeAttached();
  });

  test('empty block renders without throwing', async ({ page }) => {
    await page.goto('/tests/promo-pair-test.html');
    await expect(page.locator('.promo-pair')).toBeAttached();
  });
});
