# Navigation

Renders a horizontal list of navigation links. Each authored row contributes one
link. The block is consumed by the `header` block (loaded inside the `/nav`
fragment) and can also be used standalone on any page.

## Default

| Navigation               |
|--------------------------|
| Link *(required)*        |
| One anchor per row — the link text is the visible label, the anchor `href` is the destination. |

## Output

```html
<ul class="navigation-list" role="list">
  <li class="navigation-item"><a href="...">Label</a></li>
  ...
</ul>
```

## CSS classes

| Class | Element | Purpose |
|---|---|---|
| `.navigation-list` | `<ul>` | Horizontal list of links (flex, wraps on narrow viewports). |
| `.navigation-item` | `<li>` | One nav item — holds the anchor. |
