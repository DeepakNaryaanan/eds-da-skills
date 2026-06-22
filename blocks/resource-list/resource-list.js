/**
 * Resource List block.
 *
 * Renders a responsive grid of article/resource cards. Each authored row
 * becomes one card with a thumbnail image, a linked title, an optional
 * category label, and a short summary. The authored title link (`<p><a>`) is
 * promoted to an `<h3>` so the section keeps a correct heading hierarchy.
 *
 * Content model (see block.md):
 *   Each row — two cells: image picture | body (title link, category, summary)
 */

import { createOptimizedPicture } from '../../scripts/aem.js';
import { MARKUP, CARD_MARKUP } from './markup.js';

/**
 * Builds the HTML string for a single resource card from its authored row.
 *
 * @param {Element} row The authored row element
 * @returns {string} Interpolated CARD_MARKUP HTML string, or empty string when
 *   the row has no body cell or no title link
 */
function buildCardHtml(row) {
  const [imageCell, bodyCell] = row.children;

  // Body cell with a title link is required
  if (!bodyCell) return '';

  const linkEl = bodyCell.querySelector('a');
  if (!linkEl) return '';

  const href = linkEl.href || '#';
  const titleText = linkEl.textContent.trim();

  // Category: first paragraph containing <em>
  const categoryEl = bodyCell.querySelector('p em');
  const categoryHtml = categoryEl
    ? `<p class="resource-list-category"><em>${categoryEl.textContent.trim()}</em></p>`
    : '';

  // Summary: first paragraph with no link and no emphasis
  const summaryEl = [...bodyCell.querySelectorAll('p')].find(
    (p) => !p.querySelector('a') && !p.querySelector('em') && p.textContent.trim(),
  );
  const summary = summaryEl ? summaryEl.textContent.trim() : '';

  // Image: optimized picture or raw HTML from the image cell.
  // Data URI placeholders are passed through as-is; createOptimizedPicture
  // cannot build valid srcset URLs from a data URI (no server path).
  let imageHtml = '';
  if (imageCell) {
    const img = imageCell.querySelector('picture > img');
    if (img) {
      const isDataUri = img.src.startsWith('data:');
      const pictureEl = isDataUri
        ? imageCell.querySelector('picture')
        : createOptimizedPicture(img.src, img.alt ?? '', false, [
          { media: '(min-width: 760px)', width: '750' },
          { width: '1410' },
        ]);
      if (pictureEl) {
        imageHtml = `<div class="resource-list-image">${pictureEl.outerHTML}</div>`;
      }
    } else if (imageCell.innerHTML.trim()) {
      imageHtml = `<div class="resource-list-image">${imageCell.innerHTML}</div>`;
    }
  }

  return CARD_MARKUP
    .replace('{image}', imageHtml)
    .replace('{href}', href)
    .replace('{titleText}', titleText)
    .replace('{category}', categoryHtml)
    .replace('{summary}', summary);
}

/**
 * Loads and decorates the resource-list block.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const cardsHtml = rows.map(buildCardHtml).join('');

  block.innerHTML = MARKUP.replace('{cards}', cardsHtml);
}
