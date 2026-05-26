# Footer

Renders the site-wide footer: multi-column link groups + a legal bar. Content
is loaded automatically from the `/footer` fragment (or the URL specified in
the `footer` metadata tag on the page).

The footer block itself has no authored fields.

## Default

| Footer                 |
|------------------------|
| *(no authored fields)* |

## /footer fragment content model

Author the `/footer` page as default content using this convention:

1. **Link columns** — each column is a heading (`<h3>` or `<h4>`) followed by a
   `<ul>` of links. Repeat for as many columns as you need.
2. **Horizontal rule** (`<hr>` / `---`) — separates the link area from the legal
   bar.
3. **Legal bar** — short copyright `<p>` and / or a `<ul>` of small print links
   (Privacy, Terms, Cookies, …).

If no `<hr>` is present, everything is treated as columns and the legal bar
will be empty.

### Example

```
### Company
- About us
- Careers
- Newsroom
- Contact

### Patients
- Patient support
- Find a medicine
- Clinical trials
- Patient assistance

---

© 2026 AbbVie. All rights reserved.

- Privacy Notice
- Terms of Use
- Cookie Notice
- Site Map
```

## Rendered structure

```html
<div class="footer-inner">
  <div class="footer-columns">
    <h3>…</h3><ul>…</ul>
    <h3>…</h3><ul>…</ul>
    …
  </div>
  <div class="footer-legal">
    <p>© …</p>
    <ul>…legal links…</ul>
  </div>
</div>
```

## CSS class reference

| Class | Element | Purpose |
|---|---|---|
| `.footer-inner` | `<div>` | Centred container (`max-width: 1280px`). |
| `.footer-columns` | `<div>` | CSS Grid: 1 column on mobile, 2 at `≥ 760px`, 4 at `≥ 992px`. Each `<h3>` + `<ul>` pair flows naturally into a column. |
| `.footer-legal` | `<div>` | Bottom row with copyright `<p>` and small-print `<ul>`. Stacks on mobile, justified row at `≥ 760px`. |

## Breakpoint partials

| File | Breakpoint | Contains |
|---|---|---|
| `default.css` | all (mobile-first base) | colors, spacing, single-column columns layout, mobile legal stack |
| `md.css` | `≥ 760px` | 2-column grid, legal row in-line |
| `lg.css` | `≥ 992px` | 4-column grid |
| `sm.css` / `xl.css` / `xxl.css` | — | reserved |

## Testing

| File | Purpose |
|---|---|
| `footer.spec.js` | Playwright e2e — footer present, link columns visible, legal bar rendered when `<hr>` is authored. |

Draft page: `tests/footer-test.html` uses `<meta name="footer" content="/tests/fragments/footer">` to point at the local footer fixture.
