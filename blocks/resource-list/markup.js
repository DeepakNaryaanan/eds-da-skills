/**
 * HTML templates for the resource-list block.
 *
 * MARKUP      — root list container
 * ITEM_MARKUP — individual resource list item (card variant)
 *
 * Abbott pattern: full-bleed thumbnail image on top, card body below with
 * title, description, and a "Learn More" underlined CTA link.
 */

export const MARKUP = /* html */`
<ul class="resource-list-items">
  {items}
</ul>
`;

export const ITEM_MARKUP = /* html */`
<li class="resource-list-item">
  {thumbnail}
  <div class="resource-list-body">
    {eyebrow}
    {title}
    {description}
    {date}
    {cta}
  </div>
</li>
`;

export default MARKUP;
