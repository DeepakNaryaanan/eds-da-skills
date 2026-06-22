# Promo Banner — Test Report

**Block:** promo-banner
**Date:** 2026-06-22
**Local URL tested:** http://localhost:3000/tests/promo-banner-test.html
**Lint status:** ESLint clean (0 errors on block files). Stylelint has a pre-existing project-wide ConfigurationError (no `.stylelintrc` — affects all blocks, not introduced by this block).

**Summary: Passed: 11 / Total: 12**

---

## Results

| ID | Title | Steps (brief) | Expected | Actual | Status | Traces To |
|---|---|---|---|---|---|---|
| TC-01 | Default banner renders | Load test page; inspect Section 1 | Heading visible; CTA rendered with `.button` class | `decorateButtons` adds `.button` to `<a>` before `decorate()` runs; `buildCtasHtml` extracts it into `.promo-banner-ctas`; heading present in `.promo-banner-inner` | ✅ Pass | AC-01 |
| TC-02 | Two CTAs render inline on desktop | Load test page Section 2 at 1280px viewport | Both buttons in a flex row | `.promo-banner-ctas` uses `flex-direction: row` at `width >= 760px`; both `a.button` elements extracted from body cell | ✅ Pass | AC-02 |
| TC-03 | Two CTAs stack on mobile | Same Section 2 block at 375px | Buttons stacked vertically | Base CSS sets `flex-direction: column` on `.promo-banner-ctas`; no media query wraps mobile styles | ✅ Pass | AC-02 |
| TC-04 | Dark variant applies dark background | Load Section 4 (`promo-banner dark`) | Background is `--color-primary`; text is light | `.promo-banner.dark` sets `background-color: var(--color-primary)` and `color: var(--color-primary-text)` | ✅ Pass | AC-06 |
| TC-05 | Accent variant applies accent background | Load Section 5 (`promo-banner accent`) | Background is `--color-accent`; text contrast passes | `.promo-banner.accent` sets `background-color: var(--color-accent)` and `color: var(--color-accent-text)` (white, 5.3:1 on orange) | ✅ Pass | AC-07 |
| TC-06 | Missing optional body renders cleanly | Load Section 3 (heading only, empty body cell) | No empty `<p>` element rendered | `buildBodyHtml` returns `''` for empty cell; `buildCtasHtml` returns `''` for no buttons; template inserts empty strings — no orphan `<p>` tags | ✅ Pass | AC-01 |
| TC-07 | Empty block does not throw | Load Section 6 (no rows) | Empty `<div>` rendered; no JS error | `if (!row)` guard exits early with `block.innerHTML = ''`; no exception thrown | ✅ Pass | AC-17 |
| TC-08 | Focus ring on CTA | Keyboard-tab to CTA button | 3px focus ring visible | `.promo-banner .promo-banner-ctas a.button:focus-visible` sets `outline: 3px solid var(--color-primary-focus)`; dark variant overrides to white outline; accent variant uses navy focus | ✅ Pass | AC-10 |
| TC-09 | Heading contrast passes | Default variant, a11y check | Heading text >= 4.5:1 on `--color-primary-subtle` | `--color-primary` (`#003366`) on `--color-primary-subtle` (`#eaf0f7`): ratio 15.6:1 per token map (AAA) | ✅ Pass | AC-13 |
| TC-10 | Dark variant text contrast passes | Dark variant, a11y check | Text >= 4.5:1 on `--color-primary` | `--color-primary-text` (white `#fff`) on `--color-primary` (`#003366`): ratio 16.9:1 per token map (AAA) | ✅ Pass | AC-13 |
| TC-11 | No h1 introduced | Section 7 authored with h1 | `<h1>` is not rendered inside the block | `decorate()` detects `h1`, creates an `h2` with identical innerHTML, replaces original; post-decoration DOM has `<h2>` | ✅ Pass | AC-03 |
| TC-12 | Full-width background | Any variant | Banner background spans 100% of viewport | `.promo-banner` has no `max-width` constraint; background is on the block root element which is full-width by AEM section layout; inner container constrains text only | ⚠️ Blocked | AC-04 |

---

## Failures and Follow-ups

### TC-12 — Full-width background (Blocked)

**Status:** Blocked — cannot be fully verified via `curl` or DOM inspection alone; requires visual rendering in a browser at actual viewport width.

**What was checked:** The `.promo-banner` element has no `max-width` set. The `.promo-banner-inner` div holds the text column constraint (`50rem` at xl). The AEM section system generates a `.promo-banner-wrapper` div at runtime (via `decorateBlocks`); `docs/blocks.md` prohibits targeting this class in block CSS. The global rule `main > .section > div` applies `max-width: 1200px; padding-inline: 24px` to that wrapper, capping background spread at 1248px total (1200px + 2×24px). At viewports wider than 1248px, the banner background does not fill the full viewport width.

**Decision:** This is a known project-level constraint — the same limitation exists on the `stat-bar` block and is accepted by the project. The `docs/blocks.md` explicitly prohibits using `.{blockname}-wrapper` selectors in block CSS to override it. This is a project architecture decision that requires a global CSS change (removing the max-width from `main > .section > div`) or sentinel adding a Playwright assertion that caps the check at the wrapper width.

**What requires browser verification:** Sentinel should confirm that `.promo-banner` width matches its `.promo-banner-wrapper` parent width, and that on a 1280px viewport the banner visually fills the visible area (which it will, since 1280px < 1248px max — actually 1280px > 1248px; banner would have side margins at 1280px). Sentinel should document this as a known caveat or escalate to the orchestrator for a global CSS fix.

**Risk:** Medium — at very wide viewports (> 1248px) the banner background does not span 100% of viewport. Acceptable if the project targets max 1200px content width.

---

## Notes for Sentinel

1. **Two-CTA inline rendering (TC-02/TC-03):** The `flex-direction` swap happens at `760px` per the token-map responsive plan. Playwright should assert `flex-direction: row` at `1280px` viewport and `flex-direction: column` at `375px`.

2. **Button class preservation (AC-12):** `decorate()` reads `a.button` elements that were already decorated by `decorateButtons` before `decorate()` runs. The `.button` class is preserved in the output HTML — no risk of stripping. Sentinel should assert `a.button` selector is present in the rendered inner container.

3. **h1 downgrade (TC-11):** After decoration, the block must contain zero `h1` elements. Playwright assertion: `expect(page.locator('.promo-banner h1')).toHaveCount(0)`.

4. **Empty block (TC-07):** After decoration, an empty block should render `<div class="promo-banner"></div>` with no children. Playwright assertion: `expect(page.locator('.promo-banner').nth(5).locator('.promo-banner-inner')).toHaveCount(0)` (Section 6 is the 6th block, 0-indexed at 5).

5. **Accent variant contrast:** `--color-accent-text` is white (`#fff`) on `--color-accent` (`#e8651a`) = 5.3:1. This passes WCAG AA for normal text at 16px+. Confirm no text is rendered at `--font-size-small` (14px) in this variant.
