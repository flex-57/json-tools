<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        <strong>YAML</strong> (YAML Ain't Markup Language — yes, a recursive acronym) is a human-friendly
        data serialization format. Where JSON uses braces and brackets, YAML uses indentation and
        minimal punctuation, making it easier to read and write by hand. It is the format of choice
        for configuration files: Docker Compose, Kubernetes manifests, GitHub Actions, and Ansible
        playbooks are all YAML.
      </p>
    </section>

    <section class="guide-section">
      <h2>YAML vs JSON at a glance</h2>
      <p>The same data in both formats:</p>
      <div class="two-col">
        <div>
          <p class="col-label">YAML</p>
          <pre class="code-block"><code>name: Alice Martin
age: 28
active: true
roles:
  - admin
  - editor
address:
  city: Paris
  country: France</code></pre>
        </div>
        <div>
          <p class="col-label">JSON</p>
          <pre class="code-block"><code>{
  "name": "Alice Martin",
  "age": 28,
  "active": true,
  "roles": ["admin", "editor"],
  "address": {
    "city": "Paris",
    "country": "France"
  }
}</code></pre>
        </div>
      </div>
      <p>
        YAML is a superset of JSON — every valid JSON document is also valid YAML.
        Conversely, YAML supports features JSON does not: comments, multi-line strings, anchors, and aliases.
      </p>
    </section>

    <section class="guide-section">
      <h2>YAML syntax essentials</h2>
      <h3>Scalars</h3>
      <pre class="code-block"><code>string_bare: hello world          # no quotes needed for simple strings
string_quoted: "must quote: this" # quotes needed when value contains : or #
number: 42
float: 3.14
boolean_true: true                # also: yes, on, True, TRUE (be careful!)
boolean_false: false              # also: no, off, False, FALSE
null_value: null                  # also: ~
date: 2026-01-15                  # bare dates are parsed as dates, not strings</code></pre>

      <h3>Sequences (lists)</h3>
      <pre class="code-block"><code># Block style (most common in config files)
fruits:
  - apple
  - banana
  - cherry

# Flow style (looks like JSON)
fruits: [apple, banana, cherry]</code></pre>

      <h3>Mappings (objects)</h3>
      <pre class="code-block"><code># Block style
server:
  host: localhost
  port: 8080

# Flow style
server: { host: localhost, port: 8080 }</code></pre>

      <h3>Multi-line strings</h3>
      <pre class="code-block"><code># Literal block (|) — preserves newlines
message: |
  Line one.
  Line two.
  Line three.

# Folded block (>) — newlines become spaces, blank lines become newlines
description: >
  This long sentence is split across
  multiple lines for readability but
  will be joined into one line.</code></pre>

      <h3>Comments</h3>
      <pre class="code-block"><code># This is a comment — JSON does not support comments, YAML does
port: 8080  # inline comment</code></pre>
    </section>

    <section class="guide-section">
      <h2>Anchors and aliases</h2>
      <p>
        YAML lets you define a value once and reuse it, which is useful in large config files:
      </p>
      <pre class="code-block"><code>defaults: &amp;defaults
  timeout: 30
  retries: 3

production:
  &lt;&lt;: *defaults   # merge anchor — inherits timeout and retries
  host: prod.example.com

staging:
  &lt;&lt;: *defaults
  host: staging.example.com</code></pre>
    </section>

    <section class="guide-section">
      <h2>Common YAML gotchas</h2>
      <h3>The Norway problem</h3>
      <p>
        In YAML 1.1 (used by many parsers), country codes like <code>NO</code>, <code>yes</code>, <code>on</code>,
        and <code>off</code> are parsed as booleans. Norway's ISO code <code>NO</code> silently becomes
        <code>false</code>, which breaks country lists. Always quote these values:
      </p>
      <pre class="code-block"><code># Wrong — NO becomes false in YAML 1.1
countries: [GB, FR, NO, DE]

# Correct — quote the ambiguous value
countries: [GB, FR, "NO", DE]</code></pre>
      <p>YAML 1.2 (the current standard) fixes this — only <code>true</code> and <code>false</code> are booleans.</p>

      <h3>Tabs are forbidden</h3>
      <p>
        YAML uses only spaces for indentation — never tabs. A tab character anywhere in the indentation
        is a syntax error. Most editors can be configured to insert spaces when you press Tab in YAML files.
      </p>

      <h3>Implicit type coercion</h3>
      <p>
        YAML parsers infer types from bare values. <code>1.0</code> becomes a float, <code>0x1A</code>
        becomes an integer (26), <code>1_000</code> becomes 1000, and ISO dates become date objects.
        Quote values you want treated as strings:
      </p>
      <pre class="code-block"><code>version: "1.0"     # string, not float
zip: "01234"       # string, not integer (leading zero stripped otherwise)</code></pre>
    </section>

    <section class="guide-section">
      <h2>When to use YAML</h2>
      <ul>
        <li><strong>Configuration files</strong> — Docker Compose, Kubernetes, GitHub Actions, Helm charts, Ansible.</li>
        <li><strong>Human-edited files</strong> — when humans write and maintain the file and comments are valuable.</li>
        <li><strong>CI/CD pipelines</strong> — virtually every CI platform (GitHub Actions, GitLab CI, CircleCI) uses YAML.</li>
      </ul>
      <p>
        For machine-generated data or API responses, JSON is usually better — it is simpler, has fewer
        gotchas, and is natively supported by every language. See the
        <NuxtLink to="/guides/json-vs-yaml" class="guide-inline-link">JSON vs YAML comparison guide</NuxtLink>
        for a full breakdown of when to choose each.
      </p>
    </section>

  </div>
</template>

<style scoped>
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 12px 0; }
.code-block code { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
.col-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--c-t4); margin-bottom: 6px; }
@media (max-width: 640px) { .two-col { grid-template-columns: 1fr; } }
</style>
