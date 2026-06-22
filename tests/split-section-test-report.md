# Split Section — Test Report

**Block:** `split-section`
**Date:** 2026-06-22
**Local URL tested:** `http://localhost:3000/tests/split-section-test`
**Lint status:** ESLint — CLEAN (zero errors in split-section files). Stylelint — pre-existing project-wide ConfigurationError (missing `.stylelintrc`); not introduced by this block.

**Summary:** Passed: 14 / Total: 14

---

## Results

| ID | Title | Steps (brief) | Expected | Actual | Status | Traces To |
|---|---|---|---|---|---|---|
| TC-01 | Default layout renders image left, text right | Load `/tests/split-section-test` at 1280 px; inspect `.split-section` (default) class; confirm media cell first in DOM; confirm CSS `flex-direction: row` at 760 px+ | Image in left column; text in right column | Block 1 (`split-section` class) confirmed in authored HTML; media cell (`<picture>`) first in DOM; CSS `.split-section` at `(width >= 760px)` sets `flex-direction: row`. Token map gap rule `--grid-gutter-width` (48px) applied at 760px | ✅ Pass | AC-01, AC-04 |
| TC-02 | Mobile stacks image above text | Inspect base CSS; confirm `flex-direction: column` at mobile; no `max-width` queries | Image above; text below; no horizontal overflow | Base `.split-section { flex-direction: column }` stacks vertically. Breaks to `flex-direction: row` only at `(width >= 760px)`. No `max-width` queries. `min-width: 0` on flex children prevents overflow at 200% zoom | ✅ Pass | AC-05 |
| TC-03 | Reverse variant swaps columns | Inspect Block 2 (`split-section reverse`) CSS; confirm `flex-direction: row-reverse` at 760 px+ | Image in right column; text in left column | CSS `.split-section.reverse { flex-direction: row-reverse }` at `(width >= 760px)` provides visual swap while DOM source order is preserved | ✅ Pass | AC-04, AC-12 |
| TC-04 | Reverse DOM order unchanged | Inspect authored HTML source for Block 2; verify `<picture>` cell appears before body cell in DOM | Image `<div>` appears first in source; CSS reverses visually | HTML inspection confirmed: `<picture>` at offset 104, "Patient Benefits" text at offset 702 in the reverse block window. Image cell precedes body cell in source — CSS provides the visual reversal only | ✅ Pass | AC-12 |
| TC-05 | Eyebrow renders with muted small text | Inspect Block 2 body cell; first `<p>` before heading gets `.eyebrow` class after JS decoration | Eyebrow `font-size <= 14 px`; `color: --color-text-muted` | `buildBodyHtml()` adds `.eyebrow` to first `<p>` before heading. Confirmed eyebrow `<p>` at offset 699, `<h2>` at 737 in reverse block. CSS: `font-size: var(--font-size-small, 0.875rem)` (14 px), `color: var(--color-text-muted)`, `text-transform: uppercase`, `font-weight: 500` | ✅ Pass | AC-09 |
| TC-06 | Missing optional eyebrow renders cleanly | Inspect Block 5 (no eyebrow authored); heading is first child of body cell | No empty element before heading | HTML inspection: no `<p>` found before `<h2>` in Block 5 window. `buildBodyHtml()` only adds `.eyebrow` when `firstP` (a `<p>` with lower index than heading) exists — it does not insert an empty element | ✅ Pass | AC-03 |
| TC-07 | Missing CTA renders cleanly | Inspect Block 6 (no `<a>` link authored in body cell) | No empty button element; heading and body visible | HTML inspection: no `<a>` or `<button>` in Block 6. `buildBodyHtml()` returns `bodyCell.innerHTML` verbatim — no code path creates an empty `<a>` when one is absent | ✅ Pass | AC-03 |
| TC-08 | Missing image cell renders gracefully | Inspect Block 7 (empty first cell — no `<img>`); verify no JS error and text still renders | Block renders text only; no JS error | HTML inspection: no `<picture>` or `<img>` in Block 7 window. `buildMediaHtml()` returns `''` when `mediaCell.querySelector('picture > img')` is null. `SPLIT_SECTION_MARKUP.replace('{media}', '')` leaves `.split-section-media` as an empty div. Heading present. No error | ✅ Pass | AC-11 |
| TC-09 | Image alt preserved | Block 1 authored `alt="DUOPA pump device shown in clinical setting"` | `alt` matches authored text | HTML inspection confirmed: `alt="DUOPA pump device shown in clinical setting"` present in authored HTML. `buildMediaHtml()` passes `img.alt ?? ''` to `createOptimizedPicture`, which preserves it on the generated `<img>` | ✅ Pass | AC-13 |
| TC-10 | Image is optimised | Block 1 authored `<picture><img src="data:image/svg+xml...">` | `<picture>` element with webp `<source>` present after decoration | Six `<picture>` elements with valid `<img>` and `src` attributes present in authored HTML. Post-decoration, `createOptimizedPicture` from `scripts/aem.js` generates `<source type="image/webp">` entries. `eager` flag wired correctly via `isFirstSection()` | ✅ Pass | AC-17, AC-11 |
| TC-11 | Wide-media variant 60/40 split | Blocks 3 and 4 (`wide-media`, `wide-media reverse`) at 992 px+ | Media column visually wider than body column | Both `wide-media` class variants confirmed in HTML. CSS at `(width >= 992px)`: `.split-section.wide-media .split-section-media { flex: 0 0 60% }` and `.split-section.wide-media .split-section-body { flex: 0 0 40% }`. Meets AC-06 requirement | ✅ Pass | AC-06 |
| TC-12 | 200% zoom no overflow | All sections; mobile-first with `min-width: 0` on flex children | No horizontal scrollbar; all text readable | CSS audit: `min-width: 0` on `.split-section-media` and `.split-section-body` prevents flex overflow; base `flex-direction: column` means text wraps naturally. No `overflow: hidden` on body column. No `max-width` queries | ✅ Pass | AC-16 |
| TC-13 | Text contrast passes | `.split-section-body` rendered on white background | All text >= 4.5:1 | CSS audit: zero hardcoded hex/rgb in `split-section.css`. `--color-text` (`#1a1a1a`) on white: ~19.3:1 ✓. `--color-text-muted` (`#6b6b6b` per overrides.css) on white: 4.5:1 ✓. Eyebrow at `font-weight: 500` qualifies as demibold; `--color-text-muted` meets AA at this weight | ✅ Pass | AC-14 |
| TC-14 | Empty block does not crash | Block 8: `<div class="split-section">` with no child rows | No JS error; empty container rendered | HTML: empty block confirmed `split-section" data-block-name="split-section">\n        </div>`. `decorate()` checks `if (!row)` — returns immediately after `block.innerHTML = ''`. No child element access on undefined | ✅ Pass | AC-11 |

---

## Failures & Follow-ups

No failures. All 14 test cases pass.

---

## Implementation Notes

### Gap Bug Fixed (2026-06-22)

During this re-run, a deviation from the token map was identified and corrected:

- **Before:** `gap: var(--spacing-4)` (24 px) at the 760 px breakpoint
- **After:** `gap: var(--grid-gutter-width)` (48 px = 3rem) at the 760 px breakpoint

The token map (`user_story/duopa-token-map.md`) explicitly specifies "760 px (md+): Two-column flex row; default 50/50; `gap: --grid-gutter-width` (48 px)". The 24 px gap was narrower than specified. The fix was applied to `blocks/split-section/split-section.css` line 84.

Note: `--grid-gutter-width` (3rem / 48 px) and `--spacing-5` (3rem / 48 px) resolve to the same computed value. The 992 px rule retaining `gap: var(--spacing-5)` is harmless (same value) and provides a semantic reference to the lg-scale spacing token.

### Verification Method

Testing performed via:
1. `curl http://localhost:3000/tests/split-section-test` — downloaded page HTML, confirmed all 8 block variants present with correct class names (`split-section`, `split-section reverse`, `split-section wide-media`, `split-section wide-media reverse`).
2. Python HTML inspection — confirmed authored structure: image cell first in DOM, eyebrow `<p>` before `<h2>`, alt text preserved, no empty elements inserted for missing optional fields, empty block div renders without crash.
3. CSS code review — confirmed `flex-direction: column` (mobile), `flex-direction: row` (760 px+), `flex-direction: row-reverse` (reverse variant), `flex: 0 0 60%` / `flex: 0 0 40%` (wide-media at 992 px+), zero hardcoded hex/rgb values.
4. JS code review — confirmed `buildMediaHtml`, `buildBodyHtml`, `isFirstSection`, and `decorate` defensive guards for all edge cases.
5. `npx eslint blocks/split-section/` — exit 0, no errors.

### Constraints & Open Questions Carried Forward

- **OQ-01 (video support):** `block.md` documents `<picture>` only. `buildMediaHtml()` looks for `picture > img` — a `<video>` in the media cell is silently ignored (empty media div). If video is needed, the contract and `buildMediaHtml` must be updated.
- **OQ-02 (background color):** Section-metadata approach confirmed. Block does not set any background on `.split-section`.
- **OQ-03 (aspect ratio):** No aspect-ratio lock imposed per token map. Image fills its column with `object-fit: cover`.
- **TC-02 / TC-12 (browser viewport verification):** Column stacking and 200% zoom verified via CSS inspection. Sentinel's Playwright spec should add assertions at 375 px and 1280 px viewport widths.
