# Split Section — User Story

## User Story

As a content author, I want to place a two-column section with a `<picture>` on
one side and descriptive text (heading, body, optional CTA) on the other so that
I can explain product features, clinical context, or patient benefits in a visually
engaging layout.

As a visitor on mobile, I want the image to stack above the text so that both
remain readable at small screen sizes without horizontal scrolling.

---

## Acceptance Criteria

### Markup

- AC-01: The block renders a `<div class="split-section">` containing exactly two
  child `<div>` elements: `.split-section-media` and `.split-section-body`.
- AC-02: `.split-section-media` contains a `<picture>` (optimised via
  `createOptimizedPicture`).
- AC-03: `.split-section-body` contains: an optional eyebrow `<p>` (first `<p>`
  before the heading), a heading (`<h2>` or `<h3>`), body paragraphs, and an
  optional CTA link decorated as `.button`.
- AC-04: The default layout places the image on the left and text on the right.
  The `(reverse)` variation swaps the order — image right, text left — while
  maintaining source order in the HTML for accessibility.

### Styling

- AC-05: On mobile (< 760 px) the block stacks vertically: image above text.
- AC-06: At `>= 760 px` the block displays as a two-column layout. The default
  column split is 50/50; the `(wide-media)` variant uses 60 % image / 40 % text.
- AC-07: The image fills its column and maintains aspect ratio using
  `object-fit: cover` inside the media container.
- AC-08: Section alternates can be driven by section metadata (`.light`, `.dark`)
  applied to the parent section — the block itself does not manage background colour.
- AC-09: Eyebrow text uses `--font-size-small`, `--color-text-muted`, and
  `text-transform: uppercase`.
- AC-10: Vertical padding on the body column aligns with the section's standard
  padding (`--spacing-5`).

### Behaviour

- AC-11: The block is CSS-driven; its JS file only optimises the authored image via
  `createOptimizedPicture` and exports a default `decorate` function.
- AC-12: In the `(reverse)` variation, CSS `order` or `flex-direction: row-reverse`
  is used to swap columns — the DOM source order is NOT changed (image cell remains
  first in authored order).

### Accessibility

- AC-13: The `<picture>` element's inner `<img>` must have a meaningful `alt`
  attribute; the block must not override authored alt text.
- AC-14: WCAG 1.4.3: all text in `.split-section-body` must meet 4.5:1 contrast
  against the section background.
- AC-15: WCAG 2.4.6: heading must describe the section's topic; the eyebrow must not
  be the only textual identifier of the section.
- AC-16: WCAG 1.4.4: text remains readable at 200 % zoom (no horizontal overflow).

### Performance

- AC-17: Image is lazy-loaded (`eager: false` in `createOptimizedPicture`) unless
  it is in the first section of the page, in which case pass `eager: true`.
- AC-18: The block's JS adds no external dependencies.

---

## Test Cases

| ID | Title | Preconditions | Steps | Expected Result | Traces To |
|---|---|---|---|---|---|
| TC-01 | Default layout renders image left, text right | Block with image cell and body cell | Load `/tests/split-section-test.html` at 1280 px | Image in left column; text in right column | AC-01, AC-04 |
| TC-02 | Mobile stacks image above text | Same block | Load at 375 px | Image above; text below; no horizontal overflow | AC-05 |
| TC-03 | Reverse variant swaps columns | Block with `(reverse)` variation | Load at 1280 px | Image in right column; text in left column | AC-04, AC-12 |
| TC-04 | Reverse DOM order unchanged | Reverse variant | Inspect HTML source order | Image `<div>` appears first in source; CSS reverses visually | AC-12 |
| TC-05 | Eyebrow renders with muted small text | Body cell with eyebrow paragraph before heading | Inspect computed styles | Eyebrow font-size <= 14 px; color is `--color-text-muted` | AC-09 |
| TC-06 | Missing optional eyebrow renders cleanly | Body cell with no paragraph before heading | Load page | No empty element rendered before heading | AC-03 |
| TC-07 | Missing CTA renders cleanly | Body cell with no CTA link | Load page | No empty button element; body and heading still visible | AC-03 |
| TC-08 | Missing image cell renders gracefully | No image in first cell | Load page | Block renders text only; no JS error | AC-11 |
| TC-09 | Image alt preserved | Image with alt authored | Inspect rendered `<img>` | `alt` matches authored text | AC-13 |
| TC-10 | Image is optimised | Standard authored image | Inspect rendered `<picture>` | `<picture>` element with webp `<source>` present | AC-17, AC-11 |
| TC-11 | Wide-media variant 60/40 split | Block with `(wide-media)` variation | Load at 1280 px | Media column visually wider than body column | AC-06 |
| TC-12 | 200 % zoom no overflow | Standard block | Set browser zoom to 200 % | No horizontal scrollbar; all text readable | AC-16 |
| TC-13 | Text contrast passes | Rendered block on white background | a11y check | All text >= 4.5:1 | AC-14 |
| TC-14 | Empty block does not crash | Block with no rows | Load page | No JS error; empty container rendered | AC-11 |

---

## Variant Inventory

| Variant | Block Name Syntax | Description |
|---|---|---|
| Default | `Split Section` | 50/50 split; image left, text right |
| Reverse | `Split Section (reverse)` | 50/50 split; image right, text left (CSS only; DOM unchanged) |
| Wide Media | `Split Section (wide-media)` | 60 % image / 40 % text; image left |
| Wide Media Reverse | `Split Section (wide-media reverse)` | 60 % image / 40 % text; image right |

---

## Open Questions

- OQ-01: Should the block support a video element in the media column (e.g., an
  autoplay muted `<video>`)? If yes, the media cell must accept `<video>` in
  addition to `<picture>`.
- OQ-02: Is a background colour on the block itself needed (e.g., alternating grey
  bands), or is that handled entirely by section metadata? Recommend section metadata
  approach to keep the block lean.
- OQ-03: What aspect ratio should the image maintain at desktop? 16:9, 4:3, or
  free-form? Confirm with design.
