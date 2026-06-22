/**
 * HTML templates for the resource-list block.
 *
 * MARKUP      — root grid container
 * CARD_MARKUP — individual resource/article card
 *
 * Abbott "Latest News" pattern: white card with a thumbnail image on top, a
 * linked navy heading, an italic muted category label, and a short summary.
 */

export const MARKUP = /* html */`
<ul class="resource-list-grid">
  {cards}
</ul>
`;

export const CARD_MARKUP = /* html */`
<li class="resource-list-item">
  <article class="resource-list-card">
    {image}
    <div class="resource-list-body">
      <h3 class="resource-list-title"><a href="{href}">{titleText}</a></h3>
      {category}
      <p class="resource-list-summary">{summary}</p>
    </div>
  </article>
</li>
`;

export default MARKUP;
