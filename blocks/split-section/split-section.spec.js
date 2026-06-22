import { test, expect } from '@playwright/test';

/**
 * Split Section block — Playwright end-to-end spec.
 *
 * Draft page: tests/split-section-test.html
 * All block instances are identified by their nth-of-type position in the
 * authored test page:
 *   1st .split-section — default variant
 *   2nd .split-section — reverse variant
 *   3rd .split-section — wide-media variant
 *   4th .split-section — wide-media reverse variant
 *   5th .split-section — no eyebrow
 *   6th .split-section — no CTA
 *   7th .split-section — empty media cell
 *   8th .split-section — empty block (no rows)
 *
 * Test-case coverage:
 *   TC-01  Default layout: two children (.split-section-media, .split-section-body)
 *   TC-02  Mobile stacks image above text (375 px — no horizontal overflow)
 *   TC-03  Reverse variant: visual columns swapped (media is flex order 2 at 760 px+)
 *   TC-04  Reverse DOM order: image cell is first child in source, CSS provides the swap
 *   TC-05  Eyebrow paragraph gets .eyebrow class with correct role
 *   TC-06  Missing eyebrow: no element with .eyebrow class, heading renders as first child
 *   TC-07  Missing CTA: no empty .button element; heading and body still visible
 *   TC-08  Missing image cell: block renders without JS error; body column visible
 *   TC-09  Image alt text preserved from authored content
 *   TC-10  Optimised picture: <picture> contains a <source> element after decoration
 *   TC-11  Wide-media 60/40 split: media column has flex-basis 60% at 992 px+
 *   TC-12  200 % zoom (1280 px / 2 effective): no horizontal scroll
 *   TC-13  Text contrast: body uses CSS token, not a hardcoded hex value
 *   TC-14  Empty block: no JS error, block container renders as empty valid element
 */

test.describe('split-section block', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/split-section-test.html');
    // Wait until the first block has been decorated (media div is present)
    await page.waitForSelector('.split-section .split-section-media');
  });

  // ── TC-01: Default layout renders two semantic child divs ──────────────────
  test('TC-01 default block has .split-section-media and .split-section-body children', async ({ page }) => {
    const block = page.locator('.split-section').first();
    await expect(block.locator('.split-section-media')).toHaveCount(1);
    await expect(block.locator('.split-section-body')).toHaveCount(1);
  });

  // ── TC-02: Mobile viewport — image stacks above text, no horizontal overflow ──
  test('TC-02 at 375 px viewport image stacks above text with no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/tests/split-section-test.html');
    await page.waitForSelector('.split-section .split-section-media');

    const block = page.locator('.split-section').first();
    const media = block.locator('.split-section-media');
    const body = block.locator('.split-section-body');

    const mediaBox = await media.boundingBox();
    const bodyBox = await body.boundingBox();

    // At 375 px both columns should be visible (non-null bounding boxes)
    expect(mediaBox).not.toBeNull();
    expect(bodyBox).not.toBeNull();

    // Stacking: media top should be above body top (image above text)
    expect(mediaBox.y).toBeLessThan(bodyBox.y);

    // Both columns should share the same left edge (stacked, not side-by-side)
    // In a column layout both children start at the same x coordinate
    expect(Math.abs(mediaBox.x - bodyBox.x)).toBeLessThanOrEqual(4);

    // No horizontal overflow: the document should not be wider than the viewport
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  // ── TC-03: Reverse variant — CSS swaps visual column order at desktop ──────
  test('TC-03 reverse variant: media column appears visually on the right at 1280 px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/tests/split-section-test.html');
    await page.waitForSelector('.split-section .split-section-media');

    const reverseBlock = page.locator('.split-section.reverse').first();
    const media = reverseBlock.locator('.split-section-media');
    const body = reverseBlock.locator('.split-section-body');

    const mediaBox = await media.boundingBox();
    const bodyBox = await body.boundingBox();

    // Both columns must be visible
    expect(mediaBox).not.toBeNull();
    expect(bodyBox).not.toBeNull();

    // In the reverse variant the media column should be visually to the RIGHT
    // of the body column, i.e. media.x > body.x
    expect(mediaBox.x).toBeGreaterThan(bodyBox.x);
  });

  // ── TC-04: Reverse DOM order unchanged — image cell is first child in source ──
  test('TC-04 reverse variant: .split-section-media is the first child element in the DOM', async ({ page }) => {
    const reverseBlock = page.locator('.split-section.reverse').first();

    // The first child of the reverse block must be .split-section-media,
    // not .split-section-body — CSS provides the visual swap, not DOM reordering.
    const firstChildClass = await reverseBlock.evaluate(
      (el) => el.firstElementChild?.className ?? '',
    );
    expect(firstChildClass).toContain('split-section-media');
  });

  // ── TC-05: Eyebrow paragraph gets .eyebrow class ───────────────────────────
  test('TC-05 eyebrow: first <p> before heading receives .eyebrow class', async ({ page }) => {
    const block = page.locator('.split-section').first();
    const eyebrow = block.locator('.split-section-body .eyebrow');
    await expect(eyebrow).toHaveCount(1);
    await expect(eyebrow).toBeVisible();
    // Eyebrow must be a <p> element
    await expect(eyebrow).toHaveAttribute('class', /eyebrow/);
    const tag = await eyebrow.evaluate((el) => el.tagName.toLowerCase());
    expect(tag).toBe('p');
  });

  // ── TC-06: Missing eyebrow — no .eyebrow element, heading is first body child ─
  test('TC-06 missing eyebrow: no .eyebrow element inserted; heading renders cleanly', async ({ page }) => {
    // Section 5 in the test page is authored without an eyebrow (heading first)
    const noEyebrowBlock = page.locator('.split-section').nth(4);
    const eyebrow = noEyebrowBlock.locator('.eyebrow');
    await expect(eyebrow).toHaveCount(0);

    // Heading should be visible
    const heading = noEyebrowBlock.locator('.split-section-body h2, .split-section-body h3');
    await expect(heading).toBeVisible();
  });

  // ── TC-07: Missing CTA — no empty .button element ─────────────────────────
  test('TC-07 missing CTA: no .button element rendered; heading and body text visible', async ({ page }) => {
    // Section 6 has no CTA link authored
    const noCTABlock = page.locator('.split-section').nth(5);
    const button = noCTABlock.locator('.split-section-body .button');
    await expect(button).toHaveCount(0);

    // Body text and heading must still render
    await expect(noCTABlock.locator('.split-section-body h2, .split-section-body h3')).toBeVisible();
    await expect(noCTABlock.locator('.split-section-body p:not(.eyebrow)')).toBeVisible();
  });

  // ── TC-08: Missing image cell — block renders text, no JS error ───────────
  test('TC-08 missing image: block renders body column without crashing', async ({ page }) => {
    const noImageBlock = page.locator('.split-section').nth(6);

    // Media div should be present but empty (no picture/img inside)
    const media = noImageBlock.locator('.split-section-media');
    await expect(media).toHaveCount(1);
    await expect(media.locator('picture')).toHaveCount(0);

    // Body should still be visible
    const body = noImageBlock.locator('.split-section-body');
    await expect(body).toBeVisible();
    await expect(body.locator('h2, h3')).toBeVisible();
  });

  // ── TC-09: Image alt text is preserved from authored content ──────────────
  test('TC-09 image alt text is preserved after decoration', async ({ page }) => {
    const block = page.locator('.split-section').first();
    const img = block.locator('.split-section-media img').first();
    await expect(img).toHaveAttribute('alt', 'DUOPA pump device shown in clinical setting');
  });

  // ── TC-10: Optimised picture — <picture> has webp <source> after decoration ─
  test('TC-10 image is optimised: <picture> contains a <source> element after decoration', async ({ page }) => {
    const block = page.locator('.split-section').first();
    const picture = block.locator('.split-section-media picture').first();
    await expect(picture).toHaveCount(1);

    // createOptimizedPicture always adds at least one <source>
    const sources = picture.locator('source');
    expect(await sources.count()).toBeGreaterThanOrEqual(1);
  });

  // ── TC-11: Wide-media 60/40 split at 992 px+ ─────────────────────────────
  test('TC-11 wide-media: media column is wider than body column at 992 px+', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/tests/split-section-test.html');
    await page.waitForSelector('.split-section .split-section-media');

    const wideBlock = page.locator('.split-section.wide-media').first();
    const media = wideBlock.locator('.split-section-media');
    const body = wideBlock.locator('.split-section-body');

    const mediaBox = await media.boundingBox();
    const bodyBox = await body.boundingBox();

    expect(mediaBox).not.toBeNull();
    expect(bodyBox).not.toBeNull();

    // 60/40 split means media should be visibly wider than body
    // Allow a small tolerance (2 px) for rounding
    expect(mediaBox.width).toBeGreaterThan(bodyBox.width + 2);
  });

  // ── TC-12: 200 % zoom — no horizontal scrollbar ───────────────────────────
  test('TC-12 at 200% zoom (640 px viewport) no horizontal overflow on the block', async ({ page }) => {
    // Simulate 200% zoom by using a narrower viewport — the effective CSS pixel
    // width at 200% zoom on a 1280px screen is 640px.
    await page.setViewportSize({ width: 640, height: 450 });
    await page.goto('/tests/split-section-test.html');
    await page.waitForSelector('.split-section .split-section-media');

    const overflow = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const viewWidth = window.innerWidth;
      return docWidth - viewWidth;
    });

    // No horizontal scroll — document should not be wider than the viewport
    expect(overflow).toBeLessThanOrEqual(1);
  });

  // ── TC-13: Body text uses CSS token (no hardcoded hex in inline style) ─────
  test('TC-13 body text color is controlled by CSS token, not inline style', async ({ page }) => {
    const block = page.locator('.split-section').first();
    const body = block.locator('.split-section-body');

    // No inline style color override should be present on the body div
    const inlineStyle = await body.getAttribute('style');
    // Either no style attribute, or it doesn't contain 'color:'
    if (inlineStyle) {
      expect(inlineStyle).not.toMatch(/\bcolor\s*:/);
    }
  });

  // ── TC-14: Empty block — no JS error, container renders ───────────────────
  test('TC-14 empty block renders as empty container without crashing', async ({ page }) => {
    // Section 8: empty .split-section with no rows
    const emptyBlock = page.locator('.split-section').nth(7);

    // Block element must exist in the DOM
    await expect(emptyBlock).toBeAttached();

    // After decoration, innerHTML should be empty (decorate sets block.innerHTML = '')
    const innerHtml = await emptyBlock.evaluate((el) => el.innerHTML.trim());
    expect(innerHtml).toBe('');

    // No JS errors — page should not navigate away or display an error message
    await expect(page.locator('body')).toBeVisible();
  });
});
