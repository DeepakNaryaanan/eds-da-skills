/**
 * Nav Cards block.
 *
 * Renders a responsive grid of icon-backed navigation cards. Each authored row
 * becomes one card linking visitors to a primary site destination.
 *
 * Content model (see block.md):
 *   Each row — two cells: icon picture (optional) | body (heading, description, CTA link)
 */

import { createOptimizedPicture } from '../../scripts/aem.js';
import { MARKUP, CARD_MARKUP } from './markup.js';

/**
 * Builds the HTML string for a single nav card from its authored row.
 *
 * @param {Element} row The authored row element
 * @returns {string} Interpolated CARD_MARKUP HTML string, or empty string if no
 *   body cell or CTA link is found
 */
function buildCardHtml(row) {
  const [iconCell, bodyCell] = row.children;

  // Body cell is required
  if (!bodyCell) return '';

  const linkEl = bodyCell.querySelector('a');
  if (!linkEl) return '';

  const href = linkEl.href || '#';
  const ctaText = linkEl.textContent.trim();

  // Heading: first heading element in the body cell
  const headingEl = bodyCell.querySelector('h1,h2,h3,h4,h5,h6');
  const headingHtml = headingEl ? headingEl.outerHTML : '';

  // Description: first paragraph that is not the CTA
  const descEl = [...bodyCell.querySelectorAll('p')].find(
    (p) => !p.querySelector('a') && p.textContent.trim(),
  );
  const description = descEl ? descEl.textContent.trim() : '';

  // aria-label combines heading and CTA for screen readers navigating by link
  const ariaLabel = headingEl
    ? `${headingEl.textContent.trim()} — ${ctaText}`
    : ctaText;

  // Icon: optimized picture or raw HTML from the icon cell
  let iconHtml = '';
  if (iconCell) {
    const img = iconCell.querySelector('picture > img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt ?? '', false, [
        { width: '80' },
      ]);
      iconHtml = `<div class="nav-cards-icon">${optimized.outerHTML}</div>`;
    } else if (iconCell.innerHTML.trim()) {
      iconHtml = `<div class="nav-cards-icon">${iconCell.innerHTML}</div>`;
    }
  }

  return CARD_MARKUP
    .replace('{href}', href)
    .replace('{ariaLabel}', ariaLabel)
    .replace('{icon}', iconHtml)
    .replace('{heading}', headingHtml)
    .replace('{description}', description)
    .replace('{ctaText}', ctaText);
}

/**
 * Loads and decorates the nav-cards block.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const cardsHtml = rows.map(buildCardHtml).join('');

  block.innerHTML = MARKUP.replace('{cards}', cardsHtml);
}
