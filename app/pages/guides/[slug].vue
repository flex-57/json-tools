<template>
  <div class="guide-page">
    <div class="guide-inner">

      <!-- Breadcrumb -->
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/" class="bc-link">JSON Tools</NuxtLink>
        <span class="bc-sep" aria-hidden="true">›</span>
        <span class="bc-link">Guides</span>
        <span class="bc-sep" aria-hidden="true">›</span>
        <span class="bc-current">{{ guide.title }}</span>
      </nav>

      <!-- Hero -->
      <header class="guide-hero">
        <h1 class="guide-title">{{ guide.title }}</h1>
        <p class="guide-subtitle">{{ guide.subtitle }}</p>
        <div class="guide-meta">
          <span class="guide-meta-item">{{ guide.readTime }}</span>
          <span class="guide-meta-sep">·</span>
          <span class="guide-meta-item">Updated {{ formatDate(guide.dateModified) }}</span>
        </div>
      </header>

      <!-- Table of Contents (client-only, only for long articles) -->
      <ClientOnly>
        <nav v-if="tocItems.length >= 3" class="guide-toc" aria-label="Table of contents">
          <p class="toc-title">Contents</p>
          <ol class="toc-list">
            <li v-for="item in tocItems" :key="item.id">
              <a :href="'#' + item.id" class="toc-link" @click.prevent="scrollTo(item.id)">{{ item.title }}</a>
            </li>
          </ol>
        </nav>
      </ClientOnly>

      <!-- Body (per-guide content component) -->
      <component :is="BodyComponent" />

      <!-- Tool CTAs -->
      <div class="guide-tools">
        <p class="guide-tools-label">Try it now</p>
        <div class="guide-tool-cards">
          <NuxtLink
            v-for="tool in guide.tools"
            :key="tool.href"
            :to="tool.href"
            class="tool-card"
          >
            <div class="tool-card-icon" v-html="tool.icon" />
            <div>
              <div class="tool-card-name">{{ tool.name }}</div>
              <div class="tool-card-desc">{{ tool.desc }}</div>
            </div>
            <span class="tool-card-arrow">→</span>
          </NuxtLink>
        </div>
      </div>

      <!-- FAQ -->
      <section class="guide-faq" id="faq">
        <h2 class="guide-faq-title">Frequently asked questions</h2>
        <div class="faq-list">
          <div
            v-for="(item, i) in guide.faqs"
            :key="i"
            class="faq-item"
            :class="{ 'faq-item--open': openFaq === i }"
          >
            <button class="faq-q" @click="openFaq = openFaq === i ? null : i">
              {{ item.q }}
              <svg class="faq-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="openFaq === i" class="faq-a">
              <p v-for="(para, j) in item.a" :key="j">{{ para }}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { GUIDES } from '~/data/guides'
import WhatIsJwt              from '~/components/guides/body/what-is-jwt.vue'
import WhatIsBase64           from '~/components/guides/body/what-is-base64.vue'
import CronExpressionExamples from '~/components/guides/body/cron-expression-examples.vue'
import JsonVsYaml             from '~/components/guides/body/json-vs-yaml.vue'
import HowToValidateJson     from '~/components/guides/body/how-to-validate-json.vue'
import WhatIsRegex           from '~/components/guides/body/what-is-regex.vue'
import WhatIsJson            from '~/components/guides/body/what-is-json.vue'

const bodyComponents: Record<string, Component> = {
  'what-is-jwt':              WhatIsJwt,
  'what-is-base64':           WhatIsBase64,
  'cron-expression-examples': CronExpressionExamples,
  'json-vs-yaml':             JsonVsYaml,
  'how-to-validate-json':     HowToValidateJson,
  'what-is-regex':            WhatIsRegex,
  'what-is-json':             WhatIsJson,
}

const route = useRoute()
const slug  = route.params.slug as string
const guide = GUIDES[slug]

if (!guide) {
  throw createError({ statusCode: 404, statusMessage: 'Guide not found' })
}

const BodyComponent = bodyComponents[slug]
const openFaq = ref<number | null>(null)

const tocItems = ref<{ id: string; title: string }[]>([])

onMounted(() => {
  const bodyEl = document.querySelector('.guide-body')
  if (!bodyEl) return
  const headings = Array.from(bodyEl.querySelectorAll('h2'))
  tocItems.value = headings.map(h => {
    const title = h.textContent?.trim() || ''
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    h.id = id
    return { id, title }
  })
  tocItems.value.push({ id: 'faq', title: 'FAQ' })
})

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const offset = 80
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const BASE_URL = 'https://jsontools.space'
const pageUrl  = `${BASE_URL}/guides/${slug}`

const ogImage = `${BASE_URL}/og/guide-${slug}.png`

useSeoMeta({
  title:              `${guide.title} — JSON Tools`,
  description:        guide.description,
  ogTitle:            `${guide.title} — JSON Tools`,
  ogDescription:      guide.description,
  ogImage,
  twitterTitle:       guide.title,
  twitterDescription: guide.description,
  twitterImage:       ogImage,
  twitterCard:        'summary_large_image',
})

useHead({
  script: [
    {
      key: 'schema-article',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context':     'https://schema.org',
        '@type':        'Article',
        headline:       guide.title,
        description:    guide.description,
        url:            pageUrl,
        datePublished:  guide.datePublished,
        dateModified:   guide.dateModified,
        author:    { '@type': 'Organization', name: 'JSON Tools', url: BASE_URL },
        publisher: { '@type': 'Organization', name: 'JSON Tools', url: BASE_URL },
      }),
    },
    {
      key: 'schema-breadcrumb',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type':    'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'JSON Tools', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Guides',     item: `${BASE_URL}/guides` },
          { '@type': 'ListItem', position: 3, name: guide.title,  item: pageUrl },
        ],
      }),
    },
    {
      key: 'schema-faq',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type':    'FAQPage',
        mainEntity: guide.faqs.map(item => ({
          '@type': 'Question',
          name:    item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a.join(' ') },
        })),
      }),
    },
  ],
})
</script>

<style scoped>
.guide-page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 24px 80px;
}

.guide-inner {
  max-width: 760px;
  margin: 0 auto;
}

/* ── Breadcrumb ─────────────────────────────────────────── */
.guide-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 32px;
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
.guide-hero { margin-bottom: 48px; }

.guide-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 700;
  color: var(--c-t1);
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 14px;
}

.guide-subtitle {
  font-size: 16px;
  color: var(--c-t3);
  line-height: 1.65;
  margin-bottom: 16px;
}

.guide-meta { display: flex; align-items: center; gap: 8px; }
.guide-meta-item { font-size: 12.5px; color: var(--c-t4); }
.guide-meta-sep  { font-size: 12px; color: var(--c-t5); }

/* ── Table of Contents (fixed sidebar on desktop) ───────── */
.guide-toc {
  display: none;
}

@media (min-width: 1300px) {
  .guide-toc {
    display: block;
    position: fixed;
    left: calc(50% - 604px);
    top: 136px;
    width: 204px;
    background: var(--c-faint);
    border: 1px solid var(--c-border);
    border-radius: 10px;
    padding: 16px;
    z-index: 10;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
  }
}

.toc-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--c-t4);
  margin-bottom: 12px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  counter-reset: toc-counter;
}

.toc-list li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  counter-increment: toc-counter;
}

.toc-list li::before {
  content: counter(toc-counter);
  font-size: 11px;
  font-weight: 600;
  color: var(--c-t5);
  min-width: 14px;
  font-family: 'JetBrains Mono', monospace;
  flex-shrink: 0;
}

.toc-link {
  font-size: 13px;
  color: var(--c-t2);
  text-decoration: none;
  line-height: 1.4;
  transition: color 0.15s;
}

.toc-link:hover { color: #F97316; }

/* ── Tool CTA cards ─────────────────────────────────────── */
.guide-tools {
  margin-top: 56px;
  padding-top: 40px;
  border-top: 1px solid var(--c-border);
}

.guide-tools-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-t4);
  margin-bottom: 14px;
}

.guide-tool-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.tool-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  text-decoration: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.tool-card:hover {
  border-color: #F97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.08);
}

.tool-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #F97316;
  flex-shrink: 0;
  margin-top: 2px;
}

.tool-card-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--c-t1);
  margin-bottom: 5px;
}

.tool-card-desc {
  font-size: 12.5px;
  color: var(--c-t4);
  line-height: 1.6;
}

.tool-card-arrow {
  font-size: 16px;
  color: var(--c-t5);
  margin-left: auto;
  flex-shrink: 0;
  align-self: center;
  transition: color 0.15s, transform 0.15s;
}
.tool-card:hover .tool-card-arrow { color: #F97316; transform: translateX(3px); }

/* ── FAQ ────────────────────────────────────────────────── */
.guide-faq {
  margin-top: 56px;
  padding-top: 40px;
  border-top: 1px solid var(--c-border);
}

.guide-faq-title {
  font-size: 19px;
  font-weight: 700;
  color: var(--c-t1);
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

.faq-list {
  border: 1px solid var(--c-border);
  border-radius: 12px;
  overflow: hidden;
}

.faq-item { border-bottom: 1px solid var(--c-border); }
.faq-item:last-child { border-bottom: none; }

.faq-q {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--c-t1);
  transition: background 0.15s;
}
.faq-q:hover { background: rgba(249, 115, 22, 0.04); }
.faq-item--open .faq-q { color: #F97316; }

.faq-chevron {
  flex-shrink: 0;
  color: var(--c-t4);
  transition: transform 0.2s ease;
}
.faq-item--open .faq-chevron { transform: rotate(180deg); }

.faq-a { padding: 0 20px 18px; display: flex; flex-direction: column; gap: 10px; }
.faq-a p { font-size: 13.5px; color: var(--c-t3); line-height: 1.7; }

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 768px) {
  .guide-page  { padding: 24px 16px 64px; }
  .guide-hero  { margin-bottom: 36px; }
  .faq-q       { font-size: 13.5px; padding: 16px; }
  .faq-a       { padding: 0 16px 16px; }
}
</style>
