/**
 * HTML templates for the hero-carousel block.
 *
 * MARKUP          — root carousel container
 * SLIDE_MARKUP    — individual slide
 * INDICATOR_MARKUP — dot indicator button
 */

export const MARKUP = /* html */`
<div class="hero-carousel-track" aria-live="polite" aria-atomic="false">
  {slides}
</div>
<button class="hero-carousel-prev" type="button" aria-label="Previous slide">
  <span class="hero-carousel-arrow" aria-hidden="true">&#8249;</span>
</button>
<button class="hero-carousel-next" type="button" aria-label="Next slide">
  <span class="hero-carousel-arrow" aria-hidden="true">&#8250;</span>
</button>
<div class="hero-carousel-indicators" role="tablist" aria-label="Slide indicators">
  {indicators}
</div>
`;

export const SLIDE_MARKUP = /* html */`
<div class="hero-carousel-slide" role="group" aria-roledescription="slide" aria-label="{ariaLabel}" aria-hidden="{hidden}">
  <div class="hero-carousel-slide-image">{image}</div>
  <div class="hero-carousel-slide-body">{body}</div>
</div>
`;

export const INDICATOR_MARKUP = /* html */`
<button
  class="hero-carousel-indicator"
  type="button"
  role="tab"
  aria-label="Go to slide {n}"
  aria-selected="{selected}"
  tabindex="{tabindex}"
  data-index="{index}"
></button>
`;

export default MARKUP;
