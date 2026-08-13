# Stat Bar

Displays a horizontal strip of clinical statistics. Each stat has an optional
icon, a bold value, and a descriptive label. Typically placed immediately below
the hero to surface key trial data at a glance.

## Default

| Stat Bar                    |                                                          |                                             |
|-----------------------------|----------------------------------------------------------|---------------------------------------------|
| Icon *(optional)*           | Value *(required)*                                       | Label *(required)*                          |
| `<picture>` or inline SVG — decorative icon supporting the stat | Bold numerical or short text claim (e.g. "4 hours less") | Short descriptor (e.g. "'Off' time per day") |

Each row is one statistic. Minimum one row required. The block renders all rows
as a flex strip that wraps on narrow viewports.

## Variations

### Animated

| Stat Bar (animated)         |                                                          |                                             |
|-----------------------------|----------------------------------------------------------|---------------------------------------------|
| Icon *(optional)*           | Value *(required)*                                       | Label *(required)*                          |
| `<picture>` or inline SVG   | Numeric value — must be a plain integer or decimal (e.g. "4" or "10.5") for the counter to animate | Short descriptor |

The animated variant uses an IntersectionObserver to count the numeric value up
from zero when the strip first enters the viewport. Non-numeric values are
displayed as-is without animation.

### Dark

| Stat Bar (dark)             |                                                          |                                             |
|-----------------------------|----------------------------------------------------------|---------------------------------------------|
| Icon *(optional)*           | Value *(required)*                                       | Label *(required)*                          |
| `<picture>` or inline SVG   | Bold numerical or short text claim                       | Short descriptor                            |

Rendered on a dark band (`--color-primary` background). Use on sections that
have a dark section-metadata class applied to the parent section.
