<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> CSV</h1>
        <p class="page-subtitle">Convert a JSON array to CSV format — paste or drop a .json file.</p>
      </div>
      <ToolSwitch
        from-path="/tools/csv-to-json"
        to-path="/tools/json-to-csv"
        from-label="CSV → JSON"
        to-label="JSON → CSV"
      />
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <button @click="convert" class="btn btn-primary">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Convert <span class="kb">Ctrl ↵</span>
        </button>
        <button @click="downloadCsv" class="btn btn-secondary" :disabled="!output">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v7M4 6l3 3 3-3M2 11h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Download
        </button>
      </div>
      <div class="toolbar-right" aria-live="polite">
        <Transition name="status">
          <div v-if="rowCount > 0" class="status-pill status-pill--valid">
            <span class="status-dot" />
            <span>{{ rowCount }} row{{ rowCount > 1 ? 's' : '' }} converted</span>
          </div>
          <div v-else-if="error && error !== 'empty'" class="status-pill status-pill--invalid">
            <span class="status-dot" />
            <span class="status-text">{{ error }}</span>
          </div>
        </Transition>
        <div class="option-wrap">
          <label class="option-label">Separator</label>
          <select v-model="delimiter" class="option-select">
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="	">Tab</option>
          </select>
        </div>
      </div>
    </div>

    <div class="editors">
      <div class="editor-card" :class="{ 'editor-card--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="editor-card-header">
          <span class="editor-label">JSON Input</span>
          <div class="card-actions">
            <span class="editor-hint">Array of objects · or drop a .json file</span>
            <button class="btn-xs" @click="clear">Clear</button>
          </div>
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
          <span class="editor-label">CSV Output</span>
          <div class="card-actions">
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" @click="copy" :disabled="!output">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="editor-body">
          <textarea v-model="output" readonly class="editor-textarea editor-textarea--readonly" spellcheck="false" />
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJsonToCsv } from '~/composables/useCsvJson'

useToolSeo(
  'JSON to CSV Converter — Export JSON Arrays to CSV Free',
  'Convert JSON arrays to CSV format instantly. Free online JSON to CSV converter, no data sent to servers.',
)

const { input, output, error, rowCount, delimiter, copied, convert, copy, downloadCsv, clear } = useJsonToCsv()
useToolShortcut(convert)
useUrlInput(input, convert)

const seoCards = [
  {
    title: 'When JSON data needs to become a spreadsheet',
    text: 'REST APIs return JSON, but analysts, PMs, and clients want CSV they can open in Excel or Google Sheets. Converting JSON to CSV bridges that gap instantly — no Python script, no pandas, no ETL pipeline. It\'s particularly useful for API responses that return flat arrays of records, which map naturally to CSV rows.',
  },
  {
    title: 'How column headers are derived',
    text: 'The converter scans the first object in the array and uses its keys as column headers. Every subsequent object is flattened to match. If your JSON array contains objects with different keys, you\'ll see empty cells where a key was absent — which is the correct, lossless representation in CSV. Nested objects are not supported; flatten them first if needed.',
  },
  {
    title: 'Use cases: reporting, exports, data handoff',
    text: 'Product teams export API data to CSV to build pivot tables without engineering help. Data analysts pull JSON from internal tools and drop it into BI platforms that require CSV import. Developers generate CSV fixtures from seed data for database migrations. All conversion happens in your browser — nothing is sent to a server.',
  },
]
const isDragging = ref(false)

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    input.value = ev.target?.result as string
    convert()
  }
  reader.readAsText(file)
}
</script>
