# Requirements: TAYTULLA (taytulla.com)

**Product:** TAYTULLA® (norethindrone acetate 1 mg / ethinyl estradiol 20 mcg softgel capsules + ferrous fumarate 75 mg placebo capsules; 28-capsule pack, 24 active + 4 non-hormonal) — AbbVie (formerly Allergan). An **oral contraceptive** for prevention of pregnancy.
**Audience:** Women of reproductive age (DTC, consumer-facing). Patient-facing site; expect an age/audience interstitial. A separate HCP property exists at `hcp.taytulla.com`. No traditional boxed warning, but **contraindicated in smokers > 35** (cardiovascular risk) — standard combined-OC safety framing.

> Data basis: homepage HTML could **NOT be fetched** here (WebFetch + curl/Bash denied). All findings are VERIFIED via WebSearch — `site:taytulla.com` route enumeration plus FDA PI / DailyMed product facts. Design-system and integration specifics remain **UNVERIFIED** (no rendered HTML inspected). Medium-confidence file.

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home | `/` | Landing — product + birth-control intro, savings hook | Hero + promos |
| About TAYTULLA | `/about` | Product overview (softgel OC) | Article |
| Taking TAYTULLA | `/taking-taytulla` | How to take, missed-pill guidance | Article + steps |
| Ready for TAYTULLA | `/ready-for-taytulla` | Getting started / what to expect | Article |
| Understanding birth control | `/understanding-birth-control` | Contraception education | Article |
| Breakthrough bleeding | `/breakthrough-bleeding` | Managing spotting/bleeding | Article |
| Comparison tool | `/comparison-tool` | Compare TAYTULLA vs other contraception | Interactive tool |
| Chatting with your HCP | `/chatting-with-your-hcp` | Discussion-guide builder | Interactive / discussion guide |
| Tools & resources | `/tools-and-resources` | Downloadables, brochure, app | Resource grid |
| Mobile app | `/mobile-app` | Pill-reminder app promo | Article + app links |
| Savings program | `/savings-program` | Copay/savings card | CTA / form |
| FAQs | `/faqs` | Common questions | Accordion |
| Search | `/search` | Site search | Utility |
| Site map | `/site-map` | Navigation index | Utility |

**Page count:** ~14 consumer URLs VERIFIED (above) + 2 PDFs (Patient Brochure, full PI) + a separate HCP subdomain (`hcp.taytulla.com`, adjacent scope). Savings external at `allergansavingscard.com/taytulla` ($25/fill, up to 13 one-month or 4 three-month fills, $2,220/yr max, commercial insurance only).

## Block Inventory Mapping

| Section | Existing block | New block needed | Notes |
|---|---|---|---|
| Age/audience interstitial | `audience-gate` | — | Reuse; age-confirm variant |
| Sticky ISI | `isi-bar` | — | Reuse; combined-OC safety (smokers >35 contraindication) |
| Header / footer / nav | `header`, `footer`, `navigation` | — | Reuse |
| Hero | `hero-carousel` | — | Single-slide home hero |
| Product / how-to explainer | `split-section` | — | Image + text |
| Stat callouts | `stat-bar` | — | Efficacy / cycle figures |
| Topic nav cards | `nav-cards` | — | About / education entry points |
| Taking / missed-pill schedule | — | **`dosing-table`*** | 24+4 regimen, missed-pill rules |
| Birth-control comparison tool | — | **`comparison-table`*** | Interactive method comparison — key driver |
| Chatting-with-your-HCP guide | — | **`discussion-guide`*** | Interactive question/discussion-guide builder — key driver |
| Savings / copay card | `promo-banner` | **`savings-card`*** | $25/fill; route to `allergansavingscard.com/taytulla` |
| Tools & resources / brochure / app | `resource-list` | **`downloadable-resource`*** | Patient Brochure PDF + app links |
| FAQs | — | **`faq-accordion`*** | Expand/collapse |
| References | — | **`reference-list`*** | Citations |

**New blocks:** `dosing-table`*, `comparison-table`*, `discussion-guide`*, `savings-card`*, `faq-accordion`*, `reference-list`*, `downloadable-resource`* (all shared/already-planned). **No brand-unique net-new block** — the two interactive tools map to `comparison-table` and `discussion-guide`.

## Design System *(UNVERIFIED — HTML not fetched; confirm from rendered DOM/CSS)*
- **Colors:** TAYTULLA/Allergan consumer brand palette (warm/feminine consumer aesthetic expected); confirm from compiled CSS.
- **Typography:** brand webfont TBD — capture from rendered `<head>`.
- **Libraries (source site):** expected jQuery + Bootstrap-style grid; the two interactive tools may use a small JS framework — confirm and re-implement as vanilla EDS.
- **Responsive:** rebuild mobile-first.

## Integrations & Third-Party *(confirm from rendered app)*
- **Analytics:** expect Adobe Analytics / Launch (DTM) — AbbVie/Allergan standard; confirm.
- **Consent:** OneTrust (AbbVie standard) — confirm banner.
- **Forms:** savings-card activation (off-site `allergansavingscard.com/taytulla`); comparison tool + HCP-chat tool are client-side interactive (no PII expected) — confirm.
- **Savings:** off-site Allergan/AbbVie Savings Card.
- **Mobile app:** pill-reminder app (App Store / Google Play links) — preserve store links; app itself out of scope.
- **Video:** none confirmed.
- **Fonts:** confirm webfont source.
- **PDFs:** Patient Brochure, full PI (`rxabbvie.com`).

## Content Migration
- **Volume:** ~14 consumer pages + 2 PDFs (+ HCP subdomain if in scope).
- **Content types:** contraception education, how-to-take/missed-pill guidance, breakthrough-bleeding management, two interactive tools (method comparison; HCP-discussion builder), savings, app promo, FAQs, ISI/PI.
- **Regulatory:** **ISI** fair-balance on every page (combined-OC risks: cardiovascular, smokers >35 contraindication, VTE); full **PI** + Patient Brochure / Detailed Patient Labeling; references; AbbVie **PRC/job codes** preserved verbatim; PI may still cite Allergan — verify current labeling.
- **Redirects:** map all consumer routes 1:1; decide co-locate vs split for the `hcp.taytulla.com` subdomain; preserve savings/app store links.
- **SEO:** preserve descriptive titles/meta.
- **Accessibility (WCAG 2.1 AA):** age-gate focus trap; the **comparison tool and HCP-discussion builder need full keyboard/AT support**, accessible state changes, and focus management; dosing/missed-pill table header scope; FAQ keyboard expand.

## Migration Complexity
**Medium.**
- Moderate page count (~14) with **two interactive tools** to rebuild as vanilla EDS — the contraceptive **comparison tool** (`comparison-table`) and the **HCP question/discussion-guide builder** (`discussion-guide`) — the main effort and accessibility drivers.
- All standard pharma-DTC chrome maps to existing/already-planned shared blocks; **no brand-unique block needed.**
- Combined-OC regulatory load is standard (ISI, full PI, Patient Brochure, PRC codes) — no boxed warning.
- Adjacent `hcp.taytulla.com` subdomain and mobile-app links add scope decisions.
- Residual risk: live HTML not fetchable here — confirm tech stack, the two tools' implementation, analytics/consent, and savings flow before finalizing.
