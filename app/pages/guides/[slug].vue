<template>
  <div class="page">
    <div class="guide-page-inner">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/" class="bc-link">JSON Tools</NuxtLink>
        <span class="bc-sep" aria-hidden="true">›</span>
        <NuxtLink to="/guides" class="bc-link">Guides</NuxtLink>
        <span class="bc-sep" aria-hidden="true">›</span>
        <span class="bc-current">{{ guide.title }}</span>
      </nav>

      <div class="page-header">
        <div>
          <h1 class="page-title">{{ guide.title }}</h1>
          <p class="page-subtitle">{{ guide.subtitle }}</p>
          <div class="guide-meta">
            <span class="guide-meta-item">{{ guide.readTime }}</span>
            <span class="guide-meta-sep">·</span>
            <span class="guide-meta-item">Updated {{ formatDate(guide.dateModified) }}</span>
          </div>
        </div>
      </div>

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

      <component :is="BodyComponent" />

      <div class="guide-tools">
        <p class="guide-tools-label">Try it now</p>
        <div class="guide-tool-cards">
          <NuxtLink v-for="tool in guide.tools" :key="tool.href" :to="tool.href" class="guide-tool-card">
            <div class="guide-tool-card-icon" v-html="tool.icon" />
            <div>
              <div class="guide-tool-card-name">{{ tool.name }}</div>
              <div class="guide-tool-card-desc">{{ tool.desc }}</div>
            </div>
            <span class="guide-tool-card-arrow">→</span>
          </NuxtLink>
        </div>
      </div>

      <section class="guide-faq" id="faq">
        <h2 class="guide-faq-title">Frequently asked questions</h2>
        <div class="faq-list">
          <div v-for="(item, i) in guide.faqs" :key="i" class="faq-item" :class="{ 'faq-item--open': openFaq === i }">
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
import WhatIsJwt from '~/components/guides/body/what-is-jwt.vue'
import WhatIsBase64 from '~/components/guides/body/what-is-base64.vue'
import CronExpressionExamples from '~/components/guides/body/cron-expression-examples.vue'
import JsonVsYaml from '~/components/guides/body/json-vs-yaml.vue'
import HowToValidateJson from '~/components/guides/body/how-to-validate-json.vue'
import WhatIsRegex from '~/components/guides/body/what-is-regex.vue'
import WhatIsJson from '~/components/guides/body/what-is-json.vue'
import WhatIsMarkdown from '~/components/guides/body/what-is-markdown.vue'
import MarkdownCheatsheet from '~/components/guides/body/markdown-cheatsheet.vue'
import WhatIsUrlEncoding from '~/components/guides/body/what-is-url-encoding.vue'
import WhatIsHash from '~/components/guides/body/what-is-hash.vue'
import WhatIsXml from '~/components/guides/body/what-is-xml.vue'
import WhatIsUuid from '~/components/guides/body/what-is-uuid.vue'
import WhatIsJsonSchema from '~/components/guides/body/what-is-json-schema.vue'
import WhatIsYaml from '~/components/guides/body/what-is-yaml.vue'
import RegexCheatsheet from '~/components/guides/body/regex-cheatsheet.vue'
import JsonBestPractices from '~/components/guides/body/json-best-practices.vue'

const bodyComponents: Record<string, Component> = {
  'what-is-jwt': WhatIsJwt,
  'what-is-base64': WhatIsBase64,
  'cron-expression-examples': CronExpressionExamples,
  'json-vs-yaml': JsonVsYaml,
  'how-to-validate-json': HowToValidateJson,
  'what-is-regex': WhatIsRegex,
  'what-is-json': WhatIsJson,
  'what-is-markdown': WhatIsMarkdown,
  'markdown-cheatsheet': MarkdownCheatsheet,
  'what-is-url-encoding': WhatIsUrlEncoding,
  'what-is-hash': WhatIsHash,
  'what-is-xml': WhatIsXml,
  'what-is-uuid': WhatIsUuid,
  'what-is-json-schema': WhatIsJsonSchema,
  'what-is-yaml': WhatIsYaml,
  'regex-cheatsheet': RegexCheatsheet,
  'json-best-practices': JsonBestPractices,
}

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const guide = computed(() => GUIDES[slug.value])

if (!guide.value) {
  throw createError({ statusCode: 404, statusMessage: 'Guide not found' })
}

const BodyComponent = computed(() => bodyComponents[slug.value])
const openFaq = ref<number | null>(null)

const tocItems = ref<{ id: string; title: string }[]>([])

function buildToc() {
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
}

onMounted(buildToc)

// Vue Router reuses this component instance across /guides/:slug navigations
// (same route record) — setup() doesn't re-run, so per-guide state has to be
// refreshed explicitly when the slug changes rather than only once on mount.
watch(slug, () => {
  openFaq.value = null
  tocItems.value = []
  nextTick(buildToc)
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

useSeoMeta(() => {
  const title = `${guide.value.title} — JSON Tools`
  const ogImage = `${BASE_URL}/og/guide-${slug.value}.png`
  return {
    title,
    description: guide.value.description,
    ogTitle: title,
    ogDescription: guide.value.description,
    ogImage,
    twitterTitle: guide.value.title,
    twitterDescription: guide.value.description,
    twitterImage: ogImage,
    twitterCard: 'summary_large_image',
  }
})

useHead(() => {
  const pageUrl = `${BASE_URL}/guides/${slug.value}`
  return {
    script: [
      {
        key: 'schema-article',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guide.value.title,
          description: guide.value.description,
          url: pageUrl,
          datePublished: guide.value.datePublished,
          dateModified: guide.value.dateModified,
          author: { '@type': 'Organization', name: 'JSON Tools', url: BASE_URL },
          publisher: { '@type': 'Organization', name: 'JSON Tools', url: BASE_URL },
        }),
      },
      {
        key: 'schema-breadcrumb',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'JSON Tools', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Guides', item: `${BASE_URL}/guides` },
            { '@type': 'ListItem', position: 3, name: guide.value.title, item: pageUrl },
          ],
        }),
      },
      {
        key: 'schema-faq',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guide.value.faqs.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a.join(' ') },
          })),
        }),
      },
    ],
  }
})
</script>

<style scoped>
.guide-page-inner { max-width: 760px; margin: 0 auto; width: 100%; }

.guide-breadcrumb { display: flex; align-items: center; gap: 6px; margin-bottom: 20px; }
.bc-link { font-family: var(--font-body); font-size: 12.5px; color: var(--c-t4); text-decoration: none; transition: color 0.15s; }
.bc-link:hover { color: var(--c-accent); }
.bc-sep { font-size: 12px; color: var(--c-t5); }
.bc-current { font-family: var(--font-body); font-size: 12.5px; color: var(--c-t3); }

.guide-meta { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
.guide-meta-item { font-family: var(--font-body); font-size: 12.5px; color: var(--c-t4); }
.guide-meta-sep { font-size: 12px; color: var(--c-t5); }

.guide-toc { display: none; }
@media (min-width: 1300px) {
  .guide-toc {
    display: block; position: fixed; left: calc(50% - 604px); top: 136px; width: 204px;
    background: var(--c-subtle); border: 1px solid var(--c-border); border-radius: 10px; padding: 16px;
    z-index: 10; max-height: calc(100vh - 120px); overflow-y: auto;
  }
}
.toc-title { font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--c-t4); margin-bottom: 12px; }
.toc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; counter-reset: toc-counter; }
.toc-list li { display: flex; align-items: baseline; gap: 8px; counter-increment: toc-counter; }
.toc-list li::before { content: counter(toc-counter); font-family: var(--font-mono); font-size: 11px; font-weight: 600; color: var(--c-t5); min-width: 14px; flex-shrink: 0; }
.toc-link { font-family: var(--font-body); font-size: 13px; color: var(--c-t2); text-decoration: none; line-height: 1.4; transition: color 0.15s; }
.toc-link:hover { color: var(--c-accent); }

.guide-tools { margin-top: 40px; padding-top: 32px; border-top: 1px solid var(--c-border); }
.guide-tools-label { font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--c-t4); margin-bottom: 14px; }
.guide-tool-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }

.guide-tool-card {
  display: flex; align-items: flex-start; gap: 14px; padding: 16px;
  background: var(--c-card); border: 1px solid var(--c-border); border-radius: 9px;
  text-decoration: none; transition: border-color 0.15s, transform 0.1s;
}
.guide-tool-card:hover { border-color: var(--c-accent); transform: translateY(-1px); }
.guide-tool-card-icon { display: flex; align-items: center; justify-content: center; width: 16px; height: 16px; color: var(--c-accent); flex-shrink: 0; margin-top: 2px; }
.guide-tool-card-name { font-family: var(--font-body); font-size: 13.5px; font-weight: 700; color: var(--c-t1); margin-bottom: 4px; }
.guide-tool-card-desc { font-family: var(--font-body); font-size: 12px; color: var(--c-t4); line-height: 1.6; }
.guide-tool-card-arrow { font-size: 15px; color: var(--c-t5); margin-left: auto; flex-shrink: 0; align-self: center; transition: color 0.15s, transform 0.15s; }
.guide-tool-card:hover .guide-tool-card-arrow { color: var(--c-accent); transform: translateX(3px); }

.guide-faq { margin-top: 40px; padding-top: 32px; border-top: 1px solid var(--c-border); }
.guide-faq-title { font-family: var(--font-display); font-weight: 700; text-transform: uppercase; font-size: 18px; color: var(--c-t1); margin-bottom: 16px; }

.faq-list { display: flex; flex-direction: column; border: 1px solid var(--c-border); border-radius: 12px; overflow: hidden; }
.faq-item { border-bottom: 1px solid var(--c-border); }
.faq-item:last-child { border-bottom: none; }
.faq-q {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 16px 18px; background: var(--c-card); border: none; cursor: pointer; text-align: left;
  font-family: var(--font-body); font-size: 13.5px; font-weight: 600; color: var(--c-t1); transition: background 0.15s, color 0.15s;
}
.faq-q:hover { background: var(--c-subtle); }
.faq-item--open .faq-q { color: var(--c-accent); }
.faq-chevron { flex-shrink: 0; color: var(--c-t4); transition: transform 0.2s ease; }
.faq-item--open .faq-chevron { transform: rotate(180deg); color: var(--c-accent); }
.faq-a { padding: 0 18px 18px; background: var(--c-card); display: flex; flex-direction: column; gap: 10px; }
.faq-a p { font-family: var(--font-body); font-size: 13px; color: var(--c-t3); line-height: 1.7; }

@media (max-width: 768px) {
  .faq-q { font-size: 13px; padding: 14px; }
  .faq-a { padding: 0 14px 14px; }
}
</style>
