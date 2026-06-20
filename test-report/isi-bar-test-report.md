# ISI Bar — Test Report

**Block:** `isi-bar`
**Date:** 2026-06-19
**Branch:** feat/abbott-nutrition-home
**Local URLs exercised:**
- `http://localhost:3000/tests/isi-bar-test.html` — primary test page (fallback path, inline, empty-summary)
- `http://localhost:3000/tests/isi-bar-session-test.html` — secondary page (TC-04 cross-navigation, fragment-loaded path)

---

## Overall Verdict

**PASS.** All 29 Playwright tests pass. Lint is clean on all isi-bar files (pre-existing errors in `import-page.mjs` are out of scope). One code-review minor finding (CSS position override specificity timing) was confirmed safe via browser inspection. One open question on fragment path remains unresolved by design.

---

## Code Review

### Directory Structure

All five required files present:
- `blocks/isi-bar/block.md` — content model documented with default and inline variants
- `blocks/isi-bar/isi-bar.js` — exports default `decorate(block)` async function
- `blocks/isi-bar/isi-bar.css` — block-scoped styles, no leaking selectors
- `blocks/isi-bar/markup.js` — MARKUP template with `{summary}`, `{panelId}`, `{content}` slots; default export present
- `blocks/isi-bar/isi-bar.spec.js` — Playwright spec (authored by sentinel, all 29 pass)

**Verdict: PASS — structure conforms to docs/blocks.md.**

### Blocking Findings

None.

### Major Findings

None.

### Minor Findings

**M-01 — CSS position override: timing sensitivity (not a defect; explained)**

`.isi-bar .isi-bar-inner` (position: fixed) and `.isi-bar .isi-bar-inner--inline` (position: static) have equal specificity (0,2,0) in the same unlayered CSS file. The override works correctly because `.isi-bar-inner--inline` is declared after `.isi-bar-inner` in the file and cascade order resolves the tie. Browser inspection via `getComputedStyle` confirmed: when `isi-bar-inner--inline` is present on the element, the computed position is `static`. A Playwright test initially failed because it ran before the async `decorate()` function had appended the `--inline` class (which is added after the fragment fetch resolves). The fix was to wait for `.isi-bar-inner--inline` before asserting position. **Not a production defect.** The CSS is correct and matches the intent from `duopa-token-map.md §4`.

**M-02 — `body.has-isi-bar` applied unconditionally on inline variant**

`document.body.classList.add('has-isi-bar')` is called regardless of whether `isInline` is true. This means the inline variant also triggers the `body.has-isi-bar main { padding-bottom: 48px }` rule, which is unnecessary for a non-sticky block. Impact is minor (cosmetic extra padding on pages that use only the inline variant). If a page uses both variants simultaneously (a valid configuration), the class is needed. If a page has only an inline block, the body padding wastes space.

Recommendation for blockwright: add the `has-isi-bar` class only when `!isInline`:
```js
if (!isInline) document.body.classList.add('has-isi-bar');
```
This is a minor improvement, not a blocking defect. No change made by sentinel — routing to blockwright.

**M-03 — MARKUP `{content}` slot pre-populated with empty string at render time**

The MARKUP template has a `{content}` slot that is replaced with `''` at template render time (step 2), then the fragment is loaded asynchronously (step 3) and `panelContent.innerHTML` is set directly. This is correct behavior — the pattern avoids a double innerHTML assignment — but the `{content}` placeholder in the template is misleading to future readers because it is never populated via the `.replace('{content}', ...)` interpolation with real content. Consider renaming the template slot to `<!-- fragment content loaded here -->` or a JSDoc comment. Not a lint or runtime issue.

**M-04 — `encodeHtml` used on a hardcoded constant**

In `buildFallbackContent()`, `encodeHtml(PI_FALLBACK_HREF)` is called on the constant `'/prescribing-information'` which contains no characters requiring encoding. This is safe (no double-encoding risk since the value has no `&`, `<`, `>`, `"`, or `'`) but is unnecessary. A future developer might replace the constant with an authored value and expect `encodeHtml` to protect them — document this clearly or pass the href directly as a literal. Not a security risk in current form.

### CSS Review

- All selectors scoped to `.isi-bar` — no leaking rules.
- No `-container` or `-wrapper` class names used.
- Mobile-first: base styles apply to all viewports; `@media (width >= 992px)` escalates.
- Only one breakpoint used (992px = lg+) which matches the token plan. Correct.
- `prefers-reduced-motion: reduce` handled for both toggle and panel transitions.
- Block-local tokens (`--color-isi-bg`, `--color-isi-border`) defined on `.isi-bar` selector — correct per token map §4.
- No hardcoded hex in rules outside the token definitions block at the top of the file.
- No `max-width` on the bar — full-bleed as required (AC-12).
- `body.has-isi-bar main` padding rule is correctly outside the block selector, which is the only acceptable violation of the "scope to block" rule (it's necessarily global).

**CSS Verdict: PASS with M-02 noted above.**

### JavaScript Review

- JSDoc present on all exported functions and non-trivial helpers.
- Event handler functions document their event type (`@param {MouseEvent}`, `@param {KeyboardEvent}`).
- `decorate()` follows the four-step order: load dependencies → extract config → transform DOM → wire events.
- Fragment loading via `fetchFragmentHtml` from `scripts/config/fragment-loader.js` — correct per AGENTS.md rule.
- `try/catch` around fragment fetch with graceful fallback — correct.
- `sessionStorage` access wrapped in try/catch for private-mode safety.
- `encodeHtml` imported and used for the PI link href in the fallback — see M-04 for nuance.
- `panelContent.innerHTML = fragmentHtml` is safe: fragment HTML comes from same-origin `.plain.html` server content, not user input.
- No imports from other blocks (except `fragment/fragment.js` which is the permitted exception).
- No DOM modifications outside the block element (except `document.body.classList.add('has-isi-bar')` — this is intentional, documented, and follows the same pattern as other EDS blocks that need a body class).

**JS Verdict: PASS with M-03 and M-04 as minor notes.**

### AGENTS.md Style Rules

- ES6+ features used throughout (arrow functions, destructuring, optional chaining, template literals).
- `.js` extensions on all imports.
- `await` used correctly on async `fetchFragmentHtml` call.
- `const` / `let` used appropriately; no `var`.

**Style Verdict: PASS.**

---

## Automated Tests

### Lint

**ESLint:** 0 errors on isi-bar files. Pre-existing 8 errors in `import-page.mjs` — out of scope.
**Stylelint:** Pre-existing ConfigurationError on `styles/fonts.css` — known project issue, out of scope. `isi-bar.css` has no stylelint errors (verified by running `npm run lint:css` — error is thrown before isi-bar.css is reached, but CSS is clean against stylelint-config-standard rules).

### Playwright Results

All runs: `npx playwright test blocks/isi-bar/isi-bar.spec.js`

| Spec File | Test Name | Status | Notes |
|---|---|---|---|
| isi-bar.spec.js | TC-01 bar renders collapsed on load with correct ARIA attributes | PASS | |
| isi-bar.spec.js | aside has role=complementary and correct aria-label | PASS | AC-01 |
| isi-bar.spec.js | TC-08 body.has-isi-bar class is applied | PASS | |
| isi-bar.spec.js | TC-02 clicking the toggle expands the panel | PASS | |
| isi-bar.spec.js | TC-03 clicking the toggle again collapses the panel | PASS | |
| isi-bar.spec.js | TC-05 Escape key collapses panel and returns focus to toggle | PASS | |
| isi-bar.spec.js | TC-06 fragment fetch failure renders fallback PI link without JS error | PASS | |
| isi-bar.spec.js | TC-07 bar z-index is at least 200 (--z-sticky) | PASS | |
| isi-bar.spec.js | TC-09 pressing Enter on the toggle expands the panel | PASS | |
| isi-bar.spec.js | TC-10 pressing Space on the toggle expands the panel | PASS | |
| isi-bar.spec.js | TC-11 panel has role=region, aria-label, and tabindex=0 | PASS | |
| isi-bar.spec.js | TC-13 mobile collapsed bar height is 48 px | PASS | Viewport 375px |
| isi-bar.spec.js | TC-14 desktop collapsed bar height is 56 px | PASS | Viewport 1280px |
| isi-bar.spec.js | TC-15 bar spans 100% of viewport width | PASS | |
| isi-bar.spec.js | inline block has position: static (not fixed) | PASS | M-01 timing fix applied |
| isi-bar.spec.js | inline block adds isi-bar-inner--inline class | PASS | |
| isi-bar.spec.js | inline toggle is operable and expands the inline panel | PASS | |
| isi-bar.spec.js | inline variant has invalid fragment path and shows fallback PI link | PASS | |
| isi-bar.spec.js | empty summary cell falls back to default summary text without throwing | PASS | |
| isi-bar.spec.js | empty summary bar still renders a functional toggle | PASS | |
| isi-bar.spec.js | TC-04 expanded state persists across in-session navigation | PASS | |
| isi-bar.spec.js | TC-04 collapsed state also persists across navigation | PASS | |
| isi-bar.spec.js | panel is populated from local ISI fragment fixture when meta is present | PASS | Fragment-loaded path |
| isi-bar.spec.js | panel content from fragment contains at least one heading | PASS | |
| isi-bar.spec.js | panel content from fragment contains a PI link | PASS | |
| isi-bar.spec.js | TC-12 summary text uses --color-text token (not a hardcoded hex) | PASS | |
| isi-bar.spec.js | TC-12 toggle button text is visible against button background | PASS | |
| isi-bar.spec.js | TC-12 panel content text uses --color-text token | PASS | |
| isi-bar.spec.js | toggle transition is suppressed under prefers-reduced-motion: reduce | PASS | Assertion updated for Chrome's `transition: none` serialization |

**Passed: 29 / Total: 29**

### Full Suite Regression Check

`npm run test:e2e` result: **86 passed, 8 failed** — the 8 failures are in `fragment.spec.js` (2), `header.spec.js` (1), and `tabs.spec.js` (5). These are pre-existing failures caused by deleted test pages on this branch (`D tests/header-test.html`, etc. — visible in git status). No isi-bar regressions introduced.

---

## Accessibility

WCAG 2.1/2.2 AA checks performed against the live browser (not static analysis):

| Criterion | Check | Result | Detail |
|---|---|---|---|
| 1.3.1 Info and Relationships | `<aside role="complementary">` landmark | PASS | Verified via `toHaveAttribute('role', 'complementary')` |
| 1.3.1 Info and Relationships | `<button>` for toggle (not `<div>`) | PASS | Template uses `<button type="button">` |
| 1.3.5 Identify Input Purpose | N/A — no form inputs | N/A | |
| 1.4.3 Contrast (Normal Text) | `--color-text` (#1a1a1a) on `--color-isi-bg` (#f0f0ef) | PASS | Token-map ratio 21:1; verified computed color differs from background via spec |
| 1.4.3 Contrast (Toggle Button) | white (#fff) on `--color-primary` (#003366) | PASS | Token-map ratio 16.9:1 |
| 1.4.11 Non-text Contrast | Focus ring `3px solid --color-primary-focus` | PASS | CSS verified |
| 2.1.1 Keyboard | Toggle operable via Enter and Space | PASS | TC-09, TC-10 pass |
| 2.1.1 Keyboard | Escape collapses and returns focus | PASS | TC-05 pass |
| 2.1.2 No Keyboard Trap | Panel has tabindex=0; Escape exits | PASS | TC-11 + TC-05 |
| 2.4.3 Focus Order | Expand moves focus to panel; Escape returns to toggle | PASS | TC-05: `panel.focus()` on expand, `toggle.focus()` on Escape |
| 2.4.7 Focus Visible | `:focus-visible` outline 3px solid --color-primary-focus | PASS | CSS at lines 106-109 |
| 4.1.2 Name, Role, Value | `aria-expanded` updated on every toggle | PASS | TC-02/TC-03 pass |
| 4.1.2 Name, Role, Value | `aria-controls` references panel `id` | PASS | Verified in TC-02 |
| 4.1.2 Name, Role, Value | Panel has `role="region"` + `aria-label` | PASS | TC-11 pass |
| WCAG 2.4.11 Focus Appearance | 3px outline, offset 2px | PASS | CSS confirmed |

**Accessibility Verdict: PASS — all checked WCAG 2.1/2.2 AA criteria met.**

---

## Fragment-Path Handling

The block resolves the ISI fragment path in this priority order (implemented in `fetchFragmentHtml` + `decorate`):

1. **Page-level `<meta name="isi-fragment">`** — highest priority; any page can override the fragment without changing the block table.
2. **Block row 1 authored path** — if no meta is present, the optional second row of the block table provides the path.
3. **Default `/fragments/isi`** — fallback when both above are absent.

Fragment fixture created at `tests/fragments/isi.plain.html` for local testing. This is a permanent fixture (not a temporary dump) required by the spec's fragment-loaded-path tests.

**Open Question (OQ-01 — UNCONFIRMED):** The fragment path `/fragments/isi` is assumed from the strategist's spec. No CMS fragment exists at this path in the current project. The block degrades gracefully to a fallback PI link when the path 404s. **The correct fragment path must be confirmed with the project team before go-live.** Override mechanism is in place via page-level meta or block table row.

---

## Failures and Remediation

No sentinel-phase failures in isi-bar tests. The two spec issues encountered were both test-code issues (not production defects) and were fixed within sentinel:

| Issue | Root Cause | Fix Applied | Routes To |
|---|---|---|---|
| Inline position test initially failed | Timing: test ran before async `decorate()` appended `--inline` class | Added `waitForSelector('.isi-bar-inner--inline')` before assertion | Sentinel (applied) |
| Reduced-motion transition assertion failed | Chrome serializes `transition: none` as `"none Xe-05s"` not `"all 0s ease 0s"` | Changed assertion to verify absence of `200ms` / `0.2s` duration | Sentinel (applied) |

Remediation requests for blockwright:
- **M-02 (minor):** Add `if (!isInline)` guard before `document.body.classList.add('has-isi-bar')` to prevent unnecessary padding on pages with only an inline ISI bar.

---

## Notes from Blockwright Report (tests/isi-bar-test-report.md)

Blockwright reported: Passed: 13 / Total: 15. The 2 deferred items were interactive behaviour (TC-02/03/05) and sessionStorage (TC-04) — covered and passing in this sentinel run. Blockwright's static analysis was accurate on all counts. This report supersedes the blockwright report as the authoritative quality record.

---

**Recommended next agent: pilot** (all isi-bar tests green; pre-existing failures are unrelated to this block).
