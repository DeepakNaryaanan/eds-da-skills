# Requirements: DEPAKOTE (depakote.com)

**Product:** DEPAKOTE® / DEPAKOTE® ER (divalproex sodium) — AbbVie. **Multi-indication** anticonvulsant/mood stabilizer treating (1) epilepsy/seizures (complex partial seizures in adults & children ≥10; simple and complex absence seizures), (2) acute manic or mixed episodes of bipolar disorder, and (3) prophylaxis of migraine headaches.
**Audience:** Patients/consumers (DTC). Companion HCP property is `depakotehcp.com`; notably, HCP content is also served from this same domain under `/hcp/*` paths — strong shared-codebase/design synergy with depakotehcp.

> Data basis: WebFetch and Bash/curl were **denied in this environment**, so homepage HTML could not be retrieved (size/status UNVERIFIED). Inventory below is reconstructed from `site:depakote.com` search enumeration + general search — treat counts and design-system details as estimates unless marked VERIFIED.

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home | `/` | Landing; multi-indication entry (bipolar mania, epilepsy, migraine) | Hero + promos |
| Acute bipolar mania | `/acute-bipolar-mania` | Bipolar indication overview (VERIFIED) | Article |
| Bipolar disorder resources | `/bipolar-disorder-resources` | Patient orgs/associations (VERIFIED) | Resource list |
| Epilepsy symptoms | `/epilepsy-symptoms` | Epilepsy/seizure education (VERIFIED) | Article |
| Epilepsy overview/treatment | `/epilepsy*` (est.) | Seizure indication overview | Article |
| Migraine prophylaxis | `/migraine*` (est.) | Migraine indication overview | Article |
| Important Safety Information | `/important-safety-information` | ISI incl. boxed warnings (VERIFIED) | Regulatory |
| Prescribing Information | `/prescribing-information` | Full PI (VERIFIED) | Long-form / PDF-backed |
| Savings | `/savings` | Copay/savings overview (VERIFIED) | Article + CTA |
| Savings program | `/savings-program` | Enrollment / card detail (VERIFIED) | CTA / form |
| Savings card PDF | `/Content/pdf/saving-card.pdf` | Co-pay card terms (VERIFIED) | PDF |
| How to take / dosing basics | `/dosing*` (est.) | Patient dosing & administration | Article |
| Side effects | `/side-effects*` (est.) | Tolerability overview | Article |
| References (LCN) | `/assets/pdf/lcn.pdf` | Citation list (VERIFIED) | PDF |
| HCP section | `/hcp`, `/hcp/prescribing-information`, `/hcp/bipolar-mania-dosing`, `/hcp/epilepsy-dosing`, `/hcp/generic-criteria`, `/hcp/protect-your-Rx` | HCP dosing/PI on same domain (VERIFIED) | Article / dosing |

**Estimated page count:** ~14–20 patient-facing unique pages (3 indication trees + shared ISI/PI/savings/resources), plus a co-located `/hcp/*` tree (~6+ pages) and several PDFs. Confirmed live routes include `/`, `/acute-bipolar-mania`, `/epilepsy-symptoms`, `/bipolar-disorder-resources`, `/important-safety-information`, `/prescribing-information`, `/savings`, `/savings-program`.

## Block Inventory Mapping

| Section | Existing block | New block needed | Notes |
|---|---|---|---|
| Audience gate (patient vs HCP routing) | `audience-gate` | — | Reuse; patient/HCP branch (HCP lives at `/hcp/*`) |
| Sticky ISI / boxed-warning bar | `isi-bar` | — | Reuse; boxed warnings (hepatotoxicity, pancreatitis, teratogenicity) must persist |
| Header / footer / nav | `header`, `footer`, `navigation` | — | Reuse |
| Hero | `hero-carousel` | — | Single/multi-slide config |
| Indication entry ("bipolar mania / epilepsy / migraine") | partial `nav-cards` | **`indication-selector`*** | Multi-indication routing; shared interactive |
| Topic / destination cards | `nav-cards` | — | Reuse |
| Per-indication explainer | `split-section` | — | Image + text |
| Efficacy / key-fact callouts | `stat-bar` | — | Reuse |
| Two-up promos | `promo-pair` / `promo-banner` | — | Reuse |
| Patient dosing & administration | — | **`dosing-table`*** | Responsive dosing/admin table (do-not-crush, titration) |
| Savings / copay CTA ("as little as $5", up to $100/fill; text SAVE to 58752) | `promo-banner` | **`savings-card`*** | Eligibility + enroll/download card PDF |
| Bipolar resources / org links | `resource-list` | — | Reuse |
| FAQs | — | **`faq-accordion`*** | Expand/collapse |
| References / citations | — | **`reference-list`*** | Numbered citations (LCN PDF) |
| PI / Med Guide / card PDFs | `resource-list` | **`downloadable-resource`*** | Document cards |

**New blocks:** `indication-selector`*, `dosing-table`*, `savings-card`*, `faq-accordion`*, `reference-list`*, `downloadable-resource`* (* = shared/already-planned). No net-new bespoke blocks anticipated — fully covered by the shared roadmap.

## Design System
- **Colors:** UNVERIFIED (homepage HTML not retrievable). Expect AbbVie corporate palette (navy/blue primary, neutral greys, white); confirm against live CSS.
- **Typography:** UNVERIFIED; expect AbbVie brand font + system/Bootstrap fallback stack; confirm webfont links on live site.
- **Libraries:** UNVERIFIED; pharma-DTC norm is jQuery + Bootstrap grid; confirm.
- **Responsive:** UNVERIFIED; assume Bootstrap breakpoints + mobile hamburger nav. Rebuild mobile-first per EDS standards.

## Integrations & Third-Party
- **Analytics/tag mgmt:** UNVERIFIED; AbbVie standard is Adobe Experience Platform Launch / DTM (`assets.adobedtm.com`). Confirm on live.
- **Consent:** UNVERIFIED; expect OneTrust (and possibly Evidon) cookie banner — confirm canonical vendor.
- **Forms:** Savings/copay enrollment (`/savings-program`); SMS keyword "SAVE" to 58752; needs enrollment endpoint or route to AbbVie Access / rxabbvie.com.
- **Savings:** AbbVie co-pay program — commercial insurance only, excludes government payers; card PDF at `/Content/pdf/saving-card.pdf`; cross-links to `abbvieaccess.com/brand/depakote` and `rxabbvie.com`.
- **Video:** UNVERIFIED on home; map `video-embed`* if patient-education videos exist.
- **Fonts:** UNVERIFIED (see Typography).
- **PDFs:** PI, savings card, references/LCN; likely Medication Guide. Migrate as `downloadable-resource`.

## Content Migration
- **Volume:** ~14–20 patient pages + co-located `/hcp/*` tree + multiple PDFs.
- **Content types:** multi-indication education articles, patient dosing/administration, side-effects, savings/copay, bipolar resource lists, ISI/PI, reference PDFs.
- **Regulatory:** **BOXED WARNINGS** — hepatotoxicity (incl. fatalities, esp. children <2 and mitochondrial disorders, first 6 months), pancreatitis, and teratogenicity/fetal risk (neural-tube and other birth defects) — must appear with required prominence on every page. **ISI** fair-balance sitewide (incl. suicidal thoughts/actions class warning, ~1 in 500). Full **PI** + likely Medication Guide. **References** (LCN PDF) preserved. **PRC/job codes** (format `US-DPKT-######`, seen in URLs) preserved verbatim in footer.
- **Redirects:** legacy paths and `/pagenotfound?url=` aliases → new EDS paths; preserve `/hcp/*` structure or split to depakotehcp; normalize any case-variant URLs.
- **SEO:** preserve existing titles/meta descriptions ("Depakote® (divalproex sodium): bipolar mania & epilepsy").
- **Accessibility (WCAG 2.1 AA):** gate focus-trap; ISI/boxed-warning keyboard expand; dosing-table header scope; indication-selector keyboard + AT support; reduced-motion for any animation.

## Migration Complexity
**Medium–High.**
- Multi-indication IA (bipolar mania, epilepsy, migraine) requiring `indication-selector` + per-indication `dosing-table`.
- Heavy regulated content: **multiple boxed warnings** + ISI + full PI across three indications drives significant medical-legal/QA review load.
- Shared-domain HCP content (`/hcp/*`) and design synergy with `depakotehcp.com` — must decide whether to keep co-located or split, and coordinate a shared design system.
- Data basis is weak (no live HTML retrievable here): design system, libraries, analytics, and consent vendor all require live-site verification before build — discovery risk.
