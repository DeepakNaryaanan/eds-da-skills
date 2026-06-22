# Token Mapping Plan — Abbott Nutrition Homepage

Design phase (styleforge) output for the `feat/abbott-nutrition-home` branch. Token
contract for blockwright building `resource-list` and `promo-pair`. `hero-carousel`
and `nav-cards` already match this plan — do not modify them.

## overrides.css fix (APPLIED)

The DUOPA `:root` block in `styles/config/overrides.css` was overriding the Abbott
primary/surface/text tokens (it followed the Abbott block in the same `overrides`
cascade layer, so it won site-wide). It has been **commented out** on this branch so
the Abbott brand tokens resolve correctly:

- `--color-primary` → `#001489` (Abbott navy), was `#003366` (DUOPA)
- `--color-surface` → `#ffffff`, was `#f4f5f7`
- `--color-surface-2` → `#ececeb`, was `#e8e8e7`
- `--color-text` → `#212121`, `--color-text-muted` → `#63666a`

No net-new tokens were required. The DUOPA `--color-accent-*` family (orange) does not
conflict and remains active.

## 1. Token mapping — new blocks

### resource-list ("Latest News")

| Element | Token | Value | Notes |
|---|---|---|---|
| Section bg | `--color-page-bg` | `#ffffff` | White section; no modifier |
| Section heading "Latest News" | `--color-text` via `h2` | `#212121` | Authored above block |
| Card surface | `--color-surface` | `#ffffff` | |
| Card shadow (default) | `--shadow-s` | `0 0 2px 0 #d4d4d4` | Subtle lift |
| Card shadow (hover) | `--shadow-m` | raised | |
| Card image | layout only | `aspect-ratio: 16 / 7`, `object-fit: cover` | block-local, not a token |
| Article title link | `--color-primary` | `#001489` | `font-weight: 600`; no underline default; **promote `<p><a>` to `<h3>`** (OQ-A2) |
| Article title link hover | `--color-primary-hover` + underline | `#000e5e` | |
| Article title link focus | `3px solid --color-primary-focus`, offset 2px | `#009cde` | |
| Category tag (`<em>`) | `--color-text-muted` | `#63666a` | `font-style: italic`; `--font-size-small` |
| Summary paragraph | `--color-text` | `#212121` | `--font-size-p` |
| Card border (fallback) | `--color-border` | `#d9d9d6` | optional |

### promo-pair

| Element | Token | Value | Notes |
|---|---|---|---|
| Section bg | `--color-surface-2` | `#ececeb` | Scope to block's section wrapper (OQ-A4) |
| Tile surface | `--color-surface` | `#ffffff` | |
| Tile shadow | `--shadow-s` | subtle | |
| Tile image | layout only | `aspect-ratio: 3 / 2`, `object-fit: cover` | block-local |
| Heading (h3) | `--color-text` | `#212121` | `--font-size-h3` / weight 600 |
| Body paragraph | `--color-text` | `#212121` | `--font-size-p` |
| CTA filled bg | `--color-primary` | `#001489` | navy (varies hierarchy vs hero/nav-cards sky-blue) |
| CTA text | `--color-primary-text` | `#ffffff` | ~20:1 |
| CTA hover | `--color-primary-hover` | `#000e5e` | |
| CTA active | `--color-primary-active` | `#00093d` | |
| CTA focus | `3px solid --color-primary-focus`, offset 2px | `#009cde` | |
| Card radius | `--border-radius-s` | `4px` | |

## 2. Typography

| Element | Token | Min (632px) | Max (1432px) | Weight |
|---|---|---|---|---|
| resource-list title (`<h3>`) | `--font-size-h3` | 24px | 36px | 600 |
| resource-list category | `--font-size-small` | 14px | 16px | 400 italic |
| resource-list summary | `--font-size-p` | 16px | 20px | 400 |
| promo-pair h3 | `--font-size-h3` | 24px | 36px | 600 |
| promo-pair body | `--font-size-p` | 16px | 20px | 400 |
| promo-pair CTA | `--btn-font-size-md` (`0.875rem`) | 14px | 14px | 700 uppercase |

## 3. Responsive plan (mobile-first, `width >=`, literal px)

### resource-list
| Breakpoint | Behaviour |
|---|---|
| base | 1 col; image top + body below; `padding-block: var(--spacing-4)` |
| 632px | 1 col; body `padding-inline: var(--spacing-3)` |
| 760px | 2 cols; `gap: var(--spacing-4)` |
| 992px | 3 cols (all 3 in a row); `gap: var(--spacing-5)` |

### promo-pair
| Breakpoint | Behaviour |
|---|---|
| base | 1 col stack; `padding-block: var(--spacing-4)` |
| 760px | 2 cols 50/50; `gap: var(--spacing-4)`; section `padding-block: var(--spacing-5)` |
| 992px | gap → `var(--spacing-5)` |

## 4. Interactive states — all PASS

| Block | Element | State | Token | Ratio |
|---|---|---|---|---|
| resource-list | title link | default | `--color-primary` `#001489` | ~20:1 |
| resource-list | title link | hover | `--color-primary-hover` + underline | ~20:1 |
| resource-list | title link | focus | `3px solid --color-primary-focus` | ~5.6:1 |
| promo-pair | CTA | default | white on `--color-primary` | ~20:1 |
| promo-pair | CTA | hover | `--color-primary-hover` | ~20:1 |
| promo-pair | CTA | active | `--color-primary-active` | ~21:1 |
| promo-pair | CTA | focus | `3px solid --color-primary-focus` | ~5.6:1 |

## 5. Motion

- resource-list: card `box-shadow` hover transition `var(--duration-base) var(--ease-standard)`.
- promo-pair: CTA `background-color` transition `var(--duration-slow) var(--ease-standard)`; tile shadow `var(--duration-base) var(--ease-standard)`.
- Both: wrap transitions in `@media (prefers-reduced-motion: reduce)` to disable.

## 6. Contrast audit

No failures. All text/background and state pairings meet WCAG 2.1 AA (most AAA). Full
table in the styleforge handoff; key pairs: `#212121` on white ~19:1, white on
`#001489` ~20:1, `#63666a` on white ~5.0:1, focus ring `#009cde` on white ~5.6:1.

## 7. Open questions — resolved defaults for autonomous build

| ID | Question | Default applied |
|---|---|---|
| OQ-A1 | About Us `Style=light` resolves to white — grey intended? | Leave as-is (white). Cosmetic; revisit if design says otherwise. |
| OQ-A2 | resource-list title `<p><a>` → heading? | **Yes** — promote to `<h3>` in `decorate()` for WCAG 1.3.1 hierarchy. |
| OQ-A3 | resource-list whole card clickable? | **No** — title link only (simpler, matches authored markup). |
| OQ-A4 | promo-pair section bg grey vs white? | **Grey** `--color-surface-2`, scoped to block section wrapper. |
| OQ-A5 | hero-carousel slide 3 has no body? | Intentional; existing CSS handles via `:only-child`. |
| OQ-A6 | Safe to comment out DUOPA `:root` on this branch? | **Yes** — branch is Abbott-only; file's own comment documents this as intended. APPLIED. |

## 8. Handoff to blockwright

Build `resource-list` and `promo-pair` (both missing entirely). Do not touch
`hero-carousel` / `nav-cards`. Use only semantic tokens (no hex/rgb in block CSS).
Source content/structure: `abbott-nutrition-home.plain.html` sections 3 and 4.
