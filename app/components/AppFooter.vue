<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="brand-mark">{ }</div>
        <div>
          <div class="brand-name">json<em>tools</em></div>
          <p class="brand-tagline">Free JSON tools for developers.<br>No signup, no tracking, no nonsense.</p>
        </div>
      </div>

      <nav class="footer-nav">
        <div class="footer-col">
          <span class="footer-col-title">→ JSON</span>
          <NuxtLink to="/tools/csv-to-json" class="footer-link">CSV to JSON</NuxtLink>
          <NuxtLink to="/tools/xml-to-json" class="footer-link">XML to JSON</NuxtLink>
          <NuxtLink to="/tools/yaml-to-json" class="footer-link">YAML to JSON</NuxtLink>
          <NuxtLink to="/tools/excel-to-json" class="footer-link">Excel to JSON</NuxtLink>
        </div>
        <div class="footer-col">
          <span class="footer-col-title">JSON →</span>
          <NuxtLink to="/tools/json-to-csv" class="footer-link">JSON to CSV</NuxtLink>
          <NuxtLink to="/tools/json-to-xml" class="footer-link">JSON to XML</NuxtLink>
          <NuxtLink to="/tools/json-to-yaml" class="footer-link">JSON to YAML</NuxtLink>
          <NuxtLink to="/tools/json-to-excel" class="footer-link">JSON to Excel</NuxtLink>
        </div>
        <div class="footer-col">
          <span class="footer-col-title">JSON Tools</span>
          <NuxtLink to="/" class="footer-link">JSON Formatter</NuxtLink>
          <NuxtLink to="/tools/json-diff" class="footer-link">JSON Diff</NuxtLink>
          <NuxtLink to="/tools/json-tree" class="footer-link">JSON Tree Viewer</NuxtLink>
          <NuxtLink to="/tools/json-schema" class="footer-link">JSON Schema Generator</NuxtLink>
          <NuxtLink to="/tools/json-to-ts" class="footer-link">JSON → TypeScript / Zod</NuxtLink>
        </div>
        <div class="footer-col">
          <span class="footer-col-title">Encode & Decode</span>
          <NuxtLink to="/tools/base64" class="footer-link">Base64 Encode / Decode</NuxtLink>
          <NuxtLink to="/tools/url-encode" class="footer-link">URL Encode / Decode</NuxtLink>
          <NuxtLink to="/tools/jwt-decoder" class="footer-link">JWT Decoder</NuxtLink>
          <NuxtLink to="/tools/hash" class="footer-link">Hash Generator</NuxtLink>
        </div>
        <div class="footer-col">
          <span class="footer-col-title">Dev Utils</span>
          <NuxtLink to="/tools/regex-tester" class="footer-link">Regex Tester</NuxtLink>
          <NuxtLink to="/tools/cron-parser" class="footer-link">Cron Parser</NuxtLink>
          <NuxtLink to="/tools/unix-timestamp" class="footer-link">Unix Timestamp</NuxtLink>
          <NuxtLink to="/tools/uuid" class="footer-link">UUID Generator</NuxtLink>
          <NuxtLink to="/tools/minifier" class="footer-link">CSS / HTML / JS Minifier</NuxtLink>
        </div>
      </nav>
    </div>

    <div class="footer-bottom">
      <span>© {{ new Date().getFullYear() }} JSON Tools</span>
      <span class="footer-sep">·</span>
      <span>Free · No signup · No tracking</span>
      <span class="footer-sep">·</span>
      <span>100% client-side processing</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #13181F;
  border-top: 1px solid rgba(255,255,255,0.05);
  margin-top: auto;
}

.footer-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 24px 28px;
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
}

.footer-brand {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  flex: 1;
  min-width: 220px;
}

.brand-mark {
  width: 34px;
  height: 34px;
  background: #F97316;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: white;
  letter-spacing: -1px;
  flex-shrink: 0;
}

.brand-name {
  font-size: 15px;
  font-weight: 600;
  color: #F1F0EE;
  letter-spacing: -0.3px;
  margin-bottom: 8px;
}

.brand-name em {
  font-style: normal;
  color: #F97316;
}

.brand-tagline {
  font-size: 12.5px;
  color: #4A5260;
  line-height: 1.7;
}

.footer-nav {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 140px;
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

.footer-link:hover { color: #F97316; }

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
</style>
