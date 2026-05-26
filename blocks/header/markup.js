/**
 * Root header shell rendered into block.innerHTML.
 *
 * Tokens:
 *   {logo} – outerHTML of the logo <picture> or <img> element from the /nav fragment
 *   {nav}  – outerHTML of the decorated .navigation block from the /nav fragment
 */
export const MARKUP = /* html */`
<div class="header-bar">
  <div class="header-inner">
    <a class="header-logo" href="/" aria-label="Go to home">{logo}</a>
    <button
      class="header-nav-toggle"
      type="button"
      aria-expanded="false"
      aria-controls="header-nav"
      aria-label="Open menu"
    >
      <span class="header-nav-toggle-bar" aria-hidden="true"></span>
      <span class="header-nav-toggle-bar" aria-hidden="true"></span>
      <span class="header-nav-toggle-bar" aria-hidden="true"></span>
    </button>
    <nav
      class="header-nav"
      id="header-nav"
      aria-label="Main navigation"
      hidden
    >
      {nav}
    </nav>
  </div>
</div>
`;

export default MARKUP;
