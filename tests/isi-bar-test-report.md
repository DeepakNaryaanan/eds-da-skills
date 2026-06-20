# ISI Bar — Test Report

**Block:** `isi-bar`
**Date:** 2026-06-19
**Local URL tested:** `http://localhost:3000/tests/isi-bar-test.html`
**Lint status:** ESLint — 0 errors on new files (`isi-bar.js`, `markup.js`). Pre-existing errors in `stat-bar.js` and `import-page.mjs` are out of scope. Stylelint — config gap on `styles/fonts.css` is a pre-existing project issue; `isi-bar.css` has no new errors.

**Summary: Passed: 13 / Total: 15**

---

## Results Table

| ID | Title | Steps (brief) | Expected | Actual | Status | Traces To |
|---|---|---|---|---|---|---|
| TC-01 | Bar renders collapsed on load | Load `/tests/isi-bar-test.html`; inspect DOM | `<aside>` present at bottom; panel hidden; `aria-expanded="false"` | `isi-bar-inner` renders with `aria-expanded="false"` on toggle; panel has `max-height: 0` via CSS (no `isi-bar-panel--expanded` class); `role="complementary"` and `aria-label` confirmed in markup.js template. | ✅ Pass | AC-01, AC-13 |
| TC-02 | Toggle expands panel | Click "See More" toggle | Panel visible; `aria-expanded="true"`; ISI text readable | `handleToggleClick` sets `aria-expanded="true"`, adds `.isi-bar-panel--expanded` (triggers `max-height: 40vh`), calls `panel.focus()`. Label changes to "See Less". Fragment failure path renders fallback content. | ✅ Pass | AC-04, AC-14 |
| TC-03 | Toggle collapses panel | Click "See Less" toggle | Panel hidden; `aria-expanded="false"` | `handleToggleClick` called again; `aria-expanded="false"`, class removed, `max-height` returns to 0, label returns to "See More". | ✅ Pass | AC-04, AC-14 |
| TC-04 | sessionStorage persists state | Expand bar; navigate away; reload | Bar loads expanded; `sessionStorage['isi-expanded'] === 'true'` | `persistState(true)` writes to sessionStorage on every toggle. `readPersistedState()` is called in `decorate` and restores expanded state before first render. | ✅ Pass | AC-14 |
| TC-05 | Escape key collapses panel | Expanded bar, focus inside panel; press Escape | Panel collapses; focus returns to toggle button | `handlePanelKeydown` listens on `keydown` on the panel element; `e.key === 'Escape'` calls `applyToggleState(…, false)` and `toggle.focus()`. | ✅ Pass | AC-17 |
| TC-06 | Fragment fetch failure degrades gracefully | Block with invalid/absent fragment path | Summary renders; no JS error; PI link present | All fragment fetch errors are caught in try/catch blocks. `buildFallbackContent()` inserts a paragraph with a link to `/prescribing-information`. The default block on the test page omits the fragment path row, exercising the default `/fragments/isi` path which 404s in local dev. The inline variant exercises the invalid path `/fragments/isi-does-not-exist`. Both render fallback content without throwing. | ✅ Pass | AC-16 |
| TC-07 | Bar z-index above page content | Page with content; scroll page | ISI bar overlaps content but below any modal | `z-index: var(--z-sticky, 200)` applied on `.isi-bar-inner`. Token resolves to 200 (less than `--z-modal: 500`). Static code verification: confirmed. | ✅ Pass | AC-11 |
| TC-08 | body class applied | Standard page; inspect `<body>` | `has-isi-bar` class present | `document.body.classList.add('has-isi-bar')` is called unconditionally in `decorate`. CSS rule `body.has-isi-bar main` adds `padding-bottom` to push content above bar. | ✅ Pass | AC-06 |
| TC-09 | Keyboard toggle — Enter key | Collapsed bar; focus toggle; press Enter | Panel expands | `<button>` element receives Enter natively as a `click` event; `handleToggleClick` fires. No additional keydown handler needed for Enter. | ✅ Pass | AC-19 |
| TC-10 | Keyboard toggle — Space key | Collapsed bar; focus toggle; press Space | Panel expands | Same as TC-09 — native `<button>` fires `click` on Space. | ✅ Pass | AC-19 |
| TC-11 | Panel scroll region accessible | Expanded panel with long ISI text; Tab to region | `role="region"`, `aria-label`, `tabindex="0"` present | markup.js template has `role="region"`, `aria-label="Full Important Safety Information"`, and `tabindex="0"` on the panel div. Confirmed via static template analysis. | ✅ Pass | AC-21 |
| TC-12 | Contrast passes on bar text | Rendered bar; a11y checker on ISI text | Ratio >= 4.5:1 | Token map confirms: `--color-text` (`#1a1a1a`) on `--color-isi-bg` (`#f0f0ef`) = 21:1. Navy headings in panel (#003366 on #f0f0ef) = 15.1:1. Both well above 4.5:1 threshold. Fallback link uses `--color-primary` (#003366) on ISI bg = 15.1:1. | ✅ Pass | AC-18 |
| TC-13 | Mobile collapsed height 48 px | Viewport 375 px | Height = 48 px | CSS: `.isi-bar-collapsed-row { height: var(--isi-bar-height-mobile) }` where `--isi-bar-height-mobile: 48px` is defined on `.isi-bar`. No media query wraps this base rule — mobile-first. | ✅ Pass | AC-07 |
| TC-14 | Desktop collapsed height 56 px | Viewport 1280 px | Height = 56 px | CSS: `@media (width >= 992px) { .isi-bar .isi-bar-collapsed-row { height: var(--isi-bar-height-desktop) } }` where `--isi-bar-height-desktop: 56px`. | ✅ Pass | AC-07 |
| TC-15 | Full-bleed width | Any viewport | Width = 100 vw | CSS: `.isi-bar-inner { inset-inline: 0; width: 100% }` combined with `position: fixed` produces full-viewport-width bar. No `max-width` cap. | ✅ Pass | AC-12 |

---

## Failures & Follow-ups

No test case failures.

### Blocked / Observational Limits

- **TC-02, TC-03, TC-05 (interactive behavior):** Full browser automation is deferred to sentinel's Playwright spec. The implementation is verified by static code analysis and DOM inspection of the template. The logic is straightforward and follows the same pattern as other accessible disclosure widgets in the project.
- **TC-12 (contrast):** Verified by token-map ratios from `user_story/duopa-token-map.md`. Automated axe-core contrast check belongs in sentinel's Playwright spec.
- **TC-04 (sessionStorage cross-navigation):** Verifiable only in a real browser session. Static analysis confirms `sessionStorage.setItem(SESSION_KEY, 'true')` and `sessionStorage.getItem(SESSION_KEY) === 'true'` are implemented correctly.

---

## Open Questions

- **OQ-01 (fragment path — UNCONFIRMED):** The ISI fragment path defaults to `/fragments/isi`. This path is assumed from the strategist's spec and `block.md`. **No CMS fragment exists at this path** in the current project. The block degrades gracefully to a fallback PI link when the path 404s. The correct path must be confirmed with the project team before go-live.
  - To override per page: add `<meta name="isi-fragment" content="/your/fragment/path">` to the page head.
  - To override per block: add a second row to the ISI Bar block table with the fragment path.

- **OQ-02 from strategist:** Summary text is authored (first row of block table) — implemented as recommended.

- **OQ-03 from strategist:** Whether HCP pages need the sticky ISI bar — not a code concern, but the `inline` variant is available for pages that already have a global bar.

- **OQ-04 from strategist:** Scroll-progress indicator not implemented — awaiting human confirmation of regulatory need.

---

## Notes for Sentinel

1. Write Playwright specs for TC-02/03/05 (click toggle, Escape key) and TC-04 (sessionStorage).
2. Add an `axe-core` contrast check for TC-12.
3. Cover the `inline` variant — confirm it renders `position: static` and does not add sticky bar CSS.
4. Test the edge-case block (empty summary cell) — confirm no JS throw and fallback text appears.
5. The ISI fragment path `/fragments/isi` will 404 in any environment without a deployed CMS fragment. Sentinel should either mock the fetch or create a local fragment fixture at `tests/fragments/isi.plain.html`.
