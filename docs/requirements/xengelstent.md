# Requirements: XEN Gel Stent (xengelstent.com)

**Product:** XEN® Gel Stent (XEN® 45 Gel Stent / XEN® Glaucoma Treatment System) — a minimally-invasive glaucoma surgery (MIGS) subconjunctival drainage **implant** for refractory glaucoma. XEN® is a registered trademark of AqueSys, Inc., **an AbbVie company** (formerly Allergan). This is a medical **DEVICE**, regulated via **Directions for Use (DFU) / labeling**, not a drug PI.
**Audience:** **Patients/caregivers** (consumer-facing, `www.xengelstent.com`). A separate **HCP/surgeon** site exists at `hcp.xengelstent.com` (clinical efficacy, cases, reimbursement). This document covers the patient `www` site; the HCP subdomain is noted where it affects scope.

> Data basis: **Live HTML could not be fetched** (WebFetch and curl/Bash both blocked in this environment). Inventory is **search-derived** (verified via `site:xengelstent.com` route enumeration + general search). Routes on `www` confirmed by search indexing; design-system and integration details are **UNVERIFIED** and marked as such. Medium-confidence file — re-run with live fetch before build.

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home | `/` | Patient landing — what is XEN, refractory glaucoma overview | Hero + intro |
| What is the XEN Gel Stent? | `/XENGelStent` | Device description, how it lowers IOP, the procedure | Article + imagery |
| What is Glaucoma? | `/glaucoma` | Disease education (optic nerve, IOP, refractory glaucoma) | Educational article |
| What can I expect with XEN? | `/WhattoExpect` | Pre/post-op expectations, recovery, after-care guidance | Article + safety callouts |
| Find a Doctor / Talk to your doctor (est.) | `/find-a-doctor` (est.) | Discussion prompt / locating a surgeon | Locator or CTA — UNVERIFIED |
| Important Safety Information / DFU (est.) | `/safety` or PDF (est.) | Patient safety info + linked DFU | Safety / PDF |
| Privacy / Terms / Accessibility / Contact / Cookies | footer utility links | Legal & utility | Utility |

**Confirmed page count (www patient site): 4 indexed content pages** (`/`, `/XENGelStent`, `/glaucoma`, `/WhattoExpect`) plus footer utility pages (Privacy Notice, Terms of Use, Accessibility Statement, Contact Us, Cookies Settings — confirmed in footer). A patient-facing surgeon locator was **searched for but NOT confirmed** (none indexed) — treat `/find-a-doctor` as estimated.
**Adjacent scope (NOT this site):** `hcp.xengelstent.com` — ~10 HCP pages (`/about-xen`, `/clinical-efficacy`, `/safety`, `/patient-selection`, `/cases/*`, `/additional-data/gpsdata`, `/reimbursement`, `/references`, `/healthcare-professionals` registration) + reimbursement PDFs (Billing & Coding Guide). If both sites migrate together, total is ~14+ pages.

## Block Inventory Mapping

| Section | Existing block | New block needed | Notes |
|---|---|---|---|
| Header / footer / nav | `header`, `footer`, `navigation` | — | Reuse |
| Home hero (device intro) | `hero-carousel` | — | Reuse; likely single hero |
| Device "how it works" / procedure steps | `split-section`, `promo-pair` | — | Image + text describing implant & ab interno procedure |
| Glaucoma education / refractory explanation | (default content) + `split-section` | — | Mostly prose; reuse |
| What-to-expect (pre/post-op, after-care) | `tabs`, `split-section` | — | Reuse; possible step list |
| Procedure / mechanism-of-action video (est.) | — | **`video-embed`*** | Likely a procedure/animation video — confirm provider (Vimeo/YouTube) |
| Important Safety Information (sticky) | `isi-bar` | — | Reuse; device DFU/safety variant (not a drug PI) |
| Patient safety callouts / contraindications | (default content) | — | Reuse |
| Find a Doctor / surgeon locator (if present) | — | **`locator-map`** | NEW — map + search by ZIP; only if patient locator confirmed (UNVERIFIED) |
| References / footnotes (if any) | — | **`reference-list`*** | Citation list (light on patient site) |
| Downloadable patient resources / DFU PDF | `resource-list` | **`downloadable-resource`*** | PDF/IFU downloads |
| Stat / outcome callouts | `stat-bar` | — | If IOP-reduction stats shown |

**New blocks:** `video-embed`*, `locator-map` (conditional — only if patient surgeon locator confirmed), `reference-list`*, `downloadable-resource`* (* = shared).

## Design System
*(All UNVERIFIED — live HTML/CSS could not be fetched. Confirm from rendered site before build.)*
- **Colors:** AbbVie/XEN brand palette — UNVERIFIED (likely blue/teal ophthalmology family). Extract hexes from live CSS.
- **Typography:** UNVERIFIED. Confirm font kit (AbbVie brand face or Google Fonts).
- **Libraries:** UNVERIFIED. Older AbbVie/Allergan device sites typically use a Bootstrap-style grid + jQuery; copyright "© 2021 AbbVie" suggests an aging stack ripe for migration.
- **Responsive:** Assumed mobile-first with hamburger nav (standard) — verify.

## Integrations & Third-Party
*(Mostly expected — confirm against live tags.)*
- **Analytics / tag mgmt:** Expected Adobe Launch/DTM (`assets.adobedtm.com`) and/or Google Analytics — UNVERIFIED.
- **Consent:** Footer exposes a **"Cookies Settings"** link → consent management present (likely OneTrust or AbbVie standard CMP) — confirm vendor.
- **Forms:** No patient lead form confirmed on `www` (the **"Register for Updates"** form lives on the HCP site `/healthcare-professionals`). If a patient sign-up exists, it needs endpoint integration.
- **Locator / Maps:** No patient surgeon locator confirmed (searched, not indexed). If present, expect Google Maps JS API → `locator-map` block.
- **Video:** Procedure/animation video likely (mechanism of action) — provider UNVERIFIED (Vimeo or YouTube).
- **Fonts:** UNVERIFIED — likely Google Fonts and/or AbbVie brand kit.
- **PDFs:** Patient DFU / safety labeling PDF expected (DFU hosted at `rxabbvie.com/pdf/xen_dfu.pdf`); HCP reimbursement PDFs are on the HCP subdomain (out of scope for `www`).

## Content Migration
- **Volume:** Small — **4 patient content pages** + footer utility pages (+ ~10 HCP pages if the subdomain is included in the same migration).
- **Content types:** Disease education (glaucoma/IOP), device description, procedure/expectations content, safety information, likely 1 video, possible DFU PDF.
- **Regulatory (device, not drug):**
  - **DFU / labeling** governs claims — patient safety info + linked **Directions for Use** must migrate verbatim; framing differs from a drug PI (no full PI/boxed ISI in the pharma sense, but device safety callouts apply).
  - **References:** light on the patient site (heavy on HCP site).
  - **PRC / job codes / MLR:** AbbVie promotional approval codes and copyright (© AbbVie) must be preserved exactly; device claims are MLR-controlled.
- **Redirects:** Preserve legacy mixed-case paths (`/XENGelStent`, `/WhattoExpect`) → map to EDS-friendly lowercase slugs with 301s; do NOT silently change casing without redirects.
- **SEO:** Preserve page titles/meta (e.g. "WHAT IS THE XEN® GEL STENT?"). Maintain trademark "®" symbols.
- **Accessibility (WCAG 2.1 AA):** Ophthalmology/glaucoma audience → **vision-impaired users are a core demographic**; prioritize high contrast, large/resizable text, strong focus states, full keyboard nav. Video needs captions; any locator/map needs an accessible text fallback; safety callouts need proper semantic structure.

## Migration Complexity
**Low–Medium.**
- **Small page count** (4 patient pages) and mostly **static educational/article content** — low structural complexity; high reuse of existing blocks (`split-section`, `hero-carousel`, `isi-bar`, `resource-list`).
- **Net-new blocks are limited and mostly shared** (`video-embed`*, `downloadable-resource`*, `reference-list`*); `locator-map` is only needed if a patient surgeon locator is confirmed (currently UNVERIFIED — likely absent).
- **Device (not drug) regulatory framing** is lighter than a full-PI drug site, but DFU/safety content and AbbVie PRC/MLR codes must migrate verbatim.
- **Heightened accessibility bar** for a vision-impaired audience adds QA effort.
- **Risk / unknown:** live HTML could not be fetched this pass — design system and integrations unverified; the related `hcp.xengelstent.com` subdomain (~10 clinical pages, reimbursement PDFs, HCP registration form) would push effort to **Medium–High** if migrated in the same scope.
