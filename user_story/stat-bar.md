# Stat Bar — User Story

## User Story

As a site visitor, I want to see a concise strip of clinical statistics — each
showing an icon, a bold numerical claim, and a brief label — so that I can quickly
understand the key measurable benefits of DUOPA without reading long body copy.

As a content author, I want to add, remove, or edit individual statistics in a
simple block table so that the strip stays accurate when trial data is updated.

---

## Acceptance Criteria

### Markup

- AC-01: The block renders a `<ul>` containing one `<li>` per authored row.
- AC-02: Each `<li>` contains, in order: an optional `<picture>` or inline SVG icon
  element, a `<strong>` (or `<p class="stat-bar-value">`) for the statistic value,
  and a `<p class="stat-bar-label">` for the descriptive label.
- AC-03: If the icon cell is empty, the `<li>` renders without an icon container
  (no empty `<div>`).
- AC-04: The wrapping `<ul>` carries `role="list"` and each `<li>` has no interactive
  role unless a link is present.

### Styling

- AC-05: On mobile (< 632 px) the stats stack vertically, one per row.
- AC-06: At `>= 760 px` (md breakpoint) the stats display in a horizontal row using
  CSS Flexbox or Grid, equally spaced.
- AC-07: If four or more stats are authored, the layout wraps to two rows on tablet
  and remains horizontal on desktop (>= 992 px).
- AC-08: The strip has a visually distinct background (brand colour band or light
  surface) separating it from the hero and the next section.
- AC-09: The stat value uses a display-scale type token (`--font-size-display4` or
  larger); the label uses body text (`--font-size-p` or `--font-size-small`).
- AC-10: All colours use semantic tokens from `styles/config/themes.css` — no
  hardcoded hex values.

### Behaviour

- AC-11: The block is entirely static — no JavaScript animations or counters on load
  unless a `(animated)` variation is explicitly requested.
- AC-12: Images use `createOptimizedPicture` from `aem.js`.

### Accessibility

- AC-13: The stat strip is not a landmark — it must NOT use `<section>` or `<aside>`;
  a plain `<div>` wrapper containing the `<ul>` is correct.
- AC-14: Icon images must have a descriptive `alt` attribute or `alt=""` if purely
  decorative (determined by whether the icon duplicates the label meaning).
- AC-15: Colour contrast for the stat value and label against the strip background
  must meet WCAG 1.4.3 (4.5:1 for normal text, 3:1 for large text).
- AC-16: The block must not crash or render broken HTML if any optional cell is empty.

### Performance

- AC-17: The block adds no JavaScript dependency beyond `aem.js` utilities.
- AC-18: Icon images must not be wider than 96 px at 1x — use `createOptimizedPicture`
  with `{ width: '96' }`.

---

## Test Cases

| ID | Title | Preconditions | Steps | Expected Result | Traces To |
|---|---|---|---|---|---|
| TC-01 | Three stats render correctly | Draft page with stat-bar block containing 3 rows (icon, value, label each) | Load `/tests/stat-bar-test.html` | Three `<li>` elements visible; each has icon, value, label | AC-01, AC-02 |
| TC-02 | Missing icon cell renders without icon container | Row with empty first cell | Load page | `<li>` renders with value + label; no empty `<div>` icon wrapper | AC-03 |
| TC-03 | Mobile stacks vertically | Viewport set to 375 px wide | Load page at mobile width | Stats stacked in a single column | AC-05 |
| TC-04 | Tablet shows horizontal row | Viewport set to 768 px | Load page | Stats in a single horizontal row | AC-06 |
| TC-05 | Four stats wrap on tablet | 4-row block at 768 px viewport | Load page | Two rows of two stats | AC-07 |
| TC-06 | Empty block does not crash | Block with zero rows | Load page | Block renders an empty `<ul>` without throwing a JS error | AC-16 |
| TC-07 | Stat value uses large type token | Standard authored block | Inspect computed font-size on value element | Font-size resolves to display-scale value (>= 26 px at 760 px viewport) | AC-09 |
| TC-08 | Icon alt attribute present | Row with icon image | Inspect rendered `<img>` | `alt` attribute present (empty string or descriptive text) | AC-14 |
| TC-09 | Background contrast passes WCAG | Rendered block | Use browser accessibility checker on label text | Contrast ratio >= 4.5:1 against background | AC-15 |
| TC-10 | Single stat renders without layout breakage | Block with one row | Load page | Single stat centred or left-aligned; no layout shift | AC-01 |
| TC-11 | Animated variant applies counter animation | Block with `(animated)` variation class | Load page | Stat value counts up from 0 on scroll-enter | Variant — animated |
| TC-12 | No empty icon div when icon cell absent | Row with empty icon cell | Inspect DOM | No `<div class="stat-bar-icon">` element rendered | AC-03 |

---

## Variant Inventory

| Variant | Block Name Syntax | Description |
|---|---|---|
| Default | `Stat Bar` | Static horizontal strip; icon, value, label per stat |
| Animated | `Stat Bar (animated)` | Stat values count up from zero when the strip scrolls into view |
| Dark | `Stat Bar (dark)` | Dark background band; white text; use on dark section backgrounds |

---

## Open Questions

- OQ-01: Should icons be SVG sprites (from `icons/`) or authored `<picture>` images?
  The icon cell accepting a `<picture>` is the safer authoring model but SVG sprites
  are lighter. Recommend authored `<picture>` for flexibility; confirm with client.
- OQ-02: Is the animated counter variant required for the initial release?
- OQ-03: What is the maximum number of stats in a single strip? (Affects wrap logic.)
