# Duopa-Style Site — Planning Overview

## Site Description

A pharma brand marketing site modelled on duopa.com — the AbbVie website for DUOPA
(carbidopa/levodopa enteral suspension) for advanced Parkinson's disease. The site
serves two primary audiences: patients/caregivers and healthcare professionals (HCPs).
It is a regulatory-compliant, marketing-oriented site with persistent Important Safety
Information (ISI), audience gating, and multi-page content about the medication, its
administration, and support programs.

---

## Pages in Scope

| Page | Priority | Notes |
|---|---|---|
| Home (`/`) | P0 | Primary conversion surface; hero, stats, benefits, safety |
| What Is DUOPA? (`/what-is-duopa`) | P0 | Product explainer; tabs, split sections, clinical data |
| Understanding Advancing Parkinson's (`/understanding`) | P1 | Educational; icon-text stats, split layout |
| Carrying Case Styles (`/carrying-cases`) | P1 | Product gallery; card grid |
| Patient Resources (`/patient-resources`) | P1 | Resource cards, support CTA, downloads |
| HCP Section (`/hcp`) | P2 | Audience-gated; clinical data, prescribing info |

---

## Block Inventory

### Existing Blocks — Reuse As-Is

| Block | Directory | Reuse Rationale |
|---|---|---|
| `header` | `blocks/header/` | Site-wide nav bar; extend `/nav` fragment for DUOPA nav items |
| `footer` | `blocks/footer/` | Site-wide footer; extend `/footer` fragment with regulatory links |
| `hero-carousel` | `blocks/hero-carousel/` | Homepage hero banner (single-slide = static hero; multi-slide = rotating) |
| `tabs` | `blocks/tabs/` | "More Time / Fewer Pills" messaging toggle on What Is DUOPA page |
| `nav-cards` | `blocks/nav-cards/` | Quick-navigation card grid below hero (icon + heading + CTA) |
| `fragment` | `blocks/fragment/` | ISI content fragment injection |
| `navigation` | `blocks/navigation/` | Primary nav links inside header fragment |

### Blocks Needing Minor Extension (Not Net-New)

| Block | Current State | Extension Needed |
|---|---|---|
| `image-teaser` | Skeleton `block.md` only | Define content model; used for image+text split layout |

### Net-New Blocks — Priority Order

| Priority | Block | Purpose |
|---|---|---|
| P0 | `stat-bar` | Three-column strip of clinical statistics with icon, number, and label |
| P0 | `isi-bar` | Sticky collapsible Important Safety Information bar (regulatory requirement) |
| P1 | `promo-banner` | Full-width coloured CTA banner with headline, body, and button |
| P1 | `split-section` | Two-column image + text layout with background colour variant |
| P2 | `audience-gate` | HCP verification modal that gates content behind a confirmation click |

---

## Recommended Build Order

```
Phase A — Foundation (unblock all pages)
  1. styleforge  → extract brand tokens from duopa.com colour palette, type scale,
                   and button styles; write to styles/config/overrides.css
  2. blockwright → stat-bar     (homepage stats strip — unblocks hero section completion)
  3. blockwright → isi-bar      (regulatory requirement — needed on every page)

Phase B — Page Completion
  4. blockwright → promo-banner (support program CTAs — needed on homepage + resources)
  5. blockwright → split-section (product explainer sections — needed on What Is DUOPA)
  6. blockwright → image-teaser content model + implementation (carrying cases gallery)

Phase C — Audience & HCP
  7. blockwright → audience-gate (HCP section gating)

Phase D — Assembly & QA
  8. composer    → assemble homepage usage page, register blocks in block library
  9. sentinel    → Playwright specs, accessibility audit, lint
 10. pilot       → push, PageSpeed Insights, PR
```

---

## Handoff Notes

- **styleforge** must run before any block CSS is written. The DUOPA brand uses a
  deep navy primary colour (approx. `#003366`), a warm orange accent (approx. `#E8651A`),
  and clean white backgrounds. These must be mapped to `--color-primary-*` and a custom
  `--color-accent-*` semantic token set in `overrides.css`.
- **isi-bar** must be tested on every page template because it interacts with sticky
  positioning and `z-index` layering managed by the header.
- **audience-gate** stores the HCP confirmation in `sessionStorage` — this must be
  documented in the block.md so blockwright implements it correctly.
- The `tabs` block already exists and should be used as-is for the "More Time / Fewer
  Pills" toggle. No new tab block is needed.
- Fragment loading (`/fragments/isi`) will be needed for ISI content. Blockwright must
  follow the `fetchFragmentHtml` pattern from `AGENTS.md`.
