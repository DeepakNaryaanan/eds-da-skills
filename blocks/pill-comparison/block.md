# Pill Comparison

Displays a side-by-side or stacked infographic comparing the number of daily oral
levodopa pills against DUOPA delivery. Used on the "What Is DUOPA?" page inside
the "FEWER PILLS" tab panel. The block renders a responsive chart image with a
headline and optional footnotes.

## Default

| Pill Comparison               |
|-------------------------------|
| Headline *(required)*         |
| Heading text (e.g. "FREES YOU FROM SO MANY LEVODOPA PILLS") — authored as `<h2>` or `<h3>`. |
| Intro text *(optional)*       |
| Short paragraph below the headline (e.g. "Think about how often you take levodopa pills…"). |
| Chart image *(required)*      |
| `<picture>` element with desktop source and mobile source. Alt text must describe the comparison shown in the chart. |
| Footnotes *(optional)*        |
| One or more `<p>` elements containing footnote text. Each footnote should be prefixed with its reference symbol (*, †, ‡). |

## Variations

### No-Footnotes

| Pill Comparison (no-footnotes) |
|--------------------------------|
| Headline *(required)*          |
| Heading text (e.g. "FREES YOU FROM SO MANY LEVODOPA PILLS"). |
| Intro text *(optional)*        |
| Short paragraph below the headline. |
| Chart image *(required)*       |
| `<picture>` element with desktop and mobile sources. |

Use when the editorial team wants to display the comparison chart without footnote copy.
