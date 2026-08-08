<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Open Graph <span class="title-amp">Meta Tag</span> Generator</h1>
        <p class="page-subtitle">Build og: and twitter: meta tags with a live preview. Free, no signup, nothing sent to a server.</p>
        <NuxtLink to="/guides/what-is-open-graph" class="guide-link">What is Open Graph? Read our guide →</NuxtLink>
      </div>
    </div>

    <div class="editor-card import-card">
      <div class="editor-card-header">
        <span class="editor-label">Import existing tags</span>
        <button class="btn-xs" :disabled="!importText.trim()" @click="doImport">Import into form</button>
      </div>
      <textarea v-model="importText" class="import-textarea" placeholder="Paste an existing <meta property=&quot;og:...&quot;> / <meta name=&quot;twitter:...&quot;> block here to pre-fill the form below…" spellcheck="false" rows="2" />
    </div>

    <div class="editor-card">
      <div class="og-form">
        <div class="field-row">
          <label class="field-label" for="og-title">Title</label>
          <div class="field-input-wrap">
            <input id="og-title" v-model="title" class="field-input" spellcheck="false" >
            <span class="char-hint">{{ title.length }} chars</span>
          </div>
        </div>

        <div class="field-row">
          <label class="field-label" for="og-desc">Description</label>
          <div class="field-input-wrap">
            <textarea id="og-desc" v-model="description" class="field-input field-textarea" spellcheck="false" rows="2" />
            <span class="char-hint">{{ description.length }} chars</span>
          </div>
        </div>

        <div class="field-row">
          <label class="field-label" for="og-url">URL</label>
          <input id="og-url" v-model="url" class="field-input" spellcheck="false" placeholder="https://example.com/page" >
        </div>

        <div class="field-row">
          <label class="field-label" for="og-image">Image URL</label>
          <div class="field-input-wrap">
            <input id="og-image" v-model="imageUrl" class="field-input" spellcheck="false" placeholder="https://example.com/og.png" >
            <span class="char-hint">recommended 1200×630</span>
          </div>
        </div>

        <div class="field-row">
          <label class="field-label" for="og-sitename">Site name</label>
          <input id="og-sitename" v-model="siteName" class="field-input" spellcheck="false" >
        </div>

        <div class="field-row">
          <label class="field-label" for="og-type">Type</label>
          <select id="og-type" v-model="type" class="option-select">
            <option value="website">website</option>
            <option value="article">article</option>
            <option value="product">product</option>
            <option value="profile">profile</option>
          </select>
        </div>

        <div class="field-row">
          <label class="field-label" for="og-locale">Locale</label>
          <input id="og-locale" v-model="locale" class="field-input" spellcheck="false" placeholder="en_US" >
        </div>

        <div class="field-row">
          <label class="field-label" for="tw-card">X card type</label>
          <select id="tw-card" v-model="twitterCard" class="option-select">
            <option value="summary_large_image">summary_large_image</option>
            <option value="summary">summary</option>
          </select>
        </div>

        <div class="field-row">
          <label class="field-label" for="tw-site">X @site</label>
          <input id="tw-site" v-model="twitterSite" class="field-input" spellcheck="false" placeholder="@yourbrand (optional)" >
        </div>

        <div class="field-row">
          <label class="field-label" for="tw-creator">X @creator</label>
          <input id="tw-creator" v-model="twitterCreator" class="field-input" spellcheck="false" placeholder="@author (optional)" >
        </div>
      </div>
    </div>

    <div class="preview-section">
      <div class="preview-caption">
        <span>Approximate preview — actual rendering varies by platform and can change without notice.</span>
      </div>

      <div class="preview-cards">
        <div class="preview-col">
          <span class="preview-col-label">Open Graph card — Facebook, LinkedIn, Slack, Discord, X (large image)</span>
          <div class="og-card">
            <div class="og-card-image">
              <img v-if="imageUrl && !largeImgError" :src="imageUrl" alt="Open Graph preview image" referrerpolicy="no-referrer" @error="largeImgError = true" >
              <div v-else class="og-card-image-placeholder">{{ imageUrl ? 'Image not reachable' : 'No image set' }}</div>
            </div>
            <div class="og-card-body">
              <span class="og-card-domain">{{ domain }}</span>
              <span class="og-card-title">{{ title || 'Page title' }}</span>
              <span class="og-card-desc">{{ description || 'Page description' }}</span>
            </div>
          </div>
        </div>

        <div class="preview-col">
          <span class="preview-col-label">X (Twitter) small card — used only when card type is "summary"</span>
          <div class="og-card og-card--small">
            <div class="og-card-thumb">
              <img v-if="imageUrl && !smallImgError" :src="imageUrl" alt="X card preview image" referrerpolicy="no-referrer" @error="smallImgError = true" >
              <div v-else class="og-card-image-placeholder">{{ imageUrl ? '✕' : '—' }}</div>
            </div>
            <div class="og-card-body">
              <span class="og-card-title">{{ title || 'Page title' }}</span>
              <span class="og-card-desc">{{ description || 'Page description' }}</span>
              <span class="og-card-domain">{{ domain }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="editor-card output-card">
      <div class="editor-card-header">
        <span class="editor-label">Generated meta tags</span>
        <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
      </div>
      <pre class="meta-output" aria-live="polite">{{ output }}</pre>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useOgGenerator } from '~/composables/useOgGenerator'

useToolSeo(
  'Open Graph Meta Tag Generator: og: & twitter: Tags Online',
  'Generate Open Graph and Twitter Card meta tags with a live preview of the social share card. Paste existing tags to import them. Free, no data sent to servers.',
)

const {
  title, description, url, imageUrl, siteName, type, locale, twitterCard, twitterSite, twitterCreator,
  output, copied, copy, importFromHtml,
} = useOgGenerator()

const importText = ref('')
function doImport() {
  if (!importText.value.trim()) return
  importFromHtml(importText.value)
}

const largeImgError = ref(false)
const smallImgError = ref(false)
watch(imageUrl, () => { largeImgError.value = false; smallImgError.value = false })

const domain = computed(() => {
  if (!url.value.trim()) return 'example.com'
  try { return new URL(url.value).hostname } catch { return url.value }
})

const seoCards = [
  {
    title: 'The four required Open Graph tags',
    text: 'The Open Graph protocol (ogp.me) defines four required properties for any page: og:title, og:type, og:image, and og:url. Everything else, including og:description and og:site_name, is optional but strongly recommended for a good-looking share card.',
    table: [
      { label: 'og:title', value: 'The title shown in the card' },
      { label: 'og:type', value: 'website, article, product, profile…' },
      { label: 'og:image', value: 'Full absolute URL to the preview image' },
      { label: 'og:url', value: 'The canonical URL of the page' },
    ],
  },
  {
    title: 'Twitter/X falls back to Open Graph',
    text: [
      'X\'s crawler reads twitter: tags first, but falls back to the matching og: tag when a twitter: one is missing (twitter:title falls back to og:title, and so on). That\'s why this generator mirrors title, description, and image into both sets rather than asking for them twice.',
      'twitter:card controls the shape: summary_large_image shows a full-width image like Facebook and LinkedIn, summary shows a small square thumbnail next to the text instead.',
    ],
  },
  {
    title: 'Why the 1200×630 image size',
    text: 'A 1.91:1 image (1200×630 is the common concrete size) is the shape every major platform converged on for the large-image card: Facebook, X, LinkedIn, Slack, and Discord all crop or letterbox other ratios to fit it. Keep any text or logo inside the center of the image, since some platforms crop the edges differently.',
  },
]
</script>

<style scoped>
.import-card { margin-bottom: 14px; }
.import-textarea { width: 100%; padding: 12px 16px; font-family: var(--font-mono); font-size: 12px; color: var(--c-t2); background: transparent; border: none; outline: none; resize: vertical; line-height: 1.6; }
.import-textarea::placeholder { color: var(--c-t5); }

.og-form { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.field-row { display: flex; align-items: flex-start; gap: 14px; }
.field-label { width: 88px; flex-shrink: 0; padding-top: 8px; font-family: var(--font-body); font-size: 12px; font-weight: 600; color: var(--c-t3); }
.field-input-wrap { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.field-input { width: 100%; padding: 8px 10px; border: 1px solid var(--c-border); border-radius: 7px; background: var(--c-subtle); font-family: var(--font-mono); font-size: 13px; color: var(--c-t1); outline: none; transition: border-color 0.15s; }
.field-input:focus { border-color: var(--c-accent); }
.field-textarea { resize: vertical; line-height: 1.5; }
.char-hint { font-family: var(--font-mono); font-size: 10.5px; color: var(--c-t5); align-self: flex-end; }

.option-select { height: 34px; padding: 0 10px; border: 1px solid var(--c-border); border-radius: 7px; background: var(--c-subtle); font-family: var(--font-body); font-size: 13px; color: var(--c-t2); font-weight: 500; cursor: pointer; transition: border-color 0.15s; }
.option-select:focus { outline: none; border-color: var(--c-accent); }

.preview-section { margin-top: 20px; }
.preview-caption { font-family: var(--font-body); font-size: 12px; color: var(--c-t4); margin-bottom: 10px; }
.preview-cards { display: flex; gap: 16px; flex-wrap: wrap; }
.preview-col { flex: 1; min-width: 260px; display: flex; flex-direction: column; gap: 8px; }
.preview-col-label { font-family: var(--font-body); font-size: 11.5px; font-weight: 600; color: var(--c-t4); }

.og-card { border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden; background: var(--c-card); display: flex; flex-direction: column; }
.og-card-image { aspect-ratio: 1.91 / 1; background: var(--c-faint); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.og-card-image img { width: 100%; height: 100%; object-fit: cover; }
.og-card-image-placeholder { font-family: var(--font-body); font-size: 12px; color: var(--c-t5); padding: 8px; text-align: center; }
.og-card-body { padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.og-card-domain { font-family: var(--font-body); font-size: 11px; color: var(--c-t4); text-transform: uppercase; letter-spacing: 0.03em; }
.og-card-title { font-family: var(--font-body); font-size: 13.5px; font-weight: 700; color: var(--c-t1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.og-card-desc { font-family: var(--font-body); font-size: 12px; color: var(--c-t3); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.og-card--small { flex-direction: row; }
.og-card--small .og-card-thumb { width: 80px; height: 80px; flex-shrink: 0; background: var(--c-faint); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.og-card--small .og-card-thumb img { width: 100%; height: 100%; object-fit: cover; }
.og-card--small .og-card-body { flex: 1; min-width: 0; justify-content: center; }

.output-card { margin-top: 20px; }
.meta-output { padding: 16px; margin: 0; font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); white-space: pre-wrap; word-break: break-all; }

@media (max-width: 640px) {
  .field-row { flex-direction: column; gap: 4px; }
  .field-label { width: auto; padding-top: 0; }
}
</style>
