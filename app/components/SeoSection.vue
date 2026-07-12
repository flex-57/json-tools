<template>
  <section class="about">
    <div class="about-grid">
      <div v-for="card in cards" :key="card.title" class="about-card">
        <h2 class="about-title">{{ card.title }}</h2>
        <p class="about-text">{{ card.text }}</p>
      </div>
    </div>
    <div v-if="relatedTools.length" class="related-row">
      <span class="related-label">Related tools</span>
      <NuxtLink v-for="r in relatedTools" :key="r.to" :to="r.to" class="related-link">
        {{ r.label }}
      </NuxtLink>
    </div>
    <div v-if="relatedGuides.length" class="related-row">
      <span class="related-label">Related guides</span>
      <NuxtLink v-for="r in relatedGuides" :key="r.to" :to="r.to" class="related-link">
        {{ r.label }}
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { toolMeta } from '~/data/tools'
import { GUIDES } from '~/data/guides'

interface RelatedTool { label: string; to: string }

const props = defineProps<{
  cards: { title: string; text: string }[]
  related?: RelatedTool[]
}>()

const route = useRoute()

// Only the route is hand-picked here — the display label is always derived
// from tools.ts / guides.ts below, so it can never drift from the tool's
// real name or the guide's real title again.
const AUTO_RELATED: Record<string, string[]> = {
  '/tools/json-formatter': ['/tools/json-diff', '/tools/json-tree', '/guides/json-best-practices'],
  '/tools/csv-to-json':    ['/tools/json-to-csv', '/tools/excel-to-json', '/tools/json-formatter', '/guides/what-is-csv'],
  '/tools/json-to-csv':    ['/tools/csv-to-json', '/tools/json-to-excel', '/tools/json-formatter', '/guides/what-is-csv'],
  '/tools/xml-to-json':    ['/tools/json-to-xml', '/guides/what-is-xml', '/tools/yaml-to-json'],
  '/tools/json-to-xml':    ['/tools/xml-to-json', '/guides/what-is-xml', '/tools/json-to-yaml'],
  '/tools/yaml-to-json':   ['/tools/json-to-yaml', '/guides/what-is-yaml', '/guides/json-vs-yaml'],
  '/tools/json-to-yaml':   ['/tools/yaml-to-json', '/guides/what-is-yaml', '/guides/json-vs-yaml'],
  '/tools/excel-to-json':  ['/tools/json-to-excel', '/tools/csv-to-json', '/tools/json-formatter'],
  '/tools/json-to-excel':  ['/tools/excel-to-json', '/tools/json-to-csv', '/tools/json-formatter'],
  '/tools/json-diff':      ['/tools/json-formatter', '/tools/json-tree', '/tools/json-schema'],
  '/tools/json-tree':      ['/tools/json-formatter', '/tools/json-diff', '/tools/json-to-ts'],
  '/tools/json-to-ts':     ['/tools/json-schema', '/tools/json-formatter', '/tools/json-diff'],
  '/tools/json-schema':    ['/guides/what-is-json-schema', '/tools/json-to-ts', '/tools/json-formatter'],
  '/tools/base64':         ['/tools/url-encode', '/guides/what-is-base64', '/tools/jwt-decoder', '/guides/encoding-vs-encryption-vs-hashing'],
  '/tools/url-encode':     ['/guides/what-is-url-encoding', '/tools/base64', '/tools/jwt-decoder'],
  '/tools/jwt-decoder':    ['/tools/jwt-generator', '/guides/what-is-jwt', '/tools/base64'],
  '/tools/regex-tester':   ['/guides/regex-cheatsheet', '/guides/what-is-regex', '/tools/cron-parser'],
  '/tools/cron-parser':    ['/tools/unix-timestamp', '/guides/cron-expression-examples', '/tools/regex-tester'],
  '/tools/unix-timestamp': ['/tools/cron-parser', '/tools/regex-tester', '/guides/what-is-unix-timestamp'],
  '/tools/hash':           ['/guides/what-is-hash', '/tools/uuid', '/tools/base64', '/guides/encoding-vs-encryption-vs-hashing'],
  '/tools/uuid':                ['/guides/what-is-uuid', '/tools/hash', '/tools/password-generator'],
  '/tools/password-generator': ['/tools/hash', '/tools/uuid', '/tools/jwt-generator', '/guides/password-entropy-explained'],
  '/tools/minifier':       ['/tools/json-formatter', '/tools/base64'],
  '/tools/sql-formatter':  ['/tools/minifier', '/tools/json-formatter', '/tools/regex-tester', '/guides/sql-cheatsheet'],
  '/tools/text-case':          ['/tools/url-encode', '/tools/minifier', '/tools/regex-tester'],
  '/tools/markdown-preview':   ['/guides/what-is-markdown', '/guides/markdown-cheatsheet', '/tools/text-case'],
  '/tools/number-base':    ['/tools/hash', '/tools/jwt-decoder', '/tools/url-encode', '/guides/understanding-number-bases'],
  '/tools/color':          ['/tools/gradient', '/tools/number-base', '/tools/uuid', '/guides/understanding-color-formats'],
  '/tools/gradient':       ['/tools/color', '/tools/number-base', '/guides/understanding-color-formats'],
  '/tools/jwt-generator':  ['/tools/jwt-decoder', '/guides/what-is-jwt', '/tools/hash'],
}

function labelFor(to: string): string {
  if (to.startsWith('/tools/')) {
    const meta = toolMeta(to.replace('/tools/', ''))
    if (!meta) return to
    // navLabel containing '↔' represents a merged nav/footer/home entry that
    // covers BOTH directions of a converter pair — wrong here, since a related
    // link always points to one specific page. Fall back to the plain,
    // direction-specific name in that case (e.g. "CSV → JSON", not "CSV ↔ JSON").
    return meta.navLabel && !meta.navLabel.includes('↔') ? meta.navLabel : meta.name
  }
  if (to.startsWith('/guides/')) {
    return GUIDES[to.replace('/guides/', '')]?.title ?? to
  }
  return to
}

// Strips a trailing slash (but not the root "/") so a stray trailing slash
// in the URL can't silently make AUTO_RELATED miss the current route.
const currentPath = computed(() => route.path.length > 1 ? route.path.replace(/\/$/, '') : route.path)

const displayRelated = computed<RelatedTool[]>(() =>
  props.related ?? (AUTO_RELATED[currentPath.value] ?? []).map(to => ({ to, label: labelFor(to) }))
)
const relatedTools = computed(() => displayRelated.value.filter(r => r.to.startsWith('/tools/')))
const relatedGuides = computed(() => displayRelated.value.filter(r => r.to.startsWith('/guides/')))
</script>

<style scoped>
.about { margin-top: 8px; padding-bottom: 8px; font-family: var(--font-body); }
.about-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.about-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius-card); padding: 20px 22px; }
.about-title { font-family: var(--font-display); font-weight: 700; text-transform: uppercase; letter-spacing: 0.01em; font-size: 14px; color: var(--c-t1); margin-bottom: 10px; }
.about-text { font-size: 13px; color: var(--c-t3); line-height: 1.75; }

.related-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
  padding: 0 2px;
}

.related-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--c-t5);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-right: 2px;
  flex-shrink: 0;
}

.related-link {
  font-size: 12px;
  font-weight: 500;
  color: var(--c-t3);
  text-decoration: none;
  padding: 3px 11px;
  border-radius: 20px;
  border: 1px solid var(--c-border);
  background: var(--c-card);
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

.related-link:hover {
  color: var(--c-accent);
  border-color: rgb(var(--c-accent-rgb) / 0.35);
  background: rgb(var(--c-accent-rgb) / 0.06);
}

@media (max-width: 900px) { .about-grid { grid-template-columns: 1fr; } }
</style>
