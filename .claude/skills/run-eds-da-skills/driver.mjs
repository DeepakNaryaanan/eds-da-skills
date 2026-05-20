#!/usr/bin/env node
// Drive the local AEM Edge Delivery dev server with Playwright + system Chrome.
//
// Usage:
//   node driver.mjs screenshot <path> [--wait <selector>] [--out <file>] [--viewport WxH]
//   node driver.mjs eval <path> "<js-expression>"   // runs in page context; prints JSON result
//   node driver.mjs console <path> [--wait <selector>]   // dumps console messages + page errors
//
// All paths are relative to BASE_URL (default http://localhost:3000).
// Screenshots default to /tmp/eds-shots/<slug>.png.

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const SHOTS_DIR = process.env.EDS_SHOTS_DIR || '/tmp/eds-shots';

function parseFlags(argv) {
  const out = { positional: [], flags: {} };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a.startsWith('--')) {
      out.flags[a.slice(2)] = argv[i + 1];
      i += 1;
    } else {
      out.positional.push(a);
    }
  }
  return out;
}

function slug(p) {
  return p.replace(/^\/+/, '').replace(/[^a-z0-9._-]+/gi, '-') || 'root';
}

async function withPage(path, waitSelector, viewport, fn) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const consoleMsgs = [];
  const pageErrors = [];
  page.on('console', (m) => consoleMsgs.push({ type: m.type(), text: m.text() }));
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  try {
    const url = new URL(path, BASE).toString();
    const res = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    const status = res ? res.status() : 0;
    if (waitSelector) {
      await page.waitForSelector(waitSelector, { timeout: 15000 });
    }
    return await fn({ page, status, consoleMsgs, pageErrors });
  } finally {
    await browser.close();
  }
}

const { positional, flags } = parseFlags(process.argv.slice(2));
const [cmd, path, ...rest] = positional;

if (!cmd || !path) {
  console.error('usage: driver.mjs <screenshot|eval|console> <path> [args]');
  process.exit(2);
}

const viewport = (() => {
  const v = flags.viewport;
  if (!v) return { width: 1280, height: 800 };
  const [w, h] = v.split('x').map(Number);
  return { width: w, height: h };
})();

if (cmd === 'screenshot') {
  const out = flags.out || resolve(SHOTS_DIR, `${slug(path)}.png`);
  mkdirSync(dirname(out), { recursive: true });
  const { status, errs } = await withPage(path, flags.wait, viewport, async ({ page, status: s, pageErrors }) => {
    await page.screenshot({ path: out, fullPage: true });
    return { status: s, errs: pageErrors };
  });
  console.log(JSON.stringify({ url: new URL(path, BASE).toString(), status, screenshot: out, pageErrors: errs }, null, 2));
} else if (cmd === 'eval') {
  const expr = rest.join(' ');
  if (!expr) {
    console.error('eval requires an expression argument');
    process.exit(2);
  }
  const result = await withPage(path, flags.wait, viewport, async ({ page }) => page.evaluate(`(async () => (${expr}))()`));
  console.log(JSON.stringify(result, null, 2));
} else if (cmd === 'console') {
  const { status, consoleMsgs, pageErrors } = await withPage(path, flags.wait, viewport, async (ctx) => {
    await ctx.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    return ctx;
  });
  console.log(JSON.stringify({ url: new URL(path, BASE).toString(), status, consoleMsgs, pageErrors }, null, 2));
} else {
  console.error(`unknown command: ${cmd}`);
  process.exit(2);
}
