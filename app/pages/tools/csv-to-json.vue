<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">CSV <span class="title-arrow">→</span> JSON</h1>
        <p class="page-subtitle">Convert CSV or TSV data to JSON. Paste text or drop a file.</p>
        <NuxtLink to="/guides/what-is-csv" class="guide-link">New to CSV? Read our guide →</NuxtLink>
      </div>
      <ToolSwitch from-path="/tools/csv-to-json" to-path="/tools/json-to-csv" from-label="CSV → JSON" to-label="JSON → CSV" />
    </div>

    <ErrorBanner v-if="error" :message="errorMessage" />

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--drag': isDragging, 'pane--invalid': error }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <span class="pane-label">CSV Input</span>
          <div class="card-actions">
            <div class="option-wrap">
              <label class="option-label">Sep</label>
              <select v-model="delimiter" class="option-select">
                <option value="auto">Auto</option>
                <option value=",">Comma</option>
                <option value=";">Semicolon</option>
                <option value="	">Tab</option>
              </select>
            </div>
            <label class="toggle-wrap">
              <input v-model="hasHeader" type="checkbox" class="toggle-input" >
              <span class="toggle-track"><span class="toggle-thumb" /></span>
              <span class="toggle-label">Headers</span>
            </label>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <textarea v-model="input" placeholder="name,age,city&#10;Alice,30,Paris&#10;Bob,25,Lyon" class="pane-textarea" style="padding: 14px 16px;" spellcheck="false" />
        </div>
      </div>

      <div class="midcol"><span class="mid-arrow"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">JSON Output</span>
          <div class="card-actions">
            <button class="btn-xs" :disabled="!output" @click="downloadJson">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" :class="{ 'pane-body--empty': !output }" :style="output ? 'padding: 0;' : ''" aria-live="polite">
          <template v-if="!output">{{ input.trim() ? 'Fix the error in your input to see JSON output' : 'Paste CSV to see JSON output' }}</template>
          <ClientOnly v-else>
            <JsonEditor v-model="output" :readonly="true" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <StatusBar>
      <span>
        <span class="led" :class="rowCount > 0 ? 'valid' : 'error'"/>
        {{ rowCount > 0 ? `${rowCount} row${rowCount > 1 ? 's' : ''} converted` : (error ? `Invalid${errorLine ? ` · around line ${errorLine}` : ''}` : 'Waiting for input') }}
      </span>
      <span>csv-to-json</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useCsvToJson } from '~/composables/useCsvJson'

useToolSeo(
  'CSV to JSON Converter Online: Instant, No Upload Required',
  'Convert CSV and TSV files to JSON instantly. Free online CSV to JSON converter, no data sent to servers.',
)

const { input, output, error, errorLine, rowCount, delimiter, hasHeader, copied, copy, downloadJson, clear } = useCsvToJson()
useUrlInput(input)

// CSV input is a plain <textarea>, not a CodeMirror JsonEditor — there's no
// line-highlight/jump target to wire up, so the approximate line (see
// useCsvJson.ts) is folded into the banner text instead of a clickable action.
const errorMessage = computed(() => error.value ? `${error.value}${errorLine.value ? ` (around line ${errorLine.value})` : ''}` : '')

const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}

const seoCards = [
  {
    title: 'What is CSV and when do you need JSON?',
    text: [
      'CSV (Comma-Separated Values) is the universal export format for spreadsheets, databases, and reporting tools. But modern APIs, JavaScript apps, and NoSQL databases speak JSON.',
      'Converting CSV to JSON lets you feed spreadsheet data directly into a fetch call, seed a database, or pass records to a charting library, all without writing a single line of parsing code.',
    ],
  },
  {
    title: 'How the converter handles your data',
    text: [
      'Paste your CSV or drop a file and the converter parses it in your browser. When "Headers" is enabled, the first row becomes the keys of each JSON object, the most common shape for API payloads.',
      'Auto-detect picks up commas, semicolons, and tabs automatically; switch it manually if your data uses an unusual delimiter or contains quoted fields with commas inside.',
    ],
  },
  {
    title: 'Common use cases',
    text: [
      'Data engineers use this to prototype ETL pipelines before writing code. Front-end developers convert exported Google Sheets data into JSON fixtures for mock APIs.',
      'QA teams transform test-case spreadsheets into structured input for automated test runners. Because everything runs locally, sensitive CSV exports (financial records, user data) never leave your browser.',
    ],
  },
]
</script>
