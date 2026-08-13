# What Is DUOPA? — User Story

## User Story

As a patient or caregiver visiting the DUOPA website,
I want to understand how DUOPA works, why it is different from oral levodopa pills,
and what clinical benefits it offers,
so that I can have an informed conversation with my healthcare provider about whether DUOPA
is right for me.

---

## Acceptance Criteria

### Markup
- AC-01: Persistent sticky ISI bar (`isi-bar` block) is present on page load.
- AC-02: Hero area contains a `tabs` block with exactly two tabs — "MORE TIME" (default active) and "FEWER PILLS".
- AC-03: "MORE TIME" tab panel renders a `split-section` block with the headline "DUOPA IS DIFFERENT", a description of 16-hour continuous delivery, and a responsive image.
- AC-04: "FEWER PILLS" tab panel renders a `pill-comparison` block with the headline "FREES YOU FROM SO MANY LEVODOPA PILLS", a responsive comparison chart image, and supporting footnotes.
- AC-05: A `stat-bar` block below the hero surfaces key clinical trial statistics.
- AC-06: A `promo-banner` block links to `/carrying-case` with label "CARRYING CASE STYLES".
- AC-07: An inline ISI section renders structured safety information (using `isi-bar (inline)` variant or default content).
- AC-08: All images have meaningful `alt` text; responsive images use desktop/mobile `<picture>` sources.
- AC-09: Heading hierarchy: one `<h1>`, `<h2>` for section headings, `<h3>` for sub-headings; no skipped levels.
- AC-10: Exit-link modal fires for any external link.
- AC-11: HCP audience gate modal fires from the "For Healthcare Professionals" nav link.

### Styling
- AC-12: All colors use semantic design tokens; no hardcoded hex/RGB in block CSS.
- AC-13: Tab active state ≥ 3:1 contrast (WCAG 1.4.11).
- AC-14: Body text ≥ 4.5:1 contrast (WCAG 1.4.3).
- AC-15: Mobile-first CSS; `min-width` media queries only.
- AC-16: `split-section` stacks on mobile (< 632 px), side-by-side on desktop (≥ 992 px).
- AC-17: `pill-comparison` chart swaps mobile/desktop image sources via `<picture>`.

### Behaviour
- AC-18: Clicking "FEWER PILLS" tab shows its panel; hides "MORE TIME" panel; updates `aria-selected`.
- AC-19: "CARRYING CASE STYLES" CTA navigates to `/carrying-case`.
- AC-20: Clicking an external link opens the "LEAVING DUOPA.COM" confirmation modal.
- AC-21: Sticky ISI bar is collapsed by default; expand/collapse toggles full ISI text.

### Accessibility (WCAG 2.1/2.2 AA)
- AC-22: Tabs use `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`.
- AC-23: All interactive controls are keyboard-accessible (Tab, Enter/Space, Escape).
- AC-24: Modals trap focus; focus returns to trigger on close; use `<dialog>` or `role="dialog"` with `aria-labelledby`.
- AC-25: ISI bar expand button has `aria-expanded` reflecting current state.
- AC-26: Footnote references use `<sup><a href="#fn-N">*</a></sup>` linked to `<li id="fn-N">`.
- AC-27: Decorative images have `alt=""`; clinical chart images have descriptive `alt`.

### Performance
- AC-28: Hero/first-tab images use `createOptimizedPicture` with eager loading.
- AC-29: `pill-comparison` chart loads lazily (below the fold).
- AC-30: reCAPTCHA (share modal) loads only in `delayed.js`.

---

## Test Cases

| ID | Title | Preconditions | Steps | Expected Result | Traces To |
|---|---|---|---|---|---|
| TC-01 | Default tab "MORE TIME" active on load | Page loaded | Navigate to `/what-is-duopa`; inspect tabs | "MORE TIME" tab has `aria-selected="true"`; its panel is visible | AC-18, AC-22 |
| TC-02 | Switching to "FEWER PILLS" tab | "MORE TIME" active | Click "FEWER PILLS" tab | "FEWER PILLS" panel visible; comparison chart renders; `aria-selected` updated | AC-18, AC-22 |
| TC-03 | Keyboard tab switching | Page loaded | Tab to "MORE TIME" button; press Arrow Right | Focus moves to "FEWER PILLS"; Enter activates panel | AC-23 |
| TC-04 | ISI bar collapsed on load | Page loaded | Observe bottom of viewport | ISI bar visible, collapsed, one-line summary shown; `aria-expanded="false"` | AC-21, AC-25 |
| TC-05 | ISI bar expands on click | ISI collapsed | Click expand button | Full ISI text visible; `aria-expanded="true"` | AC-21, AC-25 |
| TC-06 | ISI bar collapses on second click | ISI expanded | Click expand button again | Full ISI text hidden; `aria-expanded="false"` | AC-21, AC-25 |
| TC-07 | Exit link modal fires | Page loaded | Click any external link | "LEAVING DUOPA.COM" modal appears; focus trapped | AC-20, AC-24 |
| TC-08 | Exit modal "No" keeps visitor | Modal open | Click "No" | Modal closes; visitor stays on page; focus returns to trigger | AC-20, AC-24 |
| TC-09 | Exit modal "Yes" navigates away | Modal open | Click "Yes" | Browser navigates to external URL | AC-20 |
| TC-10 | HCP audience gate modal | Page loaded | Click "For Healthcare Professionals" nav link | "HEALTHCARE PROFESSIONALS ONLY" modal appears; focus trapped | AC-11, AC-24 |
| TC-11 | Split-section stacks on mobile | Viewport 375 px | Load page; inspect split-section | Single-column layout (image above text) | AC-16 |
| TC-12 | Split-section side-by-side on desktop | Viewport 1024 px | Load page; inspect split-section | Two-column layout | AC-16 |
| TC-13 | Pill comparison uses mobile image | Viewport 375 px, "FEWER PILLS" tab active | Inspect chart `<picture>` | Mobile image source loaded | AC-17 |
| TC-14 | Pill comparison uses desktop image | Viewport 1024 px, "FEWER PILLS" tab active | Inspect chart `<picture>` | Desktop image source loaded | AC-17 |
| TC-15 | Stat bar renders all stats | Page loaded | Scroll to stat bar | All stat rows render with icon, value, and label | AC-05 |
| TC-16 | Promo banner CTA navigates to carrying cases | Page loaded | Click "CARRYING CASE STYLES" CTA | Navigates to `/carrying-case` | AC-06, AC-19 |
| TC-17 | Heading hierarchy correct | Page loaded | Inspect DOM headings | One `<h1>`; `<h2>` for sections; `<h3>` for sub-sections; no skipped levels | AC-09 |
| TC-18 | Decorative images have empty alt | Page loaded | Inspect decorative `<img>` elements | `alt=""` present | AC-27 |
| TC-19 | Clinical chart images have descriptive alt | "FEWER PILLS" tab active | Inspect comparison chart `<img>` | `alt` attribute has meaningful description | AC-27 |
| TC-20 | Body text contrast meets WCAG 1.4.3 | Page loaded | Run contrast check on body text | ≥ 4.5:1 contrast ratio | AC-14 |
| TC-21 | Tab active state contrast meets WCAG 1.4.11 | Page loaded | Inspect active tab button fill vs. page bg | ≥ 3:1 contrast ratio | AC-13 |
| TC-22 | Focus ring on tab buttons | Keyboard focus on tab button | Observe focus indicator | Visible 3 px solid outline ≥ 3:1 against bg | AC-23 |
| TC-23 | Focus ring on ISI expand button | Keyboard focus on ISI bar button | Observe focus indicator | Visible 3 px solid outline | AC-23 |
| TC-24 | Empty tabs block does not throw | Draft page: `tabs` block with zero rows | Load draft page | No JS error; block renders empty valid HTML | AC-18 (graceful degradation) |
| TC-25 | Pill-comparison block with no footnotes row | `pill-comparison` block without optional footnotes row | Load draft page | No JS error; chart renders; no footnotes section | AC-04 (graceful degradation) |
| TC-26 | ISI fragment 404 fallback | ISI fragment path returns 404 | Load page | ISI bar summary line visible; fallback link to Prescribing Information PDF shown | AC-07 |

---

## Variant Inventory

| Block (Variant) | Role on Page | Status |
|---|---|---|
| `Tabs` | "MORE TIME" / "FEWER PILLS" messaging toggle | Existing block |
| `Split Section` | "DUOPA IS DIFFERENT" — image left, text right | Existing block |
| `Split Section (reverse)` | Optional reversed split if a second explainer is authored | Existing block variant |
| `Stat Bar` | Clinical trial key metrics strip | Existing block |
| `Stat Bar (animated)` | Animated counter version | Existing block variant |
| `Promo Banner` | "CARRYING CASE STYLES" full-width CTA | Existing block |
| `ISI Bar` | Sticky safety information bar (regulatory) | Existing block |
| `ISI Bar (inline)` | Mid-page inline ISI section | Existing block variant |
| `Audience Gate (custom)` | "HEALTHCARE PROFESSIONALS ONLY" modal | Existing block variant |
| `Pill Comparison` | Comparison chart: daily pills vs. DUOPA, with headline, chart image, and footnotes | Net-new block |
| `Pill Comparison (no-footnotes)` | Same chart without the footnotes row | Net-new block variant |
