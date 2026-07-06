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

    <section class="guides-section">
      <div class="section-header">
        <h2 class="section-title">Guides</h2>
        <p class="section-desc">Concept articles — understand how it works.</p>
      </div>
      <div class="guides-grid">
        <NuxtLink v-for="guide in guidesList" :key="guide.slug" :to="`/guides/${guide.slug}`" class="guide-card">
          <div class="guide-card-body">
            <h3 class="guide-card-title">{{ guide.title }}</h3>
            <p class="guide-card-subtitle">{{ guide.subtitle }}</p>
          </div>
          <div class="guide-card-footer">
            <span class="guide-card-time">{{ guide.readTime }}</span>
            <span class="guide-card-arrow">→</span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="guides-section">
      <div class="section-header">
        <h2 class="section-title">Reference</h2>
        <p class="section-desc">Cheatsheets, examples, and comparisons — look it up while you code.</p>
      </div>
      <div class="guides-grid">
        <NuxtLink v-for="guide in referenceList" :key="guide.slug" :to="`/guides/${guide.slug}`" class="guide-card">
          <div class="guide-card-body">
            <h3 class="guide-card-title">{{ guide.title }}</h3>
            <p class="guide-card-subtitle">{{ guide.subtitle }}</p>
          </div>
          <div class="guide-card-footer">
            <span class="guide-card-time">{{ guide.readTime }}</span>
            <span class="guide-card-arrow">→</span>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { GUIDES } from '~/data/guides'

const allGuides = Object.values(GUIDES)
const guidesList = allGuides.filter(g => g.type === 'guide')
const referenceList = allGuides.filter(g => g.type === 'reference')

const BASE_URL = 'https://jsontools.space'

useSeoMeta({
  title: 'Developer Guides & References — JSON Tools',
  description: 'Concept guides and quick references for JSON, JWT, Base64, regex, cron, Markdown, YAML and more.',
  ogTitle: 'Developer Guides & References — JSON Tools',
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
        name: 'Developer Guides & References',
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

.guides-section { padding: 0 0 8px; }

.section-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 26px 0 14px;
  border-top: 1px solid var(--c-border);
}
.guides-section:first-child .section-header { border-top: none; padding-top: 0; }

.section-title {
  font-family: var(--font-display); font-weight: 700; font-size: 15px;
  text-transform: uppercase; letter-spacing: 0.05em; color: var(--c-t1);
}
.section-desc { font-family: var(--font-body); font-size: 12.5px; color: var(--c-t5); }

.guides-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding-bottom: 8px; }

.guide-card {
  display: flex; flex-direction: column; justify-content: space-between; gap: 20px;
  padding: 18px; min-height: 140px;
  background: var(--c-card); border: 1px solid var(--c-border); border-radius: 9px;
  text-decoration: none; transition: border-color 0.15s, transform 0.1s;
}
.guide-card:hover { border-color: var(--c-accent); transform: translateY(-1px); }

.guide-card-title { font-family: var(--font-body); font-size: 14.5px; font-weight: 700; color: var(--c-t1); letter-spacing: -0.01em; line-height: 1.3; margin-bottom: 8px; }
.guide-card-subtitle { font-family: var(--font-body); font-size: 12px; color: var(--c-t4); line-height: 1.6; }

.guide-card-footer { display: flex; align-items: center; justify-content: space-between; }
.guide-card-time { font-family: var(--font-mono); font-size: 11px; color: var(--c-t5); }
.guide-card-arrow { font-size: 15px; color: var(--c-t5); transition: color 0.15s, transform 0.15s; }
.guide-card:hover .guide-card-arrow { color: var(--c-accent); transform: translateX(4px); }

@media (max-width: 900px) { .guides-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .guides-grid { grid-template-columns: 1fr; } }
</style>
