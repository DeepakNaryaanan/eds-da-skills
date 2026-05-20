# Resource List

Displays a curated list of linked resources — articles, pages, or external references. Each row is one resource. The title link is the primary CTA; eyebrow, description, date, and thumbnail are optional supporting fields.

## Default

| Resource List           |                                                                 |
|-------------------------|-----------------------------------------------------------------|
| Image *(optional)*      | Body *(required)*                                               |
| `<picture>` thumbnail   | Linked heading (title), eyebrow / tag, description, date        |

Each row is one resource. The first cell is an optional thumbnail. The second cell holds all text for the item; decoration code identifies sub-fields by semantic formatting rather than cell position:

- **Bold text or heading containing a link** → resource title (the link itself is the CTA)
- *Italic* or `inline-code` short text → eyebrow / tag / category
- Plain paragraph → description
- A date string (`YYYY-MM-DD` or `Month DD, YYYY`) → publication date

The title link is the only required element. If the image cell is empty or omitted, the item renders text-only.

## Variations

### Compact

| Resource List (compact) |                                                                 |
|-------------------------|-----------------------------------------------------------------|
| Body *(required)*       |                                                                 |
| Linked heading (title), eyebrow / tag, description, date |                                          |

Text-only variant — no thumbnail cell. Each row is one resource. Useful when no image is available or a denser layout is preferred. Semantic formatting rules are identical to the default variant.
