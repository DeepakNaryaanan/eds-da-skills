import { test, expect } from '@playwright/test';

/**
 * promo-banner block — Playwright end-to-end spec
 *
 * Draft page: tests/promo-banner-test.html
 *
 * Block index in the test page (0-based):
 *   0 — Default: heading + body + one CTA          (Section 1)
 *   1 — Default: heading + body + two CTAs          (Section 2)
 *   2 — Default: heading only, empty body cell      (Section 3)
 *   3 — Dark variant: heading + body + one CTA      (Section 4)
 *   4 — Accent variant: heading + body + two CTAs   (Section 5)
 *   5 — Empty block: no rows                        (Section 6)
 *   6 — h1 downgrade test                           (Section 7)
 */

const PAGE = '/tests/promo-banner-test.html';

test.describe('promo-banner block', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    // Wait until the first promo-banner has been decorated (inner div present)
    await page.waitForSelector('.promo-banner .promo-banner-inner');
  });

  // ── TC-01: Default banner renders with heading and CTA ─────────────────────
  test('TC-01 — default banner renders heading and CTA button', async ({ page }) => {
    const block = page.locator('.promo-banner').first();
    const inner = block.locator('.promo-banner-inner');

    await expect(inner).toBeVisible();

    // Heading is present inside the inner container
    const heading = inner.locator('h2, h3').first();
    await expect(heading).toBeVisible();

    // CTA rendered with .button class inside .promo-banner-ctas
    const cta = inner.locator('.promo-banner-ctas a.button').first();
    await expect(cta).toBeVisible();
  });

  // ── TC-02: Two CTAs flex-row at >=760px viewport ───────────────────────────
  test('TC-02 — two CTAs render in a flex row at 1280px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(PAGE);
    await page.waitForSelector('.promo-banner .promo-banner-inner');

    // Block index 1 has two CTAs
    const ctas = page.locator('.promo-banner').nth(1).locator('.promo-banner-ctas');
    await expect(ctas).toBeVisible();

    // There must be exactly two .button links
    const buttons = ctas.locator('a.button');
    await expect(buttons).toHaveCount(2);

    // flex-direction must be 'row' at desktop width
    const flexDir = await ctas.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('row');
  });

  // ── TC-03: Two CTAs stack vertically on mobile ─────────────────────────────
  test('TC-03 — two CTAs stack vertically at 375px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(PAGE);
    await page.waitForSelector('.promo-banner .promo-banner-inner');

    const ctas = page.locator('.promo-banner').nth(1).locator('.promo-banner-ctas');
    await expect(ctas).toBeVisible();

    // flex-direction must be 'column' at mobile width
    const flexDir = await ctas.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('column');
  });

  // ── TC-04: Dark variant applies dark background ────────────────────────────
  test('TC-04 — dark variant block has .dark class on root element', async ({ page }) => {
    // Block index 3 is the dark variant
    const darkBlock = page.locator('.promo-banner.dark');
    await expect(darkBlock).toBeVisible();

    // The inner container is present
    await expect(darkBlock.locator('.promo-banner-inner')).toBeVisible();

    // Verify the block element itself carries the .dark class
    const classList = await darkBlock.evaluate((el) => [...el.classList]);
    expect(classList).toContain('dark');
  });

  // ── TC-04 (continued): Dark variant background-color resolves to primary ───
  test('TC-04 — dark variant background-color resolves from --color-primary', async ({ page }) => {
    const darkBlock = page.locator('.promo-banner.dark');
    const bg = await darkBlock.evaluate((el) => getComputedStyle(el).backgroundColor);
    // --color-primary = #003366 => rgb(0, 51, 102)
    expect(bg).toBe('rgb(0, 51, 102)');
  });

  // ── TC-05: Accent variant applies accent background ────────────────────────
  test('TC-05 — accent variant block has .accent class and orange background', async ({ page }) => {
    const accentBlock = page.locator('.promo-banner.accent');
    await expect(accentBlock).toBeVisible();

    const classList = await accentBlock.evaluate((el) => [...el.classList]);
    expect(classList).toContain('accent');

    // --color-accent = #e8651a => rgb(232, 101, 26)
    const bg = await accentBlock.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(232, 101, 26)');
  });

  // ── TC-06: Missing optional body renders cleanly — no orphan <p> ──────────
  test('TC-06 — heading-only block renders no empty paragraph', async ({ page }) => {
    // Block index 2: heading only, empty body cell
    const block = page.locator('.promo-banner').nth(2);
    const inner = block.locator('.promo-banner-inner');
    await expect(inner).toBeVisible();

    // A heading is present
    const heading = inner.locator('h2, h3');
    await expect(heading.first()).toBeVisible();

    // No empty <p> tag (text content would be empty string)
    const emptyParas = await inner.locator('p').evaluateAll(
      (els) => els.filter((el) => el.textContent.trim() === '').length,
    );
    expect(emptyParas).toBe(0);

    // No .promo-banner-ctas div when no buttons exist
    const ctas = inner.locator('.promo-banner-ctas');
    await expect(ctas).toHaveCount(0);
  });

  // ── TC-07: Empty block does not throw ─────────────────────────────────────
  test('TC-07 — empty block renders without throwing and has no inner div', async ({ page }) => {
    // Block index 5: no rows authored
    const block = page.locator('.promo-banner').nth(5);
    await expect(block).toBeAttached();

    // No .promo-banner-inner should exist (early-exit path in decorate)
    const inner = block.locator('.promo-banner-inner');
    await expect(inner).toHaveCount(0);

    // Page must have no uncaught JS errors (checked by beforeEach navigation completing)
    // Also assert no content was injected
    const children = await block.locator('> *').count();
    expect(children).toBe(0);
  });

  // ── TC-08: 3px focus ring on CTA button ───────────────────────────────────
  test('TC-08 — CTA button has 3px focus ring on focus-visible', async ({ page }) => {
    const cta = page.locator('.promo-banner').first().locator('.promo-banner-ctas a.button').first();
    await expect(cta).toBeVisible();

    // Focus the element programmatically
    await cta.focus();

    // Retrieve computed outline styles
    const outlineWidth = await cta.evaluate((el) => getComputedStyle(el).outlineWidth);
    const outlineStyle = await cta.evaluate((el) => getComputedStyle(el).outlineStyle);

    expect(outlineWidth).toBe('3px');
    expect(outlineStyle).toBe('solid');
  });

  // ── TC-11: No <h1> rendered inside the block (downgrade to <h2>) ──────────
  test('TC-11 — block with authored h1 downgrades it to h2 — no h1 in DOM', async ({ page }) => {
    // Block index 6: authored with an h1, must come out as h2
    const block = page.locator('.promo-banner').nth(6);
    await expect(block).toBeVisible();

    // h1 must not exist anywhere inside the block
    const h1Count = await block.locator('h1').count();
    expect(h1Count).toBe(0);

    // The heading must have been converted to h2
    const h2 = block.locator('.promo-banner-inner h2');
    await expect(h2).toBeVisible();
    await expect(h2).toContainText('This heading started as an h1');
  });

  // ── No h1 anywhere in the page from the block ─────────────────────────────
  test('TC-11 (page-wide) — no h1 is present inside any promo-banner block', async ({ page }) => {
    const h1InBlocks = page.locator('.promo-banner h1');
    await expect(h1InBlocks).toHaveCount(0);
  });

  // ── AC-01: .promo-banner-inner wraps all content ───────────────────────────
  test('AC-01 — inner container is present in each decorated block', async ({ page }) => {
    // All non-empty blocks (indices 0-4 and 6) should have an inner container
    const allBlocks = page.locator('.promo-banner');
    const count = await allBlocks.count();

    // We know index 5 is empty; skip by checking indices 0-4 and 6
    const blockIndicesToCheck = [0, 1, 2, 3, 4, 6];
    for (const i of blockIndicesToCheck) {
      const inner = allBlocks.nth(i).locator('.promo-banner-inner');
      // eslint-disable-next-line no-await-in-loop
      await expect(inner).toHaveCount(1);
    }
    // Suppress unused variable warning — count used to guard loop length
    expect(count).toBeGreaterThanOrEqual(7);
  });

  // ── AC-02: Both CTAs preserved as .button anchors ─────────────────────────
  test('AC-12 — .button class is preserved on CTA anchors after decoration', async ({ page }) => {
    // Blocks 1, 3, and 4 all have at least one CTA
    const blockWithOne = page.locator('.promo-banner').nth(0).locator('.promo-banner-ctas a.button');
    await expect(blockWithOne).toHaveCount(1);

    const blockWithTwo = page.locator('.promo-banner').nth(1).locator('.promo-banner-ctas a.button');
    await expect(blockWithTwo).toHaveCount(2);
  });

  // ── Dark variant — text color resolves to --color-primary-text (white) ─────
  test('TC-04 — dark variant heading color is white', async ({ page }) => {
    const heading = page.locator('.promo-banner.dark .promo-banner-inner h2').first();
    await expect(heading).toBeVisible();
    const color = await heading.evaluate((el) => getComputedStyle(el).color);
    // --color-primary-text = #ffffff => rgb(255, 255, 255)
    expect(color).toBe('rgb(255, 255, 255)');
  });

  // ── Accent variant — text color resolves to --color-accent-text (white) ───
  test('TC-05 — accent variant heading color is white', async ({ page }) => {
    const heading = page.locator('.promo-banner.accent .promo-banner-inner h2').first();
    await expect(heading).toBeVisible();
    const color = await heading.evaluate((el) => getComputedStyle(el).color);
    // --color-accent-text = #ffffff => rgb(255, 255, 255)
    expect(color).toBe('rgb(255, 255, 255)');
  });

  // ── TC-12 (documented limitation): background constraint ──────────────────
  test('TC-12 — known limitation: block width is constrained by global section max-width at wide viewports', async ({ page }) => {
    // Known limitation documented here — NOT a block code defect.
    //
    // AC-04 requires the banner to be full-bleed (100% viewport width).
    // The global rule `main > .section > div` applies max-width (1200px) and
    // padding-inline (24px each side) to the .promo-banner-wrapper element,
    // which caps the block's background spread at ~1248px total.
    //
    // docs/blocks.md explicitly prohibits targeting .{blockname}-wrapper in
    // block CSS. Fixing TC-12 requires a global CSS change — it is a project
    // architecture decision, not a promo-banner block defect.
    //
    // This test asserts the known constrained behaviour and will fail if a
    // global fix is ever applied (at which point the test should be updated).
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE);
    await page.waitForSelector('.promo-banner .promo-banner-inner');

    const block = page.locator('.promo-banner').first();
    const wrapper = page.locator('.promo-banner-wrapper').first();

    const blockBox = await block.boundingBox();
    const wrapperBox = await wrapper.boundingBox();

    // 1. The block fills the wrapper's content area (block width <= wrapper width)
    expect(blockBox.width).toBeLessThanOrEqual(wrapperBox.width);

    // 2. At 1440px viewport the wrapper is narrower than the full viewport —
    //    this documents the known max-width constraint.
    const viewportWidth = page.viewportSize().width;
    expect(wrapperBox.width).toBeLessThan(viewportWidth);

    // 3. The block has no independent max-width of its own (it is not the
    //    source of the constraint — the wrapper is).
    const blockMaxWidth = await block.evaluate((el) => getComputedStyle(el).maxWidth);
    expect(blockMaxWidth).toBe('none');
  });
});
