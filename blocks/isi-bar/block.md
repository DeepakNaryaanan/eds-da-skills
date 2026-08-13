# ISI Bar

Renders a sticky, collapsible Important Safety Information bar fixed to the bottom
of the viewport. The collapsed state shows a one-line summary; the expanded state
reveals full ISI text loaded from the `/fragments/isi` CMS fragment.

Required on every patient-facing page for regulatory compliance.

## Default

| ISI Bar                          |
|----------------------------------|
| Summary text *(required)*        |
| Short one-line ISI summary shown in the collapsed bar (e.g. "DUOPA has important safety information. See below."). This line is always visible. |
| Fragment path *(optional)*       |
| Path to the ISI fragment page (defaults to `/fragments/isi` if omitted). Provide only when a page needs a non-standard ISI fragment. |

The block uses `fetchFragmentHtml` from `scripts/config/fragment-loader.js` to
load the fragment. If the fragment fetch fails, the summary line remains visible
with a fallback link to the full Prescribing Information.

## Variations

### Inline

| ISI Bar (inline)                 |
|----------------------------------|
| Summary text *(required)*        |
| Short one-line ISI summary.      |
| Fragment path *(optional)*       |
| Path to the ISI fragment (defaults to `/fragments/isi`). |

Non-sticky version. Renders the ISI content inline at the block's position in
the page flow rather than as a fixed overlay. Use on pages where a separate
sticky ISI bar would duplicate the global ISI bar.
