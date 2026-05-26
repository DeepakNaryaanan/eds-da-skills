import { loadFragment } from '../fragment/fragment.js';
import { fetchFragmentHtml } from '../../scripts/config/fragment-loader.js';
import { MARKUP } from './markup.js';

const DESKTOP_NAV_BREAKPOINT = 760;

/**
 * Returns the trimmed text of the open / close menu labels for the hamburger.
 */
const LABELS = { open: 'Open menu', close: 'Close menu' };

/**
 * Loads and decorates the header. Fetches the `/nav` fragment, extracts the
 * first <picture>/<img> as the logo and the decorated `.navigation` block as
 * the primary nav list, then wires up the mobile hamburger toggle.
 *
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragmentHtml = await fetchFragmentHtml(loadFragment, 'nav', '/nav');
  if (!fragmentHtml) return;

  const temp = document.createElement('div');
  temp.innerHTML = fragmentHtml;

  const logoEl = temp.querySelector('picture, img');
  const navBlock = temp.querySelector('.navigation');

  block.innerHTML = MARKUP
    .replace('{logo}', logoEl ? logoEl.outerHTML : '')
    .replace('{nav}', navBlock ? navBlock.outerHTML : '');

  const toggle = block.querySelector('.header-nav-toggle');
  const nav = block.querySelector('.header-nav');
  if (!toggle || !nav) return;

  /**
   * Sets the open / closed state of the mobile nav.
   * @param {boolean} open
   */
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? LABELS.close : LABELS.open);
    toggle.classList.toggle('is-open', open);
    nav.toggleAttribute('hidden', !open);
  };

  /**
   * Click handler for the hamburger toggle.
   * @param {MouseEvent} _e
   */
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  });

  /**
   * On viewport resize past the desktop breakpoint the nav is always visible —
   * close the mobile state so aria attributes don't lie.
   * @param {MediaQueryListEvent | MediaQueryList} e
   */
  const mq = window.matchMedia(`(width >= ${DESKTOP_NAV_BREAKPOINT}px)`);
  const syncToBreakpoint = (e) => {
    if (e.matches) {
      // desktop: nav always visible, hamburger ignored
      nav.removeAttribute('hidden');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', LABELS.open);
      toggle.classList.remove('is-open');
    } else if (toggle.getAttribute('aria-expanded') !== 'true') {
      // mobile: collapse nav unless user already opened it
      nav.setAttribute('hidden', '');
    }
  };
  syncToBreakpoint(mq);
  mq.addEventListener('change', syncToBreakpoint);
}
