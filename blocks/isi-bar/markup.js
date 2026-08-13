/**
 * ISI Bar — HTML template with interpolation slots.
 *
 * {summary}     : authored one-line summary text (always visible in collapsed bar)
 * {panelId}     : unique id wired between aria-controls and the content panel
 * {content}     : ISI fragment HTML rendered inside the scrollable panel;
 *                 falls back to a link to the full Prescribing Information
 */

export const MARKUP = /* html */`
<aside
  class="isi-bar-inner"
  role="complementary"
  aria-label="Important Safety Information"
>
  <div class="isi-bar-collapsed-row">
    <span class="isi-bar-summary">{summary}</span>
    <button
      class="isi-bar-toggle"
      type="button"
      aria-expanded="false"
      aria-controls="{panelId}"
    >
      <span class="isi-bar-toggle-label">See More</span>
      <span class="isi-bar-toggle-icon" aria-hidden="true"></span>
    </button>
  </div>
  <div
    id="{panelId}"
    class="isi-bar-panel"
    role="region"
    aria-label="Full Important Safety Information"
    tabindex="0"
  >
    <div class="isi-bar-panel-content">
      {content}
    </div>
  </div>
</aside>
`;

export default MARKUP;
