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
          <pre class="code-block" style="margin:0; border-radius:0; border-top:none; border-right:none;"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">{</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">name</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Jane Doe</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">age</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 32</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">active</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> true</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">roles</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> [</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#032F62;--shiki-dark:#F1FA8C">admin</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">, </span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#032F62;--shiki-dark:#F1FA8C">editor</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">],</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">address</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> {</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">    "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">city</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Paris</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">    "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">country</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">France</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">  }</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">}</span></span></code></pre>
        </div>
        <div class="split-col">
          <div class="split-header split-header--yaml">YAML</div>
          <pre class="code-block" style="margin:0; border-radius:0; border-top:none; border-left:none;"><code class="shiki-code"><span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">name</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> Jane Doe</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">age</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 32</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">active</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> true</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">roles</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#FF79C6">  -</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> admin</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#FF79C6">  -</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> editor</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">address</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  city</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> Paris</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  country</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> France</span></span></code></pre>
        </div>
      </div>

      <p style="margin-top:14px">Both represent exactly the same data. YAML removes the quotes, braces, and commas — indentation does the structural work instead.</p>
      <p>This site's <NuxtLink to="/tools/yaml-to-json" class="guide-inline-link">YAML ↔ JSON Converter</NuxtLink> switches between the two blocks above instantly, in either direction.</p>
    </section>

    <section class="guide-section">
      <h2>Key differences</h2>
      <div class="diff-grid">
        <div class="diff-row diff-row--head">
          <span/>
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
      <pre class="code-block" data-lang="yaml"><span class="code-header">YAML supports comments — JSON does not</span><code class="shiki-code"><span class="line"><span style="color:#6A737D;--shiki-dark:#6272A4"># Database configuration</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">database</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  host</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> localhost</span><span style="color:#6A737D;--shiki-dark:#6272A4">   # or use an env var</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  port</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 5432</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  name</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#F1FA8C"> myapp_prod</span></span></code></pre>

      <h3>Multi-line strings</h3>
      <pre class="code-block" data-lang="yaml"><span class="code-header">YAML literal block ( | ) and folded block ( > )</span><code class="shiki-code"><span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">description</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#D73A49;--shiki-dark:#FF79C6"> |</span></span>
<span class="line"><span style="color:#032F62;--shiki-dark:#F1FA8C">  This is a multi-line string.</span></span>
<span class="line"><span style="color:#032F62;--shiki-dark:#F1FA8C">  Each line is preserved as-is.</span></span>
<span class="line"><span style="color:#032F62;--shiki-dark:#F1FA8C">  Great for scripts or SQL queries.</span></span>
<span class="line"/>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">summary</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#D73A49;--shiki-dark:#FF79C6"> ></span></span>
<span class="line"><span style="color:#032F62;--shiki-dark:#F1FA8C">  This text will be folded into</span></span>
<span class="line"><span style="color:#032F62;--shiki-dark:#F1FA8C">  a single line when parsed.</span></span></code></pre>

      <h3>Anchors and aliases</h3>
      <pre class="code-block"><span class="code-header">YAML anchors (&) reuse values — avoids repetition</span><code class="shiki-code"><span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">defaults</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#D73A49;--shiki-dark:#FF79C6"> &#x26;</span><span style="color:#6F42C1;--shiki-light-font-style:inherit;--shiki-dark:#8BE9FD;--shiki-dark-font-style:italic">defaults</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  retries</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 3</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  timeout</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 30</span></span>
<span class="line"/>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">production</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#BD93F9">  &#x3C;&#x3C;</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#D73A49;--shiki-dark:#FF79C6"> *</span><span style="color:#24292E;--shiki-light-font-style:inherit;--shiki-light-text-decoration:inherit;--shiki-dark:#50FA7B;--shiki-dark-font-style:italic;--shiki-dark-text-decoration:underline">defaults</span><span style="color:#6A737D;--shiki-dark:#6272A4">   # inherits retries and timeout</span></span>
<span class="line"><span style="color:#22863A;--shiki-dark:#8BE9FD">  timeout</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 60</span><span style="color:#6A737D;--shiki-dark:#6272A4">     # overrides just this value</span></span></code></pre>
    </section>

    <section class="guide-section">
      <h2>When to use each</h2>
      <div class="use-cards">
        <div class="comparison-card comparison-card--json">
          <div class="comparison-card-head">Choose JSON when…</div>
          <ul>
            <li>Building or consuming an <strong>API</strong> — JSON is the standard</li>
            <li>The data is <strong>machine-generated</strong> and machine-consumed</li>
            <li>You need <strong>maximum tooling compatibility</strong> (every language has a fast native JSON parser)</li>
            <li>Strict structure matters — no implicit type coercion surprises</li>
            <li>Examples: <code>package.json</code>, <code>tsconfig.json</code>, REST API responses</li>
          </ul>
        </div>
        <div class="comparison-card comparison-card--yaml">
          <div class="comparison-card-head">Choose YAML when…</div>
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

/* ── Diff grid (div-based comparison, not a <table> — see what-is-json.vue's .diff-table for the real-table variant) ── */
.diff-grid {
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

.comparison-card {
  border: 1px solid var(--c-border);
  border-radius: 10px;
  overflow: hidden;
  font-size: 13.5px;
}

.comparison-card-head {
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 700;
  border-bottom: 1px solid var(--c-border);
}

.comparison-card--json .comparison-card-head { background: rgba(99, 179, 237, 0.08); color: #63B3ED; }
.comparison-card--yaml .comparison-card-head { background: rgba(104, 211, 145, 0.08); color: #68D391; }

.comparison-card ul {
  margin: 0;
  padding: 12px 16px 12px 28px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comparison-card li { color: var(--c-t3); line-height: 1.6; font-size: 13px; }

.comparison-card code {
  font-family: var(--font-mono);
  font-size: 11.5px;
  background: rgb(var(--c-accent-rgb) / 0.08);
  color: var(--c-accent);
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
