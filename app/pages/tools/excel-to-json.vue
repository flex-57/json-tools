<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Excel <span class="title-arrow">→</span> JSON</h1>
        <p class="page-subtitle">Convert .xlsx or .xls files to JSON. Drop your file below.</p>
      </div>
      <div style="display:flex; align-items:center; gap: 14px; flex-wrap: wrap;">
        <template v-if="sheets.length > 1">
          <div class="option-wrap">
            <label class="option-label">Sheet</label>
            <select :value="activeSheet" class="option-select" @change="switchSheet(($event.target as HTMLSelectElement).value)">
              <option v-for="s in sheets" :key="s.name" :value="s.name">{{ s.name }} ({{ s.rowCount }} rows)</option>
            </select>
          </div>
        </template>
        <ToolSwitch from-path="/tools/excel-to-json" to-path="/tools/json-to-excel" from-label="Excel → JSON" to-label="JSON → Excel" />
      </div>
    </div>

    <div class="dualpane no-mid">
      <div
        class="pane drop-zone"
        :class="{ 'pane--drag': isDragging, 'drop-zone--loaded': !!file }"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="onDrop"
        @click="triggerFileInput"
      >
        <input ref="fileInput" type="file" accept=".xlsx,.xls,.ods,.csv" class="file-input" @change="onFileInput" >
        <div v-if="!file" class="drop-content">
          <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
            <rect x="6" y="4" width="24" height="30" rx="3" stroke="var(--c-border-m)" stroke-width="2"/>
            <path d="M14 4v8h8" stroke="var(--c-border-m)" stroke-width="2" stroke-linecap="round"/>
            <path d="M13 22h14M13 27h10" stroke="var(--c-border-m)" stroke-width="1.5" stroke-linecap="round"/>
            <rect x="4" y="16" width="14" height="10" rx="2" fill="var(--c-accent)"/>
            <path d="M8 19l2 4 2-4M13 19v6" stroke="var(--c-accent-ink)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="drop-title">Drop your Excel file here</p>
          <p class="drop-hint">or click to browse · .xlsx, .xls, .ods</p>
        </div>
        <div v-else class="file-loaded">
          <div class="file-info">
            <p class="file-name">{{ file.name }}</p>
            <p class="file-size">{{ formatSize(file.size) }}</p>
          </div>
          <button class="btn-xs" @click.stop="triggerFileInput">Change file</button>
          <button class="btn-xs" @click.stop="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
        </div>
      </div>

      <div class="midcol"><span class="mid-arrow"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">JSON Output</span>
          <div class="card-actions">
            <label class="toggle-wrap">
              <input v-model="hasHeader" type="checkbox" class="toggle-input" @change="file && convert()" >
              <span class="toggle-track"><span class="toggle-thumb" /></span>
              <span class="toggle-label">Headers</span>
            </label>
            <button class="btn-xs" :disabled="!output" @click="download">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;" aria-live="polite">
          <ClientOnly>
            <JsonEditor v-model="output" :readonly="true" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <StatusBar v-if="sheets.length || error">
      <span><span class="led" :class="error ? 'error' : 'valid'"/>{{ error || `${sheets.length} sheet${sheets.length > 1 ? 's' : ''}` }}</span>
      <span>excel-to-json</span>
    </StatusBar>

    <div class="info-strip">Parsed in an isolated Web Worker: no file is uploaded to servers</div>
    <div class="info-strip info-strip--warn">SheetJS has known CVEs (prototype pollution, ReDoS). The Worker sandbox limits exposure but does not fix them</div>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['excel-to-json']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useExcelToJson } from '~/composables/useExcelJson'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'Excel to JSON Converter: Upload .xlsx & Get JSON Free',
  'Convert Excel (.xlsx, .xls) files to JSON instantly. Free online Excel to JSON converter, no data uploaded to servers.',
  TOOL_FAQS['excel-to-json'],
)

const { file, output, error, sheets, activeSheet, hasHeader, copied, convert, switchSheet, copy, clear, download } = useExcelToJson()

const seoCards = [
  {
    title: 'Excel to JSON: bridging spreadsheets and code',
    text: [
      'Excel remains the default tool for data collection, financial modeling, and reporting across most organisations. But applications and APIs don\'t speak .xlsx.',
      'Converting Excel to JSON lets you load spreadsheet data into a JavaScript app, seed a database, or pass it to a REST endpoint, all without writing a parser or installing a library.',
    ],
  },
  {
    title: 'Multi-sheet support and header detection',
    text: [
      'Real-world Excel files often contain multiple sheets: a summary tab, regional breakdowns, monthly data. The converter lists every sheet and lets you switch between them instantly.',
      'Enable "Headers" to use the first row as JSON object keys; disable it to get arrays of raw values per row. Files are parsed entirely in your browser using the SheetJS library.',
    ],
  },
  {
    title: 'Data migration and integration use cases',
    text: [
      'Finance teams export budget spreadsheets to JSON to feed a dashboard or planning tool. Operations teams convert inventory .xlsx files into JSON for database seeding.',
      'Analysts share clean JSON with developers who need structured data without spreadsheet tooling. Because no file is uploaded to a server, sensitive financial or HR data stays private.',
    ],
  },
]

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() { fileInput.value?.click() }

function onDrop(e: DragEvent) {
  isDragging.value = false
  const f = e.dataTransfer?.files[0]
  if (f) convert(f)
}

function onFileInput(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) convert(f)
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>

<style scoped>
.drop-zone { cursor: pointer; align-items: center; justify-content: center; transition: border-color 0.2s, background 0.2s; }
.drop-zone:hover { background: var(--c-faint); }
.drop-zone--loaded { cursor: default; }
.file-input { display: none; }

.drop-content { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; height: 100%; padding: 40px; text-align: center; }
.drop-title { font-family: var(--font-body); font-size: 14px; font-weight: 600; color: var(--c-t2); }
.drop-hint { font-family: var(--font-body); font-size: 12.5px; color: var(--c-t4); }

.file-loaded { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 28px; }
.file-name { font-family: var(--font-body); font-size: 13.5px; font-weight: 600; color: var(--c-t1); word-break: break-all; text-align: center; }
.file-size { font-family: var(--font-mono); font-size: 11.5px; color: var(--c-t4); margin-top: 3px; text-align: center; }
</style>
