// Regenerates captures/dev.to-img.png (the 4-panel collage embedded in the
// dev.to article) with the current design. The original was made before the
// 2026-07-06 redesign (old orange/black branding, old button styles) and no
// longer matches what a visitor sees on jsontools.space today.
//
// Two-stage pipeline, same technique as generate-og-flagship.cjs (render
// HTML/real pages via Playwright, composite with sharp):
//   1. Screenshot 4 real tool pages in production, each with the site's own
//      header/breadcrumb hidden via injected CSS so the panel starts right at
//      the tool's own title (matches the original collage's framing).
//   2. Composite the 4 panels + a branded footer bar (built as an SVG, using
//      the same brand-tokens.cjs values as the OG generators) into one image
//      with sharp.
const { chromium } = require('../node_modules/playwright')
const sharp = require('../node_modules/sharp')
const path = require('path')
const fs = require('fs')
const brand = require('./brand-tokens.cjs')

const BASE = 'https://jsontools.space'
const OUT_DIR = path.join(__dirname, '../../captures')
const TMP_DIR = path.join(__dirname, '../.tmp-collage')
const PANEL = { width: 1000, height: 600 }
const GAP = 4
const FOOTER_H = 170
const CANVAS_W = PANEL.width * 2 + GAP
const CANVAS_H = PANEL.height * 2 + GAP + FOOTER_H

const SAMPLE_JSON = `{
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
      { "id": "ord_002", "total": 108.0, "status": "processing" }
    ],
    "active": true
  }
}`

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiJ1c2VyXzQyIiwibmFtZSI6IkFsaWNlIE1hcnRpbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4NTAwMDAwMCwiZXhwIjoxNzkyNzc2MDAwfQ' +
  '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

const REGEX_PATTERN = '[\\w.+-]+@[\\w-]+\\.[a-z]{2,}'
const REGEX_TEXT = 'Contact: alice@example.com or bob@dev.org - billing@company.co.uk'

const wait = (page, ms) => page.waitForTimeout(ms)

async function pasteIntoCodeMirror(page, text) {
  await page.waitForSelector('.cm-content', { timeout: 15000 })
  await page.evaluate((t) => navigator.clipboard.writeText(t), text)
  const editor = page.locator('.cm-content').first()
  await editor.click()
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Control+V')
}

async function capturePanel(context, url, outFile, fn) {
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.page', { timeout: 15000 })
  // Hide the site's own header/breadcrumb so the panel starts at the tool's
  // own title, matching the original collage's framing (no site chrome).
  await page.addStyleTag({ content: '.app-header, .breadcrumb { display: none !important; }' })
  await wait(page, 800) // let hydration settle (see run-json-tools SKILL.md gotcha)
  await fn(page)
  // Clicking a control below the fold (e.g. json-tree's "Graph" toggle) makes
  // Playwright auto-scroll it into view before clicking, which then persists
  // into the screenshot. Force back to the top so every panel is framed the
  // same way, starting at the tool's own title.
  await page.evaluate(() => window.scrollTo(0, 0))
  await wait(page, 200)
  await page.screenshot({ path: outFile })
  await page.close()
  console.log('  panel saved:', outFile)
}

function footerSvg() {
  const { bg, accent, ink, border, logoMarkSvg } = brand
  return Buffer.from(`
<svg width="${CANVAS_W}" height="${FOOTER_H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${CANVAS_W}" height="${FOOTER_H}" fill="${bg}" />
  <rect x="0" y="0" width="${CANVAS_W}" height="2" fill="${border}" />
  <g transform="translate(40, ${FOOTER_H / 2 - 20})">
    <g transform="scale(1)">${logoMarkSvg}</g>
    <text x="52" y="29" font-family="Arial, sans-serif" font-weight="700" font-size="30" fill="${ink}">json<tspan fill="${accent}">tools</tspan></text>
  </g>
  <text x="620" y="${FOOTER_H / 2 + 8}" font-family="Arial, sans-serif" font-size="20" fill="${ink}">Free · No signup · No tracking</text>
  <rect x="${CANVAS_W - 380}" y="${FOOTER_H / 2 - 24}" width="340" height="48" rx="8" fill="none" stroke="${border}" stroke-width="1.5" />
  <text x="${CANVAS_W - 210}" y="${FOOTER_H / 2 + 7}" font-family="Arial, sans-serif" font-size="18" fill="${ink}" text-anchor="middle">jsontools.space</text>
</svg>`)
}

;(async () => {
  fs.mkdirSync(TMP_DIR, { recursive: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: PANEL,
    colorScheme: 'dark',
    permissions: ['clipboard-read', 'clipboard-write'],
  })

  console.log('→ JSON Formatter panel')
  const formatterShot = path.join(TMP_DIR, 'formatter.png')
  await capturePanel(context, `${BASE}/tools/json-formatter`, formatterShot, async (p) => {
    await pasteIntoCodeMirror(p, SAMPLE_JSON)
    await wait(p, 1200)
  })

  console.log('→ JSON Tree panel (graph view)')
  const treeShot = path.join(TMP_DIR, 'tree.png')
  await capturePanel(context, `${BASE}/tools/json-tree`, treeShot, async (p) => {
    await pasteIntoCodeMirror(p, SAMPLE_JSON)
    await wait(p, 1500)
    const graphBtn = p.locator('button:has-text("Graph")').first()
    if (await graphBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await graphBtn.click()
      await wait(p, 2000)
      const fitBtn = p.locator('.vue-flow__controls-fitview').first()
      if (await fitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await fitBtn.click()
        await wait(p, 800)
      }
    }
  })

  console.log('→ JWT Decoder panel')
  const jwtShot = path.join(TMP_DIR, 'jwt.png')
  await capturePanel(context, `${BASE}/tools/jwt-decoder`, jwtShot, async (p) => {
    await p.waitForSelector('textarea.token-input', { timeout: 15000 })
    await p.locator('textarea.token-input').fill(SAMPLE_JWT)
    await wait(p, 1200)
  })

  console.log('→ Regex Tester panel')
  const regexShot = path.join(TMP_DIR, 'regex.png')
  await capturePanel(context, `${BASE}/tools/regex-tester`, regexShot, async (p) => {
    await p.waitForSelector('input.pattern-input', { timeout: 15000 })
    await p.locator('input.pattern-input').fill(REGEX_PATTERN)
    await wait(p, 300)
    await p.locator('textarea.pane-textarea').fill(REGEX_TEXT)
    await wait(p, 1200)
  })

  await browser.close()

  console.log('→ compositing collage')
  const canvas = sharp({
    create: {
      width: CANVAS_W,
      height: CANVAS_H,
      channels: 4,
      background: brand.bg,
    },
  })

  const positions = [
    { file: formatterShot, x: 0, y: 0 },
    { file: treeShot, x: PANEL.width + GAP, y: 0 },
    { file: jwtShot, x: 0, y: PANEL.height + GAP },
    { file: regexShot, x: PANEL.width + GAP, y: PANEL.height + GAP },
  ]

  const outFile = path.join(OUT_DIR, 'dev.to-img-new.png')
  await canvas
    .composite([
      ...positions.map(({ file, x, y }) => ({ input: file, left: x, top: y })),
      { input: footerSvg(), left: 0, top: PANEL.height * 2 + GAP },
    ])
    .png()
    .toFile(outFile)

  fs.rmSync(TMP_DIR, { recursive: true, force: true })
  console.log('\n✓ collage saved to', outFile)
})()
