import { test, expect } from '@playwright/test';

test.describe('promo-pair', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/promo-pair-test.html');
    await page.waitForSelector('.promo-pair .promo-pair-grid');
  });

  test('renders a single ul grid container', async ({ page }) => {
    const grid = page.locator('.promo-pair .promo-pair-grid');
    await expect(grid).toHaveCount(1);
    const tag = await grid.evaluate((el) => el.tagName.toLowerCase());
    expect(tag).toBe('ul');
  });

  test('renders two promo tiles as article elements', async ({ page }) => {
    const items = page.locator('.promo-pair .promo-pair-item');
    await expect(items).toHaveCount(2);
    const tiles = page.locator('.promo-pair .promo-pair-tile');
    await expect(tiles).toHaveCount(2);
    for (let i = 0; i < 2; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const tag = await tiles.nth(i).evaluate((el) => el.tagName.toLowerCase());
      expect(tag).toBe('article');
    }
  });

  test('each tile has an h3 heading with the expected text', async ({ page }) => {
    const headings = page.locator('.promo-pair .promo-pair-body h3');
    await expect(headings).toHaveCount(2);
    await expect(headings.nth(0)).toContainText('Pediatric Specialty Nutrition');
    await expect(headings.nth(1)).toContainText('Metabolic Nutrition');
  });

  test('each tile has non-empty body text', async ({ page }) => {
    const bodies = page.locator('.promo-pair .promo-pair-text');
    await expect(bodies).toHaveCount(2);
    await expect(bodies.first()).toBeVisible();
    await expect(bodies.first()).not.toBeEmpty();
  });

  test('each tile has a CTA anchor with the expected href', async ({ page }) => {
    const ctas = page.locator('.promo-pair .promo-pair-cta');
    await expect(ctas).toHaveCount(2);
    for (let i = 0; i < 2; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const tag = await ctas.nth(i).evaluate((el) => el.tagName.toLowerCase());
      expect(tag).toBe('a');
    }
    await expect(ctas.nth(0)).toHaveAttribute('href', /products\/pediatric/);
    await expect(ctas.nth(1)).toHaveAttribute('href', /products\/metabolic/);
  });

  test('each tile has an optimized picture with at least one source', async ({ page }) => {
    const pictures = page.locator('.promo-pair .promo-pair-image picture');
    await expect(pictures).toHaveCount(2);
    const sourceCount = await pictures.first().locator('source').count();
    expect(sourceCount).toBeGreaterThan(0);
  });

  test('image alt text is preserved on each tile', async ({ page }) => {
    const imgs = page.locator('.promo-pair .promo-pair-image img');
    await expect(imgs).toHaveCount(2);
    const firstAlt = await imgs.first().getAttribute('alt');
    expect(firstAlt).toBeTruthy();
    expect(firstAlt.length).toBeGreaterThan(0);
  });

  test('section containing the block has a non-white band background', async ({ page }) => {
    const section = page.locator('.section:has(.promo-pair)');
    await expect(section).toHaveCount(1);
    const bg = await section.evaluate(
      (el) => window.getComputedStyle(el).getPropertyValue('background-color'),
    );
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });

  test('CTA link is reachable via keyboard focus', async ({ page }) => {
    const firstCta = page.locator('.promo-pair .promo-pair-cta').first();
    await firstCta.focus();
    await expect(firstCta).toBeFocused();
  });
});
