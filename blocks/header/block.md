# Header

Renders the site-wide header: logo + primary navigation links + mobile
hamburger toggle. Content is loaded automatically from the `/nav` fragment
(or the URL specified in the `nav` metadata tag on the page).

The header block itself has no authored fields.

## Default

| Header                 |
|------------------------|
| *(no authored fields)* |

## /nav fragment content model

The `/nav` page must contain, in order:

1. A `<picture>` or `<img>` — used as the site logo (the first one found wins).
2. A `navigation` block — its rows become the primary nav links.

See `blocks/navigation/block.md` for the navigation block's authored fields.

## Rendered structure

```html
<div class="header-bar">
  <div class="header-inner">
    <a class="header-logo" href="/" aria-label="Go to home">…logo picture…</a>
    <button class="header-nav-toggle" aria-expanded="false" aria-controls="header-nav" aria-label="Open menu">
      <span class="header-nav-toggle-bar"></span>×3
    </button>
    <nav class="header-nav" id="header-nav" aria-label="Main navigation" hidden>
      <div class="navigation">
        <ul class="navigation-list" role="list">
          <li class="navigation-item"><a>…</a></li>
        </ul>
      </div>
    </nav>
  </div>
</div>
```

## CSS class reference

| Class | Element | Purpose |
|---|---|---|
| `.header-bar` | `<div>` | Fixed-position bar (top of viewport, full width). |
| `.header-inner` | `<div>` | Flex row with logo, toggle, and nav; centred at `max-width: 1280px`. |
| `.header-logo` | `<a>` | Logo anchor wrapping the `<picture>`/`<img>` from the fragment. |
| `.header-nav-toggle` | `<button>` | Mobile hamburger (visible below `760px`). `aria-expanded` and `aria-label` track open/closed state; toggles `is-open` class for icon animation. |
| `.header-nav-toggle-bar` | `<span>` | One of three bars that morph into an X when open. |
| `.header-nav` | `<nav>` | Primary nav region. Below `760px` it is a drawer below the bar; at `≥ 760px` it sits inline. |

## Breakpoint partials

| File | Breakpoint | Contains |
|---|---|---|
| `default.css` | all (mobile-first base) | header bar, logo, hamburger, mobile drawer styling |
| `md.css` | `≥ 760px` | desktop layout — hamburger hidden, nav inline, taller bar |
| `sm.css` / `lg.css` / `xl.css` / `xxl.css` | — | reserved |

## Testing

| File | Purpose |
|---|---|
| `header.spec.js` | Playwright e2e — bar, logo, hamburger toggle, mobile drawer show/hide |

Draft page: `tests/header-test.html` uses `<meta name="nav" content="/tests/fragments/nav">` to point at the local nav fixture.
