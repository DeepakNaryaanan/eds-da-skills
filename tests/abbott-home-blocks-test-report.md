# Test Report — resource-list & promo-pair (blockwright phase)

Branch: `feat/abbott-nutrition-home`. Blocks built against the styleforge token
contract `user_story/abbott-home-token-map.md` and the authored content in
`abbott-nutrition-home.plain.html` (sections 3 and 4).

## Files created

### resource-list
- `blocks/resource-list/block.md`
- `blocks/resource-list/resource-list.js`
- `blocks/resource-list/resource-list.css`
- `blocks/resource-list/markup.js`
- `tests/resource-list-test.html` (draft page, full EDS head scaffolding)

### promo-pair
- `blocks/promo-pair/block.md`
- `blocks/promo-pair/promo-pair.js`
- `blocks/promo-pair/promo-pair.css`
- `blocks/promo-pair/markup.js`
- `tests/promo-pair-test.html` (draft page, full EDS head scaffolding)

## Lint

`npm run lint` (ESLint + Stylelint) — **clean, no errors**.

## Render verification (headless Chrome via Playwright `chrome` channel)

Both draft pages loaded through the EDS decoration pipeline on the local dev
server. Observed decorated DOM:

| Block | blockStatus | grid | items | `<h3>` | CTAs | images | notes |
|---|---|---|---|---|---|---|---|
| resource-list | loaded | 1 | 3 | 3 | 0 | 3 | title `<p><a>` promoted to `<h3>` ✓; title links resolve; responsive `<picture>` srcset emitted |
| promo-pair | loaded | 1 | 2 | 2 | 2 | 2 | navy CTA buttons rendered; optimized `<picture>` srcset emitted |

Title links confirmed for resource-list:
- "Preserving Muscle When Trying to Lose Weight"
- "How Much Water Should You Drink Per Day?"
- "Are You Getting It Wrong on Protein? Here's How to Get It Right"

## Contract adherence

- Semantic tokens only — no hex/rgb in block CSS (`--color-primary`,
  `--color-surface`, `--color-surface-2`, `--shadow-s/m`, `--font-size-*`,
  `--spacing-*`, `--duration-*`, `--ease-standard`).
- Focus rings `3px solid var(--color-primary-focus)` offset 2px on title links
  (resource-list) and CTA buttons (promo-pair).
- Mobile-first responsive, `width >=` literal-px breakpoints: resource-list
  1→2 (760px)→3 (992px); promo-pair 1→2 (760px).
- `prefers-reduced-motion: reduce` guards on all transitions.
- promo-pair grey section band applied via `.section:has(.promo-pair)`.

## Handoff to sentinel

Ready for formal code review (docs/blocks.md + WCAG 2.1/2.2 AA) and Playwright
spec authoring. Suggested spec coverage:
- resource-list: grid renders 3 items; each title is an `<h3>` containing a link
  with the expected href; category `<em>` present; summary present; image alt
  preserved; focus-visible outline on title link.
- promo-pair: grid renders 2 tiles; each tile has heading, body, and a
  `.promo-pair-cta` anchor with expected href; section band background present;
  CTA focus-visible outline.

Note: subagents in this environment are denied Write/Bash, so these files were
authored by the orchestrator following the blockwright contract. `hero-carousel`,
`nav-cards`, and `styles/config/overrides.css` were not modified beyond the
already-applied DUOPA-token fix.
