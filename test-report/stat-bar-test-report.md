# Stat Bar — Test Report

**Block:** `stat-bar`
**Date:** 2026-06-19
**Branch:** feat/abbott-nutrition-home
**Reviewer:** Sentinel (Phase 5 + 6)
**Local URLs exercised:**
- `http://localhost:3000/tests/stat-bar-test.html` (block-level spec)

**Blockwright report reference:** `tests/stat-bar-test-report.md` (manual verification, 11/12 cases).
This report is the authoritative quality record for the lifecycle.

---

## Overall Verdict

**PASS** — all 27 Playwright tests pass; ESLint clean on block JS files; contrast ratio confirmed compliant; no blocking or major defects found.

---

## Code Review

### Directory Structure — PASS

All required files present: `block.md`, `stat-bar.js`, `stat-bar.css`, `markup.js`. Spec file `stat-bar.spec.js` added by Sentinel as part of this phase. No extraneous files.

### block.md — PASS

Content model documented with da.live block-table format. Three variants (Default, Animated, Dark) each have a separate table. Required/optional markers are present. Format matches the `docs/blocks.md` standard exactly.

### markup.js Pattern — PASS

- `STAT_BAR_MARKUP` and `STAT_ITEM_MARKUP` are named exports with `/* html */` comment.
- Default export is `STAT_BAR_MARKUP`. Compliant with `docs/blocks.md`.
- No imports — pure data file. No side effects.
- `{placeholder}` tokens for all dynamic values; resolves to empty string when no icon.

### Decoration Order — PASS

`decorate` follows the four-step order: (1) read variant flag, (2) extract data from authored rows, (3) build and inject HTML, (4) attach animation observer. Steps are not reordered.

### CSS Scoping — PASS

All selectors begin with `.stat-bar`. No bare element selectors. No `-container` or `-wrapper` suffixed classes. All media queries use `width >=` syntax at project breakpoints (760px, 992px, 1272px). Mobile-first base styles confirmed.

### No Hardcoded Colors — PASS

Every color references a semantic token: `var(--color-surface)`, `var(--color-primary)`, `var(--color-primary-text)`, `var(--color-text-muted)`. No hex or rgb literals in `stat-bar.css`.

### JSDoc / Comments — PASS

All exported functions have JSDoc with `@param` and `@returns` tags. All non-trivial helpers (`buildIconHtml`, `animateCounter`, `attachAnimationObserver`, inner `frame`) have JSDoc. The `decorate` function has the standard JSDoc block. Event handler `frame` documents that it receives a `DOMHighResTimeStamp`.

### Defensive Decoration / Graceful Degradation — PASS

- Empty block (zero rows): `stats = []`, `itemsHtml = ''` — produces valid empty `<ul>`. Verified by TC-06.
- Empty icon cell: `buildIconHtml` returns `''` on missing `picture > img`. Verified by TC-02/TC-12.
- Optional chaining on `cells[1]?.textContent`, `cells[2]?.querySelector()`, `cells[2]?.textContent`. No crash paths.

### Performance / Three-Phase Load — PASS

Block imports only `createOptimizedPicture` from `aem.js` (always loaded) and its own `markup.js`. No additional lazy imports. IntersectionObserver is attached post-render and does not block eager phase. Icons are sized at 96px max via `createOptimizedPicture({ width: '96' })` per AC-18.

### innerHTML Safety — PASS

`block.innerHTML` is assigned from a hardcoded template (`markup.js`) with authored content inserted as `.outerHTML` of already-parsed DOM nodes (icon `<picture>`) and `textContent` strings (value, label). Label text is inserted as text content, not attribute values, so no `encodeHtml` is required.

---

## Findings by Severity

### Blocking

None.

### Major

None.

### Minor

- **No-op CSS rule** (`stat-bar.css` line 146–150): The `@media (prefers-reduced-motion: reduce)` block sets `transition: none` on `.stat-bar.animated .stat-bar-value`. The stat-bar value element has no CSS `transition` defined anywhere, so this rule has no effect. The actual reduced-motion guard is correctly implemented in JS (`matchMedia` in `animateCounter`). The CSS rule is harmless redundancy but adds noise. Recommend removing it in a future cleanup. Not a defect.

---

## Automated Tests

### ESLint

- **`blocks/stat-bar/stat-bar.js`**: 0 errors, 0 warnings — PASS
- **`blocks/stat-bar/markup.js`**: 0 errors, 0 warnings — PASS
- **`blocks/stat-bar/stat-bar.spec.js`**: excluded by `.eslintignore` pattern (`**/*.spec.js`) — expected, matches project convention
- **Pre-existing failures in `import-page.mjs`**: 8 errors — OUT OF SCOPE (pre-existing, not caused by this block)

### Playwright Results

All 27 stat-bar tests pass. Run: `npx playwright test blocks/stat-bar/stat-bar.spec.js --reporter=list`.

| Spec File | Test Name | Status | Notes |
|---|---|---|---|
| stat-bar.spec.js | TC-01: default — three stats render as three list items | ✅ Pass | |
| stat-bar.spec.js | TC-01: each stat item contains a value and label | ✅ Pass | |
| stat-bar.spec.js | TC-01: stat list carries role="list" | ✅ Pass | AC-04 verified |
| stat-bar.spec.js | TC-01: stat list is a `<ul>` and items are `<li>` elements | ✅ Pass | AC-01 |
| stat-bar.spec.js | TC-08: icon images have an alt attribute | ✅ Pass | AC-14 |
| stat-bar.spec.js | TC-02/TC-12: rows with empty icon cell render no .stat-bar-icon element | ✅ Pass | AC-03 |
| stat-bar.spec.js | TC-02/TC-12: rows without icons still render value and label | ✅ Pass | AC-03 |
| stat-bar.spec.js | TC-03: at mobile width (375px), stat items stack vertically | ✅ Pass | AC-05 |
| stat-bar.spec.js | TC-04: at tablet width (768px), stats display in a horizontal row | ✅ Pass | AC-06 |
| stat-bar.spec.js | TC-04: at tablet width, stat items have flex: 1 1 0 | ✅ Pass | AC-06 |
| stat-bar.spec.js | TC-05: at tablet width (768px), four-stat block has flex-wrap enabled | ✅ Pass | AC-07 |
| stat-bar.spec.js | TC-06: empty block (zero rows) renders an empty `<ul>` without errors | ✅ Pass | AC-16 |
| stat-bar.spec.js | TC-07: stat value font-size is >= 26px at tablet viewport | ✅ Pass | AC-09 |
| stat-bar.spec.js | TC-09: stat-bar-value color is the primary token (navy, high contrast) | ✅ Pass | AC-15 |
| stat-bar.spec.js | TC-09: stat-bar background resolves to the surface token (#f4f5f7) | ✅ Pass | AC-15 |
| stat-bar.spec.js | TC-10: single-stat block renders exactly one list item | ✅ Pass | AC-01 |
| stat-bar.spec.js | TC-10: single-stat list is still visible without overflow | ✅ Pass | AC-01 |
| stat-bar.spec.js | TC-11: animated variant sets data-target on numeric value elements | ✅ Pass | animated variant |
| stat-bar.spec.js | TC-11: non-numeric value in animated variant displays its authored text | ✅ Pass | animated variant |
| stat-bar.spec.js | TC-11: animated variant has initial display value of "0" for numeric stats | ✅ Pass | animated variant |
| stat-bar.spec.js | dark variant: block has .dark class and renders correct item count | ✅ Pass | dark variant |
| stat-bar.spec.js | dark variant: background resolves to primary navy token | ✅ Pass | dark variant |
| stat-bar.spec.js | dark variant: stat value color resolves to primary-text (white) | ✅ Pass | dark variant |
| stat-bar.spec.js | block does not render a `<section>` or `<aside>` wrapper (AC-13) | ✅ Pass | AC-13 |
| stat-bar.spec.js | value element is a `<p>` (not a heading) inside each list item | ✅ Pass | AC-02 |
| stat-bar.spec.js | label element is a `<p>` inside each list item | ✅ Pass | AC-02 |
| stat-bar.spec.js | icon images use createOptimizedPicture (has `<picture>` wrapper) | ✅ Pass | AC-12 |

**Passed: 27 / Total: 27**

### Full suite results (all blocks)

85 passed, 9 failed — all 9 failures are pre-existing in unrelated blocks:
- `blocks/fragment/fragment.spec.js` (2 failures) — pre-existing
- `blocks/header/header.spec.js` (1 failure, logo test) — pre-existing
- `blocks/isi-bar/isi-bar.spec.js` (1 failure, reduced-motion) — pre-existing
- `blocks/tabs/tabs.spec.js` (5 failures) — pre-existing

No stat-bar tests appear in the failure list.

---

## Accessibility — WCAG 2.1/2.2 AA

### Contrast Ratios (computed mathematically per WCAG 2.1 formula)

| Text | Background | Token reference | Ratio | WCAG AA (4.5:1) | Verdict |
|---|---|---|---|---|---|
| `#6b6b6b` (label) | `#f4f5f7` (surface) | `--color-text-muted` on `--color-surface` | **4.89:1** | Required 4.5:1 | PASS |
| `#6b6b6b` (label) | `#ffffff` (white page bg) | `--color-text-muted` on `--color-page-bg` | **5.33:1** | Required 4.5:1 | PASS |
| `#003366` (value) | `#f4f5f7` (surface) | `--color-primary` on `--color-surface` | **11.56:1** | Required 4.5:1 | PASS (AAA) |
| `#ffffff` (dark text) | `#003366` (dark bg) | `--color-primary-text` on `--color-primary` | **12.61:1** | Required 4.5:1 | PASS (AAA) |

**Contrast verdict for TC-09 (blockwright open item b):** `--color-text-muted` (`#6b6b6b`) on `--color-surface` (`#f4f5f7`) resolves to **4.89:1** — this PASSES WCAG AA 1.4.3. The blockwright estimate of ~4.48:1 was incorrect. No fix is required. The stat label at `font-size: 0.875rem` (14px) with `font-weight: 500` does not qualify as large text, so the 4.5:1 threshold applies — and is met with margin.

**Note on blockwright concern:** The original styleforge plan mentioned `#767676`, which would compute 4.16:1 on `#f4f5f7` (FAIL). However, blockwright correctly used `#6b6b6b` as specified in overrides.css, which passes. No code change needed.

### Semantic Structure — PASS

- `<ul role="list">` wrapping `<li>` elements — correct list semantics.
- No `<section>` or `<aside>` landmark (AC-13 verified by test).
- No heading elements inside stat items — values are `<p>` elements, preserving document heading hierarchy.
- Icon images carry `alt=""` (decorative, per AC-14).

### Dark Variant Icon Rendering (OQ-T4) — OPEN ITEM (not a defect, requires client confirmation)

The dark variant (`stat-bar.dark`) has `--color-primary` navy as background. The test page authors white-filled SVG icons for the dark variant as a workaround. No CSS `filter` is applied to icons in the dark variant. If the project uses dark-filled raster icons for the default variant and wants to reuse them on the dark band, a `filter: brightness(0) invert(1)` rule would be needed. This is an authoring decision — confirm icon source format with client before adding any filter. Not a code defect.

### Reduced Motion — PASS

- `animateCounter` checks `window.matchMedia('(prefers-reduced-motion: reduce)')` and sets the final value immediately without rAF loop.
- CSS `@media (prefers-reduced-motion: reduce)` block sets `transition: none` on `.stat-bar.animated .stat-bar-value` (harmless redundancy — no transition is declared on that element in any other rule).
- Browser-level reduced-motion behavior is correctly gated in JavaScript.

### Focus Rings — PASS (N/A)

No interactive elements in the stat-bar block (default or animated or dark variants). No focus ring CSS is required per AC-13/token plan section 4.

---

## TC-05 Wrap Behavior — Verified

**Blockwright open item (a):** TC-05 four-stat wrap at 768px viewport.

Playwright test confirmed `flex-wrap: wrap` is set on `.stat-bar-list` at the md breakpoint (verified via `getComputedStyle`). The CSS uses `flex: 1 1 0` on items without an explicit `min-width`, which means items will attempt to share space equally. At 768px with four items and `gap: var(--spacing-4)`, natural wrapping will occur when items cannot fit in one row. The test asserts `flex-wrap === 'wrap'` (the structural requirement), which passes.

Whether exactly two rows are produced at exactly 768px depends on the computed item widths and gap values at runtime. This is acceptable — the acceptance criterion (AC-07) specifies that wrapping is enabled, not that exactly N rows appear at a specific pixel width. The structural contract is met.

---

## Failures and Remediation

None. All stat-bar tests pass. No defects to route back.

### Pre-existing failures in other blocks (out of scope)

These existed before this work and are unrelated to stat-bar:

| Failing Spec | Issue | Owned By |
|---|---|---|
| `blocks/fragment/fragment.spec.js` | Fragment loading timing issue | blockwright (fragment block) |
| `blocks/header/header.spec.js` | Logo link assertion (href or aria-label mismatch) | blockwright (header block) |
| `blocks/isi-bar/isi-bar.spec.js` | Reduced-motion media query emulation | blockwright (isi-bar block) |
| `blocks/tabs/tabs.spec.js` | `data-block-status="loaded"` attribute not being set | blockwright (tabs block) |

---

## Files Written by Sentinel

- `/Users/191561/Documents/play/Cognizant/eds-da-skills/blocks/stat-bar/stat-bar.spec.js` — 27 Playwright tests covering all 12 strategist test cases and 3 additional structural/accessibility assertions
- `/Users/191561/Documents/play/Cognizant/eds-da-skills/test-report/stat-bar-test-report.md` — this report

No production block files were modified.

---

## Recommended Next Agent

**pilot** — all quality gates are green for the stat-bar block. The block is ready for pre-push cleanup, branch push, PageSpeed check, and PR preparation.
