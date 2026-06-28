<template>
  <div class="home">
    <section class="hero">
      <p class="hero-tag">Free · No signup · 100% client-side</p>
      <h1 class="hero-title">Developer tools<br><em>that just work</em></h1>
      <p class="hero-sub">28 tools for JSON, data conversion, text, security and more.<br>Everything runs in your browser — your data never leaves your machine.</p>
    </section>

    <div class="search-wrap">
      <div class="search-box">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.4"/><path d="M10 10l3.5 3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        <input
          v-model="searchQuery"
          class="search-input"
          type="search"
          placeholder="Search tools…"
          autocomplete="off"
          spellcheck="false"
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''" aria-label="Clear">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>

    <p v-if="searchQuery && filteredCategories.length === 0" class="search-empty">
      No tools found for "<strong>{{ searchQuery }}</strong>"
    </p>

    <div v-if="recentTools.length && !searchQuery" class="recent-section">
      <p class="recent-label">Recently used</p>
      <div class="recent-row">
        <NuxtLink
          v-for="tool in recentTools"
          :key="tool.to"
          :to="tool.to"
          class="tool-card recent-card"
        >
          <span class="tool-icon" v-html="tool.icon" />
          <span class="tool-name">{{ tool.name }}</span>
        </NuxtLink>
      </div>
    </div>

    <div class="cat-list">
      <section v-for="cat in filteredCategories" :key="cat.id" class="cat">
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

    <section class="features">
      <div class="feature">
        <span class="feature-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 10H2M18 10h-2M10 4V2M10 18v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </span>
        <h3 class="feature-title">Instant, no friction</h3>
        <p class="feature-body">Open any tool and start working. No account, no onboarding, no waiting — results appear as you type.</p>
      </div>
      <div class="feature">
        <span class="feature-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L3 5.5v5c0 4 3.1 7.4 7 8.5 3.9-1.1 7-4.5 7-8.5v-5L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 10l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <h3 class="feature-title">Your data stays yours</h3>
        <p class="feature-body">Everything runs directly in your browser. Nothing is sent to a server — not a single byte of your data leaves your machine.</p>
      </div>
      <div class="feature">
        <span class="feature-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10h14M3 6h14M3 14h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </span>
        <h3 class="feature-title">Free, all of it</h3>
        <p class="feature-body">All 28 tools, forever free. No premium tier, no rate limits, no ads in the way. Just tools that work.</p>
      </div>
    </section>
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

import { ICONS as IC } from '~/utils/icons'

const searchQuery = ref('')

const filteredCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return CATEGORIES
  return CATEGORIES
    .map(cat => ({ ...cat, tools: cat.tools.filter(t => t.name.toLowerCase().includes(q)) }))
    .filter(cat => cat.tools.length > 0)
})

const { getRecent } = useRecentTools()
const recentSlugs = ref<string[]>([])
onMounted(() => { recentSlugs.value = getRecent() })

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
      { name: 'UUID Generator',      to: '/tools/uuid',               icon: IC.uuid },
      { name: 'Password Generator',  to: '/tools/password-generator', icon: IC.pwdGen },
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
      { name: 'Color Picker', to: '/tools/color', icon: IC.color },
    ],
  },
]

const ALL_TOOLS = CATEGORIES.flatMap(cat => cat.tools)
const toolBySlug = Object.fromEntries(ALL_TOOLS.map(t => [t.to.replace('/tools/', ''), t]))
const recentTools = computed(() => recentSlugs.value.map(s => toolBySlug[s]).filter(Boolean))
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

/* ── Search ────────────────────────────────────────── */
.search-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 480px;
  padding: 0 14px;
  height: 44px;
  background: var(--c-card);
  border: 1.5px solid var(--c-border-m);
  border-radius: 10px;
  transition: border-color 0.15s;
}

.search-box:focus-within {
  border-color: rgba(249, 115, 22, 0.5);
}

.search-icon {
  color: var(--c-t4);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--c-t1);
  min-width: 0;
}

.search-input::placeholder { color: var(--c-t5); }

.search-input::-webkit-search-cancel-button { display: none; }

.search-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--c-t4);
  flex-shrink: 0;
  transition: color 0.15s;
}

.search-clear:hover { color: var(--c-t1); }

.search-empty {
  text-align: center;
  font-size: 14px;
  color: var(--c-t4);
  padding: 48px 0;
}

.search-empty strong { color: var(--c-t2); font-weight: 500; }

/* ── Recently used ─────────────────────────────────── */
.recent-section {
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--c-border);
}

.recent-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-t5);
  margin-bottom: 10px;
}

.recent-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.recent-card {
  flex: 0 0 auto;
  min-width: 0;
}

/* ── Category list ─────────────────────────────────── */
.cat-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 40px;
  row-gap: 0;
}

.cat {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 0 24px;
  align-items: start;
  padding: 28px 0;
  border-top: 1px solid var(--c-border);
}

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
  grid-template-columns: 1fr;
  gap: 6px;
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

/* ── Features ──────────────────────────────────────── */
.features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.feature {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  border: 1px solid var(--c-border);
  border-radius: 12px;
}

.feature-icon {
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

.feature-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--c-t1);
  letter-spacing: -0.01em;
}

.feature-body {
  font-size: 13px;
  color: var(--c-t3);
  line-height: 1.65;
}

/* ── Responsive ────────────────────────────────────── */
@media (max-width: 768px) {
  .home { padding: 0 16px 40px; }
  .hero { padding: 36px 0 32px; }
  .hero-sub { font-size: 14px; }

  .cat-list { grid-template-columns: 1fr; column-gap: 0; }

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

  .tool-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tool-name { font-size: 12px; }

  .features { grid-template-columns: 1fr; }
}
</style>
