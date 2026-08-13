# Requirements: LILETTA for HCPs (lilettahcp.com)

**Product:** LILETTA® (levonorgestrel-releasing intrauterine system, 52 mg) — AbbVie (Allergan) with **Medicines360**. HCP-facing companion to liletta.com.
**Audience:** **Healthcare professionals** (OB/GYNs, prescribers, office staff). Mandatory HCP gate. Content emphasizes clinical efficacy/safety data, product specs, insertion technique, ordering & reimbursement, and rep engagement.

> Data basis: homepage HTML fetched live (HTTP 200, 56 KB) + verified `sitemap.xml` (9 URLs) + `robots.txt` (reimbursement PDF paths). High-confidence file.

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home | `/` (`/en`) | HCP landing, "8 YEARS / 5 YEARS" efficacy hero | Hero + stats |
| Efficacy – Pregnancy prevention | `/efficacy-pregnancy-prevention` | Clinical efficacy data (up to 8 yrs) | Data tables/charts |
| Efficacy – HMB | `/efficacy-hmb` | HMB efficacy (up to 5 yrs) | Data tables/charts |
| Safety – Common adverse reactions | `/safety-common-adverse-reactions` | AE data | Data table |
| Safety – Pregnancy prevention | `/safety-pregnancy-prevention` | Safety profile | Article + data |
| Safety – HMB | `/safety-hmb` | Safety profile | Article + data |
| Product features | `/iud-product-features` (#key-features, #product-specifications, #when-to-insert, #insertion-video) | Specs, when to insert, insertion video | Spec list + video |
| Resources | `/resources` (#resource-ordering, #access-connect, #medicines360, #help, #downloadable-resources) | Ordering, AccessConnect 24/7, Medicines360, downloads | Resource hub |
| Request a Rep | `/requestrep` | Sales-rep request form | Form |
| Site Map | `/sitemap` | Utility | Utility |

**Confirmed page count:** 9 indexed pages (some with multiple anchored sections). `robots.txt` also exposes reimbursement PDFs: Billing & Coding Guide, Medical Necessity cover letter, Replacement Policy, VDP support docs.

## Block Inventory Mapping

| Section observed | Existing block | New block needed | Notes |
|---|---|---|---|
| HCP gate ("Are you a healthcare professional / Continue to Site") | `audience-gate` | — | Reuse; HCP variant required |
| Sticky ISI | `isi-bar` | — | Reuse, `/safety?id=isi` |
| Header/footer/nav | `header`,`footer`,`navigation` | — | Reuse |
| Hero with "8 YEARS / 5 YEARS" stats | `hero-carousel` + `stat-bar` | — | Reuse |
| Clinical efficacy/safety data | — | **`clinical-data-table`** | Sortable/footnoted clinical tables + charts — net-new, key driver |
| Product specifications / key features | — | **`spec-list`** (or reuse `stat-bar`) | Product attribute list |
| Insertion video | — | **`video-embed`** (Vimeo) | Vimeo player wrapper — net-new |
| Request a Rep | — | **`rep-request-form`** | Validated lead form (`form.js`) — net-new |
| AccessConnect / ordering / reimbursement | `nav-cards`/`promo-pair` | **`downloadable-resource`** (shared) | Resource hub + reimbursement PDFs |
| Medicines360 partnership | `split-section` | — | Image + text |
| References | — | **`reference-list`** (shared) | Citations |

**New blocks:** `clinical-data-table`, `video-embed`, `rep-request-form`, `spec-list`, `downloadable-resource`*, `reference-list`* (* = shared).

## Design System
- **Typography:** **Open Sans** + **Varela Round** (Google Fonts) + **Adobe Typekit** (`use.typekit.net/mrp2fbm` — shared kit with liletta.com).
- **Colors:** brand palette shared with liletta.com consumer site (coral/blue family); confirm HCP-specific accents from live CSS (home inline styles returned no hex).
- **Layout:** Bootstrap grid.
- **Responsive:** mobile-first; hamburger nav.

## Integrations & Third-Party
- **Analytics/tag mgmt:** Adobe Launch/DTM (`assets.adobedtm.com`) **+** Google Analytics (`analytics.js`).
- **Video:** **Vimeo** (`player.vimeo.com`) — insertion-technique video.
- **Consent:** CCPA cookie handling (`ccpacookies.js`) — confirm OneTrust banner.
- **Forms:** Request-a-Rep lead form (`form.js`) — needs CRM/endpoint integration (likely Veeva/AbbVie sales ops).
- **Gate:** AbbVie pop-up gate (`AbbViePopUp.js`).
- **Ordering/reimbursement:** LILETTA AccessConnectSM (24/7), Medicines360; reimbursement PDFs (billing/coding, medical necessity, replacement policy).
- **Fonts:** Google Fonts + Typekit.

## Content Migration
- **Volume:** 9 pages + clinical data tables/charts + multiple reimbursement PDFs + 1 Vimeo video.
- **Content types:** clinical efficacy/safety data (tables, footnoted), product specs, insertion video, lead form, ordering/reimbursement collateral.
- **Regulatory:** full PI + ISI; clinical-claim substantiation with **footnoted references** (fair balance critical on HCP data pages); Medicines360 co-branding; AbbVie PRC/job codes; reimbursement docs are compliance-sensitive (preserve verbatim).
- **Redirects:** `/en/*` locale-prefixed URLs → EDS paths; preserve anchored deep-links (`#insertion-video`, etc.).
- **SEO/metadata:** strong meta present; preserve.
- **Accessibility:** WCAG 2.1 AA — data tables need proper `<th>`/scope/caption + footnote association; Vimeo needs captions; rep form needs labels/errors.

## Migration Complexity
**Medium–High.**
- Clinical efficacy/safety **data tables with footnoted references** are the core effort + carry the heaviest medical-legal review.
- Net-new `clinical-data-table`, `rep-request-form` (CRM-integrated), and `video-embed` blocks.
- HCP gate + dual analytics (Adobe + GA) + reimbursement PDF compliance add overhead. Shares fonts/brand with liletta.com (some design reuse).
