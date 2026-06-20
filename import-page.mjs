#!/usr/bin/env node
/**
 * import-page.mjs
 *
 * Scrape a URL and produce an EDS-authored HTML file that mirrors the shape of
 * `tests/about-us-test.html`:
 *
 *   Section 1 — patient-resources  (eyebrow, h2, image, intro, 3 resource items)
 *   Section 2 — tabs               (3 tabs)
 *   Section 3 — resource-list      (3 cards)
 *
 * Usage:
 *   node import-page.mjs <url> [--slug my-page] [--out import-work]
 *
 * Output:
 *   <out>/<slug>-test.html          authored HTML matching the about-us layout
 *   <out>/<slug>.metadata.json      provenance: source URL, title, image map
 *   <out>/images/<files>            downloaded images (best effort)
 *
 * Note: this is a heuristic reshaping, not a 1:1 import. Content extracted
 * from the source is sliced into the template's slots; gaps are filled with
 * placeholders so the output always renders.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import path from 'node:path';
import process from 'node:process';

// ---------- CLI parsing ----------

function parseArgs(argv) {
  const args = { url: null, slug: null, out: 'import-work' };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i += 1) {
    const a = rest[i];
    if (a === '--slug') { args.slug = rest[i + 1]; i += 1; } else if (a === '--out') { args.out = rest[i + 1]; i += 1; } else if (a === '-h' || a === '--help') { args.help = true; } else if (!args.url) { args.url = a; }
  }
  return args;
}

function printHelpAndExit() {
  process.stdout.write('Usage: node import-page.mjs <url> [--slug name] [--out dir]\n\n'
    + '  <url>          Source URL to scrape (required)\n'
    + '  --slug name    Output basename (default: derived from URL path)\n'
    + '  --out dir      Output directory (default: import-work)\n');
  process.exit(0);
}

// ---------- Tiny HTML helpers ----------

const DECODE = {
  amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ',
};
function decode(s) {
  if (!s) return '';
  return s
    .replace(/&(#?\w+);/g, (m, e) => DECODE[e] || (e.startsWith('#') ? String.fromCharCode(parseInt(e.slice(1), 10)) : m))
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTags(s) {
  return decode(s.replace(/<[^>]*>/g, ' '));
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pickMeta(html, name) {
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i');
  const m = html.match(re);
  if (m) return decode(m[1]);
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, 'i');
  const m2 = html.match(re2);
  return m2 ? decode(m2[1]) : '';
}

function pickAll(html, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'gi');
  const out = [];
  let m;
  // eslint-disable-next-line no-cond-assign
  while ((m = re.exec(html)) !== null) out.push(decode(m[1]));
  return out;
}

function pickFirst(html, tag) {
  return pickAll(html, tag)[0] || '';
}

// Pull main content area if present; fall back to <body>.
function pickMain(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (main) return main[1];
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  if (article) return article[1];
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  return body ? body[1] : html;
}

function pickImages(html, baseUrl) {
  const re = /<img\b[^>]*>/gi;
  const out = [];
  let m;
  // eslint-disable-next-line no-cond-assign
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    const src = (tag.match(/\bsrc=["']([^"']+)["']/i) || [])[1];
    const alt = decode((tag.match(/\balt=["']([^"']*)["']/i) || [])[1] || '');
    if (!src) continue;
    if (src.startsWith('data:')) continue;
    let abs;
    try { abs = new URL(src, baseUrl).toString(); } catch { continue; }
    out.push({ src: abs, alt });
  }
  // de-dupe by URL preserving first occurrence
  const seen = new Set();
  return out.filter((i) => (seen.has(i.src) ? false : seen.add(i.src)));
}

// ---------- Image download ----------

async function downloadImage(img, imagesDir) {
  try {
    const res = await fetch(img.src);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const u = new URL(img.src);
    let base = path.basename(u.pathname) || 'image';
    if (!path.extname(base)) {
      const ct = res.headers.get('content-type') || '';
      const ext = (ct.match(/image\/(jpeg|jpg|png|webp|gif|svg\+xml)/) || [])[1];
      if (ext) base += `.${ext === 'svg+xml' ? 'svg' : (ext === 'jpeg' ? 'jpg' : ext)}`;
    }
    base = base.replace(/[^a-zA-Z0-9._-]+/g, '-').toLowerCase();
    const file = path.join(imagesDir, base);
    await writeFile(file, buf);
    return { ...img, localPath: `./images/${base}` };
  } catch {
    return null;
  }
}

// ---------- Slug derivation ----------

function deriveSlug(url, fallback = 'imported-page') {
  try {
    const u = new URL(url);
    const seg = u.pathname.split('/').filter(Boolean).pop();
    if (seg) return seg.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-]+/g, '-').toLowerCase();
    return (u.hostname || fallback).replace(/[^a-zA-Z0-9-]+/g, '-').toLowerCase();
  } catch {
    return fallback;
  }
}

// ---------- Content slicing ----------

// Take the first N paragraphs that look like real prose (>= 40 chars).
function pickProse(html, minLen = 40) {
  return pickAll(html, 'p').filter((p) => p.length >= minLen);
}

function sliceContent(rawHtml, source) {
  const main = pickMain(rawHtml);
  const title = decode(pickFirst(rawHtml, 'title')) || source.url;
  const description = pickMeta(rawHtml, 'description') || pickMeta(rawHtml, 'og:description');
  const h1 = stripTags(pickFirst(main, 'h1')) || title;
  const h2s = pickAll(main, 'h2').map(stripTags).filter(Boolean);
  const h3s = pickAll(main, 'h3').map(stripTags).filter(Boolean);
  const prose = pickProse(main);
  const images = pickImages(main, source.url);

  // Section 1 — patient-resources slots
  const eyebrow = (h2s[0] || 'About').toUpperCase();
  const heroHeading = h1;
  const heroImage = images[0] || null;
  const intro = prose[0] || description || 'Introduction paragraph for the imported page.';

  // 3 resource items: prefer h3 + matching prose
  const resources = [];
  for (let i = 0; i < 3; i += 1) {
    const heading = h3s[i] || h2s[i + 1] || `Section ${i + 1}`;
    const body = prose[i + 1] || 'Add a short supporting description for this item.';
    resources.push({
      heading,
      body,
      cta: { href: `${new URL(source.url).pathname}#${heading.toLowerCase().replace(/\s+/g, '-')}`, text: 'Learn more' },
    });
  }

  // Section 2 — tabs (3 panels)
  const tabLabels = ['Mission', 'Vision', 'Values'];
  const tabBodies = [];
  for (let i = 0; i < 3; i += 1) {
    tabBodies.push(prose[i + 4] || prose[i + 1] || 'Tab body content.');
  }

  // Section 3 — resource-list (3 cards)
  const cards = [];
  for (let i = 0; i < 3; i += 1) {
    cards.push({
      image: images[i + 1] || images[0] || null,
      category: h3s[i + 3] || h2s[i + 2] || 'Story',
      headline: h3s[i] || h2s[i + 1] || `Featured story ${i + 1}`,
      href: source.url,
      body: prose[i + 7] || prose[i + 1] || 'Card supporting copy.',
      date: new Date().toISOString().slice(0, 10),
    });
  }

  return {
    title, description, eyebrow, heroHeading, heroImage, intro, resources, tabLabels, tabBodies, cards, images,
  };
}

// ---------- HTML rendering ----------

function pictureFor(img, fallbackLabel) {
  if (img && img.localPath) {
    return `<picture><img src="${escapeHtml(img.localPath)}" alt="${escapeHtml(img.alt || fallbackLabel)}"/></picture>`;
  }
  const label = encodeURIComponent(fallbackLabel);
  const svg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23cbd5e1'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='%23475569'%3E${label}%3C/text%3E%3C/svg%3E`;
  return `<picture><img src="${svg}" alt="${escapeHtml(fallbackLabel)}"/></picture>`;
}

function renderHtml(model) {
  const r = model.resources;
  const t = model.tabBodies;
  const c = model.cards;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(model.title)}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="description" content="${escapeHtml(model.description)}"/>
    <script nonce="aem" src="/scripts/aem.js" type="module"></script>
    <script nonce="aem" src="/scripts/scripts.js" type="module"></script>
    <link rel="stylesheet" href="/styles/styles.css"/>
  </head>
  <body>
    <header></header>
    <main>
      <div class="section">
        <div class="patient-resources" data-block-name="patient-resources">
          <div>
            <div>
              <p>${escapeHtml(model.eyebrow)}</p>
              <h2>${escapeHtml(model.heroHeading)}</h2>
              ${pictureFor(model.heroImage, model.heroHeading)}
            </div>
            <div>
              <p>${escapeHtml(model.intro)}</p>
            </div>
          </div>
${r.map((res) => `          <div>
            <div>
              <h3>${escapeHtml(res.heading)}</h3>
              <p>${escapeHtml(res.body)}</p>
              <a href="${escapeHtml(res.cta.href)}">${escapeHtml(res.cta.text)}</a>
            </div>
          </div>`).join('\n')}
        </div>
      </div>

      <div class="section">
        <h2 id="our-approach">Our Approach</h2>
        <p>Three pillars define how we work. Switch between the tabs to learn more.</p>
        <div class="tabs" data-block-name="tabs">
${model.tabLabels.map((label, i) => `          <div>
            <div>${escapeHtml(label)}</div>
            <div>
              <p>${escapeHtml(t[i])}</p>
            </div>
          </div>`).join('\n')}
        </div>
      </div>

      <div class="section">
        <h2 id="leadership">Featured Stories</h2>
        <p>Highlights drawn from the imported page.</p>
        <div class="resource-list" data-block-name="resource-list">
${c.map((card) => `          <div>
            <div>
              ${pictureFor(card.image, card.category)}
            </div>
            <div>
              <p><em>${escapeHtml(card.category)}</em></p>
              <p><strong><a href="${escapeHtml(card.href)}">${escapeHtml(card.headline)}</a></strong></p>
              <p>${escapeHtml(card.body)}</p>
              <p>${escapeHtml(card.date)}</p>
            </div>
          </div>`).join('\n')}
        </div>
      </div>
    </main>
    <footer></footer>
  </body>
</html>
`;
}

// ---------- Main ----------

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) printHelpAndExit();
  if (!args.url) {
    process.stderr.write('Error: <url> is required.\n\n');
    printHelpAndExit();
  }

  const slug = args.slug || deriveSlug(args.url);
  const outDir = path.resolve(args.out);
  const imagesDir = path.join(outDir, 'images');
  await mkdir(imagesDir, { recursive: true });

  process.stdout.write(`Fetching ${args.url} ...\n`);
  const res = await fetch(args.url, { headers: { 'user-agent': 'eds-import-page/1.0' } });
  if (!res.ok) {
    process.stderr.write(`Fetch failed: HTTP ${res.status} ${res.statusText}\n`);
    process.exit(1);
  }
  const html = await res.text();

  process.stdout.write('Slicing content ...\n');
  const model = sliceContent(html, { url: args.url });

  // Download up to 4 images (hero + 3 cards) to keep things small.
  const targetImages = model.images.slice(0, 4);
  process.stdout.write(`Downloading ${targetImages.length} image(s) ...\n`);
  const localImages = (await Promise.all(targetImages.map((img) => downloadImage(img, imagesDir)))).filter(Boolean);
  // Re-attach local paths in the model by URL match.
  function relink(img) {
    if (!img) return img;
    const hit = localImages.find((li) => li.src === img.src);
    return hit ? { ...img, localPath: hit.localPath } : img;
  }
  model.heroImage = relink(model.heroImage);
  model.cards = model.cards.map((c) => ({ ...c, image: relink(c.image) }));

  const htmlOut = renderHtml(model);
  const htmlPath = path.join(outDir, `${slug}-test.html`);
  await writeFile(htmlPath, htmlOut, 'utf8');

  const metadata = {
    source: { url: args.url, title: model.title, description: model.description },
    output: { html: path.relative(process.cwd(), htmlPath), slug },
    images: localImages.map((i) => ({ src: i.src, localPath: i.localPath, alt: i.alt })),
    generatedAt: new Date().toISOString(),
  };
  await writeFile(path.join(outDir, `${slug}.metadata.json`), `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');

  process.stdout.write(`\nWrote ${htmlPath}\n`);
  process.stdout.write(`Wrote ${path.join(outDir, `${slug}.metadata.json`)}\n`);
  process.stdout.write('\nPreview locally with the dev server, then:\n');
  process.stdout.write(`  cp ${htmlPath} tests/${slug}-test.html\n`);
  process.stdout.write('  npx -y @adobe/aem-cli up --no-open --html-folder tests\n');
  process.stdout.write(`  open http://localhost:3000/${slug}-test.html\n`);
}

main().catch((err) => {
  process.stderr.write(`${err.stack || err.message || err}\n`);
  process.exit(1);
});
