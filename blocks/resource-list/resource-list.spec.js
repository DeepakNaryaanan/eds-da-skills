import { test, expect } from '@playwright/test';

test.describe('resource-list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/resource-list-test.html');
    await page.waitForSelector('.resource-list .resource-list-grid');
  });

  test('renders a single ul grid container', async ({ page }) => {
    const grid = page.locator('.resource-list .resource-list-grid');
    await expect(grid).toHaveCount(1);
    const tag = await grid.evaluate((el) => el.tagName.toLowerCase());
    expect(tag).toBe('ul');
  });

  test('renders three resource cards as article elements', async ({ page }) => {
    const items = page.locator('.resource-list .resource-list-item');
    await expect(items).toHaveCount(3);
    const articles = page.locator('.resource-list .resource-list-card');
    await expect(articles).toHaveCount(3);
    for (let i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const tag = await articles.nth(i).evaluate((el) => el.tagName.toLowerCase());
      expect(tag).toBe('article');
    }
  });

  test('each title is an h3 containing an anchor', async ({ page }) => {
    const titles = page.locator('.resource-list .resource-list-title');
    await expect(titles).toHaveCount(3);
    for (let i = 0; i < 3; i += 1) {
      const title = titles.nth(i);
      // eslint-disable-next-line no-await-in-loop
      const tag = await title.evaluate((el) => el.tagName.toLowerCase());
      expect(tag).toBe('h3');
      // eslint-disable-next-line no-await-in-loop
      await expect(title.locator('a')).toHaveCount(1);
    }
  });

  test('title links point to the correct article hrefs', async ({ page }) => {
    const links = page.locator('.resource-list .resource-list-title a');
    await expect(links.nth(0)).toHaveAttribute('href', /preserving-muscle/);
    await expect(links.nth(1)).toHaveAttribute('href', /daily-water-intake/);
    await expect(links.nth(2)).toHaveAttribute('href', /protein-myths/);
  });

  test('each card has a category label wrapped in em', async ({ page }) => {
    const categories = page.locator('.resource-list .resource-list-category');
    await expect(categories).toHaveCount(3);
    const firstEm = page.locator('.resource-list .resource-list-category em').first();
    await expect(firstEm).toBeVisible();
    await expect(firstEm).toContainText('Fitness');
  });

  test('each card has a non-empty summary paragraph', async ({ page }) => {
    const summaries = page.locator('.resource-list .resource-list-summary');
    await expect(summaries).toHaveCount(3);
    await expect(summaries.first()).toBeVisible();
    await expect(summaries.first()).not.toBeEmpty();
  });

  test('each card has an optimized picture with at least one source', async ({ page }) => {
    const pictures = page.locator('.resource-list .resource-list-image picture');
    await expect(pictures).toHaveCount(3);
    const sourceCount = await pictures.first().locator('source').count();
    expect(sourceCount).toBeGreaterThan(0);
  });

  test('image alt text is preserved on each card', async ({ page }) => {
    const imgs = page.locator('.resource-list .resource-list-image img');
    await expect(imgs).toHaveCount(3);
    const firstAlt = await imgs.first().getAttribute('alt');
    expect(firstAlt).toBeTruthy();
    expect(firstAlt.length).toBeGreaterThan(0);
  });

  test('title link is reachable via keyboard focus', async ({ page }) => {
    const firstLink = page.locator('.resource-list .resource-list-title a').first();
    await firstLink.focus();
    await expect(firstLink).toBeFocused();
  });
});
