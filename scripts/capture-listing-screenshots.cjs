// One-off script: capture 3 pixel-perfect screenshots for the Uneed.best
// directory listing. Targets production (jsontools.space) since that's what
// visitors actually see — see run-json-tools SKILL.md "Dev server ≠ what
// visitors get". Reuses the CodeMirror clipboard-paste pattern documented as
// reliable in .claude/skills/run-json-tools/driver.mjs (locator.fill() does
// not work reliably on CodeMirror's contenteditable div).
const { chromium } = require('../node_modules/playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'https://jsontools.space';
const OUT_DIR = path.join(__dirname, '../../captures');
const VIEWPORT = { width: 1600, height: 1000 };

const SAMPLE_JSON_FORMATTER = `{
  "user": {
    "id": "usr_8841",
    "name": "Alice Martin",
    "email": "alice.martin@example.com",
    "address": {
      "street": "12 Rue de Rivoli",
      "city": "Paris",
      "country": "France",
      "postalCode": "75001"
    },
    "orders": [
      { "id": "ord_001", "total": 42.5, "status": "shipped" },
      { "id": "ord_002", "total": 108.0, "status": "processing" },
      { "id": "ord_003", "total": 15.99, "status": "delivered" }
    ],
    "active": true
  }
}`;

const SAMPLE_JSON_TREE = `{
  "company": "Acme Corp",
  "founded": 2014,
  "departments": {
    "engineering": {
      "headcount": 42,
      "teams": ["platform", "mobile", "data"]
    },
    "sales": {
      "headcount": 18,
      "regions": ["EU", "US", "APAC"]
    }
  },
  "offices": [
    { "city": "Paris", "employees": 30 },
    { "city": "Berlin", "employees": 12 }
  ],
  "active": true
}`;

// iat/exp set in the future (2026) so the decoder shows a valid/active token,
// not the red "expired" banner — this is a marketing screenshot, not a bug demo.
// Signature is arbitrary: the tool explicitly never verifies it ("Signature is
// not verified. The secret key is never required or sent anywhere.").
const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiJ1c2VyXzQyIiwibmFtZSI6IkFsaWNlIE1hcnRpbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4NTAwMDAwMCwiZXhwIjoxNzkyNzc2MDAwfQ' +
  '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const wait = (page, ms) => page.waitForTimeout(ms);

// CodeMirror 6's .cm-content is a contenteditable div, not an <input>/<textarea>;
// locator.fill() is unreliable on it. Clipboard + Ctrl+V is the documented
// reliable pattern (driver.mjs cmdPaste).
async function pasteIntoCodeMirror(page, text) {
  await page.waitForSelector('.cm-content', { timeout: 15000 })
  await page.evaluate((t) => navigator.clipboard.writeText(t), text)
  const editor = page.locator('.cm-content').first()
  await editor.click()
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Control+V')
}

async function shoot(page, url, name, fn) {
  console.log('→', name)
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.page', { timeout: 15000 })
  // Some inputs (e.g. jwt-decoder's <textarea v-model="token">) are plain
  // server-rendered elements initialized with a composable default (here,
  // a built-in sample JWT), not client-only mounted like CodeMirror. Filling
  // them right after `.page` appears races Vue hydration: hydration finishes
  // afterward and clobbers the manually-set DOM value back to the reactive
  // default. Give hydration a moment to settle first.
  await wait(page, 800)
  await fn(page)
  const out = path.join(OUT_DIR, name)
  await page.screenshot({ path: out })
  console.log('  saved:', out)
}

;(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: 'dark',
    permissions: ['clipboard-read', 'clipboard-write'],
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (err) => errors.push('PAGE ERROR: ' + err.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text())
  })

  await shoot(page, `${BASE}/tools/json-formatter`, 'json-formatter-listing.png', async (p) => {
    await pasteIntoCodeMirror(p, SAMPLE_JSON_FORMATTER)
    await wait(p, 1200) // live computed() re-render
  })

  await shoot(page, `${BASE}/tools/jwt-decoder`, 'jwt-decoder-listing.png', async (p) => {
    // JWT Decoder input is a plain <textarea>, not CodeMirror — .fill() is fine here.
    await p.waitForSelector('textarea.token-input', { timeout: 15000 })
    await p.locator('textarea.token-input').fill(SAMPLE_JWT)
    await wait(p, 1200)
  })

  await shoot(page, `${BASE}/tools/json-tree`, 'json-tree-listing.png', async (p) => {
    await pasteIntoCodeMirror(p, SAMPLE_JSON_TREE)
    await wait(p, 1500)
    const graphBtn = p.locator('button:has-text("Graph")').first()
    if (await graphBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await graphBtn.click()
      await wait(p, 2000) // Vue Flow layout settle
      // Default render is zoomed out with lots of empty canvas around a small
      // cluster of nodes. Vue Flow's built-in Controls component ships a
      // "fit view" button (class vue-flow__controls-fitview) that recenters
      // and scales the graph to fill the pane — much more legible as a still.
      const fitBtn = p.locator('.vue-flow__controls-fitview').first()
      if (await fitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await fitBtn.click()
        await wait(p, 800)
      } else {
        console.log('  WARNING: Vue Flow fit-view control not found, graph may be small/off-center')
      }
    } else {
      console.log('  WARNING: Graph toggle button not found, screenshot is tree (list) mode')
    }
  })

  await browser.close()

  console.log('\nviewport:', JSON.stringify(VIEWPORT), '(device-pixel-ratio: 1, default)')
  if (errors.length) {
    console.log('\n--- console/page errors across the 3 pages ---')
    errors.forEach((e) => console.log(e))
    process.exitCode = 1
  } else {
    console.log('no console/page errors')
  }
})()
