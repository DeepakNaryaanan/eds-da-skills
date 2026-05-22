/**
 * Patient Resources block.
 *
 * Two-column layout block that pairs an eyebrow label, section heading, and
 * supporting image (left column at desktop) with an introductory paragraph
 * and an arbitrary number of resource items (right column at desktop).
 *
 * Content model (see block.md):
 *   Row 1 — two cells: left header content | intro paragraph
 *   Rows 2…N — one cell each: resource item (heading, optional description, CTA link)
 */

import { createOptimizedPicture } from '../../scripts/aem.js';
import { MARKUP, ITEM_MARKUP } from './markup.js';

/**
 * Extracts the eyebrow text from the left header cell.
 *
 * The eyebrow is the first `<p>` that precedes the section heading in the
 * authored left cell. If no paragraph precedes the heading (or there is no
 * heading at all), returns an empty string.
 *
 * @param {Element} leftCell The left cell of the header row
 * @returns {string} HTML string for the eyebrow `<span>`, or empty string
 */
function extractEyebrow(leftCell) {
  const heading = leftCell.querySelector('h1,h2,h3,h4,h5,h6');
  const paragraphs = [...leftCell.querySelectorAll('p')];

  const eyebrowPara = paragraphs.find((p) => {
    if (!heading) return true;
    // eslint-disable-next-line no-bitwise
    return !!(heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_PRECEDING);
  });

  if (!eyebrowPara) return '';

  const span = document.createElement('span');
  span.className = 'patient-resources-eyebrow';
  span.textContent = eyebrowPara.textContent.trim();
  return span.outerHTML;
}

/**
 * Builds the HTML string for a single resource item from its authored cell.
 *
 * Expected cell content (in order):
 *   - A heading element (`<h2>`–`<h6>`) [required]
 *   - A description paragraph (`<p>`)   [optional]
 *   - An anchor link (`<a>`)            [required — CTA]
 *
 * Items that are missing a heading or a link are silently skipped.
 *
 * @param {Element} cell The single authored cell for this resource row
 * @returns {string} Interpolated ITEM_MARKUP HTML string, or empty string if
 *   the required heading or link is missing
 */
function buildItemHtml(cell) {
  const headingEl = cell.querySelector('h2,h3,h4,h5,h6');
  const linkEl = cell.querySelector('a');

  if (!headingEl || !linkEl) return '';

  const descEl = cell.querySelector('p');
  const description = descEl
    ? `<p class="patient-resources-item-desc">${descEl.innerHTML}</p>`
    : '';

  return ITEM_MARKUP
    .replace('{heading}', headingEl.outerHTML)
    .replace('{description}', description)
    .replace('{href}', linkEl.href)
    .replace('{ctaText}', linkEl.textContent.trim().toUpperCase());
}

/**
 * Loads and decorates the patient-resources block.
 *
 * Reads the authored block rows:
 *   - Row 0: header row — two cells (left: eyebrow + heading + image; right: intro paragraph)
 *   - Rows 1…N: resource item rows — one cell each
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const rows = [...block.children];

  if (!rows.length) return;

  // ── Header row ────────────────────────────────────────────────────────────
  const headerRow = rows[0];
  const [leftCell, rightCell] = headerRow.children;

  // Eyebrow label
  const eyebrow = leftCell ? extractEyebrow(leftCell) : '';

  // Section heading
  const headingEl = leftCell ? leftCell.querySelector('h1,h2,h3,h4,h5,h6') : null;
  const heading = headingEl ? headingEl.outerHTML : '';

  // Supporting image — optimized eagerly as it is typically above the fold
  const pictureEl = leftCell ? leftCell.querySelector('picture') : null;
  let image = '';

  if (pictureEl) {
    const img = pictureEl.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt, true, [
        { media: '(width >= 992px)', width: '600' },
        { width: '375' },
      ]);
      image = optimized.outerHTML;
    }
  }

  // Intro paragraph (first <p> in the right cell)
  const introPara = rightCell ? rightCell.querySelector('p') : null;
  const intro = introPara ? introPara.outerHTML : '';

  // ── Resource rows (rows 1…N) ──────────────────────────────────────────────
  const resourceRows = rows.slice(1);
  const itemsHtml = resourceRows
    .map((row) => {
      const [cell] = row.children;
      return cell ? buildItemHtml(cell) : '';
    })
    .join('');

  // ── Assemble and replace block content ───────────────────────────────────
  block.innerHTML = MARKUP
    .replace('{eyebrow}', eyebrow)
    .replace('{heading}', heading)
    .replace('{image}', image)
    .replace('{intro}', intro)
    .replace('{items}', itemsHtml);
}
