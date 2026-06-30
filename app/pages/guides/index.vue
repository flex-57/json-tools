<template>
  <div class="guides-page">

    <!-- Breadcrumb -->
    <nav class="guide-breadcrumb" aria-label="Breadcrumb">
      <NuxtLink to="/" class="bc-link">JSON Tools</NuxtLink>
      <span class="bc-sep" aria-hidden="true">›</span>
      <span class="bc-current">Guides</span>
    </nav>

    <!-- Hero -->
    <header class="guides-hero">
      <h1 class="guides-title">Developer Guides</h1>
      <p class="guides-subtitle">In-depth explanations of JSON, encoding, security, and developer tools — from fundamentals to practical patterns.</p>
    </header>

    <!-- Grid -->
    <div class="guides-grid">
      <NuxtLink
        v-for="guide in guides"
        :key="guide.slug"
        :to="`/guides/${guide.slug}`"
        class="guide-card"
      >
        <div class="guide-card-body">
          <h2 class="guide-card-title">{{ guide.title }}</h2>
          <p class="guide-card-subtitle">{{ guide.subtitle }}</p>
        </div>
        <div class="guide-card-footer">
          <span class="guide-card-time">{{ guide.readTime }}</span>
          <span class="guide-card-arrow">→</span>
        </div>
      </NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import { GUIDES } from '~/data/guides'

const guides = Object.values(GUIDES)

const BASE_URL = 'https://jsontools.space'

useSeoMeta({
  title:           'Developer Guides — JSON Tools',
  description:     'In-depth guides on JSON, JWT, Base64, regex, cron expressions, YAML, and Markdown — practical explanations for developers.',
  ogTitle:         'Developer Guides — JSON Tools',
  ogDescription:   'In-depth guides on JSON, JWT, Base64, regex, cron expressions, YAML, and Markdown.',
  ogImage:         `${BASE_URL}/og/og-image.png`,
  twitterCard:     'summary_large_image',
  twitterImage:    `${BASE_URL}/og/og-image.png`,
})

useHead({
  script: [
    {
      key: 'schema-breadcrumb',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type':    'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'JSON Tools', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Guides',     item: `${BASE_URL}/guides` },
        ],
      }),
    },
    {
      key: 'schema-collection',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context':   'https://schema.org',
        '@type':      'CollectionPage',
        name:         'Developer Guides',
        description:  'In-depth explanations of JSON, JWT, Base64, regex, cron, and Markdown for developers.',
        url:          `${BASE_URL}/guides`,
        hasPart: guides.map(g => ({
          '@type': 'Article',
          name:    g.title,
          url:     `${BASE_URL}/guides/${g.slug}`,
        })),
      }),
    },
  ],
})
</script>

<style scoped>
.guides-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 80px;
}

/* ── Breadcrumb ─────────────────────────────────────────── */
.guide-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 40px;
}

.bc-link {
  font-size: 12.5px;
  color: var(--c-t4);
  text-decoration: none;
  transition: color 0.15s;
}
.bc-link:hover { color: #F97316; }
.bc-sep     { font-size: 12px; color: var(--c-t5); }
.bc-current { font-size: 12.5px; color: var(--c-t3); }

/* ── Hero ───────────────────────────────────────────────── */
.guides-hero {
  margin-bottom: 48px;
}

.guides-title {
  font-size: clamp(26px, 4vw, 38px);
  font-weight: 700;
  color: var(--c-t1);
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 12px;
}

.guides-subtitle {
  font-size: 15.5px;
  color: var(--c-t3);
  line-height: 1.65;
  max-width: 620px;
}

/* ── Grid ───────────────────────────────────────────────── */
.guides-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* ── Card ───────────────────────────────────────────────── */
.guide-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  padding: 24px;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  text-decoration: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  min-height: 160px;
}

.guide-card:hover {
  border-color: #F97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.08);
}

.guide-card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-t1);
  letter-spacing: -0.02em;
  line-height: 1.3;
  margin-bottom: 10px;
}

.guide-card-subtitle {
  font-size: 13px;
  color: var(--c-t4);
  line-height: 1.65;
}

.guide-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.guide-card-time {
  font-size: 11.5px;
  color: var(--c-t5);
  font-family: 'JetBrains Mono', monospace;
}

.guide-card-arrow {
  font-size: 16px;
  color: var(--c-t5);
  transition: color 0.15s, transform 0.15s;
}
.guide-card:hover .guide-card-arrow {
  color: #F97316;
  transform: translateX(4px);
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 900px) {
  .guides-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .guides-page  { padding: 24px 16px 64px; }
  .guides-grid  { grid-template-columns: 1fr; }
  .guides-hero  { margin-bottom: 32px; }
}
</style>
