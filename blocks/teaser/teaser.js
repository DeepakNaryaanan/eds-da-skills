import { MARKUP } from './markup.js';

/**
 * Loads and decorates the block.
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  block.innerHTML = MARKUP;
}
