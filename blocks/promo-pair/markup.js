/**
 * HTML templates for the promo-pair block.
 *
 * MARKUP      — root grid wrapper
 * CARD_MARKUP — individual promo card
 */

export const MARKUP = /* html */`
<ul class="promo-pair-grid">
  {cards}
</ul>
`;

export const CARD_MARKUP = /* html */`
<li class="promo-pair-card">
  {image}
  <div class="promo-pair-body">
    {heading}
    {description}
    {cta}
  </div>
</li>
`;

export default MARKUP;
