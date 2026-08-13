import { test, expect } from '@playwright/test';

/**
 * promo-banner — Page-level Playwright spec (Phase 9)
 *
 * Usage page:  tests/promo-banner-usage.html
 *   - DUOPA patient-support page
 *   - h1 intro section + 3 promo-banner blocks interleaved with default-content
 *   - Self-contained: nav / footer resolved from /tests/fragments/*
 *
 * Block-library page: tests/block-library.html
 *   - Contains 4 promo-banner entries (Default 1-CTA, Default 2-CTA, dark, accent)
 *
 * Block positions in usage page (0-based .promo-banner index):
 *   0 — Default variant  ("Need help managing your DUOPA therapy?")
 *   1 — Dark variant     ("Talk to your healthcare provider")
 *   2 — Accent variant   ("Abbott Patient Assistance Program")
 *
 * Coverage:
 *   PU-01  All three variant class names present after decoration
 *   PU-02  Every block has a .promo-banner-inner child
 *   PU-03  All heading elements inside blocks are <h2> or <h3> — no <h1>
 *   PU-04  Dark variant background resolves to --color-primary (rgb(0, 51, 102))
 *   PU-05  Accent variant background resolves to --color-accent (rgb(232, 101, 26))
 *   PU-06  Default variant background resolves to --color-primary-subtle (not the dark or accent values)
 *   PU-07  Two-CTA dark block: CTAs are flex-row at >=760px viewport
 *   PU-08  Two-CTA accent block: CTAs stack at 375px viewport
 *   PU-09  Keyboard tab: focus ring is visible on CTA button (3px solid outline)
 *   PU-10  Adjacent default-content sections are not affected by block decoration
 *   PU-11  Page h1 exists exactly once (in the intro section, not inside any block)
 *   PU-12  Block-library page renders all 4 promo-banner entries
 */

const USAGE_PAGE = '/tests/promo-banner-usage.html';
const LIBRARY_PAGE = '/tests/block-library.html';

test.describe('promo-banner — usage page (page-level integration)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(USAGE_PAGE);
    // Wait until all three promo-banner blocks have been decorated
    await page.waitForSelector('.promo-banner .promo-banner-inner');
  });

  // ── PU-01: All three variant class names are present after decoration ────────
  test('PU-01 — all three promo-banner variants render with correct class names', async ({ page }) => {
    // Default variant: no extra modifier class
    const defaultBlock = page.locator('.promo-banner:not(.dark):not(.accent)');
    await expect(defaultBlock).toHaveCount(1);

    // Dark variant
    const darkBlock = page.locator('.promo-banner.dark');
    await expect(darkBlock).toHaveCount(1);

    // Accent variant
    const accentBlock = page.locator('.promo-banner.accent');
    await expect(accentBlock).toHaveCount(1);
  });

  // ── PU-02: Every decorated block contains .promo-banner-inner ───────────────
  test('PU-02 — every promo-banner block has a .promo-banner-inner structure', async ({ page }) => {
    const allBlocks = page.locator('.promo-banner');
    const count = await allBlocks.count();

    expect(count).toBe(3);

    for (let i = 0; i < count; i += 1) {
      const inner = allBlocks.nth(i).locator('.promo-banner-inner');
      // eslint-disable-next-line no-await-in-loop
      await expect(inner).toHaveCount(1);
      // eslint-disable-next-line no-await-in-loop
      await expect(inner).toBeVisible();
    }
  });

  // ── PU-03: h1 downgrade guard — no h1 inside any promo-banner block ─────────
  test('PU-03 — no <h1> element exists inside any promo-banner block', async ({ page }) => {
    const h1InBlocks = page.locator('.promo-banner h1');
    await expect(h1InBlocks).toHaveCount(0);

    // All headings inside blocks must be h2 or h3
    const allBlocks = page.locator('.promo-banner');
    const count = await allBlocks.count();
    for (let i = 0; i < count; i += 1) {
      const headings = allBlocks.nth(i).locator('.promo-banner-inner h2, .promo-banner-inner h3');
      // eslint-disable-next-line no-await-in-loop
      await expect(headings.first()).toBeVisible();
    }
  });

  // ── PU-04: Dark variant background colour resolves to --color-primary ────────
  test('PU-04 — dark variant background-color is rgb(0, 51, 102)', async ({ page }) => {
    const darkBlock = page.locator('.promo-banner.dark');
    const bg = await darkBlock.evaluate((el) => getComputedStyle(el).backgroundColor);
    // --color-primary = #003366 → rgb(0, 51, 102)
    expect(bg).toBe('rgb(0, 51, 102)');
  });

  // ── PU-05: Accent variant background colour resolves to --color-accent ───────
  test('PU-05 — accent variant background-color is rgb(232, 101, 26)', async ({ page }) => {
    const accentBlock = page.locator('.promo-banner.accent');
    const bg = await accentBlock.evaluate((el) => getComputedStyle(el).backgroundColor);
    // --color-accent = #e8651a → rgb(232, 101, 26)
    expect(bg).toBe('rgb(232, 101, 26)');
  });

  // ── PU-06: Default variant background is not dark or accent ─────────────────
  test('PU-06 — default variant background-color is not the dark or accent value', async ({ page }) => {
    const defaultBlock = page.locator('.promo-banner:not(.dark):not(.accent)');
    const bg = await defaultBlock.evaluate((el) => getComputedStyle(el).backgroundColor);

    // Must not be the dark (navy) or accent (orange) values
    expect(bg).not.toBe('rgb(0, 51, 102)');
    expect(bg).not.toBe('rgb(232, 101, 26)');

    // Must not be transparent (i.e. a colour IS applied)
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  });

  // ── PU-07: Dark block has two CTAs; they flex-row at >=760px ────────────────
  test('PU-07 — dark block two CTAs are flex-row at 1280px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(USAGE_PAGE);
    await page.waitForSelector('.promo-banner .promo-banner-inner');

    const ctas = page.locator('.promo-banner.dark .promo-banner-ctas');
    await expect(ctas).toBeVisible();

    // The dark block in the usage page has two CTA links
    const buttons = ctas.locator('a.button');
    await expect(buttons).toHaveCount(2);

    // flex-direction must be 'row' at desktop width (media query fires at 760px)
    const flexDir = await ctas.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('row');
  });

  // ── PU-08: Accent block two CTAs stack at 375px viewport ────────────────────
  test('PU-08 — accent block two CTAs stack vertically at 375px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(USAGE_PAGE);
    await page.waitForSelector('.promo-banner .promo-banner-inner');

    const ctas = page.locator('.promo-banner.accent .promo-banner-ctas');
    await expect(ctas).toBeVisible();

    // The accent block has two CTAs
    const buttons = ctas.locator('a.button');
    await expect(buttons).toHaveCount(2);

    // flex-direction must be 'column' at 375px (below the 760px breakpoint)
    const flexDir = await ctas.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('column');
  });

  // ── PU-09: Keyboard focus ring on CTA button — 3px solid outline ────────────
  test('PU-09 — CTA button shows 3px solid focus ring on keyboard focus', async ({ page }) => {
    // Test against the default block's CTA
    const cta = page.locator('.promo-banner:not(.dark):not(.accent) .promo-banner-ctas a.button').first();
    await expect(cta).toBeVisible();

    await cta.focus();

    const outlineWidth = await cta.evaluate((el) => getComputedStyle(el).outlineWidth);
    const outlineStyle = await cta.evaluate((el) => getComputedStyle(el).outlineStyle);

    expect(outlineWidth).toBe('3px');
    expect(outlineStyle).toBe('solid');
  });

  // ── PU-09 (dark variant): Dark CTA button focus ring ────────────────────────
  test('PU-09 — dark variant CTA button shows 3px solid focus ring on keyboard focus', async ({ page }) => {
    const cta = page.locator('.promo-banner.dark .promo-banner-ctas a.button').first();
    await expect(cta).toBeVisible();

    await cta.focus();

    const outlineWidth = await cta.evaluate((el) => getComputedStyle(el).outlineWidth);
    const outlineStyle = await cta.evaluate((el) => getComputedStyle(el).outlineStyle);

    expect(outlineWidth).toBe('3px');
    expect(outlineStyle).toBe('solid');
  });

  // ── PU-10: Adjacent default-content sections are intact ─────────────────────
  test('PU-10 — adjacent default-content sections are not mutated by block decoration', async ({ page }) => {
    // The usage page has three non-block sections with headings and paragraphs
    // Verify they are still present and visible after decoration

    // "How DUOPA Works" — appears between default and dark banners
    const howDuopaHeading = page.locator('main').getByText('How DUOPA Works', { exact: true });
    await expect(howDuopaHeading).toBeVisible();

    // "Support Every Step of the Way" — between dark and accent banners
    const supportHeading = page.locator('main').getByText('Support Every Step of the Way', { exact: true });
    await expect(supportHeading).toBeVisible();

    // "Important Safety Information" — after accent banner
    const safetyHeading = page.locator('main').getByText('Important Safety Information', { exact: true });
    await expect(safetyHeading).toBeVisible();
  });

  // ── PU-11: Exactly one h1 on the page — in the intro section, not a block ───
  test('PU-11 — exactly one <h1> exists and it is in the intro section, not inside a block', async ({ page }) => {
    const allH1s = page.locator('h1');
    await expect(allH1s).toHaveCount(1);

    // The h1 must NOT be inside a .promo-banner block
    const h1InBlock = page.locator('.promo-banner h1');
    await expect(h1InBlock).toHaveCount(0);

    // The sole h1 must contain the page's intro text
    await expect(allH1s.first()).toContainText('Living Well with DUOPA');
  });

  // ── Accessibility: Dark variant text colour is white ────────────────────────
  test('A11Y — dark variant heading text resolves to white (--color-primary-text)', async ({ page }) => {
    const heading = page.locator('.promo-banner.dark .promo-banner-inner h2').first();
    await expect(heading).toBeVisible();
    const color = await heading.evaluate((el) => getComputedStyle(el).color);
    // --color-primary-text = #ffffff → rgb(255, 255, 255)
    expect(color).toBe('rgb(255, 255, 255)');
  });

  // ── Accessibility: Accent variant text colour is white ──────────────────────
  test('A11Y — accent variant heading text resolves to white (--color-accent-text)', async ({ page }) => {
    const heading = page.locator('.promo-banner.accent .promo-banner-inner h2').first();
    await expect(heading).toBeVisible();
    const color = await heading.evaluate((el) => getComputedStyle(el).color);
    // --color-accent-text = #ffffff → rgb(255, 255, 255)
    expect(color).toBe('rgb(255, 255, 255)');
  });
});

test.describe('promo-banner — block-library page (library integration)', () => {
  // NOTE: blocks nested inside .library-entry divs are three levels deep from
  // .section (section > wrapper > library-entry > block). The AEM decorateBlocks
  // selector matches only two levels deep (section > wrapper > block), so the
  // promo-banner blocks inside .library-entry are never decorated by the standard
  // pipeline. Decoration-dependent assertions (e.g. .promo-banner-inner) are
  // intentionally omitted from this test group; they would time out because the
  // blocks are not processed. The structural defect is routed back to composer —
  // see Failures & Remediation in the test report.
  //
  // These tests assert only on the authored markup (block elements present in
  // source) which confirms composer added all four entries correctly.
  test.beforeEach(async ({ page }) => {
    // Wait for DOMContentLoaded only — the full load lifecycle hangs due to
    // tabs and other blocks that never complete on this page.
    await page.goto(LIBRARY_PAGE, { waitUntil: 'domcontentloaded' });
    // Wait for the library-entry wrappers to be present in the DOM
    await page.waitForSelector('.library-entry .promo-banner');
  });

  // ── PU-12: Block-library page contains all 4 authored promo-banner entries ───
  test('PU-12 — block-library has 4 authored promo-banner elements', async ({ page }) => {
    const allBanners = page.locator('.library-entry .promo-banner');
    await expect(allBanners).toHaveCount(4);
  });

  test('PU-12a — block-library has two default (no-modifier) promo-banner entries', async ({ page }) => {
    // Default entries have no .dark or .accent class
    const defaultBanners = page.locator('.library-entry .promo-banner:not(.dark):not(.accent)');
    await expect(defaultBanners).toHaveCount(2);
  });

  test('PU-12b — block-library has one dark promo-banner entry', async ({ page }) => {
    const darkBanner = page.locator('.library-entry .promo-banner.dark');
    await expect(darkBanner).toHaveCount(1);
  });

  test('PU-12c — block-library has one accent promo-banner entry', async ({ page }) => {
    const accentBanner = page.locator('.library-entry .promo-banner.accent');
    await expect(accentBanner).toHaveCount(1);
  });

  test('PU-12d — each library entry carries a data-block-name attribute', async ({ page }) => {
    // Every authored promo-banner must carry data-block-name="promo-banner"
    const allBanners = page.locator('.library-entry .promo-banner');
    const count = await allBanners.count();
    expect(count).toBe(4);

    for (let i = 0; i < count; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await expect(allBanners.nth(i)).toHaveAttribute('data-block-name', 'promo-banner');
    }
  });

  test('PU-12e — library two-CTA default entry has two authored <a> links in the body cell', async ({ page }) => {
    // The second default entry ("Start your journey") has two CTA links authored.
    // Before decoration .button is not yet applied, so check for raw <a> elements.
    const defaultBanners = page.locator('.library-entry .promo-banner:not(.dark):not(.accent)');
    const twoCTABlock = defaultBanners.nth(1);
    const links = twoCTABlock.locator('a');
    await expect(links).toHaveCount(2);
  });
});
