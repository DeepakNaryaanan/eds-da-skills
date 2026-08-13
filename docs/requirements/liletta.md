# Requirements: LILETTA (liletta.com)

**Product:** LILETTA® (levonorgestrel-releasing intrauterine system, 52 mg) — AbbVie (Allergan) in partnership with **Medicines360**. Hormonal IUD: ~99% effective for pregnancy prevention up to 8 years; treats heavy menstrual bleeding (HMB) up to 5 years.
**Audience:** Patients/consumers (women considering or using an IUD). Consumer DTC site with an age/audience interstitial gate. Bilingual (English + Spanish patient brochure).

> Data basis: homepage HTML fetched live (HTTP 200, 82 KB) + verified `sitemap.xml` (20 URLs). High-confidence file.

## Site Map & Page Inventory

| Page | URL path | Purpose | Content type |
|---|---|---|---|
| Home | `/` | Hero "Your life. Your journey." + announcing HMB | Hero + promos |
| About LILETTA | `/about` (a.k.a. `/about/liletta`) | Product overview | Article |
| What it looks like | `/about/what-it-looks-like` | Device visual | Article + image |
| How it works | `/about/how-it-works` | Mechanism | Article |
| What to expect | `/about/what-to-expect` | Before/during | Article |
| How to insert | `/about/how-to-insert` | Insertion overview | Article + video/diagram |
| What to expect after insertion | `/about/what-to-expect-after-insertion` | Aftercare | Article |
| What to know | `/about/what-to-know` | Key facts | Article |
| Birth control comparison | `/birth-control-comparison` | Compare IUD vs other methods | Comparison table |
| Birth control quiz | `/birth-control/quiz` | Interactive method-finder quiz | Interactive tool |
| Questions for HCP | `/birth-control/questions` (`/birth-control-questions`) | Discussion guide | Article / list |
| Cost | `/acquiring/cost`, `/how-much-does-Liletta-cost` | Pricing overview | Article |
| Insurance | `/acquiring/insurance`, `/costs-with-insurance` | Coverage / calling insurer | Article |
| Savings card | `/acquiring/savings-card` → `LILETTAcard.com` | Patient savings ($100, save up to $750) | CTA / external |
| How to get LILETTA | `/acquiring/liletta`, `/how-can-I-get-Liletta` | Access steps | Article |
| FAQs | `/faqs` | Common questions | Accordion |
| Help / Site map | `/help`, `/sitemap` | Utility | Utility |

**Confirmed page count:** ~20 unique URLs (sitemap). Note duplicate-cased paths (`/about/...` vs `/About/...`) — normalize on migration.

## Block Inventory Mapping

| Section observed | Existing block | New block needed | Notes |
|---|---|---|---|
| Age/audience interstitial ("CONTINUE TO SITE") | `audience-gate` | — | Reuse; age-confirm variant |
| Sticky ISI / risk warning (`sticky-warning.js`) | `isi-bar` | — | Reuse |
| Header/footer/nav | `header`,`footer`,`navigation` | — | Reuse |
| Hero ("Your life. Your journey.") | `hero-carousel` | — | Reuse |
| "Announcing!" HMB promo | `promo-banner` | — | Reuse |
| Two-up destination promos | `promo-pair` | — | Reuse |
| Topic nav cards | `nav-cards` | — | Reuse |
| How-it-works explainer | `split-section` | — | Image + text |
| Birth control comparison table | — | **`comparison-table`** | IUD vs methods grid — net-new |
| Birth control quiz | — | **`quiz`** (interactive) | Scored method-finder — net-new, key cost driver |
| Email-share modal ("Email a link", "Email this PDF") | — | **`email-share`** | Knockout-validated share form |
| Savings card CTA | `promo-banner` | **`savings-card`** (shared) | Eligibility + route to LILETTAcard.com |
| FAQs | — | **`faq-accordion`** (shared) | Reuse across portfolio |
| References | — | **`reference-list`** (shared) | Citations |
| Brochure downloads (EN/ES) | `resource-list` | **`downloadable-resource`** (shared) | Bilingual PDFs |

**New blocks:** `comparison-table`, `quiz`, `email-share`, `savings-card`*, `faq-accordion`*, `reference-list`*, `downloadable-resource`* (* = shared). Highest net-new block count of the six.

## Design System
- **Colors (from inline styles):** coral/salmon `#ff8d7a` (and `#ff8772`), blue `#236093`, accent blue `#1142aa`, terracotta `#c65440`, green `#74c698`, white. Bright, warm consumer palette.
- **Typography:** **Roboto** + **Roboto Condensed** (300/400/500/700, Google Fonts), **Amatic SC** (display/handwritten accent), plus **Adobe Typekit** (`use.typekit.net/mrp2fbm`). Loaded via `webfont.js`.
- **Motion:** **GSAP** (TweenLite, ScrollTo, EasePack, CSSPlugin) — animated transitions/scroll effects to recreate.
- **Layout/state:** Bootstrap grid + **Knockout.js** MVVM (with knockout.validation/mapping) for forms/share.
- **Responsive:** Modernizr + respond.js (legacy); rebuild mobile-first.

## Integrations & Third-Party
- **Analytics/tag mgmt:** Adobe Launch (`launch.js`) + **DoubleClick Floodlight via GTM** (`site-floodlightGTM`).
- **Consent:** cookie handling via `js.cookie` — confirm OneTrust banner presence.
- **Forms:** email-share form (Knockout validation: `RecipEmail`, `RecipName`, `SenderEmail`, `SenderName`) — needs a send endpoint.
- **Fonts:** Google Fonts + Adobe Typekit.
- **Savings:** external `LILETTAcard.com`.
- **PDFs:** Patient Brochure EN + ES.
- **No** maps/video confirmed on home (insertion may use video on inner page).

## Content Migration
- **Volume:** ~20 pages + EN/ES PDFs.
- **Content types:** product/how-to articles, comparison table, quiz logic, FAQs, ISI/PI, bilingual brochures.
- **Regulatory:** ISI fair balance + full PI; risk info; references; Medicines360 co-branding/attribution; AbbVie PRC/job codes.
- **Localization:** Spanish brochure today; assess whether full Spanish pages are in scope.
- **Redirects:** consolidate duplicate-cased URLs and legacy aliases (`/how-much-does-Liletta-cost` vs `/acquiring/cost`).
- **SEO/metadata:** strong existing meta; preserve.
- **Accessibility:** WCAG 2.1 AA — quiz + comparison table + email-share modal all need full keyboard/AT support; recreate GSAP motion with reduced-motion support.

## Migration Complexity
**High.**
- Largest net-new block set (quiz, comparison-table, email-share) including a stateful interactive quiz.
- GSAP-driven motion + Knockout MVVM forms to re-implement as vanilla EDS.
- Co-branding (Medicines360), bilingual content, and duplicate-URL normalization add coordination overhead.
