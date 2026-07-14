<template>
  <div class="home">
    <section class="hero">
      <div class="eyebrow"><span class="eyebrow-dot"></span>{{ TOOLS.length }} TOOLS · RUNS ENTIRELY IN YOUR BROWSER</div>
      <h1>The toolbench for devs who'd rather not open <span>twelve tabs</span>.</h1>
      <p>JSON, regex, cron, SQL, colors, hashes and more — paste, transform, copy. No account, no upload, nothing tracked.</p>
      <form class="hero-search" @submit.prevent>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.4"/><path d="M9.5 9.5L13 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        <input v-model="query" placeholder="Jump to a tool — formatter, base64, cron…" aria-label="Search developer tools" />
        <button v-if="query" type="button" class="hero-search-clear" @click="query = ''" aria-label="Clear search">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
      </form>
    </section>

    <section v-if="!query.trim() && recentTools.length" class="recent-section">
      <span class="recent-label">Recently Used</span>
      <div class="recent-row">
        <NuxtLink v-for="t in recentTools" :key="t.slug" :to="`/tools/${t.slug}`" class="recent-pill">
          <span class="recent-pill-icon" v-html="toolIcon(t.slug)"></span>
          <span class="recent-pill-name">{{ t.navLabel ?? t.name }}</span>
        </NuxtLink>
      </div>
    </section>

    <template v-for="(label, key) in CATEGORIES" :key="key">
      <section v-if="filtered(key).length" class="cat-section">
        <div class="cat-head">
          <div class="cat-icon" v-html="catIcon(key)"></div>
          <h2 class="cat-title">{{ label }}</h2>
          <span class="cat-count">— {{ filtered(key).length }} tool{{ filtered(key).length !== 1 ? 's' : '' }} —</span>
        </div>
        <div class="cat-grid">
          <NuxtLink v-for="t in filtered(key)" :key="t.slug" :to="`/tools/${t.slug}`" class="tool-card">
            <div class="tool-badge" v-html="toolIcon(t.slug)"></div>
            <div>
              <div class="tool-name">{{ t.navLabel ?? t.name }}</div>
              <div class="tool-desc">{{ t.short }}</div>
            </div>
          </NuxtLink>
        </div>
      </section>
    </template>

    <p v-if="!hasAnyResult" class="no-results">No tool matches "{{ query }}" — try a different keyword.</p>

    <section class="features">
      <div v-for="f in FEATURES" :key="f.title" class="feature-card">
        <div class="feature-icon" v-html="f.icon"></div>
        <h2 class="feature-title">{{ f.title }}</h2>
        <p class="feature-body">{{ f.body }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { CATEGORIES, TOOLS, toolsByCategory, toolMeta } from '~/data/tools'
import { ICONS } from '~/utils/icons'

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
})

const query = ref('')

function filtered(category: keyof typeof CATEGORIES) {
  const q = query.value.trim().toLowerCase()
  const tools = toolsByCategory(category)
  if (!q) return tools
  return tools.filter(t => t.name.toLowerCase().includes(q) || (t.navLabel ?? '').toLowerCase().includes(q) || t.short.toLowerCase().includes(q) || t.slug.includes(q))
}

const hasAnyResult = computed(() => !query.value.trim() || (Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[]).some(key => filtered(key).length > 0))

const TOOL_ICONS: Record<string, string> = {
  'json-formatter': ICONS.formatter, 'json-diff': ICONS.diff, 'json-tree': ICONS.tree,
  'csv-to-json': ICONS.csvIn, 'json-to-csv': ICONS.csvOut,
  'xml-to-json': ICONS.xmlIn, 'json-to-xml': ICONS.xmlOut,
  'yaml-to-json': ICONS.yamlIn, 'json-to-yaml': ICONS.yamlOut,
  'excel-to-json': ICONS.xlIn, 'json-to-excel': ICONS.xlOut,
  'json-to-ts': ICONS.ts, 'json-schema': ICONS.schema,
  'text-case': ICONS.textCase, 'minifier': ICONS.minifier, 'sql-formatter': ICONS.sql,
  'url-encode': ICONS.url, 'base64': ICONS.base64, 'markdown-preview': ICONS.markdown,
  'jwt-decoder': ICONS.jwtDec, 'jwt-generator': ICONS.jwtGen, 'hash': ICONS.hash,
  'uuid': ICONS.uuid, 'password-generator': ICONS.pwdGen,
  'regex-tester': ICONS.regex, 'cron-parser': ICONS.cron, 'unix-timestamp': ICONS.unix,
  'number-base': ICONS.numBase, 'color': ICONS.color, 'gradient': ICONS.gradient,
}
function toolIcon(slug: string) { return TOOL_ICONS[slug] ?? '' }

const CAT_ICONS: Record<keyof typeof CATEGORIES, string> = {
  json: ICONS.catJson, converters: ICONS.catConv, textcode: ICONS.catText, security: ICONS.catSec, devutils: ICONS.catDev,
}
function catIcon(key: keyof typeof CATEGORIES) { return CAT_ICONS[key] }

const FEATURES = [
  {
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 10H2M18 10h-2M10 4V2M10 18v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    title: 'Instant, no friction',
    body: 'Open any tool and start working right away. No signup screen, no setup wizard. Paste your data and watch it update as you type.',
  },
  {
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L3 5.5v5c0 4 3.1 7.4 7 8.5 3.9-1.1 7-4.5 7-8.5v-5L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 10l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    title: 'Your data stays yours',
    body: 'Everything runs in your browser tab. Your data never touches a server, and it never leaves your machine.',
  },
  {
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10h14M3 6h14M3 14h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    title: 'Free, all of it',
    body: `All ${TOOLS.length} tools are free, with no premium tier and no rate limits. We'd rather you bookmark the site than sign up for one.`,
  },
]

const { getRecent } = useRecentTools()
const recentSlugs = ref<string[]>([])
onMounted(() => { recentSlugs.value = getRecent() })

const recentTools = computed(() =>
  recentSlugs.value.map(s => toolMeta(s)).filter((t): t is NonNullable<typeof t> => !!t)
)
</script>

<style scoped>
.home { max-width: var(--container-w); margin: 0 auto; padding: 0 24px 60px; width: 100%; }

.hero { padding: 56px 0 40px; text-align: center; }
.eyebrow { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; color: var(--c-valid); letter-spacing: 0.1em; margin-bottom: 16px; }
.eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--c-valid); box-shadow: 0 0 6px rgb(var(--c-valid-rgb) / 0.6); flex-shrink: 0; }

.hero h1 {
  font-family: var(--font-display); font-weight: 800; font-size: clamp(30px, 5vw, 50px);
  line-height: 1.03; text-transform: uppercase; letter-spacing: 0.005em; max-width: 820px; margin: 0 auto; color: var(--c-t1);
}
.hero h1 span { color: var(--c-accent); }

.hero p { font-family: var(--font-body); font-size: 15px; color: var(--c-t3); max-width: 520px; margin: 20px auto 0; line-height: 1.6; }

.hero-search {
  margin: 28px auto 0; display: flex; align-items: center; gap: 10px; max-width: 440px;
  background: var(--c-subtle); border: 1px solid var(--c-border); border-radius: 10px; padding: 12px 16px; color: var(--c-t4);
}
.hero-search input { background: none; border: none; outline: none; color: var(--c-t1); font-family: var(--font-mono); font-size: 13px; flex: 1; text-align: left; }
.hero-search input::placeholder { color: var(--c-t5); }
.hero-search-clear { display: flex; color: var(--c-t4); background: none; border: none; cursor: pointer; }
.hero-search-clear:hover { color: var(--c-t1); }

.recent-section { padding: 24px 0 32px; }
.recent-label { display: block; font-family: var(--font-display); font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--c-t5); margin-bottom: 12px; }
.recent-row { display: flex; flex-wrap: wrap; gap: 8px; }
.recent-pill {
  display: flex; align-items: center; gap: 8px; padding: 8px 14px;
  background: var(--c-card); border: 1px solid var(--c-border); border-radius: 20px;
  text-decoration: none; transition: border-color 0.15s, transform 0.1s;
}
.recent-pill:hover { border-color: var(--c-accent); transform: translateY(-1px); }
.recent-pill-icon { display: flex; color: var(--c-t3); transition: color 0.15s; }
.recent-pill:hover .recent-pill-icon { color: var(--c-accent); }
.recent-pill-name { font-family: var(--font-mono); font-size: 12.5px; font-weight: 500; color: var(--c-t2); white-space: nowrap; transition: color 0.15s; }
.recent-pill:hover .recent-pill-name { color: var(--c-t1); }

.cat-section { padding: 0 0 8px; }
.cat-head { display: flex; align-items: center; gap: 12px; padding: 26px 0 14px; border-top: 1px solid var(--c-border); }
.cat-icon {
  width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0;
  background: rgb(var(--c-accent-rgb) / 0.1); border: 1px solid rgb(var(--c-accent-rgb) / 0.25); color: var(--c-accent);
  display: flex; align-items: center; justify-content: center;
}
.cat-title { margin: 0; font-family: var(--font-display); font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--c-t1); }
.cat-count { font-family: var(--font-mono); font-size: 11px; color: var(--c-t5); }

.cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding-bottom: 8px; }

.tool-card {
  background: var(--c-card); border: 1px solid var(--c-border); border-radius: 9px; padding: 14px;
  display: flex; gap: 12px; align-items: flex-start; text-decoration: none; transition: border-color 0.15s, transform 0.1s;
}
.tool-card:hover { border-color: var(--c-accent); transform: translateY(-1px); }

.tool-badge {
  width: 32px; height: 32px; border-radius: 6px; background: var(--c-subtle); border: 1px solid var(--c-border);
  display: flex; align-items: center; justify-content: center; color: var(--c-t3); flex-shrink: 0;
  transition: color 0.15s;
}
.tool-card:hover .tool-badge { color: var(--c-accent); }
.tool-name { font-family: var(--font-body); font-size: 12.5px; font-weight: 600; color: var(--c-t1); }
.tool-desc { font-family: var(--font-body); font-size: 11px; color: var(--c-t5); margin-top: 3px; line-height: 1.4; }

.no-results { padding: 40px 0; text-align: center; font-family: var(--font-mono); font-size: 13px; color: var(--c-t4); }

.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 32px 0 8px; margin-top: 8px; border-top: 1px solid var(--c-border); }
.feature-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: 9px; padding: 22px; }
.feature-icon {
  width: 36px; height: 36px; border-radius: 8px; margin-bottom: 14px;
  background: rgb(var(--c-accent-rgb) / 0.1); border: 1px solid rgb(var(--c-accent-rgb) / 0.25); color: var(--c-accent);
  display: flex; align-items: center; justify-content: center;
}
.feature-title { font-family: var(--font-display); font-weight: 700; text-transform: uppercase; letter-spacing: 0.01em; font-size: 14px; color: var(--c-t1); margin-bottom: 8px; }
.feature-body { font-family: var(--font-body); font-size: 13px; color: var(--c-t3); line-height: 1.75; }

@media (max-width: 900px) { .cat-grid { grid-template-columns: repeat(2, 1fr); } .features { grid-template-columns: 1fr; } }
@media (max-width: 560px) { .cat-grid { grid-template-columns: 1fr; } }
</style>
