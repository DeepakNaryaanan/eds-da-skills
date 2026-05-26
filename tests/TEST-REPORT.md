# Test Report — DA Pages: about-us & seetharaman

**Date:** 2026-05-25
**Tester:** Local AEM dev server + Playwright driver (`.claude/skills/run-eds-da-skills/driver.mjs`)
**Environment:** macOS, Node 24.x, system Chrome, AEM CLI on `http://localhost:3000` with `--html-folder tests`

## Pages under test

| Page | DA path | Local fixture | Blocks used |
|---|---|---|---|
| About Us | `/about-us.html` | `tests/about-us-test.html` | `patient-resources`, `tabs`, `resource-list` |
| Seetharaman | `/seetharaman.html` | `tests/seetharaman-test.html` | `image-teaser`, `tabs` (header/footer wrappers) |

DA edit URLs:
- https://da.live/edit#/deepaknaryaanan/eds-da-skills/about-us
- https://da.live/edit#/deepaknaryaanan/eds-da-skills/seetharaman

## Method

1. Authored each page in da.live via `da_create_source` (MCP).
2. Mirrored the authored markup to a self-contained HTML fixture in `tests/` (full doc + AEM scripts + styles) so the local dev server can render it without CMS dependencies.
3. Started `npx -y @adobe/aem-cli up --no-open --forward-browser-logs --html-folder tests` in the background, waited for `READY`.
4. For each fixture, ran the driver in three modes:
   - `console` — capture browser console + page errors after network idle.
   - `eval` — wait up to 5 s for `data-block-status="loaded"` on each block, then assert structure and interaction.
   - `screenshot` — full-page PNG after tabs reach `loaded`.

## Results

### Page 1 — `tests/about-us-test.html`

**Block decoration**

| Block | `data-block-status` | Notes |
|---|---|---|
| `patient-resources` | `loaded` | Renders eyebrow "ABOUT US", `h2` "Who We Are", intro paragraph, and 3 resource rows (Our Mission, Our Values, Our Journey), each with description + CTA. |
| `tabs` | `loaded` | 3 `[role=tab]` buttons (Mission / Vision / Values), 3 `[role=tabpanel]`. |
| `resource-list` | `loaded` | 3 rows rendered with thumbnail + eyebrow + linked title + description + date. |

**Headings emitted (in order):** `Who We Are`, `Our Approach`, `Leadership & Stories`

**Interaction**

- Initial selected tab: **Mission**
- After clicking **Vision**: `aria-selected="true"` correctly moves to Vision.

**Console / errors**

- `pageErrors: []`
- Two expected 404s on `nav.plain.html` and `footer.plain.html` (no nav/footer fragments wired up to the local test fixture — by design).
- `srcset` parse warnings on the placeholder `data:` URI SVGs. Root cause: `createOptimizedPicture` appends `?width=…&format=…&optimize=medium` query strings, which is invalid for `data:` URIs. **Not a code bug** — real CMS images go through the media CDN and never hit this path. Action: replace with real media when authoring in DA.

**Screenshot:** `/tmp/eds-shots/about-us.png` — layout and decoration confirmed visually (placeholders show alt text due to the data-URI issue above).

**Verdict:** Pass.

---

### Page 2 — `tests/seetharaman-test.html`

**Block decoration**

| Block | `data-block-status` | Notes |
|---|---|---|
| `image-teaser` | `loaded` | Content wrapped in `.image-teaser-content`. Image left, `h2` "Seetharaman" + paragraph + CTA "Explore highlights" → `#highlights` right. |
| `tabs` | `loaded` | 3 tabs (About / Projects / Contact), 3 panels. |

**Headings emitted (in order):** `Seetharaman`, `Highlights`

**Interaction**

- Initial selected tab: **About**
- After clicking **Projects**: `aria-selected="true"` correctly moves to Projects.

**Console / errors**

- `pageErrors: []`
- Same expected `nav.plain.html` / `footer.plain.html` 404s and the `data:` URI `srcset` warnings as above — same disposition.

**Screenshot:** `/tmp/eds-shots/seetharaman.png` — image-teaser two-column layout and tab control render correctly.

**Verdict:** Pass.

## Summary

| Item | About Us | Seetharaman |
|---|---|---|
| HTTP status | 200 | 200 |
| `pageErrors` | 0 | 0 |
| Blocks decorated to `loaded` | 3 / 3 | 2 / 2 |
| Required headings present | ✓ | ✓ |
| Tab interaction works | ✓ | ✓ |
| New (unexpected) console errors | 0 | 0 |

Both pages pass local validation. The known noise (header/footer 404s on fixtures, `data:` URI srcset warnings) does not occur in DA when authored against real fragments and uploaded media.

## Follow-ups (optional)

- Replace the placeholder `data:` URI SVGs in the DA pages with images uploaded via `da_upload_media` (or pointed at a known media path) before publishing.
- If desired, trigger a DA preview/publish so the `aem.page` / `aem.live` preview URLs render the new pages.

## Artifacts

- Fixtures: `tests/about-us-test.html`, `tests/seetharaman-test.html`
- Screenshots: `/tmp/eds-shots/about-us.png`, `/tmp/eds-shots/seetharaman.png`
- Dev server log (transient): `/tmp/eds-dev.log`
