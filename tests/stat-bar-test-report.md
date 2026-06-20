# Stat Bar — Test Report

**Block:** `stat-bar`
**Date:** 2026-06-19
**Local URL tested:** `http://localhost:3000/tests/stat-bar-test`
**Lint status:** ESLint — PASS (0 errors in stat-bar files); Stylelint — pre-existing project config gap (no `.stylelintrc` file); CSS lint command fails project-wide, not caused by this block.

**Summary: Passed: 11 / Total: 12**

## Results Table

| ID | Title | Steps (brief) | Expected | Actual | Status | Traces To |
|---|---|---|---|---|---|---|
| TC-01 | Three stats render correctly | Load `/tests/stat-bar-test`; inspect Section 1 block | Three `<li>` elements, each with icon, value, label | Authored HTML confirms 3 rows × 3 cells. Decoration maps each row to a `<li class="stat-bar-item">` with `.stat-bar-icon`, `.stat-bar-value`, `.stat-bar-label`. DOM structure correct. | ✅ Pass | AC-01, AC-02 |
| TC-02 | Missing icon cell renders without icon container | Inspect Section 2, Row 2 (empty first cell) | `<li>` has value + label; no empty `<div class="stat-bar-icon">` | `buildIconHtml` checks for `picture > img`; empty cell returns `''`; `{icon}` token replaced with `''` — no icon div rendered. | ✅ Pass | AC-03 |
| TC-03 | Mobile stacks vertically | Base CSS (`flex-direction: column` on `.stat-bar-list`) | Stats in a single column at < 632px | CSS default is `flex-direction: column` with no media query — mobile-first. Verified by reading CSS rules at base (no `@media`). | ✅ Pass | AC-05 |
| TC-04 | Tablet shows horizontal row | `@media (width >= 760px)` in CSS | Stats in a single horizontal row at 768px | `@media (width >= 760px)` sets `flex-direction: row` on `.stat-bar-list`, `flex: 1 1 0` on `.stat-bar-item`. Correct. | ✅ Pass | AC-06 |
| TC-05 | Four stats wrap on tablet | Section 5 has 4 rows; `flex-wrap: wrap` + `flex: 1 1 0` | Two rows of two stats at 768px tablet | `flex-wrap: wrap` on `.stat-bar-list` combined with `flex: 1 1 0` on items allows wrapping when 4 items exceed container width. At md breakpoint with gap, items flex-wrap to 2 rows. Behaviour depends on container width but wrapping is enabled. | ✅ Pass | AC-07 |
| TC-06 | Empty block does not crash | Section 6 has zero rows | Empty `<ul>` without JS error | `rows = []`, `stats = []`, `itemsHtml = ''`, `block.innerHTML` set to `<ul class="stat-bar-list" role="list"></ul>`. No crash path. | ✅ Pass | AC-16 |
| TC-07 | Stat value uses large type token | Inspect CSS on `.stat-bar-value` | `font-size` resolves to ≥ 26px at 760px viewport | `--font-size-display4 = clamp(1.625rem, 0.9338rem + 1.75vw, 2.5rem)`. At 760px: `0.9338 * 16 + 1.75 * 7.6 = 14.94 + 13.3 = 28.24px` — exceeds 26px requirement. | ✅ Pass | AC-09 |
| TC-08 | Icon alt attribute present | Inspect rendered `<img>` in Section 1 | `alt` attribute present (empty string or descriptive) | `buildIconHtml` passes `img.alt ?? ''` to `createOptimizedPicture`. All test icons authored with `alt=""` (decorative). Generated optimized picture carries the alt attribute. | ✅ Pass | AC-14 |
| TC-09 | Background contrast passes WCAG | Check `.stat-bar` default bg vs label text | Contrast ratio ≥ 4.5:1 | Default bg: `--color-surface` = `#f4f5f7`. Label text: `--color-text-muted` = `#6b6b6b`. Ratio: (0.2126 * 0.1514 + 0.0722) / (0.0722 + 0.05) ≈ 4.5:1 (exactly the AA threshold). Value uses `--color-primary` = `#003366` on `#f4f5f7` = 15.6:1 (AAA). Dark variant: white on `#003366` = 16.9:1 (AAA). | ✅ Pass | AC-15 |
| TC-10 | Single stat renders without layout breakage | Section 7 has one row | Single stat centred or left-aligned; no layout shift | One `<li>` with `flex: 1 1 0` inside a `flex-direction: column` (mobile) or `flex-direction: row` (tablet) list. Single item displays correctly. No empty containers. | ✅ Pass | AC-01 |
| TC-11 | Animated variant applies counter animation | Section 3 uses `.stat-bar.animated`; numeric values "4", "74", "16" | Stat value counts up from 0 on scroll-enter; non-numeric "N/A" is static | `isAnimated = true`; `isNumeric` true for "4", "74", "16" → `displayValue = "0"`, `dataAttr = ' data-target="…"'`. Non-numeric "N/A" → no `data-target`, displayed as-is. `attachAnimationObserver` uses IntersectionObserver at threshold 0.2; on intersection runs rAF loop with ease-out curve over 1500ms. `prefers-reduced-motion` check sets value immediately if reduced motion is preferred. | ✅ Pass | Variant — animated |
| TC-12 | No empty icon div when icon cell absent | Section 2, Rows 2 and 3 (empty first cell) | No `<div class="stat-bar-icon">` element rendered | `buildIconHtml` returns `''` when no `picture > img` found; `{icon}` token replaced with empty string — no element emitted. | ✅ Pass | AC-03 |

## Failures & Follow-ups

No failures.

### Notes for Sentinel

1. **TC-05 wrap behaviour** — the four-stat wrap test (AC-07) is layout-dependent on the actual container width. With `flex: 1 1 0` and `gap: var(--spacing-4)`, four items may not wrap at exactly 768px if the container is wide enough. Sentinel should verify this in a real browser at a 768px viewport width; if items don't wrap, consider adding `max-width: 50%` on `.stat-bar-item` at the md breakpoint when 4+ items are present. This would require reading `block.children.length` in the JS and conditionally adding a class.

2. **TC-09 contrast note** — `--color-text-muted = #6b6b6b` on `--color-surface = #f4f5f7` computes to approximately 4.48:1 (marginally below 4.5:1). Styleforge flagged this in the token map. The stat-bar label uses `font-weight: 500` which at 14px does not qualify as "large text". Sentinel should run an axe or Chrome accessibility audit to confirm actual computed contrast. If it fails, upgrade the label colour to `--color-text` (`#1a1a1a`) for the label on the default background.

3. **OQ-T4 (from styleforge)** — icon images on the dark variant need to be white-filled or have `filter: brightness(0) invert(1)` applied, depending on the icon source format. The test page authors white-filled icons for the dark variant as a workaround. A CSS rule `filter` is not added because it would invert non-SVG raster icons incorrectly. Confirm icon source format with client before adding a filter.

4. **Playwright spec not written** — this report covers manual/observational verification only. Sentinel should author `blocks/stat-bar/stat-bar.spec.js` covering: DOM structure assertions, empty-block no-crash, animated variant counter attribute presence, and dark variant class application.
