# ISI Bar — User Story

## User Story

As a regulatory/medical-affairs stakeholder, I want an Important Safety Information
(ISI) bar that is persistently visible at the bottom of every page and can be
expanded to reveal full safety text so that the site meets FDA/PhRMA promotional
guidelines for prescription drug websites.

As a visitor, I want to be able to collapse the ISI bar to reclaim screen space
while knowing I can re-open it at any time, so that the bar does not permanently
obstruct page content.

---

## Acceptance Criteria

### Markup

- AC-01: The block renders a fixed-position `<aside>` at the bottom of the viewport
  with `role="complementary"` and `aria-label="Important Safety Information"`.
- AC-02: The collapsed state shows only a one-line summary bar with a "See More" /
  "See Less" toggle button.
- AC-03: The expanded state reveals a scrollable `<div>` containing the full ISI text
  loaded from a fragment at `/fragments/isi`.
- AC-04: The toggle button carries `aria-expanded="false"` (collapsed) /
  `aria-expanded="true"` (expanded) and `aria-controls` pointing to the ISI content
  panel `id`.
- AC-05: The ISI fragment content is loaded via `fetchFragmentHtml` from
  `scripts/config/fragment-loader.js` per the AGENTS.md fragment-loading block rule.
- AC-06: The block adds a `body` class `has-isi-bar` so global styles can push page
  content up by the bar's collapsed height.

### Styling

- AC-07: Collapsed bar height is fixed at 48 px on mobile and 56 px on desktop.
- AC-08: Expanded panel has a `max-height` of 40 vh with `overflow-y: auto`.
- AC-09: The bar background uses `--color-surface-2` (neutral light) or a brand-
  specified dark colour; text uses `--color-text`.
- AC-10: The toggle button has a visible `:focus-visible` ring at 3 px solid
  `--color-primary-focus`.
- AC-11: `z-index` uses `--z-sticky` (200) so the bar sits above content but below
  modal overlays (`--z-modal: 500`).
- AC-12: No `max-width` cap — the bar spans 100 % of the viewport width.

### Behaviour

- AC-13: Default state on page load is **collapsed**.
- AC-14: Clicking the toggle expands/collapses the panel; state is stored in
  `sessionStorage` (key `isi-expanded`) so the user's preference persists across
  in-session navigation.
- AC-15: When expanded, focus moves to the ISI content panel for screen-reader users.
- AC-16: The block must gracefully degrade if the `/fragments/isi` fetch fails —
  the summary line still renders with a link to the full Prescribing Information.
- AC-17: Pressing `Escape` while the panel is expanded collapses it and returns focus
  to the toggle button.

### Accessibility

- AC-18: WCAG 1.4.3: all ISI text must meet 4.5:1 contrast against the bar
  background.
- AC-19: WCAG 2.1.1: toggle is keyboard-operable (Enter and Space).
- AC-20: WCAG 4.1.2: `aria-expanded` is programmatically updated on every toggle.
- AC-21: The ISI scroll area has `tabindex="0"` and `role="region"` with an
  `aria-label` so keyboard users can scroll it.

### Performance

- AC-22: The ISI fragment is fetched in `loadLazy` phase — never in `loadEager` —
  so it does not delay LCP.
- AC-23: The ISI CSS and JS are loaded as the block's own files (`isi-bar.css`,
  `isi-bar.js`); they are not inlined in `styles.css`.

---

## Test Cases

| ID | Title | Preconditions | Steps | Expected Result | Traces To |
|---|---|---|---|---|---|
| TC-01 | Bar renders collapsed on load | Draft page with isi-bar block | Load `/tests/isi-bar-test.html` | `<aside>` present at bottom; panel content hidden; `aria-expanded="false"` | AC-01, AC-13 |
| TC-02 | Toggle expands panel | Collapsed bar | Click "See More" toggle | Panel visible; `aria-expanded="true"`; ISI text readable | AC-04, AC-14 |
| TC-03 | Toggle collapses panel | Expanded bar | Click "See Less" toggle | Panel hidden; `aria-expanded="false"` | AC-04, AC-14 |
| TC-04 | sessionStorage persists state | Expand bar; navigate to another test page | Reload page | Bar loads expanded; `sessionStorage` key `isi-expanded` is `"true"` | AC-14 |
| TC-05 | Escape key collapses panel | Expanded bar, focus inside panel | Press Escape | Panel collapses; focus returns to toggle button | AC-17 |
| TC-06 | Fragment fetch failure degrades gracefully | Block with invalid fragment path | Load page | Summary line renders; no JS error thrown; link to PI present | AC-16 |
| TC-07 | Bar z-index above page content | Page with sticky header | Scroll page | ISI bar overlaps page content but is below any modal | AC-11 |
| TC-08 | body class applied | Standard page | Inspect `<body>` element | `has-isi-bar` class present | AC-06 |
| TC-09 | Keyboard toggle works | Collapsed bar; focus on toggle button | Press Enter | Panel expands | AC-19 |
| TC-10 | Keyboard Space key works | Collapsed bar; focus on toggle button | Press Space | Panel expands | AC-19 |
| TC-11 | Panel scroll region accessible | Expanded panel with long ISI text | Tab to scroll region | Region focusable; `role="region"` and `aria-label` present | AC-21 |
| TC-12 | Contrast passes on bar text | Rendered bar | Browser a11y checker on ISI text | Ratio >= 4.5:1 | AC-18 |
| TC-13 | Mobile collapsed height 48 px | Viewport 375 px | Inspect bar height | Height = 48 px | AC-07 |
| TC-14 | Desktop collapsed height 56 px | Viewport 1280 px | Inspect bar height | Height = 56 px | AC-07 |
| TC-15 | Full-bleed width | Any viewport | Inspect bar width | Width = 100 vw | AC-12 |

---

## Variant Inventory

| Variant | Block Name Syntax | Description |
|---|---|---|
| Default | `ISI Bar` | Sticky bottom bar; collapsed on load; fragment-fed ISI content |
| Inline | `ISI Bar (inline)` | Non-sticky version rendered inline at the bottom of a single page (for pages where fixed positioning would double-stack) |

---

## Open Questions

- OQ-01: What is the exact fragment path for ISI content? Assumed `/fragments/isi`
  but must be confirmed with the project team.
- OQ-02: Should the collapsed summary line be authored content or hard-coded?
  Recommend authored (first row of the block table) so medical affairs can update
  it without a code change.
- OQ-03: Is the ISI bar required on HCP pages with a separate ISI section, or only
  on patient-facing pages?
- OQ-04: Does the expanded panel need a scroll-progress indicator (e.g., "ISI 40 %
  read") per any regulatory guidance?
