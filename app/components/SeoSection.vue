<template>
  <section class="about">
    <div class="about-grid">
      <div v-for="card in cards" :key="card.title" class="about-card">
        <h2 class="about-title">{{ card.title }}</h2>
        <p class="about-text">{{ card.text }}</p>
      </div>
    </div>
    <div v-if="displayRelated.length" class="related-row">
      <span class="related-label">Related tools</span>
      <NuxtLink v-for="r in displayRelated" :key="r.to" :to="r.to" class="related-link">
        {{ r.label }}
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
interface RelatedTool { label: string; to: string }

const props = defineProps<{
  cards: { title: string; text: string }[]
  related?: RelatedTool[]
}>()

const route = useRoute()

const AUTO_RELATED: Record<string, RelatedTool[]> = {
  '/tools/csv-to-json':    [{ label: 'JSON → CSV', to: '/tools/json-to-csv' }, { label: 'Excel → JSON', to: '/tools/excel-to-json' }, { label: 'JSON Formatter', to: '/' }],
  '/tools/json-to-csv':    [{ label: 'CSV → JSON', to: '/tools/csv-to-json' }, { label: 'JSON → Excel', to: '/tools/json-to-excel' }, { label: 'JSON Formatter', to: '/' }],
  '/tools/xml-to-json':    [{ label: 'JSON → XML', to: '/tools/json-to-xml' }, { label: 'YAML → JSON', to: '/tools/yaml-to-json' }, { label: 'JSON Formatter', to: '/' }],
  '/tools/json-to-xml':    [{ label: 'XML → JSON', to: '/tools/xml-to-json' }, { label: 'JSON → YAML', to: '/tools/json-to-yaml' }, { label: 'JSON Formatter', to: '/' }],
  '/tools/yaml-to-json':   [{ label: 'JSON → YAML', to: '/tools/json-to-yaml' }, { label: 'XML → JSON', to: '/tools/xml-to-json' }, { label: 'JSON Formatter', to: '/' }],
  '/tools/json-to-yaml':   [{ label: 'YAML → JSON', to: '/tools/yaml-to-json' }, { label: 'JSON → XML', to: '/tools/json-to-xml' }, { label: 'JSON Formatter', to: '/' }],
  '/tools/excel-to-json':  [{ label: 'JSON → Excel', to: '/tools/json-to-excel' }, { label: 'CSV → JSON', to: '/tools/csv-to-json' }, { label: 'JSON Formatter', to: '/' }],
  '/tools/json-to-excel':  [{ label: 'Excel → JSON', to: '/tools/excel-to-json' }, { label: 'JSON → CSV', to: '/tools/json-to-csv' }, { label: 'JSON Formatter', to: '/' }],
  '/tools/json-diff':      [{ label: 'JSON Formatter', to: '/' }, { label: 'JSON Tree', to: '/tools/json-tree' }, { label: 'JSON → Schema', to: '/tools/json-schema' }],
  '/tools/json-tree':      [{ label: 'JSON Formatter', to: '/' }, { label: 'JSON Diff', to: '/tools/json-diff' }, { label: 'JSON → TypeScript', to: '/tools/json-to-ts' }],
  '/tools/json-to-ts':     [{ label: 'JSON → Schema', to: '/tools/json-schema' }, { label: 'JSON Formatter', to: '/' }, { label: 'JSON Diff', to: '/tools/json-diff' }],
  '/tools/json-schema':    [{ label: 'JSON → TypeScript', to: '/tools/json-to-ts' }, { label: 'JSON Formatter', to: '/' }, { label: 'JSON Diff', to: '/tools/json-diff' }],
  '/tools/base64':         [{ label: 'URL Encode / Decode', to: '/tools/url-encode' }, { label: 'JWT Decoder', to: '/tools/jwt-decoder' }],
  '/tools/url-encode':     [{ label: 'Base64', to: '/tools/base64' }, { label: 'JWT Decoder', to: '/tools/jwt-decoder' }],
  '/tools/jwt-decoder':    [{ label: 'Base64', to: '/tools/base64' }, { label: 'URL Encode / Decode', to: '/tools/url-encode' }, { label: 'JSON Formatter', to: '/' }],
  '/tools/regex-tester':   [{ label: 'Cron Parser', to: '/tools/cron-parser' }, { label: 'URL Encode / Decode', to: '/tools/url-encode' }],
  '/tools/cron-parser':    [{ label: 'Unix Timestamp', to: '/tools/unix-timestamp' }, { label: 'Regex Tester', to: '/tools/regex-tester' }],
  '/tools/unix-timestamp': [{ label: 'Cron Parser', to: '/tools/cron-parser' }, { label: 'Regex Tester', to: '/tools/regex-tester' }],
  '/tools/hash':           [{ label: 'UUID Generator', to: '/tools/uuid' }, { label: 'Base64', to: '/tools/base64' }],
  '/tools/uuid':           [{ label: 'Hash Generator', to: '/tools/hash' }],
  '/tools/minifier':       [{ label: 'JSON Formatter', to: '/' }, { label: 'Base64', to: '/tools/base64' }],
  '/tools/sql-formatter':  [{ label: 'Minifier', to: '/tools/minifier' }, { label: 'JSON Formatter', to: '/' }, { label: 'Regex Tester', to: '/tools/regex-tester' }],
  '/tools/text-case':      [{ label: 'URL Encode / Decode', to: '/tools/url-encode' }, { label: 'Minifier', to: '/tools/minifier' }, { label: 'Regex Tester', to: '/tools/regex-tester' }],
  '/tools/number-base':    [{ label: 'Hash Generator', to: '/tools/hash' }, { label: 'JWT Decoder', to: '/tools/jwt-decoder' }, { label: 'URL Encode / Decode', to: '/tools/url-encode' }],
}

const displayRelated = computed(() => props.related ?? AUTO_RELATED[route.path] ?? [])

useHead(() => ({
  script: [{
    key: 'schema-faq',
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: props.cards.map(card => ({
        '@type': 'Question',
        name: card.title,
        acceptedAnswer: { '@type': 'Answer', text: card.text },
      })),
    }),
  }],
}))
</script>

<style scoped>
.about { margin-top: 8px; padding-bottom: 8px; }
.about-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.about-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: 14px; padding: 20px 22px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
.about-title { font-size: 14px; font-weight: 600; color: var(--c-t1); margin-bottom: 10px; }
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
  font-size: 11.5px;
  font-weight: 600;
  color: var(--c-t5);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-right: 2px;
  flex-shrink: 0;
}

.related-link {
  font-size: 12.5px;
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
  color: #F97316;
  border-color: rgba(249, 115, 22, 0.35);
  background: rgba(249, 115, 22, 0.05);
}

@media (max-width: 900px) { .about-grid { grid-template-columns: 1fr; } }
</style>
