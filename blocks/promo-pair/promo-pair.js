/**
 * Promo Pair block.
 *
 * Renders a two-column promotional card pair. Each authored row becomes one
 * promo card containing an image, heading, description, and optional CTA link.
 *
 * Content model (see block.md):
 *   Each row — two cells: image `<picture>` (optional) | body (heading, description, CTA link)
 */

import { createOptimizedPicture } from '../../scripts/aem.js';
import { MARKUP, CARD_MARKUP } from './markup.js';

/**
 * Builds the HTML string for a single promo card from its authored row.
 *
 * @param {Element} row The authored row element
 * @returns {string} Interpolated CARD_MARKUP HTML string
 */
function buildCardHtml(row) {
  const [imageCell, bodyCell] = row.children;

  // Image — lazy loaded (below the fold).
  // Data URI placeholder images are passed through as-is; createOptimizedPicture
  // cannot produce valid srcset URLs from a data URI (no server path).
  let imageHtml = '';
  if (imageCell) {
    const img = imageCell.querySelector('picture > img');
    if (img) {
      const isDataUri = img.src.startsWith('data:');
      const pictureEl = isDataUri
        ? imageCell.querySelector('picture')
        : createOptimizedPicture(img.src, img.alt ?? '', false, [
          { media: '(width >= 760px)', width: '600' },
          { width: '400' },
        ]);
      if (pictureEl) imageHtml = `<div class="promo-pair-image">${pictureEl.outerHTML}</div>`;
    }
  }

  if (!bodyCell) {
    return CARD_MARKUP
      .replace('{image}', imageHtml)
      .replace('{heading}', '')
      .replace('{description}', '')
      .replace('{cta}', '');
  }

  const headingEl = bodyCell.querySelector('h1,h2,h3,h4,h5,h6');
  const headingHtml = headingEl ? headingEl.outerHTML : '';

  const descEl = bodyCell.querySelector('p:not(:has(a))') ?? bodyCell.querySelector('p');
  const descHtml = descEl ? `<p class="promo-pair-desc">${descEl.innerHTML}</p>` : '';

  const linkEl = bodyCell.querySelector('a');
  // Use promo-pair-cta class without .button so the global button decorator
  // does not override the Abbott link-style CTA treatment.
  const ctaHtml = linkEl
    ? `<a class="promo-pair-cta" href="${linkEl.href}">${linkEl.textContent.trim()}</a>`
    : '';

  return CARD_MARKUP
    .replace('{image}', imageHtml)
    .replace('{heading}', headingHtml)
    .replace('{description}', descHtml)
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

  const cardsHtml = rows.map(buildCardHtml).join('');

  block.innerHTML = MARKUP.replace('{cards}', cardsHtml);
}
