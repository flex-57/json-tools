<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">CSS <span class="title-amp">Minifier</span></h1>
        <p class="page-subtitle">Compress CSS instantly with lightningcss. Client-side, nothing is sent to a server.</p>
        <NuxtLink to="/guides/what-is-minification" class="guide-link">What is minification? Read our guide →</NuxtLink>
      </div>
      <MinifierSwitch active="css" />
    </div>

    <Transition name="fade">
      <ErrorBanner
        v-if="error"
        :message="error"
        :line="errorLine"
        :column="errorColumn"
        @jump="errorLine && inputEditorRef?.scrollToLine(errorLine)"
      />
    </Transition>

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--drag': isDragging, 'pane--invalid': error }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <div class="pane-label-group">
            <span class="pane-label">Source CSS</span>
            <span class="hint">paste or type · or drop a .css file</span>
          </div>
          <div class="card-actions">
            <label class="btn-xs" for="css-minifier-file-input">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M2 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Browse
            </label>
            <input id="css-minifier-file-input" type="file" accept=".css,text/css" class="file-input" @change="onFileInput" >
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor ref="inputEditorRef" v-model="input" lang="css" :error-line="errorLine" />
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
            <p v-if="!output" key="empty" class="pane-body-placeholder">{{ input.trim() ? 'Fix the error in your input to see minified output' : 'Paste CSS to see minified output' }}</p>
            <div v-else key="output" class="pane-body-editor-wrap">
              <ClientOnly>
                <JsonEditor :model-value="output" lang="css" :readonly="true" :line-wrap="true" />
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
        <template v-if="result && !error && result.originalSize > 0">{{ fmtBytes(result.originalSize) }} → {{ fmtBytes(result.minifiedSize) }} · <strong style="color: var(--c-valid);">{{ result.savings }}% saved</strong> · {{ fmtBytes(result.originalSize - result.minifiedSize) }} removed</template>
        <template v-else>{{ error ? `Invalid${errorLine ? ` · Line ${errorLine}` : ''}` : 'Waiting for input' }}</template>
      </span>
      <span>powered by lightningcss</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['css-minifier']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCssMinifier } from '~/composables/useMinifier'
import { fmtBytes } from '~/utils/download'
import JsonEditor from '~/components/JsonEditor.vue'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'CSS Minifier: Compress CSS Online Free',
  'Minify CSS instantly in your browser with lightningcss. Removes whitespace, comments, and redundant code while keeping nested selectors and custom properties intact. Free, no data sent to servers.',
  TOOL_FAQS['css-minifier'],
)

const { input, output, error, errorLine, errorColumn, loading, copied, result, copy, download, clear } = useCssMinifier()
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
    title: 'Why minify CSS?',
    text: 'Minification strips whitespace, comments, and redundant syntax without changing how a stylesheet behaves. Smaller CSS means a faster first paint, since the browser blocks rendering until it has parsed the stylesheet, a direct hit on Core Web Vitals like LCP. It is a standard step in every production build pipeline alongside bundling and gzip/brotli compression.',
    table: [
      { label: 'Typical', value: 'Shrinks 20-40%' },
      { label: 'Removes', value: 'Whitespace, comments, redundant units' },
      { label: 'Keeps', value: 'Nested selectors, custom properties, modern syntax' },
    ],
  },
  {
    title: 'How this minifier works',
    text: [
      'CSS minification here is powered by lightningcss, a Rust-based parser compiled to WebAssembly and run entirely in your browser tab. Because it is a real spec-compliant parser rather than a regex pass, it correctly handles nested selectors, CSS custom properties (variables), media queries, and modern syntax like container queries.',
      'That matters: a naive whitespace-stripping regex can silently break a stylesheet that uses calc(), custom properties, or nested rules. lightningcss produces valid output because it actually understands the grammar it is compressing.',
    ],
  },
  {
    title: 'Before deploying minified CSS',
    text: [
      'Always keep your original, unminified source files under version control. Minified CSS is nearly unreadable in DevTools without a source map.',
      'Most build tools (Vite, webpack, Rollup, Parcel) minify CSS automatically as part of their production build and can emit a source map alongside it. Use this tool for a quick one-off check or a snippet you are pasting somewhere; for a full project, let your build pipeline handle it.',
    ],
  },
]
</script>

<style scoped>
.file-input { display: none; }
.savings-badge {
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  padding: 2px 7px; border-radius: 20px;
  background: rgb(var(--c-valid-rgb) / 0.1); color: var(--c-valid);
  border: 1px solid rgb(var(--c-valid-rgb) / 0.3);
}
</style>
