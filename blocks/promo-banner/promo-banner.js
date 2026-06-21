import { PROMO_BANNER_MARKUP } from './markup.js';

/**
 * Extracts all CTA links from the body cell and wraps them in a
 * flex container so two buttons can render inline on wider viewports.
 * Returns an empty string if no links are present.
 * @param {Element|null} bodyCell The second authored cell of the block row
 * @returns {string} The CTA container HTML, or an empty string
 */
function buildCtasHtml(bodyCell) {
  if (!bodyCell) return '';
  const links = [...bodyCell.querySelectorAll('a.button')];
  if (!links.length) return '';
  const linksHtml = links.map((a) => a.outerHTML).join('');
  return `<div class="promo-banner-ctas">${linksHtml}</div>`;
}

/**
 * Extracts plain body paragraph text from the body cell, excluding any
 * anchor elements so that CTA links are handled separately.
 * Returns an empty string if no paragraph content remains.
 * @param {Element|null} bodyCell The second authored cell of the block row
 * @returns {string} The body HTML string, or an empty string
 */
function buildBodyHtml(bodyCell) {
  if (!bodyCell) return '';
  const paras = [...bodyCell.querySelectorAll('p')].filter(
    (p) => !p.querySelector('a.button'),
  );
  return paras.map((p) => p.outerHTML).join('');
}

/**
 * Loads and decorates the promo-banner block.
 *
 * Authored structure (one row):
 *   cell[0] — Heading (required): <h2> or <h3> element
 *   cell[1] — Body (optional):    paragraph text and/or one or two CTA links
 *
 * Variants (applied via block class — set by the CMS variation syntax):
 *   .dark   — navy primary background with white text and outlined buttons
 *   .accent — brand orange background with white text
 *
 * The block is intentionally CSS-driven; this function performs only DOM
 * restructuring. No event listeners are attached.
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // 2. Extract authored content from the single authored row
  const row = block.children[0];
  if (!row) {
    block.innerHTML = '';
    return;
  }

  const headingCell = row.children[0] ?? null;
  const bodyCell = row.children[1] ?? null;

  const headingEl = headingCell?.querySelector('h1, h2, h3, h4, h5, h6');

  // TC-11: downgrade <h1> to <h2> to prevent heading-level violations
  if (headingEl && headingEl.tagName === 'H1') {
    const h2 = document.createElement('h2');
    h2.innerHTML = headingEl.innerHTML;
    headingEl.replaceWith(h2);
  }

  const headingHtml = headingCell?.querySelector('h2, h3, h4, h5, h6')?.outerHTML ?? '';
  const bodyHtml = buildBodyHtml(bodyCell);
  const ctasHtml = buildCtasHtml(bodyCell);

  // 3. Interpolate template and replace block content
  block.innerHTML = PROMO_BANNER_MARKUP
    .replace('{heading}', headingHtml)
    .replace('{body}', bodyHtml)
    .replace('{ctas}', ctasHtml);
}
