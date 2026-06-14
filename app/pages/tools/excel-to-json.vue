<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Excel <span class="title-arrow">→</span> JSON</h1>
        <p class="page-subtitle">Convert .xlsx or .xls files to JSON — drop your file below.</p>
      </div>
      <ToolSwitch from-path="/tools/excel-to-json" to-path="/tools/json-to-excel" from-label="Excel → JSON" to-label="JSON → Excel" />
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <button @click="copy" class="btn btn-secondary" :disabled="!output" :class="{ 'btn--success': copied }">
          <svg v-if="!copied" width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ copied ? 'Copied!' : 'Copy JSON' }}
        </button>
        <button @click="clear" class="btn btn-ghost" :disabled="!file">Clear</button>
      </div>
      <div class="toolbar-right">
        <Transition name="status">
          <div v-if="error" class="status-pill status-pill--invalid">
            <span class="status-dot" /><span class="status-text">{{ error }}</span>
          </div>
          <div v-else-if="sheets.length > 0" class="status-pill status-pill--valid">
            <span class="status-dot" /><span>{{ sheets.length }} sheet{{ sheets.length > 1 ? 's' : '' }}</span>
          </div>
        </Transition>

        <template v-if="sheets.length > 1">
          <div class="option-wrap">
            <label class="option-label">Sheet</label>
            <select :value="activeSheet" @change="switchSheet(($event.target as HTMLSelectElement).value)" class="option-select">
              <option v-for="s in sheets" :key="s.name" :value="s.name">{{ s.name }} ({{ s.rowCount }} rows)</option>
            </select>
          </div>
        </template>

        <label class="toggle-wrap">
          <input type="checkbox" v-model="hasHeader" @change="file && convert()" class="toggle-input" />
          <span class="toggle-track"><span class="toggle-thumb" /></span>
          <span class="toggle-label">Headers</span>
        </label>
      </div>
    </div>

    <div class="editors">
      <!-- Drop zone -->
      <div
        class="editor-card drop-zone"
        :class="{ 'drop-zone--active': isDragging, 'drop-zone--loaded': !!file }"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="onDrop"
        @click="triggerFileInput"
      >
        <input ref="fileInput" type="file" accept=".xlsx,.xls,.ods,.csv" class="file-input" @change="onFileInput" />
        <div v-if="!file" class="drop-content">
          <div class="drop-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="6" y="4" width="24" height="30" rx="3" stroke="#D1CEC8" stroke-width="2"/>
              <path d="M14 4v8h8" stroke="#D1CEC8" stroke-width="2" stroke-linecap="round"/>
              <path d="M13 22h14M13 27h10" stroke="#D1CEC8" stroke-width="1.5" stroke-linecap="round"/>
              <rect x="4" y="16" width="14" height="10" rx="2" fill="#F97316"/>
              <path d="M8 19l2 4 2-4M13 19v6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="drop-title">Drop your Excel file here</p>
          <p class="drop-hint">or click to browse · .xlsx, .xls, .ods</p>
        </div>
        <div v-else class="file-loaded">
          <div class="file-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="3" y="2" width="18" height="23" rx="2.5" fill="#F0FDF4" stroke="#BBF7D0" stroke-width="1.5"/>
              <path d="M9 10h10M9 14h7M9 18h8" stroke="#16A34A" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="22" cy="22" r="6" fill="#16A34A"/>
              <path d="M19.5 22l2 2 3-3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="file-info">
            <p class="file-name">{{ file.name }}</p>
            <p class="file-size">{{ formatSize(file.size) }}</p>
          </div>
          <button class="file-change" @click.stop="triggerFileInput">Change file</button>
        </div>
        <div v-if="loading" class="loading-overlay">
          <svg class="spinner" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#E8E5DF" stroke-width="2"/>
            <path d="M12 2a10 10 0 0110 10" stroke="#F97316" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>

      <!-- JSON Output -->
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
import { useExcelToJson } from '~/composables/useExcelJson'

useSeoMeta({
  title: 'Excel to JSON Converter — Free Online Tool',
  description: 'Convert Excel (.xlsx, .xls) files to JSON instantly. Free online Excel to JSON converter, no data uploaded to servers.',
  ogTitle: 'Excel to JSON Converter — Free Online Tool',
  ogDescription: 'Convert Excel (.xlsx, .xls) files to JSON instantly. Free online Excel to JSON converter, no data uploaded to servers.',
  twitterTitle: 'Excel to JSON Converter — Free Online Tool',
  twitterDescription: 'Convert Excel (.xlsx, .xls) files to JSON instantly. Free online Excel to JSON converter, no data uploaded to servers.',
  ogImage: 'https://jsontools.space/og/excel-to-json.png',
  twitterImage: 'https://jsontools.space/og/excel-to-json.png',
})

const { file, output, error, sheets, activeSheet, hasHeader, copied, loading, convert, switchSheet, copy, clear } = useExcelToJson()

const seoCards = [
  {
    title: 'Excel to JSON: bridging spreadsheets and code',
    text: 'Excel remains the default tool for data collection, financial modeling, and reporting across most organisations. But applications and APIs don\'t speak .xlsx. Converting Excel to JSON lets you load spreadsheet data into a JavaScript app, seed a database, or pass it to a REST endpoint — without writing a parser or installing a library.',
  },
  {
    title: 'Multi-sheet support and header detection',
    text: 'Real-world Excel files often contain multiple sheets — a summary tab, regional breakdowns, monthly data. The converter lists every sheet and lets you switch between them instantly. Enable "Headers" to use the first row as JSON object keys; disable it to get arrays of raw values per row. Files are parsed entirely in your browser using the SheetJS library.',
  },
  {
    title: 'Data migration and integration use cases',
    text: 'Finance teams export budget spreadsheets to JSON to feed a dashboard or planning tool. Operations teams convert inventory .xlsx files into JSON for database seeding. Analysts share clean JSON with developers who need structured data without spreadsheet tooling. Because no file is uploaded to a server, sensitive financial or HR data stays private.',
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
.drop-zone {
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  position: relative;
  justify-content: center;
  align-items: center;
}
.drop-zone:hover { border-color: #FDBA74; background: #FFFBF6; }
.drop-zone--active { border-color: #F97316 !important; border-style: dashed; background: #FFFBF6 !important; }
.drop-zone--loaded { cursor: default; }
.drop-zone--loaded:hover { border-color: var(--c-border); background: var(--c-card); }
.drop-icon svg rect, .drop-icon svg path, .drop-icon svg circle { stroke: var(--c-border); }

.file-input { display: none; }

.drop-content { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; height: 100%; padding: 40px; text-align: center; }
.drop-icon { opacity: 0.7; }
.drop-title { font-size: 15px; font-weight: 600; color: var(--c-t2); }
.drop-hint { font-size: 13px; color: var(--c-t4); }

.file-loaded { display: flex; align-items: center; gap: 16px; padding: 28px; height: 100%; }
.file-icon { flex-shrink: 0; }
.file-info { flex: 1; }
.file-name { font-size: 14px; font-weight: 600; color: var(--c-t1); word-break: break-all; }
.file-size { font-size: 12px; color: var(--c-t4); margin-top: 3px; }
.file-change { padding: 5px 12px; border-radius: 7px; font-size: 12.5px; font-weight: 500; font-family: inherit; border: 1px solid var(--c-border-m); background: var(--c-faint); color: var(--c-t2); cursor: pointer; flex-shrink: 0; transition: all 0.15s; }
.file-change:hover { background: var(--c-subtle); }

.loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center; }
</style>
