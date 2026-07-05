const { chromium } = require('../node_modules/playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'https://jsontools.space';
const OUT_DIR = path.join(__dirname, '../videos');

const SAMPLE_JSON = `{
  "project": "JSON Tools",
  "version": "2.0",
  "features": ["format", "validate", "convert", "diff"],
  "author": {
    "name": "dev",
    "tools": 29,
    "free": true
  },
  "tags": ["json", "typescript", "yaml", "csv"]
}`;

const SAMPLE_CSV = `name,role,country,active
Alice,Engineer,France,true
Bob,Designer,Canada,true
Charlie,PM,Germany,false
Diana,DevOps,UK,true`;

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiJ1c2VyXzQyIiwibmFtZSI6IkFsaWNlIE1hcnRpbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxOTAwMDAwMCwiZXhwIjoxNzE5MDg2NDAwfQ' +
  '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const SAMPLE_REGEX_TEXT =
  'Error: Cannot read property of undefined at line 42\n' +
  'Warning: deprecated API called at user.js:15\n' +
  'Error: timeout exceeded after 5000ms at server.js:78\n' +
  'Info: request completed in 123ms';

const wait = (page, ms) => page.waitForTimeout(ms);

// Wait for CodeMirror to be ready, then type into it
const typeInCodeMirror = async (page, text) => {
  await page.waitForSelector('.cm-editor', { state: 'visible' });
  const editor = page.locator('.cm-content').first();
  await editor.click();
  await wait(page, 150);
  await page.keyboard.press('Control+a');
  await wait(page, 100);
  await page.keyboard.insertText(text);
  await wait(page, 200);
};

const goto = async (page, url) => {
  await page.goto(url, { waitUntil: 'load' });
  await wait(page, 800);
};

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: false, slowMo: 30 });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: OUT_DIR, size: { width: 1280, height: 720 } },
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  // ── 1. Homepage ──────────────────────────────────────────────────
  console.log('→ Homepage');
  await goto(page, BASE);
  await wait(page, 2500);
  await page.evaluate(() => window.scrollBy({ top: 280, behavior: 'smooth' }));
  await wait(page, 1200);
  await page.evaluate(() => window.scrollBy({ top: 320, behavior: 'smooth' }));
  await wait(page, 1800);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await wait(page, 800);

  // ── 2. JSON Formatter ─────────────────────────────────────────────
  console.log('→ JSON Formatter');
  await goto(page, `${BASE}/tools/json-formatter`);
  await typeInCodeMirror(page, SAMPLE_JSON);
  await wait(page, 400);
  await page.keyboard.press('Control+Enter');
  await wait(page, 2800);

  // ── 3. JSON Tree Viewer ───────────────────────────────────────────
  console.log('→ JSON Tree');
  await goto(page, `${BASE}/tools/json-tree`);
  await typeInCodeMirror(page, SAMPLE_JSON);
  await wait(page, 400);
  await page.keyboard.press('Control+Enter');
  await wait(page, 3000);
  // Try switching to graph view
  const graphBtn = page.locator('button:has-text("Graph")').first();
  if (await graphBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await graphBtn.click();
    await wait(page, 2000);
  }

  // ── 4. CSV → JSON ─────────────────────────────────────────────────
  console.log('→ CSV to JSON');
  await goto(page, `${BASE}/tools/csv-to-json`);
  await typeInCodeMirror(page, SAMPLE_CSV);
  await wait(page, 2500);

  // ── 5. JSON → TypeScript ──────────────────────────────────────────
  console.log('→ JSON to TypeScript');
  await goto(page, `${BASE}/tools/json-to-ts`);
  await typeInCodeMirror(page, SAMPLE_JSON);
  await wait(page, 400);
  await page.keyboard.press('Control+Enter');
  await wait(page, 2500);

  // ── 6. JWT Decoder ────────────────────────────────────────────────
  console.log('→ JWT Decoder');
  await goto(page, `${BASE}/tools/jwt-decoder`);
  await page.waitForSelector('textarea.token-input', { state: 'visible' });
  await page.locator('textarea.token-input').fill(SAMPLE_JWT);
  await wait(page, 2500);

  // ── 7. Regex Tester ───────────────────────────────────────────────
  console.log('→ Regex Tester');
  await goto(page, `${BASE}/tools/regex-tester`);
  await page.waitForSelector('input.pattern-input', { state: 'visible' });
  await page.locator('input.pattern-input').fill('Error.*line \\d+');
  await wait(page, 300);
  await page.locator('textarea.editor-textarea').fill(SAMPLE_REGEX_TEXT);
  await wait(page, 2500);

  // ── 8. Guides ─────────────────────────────────────────────────────
  console.log('→ Guides');
  await goto(page, `${BASE}/guides`);
  await wait(page, 1800);
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
  await wait(page, 1500);

  // ── 9. Back to homepage ───────────────────────────────────────────
  console.log('→ Homepage (fin)');
  await goto(page, BASE);
  await wait(page, 2000);

  await context.close();
  await browser.close();

  const files = fs.readdirSync(OUT_DIR)
    .filter(f => f.endsWith('.webm'))
    .map(f => ({ f, t: fs.statSync(path.join(OUT_DIR, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);

  if (files.length) {
    console.log(`\n✓ Vidéo : ${path.join(OUT_DIR, files[0].f)}`);
  }
})();
