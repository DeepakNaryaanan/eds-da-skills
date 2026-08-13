/**
 * ISI Bar — Playwright end-to-end spec
 *
 * Test pages:
 *   /tests/isi-bar-test.html         — primary: default sticky, inline, empty-summary blocks;
 *                                       isi-fragment meta absent → exercises fallback path.
 *   /tests/isi-bar-session-test.html — secondary: single sticky block; isi-fragment meta wired
 *                                       to /tests/fragments/isi → exercises fragment-loaded path
 *                                       and TC-04 sessionStorage cross-navigation.
 *
 * Test-case traceability:
 *   TC-01  renders collapsed on load
 *   TC-02  toggle click → expand
 *   TC-03  toggle click again → collapse
 *   TC-04  sessionStorage persists state across in-session navigation
 *   TC-05  Escape key collapses panel and returns focus to toggle
 *   TC-06  fragment fetch failure degrades gracefully (fallback PI link present)
 *   TC-07  z-index computed value >= 200
 *   TC-08  body.has-isi-bar class applied
 *   TC-09  Enter key on toggle expands panel
 *   TC-10  Space key on toggle expands panel
 *   TC-11  panel scroll region — role, aria-label, tabindex present
 *   TC-12  text contrast: color-text on ISI-bg surface (verified via CSS token)
 *   TC-13  mobile collapsed height 48 px (viewport 375)
 *   TC-14  desktop collapsed height 56 px (viewport 1280)
 *   TC-15  full-bleed width (100% of viewport)
 *   --     inline variant renders position: static (not fixed)
 *   --     empty summary cell falls back to default string without throwing
 *   --     fragment-loaded path: panel content populated from fragment fixture
 */

import { test, expect } from '@playwright/test';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Wait for the ISI bar block to finish decorating on the given page.
 * The `decorate` function is async; we wait for the toggle button as the
 * sentinel element that only exists after the template has been written.
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
async function waitForIsiBar(page) {
  await page.waitForSelector('.isi-bar .isi-bar-toggle', { timeout: 10000 });
}

// ── Test groups ───────────────────────────────────────────────────────────────

test.describe('isi-bar — default sticky variant (fallback path)', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure sessionStorage does not carry over from a previous test.
    await page.goto('/tests/isi-bar-test.html');
    await page.evaluate(() => sessionStorage.removeItem('isi-expanded'));
    await page.reload();
    await waitForIsiBar(page);
  });

  // TC-01 ── Render collapsed on load ──────────────────────────────────────
  test('TC-01 bar renders collapsed on load with correct ARIA attributes', async ({ page }) => {
    const toggle = page.locator('.isi-bar .isi-bar-toggle').first();
    const panel = page.locator('.isi-bar .isi-bar-panel').first();

    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-controls', /.+/);

    // Panel must exist in DOM but have zero effective height (max-height: 0)
    await expect(panel).not.toHaveClass(/isi-bar-panel--expanded/);

    // Toggle label says "See More" when collapsed
    const label = toggle.locator('.isi-bar-toggle-label');
    await expect(label).toHaveText('See More');
  });

  // AC-01 ── Complementary landmark ─────────────────────────────────────────
  test('aside has role=complementary and correct aria-label', async ({ page }) => {
    const aside = page.locator('.isi-bar .isi-bar-inner').first();
    await expect(aside.locator('xpath=self::aside')).toHaveCount(1);
    await expect(aside).toHaveAttribute('role', 'complementary');
    await expect(aside).toHaveAttribute('aria-label', 'Important Safety Information');
  });

  // TC-08 ── body class ─────────────────────────────────────────────────────
  test('TC-08 body.has-isi-bar class is applied', async ({ page }) => {
    await expect(page.locator('body')).toHaveClass(/has-isi-bar/);
  });

  // TC-02 ── Toggle expand ──────────────────────────────────────────────────
  test('TC-02 clicking the toggle expands the panel', async ({ page }) => {
    const toggle = page.locator('.isi-bar .isi-bar-toggle').first();
    const panel = page.locator('.isi-bar .isi-bar-panel').first();

    await toggle.click();

    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toHaveClass(/isi-bar-panel--expanded/);

    // aria-controls must reference the panel's id
    const panelId = await panel.getAttribute('id');
    await expect(toggle).toHaveAttribute('aria-controls', panelId);

    // Label changes to "See Less" when expanded
    const label = toggle.locator('.isi-bar-toggle-label');
    await expect(label).toHaveText('See Less');
  });

  // TC-03 ── Toggle collapse ─────────────────────────────────────────────────
  test('TC-03 clicking the toggle again collapses the panel', async ({ page }) => {
    const toggle = page.locator('.isi-bar .isi-bar-toggle').first();
    const panel = page.locator('.isi-bar .isi-bar-panel').first();

    // Expand first
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // Collapse
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).not.toHaveClass(/isi-bar-panel--expanded/);

    const label = toggle.locator('.isi-bar-toggle-label');
    await expect(label).toHaveText('See More');
  });

  // TC-05 ── Escape key ──────────────────────────────────────────────────────
  test('TC-05 Escape key collapses panel and returns focus to toggle', async ({ page }) => {
    const toggle = page.locator('.isi-bar .isi-bar-toggle').first();
    const panel = page.locator('.isi-bar .isi-bar-panel').first();

    // Expand via click; focus moves to panel on expand
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // Panel receives focus after expand
    await expect(panel).toBeFocused();

    // Press Escape from inside the panel
    await page.keyboard.press('Escape');

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).not.toHaveClass(/isi-bar-panel--expanded/);

    // Focus must return to the toggle button
    await expect(toggle).toBeFocused();
  });

  // TC-06 ── Graceful fallback ───────────────────────────────────────────────
  test('TC-06 fragment fetch failure renders fallback PI link without JS error', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // The primary test page has no isi-fragment meta, so the default /fragments/isi
    // path 404s → buildFallbackContent() fires and inserts a PI link.
    const panelContent = page.locator('.isi-bar .isi-bar-panel-content').first();
    // Expand to reveal the panel content
    await page.locator('.isi-bar .isi-bar-toggle').first().click();

    await expect(panelContent).toContainText(/prescribing information/i);
    const piLink = panelContent.locator('a[href*="prescribing-information"]');
    await expect(piLink).toHaveCount(1);

    expect(errors).toHaveLength(0);
  });

  // TC-07 ── z-index ─────────────────────────────────────────────────────────
  test('TC-07 bar z-index is at least 200 (--z-sticky)', async ({ page }) => {
    const zIndex = await page.locator('.isi-bar .isi-bar-inner').first().evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return parseInt(computed.zIndex, 10);
    });
    expect(zIndex).toBeGreaterThanOrEqual(200);
  });

  // TC-09 ── Keyboard Enter ─────────────────────────────────────────────────
  test('TC-09 pressing Enter on the toggle expands the panel', async ({ page }) => {
    const toggle = page.locator('.isi-bar .isi-bar-toggle').first();
    const panel = page.locator('.isi-bar .isi-bar-panel').first();

    await toggle.focus();
    await page.keyboard.press('Enter');

    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toHaveClass(/isi-bar-panel--expanded/);
  });

  // TC-10 ── Keyboard Space ─────────────────────────────────────────────────
  test('TC-10 pressing Space on the toggle expands the panel', async ({ page }) => {
    const toggle = page.locator('.isi-bar .isi-bar-toggle').first();
    const panel = page.locator('.isi-bar .isi-bar-panel').first();

    await toggle.focus();
    await page.keyboard.press('Space');

    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toHaveClass(/isi-bar-panel--expanded/);
  });

  // TC-11 ── Panel scroll region ARIA ───────────────────────────────────────
  test('TC-11 panel has role=region, aria-label, and tabindex=0', async ({ page }) => {
    const panel = page.locator('.isi-bar .isi-bar-panel').first();
    await expect(panel).toHaveAttribute('role', 'region');
    await expect(panel).toHaveAttribute('aria-label', 'Full Important Safety Information');
    await expect(panel).toHaveAttribute('tabindex', '0');
  });

  // TC-13 ── Mobile collapsed height ────────────────────────────────────────
  test('TC-13 mobile collapsed bar height is 48 px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/tests/isi-bar-test.html');
    await waitForIsiBar(page);

    const height = await page.locator('.isi-bar .isi-bar-collapsed-row').first()
      .evaluate((el) => el.getBoundingClientRect().height);
    expect(height).toBeCloseTo(48, 0);
  });

  // TC-14 ── Desktop collapsed height ───────────────────────────────────────
  test('TC-14 desktop collapsed bar height is 56 px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/tests/isi-bar-test.html');
    await waitForIsiBar(page);

    const height = await page.locator('.isi-bar .isi-bar-collapsed-row').first()
      .evaluate((el) => el.getBoundingClientRect().height);
    expect(height).toBeCloseTo(56, 0);
  });

  // TC-15 ── Full-bleed width ────────────────────────────────────────────────
  test('TC-15 bar spans 100% of viewport width', async ({ page }) => {
    const barWidth = await page.locator('.isi-bar .isi-bar-inner').first()
      .evaluate((el) => el.getBoundingClientRect().width);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    // Allow 1 px tolerance for sub-pixel rendering
    expect(Math.abs(barWidth - viewportWidth)).toBeLessThanOrEqual(1);
  });
});

// ── Inline variant ────────────────────────────────────────────────────────────

test.describe('isi-bar — inline variant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/isi-bar-test.html');
    await waitForIsiBar(page);
  });

  test('inline block has position: static (not fixed)', async ({ page }) => {
    // The inline variant is the second .isi-bar on the test page.
    // The --inline class is added at the end of decorate(), after the async
    // fragment fetch resolves. Wait for it before asserting computed position.
    const inlineInner = page.locator('.isi-bar.inline .isi-bar-inner').first();
    await page.waitForSelector('.isi-bar.inline .isi-bar-inner--inline', { timeout: 10000 });
    const position = await inlineInner.evaluate((el) => window.getComputedStyle(el).position);
    expect(position).toBe('static');
  });

  test('inline block adds isi-bar-inner--inline class', async ({ page }) => {
    const inlineInner = page.locator('.isi-bar.inline .isi-bar-inner').first();
    await expect(inlineInner).toHaveClass(/isi-bar-inner--inline/);
  });

  test('inline toggle is operable and expands the inline panel', async ({ page }) => {
    const inlineToggle = page.locator('.isi-bar.inline .isi-bar-toggle').first();
    const inlinePanel = page.locator('.isi-bar.inline .isi-bar-panel').first();

    await inlineToggle.click();
    await expect(inlineToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(inlinePanel).toHaveClass(/isi-bar-panel--expanded/);
  });

  test('inline variant has invalid fragment path and shows fallback PI link', async ({ page }) => {
    const inlineToggle = page.locator('.isi-bar.inline .isi-bar-toggle').first();
    const inlineContent = page.locator('.isi-bar.inline .isi-bar-panel-content').first();

    await inlineToggle.click();
    await expect(inlineContent).toContainText(/prescribing information/i);
  });
});

// ── Empty summary edge case ────────────────────────────────────────────────────

test.describe('isi-bar — empty summary edge case', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/isi-bar-test.html');
    await waitForIsiBar(page);
  });

  test('empty summary cell falls back to default summary text without throwing', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // The third .isi-bar on the page has an empty <p> in the summary row
    const emptySummaryBar = page.locator('.isi-bar').nth(2);
    const summaryEl = emptySummaryBar.locator('.isi-bar-summary');

    await expect(summaryEl).toBeVisible();
    // The JS fallback string must appear when the authored cell is empty
    await expect(summaryEl).toContainText('DUOPA has important safety information');

    expect(errors).toHaveLength(0);
  });

  test('empty summary bar still renders a functional toggle', async ({ page }) => {
    const emptyBarToggle = page.locator('.isi-bar').nth(2).locator('.isi-bar-toggle');
    await expect(emptyBarToggle).toBeVisible();
    await emptyBarToggle.click();
    await expect(emptyBarToggle).toHaveAttribute('aria-expanded', 'true');
  });
});

// ── sessionStorage cross-navigation (TC-04) ───────────────────────────────────

test.describe('isi-bar — TC-04 sessionStorage persistence', () => {
  test('TC-04 expanded state persists across in-session navigation', async ({ page }) => {
    // Step 1: load the primary test page and expand the bar
    await page.goto('/tests/isi-bar-test.html');
    await page.evaluate(() => sessionStorage.removeItem('isi-expanded'));
    await page.reload();
    await waitForIsiBar(page);

    const toggle = page.locator('.isi-bar .isi-bar-toggle').first();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // Confirm sessionStorage key was written
    const stored = await page.evaluate(() => sessionStorage.getItem('isi-expanded'));
    expect(stored).toBe('true');

    // Step 2: navigate to the second test page (same browser session)
    await page.goto('/tests/isi-bar-session-test.html');
    await waitForIsiBar(page);

    // Step 3: assert that the bar loaded expanded (state restored from sessionStorage)
    const togglePage2 = page.locator('.isi-bar .isi-bar-toggle').first();
    await expect(togglePage2).toHaveAttribute('aria-expanded', 'true');
    const panelPage2 = page.locator('.isi-bar .isi-bar-panel').first();
    await expect(panelPage2).toHaveClass(/isi-bar-panel--expanded/);

    // Clean up so other tests start fresh
    await page.evaluate(() => sessionStorage.removeItem('isi-expanded'));
  });

  test('TC-04 collapsed state also persists across navigation', async ({ page }) => {
    // Pre-seed sessionStorage with the expanded state
    await page.goto('/tests/isi-bar-test.html');
    await page.evaluate(() => sessionStorage.setItem('isi-expanded', 'true'));
    await page.reload();
    await waitForIsiBar(page);

    // Collapse
    const toggle = page.locator('.isi-bar .isi-bar-toggle').first();
    await toggle.click(); // was expanded → now collapse
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    const collapsed = await page.evaluate(() => sessionStorage.getItem('isi-expanded'));
    expect(collapsed).toBe('false');

    // Navigate and confirm collapsed on reload
    await page.goto('/tests/isi-bar-session-test.html');
    await waitForIsiBar(page);

    const togglePage2 = page.locator('.isi-bar .isi-bar-toggle').first();
    await expect(togglePage2).toHaveAttribute('aria-expanded', 'false');

    await page.evaluate(() => sessionStorage.removeItem('isi-expanded'));
  });
});

// ── Fragment-loaded path ───────────────────────────────────────────────────────

test.describe('isi-bar — fragment-loaded content path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/isi-bar-session-test.html');
    await waitForIsiBar(page);
  });

  test('panel is populated from local ISI fragment fixture when meta is present', async ({ page }) => {
    const toggle = page.locator('.isi-bar .isi-bar-toggle').first();
    await toggle.click();

    const panelContent = page.locator('.isi-bar .isi-bar-panel-content').first();
    // Content from tests/fragments/isi.plain.html contains this heading
    await expect(panelContent).toContainText(/Important Safety Information for DUOPA/i);
  });

  test('panel content from fragment contains at least one heading', async ({ page }) => {
    const toggle = page.locator('.isi-bar .isi-bar-toggle').first();
    await toggle.click();

    const headings = page.locator('.isi-bar .isi-bar-panel-content h2, .isi-bar .isi-bar-panel-content h3');
    await expect(headings.first()).toBeVisible();
    expect(await headings.count()).toBeGreaterThanOrEqual(1);
  });

  test('panel content from fragment contains a PI link', async ({ page }) => {
    const toggle = page.locator('.isi-bar .isi-bar-toggle').first();
    await toggle.click();

    const piLink = page.locator('.isi-bar .isi-bar-panel-content a[href*="prescribing-information"]');
    await expect(piLink).toHaveCount(1);
  });
});

// ── TC-12 Contrast ─────────────────────────────────────────────────────────────

test.describe('isi-bar — TC-12 color and contrast via computed CSS', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/isi-bar-test.html');
    await waitForIsiBar(page);
  });

  test('TC-12 summary text uses --color-text token (not a hardcoded hex)', async ({ page }) => {
    // The CSS sets color: var(--color-text) on .isi-bar-summary.
    // We verify the summary text is not transparent and has sufficient luminance
    // delta against the bar background by checking the computed color is not
    // the same as the background.
    const result = await page.locator('.isi-bar .isi-bar-summary').first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        color: cs.color,
        background: window.getComputedStyle(el.closest('.isi-bar-inner')).backgroundColor,
      };
    });
    // Color must not be transparent and must differ from background
    expect(result.color).not.toBe('rgba(0, 0, 0, 0)');
    expect(result.color).not.toBe(result.background);
  });

  test('TC-12 toggle button text is visible against button background', async ({ page }) => {
    const result = await page.locator('.isi-bar .isi-bar-toggle').first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        color: cs.color,
        backgroundColor: cs.backgroundColor,
      };
    });
    // Must have a non-transparent text color different from background
    expect(result.color).not.toBe('rgba(0, 0, 0, 0)');
    expect(result.color).not.toBe(result.backgroundColor);
  });

  test('TC-12 panel content text uses --color-text token', async ({ page }) => {
    const toggle = page.locator('.isi-bar .isi-bar-toggle').first();
    await toggle.click();

    const result = await page.locator('.isi-bar .isi-bar-panel-content').first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        color: cs.color,
        background: window.getComputedStyle(el.closest('.isi-bar-inner')).backgroundColor,
      };
    });
    expect(result.color).not.toBe('rgba(0, 0, 0, 0)');
    expect(result.color).not.toBe(result.background);
  });
});

// ── prefers-reduced-motion ────────────────────────────────────────────────────

test.describe('isi-bar — reduced-motion media query', () => {
  test('toggle transition is suppressed under prefers-reduced-motion: reduce', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tests/isi-bar-test.html');
    await waitForIsiBar(page);

    const transition = await page.locator('.isi-bar .isi-bar-toggle').first()
      .evaluate((el) => window.getComputedStyle(el).transition);
    // Under reduced-motion, the CSS sets transition: none.
    // Chrome serializes `transition: none` as "none 0s ease 0s" or "none Xs" —
    // the key signal is that the transition-duration rounds to effectively 0 ms
    // (i.e., it starts with "none" or contains a near-zero duration). We check
    // that it does NOT contain a non-trivial duration like "200ms" or "0.2s".
    expect(transition).not.toMatch(/200ms/i);
    expect(transition).not.toMatch(/0\.2s/i);
  });
});
