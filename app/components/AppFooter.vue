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
          <span class="footer-col-title">Converters</span>
          <NuxtLink to="/tools/csv-to-json" class="footer-link">CSV ↔ JSON</NuxtLink>
          <NuxtLink to="/tools/xml-to-json" class="footer-link">XML ↔ JSON</NuxtLink>
          <NuxtLink to="/tools/yaml-to-json" class="footer-link">YAML ↔ JSON</NuxtLink>
          <NuxtLink to="/tools/excel-to-json" class="footer-link">Excel ↔ JSON</NuxtLink>
        </div>
        <div class="footer-col">
          <span class="footer-col-title">Tools</span>
          <NuxtLink to="/" class="footer-link">JSON Formatter</NuxtLink>
          <NuxtLink to="/tools/json-diff" class="footer-link">JSON Diff</NuxtLink>
          <NuxtLink to="/tools/jwt-decoder" class="footer-link">JWT Decoder</NuxtLink>
          <NuxtLink to="/tools/base64" class="footer-link">Base64 Encode / Decode</NuxtLink>
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
  gap: 48px;
  flex-wrap: wrap;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 160px;
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
