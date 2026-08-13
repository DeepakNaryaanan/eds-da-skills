# Requirements: Hypothyroid Hub (hypothyroidhub.com)

**Property:** Hypothyroid Hub — an AbbVie hypothyroidism education/portal property (search result titles it *"Hypothyroidism Hub – HCP Portal"*). Likely an **unbranded or HCP-facing disease-state education hub** in the thyroid franchise (adjacent to Armour Thyroid / Synthroid).
**Audience:** Most likely **healthcare professionals** (portal framing), possibly with patient-education resources. Therapeutic area: hypothyroidism.

> Data basis: the live site is **WAF-blocked (HTTP 403)** and returns essentially no crawlable index (`site:` search surfaced only the homepage, titled "HCP Portal"). This file is therefore **largely UNVERIFIED** and built from AbbVie thyroid-franchise conventions. A manual/authenticated crawl is required to confirm the page set, gate, and tooling. Flag this site as **highest discovery-risk** of the six.

## Site Map & Page Inventory *(UNVERIFIED — confirm via manual crawl)*

| Page | URL path (est.) | Purpose | Content type |
|---|---|---|---|
| Home / Portal landing | `/` | HCP portal entry | Hero + nav cards |
| Understanding hypothyroidism | `/about` (est.) | Disease overview | Article |
| Symptoms | `/symptoms` (est.) | Symptom education | Article / list |
| Causes & diagnosis | `/diagnosis` (est.) | Causes, lab testing (TSH) | Article |
| Treatment options | `/treatment` (est.) | Therapy overview | Article |
| Patient resources / tools | `/resources` (est.) | Downloadables, discussion guides | Resource grid |
| Symptom checker / quiz | `/quiz` (est.) | Interactive self-assessment | Interactive tool |

**Estimated page count:** ~6–12 pages (unconfirmed). Could be a small portal.

## Block Inventory Mapping

| Section observed/expected | Existing block | New block needed | Notes |
|---|---|---|---|
| HCP gate | `audience-gate` | — | Portal framing implies a gate/registration |
| Header/footer/nav | `header`,`footer`,`navigation` | — | Reuse |
| Hero | `hero-carousel` | — | Single slide |
| Topic destination cards | `nav-cards` | — | Reuse |
| Disease-education explainer | `split-section` | — | Image + text |
| Prevalence/stat callouts | `stat-bar` | — | Reuse |
| Tabbed condition content | `tabs` | — | Reuse |
| Symptom checker / quiz | — | **`symptom-checker`** (interactive) | Scored Q&A tool — net-new, raises complexity |
| Doctor-discussion builder | — | **`discussion-guide`** (shared) | Generate/print a discussion guide |
| Downloadable resources | `resource-list` | **`downloadable-resource`** (shared) | Document cards |
| References | — | **`reference-list`** (shared) | Citations |

**New blocks:** `symptom-checker`, `discussion-guide`*, `downloadable-resource`*, `reference-list`* (* = shared). The interactive symptom-checker is the key cost driver.

## Design System *(UNVERIFIED)*
- **Colors / typography:** AbbVie thyroid-franchise branding; confirm from live CSS.
- **Imagery:** disease-education / clinical-friendly.
- **Responsive:** mobile-first.

## Integrations & Third-Party *(UNVERIFIED — AbbVie defaults)*
- **Analytics:** Adobe Launch/DTM expected.
- **Consent:** OneTrust expected.
- **Gate/registration:** portal likely requires HCP verification or registration — confirm whether SSO/registration is involved (affects scope materially).
- **Interactive tools:** symptom checker / quiz may rely on a third-party widget or custom JS — confirm.
- **Possible email-signup / CRM** (Marketo/Eloqua) — confirm.

## Content Migration
- **Volume:** small-to-medium, unconfirmed.
- **Content types:** disease education, interactive tools, downloadable guides.
- **Regulatory:** if unbranded, lighter product-safety burden (often no product ISI bar) but still needs references, fair-balance for any branded mentions, and AbbVie PRC/job codes.
- **Redirects:** confirm legacy URL scheme.
- **SEO/metadata:** confirm; portal gating may limit indexable surface.
- **Accessibility:** WCAG 2.1 AA — interactive quiz needs full keyboard/AT support.

## Migration Complexity
**Medium (High discovery risk).**
- Genuine build effort is likely modest, BUT:
- **No crawlable access** + ambiguous purpose (HCP portal vs patient education) means scope is unconfirmed — a discovery/manual-crawl spike is mandatory before estimating firmly.
- Any **interactive symptom-checker/quiz** and possible **registration/SSO gate** are the real complexity drivers; if confirmed, this moves toward Medium–High.
