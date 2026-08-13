# Requirements: FETZIMA (fetzima.com)

**Product:** FETZIMA® (levomilnacipran extended-release) capsules — 20 mg / 40 mg / 80 mg / 120 mg, plus a **Titration Pack** (2 × 20 mg + 26 × 40 mg) — AbbVie (formerly Allergan/Forest). A serotonin and norepinephrine reuptake inhibitor (**SNRI**) for **major depressive disorder (MDD)** in adults.
**Audience:** Adult patients (18+) with MDD. Patient-facing DTC site; not for pediatric use. No HCP gate observed.

> Data basis: homepage HTML was **NOT fetchable** here (WebFetch + curl blocked by tool policy — not a confirmed WAF 403). Inventory is built from `site:fetzima.com` WebSearch (verified routes) + FDA/DailyMed product facts. Design system, analytics, consent, and gate type are **UNVERIFIED** pending a live HTML pull. **Strong design/block synergy with viibryd.com** (sibling AbbVie SNRI/antidepressant brand) — theme via token overrides, reuse the same blocks.

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home | `/` | Landing — MDD + product intro, savings hook | Hero + promos |
| Why FETZIMA | `/why-fetzima` | Product positioning / how it helps MDD | Article |
| Understanding depression | `/understanding-depression` | Disease education (MDD symptoms) | Article |
| Treatment for depression | `/about/treatment-for-depression` | Treatment landscape / how FETZIMA fits | Article |
| Antidepressant medication | `/about/antidepressant-medication` | SNRI class / mechanism education | Article |
| Important risk information / safety | `/important-risk-information/safety` | Boxed warning + ISI/safety | Regulatory |
| Savings program | `/savings-program` | Copay/savings card | CTA / form |
| Savings card | `/depression-resources/savings-card` | Card detail / activation | CTA / PDF |
| Dosing / titration | `/dosing` (est.) | Titration Pack → 40–120 mg schedule | Article + table |
| Talking to your doctor | `/talking-to-your-doctor` (est.) | Doctor-discussion guidance | Article |
| FAQs | `/faqs` (est.) | Common questions | Accordion |
| ISI / Prescribing Information | external → `rxabbvie.com/pdf/fetzima_pi.pdf` | Full PI / boxed warning | Regulatory PDF |

**Page count:** 8 VERIFIED HTML routes + 3 VERIFIED on-site PDFs, ~5 estimated → **~13–16 pages** total. Savings external at `allergansavingscard.com/fetzima` ($10/fill, up to $1,740/yr, commercial insurance only).

## Block Inventory Mapping

| Section | Existing block | New block needed | Notes |
|---|---|---|---|
| Audience gate | `audience-gate` | — | Only if an 18+/Rx interstitial is confirmed |
| Sticky ISI / boxed warning | `isi-bar` | — | Boxed warning (suicidality) must be persistent |
| Header / footer / nav | `header`, `footer`, `navigation` | — | Reuse |
| Hero | `hero-carousel` | — | Single-slide home hero |
| Disease / class explainer | `split-section` | — | MDD symptoms / SNRI mechanism |
| Stat callouts | `stat-bar` | — | MDD prevalence / efficacy figures |
| Topic nav cards | `nav-cards` | — | About / treatment entry points |
| Treatment / efficacy tabs | `tabs` | — | How it works vs placebo |
| Savings / copay card | `promo-banner` | **`savings-card`*** | $10/fill; route to `allergansavingscard.com/fetzima` |
| Dosing & titration table | — | **`dosing-table`*** | Titration Pack → 40–120 mg schedule |
| Talking-to-your-doctor guide | `nav-cards` / `tabs` | **`discussion-guide`*** | Doctor-discussion prompts |
| Downloadable resources / PI | `resource-list` | **`downloadable-resource`*** | PDF cards |
| FAQs | — | **`faq-accordion`*** | Expand/collapse |
| References | — | **`reference-list`*** | Citations |

**New blocks:** `savings-card`*, `dosing-table`*, `discussion-guide`*, `downloadable-resource`*, `faq-accordion`*, `reference-list`* (all shared/portfolio-reusable). **No brand-unique net-new block** — shares the entire antidepressant pattern with viibryd.

## Design System *(UNVERIFIED — HTML not fetched; confirm from rendered DOM/CSS)*
- **Colors:** FETZIMA/Allergan brand palette; confirm from compiled CSS. Coordinate token base with viibryd (sibling brand).
- **Typography:** brand webfont TBD — capture from rendered `<head>`.
- **Libraries (source site):** expected jQuery + Bootstrap-style grid on a legacy Allergan stack; confirm.
- **Responsive:** rebuild mobile-first.

## Integrations & Third-Party *(confirm from rendered app)*
- **Analytics:** expect Adobe Analytics / Launch (DTM) — AbbVie/Allergan standard; confirm.
- **Consent:** OneTrust (AbbVie standard) — confirm banner.
- **Forms:** savings-card activation (off-site `allergansavingscard.com/fetzima`); confirm any on-site capture.
- **Savings:** off-site Allergan/AbbVie Savings Card; AbbVie Access for affordability.
- **Video:** none confirmed.
- **Fonts:** confirm webfont source.
- **PDFs:** full PI (`rxabbvie.com`), savings-card terms, plus on-site resource PDFs (3 confirmed).

## Content Migration
- **Volume:** ~13–16 pages + 3 PDFs. Modest.
- **Content types:** MDD disease education, SNRI-class education, efficacy/safety, dosing/titration, doctor-discussion, savings.
- **Regulatory:**
  - **BOXED WARNING** — suicidal thoughts and behaviors with antidepressants (pediatric/young-adult risk; not for children); reproduce verbatim and keep persistent/prominent.
  - **ISI** — fair-balance on every page; preserve exactly.
  - **PI** — full prescribing information (`fetzima_pi.pdf`); Medication Guide.
  - **References** — citation list per page.
  - **PRC / job codes** — preserve AbbVie/Allergan approval (PRC) job-code footnotes on every page and PDF.
- **Redirects:** map paths (`/about/*`, `/important-risk-information/*`, `/depression-resources/*`) 1:1; expect paid-search `?guid=`/`mkwid` params — ensure they resolve.
- **SEO:** preserve descriptive titles/meta.
- **Accessibility (WCAG 2.1 AA):** heading hierarchy, form labels, PDF alt text, persistent-ISI focus order, dosing-table header scope.

## Migration Complexity
**Low–Medium.**
- Small, well-bounded content set (~13–16 pages + 3 PDFs); all sections map to existing or already-planned shared blocks — **no brand-unique block required**.
- **Strong synergy with viibryd.com**: the antidepressant block set, ISI/boxed-warning pattern, savings flow, and design tokens are shared — building both together substantially amortizes effort.
- Standard antidepressant regulatory load — boxed warning, persistent ISI, PI/Med Guide, PRC job codes — preserve verbatim.
- Residual risk: live HTML not fetchable here — confirm tech stack, analytics/consent, and savings flow before finalizing.
