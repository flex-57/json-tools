const { chromium } = require('../node_modules/playwright');
const path = require('path');
const fs = require('fs');

const TOOLS = [
  { slug: 'og-image',        tag: 'Free Developer Tools',   title: 'JSON Tools',                    subtitle: 'Format, convert, validate & debug JSON.\nFree online tools for developers.',      size: 80 },
  { slug: 'csv-to-json',     tag: 'Converter',              title: 'CSV to JSON\nConverter',         subtitle: 'Convert CSV and TSV files to JSON instantly.',                                    size: 68 },
  { slug: 'json-to-csv',     tag: 'Converter',              title: 'JSON to CSV\nConverter',         subtitle: 'Export JSON arrays to CSV spreadsheets.',                                        size: 68 },
  { slug: 'xml-to-json',     tag: 'Converter',              title: 'XML to JSON\nConverter',         subtitle: 'Convert XML documents to clean JSON.',                                           size: 68 },
  { slug: 'json-to-xml',     tag: 'Converter',              title: 'JSON to XML\nConverter',         subtitle: 'Convert JSON objects to valid XML.',                                             size: 68 },
  { slug: 'yaml-to-json',    tag: 'Converter',              title: 'YAML to JSON\nConverter',        subtitle: 'Parse YAML files and convert to JSON instantly.',                                 size: 68 },
  { slug: 'json-to-yaml',    tag: 'Converter',              title: 'JSON to YAML\nConverter',        subtitle: 'Convert JSON to YAML with proper formatting.',                                    size: 68 },
  { slug: 'excel-to-json',   tag: 'Converter',              title: 'Excel to JSON\nConverter',       subtitle: 'Upload .xlsx files and convert spreadsheet data to JSON.',                        size: 68 },
  { slug: 'json-to-excel',   tag: 'Converter',              title: 'JSON to Excel\nConverter',       subtitle: 'Export JSON arrays to downloadable Excel spreadsheets.',                          size: 68 },
  { slug: 'json-diff',       tag: 'JSON Tool',              title: 'JSON Diff',                      subtitle: 'Compare two JSON objects side by side.\nHighlights added, removed, and changed.', size: 80 },
  { slug: 'json-tree',       tag: 'JSON Tool',              title: 'JSON Tree\nViewer',              subtitle: 'Visualize JSON as an interactive tree or node graph.',                            size: 72 },
  { slug: 'json-schema',     tag: 'JSON Tool',              title: 'JSON Schema\nGenerator',         subtitle: 'Generate JSON Schema (Draft-07 or 2020-12) from any JSON sample.',               size: 68 },
  { slug: 'json-to-ts',      tag: 'JSON Tool',              title: 'JSON → TypeScript\n& Zod',       subtitle: 'Generate TypeScript interfaces and Zod schemas from JSON.',                      size: 64 },
  { slug: 'base64',          tag: 'Encode & Decode',        title: 'Base64\nEncode / Decode',        subtitle: 'Encode text or files to Base64, or decode Base64 strings.',                      size: 68 },
  { slug: 'url-encode',      tag: 'Encode & Decode',        title: 'URL\nEncode / Decode',           subtitle: 'Encode special characters for URLs or decode percent-encoded strings.',           size: 72 },
  { slug: 'jwt-decoder',     tag: 'Encode & Decode',        title: 'JWT Decoder',                    subtitle: 'Decode and inspect JWT tokens.\nHeader, payload, and signature.',                 size: 80 },
  { slug: 'hash',            tag: 'Encode & Decode',        title: 'Hash Generator',                 subtitle: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.',                              size: 72 },
  { slug: 'regex-tester',    tag: 'Dev Util',               title: 'Regex Tester',                   subtitle: 'Test regular expressions with live match highlighting.',                          size: 80 },
  { slug: 'cron-parser',     tag: 'Dev Util',               title: 'Cron Parser',                    subtitle: 'Parse cron expressions in plain English.\nShows next execution times.',           size: 80 },
  { slug: 'unix-timestamp',  tag: 'Dev Util',               title: 'Unix Timestamp\nConverter',      subtitle: 'Convert between Unix timestamps and human-readable dates.',                       size: 68 },
  { slug: 'uuid',            tag: 'Dev Util',               title: 'UUID Generator',                 subtitle: 'Generate random UUID v4 identifiers.\nBulk generation up to 100.',               size: 72 },
  { slug: 'minifier',        tag: 'Dev Util',               title: 'CSS / HTML / JS\nMinifier',      subtitle: 'Compress code to reduce file size instantly.',                                    size: 64 },
  { slug: 'sql-formatter',      tag: 'Dev Util',   title: 'SQL Formatter',       subtitle: 'Format and beautify SQL queries.\nMySQL, PostgreSQL, SQLite, T-SQL.',              size: 72 },
  { slug: 'password-generator', tag: 'Security',   title: 'Password Generator',  subtitle: 'Generate strong, random passwords.\nCustom length, symbols, bulk export.',         size: 64 },
];

const OUT_DIR = path.join(__dirname, '../public/og');
const TEMPLATE = path.join(__dirname, 'og-template.html');

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });

  const templateUrl = 'file:///' + TEMPLATE.replace(/\\/g, '/');
  await page.goto(templateUrl);
  await page.waitForLoadState('networkidle');

  for (const tool of TOOLS) {
    await page.evaluate(({ tag, title, subtitle, size }) => {
      document.getElementById('tag').textContent = tag;
      document.getElementById('title').textContent = title;
      document.getElementById('title').style.setProperty('--title-size', size + 'px');
      document.getElementById('subtitle').textContent = subtitle;
    }, tool);

    await page.waitForTimeout(80);

    const outPath = path.join(OUT_DIR, tool.slug + '.png');
    await page.screenshot({ path: outPath, type: 'png' });
    console.log('✓', tool.slug + '.png');
  }

  await browser.close();
  console.log(`\nDone — ${TOOLS.length} images saved to public/og/`);
})();
