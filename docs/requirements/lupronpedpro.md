# Requirements: LUPRON DEPOT-PED (lupronpedpro.com)

**Product:** LUPRON DEPOT-PED® (leuprolide acetate for depot suspension) — AbbVie.
**Audience:** Caregivers/parents of children diagnosed with **Central Precocious Puberty (CPP)**, plus HCPs. Therapeutic area: pediatric endocrinology. The tone is caregiver-support oriented (journey guides, "what every caregiver should know").

> Data basis: the live site is **WAF-blocked (HTTP 403)** to automated fetchers, so structure below is reconstructed from `site:lupronpedpro.com` WebSearch results (verified URLs) plus AbbVie DTC conventions. Design tokens and integration vendors are **inferred from AbbVie portfolio standards and marked UNVERIFIED** — confirm against a manual/browser crawl.

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home | `/` | Landing, CPP + treatment intro | Hero + nav cards |
| Do you suspect CPP? | `/do-you-suspect-central-precociouspuberty.html` | Symptoms, diagnosis, treatment overview | Article / checklist |
| About / Heritage | `/heritage.html` | Product heritage & background | Article |
| Important Safety Information | `/isi.html` | Full ISI | Regulatory |
| Medical Necessity Letter | `/medical-necessity.html` | Sample insurance documentation | Article + downloadable |
| Patient Support PLUS & Resources | `/support-plus-and-resources.html` | Co-pay/support program, resources | CTA + resource grid |
| Caregiver journey (PDF) | `/assets/files/...caregiver-journey-en.pdf` | Caregiver education | PDF |
| Support PLUS getting started (PDF) | `/assets/files/...getting-started.pdf` | Enrollment guide | PDF |
| Treatment brochure (PDF) | `/assets/files/...treatment-brochure.pdf` | Treatment overview | PDF |

**Estimated page count:** ~6–9 HTML pages + 3–5 PDFs.

## Block Inventory Mapping

| Section observed/expected | Existing block | New block needed | Notes |
|---|---|---|---|
| HCP/caregiver gate | `audience-gate` | — | Reuse |
| Sticky ISI | `isi-bar` | — | Reuse, `/fragments/isi` |
| Header/footer/nav | `header`,`footer`,`navigation` | — | Reuse |
| Hero | `hero-carousel` | — | Single slide |
| Primary destination cards | `nav-cards` | — | Reuse |
| CPP symptom/diagnosis explainer | `split-section` | — | Image + text |
| Symptom checklist | — | **`symptom-checklist`** (or reuse `tabs`) | Caregiver self-assessment list — confirm interactivity |
| Support program CTA | `promo-banner` | **`savings-card`** (shared) | Support PLUS enrollment |
| Medical Necessity Letter / downloads | `resource-list` | **`downloadable-resource`** (shared) | Document download cards |
| References | — | **`reference-list`** (shared) | Citations |

**New blocks:** `savings-card`*, `downloadable-resource`*, `reference-list`* (shared); possibly `symptom-checklist`. (* = portfolio-reusable.)

## Design System *(UNVERIFIED — confirm against live site)*
- **Colors:** AbbVie pediatric brand palette — expect a warm/approachable secondary alongside AbbVie navy `#071d49`. Confirm hex from live CSS.
- **Typography:** AbbVie brand font (likely shared with lupron.com); confirm webfont source.
- **Imagery:** caregiver/child lifestyle photography.
- **Responsive:** mobile-first; hamburger nav.

## Integrations & Third-Party *(UNVERIFIED — AbbVie portfolio defaults)*
- **Analytics:** Adobe Launch/DTM (`assets.adobedtm.com`) — standard across AbbVie sites.
- **Consent:** OneTrust (and possibly Evidon) — confirm.
- **Forms:** Support PLUS enrollment (likely off-site / AbbVie patient-services platform).
- **PDFs:** caregiver journey, getting-started, treatment brochure, medical necessity letter.
- **No** video/maps confirmed.

## Content Migration
- **Volume:** ~6–9 pages + several PDFs.
- **Content types:** caregiver education, CPP disease info, ISI, medical-necessity template, support-program collateral.
- **Regulatory:** pediatric ISI/PI fair balance; medical necessity letter is insurance-sensitive boilerplate (preserve verbatim); reference citations; AbbVie PRC/job codes (`US-LUPR-######` seen in PDF filenames) preserved.
- **Redirects:** legacy `.html` → EDS paths.
- **SEO/metadata:** preserve per-page titles.
- **Accessibility:** WCAG 2.1 AA; caregiver audience skews accessibility-sensitive (clear language, focusable downloads).

## Migration Complexity
**Low–Medium.**
- Small, mostly static page set with standard pharma blocks (gate, ISI, cards, resources).
- No multi-indication IA and no heavy interactivity.
- Main risk is **lack of crawlable access** (WAF block) — requires a manual content export before build, and design tokens/vendors must be re-verified rather than scraped.
