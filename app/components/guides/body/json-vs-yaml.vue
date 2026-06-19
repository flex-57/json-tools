<template>
  <article class="guide-body">

    <section class="guide-section">
      <h2>What are JSON and YAML?</h2>
      <p><strong>JSON</strong> (JavaScript Object Notation) is a lightweight text format for data interchange. Introduced in the early 2000s alongside the rise of REST APIs, it became the universal language of web services — simple, strict, and machine-friendly.</p>
      <p><strong>YAML</strong> (YAML Ain't Markup Language) is a human-readable data serialization format designed for configuration files. It prioritizes readability: less punctuation, support for comments, and a clean indentation-based structure.</p>
      <p>Both formats represent the same underlying data model — objects, arrays, strings, numbers, booleans, and null — but they make very different trade-offs.</p>
    </section>

    <section class="guide-section">
      <h2>Syntax comparison</h2>
      <p>The same data expressed in both formats:</p>

      <div class="split-compare">
        <div class="split-col">
          <div class="split-header split-header--json">JSON</div>
          <div class="code-block" style="margin:0; border-radius:0; border-top:none; border-right:none;">
            <code>{{ JSON_EXAMPLE }}</code>
          </div>
        </div>
        <div class="split-col">
          <div class="split-header split-header--yaml">YAML</div>
          <div class="code-block" style="margin:0; border-radius:0; border-top:none; border-left:none;">
            <code>{{ YAML_EXAMPLE }}</code>
          </div>
        </div>
      </div>

      <p style="margin-top:14px">Both represent exactly the same data. YAML removes the quotes, braces, and commas — indentation does the structural work instead.</p>
    </section>

    <section class="guide-section">
      <h2>Key differences</h2>
      <div class="diff-table">
        <div class="diff-row diff-row--head">
          <span></span>
          <span>JSON</span>
          <span>YAML</span>
        </div>
        <div v-for="row in DIFF_ROWS" :key="row.feature" class="diff-row">
          <span class="diff-feature">{{ row.feature }}</span>
          <span>{{ row.json }}</span>
          <span>{{ row.yaml }}</span>
        </div>
      </div>
    </section>

    <section class="guide-section">
      <h2>YAML-only features</h2>

      <h3>Comments</h3>
      <div class="code-block">
        <span class="code-header">YAML supports comments — JSON does not</span>
        <code># Database configuration
database:
  host: localhost   # or use an env var
  port: 5432
  name: myapp_prod</code>
      </div>

      <h3>Multi-line strings</h3>
      <div class="code-block">
        <span class="code-header">YAML literal block ( | ) and folded block ( > )</span>
        <code>description: |
  This is a multi-line string.
  Each line is preserved as-is.
  Great for scripts or SQL queries.

summary: >
  This text will be folded into
  a single line when parsed.</code>
      </div>

      <h3>Anchors and aliases</h3>
      <div class="code-block">
        <span class="code-header">YAML anchors (&) reuse values — avoids repetition</span>
        <code>defaults: &defaults
  retries: 3
  timeout: 30

production:
  <<: *defaults   # inherits retries and timeout
  timeout: 60     # overrides just this value</code>
      </div>
    </section>

    <section class="guide-section">
      <h2>When to use each</h2>
      <div class="use-cards">
        <div class="use-card use-card--json">
          <div class="use-card-head">Choose JSON when…</div>
          <ul>
            <li>Building or consuming an <strong>API</strong> — JSON is the standard</li>
            <li>The data is <strong>machine-generated</strong> and machine-consumed</li>
            <li>You need <strong>maximum tooling compatibility</strong> (every language has a fast native JSON parser)</li>
            <li>Strict structure matters — no implicit type coercion surprises</li>
            <li>Examples: <code>package.json</code>, <code>tsconfig.json</code>, REST API responses</li>
          </ul>
        </div>
        <div class="use-card use-card--yaml">
          <div class="use-card-head">Choose YAML when…</div>
          <ul>
            <li>Humans will <strong>read and edit</strong> the file regularly</li>
            <li>You need <strong>comments</strong> to document the config</li>
            <li>The structure is <strong>deeply nested</strong> (YAML is less cluttered)</li>
            <li>You're working with tools that expect it: Docker Compose, Kubernetes, GitHub Actions, Ansible</li>
            <li>Examples: <code>docker-compose.yml</code>, <code>.github/workflows/*.yml</code>, <code>values.yaml</code></li>
          </ul>
        </div>
      </div>
    </section>

  </article>
</template>

<script setup lang="ts">
const JSON_EXAMPLE = `{
  "name": "Jane Doe",
  "age": 32,
  "active": true,
  "roles": ["admin", "editor"],
  "address": {
    "city": "Paris",
    "country": "France"
  }
}`

const YAML_EXAMPLE = `name: Jane Doe
age: 32
active: true
roles:
  - admin
  - editor
address:
  city: Paris
  country: France`

const DIFF_ROWS = [
  { feature: 'Syntax',       json: 'Braces, quotes, commas',      yaml: 'Indentation, minimal punctuation' },
  { feature: 'Comments',     json: 'Not supported',                yaml: '# single-line comments' },
  { feature: 'Readability',  json: 'Moderate',                     yaml: 'High — designed for humans' },
  { feature: 'Parse speed',  json: 'Fast (native in all runtimes)', yaml: 'Slower (complex grammar)' },
  { feature: 'Data types',   json: 'Explicit (always quoted strings)', yaml: 'Implicit (can cause surprises)' },
  { feature: 'Multi-line',   json: 'Escape sequences (\\n)',        yaml: 'Literal (|) and folded (>) blocks' },
  { feature: 'Anchors',      json: 'Not supported',                yaml: '& and * for reuse' },
  { feature: 'JSON subset',  json: '—',                            yaml: 'YAML 1.2 is a superset of JSON' },
  { feature: 'Primary use',  json: 'APIs, config, data exchange',  yaml: 'Config files, IaC, CI/CD' },
]
</script>

<style scoped>
/* ── Side-by-side code comparison ────────────────────────── */
.split-compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  margin: 14px 0;
}

.split-col { display: flex; flex-direction: column; }

.split-header {
  padding: 8px 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--c-border);
}

.split-header--json { background: rgba(99, 179, 237, 0.08); color: #63B3ED; border-right: 1px solid var(--c-border); }
.split-header--yaml { background: rgba(104, 211, 145, 0.08); color: #68D391; }

/* ── Diff table ───────────────────────────────────────────── */
.diff-table {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  margin: 12px 0;
  font-size: 13px;
}

.diff-row {
  display: grid;
  grid-template-columns: 130px 1fr 1fr;
  border-bottom: 1px solid var(--c-border);
}
.diff-row:last-child { border-bottom: none; }

.diff-row--head {
  background: var(--c-subtle);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-t4);
}

.diff-row > span {
  padding: 9px 14px;
  border-right: 1px solid var(--c-border);
  color: var(--c-t3);
  line-height: 1.5;
}
.diff-row > span:last-child { border-right: none; }

.diff-feature {
  font-weight: 600;
  color: var(--c-t2) !important;
  font-size: 12.5px;
}

/* ── Use case cards ───────────────────────────────────────── */
.use-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 12px 0;
}

.use-card {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  font-size: 13.5px;
}

.use-card-head {
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 700;
  border-bottom: 1px solid var(--c-border);
}

.use-card--json .use-card-head { background: rgba(99, 179, 237, 0.08); color: #63B3ED; }
.use-card--yaml .use-card-head { background: rgba(104, 211, 145, 0.08); color: #68D391; }

.use-card ul {
  margin: 0;
  padding: 12px 16px 12px 28px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.use-card li { color: var(--c-t3); line-height: 1.6; font-size: 13px; }

.use-card code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  background: rgba(249, 115, 22, 0.08);
  color: #F97316;
  padding: 1px 5px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .split-compare { grid-template-columns: 1fr; }
  .split-header--json { border-right: none; border-bottom: 1px solid var(--c-border); }
  .diff-row { grid-template-columns: 1fr; }
  .diff-row > span { border-right: none; }
  .diff-row--head > span:not(:first-child) { display: none; }
  .use-cards { grid-template-columns: 1fr; }
}
</style>
