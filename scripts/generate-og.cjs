const { chromium } = require('../node_modules/playwright');
const path = require('path');
const fs = require('fs');
const brand = require('./brand-tokens.cjs');

// Builds the window-body markup for a flat, JSON-object-shaped sample —
// most tools render one of these. `pairs` is [key, type, value][], type is
// 's' (quoted string), 'n' (bare number) or 'b' (bare true/false); value is
// always plain text (HTML-escaped by the caller if it ever contains < > &).
function J(pairs) {
  const lines = pairs.map(([k, t, v], i) => {
    const cls = t === 's' ? 's' : t === 'n' ? 'n' : 'b';
    const val = t === 's' ? `"${v}"` : v;
    const comma = i < pairs.length - 1 ? '<span class="p">,</span>' : '';
    return `  <span class="k">"${k}"</span><span class="p">:</span> <span class="${cls}">${val}</span>${comma}`;
  });
  return `<span class="p">{</span>\n${lines.join('\n')}\n<span class="p">}</span>`;
}

// Note: the default 'og-image' (homepage fallback) is NOT generated here —
// it has its own richer flagship design, see generate-og-flagship.cjs.
const TOOLS = [
  {
    slug: 'json-formatter', tag: 'JSON Tool', title: 'JSON Formatter\n& Validator', size: 68,
    subtitle: 'Format, validate, and minify JSON instantly. No data sent to servers.',
    window: J([['input', 's', '{"a":1,}'], ['error', 's', 'Unexpected token }'], ['line', 'n', '1'], ['tip', 's', 'trailing comma']]),
  },
  {
    slug: 'csv-to-json', tag: 'Converter', title: 'CSV to JSON\nConverter', size: 68,
    subtitle: 'Convert CSV and TSV files to JSON instantly.',
    window: J([['delimiter', 's', 'auto'], ['detected', 's', ';'], ['headers', 'b', 'true'], ['rows', 'n', '128']]),
  },
  {
    slug: 'json-to-csv', tag: 'Converter', title: 'JSON to CSV\nConverter', size: 68,
    subtitle: 'Export JSON arrays to CSV spreadsheets.',
    window: J([['input', 's', 'array'], ['rows', 'n', '3'], ['delimiter', 's', ',']]),
  },
  {
    slug: 'xml-to-json', tag: 'Converter', title: 'XML to JSON\nConverter', size: 68,
    subtitle: 'Convert XML documents to clean JSON.',
    window: J([['@id', 's', '1'], ['name', 's', 'Alice'], ['email', 's', 'alice@example.com']]),
  },
  {
    slug: 'json-to-xml', tag: 'Converter', title: 'JSON to XML\nConverter', size: 68,
    subtitle: 'Convert JSON objects to valid XML.',
    window: `<span class="p">&lt;user </span><span class="k">id</span><span class="p">=</span><span class="s">"1"</span><span class="p">&gt;</span>
  <span class="p">&lt;name&gt;</span>Alice<span class="p">&lt;/name&gt;</span>
<span class="p">&lt;/user&gt;</span>`,
  },
  {
    slug: 'yaml-to-json', tag: 'Converter', title: 'YAML to JSON\nConverter', size: 68,
    subtitle: 'Parse YAML files and convert to JSON instantly.',
    window: J([['name', 's', 'Alice'], ['active', 'b', 'true'], ['role', 's', 'admin']]),
  },
  {
    slug: 'json-to-yaml', tag: 'Converter', title: 'JSON to YAML\nConverter', size: 68,
    subtitle: 'Convert JSON to YAML with proper formatting.',
    window: `<span class="k">name</span><span class="p">:</span> <span class="s">Alice</span>
<span class="k">active</span><span class="p">:</span> <span class="b">true</span>
<span class="k">tags</span><span class="p">:</span>
  <span class="p">-</span> <span class="s">api</span>
  <span class="p">-</span> <span class="s">auth</span>`,
  },
  {
    slug: 'excel-to-json', tag: 'Converter', title: 'Excel to JSON\nConverter', size: 68,
    subtitle: 'Upload .xlsx files and convert spreadsheet data to JSON.',
    window: J([['sheet', 's', 'Sheet1'], ['rows', 'n', '240'], ['headers', 'b', 'true']]),
  },
  {
    slug: 'json-to-excel', tag: 'Converter', title: 'JSON to Excel\nConverter', size: 68,
    subtitle: 'Export JSON arrays to downloadable Excel spreadsheets.',
    window: J([['rows', 'n', '3'], ['format', 's', 'xlsx'], ['preview', 's', 'first 5 rows']]),
  },
  {
    slug: 'toml-to-json', tag: 'Converter', title: 'TOML to JSON\nConverter', size: 68,
    subtitle: 'Convert TOML to JSON. Paste text or drop a .toml file.',
    window: J([['name', 's', 'Alice'], ['active', 'b', 'true'], ['tags', 's', '["api","auth"]']]),
  },
  {
    slug: 'json-to-toml', tag: 'Converter', title: 'JSON to TOML\nConverter', size: 68,
    subtitle: 'Convert JSON to TOML. Paste or drop a .json file.',
    window: `<span class="k">name</span> <span class="p">=</span> <span class="s">"Alice"</span>
<span class="k">active</span> <span class="p">=</span> <span class="b">true</span>
<span class="k">tags</span> <span class="p">=</span> [<span class="s">"api"</span>, <span class="s">"auth"</span>]`,
  },
  {
    slug: 'json-diff', tag: 'JSON Tool', title: 'JSON Diff', size: 80,
    subtitle: 'Compare two JSON objects side by side.\nHighlights added, removed, and changed.',
    window: J([['added', 'n', '2'], ['removed', 'n', '1'], ['changed', 'n', '3']]),
  },
  {
    slug: 'json-tree', tag: 'JSON Tool', title: 'JSON Tree\nViewer', size: 72,
    subtitle: 'Visualize JSON as an interactive tree or node graph.',
    window: J([['nodes', 'n', '428'], ['depth', 'n', '6'], ['search', 's', 'email']]),
  },
  {
    slug: 'json-schema', tag: 'JSON Tool', title: 'JSON Schema\nGenerator', size: 68,
    subtitle: 'Generate JSON Schema (Draft-07 or 2020-12) from any JSON sample.',
    window: J([['type', 's', 'object'], ['required', 's', 'id, name'], ['draft', 's', '2020-12']]),
  },
  {
    slug: 'json-to-ts', tag: 'JSON Tool', title: 'JSON → TypeScript\n& Zod', size: 64,
    subtitle: 'Generate TypeScript interfaces and Zod schemas from JSON.',
    window: `<span class="k">interface</span> Root {
  id: <span class="n">number</span>;
  name: <span class="s">string</span>;
}`,
  },
  {
    slug: 'base64', tag: 'Encode & Decode', title: 'Base64\nEncode / Decode', size: 68,
    subtitle: 'Encode text or files to Base64, or decode Base64 strings.',
    window: J([['input', 's', 'Hello!'], ['encoded', 's', 'SGVsbG8h'], ['urlSafe', 'b', 'false']]),
  },
  {
    slug: 'url-encode', tag: 'Encode & Decode', title: 'URL\nEncode / Decode', size: 72,
    subtitle: 'Encode special characters for URLs or decode percent-encoded strings.',
    window: J([['input', 's', 'a b'], ['encoded', 's', 'a%20b'], ['mode', 's', 'component']]),
  },
  {
    slug: 'jwt-decoder', tag: 'Encode & Decode', title: 'JWT Decoder', size: 80,
    subtitle: 'Decode and inspect JWT tokens.\nHeader, payload, and signature.',
    window: J([['alg', 's', 'HS256'], ['sub', 's', 'user_123'], ['exp', 'n', '1799999999']]),
  },
  {
    slug: 'hash', tag: 'Encode & Decode', title: 'Hash Generator', size: 72,
    subtitle: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.',
    window: J([['input', 's', 'hello world'], ['sha256', 's', '2cf24dba5fb0a3e2...'], ['md5', 's', '5eb63bbbe01eeed0...']]),
  },
  {
    slug: 'hmac', tag: 'Security', title: 'HMAC Generator', size: 80,
    subtitle: 'Compute HMAC-SHA1, SHA-256, SHA-384 and SHA-512 signatures with a secret key.',
    window: J([['alg', 's', 'HMAC-SHA256'], ['message', 's', 'Hello, World!'], ['signature', 's', '9f86d081884c...'], ['format', 's', 'hex']]),
  },
  {
    slug: 'regex-tester', tag: 'Dev Util', title: 'Regex Tester', size: 80,
    subtitle: 'Test regular expressions with live match highlighting.',
    window: J([['pattern', 's', '\\\\d{3}-\\\\d{4}'], ['flags', 's', 'g'], ['matches', 'n', '4']]),
  },
  {
    slug: 'markdown-preview', tag: 'Text & Code', title: 'Markdown Preview', size: 80,
    subtitle: 'Write or paste Markdown and see\nthe rendered HTML instantly.',
    window: `<span class="p">#</span> Heading
<span class="b">**bold**</span> <span class="s">_italic_</span>
<span class="p">-</span> list item`,
  },
  {
    slug: 'cron-parser', tag: 'Dev Util', title: 'Cron Parser', size: 80,
    subtitle: 'Parse cron expressions in plain English.\nShows next execution times.',
    window: J([['expr', 's', '0 9 * * 1-5'], ['next', 's', 'Mon 09:00'], ['desc', 's', 'weekdays at 9am']]),
  },
  {
    slug: 'unix-timestamp', tag: 'Dev Util', title: 'Unix Timestamp\nConverter', size: 68,
    subtitle: 'Convert between Unix timestamps and human-readable dates.',
    window: J([['unix', 'n', '1749649920'], ['iso', 's', '2025-06-11T14:32:00Z'], ['relative', 's', '3 hours ago']]),
  },
  {
    slug: 'gpt-token-counter', tag: 'Dev Util', title: 'GPT Token\nCounter', size: 72,
    subtitle: 'Count tokens for GPT-4o, o1 and o3 (o200k_base encoding) instantly.',
    window: J([['model', 's', 'gpt-4o'], ['encoding', 's', 'o200k_base'], ['tokens', 'n', '42'], ['chars', 'n', '218']]),
  },
  {
    slug: 'uuid', tag: 'Dev Util', title: 'UUID Generator', size: 72,
    subtitle: 'Generate random UUID v4, time-sortable v7, or ULID identifiers. Bulk generation up to 100.',
    window: J([['version', 's', 'v7'], ['id', 's', '0190f3a7-2c88-7000-8a21-4e6b9c1f3d02'], ['sortable', 'b', 'true'], ['batch_size', 'n', '100']]),
  },
  {
    slug: 'css-minifier', tag: 'Dev Util', title: 'CSS Minifier', size: 84,
    subtitle: 'Compress CSS with lightningcss, instantly.',
    window: J([['before', 's', '2.4 KB'], ['after', 's', '1.1 KB'], ['saved', 's', '54%']]),
  },
  {
    slug: 'html-minifier', tag: 'Dev Util', title: 'HTML Minifier', size: 80,
    subtitle: 'Collapse whitespace, minify embedded CSS/JS too.',
    window: J([['before', 's', '18.2 KB'], ['after', 's', '12.6 KB'], ['saved', 's', '31%']]),
  },
  {
    slug: 'js-minifier', tag: 'Dev Util', title: 'JavaScript\nMinifier', size: 72,
    subtitle: 'Mangle variables and strip dead code with terser.',
    window: J([['before', 's', '44.8 KB'], ['after', 's', '16.2 KB'], ['mangled', 'b', 'true']]),
  },
  {
    slug: 'sql-formatter', tag: 'Dev Util', title: 'SQL Formatter', size: 72,
    subtitle: 'Format and beautify SQL queries.\nMySQL, PostgreSQL, SQLite, T-SQL.',
    window: `<span class="k">SELECT</span> id, name
<span class="k">FROM</span> users
<span class="k">WHERE</span> active <span class="p">=</span> <span class="n">1</span>`,
  },
  {
    slug: 'graphql-formatter', tag: 'Dev Util', title: 'GraphQL\nFormatter', size: 76,
    subtitle: 'Format GraphQL queries, mutations, fragments and schema definitions instantly.',
    window: `<span class="k">query</span> GetUser($id: ID!) {
  user(id: $id) {
    name
  }
}`,
  },
  {
    slug: 'svg-optimizer', tag: 'Dev Util', title: 'SVG Optimizer', size: 76,
    subtitle: 'Compress SVG markup with SVGO, entirely in your browser.',
    window: J([['before', 's', '4.2 KB'], ['after', 's', '1.8 KB'], ['saved', 's', '57%']]),
  },
  {
    slug: 'svg-to-jsx', tag: 'Dev Util', title: 'SVG to JSX', size: 84,
    subtitle: 'Turn an SVG file into a React component.',
    window: `<span class="p">&lt;circle</span> cx={12} cy={12} r={9}
  stroke=<span class="s">"#FF3D8F"</span><span class="p"> /&gt;</span>`,
  },
  {
    slug: 'password-generator', tag: 'Security', title: 'Password Generator', size: 64,
    subtitle: 'Generate strong, random passwords.\nCustom length, symbols, bulk export.',
    window: J([['length', 'n', '20'], ['entropy', 's', '131 bits'], ['strength', 's', 'strong']]),
  },
  {
    slug: 'text-case', tag: 'Text & Code', title: 'Text Case\nConverter', size: 68,
    subtitle: 'Convert between camelCase, snake_case,\nPascalCase, kebab-case, and more.',
    window: J([['camelCase', 's', 'helloWorld'], ['snake_case', 's', 'hello_world'], ['kebab-case', 's', 'hello-world']]),
  },
  {
    slug: 'string-escape', tag: 'Text & Code', title: 'String Escape\n& Unescape', size: 64,
    subtitle: 'Escape or unescape control characters and Unicode sequences for JSON or code strings.',
    window: J([['mode', 's', 'escape'], ['input', 's', 'She said "hi"'], ['output', 's', 'She said \\"hi\\"']]),
  },
  {
    slug: 'number-base', tag: 'Dev Util', title: 'Number Base\nConverter', size: 68,
    subtitle: 'Convert numbers between binary, octal,\ndecimal, and hexadecimal.',
    window: J([['decimal', 'n', '255'], ['hex', 's', '0xFF'], ['binary', 's', '0b11111111']]),
  },
  {
    slug: 'color', tag: 'Dev Util', title: 'Color Picker\n& Converter', size: 68,
    subtitle: 'Pick a color visually and convert between HEX, RGB, HSL, and HSB. Check WCAG contrast ratios.',
    window: J([['hex', 's', '#FF3D8F'], ['rgb', 's', '255, 61, 143'], ['hsl', 's', '336, 100%, 62%'], ['contrast', 's', '4.8:1'], ['wcag_aa', 'b', 'true']]),
  },
  {
    slug: 'gradient', tag: 'Dev Util', title: 'CSS Gradient\nGenerator', size: 68,
    subtitle: 'Build linear, radial, and conic CSS\ngradients visually. Copy the code.',
    window: J([['type', 's', 'linear'], ['angle', 'n', '135'], ['stops', 'n', '2']]),
  },
  {
    slug: 'box-shadow', tag: 'Dev Util', title: 'CSS Box-Shadow\nGenerator', size: 64,
    subtitle: 'Build single or layered box-shadow values visually, then copy the CSS.',
    window: J([['layers', 'n', '2'], ['blur', 'n', '12'], ['inset', 'b', 'false'], ['color', 's', 'rgba(0,0,0,.15)']]),
  },
  {
    slug: 'jwt-generator', tag: 'Security', title: 'JWT Generator', size: 80,
    subtitle: 'Generate signed JWT tokens with custom\npayloads, headers, and algorithms.',
    window: J([['alg', 's', 'HS256'], ['sub', 's', '123'], ['signed', 'b', 'true']]),
  },
  {
    slug: 'og-generator', tag: 'Dev Util', title: 'Open Graph\nGenerator', size: 72,
    subtitle: 'Build og: and twitter: meta tags with a live preview.',
    window: J([['og:title', 's', 'My Page'], ['og:image', 's', '1200x630'], ['twitter:card', 's', 'summary_large_image']]),
  },
  { slug: 'faq', tag: 'JSON Tools', title: 'FAQ', subtitle: 'Answers about privacy, features, and how\nJSON Tools works.', size: 88 },

  // Guides
  { slug: 'guide-what-is-json',             tag: 'Developer Guide', title: 'What is JSON?',              subtitle: 'Data types, syntax rules, and why JSON\nbecame the universal API format.',          size: 88 },
  { slug: 'guide-what-is-jwt',              tag: 'Developer Guide', title: 'What is a\nJWT Token?',          subtitle: 'Structure, algorithms, and security best practices.',                          size: 72 },
  { slug: 'guide-what-is-base64',           tag: 'Developer Guide', title: 'What is\nBase64?',               subtitle: 'How binary-to-text encoding works and when to use it.',                      size: 72 },
  { slug: 'guide-cron-expression-examples', tag: 'Developer Guide', title: 'Cron Expression\nExamples',      subtitle: 'Field breakdown, special characters, and common schedules.',                  size: 64 },
  { slug: 'guide-json-vs-yaml',             tag: 'Developer Guide', title: 'JSON vs YAML',                   subtitle: 'Side-by-side comparison: syntax, use cases,\nand when to choose each.',      size: 76 },
  { slug: 'guide-how-to-validate-json',     tag: 'Developer Guide', title: 'How to Validate\nJSON',          subtitle: 'Common errors, syntax rules, and JSON Schema validation.',                    size: 68 },
  { slug: 'guide-what-is-regex',            tag: 'Developer Guide', title: 'What is a\nRegular Expression?', subtitle: 'Character classes, quantifiers, anchors, and practical patterns.',            size: 60 },
  { slug: 'guide-what-is-markdown',         tag: 'Developer Guide', title: 'What is\nMarkdown?',             subtitle: 'How plain text becomes HTML — syntax, flavors, and where it is used.',        size: 72 },
  { slug: 'guide-markdown-cheatsheet',      tag: 'Developer Guide', title: 'Markdown\nCheatsheet',           subtitle: 'Headings, code blocks, links, tables, task lists — all the syntax in one place.', size: 68 },
  { slug: 'guide-what-is-url-encoding',     tag: 'Developer Guide', title: 'What is\nURL Encoding?',         subtitle: 'Percent-encoding, reserved characters,\nencodeURI vs encodeURIComponent.',    size: 64 },
  { slug: 'guide-what-is-hash',             tag: 'Developer Guide', title: 'What is a\nHash Function?',      subtitle: 'MD5, SHA-1, SHA-256 — use cases and\nwhy SHA must not hash passwords.',      size: 64 },
  { slug: 'guide-what-is-xml',              tag: 'Developer Guide', title: 'What is XML?',                   subtitle: 'Elements, attributes, namespaces,\nXML vs JSON and where XML is still used.', size: 80 },
  { slug: 'guide-what-is-uuid',             tag: 'Developer Guide', title: 'What is a UUID?',               subtitle: 'v1, v4, v7 — structure, uniqueness,\nand UUID vs auto-increment primary keys.', size: 76 },
  { slug: 'guide-what-is-json-schema',      tag: 'Developer Guide', title: 'What is\nJSON Schema?',         subtitle: 'Core keywords, anyOf/oneOf, Draft-07 vs\n2020-12, and validation use cases.',  size: 68 },
  { slug: 'guide-what-is-yaml',             tag: 'Developer Guide', title: 'What is YAML?',                 subtitle: 'Syntax, anchors, YAML vs JSON,\nand gotchas like the Norway problem.',        size: 80 },
  { slug: 'guide-regex-cheatsheet',         tag: 'Developer Guide', title: 'Regex\nCheatsheet',             subtitle: 'Character classes, quantifiers, anchors,\nlookaheads, flags, patterns.',       size: 72 },
  { slug: 'guide-json-best-practices',      tag: 'Developer Guide', title: 'JSON Best\nPractices',           subtitle: 'Naming, dates, null vs omit, pagination,\nerror responses, nesting.',         size: 72 },
  { slug: 'guide-what-is-csv',              tag: 'Developer Guide', title: 'What is CSV?',                   subtitle: 'Structure, quoting rules, delimiters,\nand CSV vs JSON.',                     size: 84 },
  { slug: 'guide-what-is-unix-timestamp',   tag: 'Developer Guide', title: 'What is a Unix\nTimestamp?',     subtitle: 'The epoch, seconds vs milliseconds,\nand the Year 2038 problem.',            size: 68 },
  { slug: 'guide-understanding-number-bases', tag: 'Developer Guide', title: 'Understanding\nNumber Bases', subtitle: 'Binary, octal, and hex explained,\nand how to convert between them.',        size: 68 },
  { slug: 'guide-password-entropy-explained', tag: 'Developer Guide', title: 'Password Strength\n& Entropy', subtitle: 'How entropy is calculated, and why\nlength beats complexity.',              size: 64 },
  { slug: 'guide-understanding-color-formats', tag: 'Developer Guide', title: 'HEX, RGB, and\nHSL Explained', subtitle: 'Color formats compared, plus WCAG\ncontrast ratio thresholds.',           size: 64 },
  { slug: 'guide-sql-cheatsheet',              tag: 'Developer Guide', title: 'SQL\nCheatsheet',            subtitle: 'Clause order, joins, filtering,\nand dialect differences.',                  size: 76 },
  { slug: 'guide-encoding-vs-encryption-vs-hashing', tag: 'Developer Guide', title: 'Encoding vs\nEncryption vs Hashing', subtitle: 'What\'s reversible, what needs a key,\nand why Base64 isn\'t encryption.', size: 56 },
  { slug: 'guide-what-is-toml',              tag: 'Developer Guide', title: 'What is TOML?',                    subtitle: 'Tables, arrays of tables, native dates,\nand why there\'s no null or top-level array.', size: 80 },
  { slug: 'guide-what-is-a-token',           tag: 'Developer Guide', title: 'What is a Token?',                 subtitle: 'How LLMs split text into tokens with BPE,\nand why it drives cost and context limits.', size: 76 },
  { slug: 'guide-json-mode-structured-outputs', tag: 'Developer Guide', title: 'JSON Mode &\nStructured Outputs', subtitle: 'Reliable JSON from LLMs: OpenAI, Claude,\nand Gemini compared.', size: 56 },
  { slug: 'guide-what-is-hmac',              tag: 'Developer Guide', title: 'What is\nHMAC?',                   subtitle: 'The ipad/opad construction, why it resists\nlength-extension attacks, and HS256 in JWTs.', size: 72 },
  { slug: 'guide-what-is-svg',               tag: 'Developer Guide', title: 'What is SVG?',                     subtitle: 'viewBox, path data, what SVGO actually\nremoves, and converting SVG to JSX.',           size: 80 },
  { slug: 'guide-what-is-graphql',           tag: 'Developer Guide', title: 'What is\nGraphQL?',                subtitle: 'Queries vs REST, the schema definition\nlanguage, and why over-fetching happens.',       size: 72 },
  { slug: 'guide-what-is-open-graph',        tag: 'Developer Guide', title: 'What is\nOpen Graph?',             subtitle: 'The four required properties, Twitter/X\nfallback, and why og:image gets cached.',    size: 68 },
  { slug: 'guide-what-is-minification',      tag: 'Developer Guide', title: 'What is\nMinification?',           subtitle: 'What CSS, HTML, and JS minifiers remove,\nand why JS shrinks the most.',              size: 68 },
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

  await page.evaluate((svg) => {
    document.getElementById('logo-mark').innerHTML = svg;
  }, brand.logoMarkSvg);

  // Optional CLI filter, e.g. `node scripts/generate-og.cjs uuid color`, to
  // regenerate just a few images (for previewing a template change) instead
  // of the full batch.
  const only = process.argv.slice(2);
  const toRender = only.length ? TOOLS.filter(t => only.includes(t.slug)) : TOOLS;

  for (const tool of toRender) {
    await page.evaluate(({ tag, title, subtitle, size, window: win }) => {
      document.getElementById('tag').textContent = tag;
      document.getElementById('title').textContent = title;
      document.getElementById('title').style.setProperty('--title-size', size + 'px');
      document.getElementById('subtitle').textContent = subtitle;

      const contentEl = document.getElementById('content');
      const windowEl = document.getElementById('window');
      if (win) {
        document.getElementById('window-body').innerHTML = win;
        windowEl.classList.add('window--visible');
        contentEl.classList.add('content--narrow');
      } else {
        windowEl.classList.remove('window--visible');
        contentEl.classList.remove('content--narrow');
      }
    }, tool);

    await page.waitForTimeout(80);

    const outPath = path.join(OUT_DIR, tool.slug + '.png');
    await page.screenshot({ path: outPath, type: 'png' });
    console.log('✓', tool.slug + '.png');
  }

  await browser.close();
  console.log(`\nDone — ${toRender.length} images saved to public/og/`);
})();
