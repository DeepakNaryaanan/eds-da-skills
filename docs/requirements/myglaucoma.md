# Requirements: My Glaucoma (myglaucoma.com)

**Product:** None — **unbranded disease-awareness / patient-education campaign** ("My Glaucoma," tied to the "My Glaucoma, My Design" campaign with ambassador Von Miller). Glaucoma / elevated intraocular pressure (IOP) education. Sponsored by **Allergan, an AbbVie company**.
**Audience:** **Patients living with glaucoma and their caregivers** (US, DTC, consumer-facing). Disease awareness + "talk to your doctor" intent. Not HCP, not branded.

> Data basis: live HTML could not be fetched in this environment. The site is a **server-rendered ASP.NET WebForms application** — VERIFIED via the `/Error/404?aspxerrorpath=...` error route surfaced in search, the classic ASP.NET WebForms signature. This means content is server HTML (scrapeable in a real crawl), *not* a JS SPA — a favorable migration fact. Routes, audience, sponsor, and tooling below are VERIFIED from `site:myglaucoma.com` enumeration and AbbVie/Allergan press releases; design-system details are UNVERIFIED pending a live crawl.

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home | `/` | Campaign landing, glaucoma-burden intro, patient/caregiver framing | Hero + nav |
| Glaucoma Quiz | `/Quiz` | Interactive knowledge quiz (IOP/glaucoma); shareable result (#MyGlaucomaQuiz) | Interactive tool |
| Register | `/Register` | Sign-up for patients/caregivers (resources, updates) | Form |
| Resources | `/resources` | Patient/caregiver resources: conversation guide, fact sheets | Resource grid + downloads |
| About glaucoma / the disease | `/about` (est.) | Disease education, symptoms, IOP, survey facts | Article + stats |
| Patient & caregiver videos | `/videos` (est.) | Patient/caregiver perspective videos; Von Miller campaign video | Video gallery |
| Talk to your doctor / conversation guide | `/conversation-guide` (est.) | Doctor-discussion prompts, printable/downloadable guide | Article + download |
| Privacy / Terms | `/privacy`, `/terms` (est.) | AbbVie privacy notice, legal | Legal |

**VERIFIED routes:** `/`, `/Quiz`, `/Register`, `/resources` (4). **Estimated total page count:** ~7–10 pages (small campaign microsite). Routes marked (est.) are unconfirmed.

## Block Inventory Mapping

| Section | Existing block | New block needed | Notes |
|---|---|---|---|
| Header / footer / nav | `header`, `footer`, `navigation` | — | Reuse |
| Campaign hero | `hero-carousel` | — | Single slide / campaign banner |
| Topic destination cards | `nav-cards` | — | Quiz / Resources / Videos entry points |
| Disease-education explainer | `split-section` | — | Image + text (what glaucoma/IOP is) |
| Survey / prevalence stat callouts | `stat-bar` | — | Reuse for survey-data figures |
| Patient/caregiver perspective quotes | `promo-pair` / `split-section` | — | Story callouts |
| Glaucoma knowledge quiz | — | **`risk-assessment`** (interactive) | Scored Q&A + shareable result; net-new, key cost driver |
| Patient/caregiver videos | — | **`video-embed`** (shared) | Video gallery / hero video |
| Register / sign-up form | — | **`rep-request-form`** (shared) | General-purpose form block (registration capture) |
| Conversation / discussion guide | `nav-cards` / `tabs` | **`discussion-guide`** (shared) | Printable doctor-discussion guide |
| Downloadable resources | `resource-list` | **`downloadable-resource`** (shared) | Fact-sheet / guide PDF cards |
| FAQs | — | **`faq-accordion`** (shared) | If present |
| References | — | **`reference-list`** (shared) | Survey/clinical citations |

**New blocks:** `risk-assessment` (interactive quiz), `video-embed`*, `rep-request-form`*, `discussion-guide`*, `downloadable-resource`*, `faq-accordion`*, `reference-list`* (* = shared). The interactive scored quiz is the principal net-new build effort.

## Design System *(UNVERIFIED — confirm from live CSS)*
- **Colors:** Allergan/AbbVie "My Glaucoma" campaign palette (campaign-specific, not corporate brand); confirm from rendered CSS.
- **Typography:** confirm webfont from live site.
- **Libraries (source site):** ASP.NET WebForms (server-rendered); likely jQuery + bootstrap-era front-end. Confirm bundled JS/CSS.
- **Responsive:** mobile-first rebuild as static EDS sections.

## Integrations & Third-Party *(AbbVie defaults unless noted)*
- **Analytics:** Adobe Launch/DTM expected (AbbVie standard) — confirm.
- **Consent:** OneTrust expected (AbbVie privacy notice referenced) — confirm.
- **Forms:** `/Register` form posts to a CRM/marketing platform (Marketo/Eloqua/Salesforce likely) — confirm endpoint and data-capture fields; PII handling per AbbVie privacy notice.
- **Locator / Maps:** none found (no find-a-doctor confirmed).
- **Video:** patient/caregiver perspective videos + Von Miller campaign video — confirm host (YouTube/Brightcove/Vimeo) for `video-embed`.
- **Fonts:** webfont TBD.
- **PDFs:** conversation guide + fact sheets (downloadable resources).
- **Quiz:** interactive quiz with social share — confirm whether custom JS or a third-party widget.

## Content Migration
- **Volume:** small (~7–10 pages) microsite + a handful of PDFs/videos.
- **Content types:** disease-awareness education, interactive quiz, patient/caregiver videos, registration form, downloadable conversation guide/fact sheets.
- **Regulatory:** **unbranded** — no product ISI/PI bar required, lighter safety burden. Still needs survey/clinical reference citations, fair-balance for any treatment-modality mentions, AbbVie privacy notice, and PRC/job codes on all assets.
- **Redirects:** map legacy ASP.NET paths (`/Quiz`, `/Register`, `/resources`, capitalization-sensitive) to EDS paths; preserve campaign share URLs.
- **SEO/metadata:** server-rendered ASP.NET already indexable; preserve titles/meta; EDS should match or improve.
- **Accessibility:** WCAG 2.1 AA — the interactive quiz and registration form need full keyboard/AT support, error messaging, and focus management; video needs captions/transcripts.

## Migration Complexity
**Medium.**
- Page volume is small and the **server-rendered ASP.NET source is scrapeable** (no SPA extraction problem — favorable).
- Real cost drivers: the **interactive scored quiz** (net-new `risk-assessment` block with shareable results), a **registration form** wired to a CRM/marketing endpoint, and **video** integration.
- Unbranded status removes the ISI/PI regulatory weight, lowering effort vs. branded sites.
- Residual discovery: confirm exact route list, form backend, video host, analytics/consent stack, and campaign palette from a live crawl before firm estimate.
