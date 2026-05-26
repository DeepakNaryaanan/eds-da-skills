import { test, expect } from '@playwright/test';

test.describe('header block', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/header-test.html');
    await page.waitForSelector('header .header-bar');
  });

  test('renders the header bar', async ({ page }) => {
    await expect(page.locator('header .header-bar')).toBeVisible();
  });

  test('renders the logo link to /', async ({ page }) => {
    const logo = page.locator('header .header-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '/');
    await expect(logo).toHaveAttribute('aria-label', /go to home/i);
    await expect(logo.locator('img, picture')).toHaveCount(1);
  });

  test('renders the navigation list with one item per authored row', async ({ page }) => {
    const items = page.locator('header .header-nav .navigation-item');
    await expect(items.first()).toBeVisible();
    expect(await items.count()).toBeGreaterThanOrEqual(2);
  });

  test('hamburger button has accessible label and starts collapsed', async ({ page }) => {
    const btn = page.locator('header .header-nav-toggle');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(btn).toHaveAttribute('aria-label', /open menu/i);
    await expect(btn).toHaveAttribute('aria-controls', 'header-nav');
  });

  test('clicking hamburger opens and closes the mobile drawer', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/tests/header-test.html');
    await page.waitForSelector('header .header-bar');

    const btn = page.locator('header .header-nav-toggle');
    const nav = page.locator('header #header-nav');

    await expect(nav).not.toBeVisible();
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(btn).toHaveAttribute('aria-label', /close menu/i);
    await expect(nav).toBeVisible();

    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).not.toBeVisible();
  });
});
