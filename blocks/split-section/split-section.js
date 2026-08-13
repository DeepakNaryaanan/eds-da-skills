import { createOptimizedPicture } from '../../scripts/aem.js';
import { SPLIT_SECTION_MARKUP } from './markup.js';

/**
 * Determines whether the block is in the first section of the page,
 * which signals that its image should be eager-loaded as an LCP candidate.
 * @param {Element} block The block element
 * @returns {boolean} True if the block is in the first section
 */
function isFirstSection(block) {
  const section = block.closest('.section');
  return section ? section === section.parentElement?.firstElementChild : false;
}

/**
 * Extracts and optimizes the picture element from the media cell.
 * Replaces the authored <picture> with a webp-optimized version via
 * createOptimizedPicture. Returns the outerHTML of the result,
 * or an empty string if no image is found in the cell.
 * @param {Element|null} mediaCell The first authored cell containing the image
 * @param {boolean} eager Pass true to disable lazy-loading (LCP image)
 * @returns {string} outerHTML of the optimized <picture>, or empty string
 */
function buildMediaHtml(mediaCell, eager) {
  if (!mediaCell) return '';
  const img = mediaCell.querySelector('picture > img');
  if (!img) return '';
  const optimized = createOptimizedPicture(
    img.src,
    img.alt ?? '',
    eager,
    [{ width: '750' }, { width: '1200' }],
  );
  return optimized.outerHTML;
}

/**
 * Extracts and decorates the body content from the body cell.
 * Identifies the optional eyebrow paragraph (first <p> before the heading),
 * adds the `.eyebrow` class to it, and returns the full cell innerHTML.
 * CTAs authored as links inside <p> tags are already decorated as `.button`
 * elements by the page-level decorateButtons pass before decorate() runs.
 * @param {Element|null} bodyCell The second authored cell containing the body content
 * @returns {string} innerHTML of the decorated body cell, or empty string
 */
function buildBodyHtml(bodyCell) {
  if (!bodyCell) return '';

  const heading = bodyCell.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    // The first <p> that appears strictly before the heading is the eyebrow
    const siblings = [...bodyCell.children];
    const headingIndex = siblings.indexOf(heading);
    const firstP = siblings.find(
      (el) => el.tagName === 'P' && siblings.indexOf(el) < headingIndex,
    );
    if (firstP) {
      firstP.classList.add('eyebrow');
    }
  }

  return bodyCell.innerHTML;
}

/**
 * Loads and decorates the split-section block.
 *
 * Authored structure (single row):
 *   cell[0] — Media (required): <picture> element (full-column image)
 *   cell[1] — Body  (required): optional eyebrow <p>, heading (h2/h3),
 *                                body paragraphs, optional CTA link
 *
 * Variants (applied via block class from CMS block name):
 *   .reverse           — image right, text left (CSS flex-direction: row-reverse)
 *   .wide-media        — 60% image / 40% text column split; image left
 *   .wide-media.reverse — 60/40 split with image right
 *
 * All variant column reordering is handled purely by CSS — the DOM source
 * order is never changed (image cell always first in source for accessibility).
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // 1. No external dependencies to load

  // 2. Extract configuration from authored row
  const row = block.firstElementChild;
  if (!row) {
    // Empty block — render empty container without throwing
    block.innerHTML = '';
    return;
  }

  const mediaCell = row.children[0] ?? null;
  const bodyCell = row.children[1] ?? null;
  const eager = isFirstSection(block);

  // 3. Transform DOM via markup.js interpolation
  const mediaHtml = buildMediaHtml(mediaCell, eager);
  const bodyHtml = buildBodyHtml(bodyCell);

  block.innerHTML = SPLIT_SECTION_MARKUP
    .replace('{media}', mediaHtml)
    .replace('{body}', bodyHtml);

  // 4. No event listeners — this block is CSS-driven
}
