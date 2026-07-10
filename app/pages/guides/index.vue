<template>
  <div class="page">
    <nav class="guide-breadcrumb" aria-label="Breadcrumb">
      <NuxtLink to="/" class="bc-link">JSON Tools</NuxtLink>
      <span class="bc-sep" aria-hidden="true">›</span>
      <span class="bc-current">Guides</span>
    </nav>

    <div class="page-header">
      <div>
        <h1 class="page-title">Developer Guides</h1>
        <p class="page-subtitle">In-depth explanations and quick references for JSON, encoding, security, and developer tools.</p>
      </div>
    </div>

    <form class="guide-search" @submit.prevent>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.4"/><path d="M9.5 9.5L13 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      <input v-model="query" placeholder="Search guides — JSON, hash, regex, entropy…" aria-label="Search guides" />
      <button v-if="query" type="button" class="guide-search-clear" @click="query = ''" aria-label="Clear search">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
    </form>

    <p v-if="!hasAnyResult" class="no-results">No guide matches "{{ query }}" — try a different keyword.</p>

    <div v-for="group in groups" :key="group.key" class="cat-section">
      <div class="cat-head">
        <div class="cat-icon" v-html="group.icon"></div>
        <h2 class="cat-title">{{ group.label }}</h2>
        <span class="cat-count">{{ group.guides.length }}</span>
      </div>

      <div class="guide-list">
        <NuxtLink v-for="guide in group.guides" :key="guide.slug" :to="`/guides/${guide.slug}`" class="guide-row">
          <div class="guide-row-main">
            <div class="guide-row-title-line">
              <span class="guide-row-title">{{ guide.title }}</span>
              <span v-if="guide.type === 'reference'" class="ref-pill">Ref</span>
            </div>
            <p class="guide-row-desc">{{ guide.subtitle }}</p>
          </div>
          <div class="guide-row-meta">
            <span class="guide-row-time">{{ guide.readTime }}</span>
            <span class="guide-row-arrow">→</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GUIDES, GUIDE_CATEGORY_LABELS, type GuideCategory } from '~/data/guides'
import { CATEGORIES } from '~/data/tools'
import { ICONS } from '~/utils/icons'

const allGuides = Object.values(GUIDES)

const CAT_ICONS: Record<GuideCategory, string> = {
  json: ICONS.catJson, converters: ICONS.catConv, textcode: ICONS.catText, security: ICONS.catSec, devutils: ICONS.catDev,
}

const query = ref('')

function guidesForCategory(key: GuideCategory) {
  const q = query.value.trim().toLowerCase()
  const inCategory = allGuides.filter(g => g.category === key)
  if (!q) return inCategory
  return inCategory.filter(g => g.title.toLowerCase().includes(q) || g.subtitle.toLowerCase().includes(q) || g.slug.includes(q))
}

const groups = computed(() => (Object.keys(CATEGORIES) as GuideCategory[])
  .map(key => ({
    key,
    label: GUIDE_CATEGORY_LABELS[key],
    icon: CAT_ICONS[key],
    guides: guidesForCategory(key),
  }))
  .filter(group => group.guides.length > 0))

const hasAnyResult = computed(() => !query.value.trim() || groups.value.length > 0)

const BASE_URL = 'https://jsontools.space'

useSeoMeta({
  title: 'Developer Guides & Reference — JSON Tools',
  description: 'Concept guides and quick references for JSON, JWT, Base64, regex, cron, Markdown, YAML and more.',
  ogTitle: 'Developer Guides & Reference — JSON Tools',
  ogDescription: 'Concept guides and quick references for JSON, JWT, Base64, regex, cron, Markdown, YAML and more.',
  ogImage: `${BASE_URL}/og/og-image.png`,
  twitterCard: 'summary_large_image',
  twitterImage: `${BASE_URL}/og/og-image.png`,
})

useHead({
  script: [
    {
      key: 'schema-breadcrumb',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'JSON Tools', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${BASE_URL}/guides` },
        ],
      }),
    },
    {
      key: 'schema-collection',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Developer Guides & Reference',
        description: 'Concept guides and quick references for JSON, JWT, Base64, regex, cron, Markdown, YAML and more.',
        url: `${BASE_URL}/guides`,
        hasPart: allGuides.map(g => ({
          '@type': 'Article',
          name: g.title,
          url: `${BASE_URL}/guides/${g.slug}`,
        })),
      }),
    },
  ],
})
</script>

<style scoped>
.guide-breadcrumb { display: flex; align-items: center; gap: 6px; margin-bottom: 20px; }
.bc-link { font-family: var(--font-body); font-size: 12.5px; color: var(--c-t4); text-decoration: none; transition: color 0.15s; }
.bc-link:hover { color: var(--c-accent); }
.bc-sep { font-size: 12px; color: var(--c-t5); }
.bc-current { font-family: var(--font-body); font-size: 12.5px; color: var(--c-t3); }

.guide-search {
  margin: 20px 0 8px; display: flex; align-items: center; gap: 10px; max-width: 440px;
  background: var(--c-subtle); border: 1px solid var(--c-border); border-radius: 10px; padding: 12px 16px; color: var(--c-t4);
}
.guide-search input { background: none; border: none; outline: none; color: var(--c-t1); font-family: var(--font-mono); font-size: 13px; flex: 1; text-align: left; }
.guide-search input::placeholder { color: var(--c-t5); }
.guide-search-clear { display: flex; color: var(--c-t4); background: none; border: none; cursor: pointer; }
.guide-search-clear:hover { color: var(--c-t1); }

.no-results { padding: 24px 0; font-family: var(--font-mono); font-size: 13px; color: var(--c-t4); }

.cat-section { padding: 0 0 8px; }
.cat-head { display: flex; align-items: center; gap: 12px; padding: 26px 0 14px; border-top: 1px solid var(--c-border); }
.cat-section:first-child .cat-head { border-top: none; padding-top: 0; }
.cat-icon {
  width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0;
  background: rgb(var(--c-accent-rgb) / 0.1); border: 1px solid rgb(var(--c-accent-rgb) / 0.25); color: var(--c-accent);
  display: flex; align-items: center; justify-content: center;
}
.cat-title { margin: 0; font-family: var(--font-display); font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--c-t1); }
.cat-count { font-family: var(--font-mono); font-size: 11px; color: var(--c-t5); }

.guide-list { display: flex; flex-direction: column; }

.guide-row {
  display: flex; align-items: flex-end; justify-content: space-between; gap: 40px;
  padding: 14px 2px; border-bottom: 1px solid var(--c-border-s);
  text-decoration: none; transition: background 0.12s;
}
.guide-list .guide-row:last-child { border-bottom: none; }
.guide-row:hover { background: rgb(var(--c-accent-rgb) / 0.04); }

.guide-row-main { min-width: 0; flex: 1; }
.guide-row-title-line { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.guide-row-title { font-family: var(--font-body); font-size: 14.5px; font-weight: 700; color: var(--c-t1); letter-spacing: -0.01em; }
.ref-pill {
  font-family: var(--font-mono); font-size: 9.5px; font-weight: 600; letter-spacing: 0.04em;
  color: var(--c-t4); background: var(--c-subtle); border: 1px solid var(--c-border-m);
  border-radius: 20px; padding: 1px 7px; text-transform: uppercase;
}
.guide-row-desc { font-family: var(--font-body); font-size: 12.5px; color: var(--c-t4); line-height: 1.6; margin: 0; }

.guide-row-meta { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.guide-row-time { font-family: var(--font-mono); font-size: 11px; color: var(--c-t5); white-space: nowrap; }
.guide-row-arrow { font-size: 15px; color: var(--c-t5); transition: color 0.15s, transform 0.15s; }
.guide-row:hover .guide-row-arrow { color: var(--c-accent); transform: translateX(4px); }

@media (max-width: 560px) {
  .guide-row { flex-direction: column; align-items: flex-start; gap: 6px; }
}
</style>
