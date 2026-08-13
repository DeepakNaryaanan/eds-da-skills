# Solution Architecture & Effort Estimation — AbbVie Pharma Portfolio Migration to AEM Edge Delivery Services

Migration of six pharma brand sites to AEM Edge Delivery Services (EDS):

| # | Site | Audience | Complexity | Source state |
|---|---|---|---|---|
| 1 | lupron.com | Patient (multi-indication) | Medium–High | HTML (fetchable) |
| 2 | lupronpedpro.com | Caregiver / HCP (CPP) | Low–Medium | WAF-blocked (403) |
| 3 | armourthyroid.com | Patient (hypothyroidism) | Medium | Angular SPA |
| 4 | hypothyroidhub.com | HCP portal (hypothyroidism) | Medium (high discovery risk) | WAF-blocked (403) |
| 5 | liletta.com | Patient (IUD) | High | HTML (fetchable) |
| 6 | lilettahcp.com | HCP (IUD) | Medium–High | HTML (fetchable) |

Per-site requirements live in [`docs/requirements/`](./requirements/). This document defines the **solution approach** and a **bottom-up effort estimate organized around the project's 6-agent EDS block lifecycle**.

---

## 1. Solution Approach

### 1.1 Platform & principles
- **AEM Edge Delivery Services** (this boilerplate): vanilla JS/CSS, no build step, three-phase loading (eager/lazy/delayed), document-authored content.
- **One shared design system + block library** across all six sites (all AbbVie brand) — build common blocks once, theme per brand via `styles/config/overrides.css`.
- **Content-driven development**: every block starts from a `block.md` content-model contract; authored draft content drives decoration.
- **Compliance-first**: ISI/PI fair balance, references, and PRC/job codes are first-class migration artifacts, not afterthoughts.

### 1.2 Shared block library (build once, reuse across sites)
The existing inventory already covers the structural + common pharma patterns: `audience-gate`, `isi-bar`, `header`, `footer`, `navigation`, `fragment`, `hero-carousel`, `nav-cards`, `stat-bar`, `split-section`, `promo-banner`, `promo-pair`, `resource-list`, `tabs`.

**New SHARED blocks** (amortized across the portfolio — built once):

| Block | Type | Used by |
|---|---|---|
| `savings-card` | Simple | lupron, lupronpedpro, armour, liletta |
| `faq-accordion` | Simple | lupron, armour, liletta |
| `reference-list` | Simple | all six |
| `downloadable-resource` | Simple | lupronpedpro, hypothyroidhub, liletta, lilettahcp |
| `dosing-table` | Simple | lupron, armour |
| `discussion-guide` | Simple | armour, hypothyroidhub |
| `spec-list` | Simple | lilettahcp (others may reuse) |

**New SITE-SPECIFIC blocks:**

| Block | Type | Site |
|---|---|---|
| `indication-selector` | Interactive | lupron |
| `symptom-checklist` | Simple | lupronpedpro |
| `symptom-checker` (scored quiz) | Interactive | hypothyroidhub |
| `comparison-table` | Simple | liletta |
| `quiz` (method-finder) | Interactive | liletta |
| `email-share` | Interactive | liletta |
| `clinical-data-table` | Interactive | lilettahcp |
| `video-embed` (Vimeo) | Simple/Interactive | lilettahcp |
| `rep-request-form` | Interactive | lilettahcp |

### 1.3 Cross-cutting integrations to re-platform
- **Analytics/tag management:** Adobe Experience Platform Launch/DTM is the AbbVie standard (confirmed on lupron, lilettahcp, liletta). lilettahcp also runs GA. Re-wire via `delayed.js`.
- **Consent:** OneTrust (and Evidon on lupron; CCPA cookies on lilettahcp). Standardize on one consent block loaded in the lazy/delayed phase.
- **Forms → CRM:** email-share (liletta) and rep-request (lilettahcp) need endpoints (likely AbbVie/Veeva sales ops). Treated as integration work, not just UI.
- **Video:** Vimeo (lilettahcp); facade/lazy-load pattern.
- **Savings programs:** mostly external (`luprongyn.com`, `LILETTAcard.com`, AbbVie Patient Access) — link out, confirm scope.
- **Fonts:** Adobe Typekit + Google Fonts (Roboto/Open Sans/Varela Round/Amatic SC). Self-host where possible for LCP.

### 1.4 Migration mechanics
- **Fetchable sites (lupron, liletta, lilettahcp):** use the project's import/scrape skills directly.
- **WAF-blocked (lupronpedpro, hypothyroidhub):** require a manual/authenticated content export before import — **discovery spike mandatory**.
- **SPA (armourthyroid):** content must be extracted from the rendered DOM (headless render), not raw HTML; map two generations of legacy URLs (`.aspx`, `.html`).

---

## 2. The 6-Agent EDS Lifecycle (effort model)

Effort is modeled around the six lifecycle agents used in this project:

| Phase | Agent | Responsibility |
|---|---|---|
| 1 — Plan | **strategist** | User story, acceptance criteria, test cases, `block.md` content model, IA |
| 1.5 — Design | **styleforge** | Design tokens, color/type mapping, responsive + motion specs, `overrides.css` |
| 3–4 — Build | **blockwright** | Block JS/CSS/markup, draft content, lint, local test report |
| 5–6 — Review/Test | **sentinel** | Code review (docs/blocks.md + WCAG AA), Playwright specs, green test run |
| 7–8 — Integrate | **composer** | Block-library entry + page assembly from authored content |
| Deploy | **pilot** | Pre-push hygiene, PSI ≥100 target, feature-preview URL, PR prep |

### 2.1 Unit costs (ideal person-days, full lifecycle)

| Work item | strategist | styleforge | blockwright | sentinel | composer | **Total** |
|---|---|---|---|---|---|---|
| New **simple** block | 0.5 | 0.25 | 1.0 | 0.75 | 0.5 | **3.0** |
| New **interactive** block | 0.75 | 0.5 | 2.0 | 1.25 | 0.75 | **5.25** |
| Reuse/config existing block (per site) | 0.1 | 0 | 0.2 | 0.2 | 0.3 | **0.8** |
| Page assembly + authoring (per page) | — | — | — | 0.1 | 0.2 | **~0.4** |

> Assumes mid-level EDS engineers, this boilerplate as the baseline, and that medical-legal (MLR) content review runs in parallel (its **calendar** impact is captured in §4, not in build effort).

---

## 3. Effort Estimate by Site (person-days)

Each site total = discovery + strategist + styleforge + blockwright (site-specific blocks only) + sentinel + composer/content + pilot. **Shared-block build is counted once in §3.7, not per site.**

### 3.1 lupron.com — *Medium–High*
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 1.0 | 2.0 | 1.5 | 5.0 (indication-selector + dosing config) | 2.5 | 8.0 (~18 pages) | 1.5 | **21.5** |

### 3.2 lupronpedpro.com — *Low–Medium*
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 2.0 (WAF export) | 1.0 | 1.5 | 3.0 (symptom-checklist) | 1.5 | 4.5 (~8 pages) | 1.0 | **14.5** |

### 3.3 armourthyroid.com — *Medium*
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 3.0 (SPA extraction + legacy URLs) | 1.0 | 2.0 | 1.0 (mostly shared) | 1.5 | 4.5 (~8 pages) | 1.0 | **14.0** |

### 3.4 hypothyroidhub.com — *Medium (high discovery risk)*
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 3.0 (blocked + scope unknown) | 1.5 | 1.5 | 5.25 (symptom-checker) | 2.0 | 4.5 (~9 pages) | 1.0 | **18.75** |

### 3.5 liletta.com — *High*
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 1.0 | 2.5 | 2.0 (GSAP motion, multi-font) | 13.5 (quiz + comparison-table + email-share) | 4.0 | 9.5 (~20 pages) | 1.5 | **34.0** |

### 3.6 lilettahcp.com — *Medium–High*
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 1.0 | 2.0 | 1.0 (shares liletta tokens) | 13.5 (clinical-data-table + rep-request-form + video-embed) | 4.0 | 6.0 (~9 data-heavy pages) | 1.5 | **29.0** |

### 3.7 Shared foundation (built once, amortized)
| Item | Effort |
|---|---|
| 7 shared new blocks × 3.0 (full lifecycle) | 21.0 |
| Global design-system / token foundation (AbbVie brand base, `overrides.css`, theming hooks) | 3.0 |
| Shared consent + analytics (Adobe Launch) integration pattern | 3.0 |
| **Shared foundation total** | **27.0** |

---

## 4. Roll-up

| Line | Person-days |
|---|---|
| lupron.com | 21.5 |
| lupronpedpro.com | 14.5 |
| armourthyroid.com | 14.0 |
| hypothyroidhub.com | 18.75 |
| liletta.com | 34.0 |
| lilettahcp.com | 29.0 |
| **Site subtotal** | **131.75** |
| Shared foundation (§3.7) | 27.0 |
| **Build subtotal** | **158.75** |
| Program overhead (~20%): PM, cross-site QA/UAT, accessibility audit, MLR coordination | ~32.0 |
| **Grand total (point estimate)** | **~190 person-days** |

**Range with uncertainty:** **165–215 person-days** (~33–43 person-weeks; ~8–10.5 person-months).

### Effort split by agent (approx., across the whole program)
| Agent | Share | Person-days |
|---|---|---|
| strategist (plan / content model) | ~12% | ~23 |
| styleforge (design tokens) | ~9% | ~17 |
| blockwright (build) | ~38% | ~72 |
| sentinel (review + tests) | ~17% | ~32 |
| composer (library + page assembly) | ~16% | ~31 |
| pilot (deploy/PSI/PR) | ~5% | ~9 |
| (discovery spikes, folded into sites) | ~6% | ~11 |

### Indicative schedule
With a pod of **3 EDS engineers + 1 tech lead + part-time PM/QA**, ~190 person-days ≈ **11–14 calendar weeks**, assuming MLR review runs in parallel. Recommended delivery waves:

1. **Wave 0 — Foundation (2–3 wks):** design system, shared blocks, consent/analytics pattern, import pipeline. Validate with one pilot site.
2. **Wave 1 — Fetchable + lower-risk (lupron, lupronpedpro, armourthyroid).**
3. **Wave 2 — High-complexity (liletta, lilettahcp)** — most net-new interactive blocks.
4. **Wave 3 — hypothyroidhub** last (resolve discovery/scope ambiguity first).

---

## 5. Key Assumptions & Risks

**Assumptions**
- One shared AbbVie design system; brands differ by token overrides, not bespoke blocks.
- Savings/copay enrollment stays on external AbbVie properties (link-out), not rebuilt here.
- Content authors (or a migration script) handle bulk page authoring; engineering owns blocks + assembly.
- MLR/regulatory content review runs in parallel and does not block engineering.

**Risks (and mitigations)**
- **MLR review is the #1 schedule risk** in pharma — every page with ISI/PI/claims needs medical-legal sign-off. *Mitigation:* freeze content early, treat PRC/job codes as locked artifacts, parallelize review.
- **WAF-blocked + SPA sources** (lupronpedpro, hypothyroidhub, armourthyroid) can't be auto-scraped → estimates carry the most variance here. *Mitigation:* run discovery spikes first; re-baseline after.
- **hypothyroidhub scope is unconfirmed** (HCP portal? registration/SSO? interactive tools?) — could swing ±5 days. *Mitigation:* scope spike before committing.
- **Interactive blocks** (quiz, symptom-checker, clinical-data-table, forms) carry accessibility + CRM-integration risk. *Mitigation:* early `sentinel` WCAG review + endpoint contracts.
- **Form endpoints** (email-share, rep-request) depend on AbbVie/Veeva integration availability — external dependency.

---

*Estimates are bottom-up and intended for planning; re-baseline after Wave 0 and after discovery spikes on the three non-scrapeable sites. Verified data sources and per-site detail are in [`docs/requirements/`](./requirements/).*
