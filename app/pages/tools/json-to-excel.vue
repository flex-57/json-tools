<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> Excel</h1>
        <p class="page-subtitle">Convert a JSON array to an .xlsx file — paste or drop a .json file.</p>
      </div>
      <ToolSwitch from-path="/tools/excel-to-json" to-path="/tools/json-to-excel" from-label="Excel → JSON" to-label="JSON → Excel" />
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <button @click="download" class="btn btn-primary" :disabled="!input || loading">
          <svg v-if="!loading" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v7M4 6l3 3 3-3M2 11h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <svg v-else class="spinner" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.3)" stroke-width="2"/><path d="M7 2a5 5 0 015 5" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
          {{ loading ? 'Generating...' : 'Download .xlsx' }}
        </button>
        <button @click="clear" class="btn btn-ghost">Clear</button>
      </div>
      <div class="toolbar-right">
        <Transition name="status">
          <div v-if="error && error !== 'empty'" class="status-pill status-pill--invalid">
            <span class="status-dot" /><span class="status-text">{{ error }}</span>
          </div>
        </Transition>
      </div>
    </div>

    <div class="editors">
      <div class="editor-card" :class="{ 'editor-card--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="editor-card-header">
          <span class="editor-label">JSON Input</span>
          <span class="editor-hint">Array of objects · or drop a .json file</span>
        </div>
        <div class="editor-body">
          <ClientOnly>
            <JsonEditor v-model="input" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="editor-card preview-card">
        <div class="editor-card-header">
          <span class="editor-label">Preview</span>
          <span class="editor-hint">First 5 rows</span>
        </div>
        <div class="preview-body">
          <template v-if="preview.length > 0">
            <div class="table-wrap">
              <table class="preview-table">
                <thead>
                  <tr><th v-for="col in previewCols" :key="col">{{ col }}</th></tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in preview" :key="i">
                    <td v-for="col in previewCols" :key="col">{{ row[col] ?? '' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <div v-else class="preview-empty">
            <p>Paste JSON to see a preview</p>
          </div>
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJsonToExcel } from '~/composables/useExcelJson'

useSeoMeta({
  title: 'JSON to Excel Converter — Free Online Tool',
  description: 'Convert JSON arrays to Excel (.xlsx) files instantly. Free online JSON to Excel converter, no data uploaded to servers.',
})

const { input, error, loading, download, clear } = useJsonToExcel()

const seoCards = [
  {
    title: 'From JSON array to a real Excel file',
    text: 'Sending a JSON array to a non-technical stakeholder means they need to run code to read it. Converting to Excel gives them a file they can open directly, filter with AutoFilter, and share without any setup. This tool generates a proper .xlsx binary — not a renamed CSV — with correct column headers and cell types.',
  },
  {
    title: 'What the preview tells you',
    text: 'Before downloading, the live preview shows the first five rows of the Excel sheet so you can confirm that keys became column headers and values landed in the right cells. If your JSON contains nested objects, flatten them first — nested values serialize as JSON strings in the cell, which is usually not what you want in a spreadsheet.',
  },
  {
    title: 'Reporting and handoff use cases',
    text: 'Backend developers export JSON API responses to Excel for product review meetings. Support teams convert JSON log data to spreadsheets for ticket analysis. Data analysts receive JSON from a data warehouse and convert it to Excel for pivot table work. The generated file downloads instantly — no server round-trip, no file size limit imposed by an upload endpoint.',
  },
]
const isDragging = ref(false)

const preview = computed(() => {
  try {
    const p = JSON.parse(input.value.trim())
    const arr = Array.isArray(p) ? p : [p]
    return arr.slice(0, 5)
  } catch { return [] }
})

const previewCols = computed(() => {
  if (!preview.value.length) return []
  return Object.keys(preview.value[0])
})

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}
</script>

<style scoped>
.preview-card { background: var(--c-card-alt); }
.preview-body { flex: 1; overflow: auto; }
.preview-empty { height: 100%; display: flex; align-items: center; justify-content: center; color: var(--c-t5); font-size: 13px; }
.table-wrap { overflow: auto; }
.preview-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.preview-table th { padding: 8px 14px; background: var(--c-faint); border-bottom: 1px solid var(--c-border-s); text-align: left; font-weight: 600; color: var(--c-t3); white-space: nowrap; position: sticky; top: 0; }
.preview-table td { padding: 7px 14px; border-bottom: 1px solid var(--c-border-s); color: var(--c-t2); white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis; }
.preview-table tr:last-child td { border-bottom: none; }
.preview-table tr:hover td { background: #FFFBF6; }
</style>
