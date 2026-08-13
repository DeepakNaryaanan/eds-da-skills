# Requirements: TEFLARO (teflaro.com)

**Product:** TEFLARO® (ceftaroline fosamil) for injection — IV cephalosporin antibiotic. AbbVie (legacy Allergan/Forest; PI labeled Allergan USA, Inc.). Indicated for **ABSSSI** (acute bacterial skin & skin structure infections) and **CABP** (community-acquired bacterial pneumonia) in adult and pediatric patients. In ABSSSI, positioned as the first/only cephalosporin with anti-MRSA activity.
**Audience:** **U.S. Healthcare professionals only** (infectious-disease, hospital/inpatient prescribers, pharmacists, home-infusion). Site self-declares "intended for U.S. Healthcare Professionals only" — expect an HCP attestation/gate.

> Data basis: live HTML fetch **blocked** in this environment (WebFetch denied; curl denied), so server-HTML-vs-SPA, page size, and HTTP status are **UNVERIFIED**. Page inventory and product facts are VERIFIED via `site:teflaro.com` web-search enumeration (real indexed routes returned) + general search (indication, manufacturer, audience). Design-system/integration specifics are EXPECTED (AbbVie/Allergan portfolio norms), not confirmed from live source.

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home | `/` | HCP landing — ABSSSI & CABP IV therapy overview, MRSA positioning | Hero + nav cards |
| Pathogen coverage | `/pathogen-coverage` | Gram +/– susceptible isolates by indication | Article + spec/coverage table |
| Adult – Dosage & administration | `/adult/dosage-and-administration` | Adult dosing, reconstitution, renal adjustment | Dosing tables |
| Adult – Safety profile | `/adult/safety-profile` | Adult adverse-reaction data | Data table + ISI |
| Adult – CABP patient case studies | `/adult/cabp-patientcase-studies` | Illustrative CABP cases | Case-study article |
| ABSSSI – Test of cure efficacy | `/absssi/test-of-cure-efficacy` | Adult ABSSSI efficacy endpoint | Clinical data table |
| CABP – Clinical trials | `/cabp/clinical-trials` | CABP trial/study design | Article + table |
| CABP – Clinical response rate | `/cabp/clinical-response-rate` | CABP efficacy endpoint | Clinical data table |
| CABP – Patient case studies | `/cabp/patient-case-studies` | Illustrative CABP cases | Case-study article |
| Pediatric – Dosage & administration | `/pediatric/dosage-and-administration` | Peds weight/age dosing | Dosing tables |
| Pediatric ABSSSI – Demographics | `/pediatric/absssi/demographics` | Peds ABSSSI trial population | Data table |
| Pediatric ABSSSI – Clinical response | `/pediatric/absssi/clinical-response` | Peds ABSSSI efficacy | Clinical data table |
| Pediatric ABSSSI – Test of cure | `/pediatric/absssi/test-of-cure` | Peds ABSSSI endpoint | Clinical data table |
| Pediatric CABP – Study design | `/pediatric/cabp/study-design` | Peds CABP trial design | Article + table |
| Pediatric CABP – Test of cure | `/pediatric/cabp/test-of-cure` | Peds CABP endpoint | Clinical data table |
| Safety – Discontinuation / AEs | `/safety/discontinuation-adverse-events` | Drug discontinuation & AE data | Data table |
| Savings / myAbbVieAssist (est.) | `/savings` (est.) | Patient affordability — myAbbVieAssist referral | Promo / resource |
| Request a rep / Contact (est.) | `/contact` (est.) | "A TEFLARO representative will contact you" lead capture | Form |
| References (est.) | `/references` (est.) | Citation list for clinical claims | Reference list |
| Site map (est.) | `/sitemap` (est.) | Utility | Utility |

**Page count:** 16 VERIFIED indexed routes (audience- and indication-prefixed: `/adult/`, `/pediatric/`, `/absssi/`, `/cabp/`, `/safety/`) + ~4 expected utility/conversion pages (est.). Confirmed asset: **Home Infusion Resource Guide** PDF (`/assets/files/Home Infusion Resource Guide.pdf`).

## Block Inventory Mapping

| Section | Existing block | New block needed | Notes |
|---|---|---|---|
| HCP attestation ("U.S. Healthcare Professionals only") | `audience-gate` | — | Reuse; HCP-only variant |
| Sticky ISI (IV antibiotic — anaphylaxis, C. diff, hypersensitivity) | `isi-bar` | — | Reuse; heavy ISI for IV agent |
| Header / footer / nav | `header`, `footer`, `navigation` | — | Reuse; nav must split adult vs pediatric × ABSSSI vs CABP |
| Home hero (ABSSSI & CABP, MRSA claim) | `hero-carousel` + `stat-bar` | — | Reuse |
| Adult/peds navigation into indications | `nav-cards`, `tabs` | — | Reuse; `tabs` for adult/peds or ABSSSI/CABP toggles |
| Dosing & administration (reconstitution, renal adjustment, peds weight-band) | — | **`dosing-table`*** | Core HCP content; multiple dosing matrices |
| Efficacy / test-of-cure / clinical-response endpoints | — | **`clinical-data-table`*** | Footnoted clinical efficacy tables — primary effort driver |
| Pathogen / susceptibility coverage | — | **`comparison-table`*** or **`spec-list`*** | Organism coverage grid by indication |
| Patient case studies | `split-section`, `promo-pair` | — | Reuse for case narrative + imagery |
| Savings / myAbbVieAssist | `promo-banner` | **`savings-card`*** | Affordability referral card |
| Request-a-rep / contact lead capture | — | **`rep-request-form`*** | Validated lead form → CRM (Veeva/AbbVie sales ops) |
| Home Infusion Resource Guide + downloads | `resource-list` | **`downloadable-resource`*** | PDF collateral |
| References / citations | — | **`reference-list`*** | Claim substantiation |

**New blocks:** `dosing-table`*, `clinical-data-table`*, `comparison-table`*, `spec-list`*, `savings-card`*, `rep-request-form`*, `downloadable-resource`*, `reference-list`* (* = shared, already planned).

## Design System
- **Colors:** UNVERIFIED (live CSS not fetchable). Expect AbbVie/Allergan legacy brand palette; confirm from production CSS.
- **Typography:** UNVERIFIED. Expect Google Fonts and/or Adobe Typekit (AbbVie portfolio norm); confirm web-font kit from live `<head>`.
- **Libraries:** UNVERIFIED. Expect Bootstrap-style grid + jQuery on a legacy AEM Classic/Sites build typical of Allergan-era HCP sites.
- **Responsive:** UNVERIFIED but expected mobile-first with hamburger nav; clinical/dosing tables require horizontal-scroll handling on small viewports.

## Integrations & Third-Party
- **Analytics / tag mgmt:** EXPECTED Adobe Launch/DTM (`assets.adobedtm.com`) — AbbVie standard; possibly Google Analytics. UNVERIFIED.
- **Consent:** EXPECTED OneTrust cookie banner (AbbVie standard) — UNVERIFIED; confirm CCPA/GDPR handling.
- **Forms:** Request-a-rep / "a representative will contact you" lead form → CRM endpoint (Veeva/AbbVie sales ops). Validation, error states, consent checkbox required.
- **Savings:** **myAbbVieAssist** patient-assistance referral (AbbVie program) — link/handoff, not on-site enrollment.
- **Video:** None confirmed in route enumeration; reserve `video-embed`* only if MOA/administration video is found on live site.
- **Fonts:** EXPECTED Google Fonts + Typekit — UNVERIFIED.
- **PDFs:** Home Infusion Resource Guide (`/assets/files/`) confirmed; expect additional PI/dosing-guide PDFs.

## Content Migration
- **Volume:** ~16 verified + ~4 expected pages; matrix of adult/peds × ABSSSI/CABP clinical pages; ≥1 confirmed PDF (Home Infusion Guide) plus expected PI/collateral PDFs.
- **Content types:** clinical efficacy/safety **data tables** (footnoted), dosing & reconstitution/renal-adjustment tables, pathogen coverage grids, patient case studies, lead form, savings referral, downloadable collateral.
- **Regulatory:** full **PI** (hosted at `rxabbvie.com/pdf/teflaro_pi.pdf`) + heavy **ISI** for an IV agent (anaphylaxis, hypersensitivity, C. difficile, DRESS); fair-balance critical on every efficacy/safety page; **footnoted references** must stay associated with claims; AbbVie **PRC / job codes** preserved verbatim in footers; PI may still cite Allergan USA, Inc. — verify current labeling.
- **Redirects:** preserve `www.` host; map legacy audience/indication paths (`/adult/*`, `/pediatric/*`, `/absssi/*`, `/cabp/*`, `/safety/*`) 1:1 to EDS; preserve `?guid=` SEM landing params if used as campaign entry.
- **SEO/metadata:** descriptive per-page titles present ("ABSSSI Test of Cure", "CABP Response Rate", etc.); preserve titles/meta.
- **Accessibility (WCAG 2.1 AA):** dense clinical/dosing tables need `<caption>`, `<th scope>`, and footnote `aria` association; small-viewport table scrolling must be keyboard-accessible; rep form needs labels + error messaging; HCP gate needs focus management.

## Migration Complexity
**Medium–High.**
- Large grid of audience × indication clinical pages (adult/peds × ABSSSI/CABP) with **footnoted efficacy/safety and dosing tables** is the dominant effort and carries the heaviest medical-legal/fair-balance review.
- Multiple net-new (shared) blocks needed: `dosing-table`, `clinical-data-table`, `comparison-table`, `rep-request-form`, plus savings/resource/reference blocks.
- HCP gate + sticky ISI for an IV antibiotic (verbatim safety language), PRC/job-code preservation, and lead-form CRM integration add overhead.
- **Risk:** live source was not fetchable here — design system, exact tech stack, analytics/consent, and the full conversion-page set must be confirmed against production before estimation is finalized.
