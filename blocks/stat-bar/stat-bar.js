import { createOptimizedPicture } from '../../scripts/aem.js';
import { STAT_BAR_MARKUP, STAT_ITEM_MARKUP } from './markup.js';

/**
 * Extracts the icon HTML from a cell, replacing the authored picture
 * with an optimized version at the icon display size.
 * @param {Element|null} cell The authored icon cell (first cell of a row)
 * @returns {string} The icon wrapper HTML, or an empty string if no icon
 */
function buildIconHtml(cell) {
  if (!cell) return '';
  const img = cell.querySelector('picture > img');
  if (!img) return '';
  const optimized = createOptimizedPicture(img.src, img.alt ?? '', false, [{ width: '96' }]);
  return `<div class="stat-bar-icon">${optimized.outerHTML}</div>`;
}

/**
 * Animates a numeric stat value from 0 up to its final value using
 * requestAnimationFrame at ~60 fps with an ease-out curve.
 * Respects prefers-reduced-motion: sets the final value immediately if the
 * user has opted into reduced motion.
 * @param {Element} valueEl The .stat-bar-value element carrying data-target
 */
function animateCounter(valueEl) {
  const raw = valueEl.dataset.target;
  const isDecimal = raw.includes('.');
  const target = parseFloat(raw);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    valueEl.textContent = isDecimal ? target.toFixed(1) : String(target);
    return;
  }

  const duration = 1500;
  const startTime = performance.now();

  /**
   * Advances the counter display for one animation frame.
   * @param {DOMHighResTimeStamp} now Timestamp provided by requestAnimationFrame
   */
  function frame(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    const current = eased * target;
    valueEl.textContent = isDecimal ? current.toFixed(1) : String(Math.round(current));
    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

/**
 * Wires an IntersectionObserver on the stat-bar block to trigger numeric
 * count-up animations when the strip first scrolls into view.
 * The observer disconnects after its first intersection to avoid re-running.
 * @param {Element} block The stat-bar block element
 */
function attachAnimationObserver(block) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        block.querySelectorAll('.stat-bar-value[data-target]').forEach(animateCounter);
      });
    },
    { threshold: 0.2 },
  );
  observer.observe(block);
}

/**
 * Loads and decorates the stat-bar block.
 *
 * Authored structure (one row per stat):
 *   cell[0] — Icon (optional): <picture> or inline SVG
 *   cell[1] — Value (required): bold numeric or short text claim
 *   cell[2] — Label (required): short descriptor
 *
 * Variants (applied via block class):
 *   .animated — stat values count up from 0 when the strip enters the viewport;
 *               pure integer or decimal strings trigger the counter; non-numeric
 *               values are displayed as-is without animation.
 *   .dark     — dark background band; white text; use on dark section backgrounds.
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const isAnimated = block.classList.contains('animated');
  const rows = [...block.children];

  // 2. Extract stat data from authored rows
  const stats = rows.map((row) => {
    const cells = [...row.children];
    const iconHtml = buildIconHtml(cells[0] ?? null);
    const rawValue = cells[1]?.textContent?.trim() ?? '';
    // Extract label text from within its authored <p> so we don't nest <p> inside <p>
    const labelText = cells[2]?.querySelector('p')?.textContent?.trim()
      ?? cells[2]?.textContent?.trim()
      ?? '';

    const isNumeric = /^-?\d+(\.\d+)?$/.test(rawValue);
    const dataAttr = (isAnimated && isNumeric) ? ` data-target="${rawValue}"` : '';
    const displayValue = (isAnimated && isNumeric) ? '0' : rawValue;

    return {
      iconHtml, displayValue, dataAttr, labelText,
    };
  });

  // 3. Build item HTML via template interpolation
  const itemsHtml = stats.map(({
    iconHtml, displayValue, dataAttr, labelText,
  }) => STAT_ITEM_MARKUP
    .replace('{icon}', iconHtml)
    .replace('{value_attr}', dataAttr)
    .replace('{value}', displayValue)
    .replace('{label}', labelText)).join('');

  // Replace block content with the rendered template
  block.innerHTML = STAT_BAR_MARKUP.replace('{items}', itemsHtml);

  // 4. Wire animation observer for the animated variant
  if (isAnimated) {
    attachAnimationObserver(block);
  }
}
