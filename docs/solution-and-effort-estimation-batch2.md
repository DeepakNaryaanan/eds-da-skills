# Solution Architecture & Effort Estimation (Batch 2) — AbbVie/Allergan Pharma Portfolio Migration to AEM Edge Delivery Services

Migration of **twelve** additional pharma/device brand sites to AEM Edge Delivery Services (EDS). This is the companion estimate to the six-site Wave-1 document ([`solution-and-effort-estimation.md`](./solution-and-effort-estimation.md)) and assumes the **same shared design system + block library** is built once and reused across the whole AbbVie/Allergan portfolio.

| # | Site | Audience | Therapy area | Complexity | Source state |
|---|---|---|---|---|---|
| 1 | viberzihcp.com | HCP | IBS-D (eluxadoline, C-IV) | Medium–High | Not fetchable here (HCP gate; harness-blocked) |
| 2 | teflaro.com | HCP | IV antibiotic (ceftaroline) | Medium–High | Not fetchable here |
| 3 | xengelstent.com | Patient | Glaucoma **device** (MIGS implant) | Low–Medium | Not fetchable here |
| 4 | myglaucoma.com | Patient (unbranded) | Glaucoma disease awareness | Medium | **ASP.NET (server HTML, scrapeable)** |
| 5 | restasis.com | Patient | Chronic dry eye (cyclosporine) | Medium | Not fetchable here |
| 6 | bystolic.com | Patient | Hypertension (nebivolol) | Low–Medium | Server HTML (scrapeable) |
| 7 | viibryd.com | Patient | MDD (vilazodone) — boxed warning | Low–Medium | Legacy ASP.NET (`.aspx`) |
| 8 | infedlocator.com | HCP | IV iron locator (INFeD) | Medium–High | JS map app (not fetched) |
| 9 | depakotehcp.com | HCP | Multi-indication (divalproex) — boxed | Medium–High | Not fetchable here |
| 10 | depakote.com | Patient | Multi-indication (divalproex) — boxed | Medium–High | Not fetchable here |
| 11 | taytulla.com | Patient | Oral contraceptive | Medium | Not fetchable here |
| 12 | fetzima.com | Patient | MDD (levomilnacipran) — boxed | Low–Medium | Not fetchable here |

Per-site requirements live in [`docs/requirements/`](./requirements/). This document defines the **solution approach** and a **bottom-up effort estimate organized around the project's 6-agent EDS block lifecycle**, consistent with the Wave-1 model.

> **Data-basis caveat (program-wide):** In this analysis pass the environment blocked live `WebFetch`/`curl`, so 10 of 12 sites' inventories were reconstructed from `site:` search enumeration + product/labeling sources rather than rendered HTML. Only **myglaucoma** (verified server-rendered ASP.NET) and **bystolic** (server HTML signals) have a confirmed source-state. **A discovery spike with live rendering is a prerequisite before committing these estimates** — design system, JS libraries, analytics, consent vendor, and form/locator endpoints are UNVERIFIED for most sites.

---

## 1. Solution Approach

### 1.1 Platform & principles
Identical to Wave-1: AEM Edge Delivery Services (this boilerplate), vanilla JS/CSS, three-phase loading, document-authored content, one shared design system themed per brand via `styles/config/overrides.css`, content-driven development from a `block.md` contract, compliance-first (ISI/PI, references, PRC/job codes as first-class artifacts).

### 1.2 Block library — reuse Wave-1, add two net-new shared blocks
The **Wave-1 shared block library is the prerequisite foundation** and covers almost all of Batch 2:

`audience-gate`, `isi-bar`, `header`, `footer`, `navigation`, `fragment`, `hero-carousel`, `nav-cards`, `stat-bar`, `split-section`, `promo-banner`, `promo-pair`, `resource-list`, `tabs` (existing) **plus** the Wave-1 new shared blocks: `savings-card`, `faq-accordion`, `reference-list`, `downloadable-resource`, `dosing-table`, `discussion-guide`, `spec-list`, `comparison-table`, `clinical-data-table`, `video-embed`, `rep-request-form`, `indication-selector`.

**Net-new SHARED blocks introduced by Batch 2** (build once, amortized):

| Block | Type | Used by | Notes |
|---|---|---|---|
| `locator-map` | Interactive | infedlocator (core), xengelstent (conditional) | Search + geocode + map pins + results list; depends on a center/provider data API |
| `risk-assessment` | Interactive | myglaucoma | Scored knowledge/risk quiz with shareable result; can reuse Wave-1 `quiz`/`symptom-checker` engine |

**No brand-unique net-new blocks** are required in Batch 2 — every other section maps to an existing or Wave-1 shared block. `indication-selector` (built in Wave-1 for lupron) is reused by **depakote** and **depakotehcp**; the antidepressant pattern (boxed-warning ISI + dosing + savings) is shared across **viibryd** and **fetzima**.

### 1.3 Cross-cutting integrations to re-platform
- **Analytics/tag management:** Adobe Experience Platform Launch/DTM is the expected AbbVie standard across all 12 (UNVERIFIED on most). Re-wire via `delayed.js` using the Wave-1 pattern.
- **Consent:** OneTrust expected portfolio-wide. Reuse the Wave-1 consent block.
- **Forms → CRM:** `rep-request-form` (viberzihcp, teflaro), patient savings enrollment (restasis multi-step, bystolic, viibryd, taytulla, fetzima), and registration (myglaucoma) need endpoints (AbbVie/Veeva sales ops or marketing CRM). Mostly link-out to external savings programs (`allergansavingscard.com/*`, `abbvieaccess.com/*`).
- **Locator data (infedlocator):** the **center/provider dataset + map provider is the critical external dependency** — identify source, schema, geocoding, and access before build.
- **Video:** expected on myglaucoma, restasis, viberzihcp, xengelstent — facade/lazy-load `video-embed`.
- **Fonts:** Adobe Typekit + Google Fonts expected; self-host where possible for LCP.

### 1.4 Migration mechanics
- **Scrapeable (myglaucoma, bystolic):** use the project's import/scrape skills directly — favorable.
- **Legacy ASP.NET (viibryd, myglaucoma):** map legacy `.aspx` / `/Content/` URLs and paid-search `?guid=` params with deliberate 301s.
- **JS app (infedlocator):** locator must be re-implemented client-side against the (to-be-confirmed) center-data API; content shell is trivial, the tool is the work.
- **Not-fetchable-this-pass (the rest):** **discovery spike with live rendering required** before scoping — especially behind HCP gates (viberzihcp, teflaro, depakotehcp).
- **Multi-indication (depakote, depakotehcp):** shared-domain `/hcp/*` consolidation needs a canonical/redirect strategy across the two properties.

---

## 2. The 6-Agent EDS Lifecycle (effort model)

Same lifecycle and unit costs as Wave-1.

| Phase | Agent | Responsibility |
|---|---|---|
| 1 — Plan | **strategist** | User story, acceptance criteria, test cases, `block.md`, IA |
| 1.5 — Design | **styleforge** | Design tokens, color/type mapping, responsive + motion, `overrides.css` |
| 3–4 — Build | **blockwright** | Block JS/CSS/markup, draft content, lint, local test report |
| 5–6 — Review/Test | **sentinel** | Code review (docs/blocks.md + WCAG AA), Playwright specs, green run |
| 7–8 — Integrate | **composer** | Block-library entry + page assembly from authored content |
| Deploy | **pilot** | Pre-push hygiene, PSI ≥100 target, feature-preview URL, PR prep |

### 2.1 Unit costs (ideal person-days, full lifecycle)

| Work item | strategist | styleforge | blockwright | sentinel | composer | **Total** |
|---|---|---|---|---|---|---|
| New **simple** block | 0.5 | 0.25 | 1.0 | 0.75 | 0.5 | **3.0** |
| New **interactive** block | 0.75 | 0.5 | 2.0 | 1.25 | 0.75 | **5.25** |
| Reuse/config existing block (per site) | 0.1 | 0 | 0.2 | 0.2 | 0.3 | **0.8** |
| Page assembly + authoring (per page) | — | — | — | 0.1 | 0.2 | **~0.4** |

> Assumes mid-level EDS engineers, this boilerplate as baseline, the Wave-1 shared library already built, and MLR review running in parallel (calendar impact in §5, not build effort).

---

## 3. Effort Estimate by Site (person-days)

Each site total = discovery + strategist + styleforge + blockwright (site-specific config/integration only) + sentinel + composer/content + pilot. **Shared-block build is counted once in §3.13.**

### 3.1 viberzihcp.com — *Medium–High* (~14 pages, HCP gate)
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 1.5 | 2.0 | 1.0 | 2.0 | 2.0 | 6.0 | 1.0 | **15.5** |

### 3.2 teflaro.com — *Medium–High* (~20 pages, dense clinical/dosing matrix)
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 1.5 | 2.0 | 1.0 | 2.5 | 2.5 | 8.0 | 1.0 | **18.5** |

### 3.3 xengelstent.com — *Low–Medium* (4 patient pages)
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 1.0 | 1.0 | 0.75 | 1.0 | 1.0 | 2.0 | 0.75 | **7.5** |

> +~5 pd if the `hcp.xengelstent.com` subdomain (~10 clinical pages + reimbursement PDFs + HCP registration) is migrated in the same scope.

### 3.4 myglaucoma.com — *Medium* (~8 pages, scrapeable; quiz + form + video)
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 1.0 | 1.5 | 1.0 | 3.0 (risk-assessment wiring + form + video) | 2.0 | 3.5 | 1.0 | **13.0** |

### 3.5 restasis.com — *Medium* (~14 pages, multi-step savings flow)
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 1.0 | 1.5 | 1.0 | 2.5 | 2.0 | 6.0 | 1.0 | **15.0** |

### 3.6 bystolic.com — *Low–Medium* (~12 pages, scrapeable, all shared blocks)
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 0.75 | 1.5 | 1.0 | 1.5 | 1.5 | 5.0 | 1.0 | **12.25** |

### 3.7 viibryd.com — *Low–Medium* (~12 pages, boxed warning, legacy `.aspx`)
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 1.0 (legacy URL map) | 1.5 | 1.0 | 1.5 | 1.5 | 5.0 | 1.0 | **12.5** |

### 3.8 infedlocator.com — *Medium–High* (1–3 pages; the locator IS the project)
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 2.0 (data source/API + map provider) | 1.5 | 0.75 | 3.5 (locator-map integration + a11y) | 2.0 | 1.0 | 1.0 | **11.75** |

### 3.9 depakotehcp.com — *Medium–High* (~16 pages, multi-indication, boxed)
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 1.5 | 2.0 | 1.0 | 2.5 (indication-selector + dosing/clinical config ×3) | 2.5 | 6.5 | 1.0 | **17.0** |

### 3.10 depakote.com — *Medium–High* (~16 pages, multi-indication, boxed; shares HCP domain)
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 1.5 | 2.0 | 1.0 (shares depakotehcp tokens) | 2.0 | 2.5 | 6.5 | 1.0 | **16.5** |

### 3.11 taytulla.com — *Medium* (~14 pages, two interactive tools, age gate)
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 1.0 | 2.0 | 1.0 | 2.5 (comparison-tool + discussion-guide config) | 2.0 | 6.0 | 1.0 | **15.5** |

### 3.12 fetzima.com — *Low–Medium* (~14 pages, boxed, strong viibryd synergy)
| Discovery | strategist | styleforge | blockwright | sentinel | composer + content | pilot | **Total** |
|---|---|---|---|---|---|---|---|
| 0.75 | 1.0 (reuse viibryd story) | 0.5 (shares viibryd tokens) | 1.0 (reuse viibryd blocks) | 1.5 | 5.5 | 1.0 | **11.25** |

### 3.13 Shared foundation (built once, amortized — Batch 2 increment)
| Item | Effort |
|---|---|
| `locator-map` (interactive, full lifecycle) | 5.25 |
| `risk-assessment` quiz (interactive; reuses Wave-1 quiz engine where possible) | 5.25 |
| Brand theming for 12 new brands (token overrides; families share — depakote×2, viibryd/fetzima, eye-care restasis/xengelstent/myglaucoma) | 5.0 |
| Analytics + consent pattern extension (reuse Wave-1 base) | 1.0 |
| **Shared foundation total (Batch 2 increment)** | **16.5** |

> **Prerequisite:** this assumes the **Wave-1 shared block library is already built**. If Batch 2 runs standalone (no Wave-1), add **~36 pd** for the 12 shared blocks (12 × 3.0) it depends on.

---

## 4. Roll-up

| Line | Person-days |
|---|---|
| viberzihcp.com | 15.5 |
| teflaro.com | 18.5 |
| xengelstent.com | 7.5 |
| myglaucoma.com | 13.0 |
| restasis.com | 15.0 |
| bystolic.com | 12.25 |
| viibryd.com | 12.5 |
| infedlocator.com | 11.75 |
| depakotehcp.com | 17.0 |
| depakote.com | 16.5 |
| taytulla.com | 15.5 |
| fetzima.com | 11.25 |
| **Site subtotal** | **166.25** |
| Shared foundation increment (§3.13) | 16.5 |
| **Build subtotal (with Wave-1 library reused)** | **182.75** |
| Program overhead (~20%): PM, cross-site QA/UAT, accessibility audit, MLR coordination | ~36.5 |
| **Grand total (point estimate, library reused)** | **~219 person-days** |

**Range with uncertainty:** **190–250 person-days** (~38–50 person-weeks; ~9.5–12.5 person-months) when the Wave-1 shared library exists. **Standalone (build the shared library too): add ~36 pd → ~255 pd point estimate.**

### Effort split by agent (approx., across Batch 2, library reused)
| Agent | Share | Person-days |
|---|---|---|
| strategist (plan / content model) | ~12% | ~22 |
| styleforge (design tokens) | ~7% | ~13 |
| blockwright (build/config) | ~30% | ~55 |
| sentinel (review + tests) | ~13% | ~24 |
| composer (library + page assembly) | ~37% | ~67 |
| pilot (deploy/PSI/PR) | ~6% | ~12 |
| (discovery spikes, folded into sites) | ~8% | ~15 |

> Note vs Wave-1: blockwright's share drops (almost no net-new blocks) while **composer/content rises** — Batch 2 is dominated by page assembly and content authoring across many similar DTC sites, not block engineering.

### Indicative schedule
With a pod of **3 EDS engineers + 1 tech lead + part-time PM/QA**, ~219 pd ≈ **12–15 calendar weeks** (library reused), MLR in parallel. Recommended waves:

1. **Wave A — Quick wins / scrapeable & high-reuse:** bystolic, viibryd, fetzima, xengelstent (small, all-shared-blocks). Validate the reuse pattern early.
2. **Wave B — Patient DTC with light interactivity:** restasis, taytulla, myglaucoma (savings flows, comparison/discussion tools, quiz).
3. **Wave C — HCP & multi-indication:** viberzihcp, teflaro, depakote, depakotehcp (gates, dense clinical/dosing tables, indication-selector, heaviest MLR).
4. **Wave D — infedlocator** once the locator data-source/API dependency is confirmed (resolve discovery first).

---

## 5. Key Assumptions & Risks

**Assumptions**
- The **Wave-1 shared design system + block library is built and reused**; brands differ by token overrides, not bespoke blocks.
- Savings/copay enrollment stays on external AbbVie/Allergan properties (link-out), not rebuilt here.
- Content authors (or a migration script) handle bulk page authoring; engineering owns blocks + assembly.
- MLR/regulatory review runs in parallel and does not block engineering.
- Brand families share tokens and content patterns (depakote×2, viibryd/fetzima antidepressants, restasis/xengelstent/myglaucoma eye-care).

**Risks (and mitigations)**
- **#1 — Source not fetchable this pass:** 10 of 12 inventories are search-derived, not rendered. *Mitigation:* mandatory discovery spike with live rendering (and HCP-gate access) before committing per-site estimates; re-baseline after.
- **MLR review is the top schedule risk** — every page with ISI/PI/claims needs sign-off; **boxed-warning brands** (viibryd, fetzima, depakote, depakotehcp) and the **IV-antibiotic ISI** (teflaro) carry the heaviest verbatim-fidelity burden. *Mitigation:* freeze content early, lock PRC/job codes, parallelize.
- **infedlocator data dependency:** the center/provider dataset + map provider are unknown and external. *Mitigation:* confirm ownership, schema, geocoding, and API access in the Wave-D discovery spike; could swing effort ±3 pd.
- **Multi-indication consolidation (depakote ↔ depakotehcp):** shared-domain `/hcp/*` needs a canonical/redirect decision. *Mitigation:* decide co-locate vs split before build.
- **Interactive blocks** (locator-map, risk-assessment, comparison/discussion tools) carry accessibility + endpoint risk. *Mitigation:* early sentinel WCAG review; endpoint contracts up front.
- **Device regulatory framing (xengelstent):** DFU/labeling, not drug PI — confirm safety-content rules differ; vision-impaired audience raises the accessibility bar.
- **Legacy URL sprawl** (viibryd `.aspx`/`/Content/`, myglaucoma ASP.NET, mixed-case routes on viberzihcp, restasis `m.` mobile host): deliberate redirect maps required to preserve SEO and paid-search links.

---

*Estimates are bottom-up and intended for planning; re-baseline after the discovery spike on the non-fetchable sites and after confirming the infedlocator data source. Verified data sources and per-site detail are in [`docs/requirements/`](./requirements/). Companion Wave-1 estimate: [`solution-and-effort-estimation.md`](./solution-and-effort-estimation.md).*
