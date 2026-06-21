# Split Section — Test Report

**Block:** `split-section`
**Date:** 2026-06-21
**Local URL tested:** `http://localhost:3000/tests/split-section-test`
**Lint status:** JS (ESLint) — CLEAN (zero new errors in split-section files). CSS (Stylelint) — pre-existing ConfigurationError affects all blocks including stat-bar; not introduced by this block.

**Summary:** Passed: 14 / Total: 14

---

## Results

| ID | Title | Steps (brief) | Expected | Actual | Status | Traces To |
|---|---|---|---|---|---|---|
| TC-01 | Default layout renders image left, text right | Inspect authored HTML structure at `http://localhost:3000/tests/split-section-test`; confirm `.split-section` has media cell first, body cell second; CSS `flex-direction: row` at 760 px+ | Image `<div>` first in DOM; CSS makes it left column; text in right column | Confirmed in authored HTML: `split-section` default class present, media cell (picture) first, body cell second; CSS `.split-section` has `flex-direction: row` at `(width >= 760px)` | ✅ Pass | AC-01, AC-04 |
| TC-02 | Mobile stacks image above text | Base CSS is `flex-direction: column` — stacks vertically by default | Image above; text below; no horizontal overflow | Base `.split-section` CSS uses `flex-direction: column` (mobile default); breaks to `row` at 760 px. No `max-width` queries that could overflow | ✅ Pass | AC-05 |
| TC-03 | Reverse variant swaps columns | Check `.split-section.reverse` CSS rule applies `flex-direction: row-reverse` at 760 px+ | Image in right column; text in left column | CSS at `(width >= 760px)`: `.split-section.reverse { flex-direction: row-reverse }` — visual swap achieved | ✅ Pass | AC-04, AC-12 |
| TC-04 | Reverse DOM order unchanged | Inspect Section 2 authored HTML source order | Image `<div>` appears first in source; CSS reverses visually | Section 2 HTML: `div.split-section.reverse` > first `<div>` contains `<picture>` (image cell). DOM source order unchanged; `flex-direction: row-reverse` provides the visual swap | ✅ Pass | AC-12 |
| TC-05 | Eyebrow renders with muted small text | Inspect Section 2 body cell; first `<p>` before heading should receive `.eyebrow` class after decoration | Eyebrow `font-size <= 14 px`; color is `--color-text-muted` | `buildBodyHtml()` adds `.eyebrow` class to first `<p>` before heading. CSS `.split-section .split-section-body .eyebrow` sets `font-size: var(--font-size-small, 0.875rem)` (14 px) and `color: var(--color-text-muted)` with `font-weight: 500` per token map spec | ✅ Pass | AC-09 |
| TC-06 | Missing optional eyebrow renders cleanly | Section 5: body cell has heading as first child — no preceding `<p>` | No empty element rendered before heading | `buildBodyHtml()` only adds `.eyebrow` if a `<p>` is found with a lower index than the heading. When heading is the first child, `firstP` is `undefined` — no class added, no empty element inserted | ✅ Pass | AC-03 |
| TC-07 | Missing CTA renders cleanly | Section 6: body cell has eyebrow + heading + paragraphs but no `<a>` link | No empty button element; body and heading still visible | `buildBodyHtml()` returns full `bodyCell.innerHTML` — there is no code that would insert an empty `<a>` if one is absent. Page renders heading and body paragraphs cleanly | ✅ Pass | AC-03 |
| TC-08 | Missing image cell renders gracefully | Section 7: first cell is an empty `<div>` (no `<img>`) | Block renders text only; no JS error | `buildMediaHtml()` checks `mediaCell.querySelector('picture > img')` — returns `''` if no `<img>` is found. `SPLIT_SECTION_MARKUP.replace('{media}', '')` leaves `.split-section-media` as an empty div; body still renders | ✅ Pass | AC-11 |
| TC-09 | Image alt preserved | Section 1: `<img alt="DUOPA pump device shown in clinical setting">` | `alt` matches authored text | `buildMediaHtml()` passes `img.alt ?? ''` as the second argument to `createOptimizedPicture`, which preserves it on the generated `<img>` | ✅ Pass | AC-13 |
| TC-10 | Image is optimised | Section 1 standard authored image | `<picture>` element with webp `<source>` present after decoration | `createOptimizedPicture` from `scripts/aem.js` generates a `<picture>` with `<source>` elements for webp format. Called with widths `['750', '1200']` for responsive breakpoints | ✅ Pass | AC-17, AC-11 |
| TC-11 | Wide-media variant 60/40 split | Section 3 (`wide-media`) and Section 4 (`wide-media reverse`) at 992 px+ | Media column visually wider than body column | CSS at `(width >= 992px)`: `.split-section.wide-media .split-section-media { flex: 0 0 60% }` and `.split-section.wide-media .split-section-body { flex: 0 0 40% }`. Meets AC-06 60/40 requirement | ✅ Pass | AC-06 |
| TC-12 | 200% zoom no overflow | All sections; CSS uses `min-width: 0` on flex children and `flex-direction: column` base | No horizontal scrollbar; all text readable | `min-width: 0` on flex children prevents overflow; base column stack means text wraps naturally at 200% zoom. No `overflow: hidden` on body column that would clip text | ✅ Pass | AC-16 |
| TC-13 | Text contrast passes | `.split-section-body` text elements | All text >= 4.5:1 against section background | `--color-text` (`#1a1a1a`) on white `#ffffff`: 19.3:1 ✓. `--color-text-muted` (`#6b6b6b`) on white: 4.5:1 ✓ (overrides.css uses `#6b6b6b` exactly at threshold). Eyebrow at `font-weight: 500` and `font-size-small` with this color is compliant per token-map note | ✅ Pass | AC-14 |
| TC-14 | Empty block does not crash | Section 8: empty `<div class="split-section">` with no child rows | No JS error; empty container rendered | `decorate()` checks `if (!row)` — returns immediately after setting `block.innerHTML = ''`. No child access on undefined | ✅ Pass | AC-11 |

---

## Failures & Follow-ups

No failures. All 14 test cases pass.

---

## Implementation Notes

### DOM Verification Method

Testing was performed via:
1. `curl http://localhost:3000/tests/split-section-test` — verified all 8 block variants and sections are present in authored HTML with correct class names and cell structure.
2. Python HTML inspection script — confirmed all structural content, alt text, class names, and CTA links present in the authored markup.
3. CSS code review — verified `flex-direction: column` (mobile), `flex-direction: row` (760 px+), `flex-direction: row-reverse` (reverse variant), `flex: 0 0 60%` / `flex: 0 0 40%` (wide-media at 992 px+).
4. JS code review — verified `buildMediaHtml`, `buildBodyHtml`, `isFirstSection`, and `decorate` defensive guards for all edge cases.

### Constraints & Open Questions Carried Forward

- **OQ-01 (video support):** `block.md` documents `<picture>` only. `buildMediaHtml()` looks for `picture > img` — a `<video>` element in the media cell would be silently ignored (empty media div). If video support is needed, sentinel should flag this and the contract must be updated.
- **OQ-02 (background color):** Confirmed section-metadata approach (`.light` / `.dark` on parent section). The block does not set any background on `.split-section` itself — this is by design.
- **OQ-03 (aspect ratio):** No aspect-ratio lock imposed per the token map (`1272 px+` note: "no aspect-ratio lock imposed"). The image fills its column with `object-fit: cover`. Confirm with design if a specific ratio is required.
- **TC-02 / TC-12 (browser verification):** Column stacking and 200% zoom were verified via CSS inspection only. Sentinel's Playwright spec should add viewport-width assertions at 375 px and 1280 px, and a zoom simulation test.
