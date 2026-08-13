# Requirements: VIBERZI HCP (viberzihcp.com)

**Product:** VIBERZI® (eluxadoline) tablets — AbbVie (formerly Allergan/Forest). A mu-opioid receptor agonist / delta-opioid receptor antagonist (Schedule **C-IV**) for **irritable bowel syndrome with diarrhea (IBS-D)** in adults. Key safety: **contraindicated in patients without a gallbladder** (risk of sphincter of Oddi spasm / pancreatitis), and pancreatitis risk.
**Audience:** **U.S. Healthcare professionals** (gastroenterology, primary care). HCP-facing site — expect an HCP attestation/gate.

> Data basis: homepage HTML could **not be fetched** in this session (WebFetch + Bash/curl harness-blocked — not a site response). Inventory is reconstructed from `site:viberzihcp.com` WebSearch (verified live URLs) + general search. Rendering tech, libraries, analytics, consent, and fonts are **UNVERIFIED** and require a browser/headless crawl past the HCP gate.

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home | `/` | HCP landing — IBS-D therapy overview | Hero + nav cards |
| About IBS-D | `/about-IBS-D` | Disease state / IBS-D burden | Article + stats |
| Mechanism of action | `/moa` | How eluxadoline works | Article + video/animation |
| Patient journey | `/patient-journey` | Diagnosis-to-treatment path | Article |
| Efficacy | `/efficacy` | Clinical efficacy endpoints | Clinical data table |
| Safety profile | `/safety-profile` | Adverse-reaction data, contraindications | Data table + ISI |
| Prescribing VIBERZI | `/prescribing-viberzi` | Dosing & how to prescribe | Dosing table |
| IBS Decoded | `/IBS-Decoded` | Educational series / podcast landing | Article + media |
| IBS Decoded — Episode 2 transcript | `/ibs-decoded/episode-2-transcript` | Episode transcript | Transcript |
| IBS Decoded — Episode 3 transcript | `/episode-3-transcript` | Episode transcript | Transcript |
| Gut Responses | `/Gut-Responses` | Editorial / case discussions | Article |
| VIBERZI Pro | `/viberzi-pro` | HCP program / tools | Program landing |
| Resources & support | `/resources-and-support` | Downloadable HCP resources | Resource list |
| Support | `/support` | Patient-support / access info | Article |
| Site map | `/sitemap` | Utility | Utility |

**Page count:** ~13–16 VERIFIED routes (above). PI PDF at `rxabbvie.com/pdf/viberzi_pi.pdf`; savings/access off-site at `abbvieaccess.com/viberzi`.

## Block Inventory Mapping

| Section | Existing block | New block needed | Notes |
|---|---|---|---|
| HCP attestation gate | `audience-gate` | — | Reuse; HCP-only variant |
| Sticky ISI | `isi-bar` | — | Reuse; contraindication (no gallbladder), pancreatitis |
| Header / footer / nav | `header`, `footer`, `navigation` | — | Reuse |
| Home hero | `hero-carousel` | — | Reuse |
| About-IBS-D / disease stats | `split-section` + `stat-bar` | — | Reuse |
| Topic / section nav | `nav-cards`, `tabs` | — | Reuse |
| Efficacy endpoints | — | **`clinical-data-table`*** | Footnoted efficacy tables |
| Prescribing / dosing | — | **`dosing-table`*** | Dose, contraindication callouts |
| Mechanism-of-action media | — | **`video-embed`*** | MOA animation/video |
| Patient-journey / discussion guide | `nav-cards` / `tabs` | **`discussion-guide`*** | Diagnosis-to-treatment prompts |
| VIBERZI Pro / request a rep | — | **`rep-request-form`*** | Lead capture → CRM (Veeva/AbbVie) |
| Savings / patient support | `promo-banner` | **`savings-card`*** | Route to AbbVie Access |
| Resources & downloads | `resource-list` | **`downloadable-resource`*** | HCP PDFs |
| IBS Decoded transcripts / FAQ | `tabs` | **`faq-accordion`*** | Expand/collapse transcripts/FAQ |
| References | — | **`reference-list`*** | Claim substantiation |

**New blocks:** `clinical-data-table`*, `dosing-table`*, `video-embed`*, `discussion-guide`*, `rep-request-form`*, `savings-card`*, `downloadable-resource`*, `faq-accordion`*, `reference-list`* (all shared/portfolio-reusable). **No Viberzi-unique net-new block.**

## Design System *(UNVERIFIED — HTML not fetched; confirm past the HCP gate)*
- **Colors:** VIBERZI/AbbVie brand palette; confirm from compiled CSS.
- **Typography:** brand webfont TBD — capture from rendered `<head>`.
- **Libraries (source site):** expected jQuery + Bootstrap-style grid; confirm.
- **Responsive:** rebuild mobile-first; clinical/dosing tables need small-viewport scroll handling.

## Integrations & Third-Party *(confirm from rendered app)*
- **Analytics:** expect Adobe Analytics / Launch (DTM) — AbbVie standard; confirm.
- **Consent:** OneTrust (AbbVie standard) — confirm banner.
- **Forms:** VIBERZI Pro / request-a-rep lead form → CRM (Veeva/AbbVie sales ops); HCP-gate attestation.
- **Savings/Access:** off-site `abbvieaccess.com/viberzi`.
- **Video:** MOA animation + IBS Decoded media — confirm host (Vimeo/YouTube/Brightcove).
- **Fonts:** confirm webfont source.
- **PDFs:** full PI (`rxabbvie.com`), HCP resource downloads, episode transcripts.

## Content Migration
- **Volume:** ~13–16 pages + PI PDF + HCP resources + podcast transcripts.
- **Content types:** IBS-D disease education, MOA media, efficacy/safety data tables, dosing/prescribing, patient journey, educational series/transcripts, HCP resources, lead form.
- **Regulatory:** **ISI** fair-balance on every page (contraindication: no gallbladder; pancreatitis; alcohol caution); full **PI** (C-IV scheduling statement); references footnoted to claims; AbbVie **PRC/job codes** preserved verbatim.
- **Redirects:** normalize mixed-case routes (`/about-IBS-D`, `/IBS-Decoded`, `/Gut-Responses`) → consistent EDS slugs with 301s; map `/episode-3-transcript` vs `/ibs-decoded/episode-2-transcript` inconsistency.
- **SEO:** preserve descriptive titles/meta; HCP pages retain canonical/noindex posture as set.
- **Accessibility (WCAG 2.1 AA):** HCP-gate focus trap; ISI keyboard expand/collapse; clinical/dosing tables `<th scope>`/caption; video captions; transcript semantic structure; rep-form labels + error states.

## Migration Complexity
**Medium–High.**
- Substantial HCP content set (~13–16 pages) with **footnoted efficacy/safety and dosing tables** plus MOA video and an educational transcript series — meaningful content-engineering and the heaviest fair-balance/medical-legal review.
- Multiple net-new (shared) blocks: `clinical-data-table`, `dosing-table`, `video-embed`, `rep-request-form`, plus discussion/savings/resource/reference blocks.
- HCP gate + sticky ISI (verbatim contraindication language), lead-form CRM integration, and mixed-case URL normalization add overhead.
- Residual risk: live HTML behind the HCP gate not fetchable here — design system, tech stack, analytics/consent, and video host must be confirmed before estimation is finalized.
