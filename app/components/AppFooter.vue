<template>
  <footer class="footer">

    <!-- Brand — toujours inline -->
    <div class="footer-brand-row">
      <div class="footer-brand">
        <LogoMark :size="34" />
        <div>
          <div class="brand-name">json<em>tools</em></div>
          <p class="brand-tagline">Free developer tools.<br>No signup, no tracking, no nonsense.</p>
        </div>
      </div>
    </div>

    <!-- Desktop : grille 5 colonnes -->
    <nav class="footer-nav-desktop" aria-label="Site navigation">
      <div class="footer-col">
        <span class="footer-col-title">JSON</span>
        <NuxtLink to="/tools/json-formatter" class="footer-link">JSON Formatter</NuxtLink>
        <NuxtLink to="/tools/json-diff"      class="footer-link">JSON Diff</NuxtLink>
        <NuxtLink to="/tools/json-tree"      class="footer-link">JSON Tree Viewer</NuxtLink>
      </div>
      <div class="footer-col">
        <span class="footer-col-title">Converters</span>
        <NuxtLink to="/tools/csv-to-json"   class="footer-link">CSV ↔ JSON</NuxtLink>
        <NuxtLink to="/tools/xml-to-json"   class="footer-link">XML ↔ JSON</NuxtLink>
        <NuxtLink to="/tools/yaml-to-json"  class="footer-link">YAML ↔ JSON</NuxtLink>
        <NuxtLink to="/tools/excel-to-json" class="footer-link">Excel ↔ JSON</NuxtLink>
        <NuxtLink to="/tools/json-to-ts"    class="footer-link">JSON → TypeScript</NuxtLink>
        <NuxtLink to="/tools/json-schema"   class="footer-link">JSON → Schema</NuxtLink>
      </div>
      <div class="footer-col">
        <span class="footer-col-title">Text & Code</span>
        <NuxtLink to="/tools/text-case"        class="footer-link">Text Case</NuxtLink>
        <NuxtLink to="/tools/minifier"         class="footer-link">Minifier</NuxtLink>
        <NuxtLink to="/tools/sql-formatter"    class="footer-link">SQL Formatter</NuxtLink>
        <NuxtLink to="/tools/url-encode"       class="footer-link">URL Encode / Decode</NuxtLink>
        <NuxtLink to="/tools/base64"           class="footer-link">Base64</NuxtLink>
        <NuxtLink to="/tools/markdown-preview" class="footer-link">Markdown Preview</NuxtLink>
      </div>
      <div class="footer-col">
        <span class="footer-col-title">Security</span>
        <NuxtLink to="/tools/jwt-decoder"        class="footer-link">JWT Decoder</NuxtLink>
        <NuxtLink to="/tools/jwt-generator"      class="footer-link">JWT Generator</NuxtLink>
        <NuxtLink to="/tools/hash"               class="footer-link">Hash Generator</NuxtLink>
        <NuxtLink to="/tools/uuid"               class="footer-link">UUID Generator</NuxtLink>
        <NuxtLink to="/tools/password-generator" class="footer-link">Password Generator</NuxtLink>
      </div>
      <div class="footer-col">
        <span class="footer-col-title">Dev Utils</span>
        <NuxtLink to="/tools/regex-tester"   class="footer-link">Regex Tester</NuxtLink>
        <NuxtLink to="/tools/cron-parser"    class="footer-link">Cron Parser</NuxtLink>
        <NuxtLink to="/tools/unix-timestamp" class="footer-link">Unix Timestamp</NuxtLink>
        <NuxtLink to="/tools/number-base"    class="footer-link">Number Base</NuxtLink>
        <NuxtLink to="/tools/color"          class="footer-link">Color Picker</NuxtLink>
      </div>
    </nav>

    <!-- Guides — bande basse desktop -->
    <div class="footer-guides-desktop">
      <span class="footer-guides-label">Guides</span>
      <div class="footer-guides-pills">
        <NuxtLink to="/guides/what-is-json"             class="footer-pill">What is JSON?</NuxtLink>
        <NuxtLink to="/guides/what-is-jwt"              class="footer-pill">What is a JWT?</NuxtLink>
        <NuxtLink to="/guides/what-is-base64"           class="footer-pill">What is Base64?</NuxtLink>
        <NuxtLink to="/guides/cron-expression-examples" class="footer-pill">Cron Examples</NuxtLink>
        <NuxtLink to="/guides/json-vs-yaml"             class="footer-pill">JSON vs YAML</NuxtLink>
        <NuxtLink to="/guides/how-to-validate-json"     class="footer-pill">Validate JSON</NuxtLink>
        <NuxtLink to="/guides/what-is-regex"            class="footer-pill">What is Regex?</NuxtLink>
        <NuxtLink to="/guides/what-is-markdown"         class="footer-pill">What is Markdown?</NuxtLink>
        <NuxtLink to="/guides/markdown-cheatsheet"      class="footer-pill">Markdown Cheatsheet</NuxtLink>
        <NuxtLink to="/guides/what-is-url-encoding"     class="footer-pill">URL Encoding</NuxtLink>
        <NuxtLink to="/guides/what-is-hash"             class="footer-pill">Hash Functions</NuxtLink>
        <NuxtLink to="/guides/what-is-xml"              class="footer-pill">What is XML?</NuxtLink>
        <NuxtLink to="/guides/what-is-uuid"             class="footer-pill">What is UUID?</NuxtLink>
        <NuxtLink to="/guides/what-is-json-schema"      class="footer-pill">JSON Schema</NuxtLink>
        <NuxtLink to="/guides/what-is-yaml"             class="footer-pill">What is YAML?</NuxtLink>
        <NuxtLink to="/guides/regex-cheatsheet"         class="footer-pill">Regex Cheatsheet</NuxtLink>
        <NuxtLink to="/guides/json-best-practices"      class="footer-pill">JSON Best Practices</NuxtLink>
      </div>
    </div>

    <!-- Mobile : rows + pills -->
    <nav class="footer-nav-mobile" aria-label="Site navigation">
      <div class="footer-mobile-row">
        <span class="footer-mobile-cat">JSON</span>
        <div class="footer-mobile-pills">
          <NuxtLink to="/tools/json-formatter" class="footer-pill">Formatter</NuxtLink>
          <NuxtLink to="/tools/json-diff"      class="footer-pill">Diff</NuxtLink>
          <NuxtLink to="/tools/json-tree"      class="footer-pill">Tree Viewer</NuxtLink>
        </div>
      </div>
      <div class="footer-mobile-row">
        <span class="footer-mobile-cat">Converters</span>
        <div class="footer-mobile-pills">
          <NuxtLink to="/tools/csv-to-json"   class="footer-pill">CSV → JSON</NuxtLink>
          <NuxtLink to="/tools/json-to-csv"   class="footer-pill">JSON → CSV</NuxtLink>
          <NuxtLink to="/tools/xml-to-json"   class="footer-pill">XML → JSON</NuxtLink>
          <NuxtLink to="/tools/json-to-xml"   class="footer-pill">JSON → XML</NuxtLink>
          <NuxtLink to="/tools/yaml-to-json"  class="footer-pill">YAML → JSON</NuxtLink>
          <NuxtLink to="/tools/json-to-yaml"  class="footer-pill">JSON → YAML</NuxtLink>
          <NuxtLink to="/tools/excel-to-json" class="footer-pill">Excel → JSON</NuxtLink>
          <NuxtLink to="/tools/json-to-excel" class="footer-pill">JSON → Excel</NuxtLink>
          <NuxtLink to="/tools/json-to-ts"    class="footer-pill">JSON → TypeScript</NuxtLink>
          <NuxtLink to="/tools/json-schema"   class="footer-pill">JSON → Schema</NuxtLink>
        </div>
      </div>
      <div class="footer-mobile-row">
        <span class="footer-mobile-cat">Text & Code</span>
        <div class="footer-mobile-pills">
          <NuxtLink to="/tools/text-case"        class="footer-pill">Text Case</NuxtLink>
          <NuxtLink to="/tools/minifier"         class="footer-pill">Minifier</NuxtLink>
          <NuxtLink to="/tools/sql-formatter"    class="footer-pill">SQL Formatter</NuxtLink>
          <NuxtLink to="/tools/url-encode"       class="footer-pill">URL Encode</NuxtLink>
          <NuxtLink to="/tools/base64"           class="footer-pill">Base64</NuxtLink>
          <NuxtLink to="/tools/markdown-preview" class="footer-pill">Markdown Preview</NuxtLink>
        </div>
      </div>
      <div class="footer-mobile-row">
        <span class="footer-mobile-cat">Security</span>
        <div class="footer-mobile-pills">
          <NuxtLink to="/tools/jwt-decoder"        class="footer-pill">JWT Decoder</NuxtLink>
          <NuxtLink to="/tools/jwt-generator"      class="footer-pill">JWT Generator</NuxtLink>
          <NuxtLink to="/tools/hash"               class="footer-pill">Hash</NuxtLink>
          <NuxtLink to="/tools/uuid"               class="footer-pill">UUID</NuxtLink>
          <NuxtLink to="/tools/password-generator" class="footer-pill">Password</NuxtLink>
        </div>
      </div>
      <div class="footer-mobile-row">
        <span class="footer-mobile-cat">Dev Utils</span>
        <div class="footer-mobile-pills">
          <NuxtLink to="/tools/regex-tester"   class="footer-pill">Regex</NuxtLink>
          <NuxtLink to="/tools/cron-parser"    class="footer-pill">Cron</NuxtLink>
          <NuxtLink to="/tools/unix-timestamp" class="footer-pill">Timestamp</NuxtLink>
          <NuxtLink to="/tools/number-base"    class="footer-pill">Number Base</NuxtLink>
          <NuxtLink to="/tools/color"          class="footer-pill">Color Picker</NuxtLink>
        </div>
      </div>
      <div class="footer-mobile-row">
        <span class="footer-mobile-cat">Guides</span>
        <div class="footer-mobile-pills">
          <NuxtLink to="/guides/what-is-json"             class="footer-pill">What is JSON?</NuxtLink>
          <NuxtLink to="/guides/what-is-jwt"              class="footer-pill">What is JWT?</NuxtLink>
          <NuxtLink to="/guides/what-is-base64"           class="footer-pill">What is Base64?</NuxtLink>
          <NuxtLink to="/guides/cron-expression-examples" class="footer-pill">Cron Examples</NuxtLink>
          <NuxtLink to="/guides/json-vs-yaml"             class="footer-pill">JSON vs YAML</NuxtLink>
          <NuxtLink to="/guides/how-to-validate-json"     class="footer-pill">Validate JSON</NuxtLink>
          <NuxtLink to="/guides/what-is-regex"            class="footer-pill">What is Regex?</NuxtLink>
          <NuxtLink to="/guides/what-is-markdown"         class="footer-pill">What is Markdown?</NuxtLink>
          <NuxtLink to="/guides/markdown-cheatsheet"      class="footer-pill">Markdown Cheatsheet</NuxtLink>
          <NuxtLink to="/guides/what-is-url-encoding"     class="footer-pill">URL Encoding</NuxtLink>
          <NuxtLink to="/guides/what-is-hash"             class="footer-pill">Hash Functions</NuxtLink>
          <NuxtLink to="/guides/what-is-xml"              class="footer-pill">What is XML?</NuxtLink>
          <NuxtLink to="/guides/what-is-uuid"             class="footer-pill">What is UUID?</NuxtLink>
          <NuxtLink to="/guides/what-is-json-schema"      class="footer-pill">JSON Schema</NuxtLink>
          <NuxtLink to="/guides/what-is-yaml"             class="footer-pill">What is YAML?</NuxtLink>
          <NuxtLink to="/guides/regex-cheatsheet"         class="footer-pill">Regex Cheatsheet</NuxtLink>
          <NuxtLink to="/guides/json-best-practices"      class="footer-pill">JSON Best Practices</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <span>© {{ new Date().getFullYear() }} JSON Tools</span>
      <span class="footer-sep">·</span>
      <span>Free · No signup · No tracking</span>
      <span class="footer-sep">·</span>
      <span>100% client-side</span>
      <span class="footer-sep">·</span>
      <NuxtLink to="/faq"     class="footer-bottom-link">FAQ</NuxtLink>
      <span class="footer-sep">·</span>
      <NuxtLink to="/privacy" class="footer-bottom-link">Privacy</NuxtLink>
      <span class="footer-sep">·</span>
      <NuxtLink to="/terms"   class="footer-bottom-link">Terms</NuxtLink>
    </div>

  </footer>
</template>

<style scoped>
.footer {
  background: #13181F;
  border-top: 1px solid rgba(255,255,255,0.05);
  margin-top: auto;
}

/* ── Brand ───────────────────────────────────────────────── */
.footer-brand-row {
  max-width: 1440px;
  margin: 0 auto;
  padding: 36px 24px 28px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.footer-brand {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.brand-name {
  font-size: 15px;
  font-weight: 600;
  color: #F1F0EE;
  letter-spacing: -0.3px;
  margin-bottom: 6px;
}
.brand-name em { font-style: normal; color: var(--c-brand); }

.brand-tagline {
  font-size: 12.5px;
  color: #4A5260;
  line-height: 1.7;
}

/* ── Desktop nav — grille 5 colonnes ─────────────────────── */
.footer-nav-desktop {
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 24px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px 32px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.footer-col-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3D4349;
  margin-bottom: 3px;
}

.footer-link {
  font-size: 13px;
  color: #5C6470;
  text-decoration: none;
  font-family: 'JetBrains Mono', monospace;
  transition: color 0.15s;
}
.footer-link:hover { color: var(--c-brand); }

/* ── Guides bande basse (desktop) ────────────────────────── */
.footer-guides-desktop {
  max-width: 1440px;
  margin: 0 auto;
  padding: 16px 24px 32px;
  border-top: 1px solid rgba(255,255,255,0.04);
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-guides-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3D4349;
  flex-shrink: 0;
}

.footer-guides-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* ── Pills (shared) ──────────────────────────────────────── */
.footer-pill {
  font-size: 12px;
  color: #5C6470;
  text-decoration: none;
  font-family: 'JetBrains Mono', monospace;
  padding: 3px 10px;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  background: rgba(255,255,255,0.02);
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
}
.footer-pill:hover { color: var(--c-brand); border-color: rgb(var(--c-brand-rgb) / 0.3); }

/* ── Mobile nav — rows + pills ───────────────────────────── */
.footer-nav-mobile { display: none; }

.footer-mobile-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-mobile-cat {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3D4349;
}

.footer-mobile-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* ── Bottom bar ──────────────────────────────────────────── */
.footer-bottom {
  max-width: 1440px;
  margin: 0 auto;
  padding: 14px 24px 20px;
  border-top: 1px solid rgba(255,255,255,0.04);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #3A4049;
}

.footer-sep { color: #2A3039; }

.footer-bottom-link {
  color: #3A4049;
  text-decoration: none;
  transition: color 0.15s;
}
.footer-bottom-link:hover { color: var(--c-brand); }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 768px) {
  .footer-nav-desktop    { display: none; }
  .footer-guides-desktop { display: none; }
  .footer-nav-mobile {
    display: flex;
    flex-direction: column;
    gap: 18px;
    max-width: 1440px;
    margin: 0 auto;
    padding: 24px 20px 28px;
  }
}
</style>
