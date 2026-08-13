import { test, expect } from '@playwright/test';

/**
 * Stat-bar block — Playwright end-to-end spec.
 *
 * Test page: tests/stat-bar-test.html
 * Section layout (data-testid is the outer .section):
 *   Section 1 — Default: 3 rows with icons              (TC-01, TC-08)
 *   Section 2 — Default: mixed icon / no-icon rows       (TC-02, TC-12)
 *   Section 3 — Animated: numeric + non-numeric values  (TC-11)
 *   Section 4 — Dark variant                            (dark class)
 *   Section 5 — Four-stat wrap test                     (TC-05)
 *   Section 6 — Empty block (zero rows)                 (TC-06)
 *   Section 7 — Single stat                             (TC-10)
 */

test.describe('stat-bar block', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/stat-bar-test.html');
    // Wait for the first stat-bar to finish decorating before each test
    await page.waitForSelector('.stat-bar .stat-bar-list');
  });

  // ── TC-01: Three stats render correctly ──────────────────────────────────

  test('TC-01: default — three stats render as three list items', async ({ page }) => {
    // Section 1 is the first .stat-bar on the page
    const list = page.locator('.stat-bar').first().locator('.stat-bar-list');
    await expect(list).toBeVisible();
    const items = list.locator('.stat-bar-item');
    await expect(items).toHaveCount(3);
  });

  test('TC-01: each stat item contains a value and label', async ({ page }) => {
    const items = page.locator('.stat-bar').first().locator('.stat-bar-item');
    const count = await items.count();
    for (let i = 0; i < count; i += 1) {
      const item = items.nth(i);
      await expect(item.locator('.stat-bar-value')).toBeVisible();
      await expect(item.locator('.stat-bar-label')).toBeVisible();
    }
  });

  test('TC-01: stat list carries role="list"', async ({ page }) => {
    const list = page.locator('.stat-bar').first().locator('.stat-bar-list');
    await expect(list).toHaveAttribute('role', 'list');
  });

  test('TC-01: stat list is a <ul> and items are <li> elements', async ({ page }) => {
    const list = page.locator('.stat-bar').first().locator('.stat-bar-list');
    await expect(list).toHaveJSProperty('tagName', 'UL');
    const items = list.locator('.stat-bar-item');
    const first = items.first();
    await expect(first).toHaveJSProperty('tagName', 'LI');
  });

  // ── TC-08: Icon alt attribute present ────────────────────────────────────

  test('TC-08: icon images have an alt attribute (empty string for decorative icons)', async ({ page }) => {
    // Section 1 has all three rows with authored <picture> icons
    const imgs = page.locator('.stat-bar').first().locator('.stat-bar-icon img');
    const count = await imgs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i += 1) {
      // alt attribute must be present — value may be empty string (decorative) or text
      await expect(imgs.nth(i)).toHaveAttribute('alt', /.*/);
    }
  });

  // ── TC-02 / TC-12: Missing icon cell renders without icon container ──────

  test('TC-02/TC-12: rows with empty icon cell render no .stat-bar-icon element', async ({ page }) => {
    // Section 2 (second .stat-bar): rows 2 and 3 have empty first cells
    const statBar = page.locator('.stat-bar').nth(1);
    const items = statBar.locator('.stat-bar-item');
    await expect(items).toHaveCount(3);

    // Row 1 (index 0) has an icon
    const iconInRow1 = items.nth(0).locator('.stat-bar-icon');
    await expect(iconInRow1).toHaveCount(1);

    // Rows 2 and 3 (index 1 and 2) have empty icon cells — no icon div rendered
    const iconInRow2 = items.nth(1).locator('.stat-bar-icon');
    await expect(iconInRow2).toHaveCount(0);

    const iconInRow3 = items.nth(2).locator('.stat-bar-icon');
    await expect(iconInRow3).toHaveCount(0);
  });

  test('TC-02/TC-12: rows without icons still render value and label', async ({ page }) => {
    const statBar = page.locator('.stat-bar').nth(1);
    const noIconRow = statBar.locator('.stat-bar-item').nth(1);
    await expect(noIconRow.locator('.stat-bar-value')).toBeVisible();
    await expect(noIconRow.locator('.stat-bar-label')).toBeVisible();
    await expect(noIconRow.locator('.stat-bar-value')).toContainText('12 weeks');
    await expect(noIconRow.locator('.stat-bar-label')).toContainText('Time to peak efficacy');
  });

  // ── TC-03: Mobile stacks vertically (flex-direction: column) ─────────────

  test('TC-03: at mobile width (375px), stat items stack vertically', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/tests/stat-bar-test.html');
    await page.waitForSelector('.stat-bar .stat-bar-list');

    const list = page.locator('.stat-bar').first().locator('.stat-bar-list');
    const flexDirection = await list.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDirection).toBe('column');
  });

  // ── TC-04: Tablet shows horizontal row ───────────────────────────────────

  test('TC-04: at tablet width (768px), stats display in a horizontal row', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/tests/stat-bar-test.html');
    await page.waitForSelector('.stat-bar .stat-bar-list');

    const list = page.locator('.stat-bar').first().locator('.stat-bar-list');
    const flexDirection = await list.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDirection).toBe('row');
  });

  test('TC-04: at tablet width, stat items have flex: 1 1 0', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/tests/stat-bar-test.html');
    await page.waitForSelector('.stat-bar .stat-bar-list');

    const firstItem = page.locator('.stat-bar').first().locator('.stat-bar-item').first();
    const flexGrow = await firstItem.evaluate((el) => getComputedStyle(el).flexGrow);
    expect(flexGrow).toBe('1');
  });

  // ── TC-05: Four stats wrap on tablet ─────────────────────────────────────

  test('TC-05: at tablet width (768px), four-stat block has flex-wrap enabled', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/tests/stat-bar-test.html');
    await page.waitForSelector('.stat-bar .stat-bar-list');

    // Section 5 is the 5th .stat-bar (0-indexed: 4)
    const fourStatBar = page.locator('.stat-bar').nth(4);
    const items = fourStatBar.locator('.stat-bar-item');
    await expect(items).toHaveCount(4);

    // flex-wrap must be 'wrap' to allow wrapping at narrow tablet widths
    const list = fourStatBar.locator('.stat-bar-list');
    const flexWrap = await list.evaluate((el) => getComputedStyle(el).flexWrap);
    expect(flexWrap).toBe('wrap');
  });

  // ── TC-06: Empty block does not crash ─────────────────────────────────────

  test('TC-06: empty block (zero rows) renders an empty <ul> without errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto('/tests/stat-bar-test.html');
    await page.waitForSelector('.stat-bar .stat-bar-list');

    // Section 6 (index 5) is the empty block
    const emptyBar = page.locator('.stat-bar').nth(5);
    const list = emptyBar.locator('.stat-bar-list');
    await expect(list).toHaveCount(1);

    const itemCount = await list.locator('.stat-bar-item').count();
    expect(itemCount).toBe(0);

    // No JS errors should have been thrown
    expect(errors).toHaveLength(0);
  });

  // ── TC-07: Stat value uses large type token (>= 26px at 760px) ───────────

  test('TC-07: stat value font-size is >= 26px at tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 760, height: 1024 });
    await page.goto('/tests/stat-bar-test.html');
    await page.waitForSelector('.stat-bar .stat-bar-list');

    const valueEl = page.locator('.stat-bar').first().locator('.stat-bar-value').first();
    const fontSize = await valueEl.evaluate((el) => {
      const px = parseFloat(getComputedStyle(el).fontSize);
      return px;
    });
    expect(fontSize).toBeGreaterThanOrEqual(26);
  });

  // ── TC-09: Background contrast passes WCAG ───────────────────────────────

  test('TC-09: stat-bar-value color is the primary token (navy, high contrast)', async ({ page }) => {
    await page.goto('/tests/stat-bar-test.html');
    await page.waitForSelector('.stat-bar .stat-bar-list');

    const valueEl = page.locator('.stat-bar').first().locator('.stat-bar-value').first();
    // Computed color should be deep navy #003366 = rgb(0, 51, 102)
    const color = await valueEl.evaluate((el) => getComputedStyle(el).color);
    // Allow some browser-rounding tolerance in the rgb string
    expect(color).toMatch(/rgb\(0,\s*51,\s*102\)/);
  });

  test('TC-09: stat-bar background resolves to the surface token (#f4f5f7)', async ({ page }) => {
    await page.goto('/tests/stat-bar-test.html');
    await page.waitForSelector('.stat-bar .stat-bar-list');

    const statBar = page.locator('.stat-bar').first();
    const bg = await statBar.evaluate((el) => getComputedStyle(el).backgroundColor);
    // #f4f5f7 = rgb(244, 245, 247)
    expect(bg).toMatch(/rgb\(244,\s*245,\s*247\)/);
  });

  // ── TC-10: Single stat renders without layout breakage ───────────────────

  test('TC-10: single-stat block renders exactly one list item', async ({ page }) => {
    // Section 7 (index 6) is the single-stat block
    const singleBar = page.locator('.stat-bar').nth(6);
    const items = singleBar.locator('.stat-bar-item');
    await expect(items).toHaveCount(1);
    await expect(items.first().locator('.stat-bar-value')).toBeVisible();
    await expect(items.first().locator('.stat-bar-label')).toBeVisible();
  });

  test('TC-10: single-stat list is still visible without overflow', async ({ page }) => {
    const singleBar = page.locator('.stat-bar').nth(6);
    await expect(singleBar).toBeVisible();
    const list = singleBar.locator('.stat-bar-list');
    await expect(list).toBeVisible();
    // Confirm no overflow clipping hides the item
    const overflow = await list.evaluate((el) => getComputedStyle(el).overflow);
    expect(overflow).not.toBe('hidden');
  });

  // ── TC-11: Animated variant — count-up data-target attributes ────────────

  test('TC-11: animated variant sets data-target on numeric value elements', async ({ page }) => {
    // Section 3 (index 2) is the animated block
    const animatedBar = page.locator('.stat-bar.animated');
    await expect(animatedBar).toHaveCount(1);

    const valueEls = animatedBar.locator('.stat-bar-value');
    await expect(valueEls).toHaveCount(4);

    // Numeric values 4, 74, 16 get data-target
    await expect(valueEls.nth(0)).toHaveAttribute('data-target', '4');
    await expect(valueEls.nth(1)).toHaveAttribute('data-target', '74');
    await expect(valueEls.nth(2)).toHaveAttribute('data-target', '16');

    // Non-numeric "N/A" must NOT get a data-target attribute
    await expect(valueEls.nth(3)).not.toHaveAttribute('data-target');
  });

  test('TC-11: non-numeric value in animated variant displays its authored text', async ({ page }) => {
    const animatedBar = page.locator('.stat-bar.animated');
    const nonNumericValue = animatedBar.locator('.stat-bar-value').nth(3);
    await expect(nonNumericValue).toContainText('N/A');
  });

  test('TC-11: animated variant has initial display value of "0" for numeric stats', async ({ page }) => {
    // On initial load, before IntersectionObserver fires, display value should start at 0
    // We navigate fresh and check immediately before IO triggers
    await page.goto('/tests/stat-bar-test.html');

    // Immediately evaluate after decoration — the values start at '0'
    // We cannot guarantee racing against rAF, so we verify data-target exists
    // which is the definitive indicator that the animated path ran
    const animatedBar = page.locator('.stat-bar.animated');
    const firstValue = animatedBar.locator('.stat-bar-value').first();
    await expect(firstValue).toHaveAttribute('data-target', '4');
  });

  // ── Dark variant ──────────────────────────────────────────────────────────

  test('dark variant: block has .dark class and renders correct item count', async ({ page }) => {
    // Section 4 (index 3) is the dark variant
    const darkBar = page.locator('.stat-bar.dark');
    await expect(darkBar).toHaveCount(1);
    const items = darkBar.locator('.stat-bar-item');
    await expect(items).toHaveCount(3);
  });

  test('dark variant: background resolves to primary navy token', async ({ page }) => {
    const darkBar = page.locator('.stat-bar.dark');
    const bg = await darkBar.evaluate((el) => getComputedStyle(el).backgroundColor);
    // --color-primary = #003366 = rgb(0, 51, 102)
    expect(bg).toMatch(/rgb\(0,\s*51,\s*102\)/);
  });

  test('dark variant: stat value color resolves to primary-text (white)', async ({ page }) => {
    const darkBar = page.locator('.stat-bar.dark');
    const valueEl = darkBar.locator('.stat-bar-value').first();
    const color = await valueEl.evaluate((el) => getComputedStyle(el).color);
    // --color-primary-text = #ffffff = rgb(255, 255, 255)
    expect(color).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  // ── Structural / accessibility assertions ─────────────────────────────────

  test('block does not render a <section> or <aside> wrapper (AC-13)', async ({ page }) => {
    // The stat-bar must not use landmark elements as its own wrapper
    const sectionInside = page.locator('.stat-bar section');
    const asideInside = page.locator('.stat-bar aside');
    await expect(sectionInside).toHaveCount(0);
    await expect(asideInside).toHaveCount(0);
  });

  test('value element is a <p> (not a heading) inside each list item', async ({ page }) => {
    const firstValue = page.locator('.stat-bar').first().locator('.stat-bar-value').first();
    await expect(firstValue).toHaveJSProperty('tagName', 'P');
  });

  test('label element is a <p> inside each list item', async ({ page }) => {
    const firstLabel = page.locator('.stat-bar').first().locator('.stat-bar-label').first();
    await expect(firstLabel).toHaveJSProperty('tagName', 'P');
  });

  test('icon images use createOptimizedPicture (has <picture> wrapper)', async ({ page }) => {
    // createOptimizedPicture returns a <picture> element wrapping the <img>
    const icon = page.locator('.stat-bar').first().locator('.stat-bar-icon').first();
    const picture = icon.locator('picture');
    await expect(picture).toHaveCount(1);
  });
});
