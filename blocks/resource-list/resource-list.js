/**
 * Resource List block.
 *
 * Displays a curated list of linked resources (articles, pages, or external
 * references). Each authored row is one resource item. The title link is the
 * primary CTA; thumbnail, eyebrow, description, and date are optional.
 *
 * Renders as an Abbott-style m-card large grid: full-bleed thumbnail image,
 * card body with title, description, and a "Learn More" underlined link CTA
 * matching Abbott's .a-link--icon pattern.
 *
 * Content model (see block.md):
 *   Each row — two cells: thumbnail `<picture>` (optional) | body (title link,
 *   eyebrow, description, date)
 *
 * Body sub-fields are identified by semantic formatting:
 *   - Bold/heading containing a link → resource title (the link is the CTA)
 *   - Italic or inline-code short text → eyebrow / tag
 *   - Plain paragraph → description
 *   - Date string (YYYY-MM-DD or Month DD, YYYY) → publication date
 */

import { createOptimizedPicture } from '../../scripts/aem.js';
import { MARKUP, ITEM_MARKUP } from './markup.js';

/** Regex patterns for date detection. */
const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
  /^[A-Za-z]+ \d{1,2},\s*\d{4}$/, // Month DD, YYYY
];

/**
 * Returns true if the given string looks like a publication date.
 *
 * @param {string} text The text to test
 * @returns {boolean} Whether the text matches a known date pattern
 */
function looksLikeDate(text) {
  const trimmed = text.trim();
  return DATE_PATTERNS.some((re) => re.test(trimmed));
}

/**
 * Extracts sub-fields from a resource body cell.
 *
 * Sub-fields are identified by semantic formatting rather than cell position:
 * - A heading or bold-containing paragraph that wraps an `<a>` → title (href
 *   is also used as the "Learn More" CTA destination)
 * - An `<em>` or `<code>` short text → eyebrow / tag
 * - A plain `<p>` → description
 * - Text matching a date pattern → date
 *
 * @param {Element} bodyCell The body cell element
 * @returns {{ titleHtml: string, eyebrowHtml: string, descHtml: string, dateHtml: string, ctaHtml: string }}
 */
function extractBodyFields(bodyCell) {
  let titleHtml = '';
  let eyebrowHtml = '';
  let descHtml = '';
  let dateHtml = '';
  let ctaHtml = '';

  [...bodyCell.children].forEach((el) => {
    const tag = el.tagName.toLowerCase();

    // Title: heading or paragraph with a link
    if (!titleHtml && el.querySelector('a')) {
      const link = el.querySelector('a');
      titleHtml = `<a class="resource-list-title" href="${link.href}">${link.textContent.trim()}</a>`;
      // Build "Learn More" CTA pointing to the same href (Abbott pattern)
      ctaHtml = `<a class="resource-list-link" href="${link.href}">Learn More</a>`;
      return;
    }

    // Eyebrow: italic or code element
    if (!eyebrowHtml && (tag === 'p') && (el.querySelector('em') || el.querySelector('code'))) {
      const inner = el.querySelector('em') ?? el.querySelector('code');
      eyebrowHtml = `<span class="resource-list-eyebrow">${inner.textContent.trim()}</span>`;
      return;
    }

    // Date: plain paragraph matching date patterns
    if (!dateHtml && tag === 'p' && looksLikeDate(el.textContent)) {
      dateHtml = `<time class="resource-list-date">${el.textContent.trim()}</time>`;
      return;
    }

    // Description: any remaining paragraph
    if (!descHtml && tag === 'p' && el.textContent.trim()) {
      descHtml = `<p class="resource-list-desc">${el.innerHTML}</p>`;
    }
  });

  return {
    titleHtml, eyebrowHtml, descHtml, dateHtml, ctaHtml,
  };
}

/**
 * Builds the HTML string for a single resource list item from its authored row.
 *
 * @param {Element} row The authored row element
 * @param {boolean} isCompact Whether the compact variant is active
 * @returns {string} Interpolated ITEM_MARKUP HTML string, or empty string if no
 *   title link is found in the body cell
 */
function buildItemHtml(row, isCompact) {
  let imageCell;
  let bodyCell;

  if (isCompact) {
    // Compact: one cell — body only
    [bodyCell] = row.children;
    imageCell = null;
  } else {
    [imageCell, bodyCell] = row.children;
    // If only one cell, treat as body (no thumbnail)
    if (!bodyCell) {
      bodyCell = imageCell;
      imageCell = null;
    }
  }

  if (!bodyCell) return '';

  const {
    titleHtml, eyebrowHtml, descHtml, dateHtml, ctaHtml,
  } = extractBodyFields(bodyCell);

  // Title link is required
  if (!titleHtml) return '';

  // Thumbnail: optimized picture — wider for card layout.
  // Data URI placeholder images are passed through as-is since createOptimizedPicture
  // cannot build srcset URLs from them (they have no server path to parameterise).
  let thumbnailHtml = '';
  if (imageCell) {
    const img = imageCell.querySelector('picture > img');
    if (img) {
      const isDataUri = img.src.startsWith('data:');
      const pictureEl = isDataUri
        ? imageCell.querySelector('picture')
        : createOptimizedPicture(img.src, img.alt ?? '', false, [
          { media: '(width >= 992px)', width: '480' },
          { media: '(width >= 760px)', width: '360' },
          { width: '480' },
        ]);
      if (pictureEl) {
        thumbnailHtml = `<div class="resource-list-thumbnail">${pictureEl.outerHTML}</div>`;
      }
    }
  }

  return ITEM_MARKUP
    .replace('{thumbnail}', thumbnailHtml)
    .replace('{eyebrow}', eyebrowHtml)
    .replace('{title}', titleHtml)
    .replace('{description}', descHtml)
    .replace('{date}', dateHtml)
    .replace('{cta}', ctaHtml);
}

/**
 * Loads and decorates the resource-list block.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const isCompact = block.classList.contains('compact');
  const rows = [...block.children];

  if (!rows.length) return;

  const itemsHtml = rows.map((row) => buildItemHtml(row, isCompact)).join('');

  block.innerHTML = MARKUP.replace('{items}', itemsHtml);
}
