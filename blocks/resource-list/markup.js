/**
 * HTML templates for the resource-list block.
 *
 * MARKUP      — root list container
 * ITEM_MARKUP — individual resource list item
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
  </div>
</li>
`;

export default MARKUP;
