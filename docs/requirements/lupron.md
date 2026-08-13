# Requirements: LUPRON DEPOT (lupron.com)

**Product:** LUPRON DEPOT® (leuprolide acetate for depot suspension) — AbbVie.
**Audience:** Adult patients + caregivers (consumer/DTC), with an audience gate that also routes healthcare professionals. **Multi-indication site**: the single product treats *endometriosis*, *anemia due to uterine fibroids* (pre-surgery), and *advanced prostate cancer*, each with distinct dosing strengths (3.75 mg, 7.5 mg, 11.25 mg, 22.5 mg, 30 mg, 45 mg). Pediatric central precocious puberty lives on the separate `lupronpedpro.com` property.

> Data basis: homepage HTML fetched live (HTTP 200, 35 KB) + WebSearch. `sitemap.xml` returns 404, so the page inventory below is reconstructed from on-page navigation and search — treat counts as estimates.

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home / Indication chooser | `/` | Landing + "How can LUPRON DEPOT help?" indication routing | Hero + selector |
| Prescribing Information | `/pi.html` | Full PI | Long-form / PDF-backed |
| Medication Guide update | `/pdf/lch.pdf` | FDA med-guide update | PDF |
| Endometriosis – about/treatment | `/endometriosis*` (est.) | Indication overview, dosing 3.75/11.25 mg + norethindrone | Article + dosing |
| Uterine fibroids / anemia | `/fibroids*` (est.) | Pre-surgery anemia management | Article + dosing |
| Advanced prostate cancer | `/prostate*` (est.) | Indication overview, 1/3/4/6-month formulations | Article + dosing |
| Dosing & administration | per-indication | Strength/schedule by indication | Table |
| Savings & Support | external → `luprongyn.com/savings-and-support` | Copay card ("as little as $10"), myAbbVie Assist | CTA / form |
| FAQs | `/faqs` (est.) | Common questions | Accordion |
| ISI | inline + dedicated | Important Safety Information | Regulatory |

**Estimated page count:** ~15–22 unique pages (3 indication trees × ~4 pages + shared PI/ISI/savings/FAQ). Savings flows are largely off-site on `luprongyn.com`.

## Block Inventory Mapping

| Section observed | Existing block | New block needed | Notes |
|---|---|---|---|
| Audience gate ("I am a…" / HCP) | `audience-gate` | — | Reuse; add patient/HCP branching |
| Sticky ISI | `isi-bar` | — | Reuse; source from `/fragments/isi` |
| Header / footer / nav | `header`, `footer`, `navigation` | — | Reuse |
| Indication chooser ("How can LUPRON DEPOT help?") | partial `nav-cards` | **`indication-selector`** | bootstrap-select dropdown / card switch driving per-indication routing — not in inventory |
| Hero | `hero-carousel` | — | Single-slide config |
| Per-indication explainer | `split-section` | — | Image + text |
| Key stats / efficacy callouts | `stat-bar` | — | Reuse |
| Dosing schedule by strength | — | **`dosing-table`** | Responsive clinical dosing table |
| Savings / copay CTA | `promo-banner` | **`savings-card`** (shared) | Card with eligibility + download/route to luprongyn |
| FAQs | — | **`faq-accordion`** (shared) | Expand/collapse |
| References / citations | — | **`reference-list`** (shared) | Numbered citations |
| PI / Med Guide links | `resource-list` | — | Document cards |

**New blocks:** `indication-selector`, `dosing-table`, `savings-card`*, `faq-accordion`*, `reference-list`* (* = reusable across the portfolio).

## Design System
- **Colors:** primary navy `#071d49`, neutral grey `#3f3f3f`, white `#ffffff` (from inline styles). AbbVie corporate palette.
- **Typography:** no embedded webfont link detected on home — likely system/Bootstrap default stack with AbbVie brand font applied via CSS; confirm against live CSS.
- **Layout:** Bootstrap 5 grid (`bootstrap.bundle.min.js`, `bootstrap-select`).
- **Buttons/CTAs:** Bootstrap button components; indication-driven CTAs.
- **Responsive:** Bootstrap breakpoints; mobile hamburger nav.

## Integrations & Third-Party
- **Analytics/tag mgmt:** Adobe Experience Platform Launch / DTM (`assets.adobedtm.com`).
- **Consent:** OneTrust **and** Evidon/Crownpeak signals present — confirm which is canonical.
- **Audience gate:** on-page interstitial (HCP / patient).
- **Forms:** none on home; savings/copay enrollment handled off-site on `luprongyn.com`.
- **Libraries:** jQuery 3.6, Bootstrap, bootstrap-select.
- **PDFs:** PI (`/pi.html`), Medication Guide (`/pdf/lch.pdf`), savings card PDFs (on luprongyn).
- **No** video/maps/chat detected on home.

## Content Migration
- **Volume:** ~15–22 pages + 3 indication PI sets + multiple PDFs.
- **Content types:** long-form indication content, dosing tables, ISI/PI, Medication Guide PDFs, savings collateral.
- **Regulatory:** ISI fair-balance on every page; full PI + Medication Guide; per-indication safety; reference citations; AbbVie PRC/job codes in footer (format `US-LUPR-######`) must be preserved verbatim.
- **Cross-property links:** savings → `luprongyn.com`; pediatric → `lupronpedpro.com`. Decide whether savings is in-scope or remains external.
- **Redirects:** legacy `.html` URLs → new EDS paths.
- **SEO/metadata:** preserve titles/descriptions; meta description present.
- **Accessibility:** WCAG 2.1 AA — gate focus-trap, ISI keyboard expand, dosing-table headers.

## Migration Complexity
**Medium–High.**
- Multi-indication information architecture with a custom indication-selector and per-indication dosing tables.
- Regulated content (ISI/PI/Med Guide) across 3 indications increases QA/medical-legal review load.
- Dual consent vendors + Adobe Launch migration; savings flows split to an external property to coordinate.
