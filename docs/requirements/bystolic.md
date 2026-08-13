# Requirements: BYSTOLIC (bystolic.com)

**Product:** BYSTOLIC® (nebivolol) tablets — AbbVie (formerly Allergan/Forest). A beta-adrenergic blocking agent indicated for the treatment of **hypertension** (high blood pressure), alone or with other antihypertensives.
**Audience:** Adult patients/consumers with high blood pressure (DTC). Patient-facing; no HCP gate observed.

> Data basis: live homepage HTML fetch was **blocked** in this environment (WebFetch + curl denied) — page-level markup, JS libraries, analytics, and consent are **UNVERIFIED**. Inventory is reconstructed from `site:bystolic.com` WebSearch; the indexed routes and deep crawlable text indicate a **server-rendered HTML site** (favorable — scrapeable, not a SPA), but this must be confirmed against the rendered DOM.

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home | `/` | Landing — product + hypertension intro, savings hook | Hero + promos |
| High blood pressure treatment | `/high-blood-pressure-treatment` | How BYSTOLIC treats hypertension | Article |
| What is BYSTOLIC used for | `/high-blood-pressure-treatment/what-is-bystolic-used-for` | Indication / about the medicine | Article |
| FAQs | `/high-blood-pressure-treatment/faqs` | Common questions | Accordion |
| Signs & symptoms | `/high-blood-pressure/signs-and-symptoms` | Disease education (BP basics) | Article |
| Dosing / how to take | `/dosing` (est.) | Starting dose & titration basics | Article + table |
| Side effects & safety | `/side-effects` (est.) | Common side effects, ISI | Regulatory/Article |
| Savings / copay card | `/savings` (est.) | Copay/savings program | CTA / form |
| Talking to your doctor | `/talking-to-your-doctor` (est.) | Doctor-discussion guidance | Article |
| ISI / Prescribing Information | `/isi` (est.) + `rxabbvie.com/pdf/bystolic_pi.pdf` | Safety + full PI | Regulatory + PDF |
| Error / 404 | `/error` | Utility | Utility |

**Page count:** 6 routes VERIFIED (`/`, `/high-blood-pressure-treatment`, `.../what-is-bystolic-used-for`, `.../faqs`, `/high-blood-pressure/signs-and-symptoms`, `/error`) + 4 PDFs; ~10–14 total including estimated routes.

## Block Inventory Mapping

| Section | Existing block | New block needed | Notes |
|---|---|---|---|
| Sticky ISI | `isi-bar` | — | Reuse; beta-blocker safety (do not abruptly discontinue) |
| Header / footer / nav | `header`, `footer`, `navigation` | — | Reuse |
| Hero | `hero-carousel` | — | Single-slide home hero |
| Disease-education explainer (BP basics) | `split-section` | — | Image + text |
| Stat callouts (BP figures) | `stat-bar` | — | Reuse |
| Topic nav cards | `nav-cards` | — | Reuse |
| Dosing & titration | — | **`dosing-table`*** | Starting dose / titration to max |
| Savings / copay card | `promo-banner` | **`savings-card`*** | Eligibility + enroll/route to AbbVie program |
| Talking-to-your-doctor guide | `nav-cards` / `tabs` | **`discussion-guide`*** | Doctor-discussion prompts |
| FAQs | — | **`faq-accordion`*** | Expand/collapse |
| Downloadable resources / PI | `resource-list` | **`downloadable-resource`*** | PDF cards |
| References | — | **`reference-list`*** | Citations |

**New blocks:** `dosing-table`*, `faq-accordion`*, `savings-card`*, `discussion-guide`*, `downloadable-resource`*, `reference-list`* (* = shared/already-planned). **No brand-unique net-new block.**

## Design System *(UNVERIFIED — HTML not fetched; confirm from rendered DOM/CSS)*
- **Colors:** BYSTOLIC/AbbVie brand palette; confirm from compiled CSS.
- **Typography:** brand webfont TBD — capture from rendered `<head>`.
- **Libraries (source site):** expected jQuery + Bootstrap-style grid on a server-rendered stack; confirm.
- **Responsive:** assume responsive; rebuild mobile-first.

## Integrations & Third-Party *(confirm from rendered app)*
- **Analytics:** expect Adobe Analytics / Launch (DTM) — AbbVie standard; confirm.
- **Consent:** OneTrust (AbbVie standard) — confirm banner.
- **Forms:** savings-card activation (likely off-site / AbbVie program); confirm any on-site capture.
- **Savings:** AbbVie/Allergan copay program — confirm external host and eligibility (commercial insurance only).
- **Video:** none confirmed.
- **Fonts:** confirm webfont source.
- **PDFs:** full PI, savings card terms, Medication Guide (4 PDFs observed).

## Content Migration
- **Volume:** ~10–14 pages + ~4 PDFs. Modest.
- **Content types:** hypertension disease education, about-the-medicine, dosing, side-effects/safety, savings, FAQs, ISI/PI.
- **Regulatory:** **ISI** fair-balance on every page (beta-blocker cautions — do not abruptly discontinue, bradycardia, bronchospastic disease); full **PI** + Medication Guide; references; AbbVie **PRC/job codes** preserved verbatim.
- **Redirects:** map deep paths (`/high-blood-pressure-treatment/*`, `/high-blood-pressure/*`) 1:1 to EDS; preserve paid-search params.
- **SEO:** descriptive titled routes present; preserve titles/meta. Server-rendered source already indexable.
- **Accessibility (WCAG 2.1 AA):** heading hierarchy, form labels, FAQ keyboard expand/collapse, dosing-table header scope, persistent-ISI focus order.

## Migration Complexity
**Low–Medium.**
- Small, well-bounded content set (~10–14 pages + PDFs); **all sections map to existing or already-planned shared blocks — no brand-unique block required.**
- Source appears server-rendered (scrapeable), reducing extraction risk versus a SPA.
- Standard single-indication pharma regulatory load (ISI, PI, Med Guide, PRC codes) — preserve verbatim; no boxed warning.
- Main residual risk: live HTML not fetchable here — confirm tech stack, analytics/consent, savings flow, and the full estimated-route set before finalizing the estimate.
