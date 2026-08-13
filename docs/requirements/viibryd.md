# Requirements: VIIBRYD (viibryd.com)

**Product:** VIIBRYD® (vilazodone HCl) tablets — 10 mg / 20 mg / 40 mg — AbbVie (formerly Allergan/Forest). A serotonin partial agonist–reuptake inhibitor (SPARI) for major depressive disorder.
**Audience:** Adult patients (18+) with **major depressive disorder (MDD)**. Patient-facing DTC site (not approved for pediatric use). No HCP gate observed; consumer-only.

> Data basis: the homepage HTML could **not be fetched in this session** (WebFetch and curl both blocked by sandbox — no status/size captured), so the inventory below is built from `site:viibryd.com` WebSearch (indexed/verified routes) plus general search. URL shape is the key migration signal: clean routes (`/side-effects`, `/depression-treatment`, `/symptoms-of-depression`) coexist with a **legacy `.aspx` route** (`/viibryd-depression-treatment.aspx`) and a `/Content/` asset path — strongly indicating a **legacy ASP.NET / server-rendered site**, not an SPA. **Most important migration fact: a live HTML scrape was not obtainable here; confirm platform + capture rendered HTML before scoping content extraction.**

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home | `/` | Landing: product intro, MDD, savings hook | Hero + promo |
| What is Depression / Symptoms | `/symptoms-of-depression` | Disease education, MDD symptoms | Article |
| Depression Treatment Options | `/depression-treatment` | How VIIBRYD treats MDD, efficacy | Article |
| Side Effects & Safety | `/side-effects` | Common side effects, ISI/safety | Regulatory/Article |
| Talking With Your Doctor | `/talking-with-your-doctor-about-depression-treatment` | Doctor-conversation guidance | Article |
| Doctor Depression Guide | `/doctor-depression-guide` | Discussion-guide landing (→ PDF) | Article + PDF |
| Savings Program | `/savings-program` | Copay/savings card ($15/refill, $5/mo w/90-day) | CTA / form |
| The Viibe (sign-up) | `/survey` (and "The Viibe" email sign-up) | MDD/VIIBRYD updates opt-in | Form |
| Legacy treatment page | `/viibryd-depression-treatment.aspx` | Legacy ASP.NET URL (redirect source) | Article (legacy) |
| Doctor Discussion Guide (PDF) | `/Content/pdf/Doctor Discussion Guide-0622.pdf` | Downloadable guide | PDF |
| Depression Self-Screener (PDF) | `/Content/pdf/Depression Self-Screener-0622.pdf` | Downloadable screener (PHQ-style) | PDF |
| ISI / Prescribing Information | est. route + `rxabbvie.com/pdf/viibryd_pi.pdf` | Boxed warning, full ISI/PI | Regulatory + PDF |
| How to take / dosing | est. route | Starting dose 10mg→20mg→40mg, taper | Article + table |

**Estimated page count:** ~10–13 content pages + 3 PDFs (Discussion Guide, Self-Screener, PI). Routes ending `(est.)`: ISI/PI page, how-to-take/dosing page.

## Block Inventory Mapping

| Section | Existing block | New block needed | Notes |
|---|---|---|---|
| Audience gate | `audience-gate` | — | Only if a "do you have a Rx / 18+" interstitial is confirmed |
| Sticky ISI / boxed warning | `isi-bar` | — | Boxed warning (suicidality) must be persistent |
| Header / footer / nav | `header`,`footer`,`navigation` | — | Reuse |
| Hero | `hero-carousel` | — | Single-slide home hero |
| Disease-education explainer | `split-section` | — | Symptoms / how-it-works image+text |
| Prevalence / stat callouts | `stat-bar` | — | MDD stats, efficacy figures |
| Section nav / topic cards | `nav-cards` | — | Cross-links between MDD topics |
| Treatment / efficacy tabs | `tabs` | — | Efficacy vs placebo, how it works |
| Savings / copay card | `promo-banner` | **`savings-card`** | $15/refill, $5/mo (90-day); links to `allergansavingscard.com/viibryd` |
| Dosing & titration table | — | **`dosing-table`** | 10mg (7d) → 20mg → up to 40mg; taper schedule |
| Doctor-discussion guide | — | **`discussion-guide`** | On-page guide + PDF download |
| Self-screener / downloadable resource | `resource-list` | **`downloadable-resource`** | Self-Screener + Discussion Guide PDFs |
| FAQs | — | **`faq-accordion`** | SSRI-vs-SPARI, onset, side effects |
| Email sign-up ("The Viibe") | — | **`rep-request-form`** (reuse as generic form) | Opt-in capture |
| References | — | **`reference-list`** | Citations |

**New blocks:** `savings-card`*, `dosing-table`*, `discussion-guide`*, `downloadable-resource`*, `faq-accordion`*, `reference-list`* (all shared/portfolio-reusable). No brand-unique block identified.

## Design System *(UNVERIFIED — HTML not fetched this session; confirm from rendered DOM/CSS)*
- **Colors:** VIIBRYD brand palette (tablet colors red/orange/light-blue suggest a multi-hue accent set); confirm from compiled CSS.
- **Typography:** webfont TBD — capture from rendered `<head>`/CSS.
- **Libraries (source site):** likely legacy ASP.NET server-rendered + jQuery (inferred from `.aspx` route and `/Content/` path); confirm.
- **Responsive:** assume responsive; rebuild as static EDS sections regardless.

## Integrations & Third-Party *(confirm from rendered app)*
- **Analytics:** expect Adobe Analytics / Launch (DTM) — AbbVie/Allergan standard; confirm.
- **Consent:** OneTrust (AbbVie standard) — confirm banner + cookie categories.
- **Forms:** savings-card activation (off-site `allergansavingscard.com/viibryd`), "The Viibe" email sign-up, optional self-screener.
- **Savings:** off-site Allergan/AbbVie Savings Card (`allergansavingscard.com/viibryd`) + AbbVie Access (`abbvieaccess.com/brand/viibryd`).
- **Video:** none confirmed.
- **Fonts:** confirm webfont source (self-hosted vs Typekit/Google).
- **PDFs:** Doctor Discussion Guide, Depression Self-Screener, full PI (`rxabbvie.com`).

## Content Migration
- **Volume:** ~10–13 pages + 3 PDFs. Modest.
- **Content types:** MDD disease education, efficacy/safety, dosing/titration, doctor-discussion, savings, opt-in form.
- **Regulatory:**
  - **BOXED WARNING** — suicidal thoughts and behaviors with antidepressants (pediatric/young-adult risk); reproduce verbatim and keep persistent/prominent.
  - **ISI** — fair-balance Important Safety Information on every page; preserve exactly.
  - **PI** — full prescribing information (`viibryd_pi.pdf`); Medication Guide.
  - **References** — citation list per page.
  - **PRC / job codes** — preserve AbbVie/Allergan approval (PRC) job-code footnotes on every page and PDF.
- **Redirects:** map legacy `.aspx` (e.g. `/viibryd-depression-treatment.aspx`) and `/Content/` paths → new EDS paths. Expect stale paid-search links with `?guid=`/`mkwid` params — ensure they resolve.
- **SEO:** preserve titled routes; maintain meta titles/descriptions; legacy `.aspx` → clean-URL 301s.
- **Accessibility:** WCAG 2.1 AA — heading hierarchy, form labels, PDF alt text, persistent-ISI focus order, contrast across the multi-hue palette.

## Migration Complexity
**Low–Medium.**
- Small, well-bounded content set (~10–13 pages + 3 PDFs); all sections map to existing or already-planned shared blocks — **no brand-unique block required**.
- Main risks are non-content: (1) **source HTML not fetchable here** — confirm platform and capture rendered HTML before extraction; (2) **legacy `.aspx` + `/Content/` URLs** plus paid-search `?guid=` params need a deliberate redirect map; (3) standard pharma regulatory load — boxed warning, persistent ISI, PI/Med Guide, PRC job codes — preserve verbatim.
- Off-site savings/sign-up flows are external links/forms, keeping on-site form complexity low.
- **Strong design/block synergy with fetzima.com** (sibling AbbVie antidepressant brand) — token theming + shared blocks amortize across both.
