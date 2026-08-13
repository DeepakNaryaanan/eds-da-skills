# Split Section

Two-column layout with a `<picture>` (or video) on one side and a body of text
on the other. Used for product feature explainers, clinical context sections,
and patient benefit storytelling.

## Default

| Split Section               |                                                                                          |
|-----------------------------|------------------------------------------------------------------------------------------|
| Media *(required)*          | Body *(required)*                                                                        |
| `<picture>` element — full column image | Eyebrow `<p>` *(optional, first paragraph before the heading)*, heading (`<h2>` or `<h3>`), body paragraphs, optional CTA link |

One row only. First cell is the media; second cell is the body content. Default
layout: image left, text right. Stacks to image-above-text on mobile.

## Variations

### Reverse

| Split Section (reverse)     |                                                                                          |
|-----------------------------|------------------------------------------------------------------------------------------|
| Media *(required)*          | Body *(required)*                                                                        |
| `<picture>` element         | Eyebrow *(optional)*, heading, body paragraphs, optional CTA link |

Image appears on the right, text on the left. DOM source order is unchanged —
CSS `flex-direction: row-reverse` achieves the visual swap.

### Wide Media

| Split Section (wide-media)  |                                                                                          |
|-----------------------------|------------------------------------------------------------------------------------------|
| Media *(required)*          | Body *(required)*                                                                        |
| `<picture>` element         | Eyebrow *(optional)*, heading, body paragraphs, optional CTA link |

60 % / 40 % column split (media wider than body). Image on left.

### Wide Media Reverse

| Split Section (wide-media reverse) |                                                                                   |
|------------------------------------|-----------------------------------------------------------------------------------|
| Media *(required)*                 | Body *(required)*                                                                 |
| `<picture>` element                | Eyebrow *(optional)*, heading, body paragraphs, optional CTA link |

60 % / 40 % column split. Image on right (CSS reversal; DOM order unchanged).
