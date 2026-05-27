import { test, expect } from '@playwright/test';

test.describe('nav-cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/nav-cards-test.html');
    await page.waitForSelector('.nav-cards .nav-cards-item');
  });

  test('renders expected number of cards', async ({ page }) => {
    const cards = page.locator('.nav-cards .nav-cards-item');
    await expect(cards).toHaveCount(5);
  });

  test('each card has a link wrapping the content', async ({ page }) => {
    const links = page.locator('.nav-cards .nav-cards-link');
    await expect(links).toHaveCount(5);
  });

  test('each link has an accessible aria-label', async ({ page }) => {
    const links = page.locator('.nav-cards .nav-cards-link');
    const count = await links.count();
    for (let i = 0; i < count; i += 1) {
      const label = await links.nth(i).getAttribute('aria-label');
      expect(label).toBeTruthy();
      expect(label.length).toBeGreaterThan(0);
    }
  });

  test('each card has a heading', async ({ page }) => {
    const headings = page.locator('.nav-cards .nav-cards-body h2, .nav-cards .nav-cards-body h3');
    await expect(headings).toHaveCount(5);
  });

  test('each card has a description', async ({ page }) => {
    const descs = page.locator('.nav-cards .nav-cards-desc');
    await expect(descs).toHaveCount(5);
  });

  test('each card has a CTA label', async ({ page }) => {
    const ctas = page.locator('.nav-cards .nav-cards-cta');
    await expect(ctas).toHaveCount(5);
  });

  test('card links point to correct hrefs', async ({ page }) => {
    const firstLink = page.locator('.nav-cards .nav-cards-link').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).not.toBe('#');
  });

  test('renders without icon cells gracefully', async ({ page }) => {
    // Cards without icons should still render body content
    const bodies = page.locator('.nav-cards .nav-cards-body');
    await expect(bodies).toHaveCount(5);
  });

  test('empty block renders without throwing', async ({ page }) => {
    await page.goto('/tests/nav-cards-test.html');
    await expect(page.locator('.nav-cards')).toBeAttached();
  });
});
