# Requirements: INFeD Locator (infedlocator.com)

**Product:** INFeD® (iron dextran injection, USP) — Allergan Sales, LLC, an AbbVie company. IV iron for documented iron deficiency in patients (≥4 months) intolerant of / unresponsive to oral iron.
**Audience:** Healthcare professionals (HCP). A find-an-infusion-center tool so HCPs can locate centers offering INFeD in their patient's area for iron infusions. (No login/age-gate observed; likely a simple HCP-intent acknowledgement at most.)

> Data basis: **NOT directly fetched** — WebFetch and Bash/curl were both denied in this environment, so no live HTML/status was captured. Structure below is from `site:infedlocator.com` WebSearch (which confirms a single indexed page, the locator homepage) plus general search on the brand and on comparable pharma infusion-center locators. **Most important migration fact (expected, UNVERIFIED): the defining feature is a search-driven map locator — almost certainly a client-side JavaScript app (map tiles + a store/center-locator data service), not server-rendered HTML. This is the single biggest migration complexity driver and must be confirmed against the rendered DOM.**

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Locator home | `/` | Landing + the infusion-center search (zip/address + radius → map + results list) | Interactive locator (VERIFIED as the indexed page) |
| Search results / detail | `/` (in-app state) or `/results` (est.) | Center results list, map pins, center detail (address/phone) | Locator UI state |
| ISI / safety | inline on `/` or `/isi` (est.) | Important Safety Information (anaphylaxis boxed-warning language, test dose) | Regulatory |
| Prescribing Information | external PDF → `rxabbvie.com/pdf/infed_pi.pdf` (VERIFIED) | Full PI / boxed warning | Regulatory PDF |
| Product site (cross-link) | external → `infed.com` (VERIFIED, separate site) | Dosing, why INFeD, references, patient access | Off-site |

**Estimated page count:** ~1–3 routes. This is effectively a **single-purpose micro-site** built around one locator tool; supporting copy (ISI, footer legal, links to infed.com and the PI PDF) likely lives on the same page.

## Block Inventory Mapping

| Section | Existing block | New block needed | Notes |
|---|---|---|---|
| Header / nav | `header`, `navigation` | — | Minimal brand bar; reuse |
| Footer (legal, job code, links) | `footer` | — | Links to infed.com, PI PDF, privacy/terms |
| Sticky ISI | `isi-bar` | — | Anaphylaxis/test-dose safety; reuse |
| HCP acknowledgement (if present) | `audience-gate` | — | Only if an HCP gate exists; confirm |
| Page intro / instructions | `split-section` or default content | — | "Find an infusion center…" lead copy |
| **Search + map locator** | — | **`locator-map`** | KEY block. Zip/address input + radius select, geocode, map with pins, results list, center detail cards |
| ISI / fair-balance body | — | `reference-list`* | Citations/footnotes if present |
| Cross-link to product site / PI | `promo-banner` | — | CTA to infed.com and PI PDF |

**New blocks:** `locator-map` (the cost driver — search-driven map; reusable across other AbbVie infusion-locator micro-sites), `reference-list`* (* = shared/portfolio-reusable).

## Design System *(UNVERIFIED — locator is a JS app, not fetched; confirm from rendered DOM/CSS)*
- **Colors:** AbbVie/INFeD brand palette; confirm from compiled CSS once rendered.
- **Typography:** brand webfont loaded at runtime; confirm family/weights.
- **Libraries (source site, expected):** a JS map SDK (Google Maps JS API or Esri/Leaflet) + a store/center-locator widget; possibly jQuery. Confirm which map provider and locator service.
- **Responsive:** locator UIs are typically responsive (map collapses below results list on mobile); rebuild as responsive EDS sections with the map as a progressively-enhanced block.

## Integrations & Third-Party *(confirm from rendered app)*
- **Analytics:** expect Adobe Analytics / Launch (DTM) — AbbVie standard; injected at runtime.
- **Consent:** expect OneTrust (AbbVie standard) cookie banner.
- **Forms:** the locator **search input** (zip/address + radius) is the primary form; it submits to a geocoder + center-lookup API, not a lead form. No PII capture expected.
- **Locator data API:** UNVERIFIED — likely a third-party infusion-center dataset/service (e.g., a NICA / infusioncenter.org-style center directory) or an AbbVie-hosted endpoint returning center records (name, address, phone, geo). **This data feed is the migration's critical dependency** — EDS pages are static, so the locator block must call this API client-side at runtime.
- **Maps:** Google Maps JS API or Esri/Leaflet tiles + geocoding (expected). Confirm provider and API-key handling.
- **Fonts:** brand webfont via runtime asset bundle.
- **PDFs:** Prescribing Information PDF hosted off-site at `rxabbvie.com` (link, not migrated content).

## Content Migration
- **Volume:** very low — essentially one page of editorial copy (intro + ISI + footer) plus the locator tool. Bulk is functional, not editorial.
- **Content types:** locator UI, intro instructions, Important Safety Information, legal/footer, outbound links to infed.com and the PI PDF.
- **Regulatory:** preserve ISI fair-balance language exactly (anaphylactic-reaction warning, mandatory test dose, resuscitation-equipment requirement); keep AbbVie PRC/job code and PI link; this is an HCP-facing asset.
- **Locator data migration:** the **center dataset/API is the core asset to carry over** — identify the data source, record schema, geocoding source, and update cadence. If the data is owned by a third party, secure/confirm API access for the EDS rebuild. The map+search must be reimplemented as the new `locator-map` block.
- **Redirects:** map `/` and any in-app deep links to EDS paths; preserve the bare domain. Confirm whether any legacy `.html`/query-param result URLs need redirects.
- **SEO:** thin, single-purpose site; a JS-app locator likely indexes poorly (only `/` is indexed). EDS static shell around the locator is an SEO improvement opportunity for the surrounding copy.
- **Accessibility (WCAG 2.1 AA):** map locators are high-risk — require keyboard-operable search and results, screen-reader-announced result counts/updates, accessible map alternative (results as a semantic list), visible focus, and labeled inputs. Budget remediation in the rebuild.

## Migration Complexity
**Medium–High.**
- Editorial content volume is **very low** (a single-page micro-site), which on its own would be Low.
- But the site's entire reason for existing is a **search-driven map locator** (`locator-map`), a new interactive block requiring a map SDK, geocoding, and a runtime center-data API — this dominates effort and risk.
- **Critical dependency / unknown:** the locator data source and map provider are unverified (environment blocked direct fetch). Confirming the center dataset/API ownership and access is a prerequisite and could swing effort up if the data is third-party or undocumented.
- Accessibility remediation of the map/search interaction adds work.
- Regulatory surface is small (one ISI block + PI link), keeping content compliance light.
