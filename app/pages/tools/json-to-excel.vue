<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> Excel</h1>
        <p class="page-subtitle">Convert a JSON array to an .xlsx file. Paste or drop a .json file.</p>
      </div>
      <ToolSwitch from-path="/tools/excel-to-json" to-path="/tools/json-to-excel" from-label="Excel → JSON" to-label="JSON → Excel" />
    </div>

    <Transition name="fade">
      <ErrorBanner
        v-if="error"
        :message="errorTip || error"
        :line="errorLine"
        :column="errorColumn"
        @jump="errorLine && inputEditorRef?.scrollToLine(errorLine)"
      />
    </Transition>

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--drag': isDragging, 'pane--invalid': error }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <span class="pane-label">JSON Input</span>
          <div class="card-actions">
            <span class="hint">array of objects · or drop a .json file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor ref="inputEditorRef" v-model="input" :error-line="errorLine" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="midcol"><span class="mid-arrow"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">Preview</span>
          <div class="card-actions">
            <span class="hint">First 5 rows</span>
            <button class="btn-xs" :disabled="!isValid || loading" @click="download">{{ loading ? 'Generating…' : 'Download .xlsx' }}</button>
          </div>
        </div>
        <div class="pane-body" :class="{ 'pane-body--empty': preview.length === 0 }" :style="preview.length > 0 ? 'padding: 0;' : ''" aria-live="polite">
          <Transition name="reveal" mode="out-in">
            <div v-if="preview.length > 0" key="output" class="table-wrap">
              <table class="preview-table">
                <thead><tr><th v-for="col in previewCols" :key="col">{{ col }}</th></tr></thead>
                <tbody>
                  <tr v-for="(row, i) in preview" :key="i">
                    <td v-for="col in previewCols" :key="col">{{ row[col] ?? '' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else key="empty" class="pane-body-placeholder">{{ error ? 'Fix the error in your input to see a preview' : 'Paste JSON to see a preview' }}</p>
          </Transition>
        </div>
      </div>
    </div>

    <div class="info-strip">Generated in an isolated Web Worker: no data is uploaded to servers</div>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['json-to-excel']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useJsonToExcel } from '~/composables/useExcelJson'
import JsonEditor from '~/components/JsonEditor.vue'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'JSON to Excel Converter: Download .xlsx from JSON Free',
  'Convert JSON arrays to Excel (.xlsx) files instantly. Free online JSON to Excel converter, no data uploaded to servers.',
  TOOL_FAQS['json-to-excel'],
)

const { input, isValid, error, errorTip, errorLine, errorColumn, loading, download, clear } = useJsonToExcel()
useUrlInput(input)

const inputEditorRef = ref<InstanceType<typeof JsonEditor> | null>(null)

const seoCards = [
  {
    title: 'From JSON array to a real Excel file',
    text: [
      'Sending a JSON array to a non-technical stakeholder means they need to run code to read it. Converting to Excel gives them a file they can open directly, filter with AutoFilter, and share without any setup.',
      'This tool generates a proper .xlsx binary, not a renamed CSV, with correct column headers and cell types.',
    ],
  },
  {
    title: 'What the preview tells you',
    text: [
      'Before downloading, the live preview shows the first five rows of the Excel sheet so you can confirm that keys became column headers and values landed in the right cells.',
      'If your JSON contains nested objects, flatten them first. Nested values otherwise serialize as JSON strings in the cell, which is usually not what you want in a spreadsheet.',
    ],
  },
  {
    title: 'Reporting and handoff use cases',
    text: [
      'Backend developers export JSON API responses to Excel for product review meetings. Support teams convert JSON log data to spreadsheets for ticket analysis.',
      'Data analysts receive JSON from a data warehouse and convert it to Excel for pivot table work. The generated file downloads instantly, with no server round-trip and no file size limit imposed by an upload endpoint.',
    ],
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
.table-wrap { overflow: auto; height: 100%; }
.preview-table { width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 12px; }
.preview-table th { padding: 8px 14px; background: var(--c-faint); border-bottom: 1px solid var(--c-border); text-align: left; font-weight: 600; color: var(--c-t3); white-space: nowrap; position: sticky; top: 0; }
.preview-table td { padding: 7px 14px; border-bottom: 1px solid var(--c-border-s); color: var(--c-t2); white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis; }
.preview-table tr:last-child td { border-bottom: none; }
.preview-table tr:hover td { background: var(--c-faint); }
</style>
