# Requirements: RESTASIS (restasis.com)

**Product:** RESTASIS® / RESTASIS MULTIDOSE® (cyclosporine ophthalmic emulsion) 0.05% — Allergan, an AbbVie company. Increases tear production in patients whose tear production is presumed suppressed due to ocular inflammation associated with **chronic dry eye disease (keratoconjunctivitis sicca)**.
**Audience:** Adult patients/consumers with chronic dry eye (DTC). Single indication. Patient-facing; no HCP gate observed.

> Data basis: homepage HTML was **NOT fetchable** in this environment (WebFetch + curl denied). Inventory is reconstructed from `site:restasis.com` WebSearch (verified routes) + general search; design and integration details are **UNVERIFIED** pending a live scrape. A legacy `m.restasis.com` mobile host appears to exist — confirm and consolidate.

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home | `/` | Landing — chronic dry eye + product intro, savings hook | Hero + promos |
| How it works | `/about-restasis/how-it-works` | Mechanism (increases tear production) | Article + diagram |
| Getting started | `/about-restasis/getting-started` | How to start / what to expect | Article |
| Efficacy & safety | `/about-restasis/efficacy-and-safety` | Clinical results + safety | Clinical data table + ISI |
| RESTASIS and artificial tears | `/about-restasis/restasis-and-artificial-tears` | Differentiation vs OTC drops | Comparison article |
| FAQs | `/about-restasis/faqs` | Common questions | Accordion |
| What is chronic dry eye | `/chronic-dry-eye-disease/what-is-chronic-dry-eye` | Disease education | Article |
| Treatment options | `/chronic-dry-eye-disease/treatment-options` | Treatment landscape | Article |
| Save now | `/save-now` | Savings / copay program entry | CTA / form |
| Print savings card | `/e-card-print` | Printable savings card | Print / PDF flow |
| Savings confirmation | `/savings-confirmation` | Post-enrollment confirmation | Confirmation page |
| How to apply (video) | `/how-to-apply` (est.) | Application instructions | Article + video |
| ISI / Prescribing Information | external → `rxabbvie.com/pdf/restasis_pi.pdf` | Full PI | Regulatory PDF |

**Page count:** ~12–16. VERIFIED routes include `/`, the four `/about-restasis/*` pages, the two `/chronic-dry-eye-disease/*` pages, and the savings flow (`/save-now`, `/e-card-print`, `/savings-confirmation`). PI hosted off-site at `rxabbvie.com`.

## Block Inventory Mapping

| Section | Existing block | New block needed | Notes |
|---|---|---|---|
| Sticky ISI | `isi-bar` | — | Reuse; ophthalmic-emulsion safety |
| Header / footer / nav | `header`, `footer`, `navigation` | — | Reuse |
| Hero | `hero-carousel` | — | Single-slide home hero |
| Disease / how-it-works explainer | `split-section` | — | Image + text |
| Stat callouts | `stat-bar` | — | Tear-production / prevalence figures |
| Topic nav cards | `nav-cards` | — | About vs disease-education entry points |
| Efficacy & safety data | — | **`clinical-data-table`*** | Trial results table |
| RESTASIS vs artificial tears | — | **`comparison-table`*** | Differentiation grid |
| How-to-apply video | — | **`video-embed`*** | Application instruction video |
| Savings / copay card + print/confirm flow | `promo-banner` | **`savings-card`*** + **`rep-request-form`*** (adapted to patient enrollment) | Multi-step enroll → print → confirm |
| FAQs | — | **`faq-accordion`*** | Expand/collapse |
| References | — | **`reference-list`*** | Citations |

**New blocks:** `clinical-data-table`*, `comparison-table`*, `video-embed`*, `savings-card`*, `rep-request-form`* (adapted to patient enrollment), `faq-accordion`*, `reference-list`* (all shared). **No `locator-map`** — find-a-doctor is editorial only, if present.

## Design System *(UNVERIFIED — HTML not fetched; confirm from rendered DOM/CSS)*
- **Colors:** RESTASIS/Allergan eye-care brand palette (blue/teal family expected); confirm from compiled CSS.
- **Typography:** brand webfont TBD — capture from rendered `<head>`.
- **Libraries (source site):** expected jQuery + Bootstrap-style grid; legacy mobile host (`m.restasis.com`) suggests an aging stack. Confirm.
- **Responsive:** rebuild mobile-first; retire the separate `m.` host into a single responsive EDS site.

## Integrations & Third-Party *(confirm from rendered app)*
- **Analytics:** expect Adobe Analytics / Launch (DTM) — AbbVie/Allergan standard; confirm.
- **Consent:** OneTrust (AbbVie standard) — confirm banner.
- **Forms:** savings enrollment flow (`/save-now` → `/e-card-print` → `/savings-confirmation`) — multi-step; confirm endpoint, eligibility logic, and any PII capture.
- **Savings:** AbbVie/Allergan copay program — confirm external vs on-site enrollment.
- **Video:** how-to-apply video expected — confirm host (YouTube/Brightcove/Vimeo).
- **Fonts:** confirm webfont source.
- **PDFs:** full PI (`rxabbvie.com`), printable savings card.

## Content Migration
- **Volume:** ~12–16 pages + savings flow + PI PDF. Modest.
- **Content types:** chronic-dry-eye disease education, mechanism/efficacy/safety, comparison vs artificial tears, application video, multi-step savings enrollment, FAQs, ISI/PI.
- **Regulatory:** **ISI** fair-balance on every page; full **PI**; references; AbbVie **PRC/job codes** preserved verbatim; PI may still cite Allergan — verify current labeling.
- **Redirects:** map `/about-restasis/*` and `/chronic-dry-eye-disease/*` paths 1:1; **consolidate the legacy `m.restasis.com` mobile host** into the responsive EDS site with 301s; preserve savings-flow URLs.
- **SEO:** strong descriptive routes; preserve titles/meta.
- **Accessibility (WCAG 2.1 AA):** eye-care audience → high contrast and resizable text matter; clinical/comparison tables need `<th scope>`/caption; multi-step savings form needs labels, error states, and focus management; video needs captions.

## Migration Complexity
**Medium.**
- Moderate page count with several net-new (shared) blocks: `clinical-data-table`, `comparison-table`, `video-embed`, plus a **multi-step savings enrollment flow** (`savings-card` + form) that is the main interactive driver.
- Single indication and no boxed warning keep the regulatory load standard (vs. multi-indication or boxed-warning brands).
- Legacy `m.` mobile-host consolidation and savings-flow endpoint integration add coordination overhead.
- Residual risk: live HTML not fetchable here — confirm tech stack, analytics/consent, savings endpoint, and video host before finalizing.
