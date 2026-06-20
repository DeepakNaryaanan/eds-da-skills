# Promo Banner — User Story

## User Story

As a content author, I want to place a full-width promotional banner on any page
so that I can drive visitors to take a specific action — such as calling a support
line, downloading a guide, or visiting a support program page — without interrupting
the reading flow.

As a visitor, I want the banner to be visually distinct from surrounding content
so that the call-to-action is immediately recognisable.

---

## Acceptance Criteria

### Markup

- AC-01: The block renders a full-width `<div class="promo-banner">` containing a
  centred inner `<div class="promo-banner-inner">` that holds: a heading (`<h2>` or
  `<h3>`), an optional body paragraph, and one or two CTA links rendered as `.button`
  anchors.
- AC-02: If a second CTA link is authored in the body cell, both links render inline
  (flex row with gap) on tablet and wider viewports.
- AC-03: The block must not introduce an `<h1>` or skip heading levels.

### Styling

- AC-04: The banner is full-bleed — it spans the full container width. Background
  colour is set via the `(dark)`, `(light)`, or `(accent)` variation class.
- AC-05: Default (no variation): `background: var(--color-primary-subtle)`; heading
  and body use `--color-text`.
- AC-06: `(dark)` variation: `background: var(--color-primary)`; text uses
  `--color-primary-text` (white or near-white); buttons use an outlined white style.
- AC-07: `(accent)` variation: `background: var(--color-accent)` (brand orange if
  defined in overrides.css); text uses `--color-accent-text`.
- AC-08: Heading uses `--font-size-h3` at minimum; body uses `--font-size-p`.
- AC-09: Vertical padding is `--spacing-5` (48 px) on mobile; `--spacing-5` top
  and bottom on desktop with auto horizontal margins on the inner container.
- AC-10: All interactive elements have a `:focus-visible` outline using
  `--color-primary-focus` at 3 px solid.

### Behaviour

- AC-11: The block is entirely static — no JS required.
- AC-12: Links decorated by `decorateButtons` in `scripts.js` must retain their
  `.button` class; the block CSS should not strip or override it.

### Accessibility

- AC-13: WCAG 1.4.3: text contrast against banner background >= 4.5:1.
- AC-14: WCAG 1.4.3: CTA button text contrast >= 4.5:1 against button background.
- AC-15: The banner is not a landmark (`<section>` is not required); a plain `<div>`
  with no ARIA role is correct unless the page architecture requires it.
- AC-16: If the heading is purely decorative and the CTA is the only meaningful
  content, an `aria-label` on the link must describe the action fully.

### Performance

- AC-17: No JavaScript file is needed — the block is CSS-only. The `.js` file
  exports an empty default function (required by the block loader).

---

## Test Cases

| ID | Title | Preconditions | Steps | Expected Result | Traces To |
|---|---|---|---|---|---|
| TC-01 | Default banner renders | Block with heading and one CTA | Load `/tests/promo-banner-test.html` | Heading visible; CTA button rendered with `.button` class | AC-01 |
| TC-02 | Two CTAs render inline on desktop | Block with heading, body, and two links | Load at 1280 px viewport | Both buttons in a flex row | AC-02 |
| TC-03 | Two CTAs stack on mobile | Same block | Load at 375 px | Buttons stacked vertically | AC-02 |
| TC-04 | Dark variant applies dark background | Block with `(dark)` variation | Load page | Background is `--color-primary`; text is light | AC-06 |
| TC-05 | Accent variant applies accent background | Block with `(accent)` variation | Load page | Background is `--color-accent`; text contrast passes | AC-07 |
| TC-06 | Missing optional body renders cleanly | Block with heading and CTA only (no body paragraph) | Load page | No empty `<p>` element rendered | AC-01 |
| TC-07 | Empty block does not throw | Block with no rows | Load page | Empty `<div>` rendered; no JS error | AC-17 |
| TC-08 | Focus ring on CTA | Tab to CTA button | Keyboard focus on button | 3 px focus ring visible | AC-10 |
| TC-09 | Heading contrast passes | Default variant | a11y check | Heading text >= 4.5:1 on `--color-primary-subtle` | AC-13 |
| TC-10 | Dark variant text contrast passes | Dark variant | a11y check | Text >= 4.5:1 on `--color-primary` | AC-13 |
| TC-11 | No h1 introduced | Block with h1 authored | Inspect DOM | `<h1>` is not rendered inside the block (block ignores/downgrades it) | AC-03 |
| TC-12 | Full-width background | Any variant | Inspect computed width | Banner background spans 100 % of viewport | AC-04 |

---

## Variant Inventory

| Variant | Block Name Syntax | Description |
|---|---|---|
| Default | `Promo Banner` | Light-surface background; standard dark text; primary CTA button |
| Dark | `Promo Banner (dark)` | Brand primary colour background; white text; outlined white CTA buttons |
| Accent | `Promo Banner (accent)` | Brand accent colour (orange) background; dark text for contrast |

---

## Open Questions

- OQ-01: Is a background image option needed (hero-style banner with overlay)?
  If yes, this becomes closer to a single-slide hero and should reuse
  `hero-carousel`. Recommend confirming before implementation.
- OQ-02: Should the inner container be constrained to `--max-width` (1920 px) or
  a narrower text column (e.g. 800 px)? The latter improves readability.
