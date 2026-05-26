import { loadFragment } from '../fragment/fragment.js';
import { fetchFragmentHtml } from '../../scripts/config/fragment-loader.js';

/**
 * Loads and decorates the footer. Fetches the `/footer` fragment and splits its
 * default-content stream on the first `<hr>`: everything before the rule becomes
 * the link-columns region (`.footer-columns`); everything after becomes the
 * legal bar (`.footer-legal`). If no rule is present, all content goes into
 * `.footer-columns`.
 *
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragmentHtml = await fetchFragmentHtml(loadFragment, 'footer', '/footer');
  if (!fragmentHtml) return;

  const temp = document.createElement('div');
  temp.innerHTML = fragmentHtml;

  const inner = document.createElement('div');
  inner.className = 'footer-inner';
  const columns = document.createElement('div');
  columns.className = 'footer-columns';
  const legal = document.createElement('div');
  legal.className = 'footer-legal';

  const hr = temp.querySelector('hr');
  // Walk the flat list of authored nodes. When an <hr> is present its parent is
  // the default-content-wrapper that holds all the footer content; iterate that.
  // Without an <hr> we still need to skip the <main>/<section> wrappers emitted
  // by loadFragment/decorateMain.
  const source = hr
    ? hr.parentElement
    : temp.querySelector('main .section .default-content-wrapper')
      || temp.querySelector('main .section')
      || temp.querySelector('main')
      || temp;

  let target = columns;
  let currentColumn = null;
  [...source.childNodes].forEach((node) => {
    if (node === hr) {
      target = legal;
      currentColumn = null;
      return;
    }
    if (target === columns && node.nodeType === 1 && /^H[1-6]$/.test(node.tagName)) {
      // Start a new column wrapper at each heading so the H3 + following UL stay together.
      currentColumn = document.createElement('div');
      currentColumn.className = 'footer-column';
      columns.append(currentColumn);
      currentColumn.append(node);
      return;
    }
    if (target === columns && currentColumn) {
      currentColumn.append(node);
      return;
    }
    target.append(node);
  });

  inner.append(columns, legal);
  block.replaceChildren(inner);
}
