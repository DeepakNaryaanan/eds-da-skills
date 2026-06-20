/**
 * ISI Bar Block
 *
 * Renders a sticky, collapsible Important Safety Information bar fixed to the
 * bottom of the viewport. Required on every patient-facing page for FDA/PhRMA
 * promotional-guideline compliance.
 *
 * Content model (block.md):
 *   Row 0 — Summary text (required): one-line ISI summary always visible in
 *            the collapsed bar.
 *   Row 1 — Fragment path (optional): non-default ISI fragment path. Falls back
 *            to /fragments/isi when omitted.
 *
 * Variant: `isi-bar inline` — non-sticky; renders in page flow.
 */

import { loadFragment } from '../fragment/fragment.js';
import { fetchFragmentHtml } from '../../scripts/config/fragment-loader.js';
import { encodeHtml } from '../../scripts/scripts.js';
import { MARKUP } from './markup.js';

/** Fallback prescribing-information URL shown when the fragment fetch fails. */
const PI_FALLBACK_HREF = '/prescribing-information';

/** Label strings for the toggle button. */
const LABEL_EXPAND = 'See More';
const LABEL_COLLAPSE = 'See Less';

/** sessionStorage key used to persist the user's panel state. */
const SESSION_KEY = 'isi-expanded';

/**
 * Generates a lightweight unique id for ARIA wiring.
 * @returns {string} A unique id string
 */
function uniqueId() {
  return `isi-panel-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Returns the fallback HTML shown in the ISI panel when the fragment fetch
 * fails. Keeps the summary line visible with a link to the full PI.
 * @returns {string} Safe HTML string
 */
function buildFallbackContent() {
  return `<p>Full prescribing information is not available at this time.
    <a href="${encodeHtml(PI_FALLBACK_HREF)}">View full Prescribing Information</a>.</p>`;
}

/**
 * Sets the visual and ARIA state of the toggle button and panel.
 * @param {HTMLButtonElement} toggle - The toggle button element
 * @param {HTMLElement} panel - The ISI content panel element
 * @param {boolean} expanded - Whether the panel should be expanded
 */
function applyToggleState(toggle, panel, expanded) {
  const btn = toggle;
  btn.setAttribute('aria-expanded', String(expanded));

  const labelEl = btn.querySelector('.isi-bar-toggle-label');
  if (labelEl) labelEl.textContent = expanded ? LABEL_COLLAPSE : LABEL_EXPAND;

  const iconEl = btn.querySelector('.isi-bar-toggle-icon');
  if (iconEl) iconEl.classList.toggle('isi-bar-toggle-icon--up', expanded);

  panel.classList.toggle('isi-bar-panel--expanded', expanded);
}

/**
 * Persists the expanded state to sessionStorage so it survives in-session
 * page navigations.
 * @param {boolean} expanded - The state to persist
 */
function persistState(expanded) {
  try {
    sessionStorage.setItem(SESSION_KEY, String(expanded));
  } catch {
    // sessionStorage unavailable (private mode, quota) — silently ignore
  }
}

/**
 * Reads the previously persisted expanded state from sessionStorage.
 * @returns {boolean} True if the panel was previously expanded
 */
function readPersistedState() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Handles click events on the ISI bar toggle button.
 * Flips the panel between expanded and collapsed, persists the choice, and
 * moves focus to the panel when expanding so screen-reader users are taken
 * to the ISI content.
 * @param {MouseEvent} e - The click event
 * @param {HTMLButtonElement} toggle - The toggle button element
 * @param {HTMLElement} panel - The ISI content panel element
 */
function handleToggleClick(e, toggle, panel) {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  const next = !expanded;
  applyToggleState(toggle, panel, next);
  persistState(next);
  if (next) panel.focus();
}

/**
 * Handles keydown events fired on the ISI content panel. Pressing Escape
 * collapses the panel and returns focus to the toggle button.
 * @param {KeyboardEvent} e - The keydown event
 * @param {HTMLButtonElement} toggle - The toggle button element
 * @param {HTMLElement} panel - The ISI content panel element
 */
function handlePanelKeydown(e, toggle, panel) {
  if (e.key === 'Escape') {
    applyToggleState(toggle, panel, false);
    persistState(false);
    toggle.focus();
  }
}

/**
 * Loads and decorates the ISI Bar block.
 *
 * Steps:
 * 1. Extract the authored summary text and optional fragment path.
 * 2. Build the block DOM from the MARKUP template.
 * 3. Attempt to load the ISI fragment; fall back to a PI link on failure.
 * 4. Wire expand/collapse behaviour with full keyboard and ARIA support.
 * 5. Restore persisted session state.
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const isInline = block.classList.contains('inline');

  // ── 1. Extract authored rows ──────────────────────────────────────────────
  const rows = [...block.children];
  const summaryRow = rows[0];
  const fragmentPathRow = rows[1];

  // Prefer the <p> element so inline links in the summary are preserved.
  // Fall back to the first child element's innerHTML, then the row text.
  const summaryEl = summaryRow?.querySelector('p') ?? summaryRow?.firstElementChild;
  const summaryHtml = summaryEl?.innerHTML?.trim()
    || summaryRow?.textContent?.trim()
    || 'DUOPA has important safety information.';

  // Read an optional author-provided fragment path from the second row.
  const authoredPath = fragmentPathRow?.textContent?.trim() || null;

  // ── 2. Render template ────────────────────────────────────────────────────
  const panelId = uniqueId();
  block.innerHTML = MARKUP
    .replace('{summary}', summaryHtml)
    .replaceAll('{panelId}', panelId)
    .replace('{content}', '');

  const aside = block.querySelector('.isi-bar-inner');
  const toggle = block.querySelector('.isi-bar-toggle');
  const panel = block.querySelector('.isi-bar-panel');
  const panelContent = block.querySelector('.isi-bar-panel-content');

  // ── 3. Load ISI fragment (lazy — never blocks LCP) ────────────────────────
  const resolvedPath = authoredPath || '/fragments/isi';

  try {
    /*
     * fetchFragmentHtml reads the page <meta name="isi-fragment"> key first,
     * then falls back to resolvedPath. We pass "isi-fragment" as the meta key
     * so authors can override the fragment from page metadata without touching
     * the block table.
     */
    const fragmentHtml = await fetchFragmentHtml(loadFragment, 'isi-fragment', resolvedPath);
    if (fragmentHtml) {
      // Safe: fragmentHtml is server-rendered CMS content (same-origin .plain.html)
      panelContent.innerHTML = fragmentHtml;
    } else {
      panelContent.innerHTML = buildFallbackContent();
    }
  } catch {
    panelContent.innerHTML = buildFallbackContent();
  }

  // ── 4. Wire event listeners ───────────────────────────────────────────────
  toggle.addEventListener('click', (e) => handleToggleClick(e, toggle, panel));

  panel.addEventListener('keydown', (e) => handlePanelKeydown(e, toggle, panel));

  // ── 5. Restore persisted state & apply body class ─────────────────────────
  // Only the sticky (non-inline) variant offsets page content; the inline
  // variant renders in normal flow and must not add body padding.
  if (!isInline) {
    document.body.classList.add('has-isi-bar');
  }

  if (!isInline && readPersistedState()) {
    applyToggleState(toggle, panel, true);
  }

  if (aside && isInline) {
    aside.classList.add('isi-bar-inner--inline');
  }
}
