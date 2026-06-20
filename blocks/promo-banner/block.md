# Promo Banner

Full-width promotional call-to-action banner. Used to drive visitors toward
support programs, downloads, or key conversion actions.

## Default

| Promo Banner                |                                                                             |
|-----------------------------|-----------------------------------------------------------------------------|
| Heading *(required)*        | Body *(optional)*                                                           |
| `<h2>` or `<h3>` heading text | Supporting paragraph and/or one or two CTA links. Links are decorated as `.button` by the global `decorateButtons` pass. |

One row only. The first cell is the heading; the second cell holds body copy and
CTA link(s). If the body cell contains two links, both are rendered inline on
tablet and wider viewports.

## Variations

### Dark

| Promo Banner (dark)         |                                                                             |
|-----------------------------|-----------------------------------------------------------------------------|
| Heading *(required)*        | Body *(optional)*                                                           |
| `<h2>` or `<h3>` heading text | Supporting paragraph and/or one or two CTA links |

Brand primary colour background (`--color-primary`). Text rendered in
`--color-primary-text` (near-white). CTA buttons render as outlined white style.

### Accent

| Promo Banner (accent)       |                                                                             |
|-----------------------------|-----------------------------------------------------------------------------|
| Heading *(required)*        | Body *(optional)*                                                           |
| `<h2>` or `<h3>` heading text | Supporting paragraph and/or one or two CTA links |

Brand accent colour background (defined in `overrides.css` as `--color-accent`).
Text uses `--color-accent-text`. Suitable for high-emphasis support program CTAs.
