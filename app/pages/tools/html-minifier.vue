<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">HTML <span class="title-amp">Minifier</span></h1>
        <p class="page-subtitle">Collapse whitespace and minify embedded CSS/JS instantly. Client-side, nothing is sent to a server.</p>
        <NuxtLink to="/guides/what-is-minification" class="guide-link">What is minification? Read our guide →</NuxtLink>
      </div>
      <MinifierSwitch active="html" />
    </div>

    <Transition name="fade">
      <ErrorBanner
        v-if="error"
        :message="error"
        :line="errorLine"
        :column="errorColumn"
        @jump="errorLine && inputEditorRef?.scrollToLine(errorLine)"
      />
      <!-- Non-blocking: the document still minified fine overall, just one or
           more embedded <script> blocks failed and were left as-is — no
           line/column here since terser's position is relative to that block's
           own content, not this document, so a "jump to line" would mislead. -->
      <ErrorBanner v-else-if="warning" :message="warning" />
    </Transition>

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--drag': isDragging, 'pane--invalid': error }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <div class="pane-label-group">
            <span class="pane-label">Source HTML</span>
            <span class="hint">paste or type · or drop a .html file</span>
          </div>
          <div class="card-actions">
            <label class="btn-xs" for="html-minifier-file-input">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M2 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Browse
            </label>
            <input id="html-minifier-file-input" type="file" accept=".html,text/html" class="file-input" @change="onFileInput" >
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor ref="inputEditorRef" v-model="input" lang="html" :error-line="errorLine" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="midcol">
        <span class="mid-arrow" :class="{ spinner: loading }">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">Minified</span>
          <div class="card-actions">
            <span v-if="result && !error" class="savings-badge">-{{ result.savings }}%</span>
            <button class="btn-xs" :disabled="!output" @click="download">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" :class="{ 'pane-body--empty': !output }" :style="output ? 'padding: 0;' : ''" aria-live="polite">
          <Transition name="reveal" mode="out-in">
            <p v-if="!output" key="empty" class="pane-body-placeholder">{{ input.trim() ? 'Fix the error in your input to see minified output' : 'Minified output will appear here…' }}</p>
            <div v-else key="output" class="pane-body-editor-wrap">
              <ClientOnly>
                <JsonEditor :model-value="output" lang="html" :readonly="true" :line-wrap="true" />
                <template #fallback><EditorSkeleton /></template>
              </ClientOnly>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <StatusBar>
      <span>
        <span class="led" :class="result && !error ? 'valid' : (error ? 'error' : 'neutral')"/>
        <template v-if="result && !error && result.originalSize > 0">{{ fmtBytes(result.originalSize) }} → {{ fmtBytes(result.minifiedSize) }} · <strong style="color: var(--c-valid);">{{ result.savings }}% saved</strong> · {{ fmtBytes(result.originalSize - result.minifiedSize) }} removed<template v-if="warning"> · <span class="status-warn">see warning above</span></template></template>
        <template v-else>{{ error ? `Invalid${errorLine ? ` · Line ${errorLine}, Column ${errorColumn}` : ''}` : 'Waiting for input' }}</template>
      </span>
      <span>powered by html-minifier-terser</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['html-minifier']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHtmlMinifier } from '~/composables/useMinifier'
import { fmtBytes } from '~/utils/download'
import JsonEditor from '~/components/JsonEditor.vue'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'HTML Minifier: Compress HTML Online Free',
  'Minify HTML instantly in your browser. Collapses inter-element whitespace, strips comments, and minifies embedded CSS and JavaScript too. Free, no data sent to servers.',
  TOOL_FAQS['html-minifier'],
)

const { input, output, error, errorLine, errorColumn, warning, loading, copied, result, copy, download, clear } = useHtmlMinifier()
useUrlInput(input)

const inputEditorRef = ref<InstanceType<typeof JsonEditor> | null>(null)

function loadFile(file: File) {
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}

const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) loadFile(file)
}

function onFileInput(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) loadFile(file)
  target.value = ''
}

const seoCards = [
  {
    title: 'Why minify HTML?',
    text: 'HTML minification collapses the whitespace between tags that templating engines and hand-written markup tend to accumulate, strips comments, and removes redundant attributes (type="text/javascript" on a <script> tag, for example). The savings are smaller than CSS or JS, since most of an HTML document is content, not syntax, but it still trims a real amount off every response.',
    table: [
      { label: 'Typical', value: 'Shrinks 10-20%' },
      { label: 'Removes', value: 'Inter-tag whitespace, comments, redundant attributes' },
      { label: 'Bonus', value: 'Embedded <style> and <script> blocks are minified too' },
    ],
  },
  {
    title: 'How this minifier works',
    text: [
      'This tool runs html-minifier-terser in your browser. Beyond collapsing whitespace and stripping comments, it recursively minifies any inline <style> and <script> blocks it finds, using the same CSS and JS minification engines this site\'s other minifiers use.',
      'That recursive step is the main reason to reach for a dedicated HTML minifier instead of a generic whitespace stripper: a hand-rolled regex will not touch the CSS or JS sitting inside a <style> or <script> tag, but this one does.',
    ],
  },
  {
    title: 'Before deploying minified HTML',
    text: [
      'Keep the unminified source in version control, collapsed HTML is unpleasant to read or diff. Minifying is a build step, not something you edit by hand.',
      'Server-side templating and static site generators (Next.js, Astro, Eleventy, Jekyll) typically minify HTML output automatically in production mode. Use this tool for a quick check on a static snippet or exported page; wire minification into the build for anything larger.',
    ],
  },
]
</script>

<style scoped>
.file-input { display: none; }
.status-warn { color: var(--c-error); }
.savings-badge {
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  padding: 2px 7px; border-radius: 20px;
  background: rgb(var(--c-valid-rgb) / 0.1); color: var(--c-valid);
  border: 1px solid rgb(var(--c-valid-rgb) / 0.3);
}
</style>
