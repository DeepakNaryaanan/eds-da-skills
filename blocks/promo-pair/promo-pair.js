/**
 * Promo Pair block.
 *
 * Renders two side-by-side promotional tiles, each with a cover image, a
 * heading, body copy, and a CTA button. Used to highlight a pair of related
 * destinations (e.g. two product categories) on a light-grey section band.
 *
 * Content model (see block.md):
 *   Each row — two cells: image picture | body (heading, description, CTA link)
 */

import { createOptimizedPicture } from '../../scripts/aem.js';
import { MARKUP, TILE_MARKUP } from './markup.js';

/**
 * Builds the HTML string for a single promo tile from its authored row.
 *
 * @param {Element} row The authored row element
 * @returns {string} Interpolated TILE_MARKUP HTML string, or empty string when
 *   the row has no body cell
 */
function buildTileHtml(row) {
  const [imageCell, bodyCell] = row.children;

  // Body cell is required
  if (!bodyCell) return '';

  // Heading: first heading element in the body cell
  const headingEl = bodyCell.querySelector('h1,h2,h3,h4,h5,h6');
  const headingHtml = headingEl ? headingEl.outerHTML : '';

  // CTA: first link in the body cell
  const linkEl = bodyCell.querySelector('a');
  const ctaHtml = linkEl
    ? `<a class="promo-pair-cta" href="${linkEl.href || '#'}">${linkEl.textContent.trim()}</a>`
    : '';

  // Description: first paragraph that is not the CTA
  const descEl = [...bodyCell.querySelectorAll('p')].find(
    (p) => !p.querySelector('a') && p.textContent.trim(),
  );
  const description = descEl ? descEl.textContent.trim() : '';

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
        : createOptimizedPicture(img.src, img.alt ?? '', false, [{ width: '676' }]);
      if (pictureEl) {
        imageHtml = `<div class="promo-pair-image">${pictureEl.outerHTML}</div>`;
      }
    } else if (imageCell.innerHTML.trim()) {
      imageHtml = `<div class="promo-pair-image">${imageCell.innerHTML}</div>`;
    }
  }

  return TILE_MARKUP
    .replace('{image}', imageHtml)
    .replace('{heading}', headingHtml)
    .replace('{description}', description)
    .replace('{cta}', ctaHtml);
}

/**
 * Loads and decorates the promo-pair block.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const tilesHtml = rows.map(buildTileHtml).join('');

  block.innerHTML = MARKUP.replace('{tiles}', tilesHtml);
}
