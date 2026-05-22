import { test, expect } from '@playwright/test';

test.describe('patient-resources', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/patient-resources-test.html');
    // Wait for the block to be decorated
    await page.waitForSelector('.patient-resources .patient-resources-layout');
  });

  // ── Happy path — default variant ──────────────────────────────────────────

  test('renders the layout wrapper', async ({ page }) => {
    const layout = page.locator('.patient-resources').first().locator('.patient-resources-layout');
    await expect(layout).toBeVisible();
  });

  test('renders the eyebrow label', async ({ page }) => {
    const eyebrow = page.locator('.patient-resources').first().locator('.patient-resources-eyebrow');
    await expect(eyebrow).toBeVisible();
    await expect(eyebrow).toHaveText('INFORMATION & GUIDES');
  });

  test('renders the section heading', async ({ page }) => {
    const heading = page.locator('.patient-resources').first().locator('.patient-resources-header h2');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Patient Resources');
  });

  test('renders the supporting image', async ({ page }) => {
    const image = page.locator('.patient-resources').first().locator('.patient-resources-image img');
    await expect(image).toBeVisible();
    // Optimized picture src may use .webp or data URI
    const src = await image.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('image has non-empty alt text', async ({ page }) => {
    const image = page.locator('.patient-resources').first().locator('.patient-resources-image img');
    const alt = await image.getAttribute('alt');
    expect(alt).toBeTruthy();
    expect(alt.length).toBeGreaterThan(0);
  });

  test('renders the intro paragraph', async ({ page }) => {
    const intro = page.locator('.patient-resources').first().locator('.patient-resources-intro p');
    await expect(intro).toBeVisible();
    await expect(intro).toContainText('prescription drug coverage');
  });

  // ── Resource items ────────────────────────────────────────────────────────

  test('renders three resource items', async ({ page }) => {
    const items = page.locator('.patient-resources').first().locator('.patient-resources-item');
    await expect(items).toHaveCount(3);
  });

  test('each resource item has a heading', async ({ page }) => {
    const headings = page.locator('.patient-resources').first().locator('.patient-resources-item h3');
    const count = await headings.count();
    expect(count).toBe(3);
  });

  test('first resource item heading text is correct', async ({ page }) => {
    const heading = page.locator('.patient-resources').first().locator('.patient-resources-item').first().locator('h3');
    await expect(heading).toHaveText('Understanding Medicare in 2025');
  });

  test('resource items with description render a description paragraph', async ({ page }) => {
    const desc = page.locator('.patient-resources').first().locator('.patient-resources-item').first().locator('.patient-resources-item-desc');
    await expect(desc).toBeVisible();
    await expect(desc).toContainText('Medicare plans');
  });

  test('resource item without description renders no description paragraph', async ({ page }) => {
    // Third item (index 2) has no description in the test page
    const thirdItem = page.locator('.patient-resources').first().locator('.patient-resources-item').nth(2);
    const desc = thirdItem.locator('.patient-resources-item-desc');
    await expect(desc).toHaveCount(0);
  });

  test('each resource item CTA link is uppercase', async ({ page }) => {
    const cta = page.locator('.patient-resources').first().locator('.patient-resources-item').first().locator('.patient-resources-cta');
    await expect(cta).toBeVisible();
    const text = await cta.textContent();
    expect(text).toBe(text.toUpperCase());
  });

  test('each resource item CTA link has an href', async ({ page }) => {
    const ctas = page.locator('.patient-resources').first().locator('.patient-resources-cta');
    const count = await ctas.count();
    for (let i = 0; i < count; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const href = await ctas.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('chevron is present on every CTA', async ({ page }) => {
    const chevrons = page.locator('.patient-resources').first().locator('.patient-resources-chevron');
    await expect(chevrons).toHaveCount(3);
  });

  test('chevron has aria-hidden attribute', async ({ page }) => {
    const chevron = page.locator('.patient-resources').first().locator('.patient-resources-chevron').first();
    await expect(chevron).toHaveAttribute('aria-hidden', 'true');
  });

  // ── Accessibility ─────────────────────────────────────────────────────────

  test('resource list has aria-label', async ({ page }) => {
    const list = page.locator('.patient-resources').first().locator('.patient-resources-items');
    await expect(list).toHaveAttribute('aria-label', 'Resource list');
  });

  test('resource list is a <ul> element', async ({ page }) => {
    const list = page.locator('.patient-resources').first().locator('.patient-resources-items');
    const tagName = await list.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('ul');
  });

  test('CTA links are focusable via keyboard', async ({ page }) => {
    const cta = page.locator('.patient-resources').first().locator('.patient-resources-cta').first();
    await cta.focus();
    await expect(cta).toBeFocused();
  });

  // ── Dark variant ──────────────────────────────────────────────────────────

  test('dark variant block has the dark class', async ({ page }) => {
    const darkBlock = page.locator('.patient-resources.dark');
    await expect(darkBlock).toHaveCount(1);
    await expect(darkBlock).toBeVisible();
  });

  test('dark variant renders its eyebrow', async ({ page }) => {
    const eyebrow = page.locator('.patient-resources.dark .patient-resources-eyebrow');
    await expect(eyebrow).toBeVisible();
    await expect(eyebrow).toHaveText('COVERAGE RESOURCES');
  });

  test('dark variant renders resource items', async ({ page }) => {
    const items = page.locator('.patient-resources.dark .patient-resources-item');
    await expect(items).toHaveCount(2);
  });
});
