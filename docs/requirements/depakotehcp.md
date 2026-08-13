# Requirements: Depakote HCP (depakotehcp.com)

**Product:** DEPAKOTE® / DEPAKOTE® ER (divalproex sodium) — AbbVie Inc. Delayed-release and extended-release oral tablets.
**Audience:** U.S. Healthcare Professionals (HCP-facing). **Multi-indication product**: a single molecule treats (1) *manic episodes associated with bipolar disorder*, (2) *epilepsy / seizures* (complex partial, simple/complex absence, adjunctive), and (3) *prophylaxis of migraine headaches*. Each indication has distinct dosing (e.g. epilepsy 10–15 mg/kg/day titrated to ≤60 mg/kg/day; migraine ER 500→1,000 mg/day). Carries **BOXED WARNINGS** (hepatotoxicity, pancreatitis, teratogenicity/fetal risk).

> Data basis: Live HTML could not be fetched (WebFetch denied; Bash/curl denied in this environment) — **page inventory reconstructed from WebSearch `site:depakotehcp.com` + general search; treat as estimates.** Search confirms the HCP experience now resolves under **`depakote.com/hcp/*`** while `depakotehcp.com` remains the brand entry domain (homepage, `/prescribing-information`, `/site-map`, `/assets/pdf/lcn.pdf` all return 200 in search; `/safety` 404s). Design-system specifics below are UNVERIFIED.

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| HCP Home | `/` → `/hcp` | HCP landing, indication overview, audience confirmation | Hero + selector |
| Bipolar Mania (overview) | `/hcp/bipolar-mania` (est.) | Acute manic episode indication, efficacy | Article + clinical data |
| Bipolar Mania – Dosing | `/hcp/bipolar-mania-dosing` | Dosing & titration for mania | Dosing table |
| Epilepsy (overview) | `/hcp/epilepsy` (est.) | Seizure indication (partial/absence/adjunctive) | Article + clinical data |
| Epilepsy – Dosing | `/hcp/epilepsy-dosing` (est.) | mg/kg titration schedule | Dosing table |
| Migraine Prophylaxis (overview) | `/hcp/migraine` (est.) | Migraine prevention indication, efficacy | Article + clinical data |
| Migraine – Dosing | `/hcp/migraine-dosing` (est.) | DR & ER dosing | Dosing table |
| Safety / Warnings | `/hcp/safety` (est.; `/safety` 404 today) | Boxed warnings, contraindications, AEs | Regulatory long-form |
| Prescribing Information | `/prescribing-information`, `/hcp/prescribing-information` | Full PI | Long-form / PDF-backed |
| Important PI Update (Dear HCP letter) | `/assets/pdf/lcn.pdf` | FDA-mandated PI update notice | PDF |
| Formulations / Med Guide | `/hcp/formulations` (est.) | DR vs ER vs sprinkle; Medication Guide | Article / spec list |
| Resources & Downloads | `/hcp/resources` (est.) | Dosing guides, references, PDFs | Resource list |
| References | inline / `/references` (est.) | Numbered citations | Regulatory |
| ISI | inline (sticky) + dedicated | Important Safety Information | Regulatory |
| Site Map | `/site-map` | Navigation index | Index page |

**Estimated page count:** ~14–20 unique pages (3 indications × ~2 pages [overview + dosing] + shared Home/Safety/PI/Formulations/Resources/References/SiteMap + PDFs). VERIFIED routes: `/`, `/prescribing-information`, `/site-map`, `/assets/pdf/lcn.pdf`, `/hcp`, `/hcp/bipolar-mania-dosing`, `/hcp/prescribing-information`. All others (est.).

## Block Inventory Mapping

| Section | Existing block | New block needed | Notes |
|---|---|---|---|
| HCP gate / audience confirmation | `audience-gate` | — | Reuse; HCP-only attestation interstitial |
| Sticky ISI bar | `isi-bar` | — | Reuse; source from `/fragments/isi` (boxed warnings summary) |
| Header / footer / nav | `header`, `footer`, `navigation` | — | Reuse |
| Indication switcher (mania / epilepsy / migraine) | partial `nav-cards` | **`indication-selector`*** | Custom interactive multi-indication switch; shared with depakote.com / lupron |
| Hero | `hero-carousel` | — | Single-slide config |
| Per-indication explainer | `split-section` | — | Image + text |
| Efficacy / key stats callouts | `stat-bar` | — | Reuse (e.g. trial discontinuation rates) |
| Dosing schedule per indication | — | **`dosing-table`*** | Responsive clinical dosing table (mg/kg, titration) |
| Clinical trial / efficacy data | — | **`clinical-data-table`*** | Trial design, n, endpoints, p-values |
| Boxed warnings / contraindications | `split-section` | — | High-emphasis callout styling; content from PI |
| References / citations | — | **`reference-list`*** | Numbered citations (PI references) |
| Downloadable PI / dosing guides / Med Guide | `resource-list` | **`downloadable-resource`*** | Document cards + PDF download |
| Tabbed indication content | `tabs` | — | Reuse for indication tab views if used |
| Promo / CTA banner | `promo-banner` | — | Reuse |

**New blocks:** `indication-selector`*, `dosing-table`*, `clinical-data-table`*, `reference-list`*, `downloadable-resource`* (* = shared across portfolio).

## Design System
- **Colors:** UNVERIFIED (HTML not fetched). Expect AbbVie corporate palette — primary navy (≈`#071d49`) with brand accent; confirm against live CSS.
- **Typography:** UNVERIFIED — likely AbbVie brand font with system fallback; confirm webfont source.
- **Libraries:** UNVERIFIED — AbbVie sister sites use jQuery + Bootstrap (incl. bootstrap-select); assume same pending verification.
- **Responsive:** UNVERIFIED — assume Bootstrap breakpoints + mobile hamburger nav; rebuild on EDS mobile-first breakpoints.

## Integrations & Third-Party
- **Analytics / tag mgmt:** UNVERIFIED — expect Adobe Experience Platform Launch / DTM (`assets.adobedtm.com`), consistent with AbbVie portfolio.
- **Consent:** UNVERIFIED — expect OneTrust and/or Evidon/Crownpeak; confirm canonical vendor.
- **Forms:** None expected on an HCP info site beyond an HCP-gate attestation; confirm any "request a rep" / sign-up flow.
- **Video:** UNVERIFIED — none confirmed; map to `video-embed` if found.
- **Fonts:** UNVERIFIED — see Typography.
- **PDFs:** VERIFIED `/assets/pdf/lcn.pdf` (PI-update / Dear HCP letter); full PI and dosing-guide PDFs expected. Preserve all PDF assets and links.

## Content Migration
- **Volume:** ~14–20 pages + per-indication dosing/efficacy content + multiple PDFs (PI, Med Guide, dosing guides).
- **Content types:** indication overviews, per-indication dosing tables, clinical-data/efficacy tables, boxed-warning callouts, ISI/PI long-form, downloadable PDFs, references.
- **Regulatory:**
  - **BOXED WARNINGS** (reproduced verbatim, high emphasis): hepatotoxicity / hepatic failure (esp. first 6 months, children <2), pancreatitis (life-threatening), teratogenicity / fetal risk (decreased IQ, neural tube defects). Plus POLG-mutation / mitochondrial-disorder contraindication.
  - **ISI** fair-balance on every page (sticky `isi-bar`) summarizing boxed warnings.
  - **Full PI** + **Medication Guide** linked from every page.
  - **References:** numbered citations to PI and clinical literature → `reference-list`.
  - **PRC / job codes:** AbbVie footer codes (format `US-DEPA-######` or `US-DPKT-######`) must be preserved verbatim on each page.
- **Redirects:** map `depakotehcp.com/*` and legacy paths → new EDS `/hcp/*` routes; preserve `depakote.com/hcp` cross-domain entry; honor existing `/site-map` and PDF asset URLs.
- **SEO:** preserve titles/meta descriptions; HCP pages should retain canonical/noindex posture as currently set.
- **Accessibility (WCAG 2.1 AA):** HCP-gate focus trap; ISI keyboard expand/collapse; dosing-table & clinical-data-table proper `<th>`/scope and caption; boxed-warning contrast ≥4.5:1; semantic heading hierarchy.

## Migration Complexity
**Medium–High.**
- Multi-indication IA (bipolar mania / epilepsy / migraine) requiring a custom `indication-selector` plus three sets of dosing and clinical-data tables.
- Heavy regulated content — **BOXED WARNINGS**, full PI, Medication Guide, per-indication safety — raises medical-legal / PRC review load and verbatim-fidelity requirements.
- Data basis is search-derived only (live HTML unavailable here): design system, analytics, consent, and most routes are UNVERIFIED and must be confirmed by fetching live HTML before build.
- Cross-domain consolidation (`depakotehcp.com` ↔ `depakote.com/hcp`) needs a clear redirect/canonical strategy.
- No complex forms expected, which caps complexity below High.
