# Patient Resources

Two-column section block. The left column contains an eyebrow label, a section heading, and a supporting image. The right column contains an introductory paragraph followed by an arbitrary number of resource items, each with a heading, optional description, and a CTA link. Items are separated by horizontal dividers.

On mobile the columns stack: eyebrow + heading, then intro paragraph, then image, then resource items.

## Default

### Header row (one row, two cells)

| Patient Resources             |                                                                          |
|-------------------------------|--------------------------------------------------------------------------|
| Header Left *(required)*      | Header Right *(required)*                                                |
| Eyebrow label (plain text or `<p>`), section heading (`<h2>`), and supporting `<picture>` — all in one cell. Eyebrow must appear before the heading. | Introductory paragraph (`<p>`) — appears at the top of the right column above the resource items. |

### Resource rows (one or more rows, one cell each)

Each subsequent row after the first is treated as one resource item.

| Patient Resources             |                                                                          |
|-------------------------------|--------------------------------------------------------------------------|
| Resource *(required)*         |                                                                          |
| Resource heading (`<h3>` or `<h4>`), optional description paragraph (`<p>`), CTA link (`<a>`) — all in a single cell. The link text is uppercased by CSS; the block appends a `›` chevron automatically. |  |

## Variations

### Dark

| Patient Resources (dark)      |                                                                          |
|-------------------------------|--------------------------------------------------------------------------|
| Header Left *(required)*      | Header Right *(required)*                                                |
| Same as default.              | Same as default.                                                         |

Renders with a dark-theme surface background (`--color-surface`). Uses the `dark` CSS modifier class on the block element.

> **Note:** Resource rows for the dark variant follow the same single-cell format as the default variant above.
