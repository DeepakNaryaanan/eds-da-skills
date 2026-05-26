/**
 * Root footer shell.
 *
 * Tokens:
 *   {columns} – authored fragment content before the <hr> (link groups)
 *   {legal}   – authored fragment content after the <hr> (legal / copyright)
 */
export const MARKUP = /* html */`
<div class="footer-inner">
  <div class="footer-columns">{columns}</div>
  <div class="footer-legal">{legal}</div>
</div>
`;

export default MARKUP;
