# Requirements: Armour Thyroid (armourthyroid.com)

**Product:** ARMOUR® THYROID (thyroid tablets, USP) — AbbVie (formerly Allergan/Forest). Natural desiccated thyroid (T3+T4 from porcine thyroid).
**Audience:** Adult patients (and caregivers) treating **hypothyroidism of any cause**, any age. Patient-facing DTC site with disease-education content.

> Data basis: the live site is an **Angular single-page application** — the fetched HTML is only a 5.7 KB bootstrap shell (`<base href="/">`, `jquery.min.js`, `/assets/js/...`), so server-rendered content is not scrapeable. Structure below comes from `site:armourthyroid.com` WebSearch (verified routes) plus the SPA shell. **This is the single most important migration fact: the source is a client-rendered SPA, not server HTML.**

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home | `/` | Landing, product + condition intro | Hero |
| About Armour Thyroid | `/about-armour-thyroid` | What it is (T3/T4 porcine), how to take | Article |
| What is Hypothyroidism? | `/hypothyroidism` | Disease education (affects ~30M US adults) | Article |
| Treatment / dosing | `/treatment` (Angular route; legacy `/treatment.html` 404s, old `/treatment.aspx` exists) | Dosing, food/drug interactions | Article + table |
| Talking to your doctor | est. route | Doctor-discussion guidance, periodic labs | Article |
| Savings / patient access | external → `AbbVie.com/PatientAccessSupport` | Affordability | CTA |
| ISI / PI | est. route + PDF | Safety + prescribing info | Regulatory |

**Estimated page count:** ~6–10 Angular routes. Note legacy `.aspx` history → a prior platform migration; expect stale inbound links to `.aspx`/`.html`.

## Block Inventory Mapping

| Section observed/expected | Existing block | New block needed | Notes |
|---|---|---|---|
| Audience gate | `audience-gate` | — | Reuse if present |
| Sticky ISI | `isi-bar` | — | Reuse |
| Header/footer/nav | `header`,`footer`,`navigation` | — | Reuse |
| Hero | `hero-carousel` | — | Single slide |
| Disease-education explainer | `split-section` | — | Image + text |
| Prevalence/stat callouts (~30M adults) | `stat-bar` | — | Reuse |
| Dosing & food/drug interactions | — | **`dosing-table`** (shared) | Soy/cottonseed/walnuts/grapefruit interaction table |
| Talking-to-your-doctor checklist | `nav-cards` / `tabs` | **`discussion-guide`** (shared) | Doctor-discussion prompts |
| Savings / access CTA | `promo-banner` | **`savings-card`** (shared) | Routes to AbbVie patient access |
| FAQs | — | **`faq-accordion`** (shared) | Expand/collapse |
| References | — | **`reference-list`** (shared) | Citations |

**New blocks:** `dosing-table`*, `discussion-guide`*, `savings-card`*, `faq-accordion`*, `reference-list`* (all portfolio-reusable).

## Design System *(partly UNVERIFIED — SPA, confirm from rendered DOM/CSS)*
- **Colors:** AbbVie/Armour brand palette; confirm from compiled Angular CSS bundle.
- **Typography:** loaded via Angular asset bundle; confirm webfont.
- **Libraries (source site):** Angular + jQuery + bundled `/assets/js`, `/assets/css`.
- **Responsive:** SPA responsive layout; rebuild as static EDS sections.

## Integrations & Third-Party *(confirm from rendered app)*
- **Analytics:** expect Adobe Launch/DTM (AbbVie standard) injected at runtime.
- **Consent:** OneTrust (AbbVie standard) — confirm.
- **Savings:** off-site AbbVie Patient Access Support.
- **Forms:** none confirmed on-site.
- **No** video/maps confirmed.

## Content Migration
- **Volume:** ~6–10 routes + PI/Med Guide PDF(s).
- **Content types:** disease education, dosing/interaction guidance, ISI/PI.
- **Critical:** content must be **extracted from the rendered SPA** (headless render or manual copy) — a raw HTML scrape yields nothing. Budget extra discovery time.
- **Regulatory:** ISI fair balance; full PI; food/drug interaction safety language (preserve exactly); reference citations; AbbVie PRC/job codes.
- **Redirects:** legacy `.aspx` and `.html` → EDS paths (two generations of legacy URLs).
- **SEO:** SPA likely has weak server-side SEO; EDS static rendering is an SEO *improvement* opportunity.
- **Accessibility:** WCAG 2.1 AA; SPA often has focus/route-announcement gaps to fix in the rebuild.

## Migration Complexity
**Medium.**
- Content volume is modest, but the **Angular SPA source** means content extraction is non-trivial (no server HTML) and two generations of legacy URLs need redirect mapping.
- Interaction/food-drug dosing tables and discussion-guide content add some block work.
- Upside: moving SPA → EDS static delivery is a clear performance/SEO win.
