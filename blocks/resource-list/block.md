# Resource List

Responsive grid of article/resource cards. Each card shows a thumbnail image, a linked title, an optional category label, and a short summary. Typically used to surface "Latest News", featured articles, or related resources. Authored under a section heading (e.g. an `<h2>` "Latest News") placed above the block.

## Default

| Resource List                  |                                                                          |
|--------------------------------|--------------------------------------------------------------------------|
| Image *(optional)*             | Body *(required)*                                                        |
| `<picture>` thumbnail (≈16:7)  | Title link (`<a>`), category paragraph (`<em>`, *optional*), summary paragraph |

Each row is one card. The first cell is an optional thumbnail image; the second cell holds the title link, an optional category (wrapped in `<em>`), and a summary paragraph.

The authored title link (`<p><a>`) is promoted to an `<h3>` during decoration so the section maintains a correct heading hierarchy. Only the title is a link — the card itself is not clickable.
