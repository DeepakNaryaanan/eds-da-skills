/**
 * HTML templates for the patient-resources block.
 *
 * Tokens use {curly-brace} syntax and are replaced by the decoration function
 * in patient-resources.js. The /* html * / comment enables syntax highlighting
 * in editors that support the lit-html / es6-string-html extensions.
 *
 * Mobile stacking order (flex-column, default):
 *   1. .patient-resources-header  (eyebrow + heading)
 *   2. .patient-resources-intro   (intro paragraph)
 *   3. .patient-resources-image   (supporting image)
 *   4. .patient-resources-items   (resource list)
 *
 * Desktop two-column grid (≥992 px):
 *   Left column:  .patient-resources-header + .patient-resources-image
 *   Right column: .patient-resources-intro  + .patient-resources-items
 *
 * No imports are allowed in this file — it must remain a pure data module.
 */

/** Root wrapper — flat grid of four named regions, laid out differently per viewport. */
export const MARKUP = /* html */`
<div class="patient-resources-layout">
  <div class="patient-resources-header">
    {eyebrow}
    {heading}
  </div>
  <div class="patient-resources-intro">
    {intro}
  </div>
  <div class="patient-resources-image">
    {image}
  </div>
  <ul class="patient-resources-items" aria-label="Resource list">
    {items}
  </ul>
</div>
`;

/** One resource list item. */
export const ITEM_MARKUP = /* html */`
<li class="patient-resources-item">
  <div class="patient-resources-item-body">
    {heading}
    {description}
    <a class="patient-resources-cta" href="{href}">{ctaText}<span aria-hidden="true" class="patient-resources-chevron"> ›</span></a>
  </div>
</li>
`;

export default MARKUP;
