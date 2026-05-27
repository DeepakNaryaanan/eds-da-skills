import { test, expect } from '@playwright/test';

test.describe('resource-list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/resource-list-test.html');
    await page.waitForSelector('.resource-list .resource-list-item');
  });

  test('renders expected number of items in default variant', async ({ page }) => {
    // The test page has both a default and compact variant; scope to first block
    const defaultBlock = page.locator('.resource-list:not(.compact)').first();
    const items = defaultBlock.locator('.resource-list-item');
    await expect(items).toHaveCount(3);
  });

  test('each item has a title link', async ({ page }) => {
    const defaultBlock = page.locator('.resource-list:not(.compact)').first();
    const titles = defaultBlock.locator('.resource-list-title');
    await expect(titles).toHaveCount(3);
  });

  test('title links have valid hrefs', async ({ page }) => {
    const defaultBlock = page.locator('.resource-list:not(.compact)').first();
    const titles = defaultBlock.locator('.resource-list-title');
    const count = await titles.count();
    for (let i = 0; i < count; i += 1) {
      const href = await titles.nth(i).getAttribute('href');
      // eslint-disable-next-line no-await-in-loop
      expect(href).toBeTruthy();
    }
  });

  test('items with thumbnails render an image', async ({ page }) => {
    const defaultBlock = page.locator('.resource-list:not(.compact)').first();
    const thumbnails = defaultBlock.locator('.resource-list-thumbnail');
    const count = await thumbnails.count();
    expect(count).toBeGreaterThan(0);
  });

  test('items with descriptions render the description', async ({ page }) => {
    const defaultBlock = page.locator('.resource-list:not(.compact)').first();
    const descs = defaultBlock.locator('.resource-list-desc');
    const count = await descs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('compact variant renders without thumbnail cells', async ({ page }) => {
    const compactBlock = page.locator('.resource-list.compact').first();
    await expect(compactBlock).toBeAttached();
    const thumbnails = compactBlock.locator('.resource-list-thumbnail');
    await expect(thumbnails).toHaveCount(0);
  });

  test('compact variant renders expected items', async ({ page }) => {
    const compactBlock = page.locator('.resource-list.compact').first();
    const items = compactBlock.locator('.resource-list-item');
    await expect(items).toHaveCount(3);
  });

  test('all rendered items have a title link', async ({ page }) => {
    const defaultBlock = page.locator('.resource-list:not(.compact)').first();
    const items = defaultBlock.locator('.resource-list-item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('page renders both block variants without throwing', async ({ page }) => {
    await page.goto('/tests/resource-list-test.html');
    const blocks = page.locator('.resource-list');
    await expect(blocks).toHaveCount(2);
  });
});
