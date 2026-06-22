/**
 * HTML templates for the promo-pair block.
 *
 * MARKUP      — root grid container
 * TILE_MARKUP — individual promo tile
 *
 * Abbott pattern: two white tiles on a light-grey section. Each tile has a 3:2
 * cover image, a heading, body copy, and a solid navy uppercase CTA button.
 */

export const MARKUP = /* html */`
<ul class="promo-pair-grid">
  {tiles}
</ul>
`;

export const TILE_MARKUP = /* html */`
<li class="promo-pair-item">
  <article class="promo-pair-tile">
    {image}
    <div class="promo-pair-body">
      {heading}
      <p class="promo-pair-text">{description}</p>
      {cta}
    </div>
  </article>
</li>
`;

export default MARKUP;
