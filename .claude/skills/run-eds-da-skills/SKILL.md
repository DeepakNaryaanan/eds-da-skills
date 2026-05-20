---
name: run-eds-da-skills
description: Build, run, screenshot, and drive this AEM Edge Delivery Services site. Use when asked to start the dev server, open a page, screenshot a URL, dump browser console errors, or evaluate JS against the running site.
---

This is an AEM Edge Delivery Services site built on the `aem-boilerplate`. There is no build step — the AEM CLI serves source files straight from disk on port 3000 with auto-reload. Drive it by starting the dev server in the background, then running `.claude/skills/run-eds-da-skills/driver.mjs` (Playwright + system Chrome) to screenshot pages, evaluate JS in page context, or capture browser console output.

All paths below are relative to the repo root (`/Users/191561/Documents/play/Cognizant/eds-da-skills/`).

## Prerequisites

- macOS with Google Chrome installed at `/Applications/Google Chrome.app/` (the driver uses Playwright `channel: 'chrome'`, so no bundled chromium download is needed — that download fails behind the corporate TLS-intercepting proxy).
- Node 20+ and npm 10+ (verified with Node 24.14.1).
- A writable `~/.npm` cache. If `npm install` errors with `EACCES` / `EEXIST` on `~/.npm/_cacache`, root once took over a sub-tree — fix it once:
  ```bash
  sudo chown -R "$(whoami):staff" ~/.npm
  ```

## Setup

```bash
npm install              # installs Playwright + lint tooling
# Skip `npx playwright install` — bundled chromium downloads fail with
# UNABLE_TO_GET_ISSUER_CERT_LOCALLY on this network. The driver uses
# system Chrome instead (playwright.config.js has channel: 'chrome').
```

## Run (agent path)

**1. Start the dev server in the background and wait for it.**

```bash
pkill -f 'aem-cli up' 2>/dev/null
nohup npx -y @adobe/aem-cli up --no-open --forward-browser-logs --html-folder tests \
  > /tmp/eds-dev.log 2>&1 &
echo $! > /tmp/eds-dev.pid
i=0; until curl -sf http://localhost:3000 >/dev/null; do
  i=$((i+1)); [ $i -ge 30 ] && echo "TIMEOUT" && exit 1; sleep 1
done; echo "READY"
```

The `--html-folder tests` flag lets the server serve draft pages from `tests/` (e.g. `/tests/image-teaser-test.html`) without a CMS.

**2. Drive the running site with the driver.**

```bash
# Screenshot any path. Writes JSON metadata to stdout, PNG to /tmp/eds-shots/.
node .claude/skills/run-eds-da-skills/driver.mjs screenshot /
node .claude/skills/run-eds-da-skills/driver.mjs screenshot /tests/image-teaser-test.html

# Evaluate JS in page context (expression — async OK). Result printed as JSON.
node .claude/skills/run-eds-da-skills/driver.mjs eval / "document.title"
node .claude/skills/run-eds-da-skills/driver.mjs eval /tests/image-teaser-test.html \
  "document.querySelectorAll('.image-teaser').length"

# Dump browser console + page errors after the page settles. Surfaces missing
# blocks, decoration crashes, fetch failures.
node .claude/skills/run-eds-da-skills/driver.mjs console /
```

Driver commands:

| command | what it does |
|---|---|
| `screenshot <path> [--wait <selector>] [--out <file>] [--viewport WxH]` | Full-page PNG. Default out is `/tmp/eds-shots/<slug>.png`, viewport 1280×800. |
| `eval <path> "<expr>"` | Evaluates the expression in page context (wrapped in an async IIFE — `await` works). Prints JSON. |
| `console <path> [--wait <selector>]` | Goes to the page, waits for network idle (best-effort, 10s cap), prints all console messages + page errors as JSON. |

Pass `--wait '.tabs[data-block-status="loaded"]'` (or any selector) when a block decorates asynchronously and you need the decorated DOM before the screenshot/eval.

**3. Stop the dev server when done.**

```bash
kill "$(cat /tmp/eds-dev.pid)" 2>/dev/null; rm -f /tmp/eds-dev.pid
```

## Run (human path)

```bash
npx -y @adobe/aem-cli up --no-open --forward-browser-logs --html-folder tests
# Foreground; opens nothing. Visit http://localhost:3000 in a real browser.
# Ctrl-C to stop.
```

## Test

```bash
npm run lint        # ESLint + Stylelint
npm run test:e2e    # Playwright (uses system Chrome; auto-starts the dev server)
```

`npm run test:e2e` will start its own dev server via `playwright.config.js` — kill the background server above first, or it'll `EADDRINUSE`. Then re-launch it after the test run if you still need the driver.

## Gotchas

- **Bundled chromium download fails on this network** with `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` (corporate TLS proxy intercepting `cdn.playwright.dev`). The fix already in tree: `playwright.config.js` uses `channel: 'chrome'`, and the driver passes `channel: 'chrome'` to `chromium.launch`. Don't run `npx playwright install` — it'll just fail; you don't need it.
- **`~/.npm/_cacache` may be root-owned** from a past `sudo npm`. Symptom: `npm install` or `npx ...` aborts with `EEXIST mkdir … _cacache/content-v2/sha512/<xx>/<yy>`. One-shot fix: `sudo chown -R "$(whoami):staff" ~/.npm`. Until you fix it, even `npx -y @adobe/aem-cli` can't fetch.
- **The homepage logs real block-load errors.** `console /` prints things like `failed to load module for hero http://localhost:3000/blocks/hero/hero.js` and `failed to load block hero Event` — these are missing blocks in this repo's `blocks/`, not driver bugs. Treat the absence of *new* errors as the signal.
- **`.plain.html` is your friend for block introspection.** `curl http://localhost:3000/path.plain.html` returns the authored markup before any client decoration — much faster than spinning up the driver if you only need to see the input contract.
- **Several `tests/*-test.html` fixtures referenced by block specs are missing** (`footer-test.html`, `fragment-test.html`, `header-test.html`, `tabs-test.html`). Only `image-teaser-test.html` exists. `npm run test:e2e` currently reports 5 passed / 19 failed / 1 skipped because of this — the failures are 404s in the test pages, not regressions in the blocks. Don't waste cycles debugging selectors until the fixture pages are added.

## Troubleshooting

- **`curl http://localhost:3000` returns nothing / connection refused after launching**: tail `/tmp/eds-dev.log`. Most common cause is the npm cache issue above; the AEM CLI logs the npm error and exits before binding the port.
- **Driver hits `Executable doesn't exist at …/chromium-mac/chrome-mac/Chromium.app`**: you removed the `channel: 'chrome'` flag somewhere. Put it back on both `playwright.config.js` and `driver.mjs`.
- **`page.goto` times out at 30s on a path that works in a real browser**: the AEM CLI is busy fetching from `*.aem.page` for proxied content. First request to a path can be slow; rerun once and it'll be cached.
- **Screenshot is the 404 page** (shows `Page Not Found`): the path doesn't exist locally and isn't proxied either. Confirm with `curl -I http://localhost:3000/<path>` — anything other than 200 means there's no content there to render.
