<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JavaScript <span class="title-amp">Minifier</span></h1>
        <p class="page-subtitle">Compress JS with variable mangling and dead-code elimination. Client-side, nothing is sent to a server.</p>
        <NuxtLink to="/guides/what-is-minification" class="guide-link">What is minification? Read our guide →</NuxtLink>
      </div>
      <MinifierSwitch active="js" />
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
            <span class="pane-label">Source JS</span>
            <span class="hint">paste or type · or drop a .js file</span>
          </div>
          <div class="card-actions">
            <label class="btn-xs" for="js-minifier-file-input">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M2 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Browse
            </label>
            <input id="js-minifier-file-input" type="file" accept=".js,text/javascript" class="file-input" @change="onFileInput" >
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor ref="inputEditorRef" v-model="input" lang="javascript" :error-line="errorLine" />
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
                <JsonEditor :model-value="output" lang="javascript" :readonly="true" :line-wrap="true" />
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
        <template v-else>{{ error ? `Invalid${errorLine ? ` · Line ${errorLine}, Column ${errorColumn}` : ''}` : 'Waiting for input' }}</template>
      </span>
      <span>powered by terser</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['js-minifier']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useJsMinifier } from '~/composables/useMinifier'
import { fmtBytes } from '~/utils/download'
import JsonEditor from '~/components/JsonEditor.vue'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'JavaScript Minifier: Compress & Mangle JS Online Free',
  'Minify JavaScript instantly in your browser with terser. Removes dead code, inlines constants, and renames local variables for the smallest possible output. Free, no data sent to servers.',
  TOOL_FAQS['js-minifier'],
)

const { input, output, error, errorLine, errorColumn, loading, copied, result, copy, download, clear } = useJsMinifier()
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
    title: 'Why minify JavaScript?',
    text: 'JavaScript compresses further than CSS or HTML because there is more to work with: local variable and function names can be shortened to a single letter without changing behavior, unreachable branches can be deleted outright, and constants can be inlined at their use site. That combination routinely cuts 30-60% off real-world code.',
    table: [
      { label: 'Typical', value: 'Shrinks 30-60%' },
      { label: 'Does', value: 'Mangles local names, strips dead code, inlines constants' },
      { label: 'Does not', value: 'Support TypeScript or JSX syntax — plain JS only' },
    ],
  },
  {
    title: 'How this minifier works',
    text: [
      'This tool runs terser in your browser. Unlike a whitespace-only minifier, terser parses your code into an AST (an actual syntax tree, not text), which is what lets it safely rename local variables, remove code paths that can never execute, and fold constant expressions.',
      'Because it needs a real, parseable AST, input must be plain JavaScript. TypeScript type annotations and JSX will fail to parse — strip them first (or run your build\'s transpile step) before pasting code in here.',
    ],
  },
  {
    title: 'Before deploying minified JS',
    text: [
      'Keep the original source under version control and generate a source map in your real build so browser DevTools can map a minified stack trace back to readable line numbers.',
      'Every major bundler (Vite, webpack, Rollup, esbuild) minifies JavaScript automatically in production mode, usually with terser or a similar tool under the hood. Use this page to check a single file or snippet quickly; let the bundler handle a full project.',
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
