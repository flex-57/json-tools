<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ modeLabel }} <span class="title-amp">Minifier</span></h1>
        <p class="page-subtitle">Compress CSS, HTML, or JavaScript instantly. Client-side, nothing is sent to a server.</p>
      </div>
      <div class="mode-toggle" style="min-width: 210px;">
        <div class="mode-indicator" :style="{ width: 'calc((100% - 6px) / 3)', transform: indicatorTransform }"></div>
        <button v-for="m in MODES" :key="m.value" class="mode-btn" :class="{ 'mode-btn--active': mode === m.value }" @click="mode = m.value">{{ m.label }}</button>
      </div>
    </div>

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <span class="pane-label">Source Code</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .{{ mode }} file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor v-model="input" :lang="editorLang" :key="mode" />
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
            <button class="btn-xs" @click="download" :disabled="!output">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" @click="copy" :disabled="!output">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div v-if="error" class="pane-body" aria-live="polite">{{ error }}</div>
        <div v-else class="pane-body" style="padding: 0;" aria-live="polite">
          <ClientOnly>
            <JsonEditor :model-value="output" :lang="editorLang" :readonly="true" :line-wrap="true" :key="mode + '-out'" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <StatusBar v-if="result && !error && result.originalSize > 0">
      <span>{{ fmtBytes(result.originalSize) }} → {{ fmtBytes(result.minifiedSize) }} · <strong style="color: var(--c-valid);">{{ result.savings }}% saved</strong> · {{ fmtBytes(result.originalSize - result.minifiedSize) }} removed</span>
      <span>powered by {{ engineLabel }}</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useMinifier, type MinifyMode } from '~/composables/useMinifier'
import type { EditorLang } from '~/components/JsonEditor.vue'

useToolSeo(
  'CSS / HTML / JS Minifier: Compress Code Online Free',
  'Minify CSS, HTML, and JavaScript instantly in your browser. Remove whitespace, comments, and redundant code. Embedded CSS and JS inside HTML are minified too. Free, no data sent to servers.',
)

const MODES: { value: MinifyMode; label: string }[] = [
  { value: 'css',  label: 'CSS'  },
  { value: 'html', label: 'HTML' },
  { value: 'js',   label: 'JS'   },
]

const { input, mode, output, error, loading, copied, result, copy, download, clear } = useMinifier()
useUrlInput(input)

const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}

const modeLabel = computed(() => MODES.find(m => m.value === mode.value)?.label ?? 'CSS')

const editorLang = computed<EditorLang>(() => {
  if (mode.value === 'css')  return 'css'
  if (mode.value === 'html') return 'html'
  return 'javascript'
})

const engineLabel = computed(() => {
  if (mode.value === 'css')  return 'lightningcss'
  if (mode.value === 'html') return 'html-minifier-terser'
  return 'terser'
})

const indicatorTransform = computed(() => {
  const idx = MODES.findIndex(m => m.value === mode.value)
  if (idx === 0) return 'none'
  return `translateX(${idx * 100}%)`
})

function fmtBytes(n: number): string {
  if (n === 0) return '0 B'
  if (n < 1024) return n + ' B'
  return (n / 1024).toFixed(1) + ' KB'
}

const seoCards = [
  {
    title: 'Why minify your code?',
    text: 'Minification removes whitespace, comments, and redundant syntax from CSS, HTML, and JavaScript without changing behaviour. The result is smaller files that transfer faster over the network. A typical CSS file shrinks by 20-40%, HTML by 10-20%, and JavaScript by 30-60% with variable renaming. Faster transfers improve page load time, reduce bandwidth costs on servers and CDNs, and positively affect Core Web Vitals scores, especially LCP and FID. Minification is a standard step in every production build pipeline alongside bundling and compression (gzip/brotli).',
  },
  {
    title: 'CSS, HTML, and JS: how each is minified',
    text: 'CSS minification is powered by lightningcss, a Rust-based parser compiled to WebAssembly. It runs entirely in your browser and produces correct, spec-compliant output including nested selectors, custom properties, and modern syntax. HTML minification (html-minifier-terser) collapses inter-element whitespace, strips HTML comments, removes optional closing tags, and recursively minifies any embedded <style> and <script> blocks using the same CSS and JS engines. JavaScript minification (terser) parses the AST, removes dead code, inlines constants, renames local variables to single letters, and removes unreachable branches, achieving the highest compression ratios of the three.',
  },
  {
    title: 'Before deploying minified code',
    text: 'Always keep your original source files. Minified code is nearly impossible to debug or maintain. In production, generate source maps alongside your minified files so browser DevTools can map errors back to the original lines. Most build tools (Vite, webpack, Rollup, esbuild) handle minification and source maps automatically via their production mode. Use this tool for quick one-off checks, to understand how much a file compresses, or to minify standalone snippets. For full projects, integrate minification into your build pipeline rather than minifying manually.',
  },
]
</script>

<style scoped>
.savings-badge {
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  padding: 2px 7px; border-radius: 20px;
  background: rgb(var(--c-valid-rgb) / 0.1); color: var(--c-valid);
  border: 1px solid rgb(var(--c-valid-rgb) / 0.3);
}
</style>
