export const STAT_BAR_MARKUP = /* html */`
<ul class="stat-bar-list" role="list">
  {items}
</ul>
`;

export const STAT_ITEM_MARKUP = /* html */`
<li class="stat-bar-item">
  {icon}
  <p class="stat-bar-value"{value_attr}>{value}</p>
  <p class="stat-bar-label">{label}</p>
</li>
`;

export default STAT_BAR_MARKUP;
