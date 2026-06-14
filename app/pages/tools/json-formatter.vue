<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title-wrap">
        <h1 class="page-title">JSON Formatter <span class="title-amp">&amp;</span> Validator</h1>
        <p class="page-subtitle">Format, validate, and minify JSON instantly — free, no data sent to servers.</p>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <button @click="format" class="btn btn-primary">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h10M2 7h6M2 11h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Format
        </button>
        <button @click="minify" class="btn btn-secondary">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M5 4l-3 3 3 3M9 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Minify
        </button>
        <button @click="validate" class="btn btn-secondary">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Validate
        </button>
        <div class="toolbar-sep" />
        <button @click="copy" class="btn btn-secondary" :class="{ 'btn--success': copied }">
          <svg v-if="!copied" width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
      <div class="toolbar-right">
        <Transition name="status">
          <div v-if="isValid !== null" :class="['status-pill', isValid ? 'status-pill--valid' : 'status-pill--invalid']">
            <span class="status-dot" />
            <span class="status-text">{{ isValid ? 'Valid JSON' : error }}</span>
          </div>
        </Transition>
        <div class="indent-wrap">
          <label class="indent-label">Indent</label>
          <select v-model="indentValue" class="indent-select">
            <option :value="2">2 spaces</option>
            <option :value="4">4 spaces</option>
            <option value="	">Tabs</option>
          </select>
        </div>
        <button @click="clear" class="btn btn-ghost">Clear</button>
      </div>
    </div>

    <div class="editors">
      <div class="editor-card">
        <div class="editor-card-header">
          <span class="editor-label">Input</span>
          <span class="editor-hint">Paste or type JSON</span>
        </div>
        <div class="editor-body">
          <ClientOnly>
            <JsonEditor v-model="input" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="editor-card editor-card--output">
        <div class="editor-card-header">
          <span class="editor-label">Output</span>
          <span class="editor-hint">Result appears here</span>
        </div>
        <div class="editor-body">
          <ClientOnly>
            <JsonEditor v-model="output" :readonly="true" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <SeoSection :cards="cards" />
  </div>
</template>

<script setup lang="ts">
import { useJsonFormatter } from '~/composables/useJsonFormatter'

useSeoMeta({
  title: 'JSON Formatter & Validator — Free Online Tool',
  description: 'Format, validate, and minify JSON instantly. Free online JSON formatter with syntax highlighting. No data sent to servers.',
  ogTitle: 'JSON Formatter & Validator — Free Online Tool',
  ogDescription: 'Format, validate, and minify JSON instantly. Free online JSON formatter with syntax highlighting. No data sent to servers.',
  twitterTitle: 'JSON Formatter & Validator — Free Online Tool',
  twitterDescription: 'Format, validate, and minify JSON instantly. Free online JSON formatter with syntax highlighting. No data sent to servers.',
  ogImage: 'https://jsontools.space/og/json-formatter.png',
  twitterImage: 'https://jsontools.space/og/json-formatter.png',
})

const { input, output, error, isValid, indent, copied, format, minify, validate, copy, clear } = useJsonFormatter()

const indentValue = computed({
  get: () => indent.value,
  set: (v) => { indent.value = v as 2 | 4 | '\t' },
})

const cards = [
  {
    title: 'What is a JSON Formatter?',
    text: 'A JSON formatter takes raw, unindented or minified JSON and outputs it in a human-readable structure with consistent indentation. It makes deeply nested objects and arrays easy to read at a glance — especially useful when working with API responses or config files.',
  },
  {
    title: 'JSON Validation explained',
    text: 'Valid JSON must follow strict syntax rules: keys must be quoted strings, values can be strings, numbers, booleans, null, arrays or objects. A single missing comma or trailing comma breaks the whole document. The validator pinpoints the exact error so you can fix it immediately.',
  },
  {
    title: 'Minify JSON for production',
    text: 'Minifying removes all unnecessary whitespace, reducing payload size for API responses and config files. A 10 KB formatted JSON typically compresses to under 4 KB — a meaningful saving at scale. All processing happens in your browser; your data never leaves your machine.',
  },
]
</script>

<style scoped>
.title-amp { font-style: italic; }

.indent-wrap  { display: flex; align-items: center; gap: 7px; }
.indent-label { font-size: 12.5px; color: var(--c-t4); font-weight: 500; }
.indent-select {
  appearance: none;
  background: var(--c-faint) url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239A9690' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 8px center;
  border: 1px solid var(--c-border-m);
  border-radius: 8px;
  padding: 5px 26px 5px 10px;
  font-size: 13px;
  font-family: inherit;
  color: var(--c-t2);
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s;
}
.indent-select:focus { outline: none; border-color: #F97316; }

.editor-body { flex-direction: column; }
</style>
