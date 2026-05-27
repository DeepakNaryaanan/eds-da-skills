/**
 * Hero Carousel block.
 *
 * Full-width auto-rotating carousel used as the primary hero section of a page.
 * Each authored row becomes one slide. Slides cycle automatically every 6 seconds
 * and can be navigated via previous/next arrow buttons and dot indicators.
 *
 * Content model (see block.md):
 *   Each row — two cells: image `<picture>` | body (eyebrow, heading, paragraph, CTA link)
 */

import { createOptimizedPicture } from '../../scripts/aem.js';
import { MARKUP, SLIDE_MARKUP, INDICATOR_MARKUP } from './markup.js';

/** Auto-advance interval in milliseconds. */
const AUTOPLAY_INTERVAL = 6000;

/**
 * Activates a specific slide by index, updating ARIA states and indicator buttons.
 *
 * @param {Element} block The hero-carousel block element
 * @param {number} index Zero-based index of the slide to activate
 */
function goToSlide(block, index) {
  const slides = [...block.querySelectorAll('.hero-carousel-slide')];
  const indicators = [...block.querySelectorAll('.hero-carousel-indicator')];

  if (!slides.length) return;

  const normalized = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    const active = i === normalized;
    slide.setAttribute('aria-hidden', String(!active));
    slide.classList.toggle('hero-carousel-slide--active', active);
  });

  indicators.forEach((btn, i) => {
    const active = i === normalized;
    btn.setAttribute('aria-selected', String(active));
    btn.setAttribute('tabindex', active ? '0' : '-1');
  });

  // Store current index on the block for use by timer callbacks
  block.dataset.currentSlide = String(normalized);
}

/**
 * Starts the auto-play timer. Stores the interval ID on the block element so
 * it can be paused when the user hovers or focuses the carousel.
 *
 * @param {Element} block The hero-carousel block element
 */
function startAutoplay(block) {
  const id = setInterval(() => {
    const current = parseInt(block.dataset.currentSlide ?? '0', 10);
    goToSlide(block, current + 1);
  }, AUTOPLAY_INTERVAL);
  block.dataset.autoplayId = String(id);
}

/**
 * Stops the auto-play timer.
 *
 * @param {Element} block The hero-carousel block element
 */
function stopAutoplay(block) {
  clearInterval(parseInt(block.dataset.autoplayId ?? '0', 10));
}

/**
 * Builds the HTML for a single carousel slide from its authored row.
 *
 * @param {Element} row The authored row element (one div.row per slide)
 * @param {number} index Zero-based slide index
 * @param {number} total Total number of slides (for aria-label)
 * @returns {string} Interpolated SLIDE_MARKUP HTML string
 */
function buildSlideHtml(row, index, total) {
  const [imageCell, bodyCell] = row.children;

  // Image — eager for first slide (LCP candidate), lazy for the rest
  let imageHtml = '';
  if (imageCell) {
    const img = imageCell.querySelector('picture > img');
    if (img) {
      const eager = index === 0;
      const optimized = createOptimizedPicture(img.src, img.alt ?? '', eager, [
        { media: '(width >= 992px)', width: '1440' },
        { media: '(width >= 760px)', width: '992' },
        { width: '750' },
      ]);
      imageHtml = optimized.outerHTML;
    } else {
      imageHtml = imageCell.innerHTML;
    }
  }

  const bodyHtml = bodyCell ? bodyCell.innerHTML : '';
  const hidden = index !== 0;

  return SLIDE_MARKUP
    .replace('{ariaLabel}', `Slide ${index + 1} of ${total}`)
    .replace('{hidden}', String(hidden))
    .replace('{image}', imageHtml)
    .replace('{body}', bodyHtml);
}

/**
 * Builds the HTML for a single dot indicator button.
 *
 * @param {number} index Zero-based slide index
 * @returns {string} Interpolated INDICATOR_MARKUP HTML string
 */
function buildIndicatorHtml(index) {
  return INDICATOR_MARKUP
    .replaceAll('{n}', String(index + 1))
    .replaceAll('{selected}', String(index === 0))
    .replaceAll('{tabindex}', index === 0 ? '0' : '-1')
    .replaceAll('{index}', String(index));
}

/**
 * Loads and decorates the hero-carousel block.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Check for "dark" variant
  const isDark = block.classList.contains('dark');
  if (isDark) block.setAttribute('data-theme', 'dark');

  const total = rows.length;

  // Build slide and indicator HTML strings
  const slidesHtml = rows
    .map((row, i) => buildSlideHtml(row, i, total))
    .join('');

  const indicatorsHtml = rows
    .map((_, i) => buildIndicatorHtml(i))
    .join('');

  // Replace authored content with rendered carousel markup
  block.innerHTML = MARKUP
    .replace('{slides}', slidesHtml)
    .replace('{indicators}', indicatorsHtml);

  // Initialise first slide state (explicit aria/class setup after DOM is written)
  block.dataset.currentSlide = '0';
  goToSlide(block, 0);

  // ── Event listeners ─────────────────────────────────────────────────────────

  const prevBtn = block.querySelector('.hero-carousel-prev');
  const nextBtn = block.querySelector('.hero-carousel-next');

  /**
   * Handles click on the previous-slide button.
   * @param {MouseEvent} e The click event
   */
  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    stopAutoplay(block);
    const current = parseInt(block.dataset.currentSlide ?? '0', 10);
    goToSlide(block, current - 1);
    startAutoplay(block);
  });

  /**
   * Handles click on the next-slide button.
   * @param {MouseEvent} e The click event
   */
  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    stopAutoplay(block);
    const current = parseInt(block.dataset.currentSlide ?? '0', 10);
    goToSlide(block, current + 1);
    startAutoplay(block);
  });

  /**
   * Handles click on a dot indicator button.
   * @param {MouseEvent} e The click event
   */
  block.querySelector('.hero-carousel-indicators')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.hero-carousel-indicator');
    if (!btn) return;
    stopAutoplay(block);
    goToSlide(block, parseInt(btn.dataset.index, 10));
    startAutoplay(block);
  });

  /**
   * Handles keyboard navigation on dot indicators (arrow keys, Home, End).
   * @param {KeyboardEvent} e The keydown event
   */
  block.querySelector('.hero-carousel-indicators')?.addEventListener('keydown', (e) => {
    const btns = [...block.querySelectorAll('.hero-carousel-indicator')];
    const current = parseInt(block.dataset.currentSlide ?? '0', 10);
    let next = -1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % btns.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (current - 1 + btns.length) % btns.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = btns.length - 1;
    else return;

    e.preventDefault();
    stopAutoplay(block);
    goToSlide(block, next);
    btns[next]?.focus();
    startAutoplay(block);
  });

  // Pause auto-play on hover / focus for accessibility (WCAG 2.2.2 Pause, Stop, Hide)
  block.addEventListener('mouseenter', () => stopAutoplay(block));
  block.addEventListener('mouseleave', () => startAutoplay(block));
  block.addEventListener('focusin', () => stopAutoplay(block));
  block.addEventListener('focusout', () => startAutoplay(block));

  // Start auto-play only if there are multiple slides
  if (total > 1) startAutoplay(block);
}
