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
      <p class="guides-subtitle">In-depth explanations and quick references for JSON, encoding, security, and developer tools.</p>
    </header>

    <!-- Guides section -->
    <section class="guides-section">
      <div class="section-header">
        <h2 class="section-title">Guides</h2>
        <p class="section-desc">Concept articles — understand how it works.</p>
      </div>
      <div class="guides-grid">
        <NuxtLink
          v-for="guide in guidesList"
          :key="guide.slug"
          :to="`/guides/${guide.slug}`"
          class="guide-card"
        >
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

    <!-- Reference section -->
    <section class="guides-section">
      <div class="section-header">
        <h2 class="section-title">Reference</h2>
        <p class="section-desc">Cheatsheets, examples, and comparisons — look it up while you code.</p>
      </div>
      <div class="guides-grid">
        <NuxtLink
          v-for="guide in referenceList"
          :key="guide.slug"
          :to="`/guides/${guide.slug}`"
          class="guide-card"
        >
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

const allGuides   = Object.values(GUIDES)
const guidesList  = allGuides.filter(g => g.type === 'guide')
const referenceList = allGuides.filter(g => g.type === 'reference')

const BASE_URL = 'https://jsontools.space'

useSeoMeta({
  title:           'Developer Guides & References — JSON Tools',
  description:     'Concept guides and quick references for JSON, JWT, Base64, regex, cron, Markdown, YAML and more.',
  ogTitle:         'Developer Guides & References — JSON Tools',
  ogDescription:   'Concept guides and quick references for JSON, JWT, Base64, regex, cron, Markdown, YAML and more.',
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
        '@context':  'https://schema.org',
        '@type':     'CollectionPage',
        name:        'Developer Guides & References',
        description: 'Concept guides and quick references for JSON, JWT, Base64, regex, cron, Markdown, YAML and more.',
        url:         `${BASE_URL}/guides`,
        hasPart: allGuides.map(g => ({
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
.bc-link:hover { color: var(--c-brand); }
.bc-sep     { font-size: 12px; color: var(--c-t5); }
.bc-current { font-size: 12.5px; color: var(--c-t3); }

/* ── Hero ───────────────────────────────────────────────── */
.guides-hero {
  margin-bottom: 56px;
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
  max-width: 580px;
}

/* ── Section ────────────────────────────────────────────── */
.guides-section {
  margin-bottom: 56px;
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--c-border);
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--c-t3);
}

.section-desc {
  font-size: 13px;
  color: var(--c-t5);
}

/* ── Grid ───────────────────────────────────────────────── */
.guides-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

/* ── Card ───────────────────────────────────────────────── */
.guide-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  padding: 22px;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  text-decoration: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  min-height: 150px;
}

.guide-card:hover {
  border-color: var(--c-brand);
  box-shadow: 0 0 0 3px rgb(var(--c-brand-rgb) / 0.08);
}

.guide-card-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-t1);
  letter-spacing: -0.02em;
  line-height: 1.3;
  margin-bottom: 8px;
}

.guide-card-subtitle {
  font-size: 12.5px;
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
  font-size: 15px;
  color: var(--c-t5);
  transition: color 0.15s, transform 0.15s;
}
.guide-card:hover .guide-card-arrow {
  color: var(--c-brand);
  transform: translateX(4px);
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 900px) {
  .guides-grid       { grid-template-columns: repeat(2, 1fr); }
  .section-header    { flex-direction: column; gap: 4px; }
}

@media (max-width: 560px) {
  .guides-page  { padding: 24px 16px 64px; }
  .guides-grid  { grid-template-columns: 1fr; }
  .guides-hero  { margin-bottom: 36px; }
}
</style>
