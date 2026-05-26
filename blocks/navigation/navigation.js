import { MARKUP } from './markup.js';

/**
 * Loads and decorates the navigation block. Each authored row contributes one
 * anchor; the block renders them as a single semantic list.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const items = [...block.children]
    .map((row) => row.querySelector('a'))
    .filter(Boolean)
    .map((a) => {
      // Strip auto-applied .button styling so nav links read as plain text.
      a.classList.remove('button', 'primary', 'secondary');
      if (!a.classList.length) a.removeAttribute('class');
      return `<li class="navigation-item">${a.outerHTML}</li>`;
    })
    .join('');
  block.innerHTML = MARKUP.replace('{items}', items);
}
