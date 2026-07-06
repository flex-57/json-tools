<template>
  <div class="guide-body">

    <!-- Intro -->
    <section class="guide-section">
      <p>
        <strong>JSON</strong> (JavaScript Object Notation) is a lightweight text format for storing and
        exchanging structured data. It was standardised in <a href="https://www.rfc-editor.org/rfc/rfc8259" target="_blank" rel="noopener">RFC 8259</a>
        and is now the default data format for REST APIs, configuration files, databases, and
        practically everything that passes data between systems.
      </p>
      <p>
        JSON was derived from JavaScript object literal syntax in the early 2000s, but it is
        completely language-agnostic — every major programming language can read and write it natively.
      </p>
    </section>

    <!-- Data types -->
    <section class="guide-section">
      <h2>The 6 JSON data types</h2>
      <p>JSON supports exactly six value types. Nothing else is valid.</p>

      <div class="type-grid">
        <div v-for="t in TYPES" :key="t.name" class="type-card">
          <span class="type-badge" :style="{ background: t.bg, color: t.color, borderColor: t.border }">{{ t.name }}</span>
          <div class="type-examples">
            <code v-for="ex in t.examples" :key="ex" class="type-ex" :style="{ color: t.color }">{{ ex }}</code>
          </div>
          <p class="type-note">{{ t.note }}</p>
        </div>
      </div>
    </section>

    <!-- Syntax rules -->
    <section class="guide-section">
      <h2>Syntax rules</h2>
      <p>JSON has a small, strict set of rules. Break any one of them and the document is invalid.</p>

      <div class="rules-list">
        <div v-for="r in RULES" :key="r.rule" class="rule-row">
          <div class="rule-head">
            <strong class="rule-label">{{ r.rule }}</strong>
          </div>
          <div class="rule-split">
            <div class="rule-col rule-col--ok">
              <span class="rs-label">✅ valid</span>
              <code class="rs-code">{{ r.valid }}</code>
            </div>
            <div class="rule-col rule-col--no">
              <span class="rs-label">❌ invalid</span>
              <code class="rs-code">{{ r.invalid }}</code>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- JSON vs XML -->
    <section class="guide-section">
      <h2>JSON vs XML</h2>
      <p>Before JSON, XML dominated data exchange. Here is the same data in both formats.</p>

      <div class="compare-split">
        <div class="compare-block">
          <div class="compare-header compare-header--json">JSON <span class="compare-badge">59 chars</span></div>
          <pre class="compare-code"><span class="jk">{</span>
  <span class="jkey">"name"</span><span class="jp">:</span> <span class="js">"Alice"</span><span class="jp">,</span>
  <span class="jkey">"age"</span><span class="jp">:</span> <span class="jn">30</span><span class="jp">,</span>
  <span class="jkey">"admin"</span><span class="jp">:</span> <span class="jb">true</span><span class="jp">,</span>
  <span class="jkey">"tags"</span><span class="jp">:</span> <span class="jk">[</span><span class="js">"dev"</span><span class="jp">,</span> <span class="js">"ops"</span><span class="jk">]</span>
<span class="jk">}</span></pre>
        </div>
        <div class="compare-block">
          <div class="compare-header compare-header--xml">XML <span class="compare-badge">104 chars</span></div>
          <pre class="compare-code compare-code--xml"><span class="xt">&lt;user&gt;</span>
  <span class="xt">&lt;name&gt;</span>Alice<span class="xt">&lt;/name&gt;</span>
  <span class="xt">&lt;age&gt;</span>30<span class="xt">&lt;/age&gt;</span>
  <span class="xt">&lt;admin&gt;</span>true<span class="xt">&lt;/admin&gt;</span>
  <span class="xt">&lt;tags&gt;</span>
    <span class="xt">&lt;tag&gt;</span>dev<span class="xt">&lt;/tag&gt;</span>
    <span class="xt">&lt;tag&gt;</span>ops<span class="xt">&lt;/tag&gt;</span>
  <span class="xt">&lt;/tags&gt;</span>
<span class="xt">&lt;/user&gt;</span></pre>
        </div>
      </div>

      <table class="diff-table">
        <thead><tr><th></th><th>JSON</th><th>XML</th></tr></thead>
        <tbody>
          <tr><td>Verbosity</td><td class="ok">Compact</td><td class="no">Verbose</td></tr>
          <tr><td>Native types</td><td class="ok">number, boolean, null, array</td><td class="no">Strings only (attributes aside)</td></tr>
          <tr><td>Comments</td><td class="no">Not supported</td><td class="ok">Supported</td></tr>
          <tr><td>Schema validation</td><td class="ok">JSON Schema</td><td class="ok">XSD, DTD</td></tr>
          <tr><td>Human-readable</td><td class="ok">Easy</td><td class="no">Cluttered with tags</td></tr>
          <tr><td>Parse speed</td><td class="ok">Fast</td><td class="no">Slower</td></tr>
          <tr><td>Still used for</td><td>APIs, config, storage</td><td>SOAP, SVG, Office docs</td></tr>
        </tbody>
      </table>
    </section>

    <!-- Where JSON is used -->
    <section class="guide-section">
      <h2>Where JSON is used</h2>
      <div class="use-cards">
        <div v-for="u in USES" :key="u.title" class="use-card">
          <div class="use-icon">{{ u.icon }}</div>
          <div class="use-body">
            <div class="use-title">{{ u.title }}</div>
            <div class="use-desc">{{ u.desc }}</div>
            <code class="use-ex">{{ u.example }}</code>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
const TYPES = [
  {
    name: 'string',
    color: '#4ADE80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.25)',
    examples: ['"Hello"', '"2024-01-31"', '""'],
    note: 'Always double-quoted. Single quotes are invalid.',
  },
  {
    name: 'number',
    color: '#60A5FA', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.25)',
    examples: ['42', '3.14', '-7', '1.5e10'],
    note: 'Integer or float. No NaN, no Infinity, no hex.',
  },
  {
    name: 'boolean',
    color: '#C084FC', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.25)',
    examples: ['true', 'false'],
    note: 'Lowercase only. True and False are invalid.',
  },
  {
    name: 'null',
    color: '#9CA3AF', bg: 'rgba(156,163,175,0.08)', border: 'rgba(156,163,175,0.25)',
    examples: ['null'],
    note: 'Represents the intentional absence of a value.',
  },
  {
    name: 'array',
    color: 'var(--c-accent)', bg: 'rgb(var(--c-accent-rgb) / 0.08)', border: 'rgb(var(--c-accent-rgb) / 0.25)',
    examples: ['[1, 2, 3]', '["a", "b"]', '[]'],
    note: 'Ordered list of any JSON values. Can be mixed types.',
  },
  {
    name: 'object',
    color: '#FBBF24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)',
    examples: ['{"key": "val"}', '{}'],
    note: 'Unordered key-value pairs. Keys must be strings.',
  },
]

const RULES = [
  {
    rule: 'Keys must be double-quoted strings',
    valid: '{"name": "Alice"}',
    invalid: '{name: "Alice"}',
  },
  {
    rule: 'Strings use double quotes only',
    valid: '"hello"',
    invalid: "'hello'",
  },
  {
    rule: 'No trailing commas',
    valid: '{"a": 1, "b": 2}',
    invalid: '{"a": 1, "b": 2,}',
  },
  {
    rule: 'No comments',
    valid: '{"rate": 0.15}',
    invalid: '{"rate": 0.15} // VAT',
  },
  {
    rule: 'Numbers have no leading zeros',
    valid: '{"code": 7}',
    invalid: '{"code": 007}',
  },
  {
    rule: 'No undefined, NaN, or Infinity',
    valid: '{"val": null}',
    invalid: '{"val": undefined}',
  },
]

const USES = [
  {
    icon: '⚡',
    title: 'REST APIs',
    desc: 'The standard format for request and response bodies. Every HTTP client and server library speaks JSON.',
    example: 'Content-Type: application/json',
  },
  {
    icon: '⚙️',
    title: 'Configuration files',
    desc: 'Package manifests, IDE settings, and tool configs use JSON for its simplicity and wide tooling support.',
    example: 'package.json, tsconfig.json, .eslintrc',
  },
  {
    icon: '🗄️',
    title: 'Databases',
    desc: 'Document databases like MongoDB store records as JSON. PostgreSQL and MySQL have native JSON column types.',
    example: 'db.users.find({ active: true })',
  },
  {
    icon: '💾',
    title: 'Browser storage',
    desc: 'localStorage and sessionStorage only store strings — JSON.stringify/parse bridges the gap for objects.',
    example: 'localStorage.setItem("prefs", JSON.stringify(obj))',
  },
]
</script>

<style scoped>
/* ── Type grid ─────────────────────────────────────── */
.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.type-card {
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.type-badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid;
  align-self: flex-start;
}

.type-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.type-ex {
  font-family: var(--font-mono);
  font-size: 12.5px;
  background: var(--c-faint);
  padding: 2px 7px;
  border-radius: 4px;
}

.type-note {
  font-size: 12px;
  color: var(--c-t4);
  line-height: 1.5;
  margin: 0;
}

/* ── Rules list ────────────────────────────────────── */
.rules-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.rule-row {
  border: 1px solid var(--c-border);
  border-radius: 10px;
  overflow: hidden;
}

.rule-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--c-subtle);
  border-bottom: 1px solid var(--c-border);
}

.rule-icon { font-size: 13px; }
.rule-label { font-size: 13px; color: var(--c-t1); }

.rule-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.rule-col {
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.rule-col--ok { border-right: 1px solid var(--c-border); }

.rs-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-t4);
}

.rs-code {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--c-t2);
  word-break: break-all;
}

/* ── JSON vs XML ───────────────────────────────────── */
.compare-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 16px 0;
}

.compare-block {
  border: 1px solid var(--c-border);
  border-radius: 10px;
  overflow: hidden;
}

.compare-header {
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.compare-header--json { background: rgba(74,222,128,0.08); color: #4ADE80; border-bottom: 1px solid rgba(74,222,128,0.15); }
.compare-header--xml  { background: rgba(96,165,250,0.08); color: #60A5FA; border-bottom: 1px solid rgba(96,165,250,0.15); }

.compare-badge {
  font-size: 10px;
  font-weight: 500;
  opacity: 0.7;
  font-family: var(--font-mono);
}

.compare-code {
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.7;
  padding: 14px;
  margin: 0;
  background: #0D1117;
  color: var(--c-t2);
  overflow-x: auto;
}

/* JSON syntax colors */
.jk  { color: #F1F0EE; }
.jkey{ color: #60A5FA; }
.js  { color: #4ADE80; }
.jn  { color: #FBBF24; }
.jb  { color: #C084FC; }
.jp  { color: var(--c-t4); }
/* XML colors */
.compare-code--xml { color: #9CA3AF; }
.xt { color: #60A5FA; }

.diff-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 4px;
}

.diff-table thead tr { border-bottom: 1px solid var(--c-border); }

.diff-table th {
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-t4);
  padding: 8px 12px;
}

.diff-table td {
  padding: 9px 12px;
  color: var(--c-t3);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  vertical-align: top;
}

.diff-table td:first-child { color: var(--c-t2); font-weight: 500; }
.diff-table td.ok { color: #4ADE80; }
.diff-table td.no { color: #F87171; }

/* ── Use cards ─────────────────────────────────────── */
.use-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}

.use-card {
  display: flex;
  gap: 14px;
  padding: 16px;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 10px;
}

.use-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }

.use-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--c-t1);
  margin-bottom: 5px;
}

.use-desc {
  font-size: 12.5px;
  color: var(--c-t4);
  line-height: 1.6;
  margin-bottom: 8px;
}

.use-ex {
  display: block;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--c-accent);
  background: rgb(var(--c-accent-rgb) / 0.06);
  padding: 4px 8px;
  border-radius: 5px;
  word-break: break-all;
}

/* ── Responsive ────────────────────────────────────── */
@media (max-width: 640px) {
  .compare-split { grid-template-columns: 1fr; }
  .use-cards     { grid-template-columns: 1fr; }
  .type-grid     { grid-template-columns: 1fr 1fr; }
  .rule-split    { grid-template-columns: 1fr; }
  .rule-col--ok  { border-right: none; border-bottom: 1px solid var(--c-border); }
}
</style>
