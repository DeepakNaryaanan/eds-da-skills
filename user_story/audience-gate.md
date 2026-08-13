# Audience Gate — User Story

## User Story

As a regulatory/medical-affairs stakeholder, I want HCP-only content pages to
require a visitor to confirm they are a US healthcare professional before the
content is shown, so that the site complies with pharma promotional guidelines
that restrict certain clinical data to HCP audiences.

As a healthcare professional, I want the confirmation prompt to be clear and
quick — a single click — and to be remembered for my current session so that
I am not asked again every time I visit an HCP page.

---

## Acceptance Criteria

### Markup

- AC-01: The block renders a modal `<dialog>` element with `role="dialog"`,
  `aria-modal="true"`, and `aria-labelledby` pointing to the modal heading `id`.
- AC-02: Inside the dialog: an `<h2>` heading ("Are you a US Healthcare
  Professional?"), a brief explanatory paragraph, a "Yes, I am an HCP" confirm
  button, and a "No, take me back" cancel link.
- AC-03: The page behind the modal must be inert (`<main inert>` or equivalent)
  while the dialog is open.
- AC-04: On confirm, the dialog is closed and a `sessionStorage` key
  `hcp-confirmed` is set to `"true"`.
- AC-05: On subsequent page loads within the same session where
  `sessionStorage.getItem('hcp-confirmed') === 'true'`, the dialog is not shown.
- AC-06: The cancel action navigates the user to the previous page
  (`history.back()`) or to the home page `/` if there is no previous entry.

### Styling

- AC-07: The dialog uses a `::backdrop` CSS pseudo-element with a semi-transparent
  dark overlay (`rgba` or equivalent using `--color-neutral-900` with opacity).
- AC-08: The dialog box is centred horizontally and vertically, with
  `max-width: 480 px` and `border-radius: var(--border-radius-l)`.
- AC-09: The confirm button uses `.btn.btn--primary` styling.
- AC-10: The cancel link is a plain text link, not a button.
- AC-11: On mobile (< 632 px) the dialog spans `calc(100 % - 2 * var(--spacing-3))`
  width and is positioned near the top of the viewport.

### Behaviour

- AC-12: The `<dialog>` is opened programmatically via `.showModal()` on page load
  if `hcp-confirmed` is not set.
- AC-13: Clicking the confirm button calls `.close()` on the dialog, sets
  `sessionStorage`, and removes the `inert` attribute from `<main>`.
- AC-14: The `Escape` key closes the dialog via the native `<dialog>` cancel event
  but is treated as a "No" (cancel action) — navigation to home page occurs.
- AC-15: Focus is trapped inside the dialog while it is open (confirm button
  receives initial focus).
- AC-16: The block is a configuration block — `readBlockConfig` is used to extract
  an optional custom heading and body text from the authored rows.

### Accessibility

- AC-17: WCAG 2.4.3: focus order inside the open dialog is logical (heading, body,
  confirm button, cancel link).
- AC-18: WCAG 1.4.3: all dialog text meets 4.5:1 contrast.
- AC-19: WCAG 4.1.2: the native `<dialog>` element provides the required ARIA
  semantics automatically in supporting browsers; no manual `role="dialog"` is
  needed beyond the element itself. Use `aria-modal="true"` for browsers that do
  not fully support the native dialog.
- AC-20: WCAG 2.1.2 (No Keyboard Trap exception): focus is intentionally trapped
  inside the open dialog per the ARIA Authoring Practices Guide modal dialog pattern;
  Escape provides an exit.

### Performance

- AC-21: The block JS is minimal — no external library for modal/dialog. The native
  `<dialog>` element is used.
- AC-22: The block CSS is loaded lazily (not in `styles.css`).

---

## Test Cases

| ID | Title | Preconditions | Steps | Expected Result | Traces To |
|---|---|---|---|---|---|
| TC-01 | Dialog shows on first visit | No `hcp-confirmed` in sessionStorage | Load HCP page | Modal dialog visible; page content behind is inert | AC-01, AC-03, AC-12 |
| TC-02 | Dialog does not show on return visit | `sessionStorage` has `hcp-confirmed = "true"` | Load HCP page | No modal; page content visible immediately | AC-05 |
| TC-03 | Confirm sets sessionStorage | Dialog open | Click "Yes, I am an HCP" | `sessionStorage.getItem('hcp-confirmed') === 'true'`; dialog closed | AC-04, AC-13 |
| TC-04 | Cancel navigates away | Dialog open; direct URL visit (no previous history) | Click "No, take me back" | Browser navigates to `/` | AC-06 |
| TC-05 | Cancel goes back in history | Dialog open; navigated from another page | Click "No" | `history.back()` triggered | AC-06 |
| TC-06 | Escape key triggers cancel action | Dialog open | Press Escape | Dialog closes; navigate back/home | AC-14 |
| TC-07 | Focus trapped in dialog | Dialog open | Tab repeatedly | Focus cycles between confirm and cancel only | AC-15 |
| TC-08 | Initial focus on confirm button | Dialog opens | Inspect focused element | Confirm button has focus | AC-15 |
| TC-09 | main element inert while open | Dialog open | Inspect `<main>` | `inert` attribute present on `<main>` | AC-03 |
| TC-10 | main inert removed after confirm | Confirm clicked | Inspect `<main>` | `inert` attribute absent | AC-13 |
| TC-11 | Custom heading from config | Block with custom heading authored | Load page | Dialog heading matches authored text | AC-16 |
| TC-12 | Dialog contrast passes | Rendered dialog | a11y check | All text >= 4.5:1 | AC-18 |
| TC-13 | Mobile dialog width | 375 px viewport | Load page | Dialog width = viewport - 2 * spacing-3 | AC-11 |
| TC-14 | No dialog rendered when no HCP metadata | Page without audience-gate block | Load page | No `<dialog>` element in DOM | AC-12 |

---

## Variant Inventory

| Variant | Block Name Syntax | Description |
|---|---|---|
| Default | `Audience Gate` | Standard HCP confirmation modal with default heading and body |
| Custom | `Audience Gate (custom)` | Allows author to supply custom heading and body text via config rows |

---

## Open Questions

- OQ-01: Should `sessionStorage` be used (per-tab, per-session) or `localStorage`
  (persists across sessions)? Regulatory guidance typically prefers per-session;
  confirm with medical affairs.
- OQ-02: Is the gate needed for the entire HCP section or only specific pages?
  If section-wide, a middleware/redirect approach may be more appropriate than a
  block-level solution.
- OQ-03: Should the "No" action link to a specific patient-facing page rather than
  the home page? Confirm the redirect target URL.
- OQ-04: Does the dialog need a logo/brand lockup inside it, or is the heading
  sufficient?
