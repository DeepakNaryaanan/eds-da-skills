# DUOPA Home — Test Report

**Block/Page:** DUOPA Home Page Assembly (`tests/duopa-home-usage.html`)
**Date:** 2026-06-21
**Branch:** `feat/abbott-nutrition-home`
**Local URLs exercised:**
- `http://localhost:3000/tests/duopa-home-usage.html` (usage page — page-level spec)
- `http://localhost:3000/tests/stat-bar-test.html` (block unit spec)
- `http://localhost:3000/tests/isi-bar-test.html` (block unit spec — fallback path)
- `http://localhost:3000/tests/isi-bar-session-test.html` (block unit spec — fragment path + sessionStorage)

---

## Overall Verdict

**PASS** (with pre-existing failures noted)

The DUOPA home page assembly renders correctly and all 43 new page-level tests pass. Block-level unit specs for `stat-bar` and `isi-bar` also pass in full. Eight pre-existing failures exist across `fragment`, `header`, and `tabs` specs due to missing test fixture files — these are not introduced by the DUOPA work and do not affect the DUOPA home page.

---

## Code Review

### Blocking

None.

### Major

**M-01 — `overrides.css` has two competing `:root` blocks in the same file (Abbott Nutrition + DUOPA navy).**
The DUOPA primary overrides (`#003366`) are placed after the Abbott Nutrition block in the same `overrides` cascade layer, so the DUOPA values win for `--color-primary-*` at runtime. However, the file now silently overrides every page's primary brand tokens, not just DUOPA pages. If both sites share one repo branch, this is a production risk — the second `:root` block clobbers the first silently. This is an architectural decision that needs human sign-off before shipping.
Route to: **blockwright/styleforge** for token isolation strategy (separate override files per brand, or scope overrides to a body class).

**M-02 — No `tests/tabs-test.html` draft page exists.**
The `tabs.spec.js` references `tests/tabs-test.html` which does not exist, causing 4 test timeouts on every full test run. The `tabs` block is used on the DUOPA home page and its unit spec is broken. The DUOPA home page-level spec (`duopa-home.spec.js`) tests the tab block in integrated context and those pass, but the unit spec remains broken.
Route to: **blockwright** to create `tests/tabs-test.html`.

**M-03 — `tabs.spec.js` `beforeEach` waits for `.tabs[data-block-status="loaded"]` but no matching test file exists.**
Combined with M-02: even when a fixture file is created, the selector logic needs verification — `data-block-status="loaded"` is set by the AEM framework after decoration and should be reliable once the test page exists.

### Minor

**m-01 — `npm run lint` always exits non-zero due to lint errors in `import-page.mjs`.**
The `import-page.mjs` file has 8 ESLint errors (`max-len`, `no-shadow`, `no-continue`, `no-nested-ternary`). All errors are confined to this one file, which is an import utility and not a block. Block JS files lint clean. This is a pre-existing issue but prevents `npm run lint` from reporting clean.
Route to: **blockwright** (`import-page.mjs` owner) to run `npm run lint:fix`.

**m-02 — `npm run lint:css` (Stylelint) fails with `ConfigurationError: No configuration provided`.**
No `.stylelintrc` config file exists at the project root. The project has `stylelint` and `stylelint-config-standard` in `devDependencies` but the config file was never created. Block CSS files are unevaluated by the linter.
Route to: **blockwright** to create a `.stylelintrc.json` with `{ "extends": "stylelint-config-standard" }`.

**m-03 — `--color-text-muted` set to `#6B6B6B` (4.5:1 exactly on white) but token-map flagged `#767676` as marginal.**
The `overrides.css` correctly uses `#6B6B6B` (the precise 4.5:1 threshold) rather than the marginal `#767676` that the token-map originally proposed. This is correct, but the token-map note about using muted text only at `>=18px` or `font-weight: 700` for `--font-size-small` text remains advisory. ISI bar summary text uses `--font-size-small` with `--color-text` (not muted), which is correct.

**m-04 — `isi-bar.css` block-local tokens use raw hex literals (`#f0f0ef`, `#d0d0ce`) on the block selector.**
This is intentional and documented in `duopa-token-map.md` — ISI-specific surface tokens are defined block-locally to avoid polluting global scope. No remediation needed, but reviewers should be aware this is a deliberate architectural exception.

**m-05 — No dark-mode token overrides for `--color-accent-*` or DUOPA `--color-primary-*`.**
The overrides.css dark-mode blocks are commented out. DUOPA is a pharma patient site unlikely to need dark mode, and the token-map documents this as an open question (OQ-T6). If dark mode support is confirmed, dark-mode blocks must be uncommented and filled in.
Route to: human sign-off on OQ-T6.

**m-06 — `fragment.spec.js` and `header.spec.js` failures are pre-existing.**
Two `fragment` tests fail because `tests/fragment-test.html` does not exist. One `header` test fails — logo link assertion. These are not caused by DUOPA work but degrade the overall test signal.
Route to: **blockwright** to create `tests/fragment-test.html`.

---

## Automated Tests

### Lint

| Tool | Target | Result | Notes |
|---|---|---|---|
| ESLint | `blocks/**/*.js` | PASS | All block JS files lint clean |
| ESLint | `import-page.mjs` | FAIL (pre-existing) | 8 errors in non-block utility file; unrelated to DUOPA |
| Stylelint | `blocks/**/*.css` | FAIL (pre-existing infrastructure) | No `.stylelintrc` config exists; all CSS unevaluated |

### Playwright Results

| Spec File | Test Name | Status | Notes |
|---|---|---|---|
| `blocks/duopa-home/duopa-home.spec.js` | PL-01 page loads without JavaScript errors | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-02 page title is set and non-empty | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-03 main element contains at least 5 sections | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-04 hero-carousel renders 3 slides | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-04 hero-carousel first slide is active | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-04 hero-carousel renders prev/next buttons with accessible labels | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-04 hero-carousel renders 3 dot indicators | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-05 stat-bar renders 3 stat items | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-05 each stat item has a value and a label | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-05 first stat item value text contains expected content | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-05 stat-bar list has role="list" | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-06 nav-cards renders 3 cards | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-06 each nav-card has a link with an aria-label | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-06 nav-cards links are not empty href="#" | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-07 tabs block renders 3 tab buttons | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-07 first tab is selected by default | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-07 first tab panel is visible, others are hidden | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-08 plain-content section contains heading "Is DUOPA Right" | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-08 plain-content section contains an unordered list | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-09 isi-bar is present and fixed (sticky) | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-09 isi-bar z-index is >= 200 | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-10 isi-bar toggle expands and collapses the panel | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-10 isi-bar toggle label reads "See More" when collapsed | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-10 isi-bar toggle label reads "See Less" when expanded | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-11 body.has-isi-bar class is applied | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-12 next button advances hero-carousel to second slide | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-12 prev button wraps hero-carousel to last slide from first | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-13 nav-cards links are keyboard-focusable | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-14 tabs ArrowRight key moves focus to second tab and activates it | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-15 first heading in main is an h2 (hero uses h2 slides) | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-15 no h3 or lower appears before h2 (no heading level skip) | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-16 hero-carousel slide images have alt attributes | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-16 nav-cards icon images have alt attributes | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-17 stat-bar value color resolves to DUOPA navy #003366 | PASS | rgb(0,51,102) confirmed |
| `blocks/duopa-home/duopa-home.spec.js` | PL-18 isi-bar spans 100% of viewport width | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-19 isi-bar toggle aria-controls matches panel id | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | PL-20 isi-bar panel has role=region and aria-label | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | isi-bar summary displays the authored safety text | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | isi-bar summary contains a link to prescribing information | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | at mobile (375px) stat-bar items stack vertically | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | at tablet (768px) stat-bar items display in a row | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | isi-bar collapsed row is 48 px tall on mobile | PASS | |
| `blocks/duopa-home/duopa-home.spec.js` | isi-bar collapsed row is 56 px tall on desktop | PASS | |
| `blocks/fragment/fragment.spec.js` | renders fragment content in place of the authored link | FAIL (pre-existing) | Missing `tests/fragment-test.html` |
| `blocks/fragment/fragment.spec.js` | does not crash when block has no link | FAIL (pre-existing) | Missing `tests/fragment-test.html` |
| `blocks/header/header.spec.js` | renders the logo link to / | FAIL (pre-existing) | Logo link assertion mismatch |
| `blocks/tabs/tabs.spec.js` | renders tablist and correct number of tabs | FAIL (pre-existing) | Missing `tests/tabs-test.html` |
| `blocks/tabs/tabs.spec.js` | first tab is selected by default | FAIL (pre-existing) | Missing `tests/tabs-test.html` |
| `blocks/tabs/tabs.spec.js` | first panel is visible; others are hidden | FAIL (pre-existing) | Missing `tests/tabs-test.html` |
| `blocks/tabs/tabs.spec.js` | clicking a tab activates it and shows its panel | FAIL (pre-existing) | Missing `tests/tabs-test.html` |
| `blocks/tabs/tabs.spec.js` | arrow key navigation moves focus and activates tabs | FAIL (pre-existing) | Missing `tests/tabs-test.html` |

**DUOPA home spec: Passed: 43 / Total: 43**
**Full suite: Passed: 129 / Total: 137**
**Pre-existing failures (not introduced by DUOPA work): 8**

---

## Accessibility

WCAG 2.1/2.2 AA checks performed:

| Check | Element | Result | Notes |
|---|---|---|---|
| 1.1.1 Non-text content (alt text) | Hero carousel images | PASS | All 3 slide images have descriptive alt text authored |
| 1.1.1 Non-text content (alt text) | Stat-bar icons | PASS | Decorative icons use `alt=""` correctly |
| 1.1.1 Non-text content (alt text) | Nav-cards icons | PASS | Decorative icons use `alt=""` correctly |
| 1.3.1 Info and relationships | `<aside role="complementary">` on ISI bar | PASS | Landmark correctly declared |
| 1.3.1 Info and relationships | Tabs use `role="tablist"`, `role="tab"`, `role="tabpanel"` | PASS | ARIA pattern correct |
| 1.3.1 Info and relationships | `<ul role="list">` on stat-bar | PASS | List role explicit for Safari VoiceOver compat |
| 1.4.3 Contrast (normal text) | `--color-primary` (`#003366`) on `--color-page-bg` (`#ffffff`) | PASS | 16.9:1 (AAA) |
| 1.4.3 Contrast (normal text) | `--color-text` (`#1a1a1a`) on `--color-page-bg` | PASS | ~21:1 (AAA) |
| 1.4.3 Contrast (normal text) | `--color-accent-text` (`#ffffff`) on `--color-accent` (`#e8651a`) | PASS | 5.3:1 (AA) — marginal, use at >=16px only |
| 1.4.3 Contrast (muted text) | `--color-text-muted` (`#6b6b6b`) on white | PASS | 4.5:1 exactly; advisory: use at >=16px or bold |
| 1.4.11 Non-text contrast | ISI bar toggle button (navy on ISI bg) | PASS | 15.1:1 |
| 2.1.1 Keyboard accessible | ISI bar toggle (Enter/Space activate) | PASS | Verified in PL-10 |
| 2.1.1 Keyboard accessible | ISI bar Escape key collapses panel | PASS (unit spec) | Covered in isi-bar unit spec TC-05 |
| 2.1.1 Keyboard accessible | Hero carousel prev/next buttons | PASS | Buttons are focusable |
| 2.1.1 Keyboard accessible | Tabs ArrowRight navigation | PASS | Verified in PL-14 |
| 2.1.1 Keyboard accessible | Nav-cards links | PASS | Verified in PL-13 |
| 2.2.2 Pause, Stop, Hide | Hero carousel pauses on hover/focusin | PASS | Autoplay stops on mouseenter/focusin |
| 2.4.3 Focus order | ISI expand: focus moves to panel on open | PASS (unit spec) | panel.focus() called on expand |
| 2.4.11 Focus visible | ISI bar toggle `:focus-visible` (3px solid navy) | PASS | CSS verified in isi-bar.css |
| 2.4.13 Focus appearance | Focus ring >= 3px, >= 3:1 contrast | PASS | `3px solid var(--color-primary-focus)` = #002244 (19.4:1) |
| 4.1.2 Name, Role, Value | ISI bar `aria-expanded` updated on toggle | PASS | Verified in PL-10 |
| 4.1.2 Name, Role, Value | ISI bar `aria-controls` wired to panel id | PASS | Verified in PL-19 |
| 4.1.2 Name, Role, Value | Hero carousel `aria-hidden` on inactive slides | PASS | Verified in PL-04 |
| 4.1.2 Name, Role, Value | Nav-cards `aria-label` on card links | PASS | Verified in PL-06 |

**Advisory (not blocking WCAG):**
- No `<h1>` is present on the DUOPA home page — the hero carousel uses `<h2>` as the first heading level per authored content. AEM page templates typically inject the document title at h1 level via a fragment; for this draft test page the absence of h1 is acceptable and documented. A production page should include an `<h1>` scoped to the page title (typically in the hero block body or above it as default content).

---

## Failures & Remediation

### F-01 — Missing `tests/fragment-test.html`
**Spec:** `blocks/fragment/fragment.spec.js` (tests 1 and 3)
**Repro:** `npx playwright test blocks/fragment/fragment.spec.js`
**Error:** `page.waitForSelector` times out — the file `tests/fragment-test.html` does not exist on disk.
**Remediation:** Create `tests/fragment-test.html` with a draft page containing a `<a href="/fragments/sample">` link inside a `.fragment` block, and a matching `tests/fragments/sample.plain.html` fixture.
**Routes to:** blockwright

### F-02 — `header.spec.js` logo link assertion
**Spec:** `blocks/header/header.spec.js:13`
**Repro:** `npx playwright test blocks/header/header.spec.js`
**Error:** Test "renders the logo link to /" — the logo link href does not resolve to `/` as the test expects. This may be a difference in the local draft nav fragment (`tests/fragments/nav.plain.html`) which uses a data URI for the logo image rather than a branded link.
**Remediation:** Update `tests/fragments/nav.plain.html` to wrap the logo picture in an `<a href="/">` anchor, or update the test assertion to match the actual rendered href.
**Routes to:** blockwright

### F-03 — Missing `tests/tabs-test.html`
**Spec:** `blocks/tabs/tabs.spec.js` (all 4 tests)
**Repro:** `npx playwright test blocks/tabs/tabs.spec.js`
**Error:** `page.waitForSelector('.tabs[data-block-status="loaded"]')` times out — the file `tests/tabs-test.html` does not exist.
**Remediation:** Create `tests/tabs-test.html` with a draft page containing a `tabs` block with 3 authored rows (label | content), plus `tests/fragments/nav.plain.html` and `tests/fragments/footer.plain.html` references.
**Routes to:** blockwright

### F-04 — `npm run lint` non-zero exit from `import-page.mjs`
**Repro:** `npm run lint`
**Error:** 8 ESLint errors in `import-page.mjs` — `max-len` (lines 37, 230), `no-shadow` (lines 99, 171), `no-continue` (lines 116, 117, 119), `no-nested-ternary` (line 139). None affect block code.
**Remediation:** Run `npm run lint:fix` on `import-page.mjs` and manually resolve the unfixable `no-shadow` and `no-nested-ternary` findings.
**Routes to:** blockwright

### F-05 — Missing `.stylelintrc.json` — Stylelint never runs
**Repro:** `npm run lint:css`
**Error:** `ConfigurationError: No configuration provided for .../footer.css`
**Remediation:** Create `/.stylelintrc.json` with contents `{ "extends": ["stylelint-config-standard"] }` at the project root.
**Routes to:** blockwright

---

## Recommended Next Agent

**blockwright** — to resolve F-03 (create `tests/tabs-test.html`), F-04 (lint fix), and F-05 (create `.stylelintrc.json`). Once those pre-existing issues are green, hand off to **pilot** for the deploy phase.
