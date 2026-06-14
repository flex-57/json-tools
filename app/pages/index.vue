<template>
  <div class="home">
    <section class="hero">
      <p class="hero-tag">Free · No signup · 100% client-side</p>
      <h1 class="hero-title">Developer tools<br><em>that just work</em></h1>
      <p class="hero-sub">25+ tools for JSON, data conversion, text, security and more.<br>Everything runs in your browser — your data never leaves your machine.</p>
    </section>

    <div class="cat-list">
      <section v-for="cat in CATEGORIES" :key="cat.id" class="cat">
        <div class="cat-head">
          <span class="cat-icon" v-html="cat.icon" />
          <h2 class="cat-name">{{ cat.name }}</h2>
          <p class="cat-count">{{ cat.tools.length }} tools</p>
        </div>
        <div class="tool-grid">
          <NuxtLink
            v-for="tool in cat.tools"
            :key="tool.to"
            :to="tool.to"
            class="tool-card"
          >
            <span class="tool-icon" v-html="tool.icon" />
            <span class="tool-name">{{ tool.name }}</span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  script: [{
    key: 'schema-website',
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'JSON Tools',
      url: 'https://jsontools.space',
      description: 'Free online developer tools for JSON, data conversion, text, security and more. No signup, no data sent to servers.',
    }),
  }],
})

useSeoMeta({
  title: 'JSON Tools — Free Developer Tools Online',
  description: 'Free online developer tools for JSON formatting, data conversion, text processing, JWT, regex, and more. No signup, no tracking, 100% client-side.',
  ogTitle: 'JSON Tools — Free Developer Tools Online',
  ogDescription: 'Free online developer tools for JSON formatting, data conversion, text processing, JWT, regex, and more. No signup, no tracking, 100% client-side.',
  twitterTitle: 'JSON Tools — Free Developer Tools Online',
  twitterDescription: 'Free online developer tools for JSON formatting, data conversion, text processing, JWT, regex, and more. No signup, no tracking, 100% client-side.',
  ogImage: 'https://jsontools.space/og/og-image.png',
  twitterImage: 'https://jsontools.space/og/og-image.png',
})

const IC = {
  /* ── Category icons (20×20) ──────────────────────── */
  catJson: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3C5.5 3 5 4 5 5.5v1.5c0 1.2-.8 2-2 2 1.2 0 2 .8 2 2v1.5C5 14 5.5 15 7 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 3c1.5 0 2 1 2 2.5v1.5c0 1.2.8 2 2 2-1.2 0-2 .8-2 2v1.5C15 14 14.5 15 13 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  catConv: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 7h12M13 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 13H4M7 10l-3 3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  catText: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 6L3 10l4 4M13 6l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  catSec:  `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L3 5v4.5c0 4.2 3 7.8 7 9 4-1.2 7-4.8 7-9V5L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  catDev:  `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M6 9l3 3-3 3M12 15h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  /* ── Tool icons (16×16) ──────────────────────────── */
  formatter: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 2C3.5 2 3 2.7 3 3.7v1.2c0 .9-.6 1.4-1.2 1.6.6.2 1.2.7 1.2 1.6v1.2C3 10.3 3.5 11 4.5 11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M11.5 2c1 0 1.5.7 1.5 1.7v1.2c0 .9.6 1.4 1.2 1.6-.6.2-1.2.7-1.2 1.6v1.2c0 1-.5 1.7-1.5 1.7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M5 13h6M6.5 14.5h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  diff:      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="6.5" height="8.5" rx="1.5" stroke="currentColor" stroke-width="1.3"/><rect x="8.5" y="5.5" width="6.5" height="8.5" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M3.5 6.5h2M4.5 5.5v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M10.5 10h2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  tree:      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="3" cy="3" r="1.5" stroke="currentColor" stroke-width="1.2"/><circle cx="13" cy="7" r="1.5" stroke="currentColor" stroke-width="1.2"/><circle cx="13" cy="13" r="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M3 4.5V7c0 .8.7 1.5 1.5 1.5H8M3 4.5V11c0 .8.7 1.5 1.5 1.5H8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8.5H11.5M8 13H11.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  ts:        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3C1 3 .5 3.7.5 4.7v1.2c0 .9-.5 1.4-1.1 1.6.6.2 1.1.7 1.1 1.6v1.2c0 1 .5 1.7 1.5 1.7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M9 4h6M12 4v7M10 11h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  schema:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 5.5h13M1.5 10h13M6 1.5v13" stroke="currentColor" stroke-width="1.3"/></svg>`,
  csvIn:     `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h3.5M2 7.5h4.5M2 11h3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M10 8h5M12.5 5.5L15 8l-2.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  csvOut:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 4h3.5M9 7.5h4.5M9 11h3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M6 8H1M3.5 5.5L1 8l2.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  xmlIn:     `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5.5L4 4l2 1.5M2 8.5h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 8h5M12.5 5.5L15 8l-2.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  xmlOut:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 5.5L11 4l2 1.5M9 8.5h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 8H1M3.5 5.5L1 8l2.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  yamlIn:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4.5h3M2 7.5h4.5M2 10.5h2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M10 8h5M12.5 5.5L15 8l-2.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  yamlOut:   `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 4.5h3M9 7.5h4.5M9 10.5h2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M6 8H1M3.5 5.5L1 8l2.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  xlIn:      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="5.5" height="10" rx="1" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 6h5.5M1.5 9h5.5M4.2 2.5v10" stroke="currentColor" stroke-width="1.3"/><path d="M10.5 8h5M13 5.5L15.5 8 13 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  xlOut:     `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="9" y="2.5" width="5.5" height="10" rx="1" stroke="currentColor" stroke-width="1.3"/><path d="M9 6h5.5M9 9h5.5M11.7 2.5v10" stroke="currentColor" stroke-width="1.3"/><path d="M5.5 8H1M3 5.5L.5 8 3 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  textCase:  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 13L5 3.5 8.5 13M2.5 10h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 7c.7-.8 1.5-1.2 2.3-1.2 1.7 0 2.7 1 2.7 2.8V13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M10.5 10.5c0 1.5 1 2.2 2.3 2.2 1.6 0 2.7-.9 2.7-2.2 0-1.4-1-1.8-2.3-2-1.2-.2-1.9-.6-1.9-1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  minifier:  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 7h8M2 10h12M5.5 13h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  sql:       `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="4" rx="5" ry="1.8" stroke="currentColor" stroke-width="1.3"/><path d="M3 4v4c0 1 2.2 1.8 5 1.8S13 9 13 8V4" stroke="currentColor" stroke-width="1.3"/><path d="M3 8v4c0 1 2.2 1.8 5 1.8S13 13 13 12V8" stroke="currentColor" stroke-width="1.3"/></svg>`,
  url:       `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7 9a3 3 0 004.24 0l1.76-1.76a3 3 0 00-4.24-4.24L8 3.76" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M9 7a3 3 0 00-4.24 0L3 8.76a3 3 0 004.24 4.24L8 12.24" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  base64:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="6" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="3" width="6" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M3 7.5h2M3 10h2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M11 6v5M9.5 8h3M9.5 10.5h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  jwtDec:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7 7c.7-1.4 2-2.3 3.5-2.3 2.2 0 4 1.8 4 4s-1.8 4-4 4c-1.5 0-2.8-.9-3.5-2.3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="10.5" cy="8.5" r="1" fill="currentColor"/><path d="M7 8.5H1.5M4 6.5L1.5 8.5 4 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  jwtGen:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="10" cy="8" r="4.5" stroke="currentColor" stroke-width="1.3"/><circle cx="10" cy="8" r="1.2" fill="currentColor"/><path d="M4 8H1M2 6v4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M5.5 8H4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  hash:      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.5 2v12M10.5 2v12M2 5.5h12M2 10.5h12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  uuid:      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M8 10.5c-1.4 0-2.5-1.1-2.5-2.5S6.6 5.5 8 5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M12 11v3M13.5 12.5h-3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  regex:     `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="3" cy="8" r="1" fill="currentColor"/><circle cx="8" cy="5" r="1" fill="currentColor"/><circle cx="13" cy="8" r="1" fill="currentColor"/><path d="M8 3v4M11 5l-3 3M5 5l3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  cron:      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/><path d="M8 4.5V8l2.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  unix:      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/><path d="M8 5v3l-2 2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 13.5L1.5 15" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  numBase:   `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12L6 4M10 4l4 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M3.5 9h5M10.5 9h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
}

const CATEGORIES = [
  {
    id: 'json',
    name: 'JSON',
    icon: IC.catJson,
    tools: [
      { name: 'JSON Formatter', to: '/tools/json-formatter', icon: IC.formatter },
      { name: 'JSON Diff', to: '/tools/json-diff', icon: IC.diff },
      { name: 'JSON Tree Viewer', to: '/tools/json-tree', icon: IC.tree },
      { name: 'JSON → TypeScript / Zod', to: '/tools/json-to-ts', icon: IC.ts },
      { name: 'JSON Schema Generator', to: '/tools/json-schema', icon: IC.schema },
    ],
  },
  {
    id: 'converters',
    name: 'Converters',
    icon: IC.catConv,
    tools: [
      { name: 'CSV → JSON', to: '/tools/csv-to-json', icon: IC.csvIn },
      { name: 'JSON → CSV', to: '/tools/json-to-csv', icon: IC.csvOut },
      { name: 'XML → JSON', to: '/tools/xml-to-json', icon: IC.xmlIn },
      { name: 'JSON → XML', to: '/tools/json-to-xml', icon: IC.xmlOut },
      { name: 'YAML → JSON', to: '/tools/yaml-to-json', icon: IC.yamlIn },
      { name: 'JSON → YAML', to: '/tools/json-to-yaml', icon: IC.yamlOut },
      { name: 'Excel → JSON', to: '/tools/excel-to-json', icon: IC.xlIn },
      { name: 'JSON → Excel', to: '/tools/json-to-excel', icon: IC.xlOut },
    ],
  },
  {
    id: 'text-code',
    name: 'Text & Code',
    icon: IC.catText,
    tools: [
      { name: 'Text Case Converter', to: '/tools/text-case', icon: IC.textCase },
      { name: 'CSS / HTML / JS Minifier', to: '/tools/minifier', icon: IC.minifier },
      { name: 'SQL Formatter', to: '/tools/sql-formatter', icon: IC.sql },
      { name: 'URL Encode / Decode', to: '/tools/url-encode', icon: IC.url },
      { name: 'Base64 Encode / Decode', to: '/tools/base64', icon: IC.base64 },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    icon: IC.catSec,
    tools: [
      { name: 'JWT Decoder', to: '/tools/jwt-decoder', icon: IC.jwtDec },
      { name: 'JWT Generator', to: '/tools/jwt-generator', icon: IC.jwtGen },
      { name: 'Hash Generator', to: '/tools/hash', icon: IC.hash },
      { name: 'UUID Generator', to: '/tools/uuid', icon: IC.uuid },
    ],
  },
  {
    id: 'dev-utils',
    name: 'Dev Utils',
    icon: IC.catDev,
    tools: [
      { name: 'Regex Tester', to: '/tools/regex-tester', icon: IC.regex },
      { name: 'Cron Parser', to: '/tools/cron-parser', icon: IC.cron },
      { name: 'Unix Timestamp', to: '/tools/unix-timestamp', icon: IC.unix },
      { name: 'Number Base Converter', to: '/tools/number-base', icon: IC.numBase },
    ],
  },
]
</script>

<style scoped>
/* ── Hero ──────────────────────────────────────────── */
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px;
}

.hero {
  text-align: center;
  padding: 56px 0 48px;
}

.hero-tag {
  display: inline-block;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #F97316;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.2);
  border-radius: 20px;
  padding: 4px 14px;
  margin-bottom: 20px;
}

.hero-title {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 700;
  color: var(--c-t1);
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 18px;
}

.hero-title em {
  font-style: normal;
  color: #F97316;
}

.hero-sub {
  font-size: 16px;
  color: var(--c-t3);
  line-height: 1.7;
  max-width: 520px;
  margin: 0 auto;
}

/* ── Category list ─────────────────────────────────── */
.cat-list {
  display: flex;
  flex-direction: column;
}

.cat {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 0 32px;
  align-items: start;
  padding: 28px 0;
  border-top: 1px solid var(--c-border);
}

.cat:last-child { border-bottom: 1px solid var(--c-border); }

/* ── Category header ───────────────────────────────── */
.cat-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 6px;
}

.cat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(249, 115, 22, 0.08);
  border: 1px solid rgba(249, 115, 22, 0.15);
  border-radius: 10px;
  color: #F97316;
  flex-shrink: 0;
}

.cat-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-t1);
  letter-spacing: -0.01em;
}

.cat-count {
  font-size: 11.5px;
  color: var(--c-t5);
}

/* ── Tool grid ─────────────────────────────────────── */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 8px;
}

.tool-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
}

.tool-card:hover {
  background: rgba(249, 115, 22, 0.05);
  border-color: rgba(249, 115, 22, 0.3);
}

.tool-icon {
  display: flex;
  align-items: center;
  color: var(--c-t4);
  flex-shrink: 0;
  transition: color 0.15s;
}

.tool-card:hover .tool-icon { color: #F97316; }

.tool-name {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--c-t2);
  font-family: 'JetBrains Mono', monospace;
  transition: color 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-card:hover .tool-name { color: var(--c-t1); }

/* ── Responsive ────────────────────────────────────── */
@media (max-width: 768px) {
  .home { padding: 0 16px 40px; }
  .hero { padding: 36px 0 32px; }
  .hero-sub { font-size: 14px; }

  .cat {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 20px 0;
  }

  .cat-head {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding-top: 0;
  }

  .cat-icon { width: 32px; height: 32px; }
  .cat-count { display: none; }

  .tool-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  .tool-name { font-size: 12px; }
}
</style>
