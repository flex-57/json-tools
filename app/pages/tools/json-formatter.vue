<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-amp">Formatter</span></h1>
        <p class="page-subtitle">Format, validate, and minify JSON instantly. Free, no data sent to servers.</p>
        <NuxtLink to="/guides/how-to-validate-json" class="guide-link">Common JSON errors and how to fix them →</NuxtLink>
        <NuxtLink to="/guides/what-is-json" class="guide-link">New to JSON? Read our guide →</NuxtLink>
      </div>
      <div class="option-wrap">
        <label class="option-label">Indent</label>
        <select v-model="indentValue" class="option-select">
          <option :value="2">2 spaces</option>
          <option :value="4">4 spaces</option>
          <option value="	">Tabs</option>
        </select>
      </div>
    </div>

    <div class="dualpane">
      <div class="pane" :class="{ 'pane--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <span class="pane-label">Input</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .json file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor v-model="input" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="midcol">
        <button class="mid-btn" title="Format (Ctrl + Enter)" @click="format">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h10M2 7h6M2 11h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <span>FMT</span>
        </button>
        <button class="mid-btn" title="Minify" @click="minify">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M5 4l-3 3 3 3M9 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>MIN</span>
        </button>
        <button class="mid-btn" title="Validate" @click="validate">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>VAL</span>
        </button>
      </div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">Output</span>
          <div class="card-actions">
            <button class="btn-xs" @click="download" :disabled="!output">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1.5v7.5M4 6.5L7 9.5 10 6.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11.5h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              Download
            </button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" @click="copy" :disabled="!output">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor v-model="output" :readonly="true" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <div class="statusbar">
      <span>
        <span class="led" :class="isValid ? 'valid' : 'error'"></span>
        {{ isValid ? 'Valid' : (error || 'Waiting for input') }} · {{ lineCount }} lines · {{ charCount }} chars
      </span>
      <span>json-formatter</span>
    </div>

    <SeoSection :cards="cards" />
  </div>
</template>

<script setup lang="ts">
import { useJsonFormatter } from '~/composables/useJsonFormatter'

useToolSeo(
  'JSON Formatter & Validator: Beautify & Validate JSON Online',
  'Format, validate, and minify JSON instantly. Free online JSON formatter with syntax highlighting. No data sent to servers.',
)

const { input, output, error, isValid, indent, copied, format, minify, validate, copy, download, clear } = useJsonFormatter()
useToolShortcut(format)
useUrlInput(input, format)

const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}

const indentValue = computed({
  get: () => indent.value,
  set: (v) => { indent.value = v as 2 | 4 | '\t' },
})

const lineCount = computed(() => {
  const text = output.value || input.value
  return text ? text.split('\n').length : 0
})
const charCount = computed(() => (output.value || input.value)?.length ?? 0)

const cards = [
  {
    title: 'What is a JSON Formatter?',
    text: 'A JSON formatter takes raw, unindented or minified JSON and outputs it in a human-readable structure with consistent indentation. It makes deeply nested objects and arrays easy to read at a glance, which helps most when working with API responses or config files.',
  },
  {
    title: 'JSON Validation explained',
    text: 'Valid JSON must follow strict syntax rules: keys must be quoted strings, values can be strings, numbers, booleans, null, arrays or objects. A single missing comma or trailing comma breaks the whole document. The validator pinpoints the exact error so you can fix it immediately.',
  },
  {
    title: 'Minify JSON for production',
    text: 'Minifying removes all unnecessary whitespace, reducing payload size for API responses and config files. A 10 KB formatted JSON typically compresses to under 4 KB, a meaningful saving at scale. All processing happens in your browser; your data never leaves your machine.',
  },
]
</script>
