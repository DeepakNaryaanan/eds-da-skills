/**
 * HTML templates for the nav-cards block.
 *
 * MARKUP      — root grid container
 * CARD_MARKUP — individual card item
 *
 * Abbott pattern: each card is a full-anchor tile, icon centred above
 * heading + description + button-style CTA. Hover turns the whole card navy.
 */

export const MARKUP = /* html */`
<ul class="nav-cards-grid">
  {cards}
</ul>
`;

export const CARD_MARKUP = /* html */`
<li class="nav-cards-item">
  <a class="nav-cards-link" href="{href}" aria-label="{ariaLabel}">
    {icon}
    <div class="nav-cards-body">
      {heading}
      <p class="nav-cards-desc">{description}</p>
      <span class="nav-cards-cta" aria-hidden="true">{ctaText}</span>
    </div>
  </a>
</li>
`;

export default MARKUP;
