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
            <template #fallback>
              <textarea v-model="input" placeholder='[{"name":"Alice","age":30},{"name":"Bob","age":25}]' class="editor-textarea" spellcheck="false" />
            </template>
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
  </div>
</template>

<script setup lang="ts">
import { useJsonToExcel } from '~/composables/useExcelJson'

useSeoMeta({
  title: 'JSON to Excel Converter — Free Online Tool',
  description: 'Convert JSON arrays to Excel (.xlsx) files instantly. Free online JSON to Excel converter, no data uploaded to servers.',
})

const { input, error, loading, download, clear } = useJsonToExcel()
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
.page { max-width: 1440px; margin: 0 auto; padding: 32px 24px 24px; width: 100%; flex: 1; display: flex; flex-direction: column; gap: 16px; }
.page-header { display: flex; align-items: flex-end; justify-content: space-between; }
.page-title { font-size: 24px; font-weight: 700; color: #1A1916; letter-spacing: -0.6px; }
.title-arrow { color: #F97316; font-weight: 300; margin: 0 4px; }
.page-subtitle { margin-top: 6px; font-size: 13.5px; color: #7A776E; }
.toolbar { background: #FFF; border: 1px solid #E8E5DF; border-radius: 14px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03); flex-wrap: wrap; }
.toolbar-left, .toolbar-right { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 13px; border-radius: 8px; font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; white-space: nowrap; line-height: 1; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background: #F97316; color: white; border-color: #F97316; box-shadow: 0 1px 2px rgba(249,115,22,0.3); }
.btn-primary:hover:not(:disabled) { background: #EA6C0A; transform: translateY(-0.5px); }
.btn-ghost { background: transparent; color: #A09C94; border-color: transparent; }
.btn-ghost:hover { background: #FFF1F0; color: #DC2626; border-color: #FECACA; }
.status-pill { display: inline-flex; align-items: center; gap: 7px; padding: 4px 11px 4px 8px; border-radius: 20px; font-size: 12.5px; font-weight: 500; max-width: 280px; }
.status-pill--invalid { background: #FFF1F0; border: 1px solid #FECACA; color: #DC2626; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; background: #DC2626; box-shadow: 0 0 0 2px #FECACA; }
.status-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.editors { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; min-height: 500px; }
.editor-card { background: #FFF; border: 1px solid #E8E5DF; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04); transition: border-color 0.2s; }
.editor-card:focus-within { border-color: #FDBA74; box-shadow: 0 0 0 3px rgba(249,115,22,0.08); }
.editor-card--drag { border-color: #F97316; border-style: dashed; background: #FFFBF6; }
.preview-card { background: #FDFCFA; }
.editor-card-header { padding: 12px 16px 10px; border-bottom: 1px solid #F0EDE7; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.editor-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #9A9690; }
.editor-hint { font-size: 11.5px; color: #C2BEB7; }
.editor-body { flex: 1; overflow: hidden; display: flex; }
.editor-textarea { flex: 1; width: 100%; border: none; outline: none; resize: none; padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-size: 13px; background: transparent; color: #1A1916; line-height: 1.65; }
.editor-textarea::placeholder { color: #C2BEB7; }
.preview-body { flex: 1; overflow: auto; }
.preview-empty { height: 100%; display: flex; align-items: center; justify-content: center; color: #C2BEB7; font-size: 13px; }
.table-wrap { overflow: auto; }
.preview-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.preview-table th { padding: 8px 14px; background: #F9F8F5; border-bottom: 1px solid #F0EDE7; text-align: left; font-weight: 600; color: #6B6860; white-space: nowrap; position: sticky; top: 0; }
.preview-table td { padding: 7px 14px; border-bottom: 1px solid #F7F5F2; color: #3A3830; white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis; }
.preview-table tr:last-child td { border-bottom: none; }
.preview-table tr:hover td { background: #FFFBF6; }
.spinner { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.status-enter-active, .status-leave-active { transition: all 0.2s ease; }
.status-enter-from, .status-leave-to { opacity: 0; transform: scale(0.9); }
</style>
