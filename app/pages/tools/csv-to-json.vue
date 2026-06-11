<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">CSV <span class="title-arrow">→</span> JSON</h1>
        <p class="page-subtitle">Convert CSV or TSV data to JSON — paste text or drop a file.</p>
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
          Convert
        </button>
        <button @click="copy" class="btn btn-secondary" :class="{ 'btn--success': copied }">
          <svg v-if="!copied" width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ copied ? 'Copied!' : 'Copy JSON' }}
        </button>
        <button @click="downloadJson" class="btn btn-secondary" :disabled="!output">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v7M4 6l3 3 3-3M2 11h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Download
        </button>
        <button @click="clear" class="btn btn-ghost">Clear</button>
      </div>
      <div class="toolbar-right">
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
            <option value="auto">Auto-detect</option>
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="	">Tab</option>
          </select>
        </div>
        <label class="toggle-wrap">
          <input type="checkbox" v-model="hasHeader" class="toggle-input" />
          <span class="toggle-track"><span class="toggle-thumb" /></span>
          <span class="toggle-label">Headers</span>
        </label>
      </div>
    </div>

    <div class="editors">
      <div class="editor-card" :class="{ 'editor-card--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="editor-card-header">
          <span class="editor-label">CSV Input</span>
          <span class="editor-hint">or drop a .csv / .tsv file</span>
        </div>
        <div class="editor-body">
          <textarea v-model="input" placeholder="name,age,city&#10;Alice,30,Paris&#10;Bob,25,Lyon" class="editor-textarea" spellcheck="false" />
        </div>
      </div>

      <div class="editor-card editor-card--output">
        <div class="editor-card-header">
          <span class="editor-label">JSON Output</span>
          <span class="editor-hint">Result</span>
        </div>
        <div class="editor-body">
          <ClientOnly>
            <JsonEditor v-model="output" :readonly="true" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useCsvToJson } from '~/composables/useCsvJson'

useSeoMeta({
  title: 'CSV to JSON Converter — Free Online Tool',
  description: 'Convert CSV and TSV files to JSON instantly. Free online CSV to JSON converter, no data sent to servers.',
})

const seoCards = [
  {
    title: 'What is CSV and when do you need JSON?',
    text: 'CSV (Comma-Separated Values) is the universal export format for spreadsheets, databases, and reporting tools. But modern APIs, JavaScript apps, and NoSQL databases speak JSON. Converting CSV to JSON lets you feed spreadsheet data directly into a fetch call, seed a database, or pass records to a charting library — without writing a single line of parsing code.',
  },
  {
    title: 'How the converter handles your data',
    text: 'Paste your CSV or drop a file and the converter parses it in your browser. When "Headers" is enabled, the first row becomes the keys of each JSON object — the most common shape for API payloads. Auto-detect picks up commas, semicolons, and tabs automatically; switch it manually if your data uses an unusual delimiter or contains quoted fields with commas inside.',
  },
  {
    title: 'Common use cases',
    text: 'Data engineers use this to prototype ETL pipelines before writing code. Front-end developers convert exported Google Sheets data into JSON fixtures for mock APIs. QA teams transform test-case spreadsheets into structured input for automated test runners. Because everything runs locally, sensitive CSV exports — financial records, user data — never leave your browser.',
  },
]

const { input, output, error, rowCount, delimiter, hasHeader, copied, convert, copy, downloadJson, clear } = useCsvToJson()
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
