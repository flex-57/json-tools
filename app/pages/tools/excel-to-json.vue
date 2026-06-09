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
          {{ copied ? '✓ Copied!' : 'Copy JSON' }}
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
            <template #fallback><textarea v-model="output" readonly class="editor-textarea" /></template>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExcelToJson } from '~/composables/useExcelJson'

useSeoMeta({
  title: 'Excel to JSON Converter — Free Online Tool',
  description: 'Convert Excel (.xlsx, .xls) files to JSON instantly. Free online Excel to JSON converter, no data uploaded to servers.',
})

const { file, output, error, sheets, activeSheet, hasHeader, copied, loading, convert, switchSheet, copy, clear } = useExcelToJson()

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
.page { max-width: 1440px; margin: 0 auto; padding: 32px 24px 24px; width: 100%; flex: 1; display: flex; flex-direction: column; gap: 16px; }
.page-header { display: flex; align-items: flex-end; justify-content: space-between; }
.page-title { font-size: 24px; font-weight: 700; color: #1A1916; letter-spacing: -0.6px; }
.title-arrow { color: #F97316; font-weight: 300; margin: 0 4px; }
.page-subtitle { margin-top: 6px; font-size: 13.5px; color: #7A776E; }
.toolbar { background: #FFF; border: 1px solid #E8E5DF; border-radius: 14px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03); flex-wrap: wrap; }
.toolbar-left, .toolbar-right { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 13px; border-radius: 8px; font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; white-space: nowrap; line-height: 1; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-secondary { background: #FAFAF8; color: #3A3830; border-color: #DDD9D2; }
.btn-secondary:hover:not(:disabled) { background: #F3F1EC; border-color: #C9C5BE; }
.btn--success { background: #F0FDF4; color: #16A34A; border-color: #BBF7D0; }
.btn-ghost { background: transparent; color: #A09C94; border-color: transparent; }
.btn-ghost:hover:not(:disabled) { background: #FFF1F0; color: #DC2626; border-color: #FECACA; }
.status-pill { display: inline-flex; align-items: center; gap: 7px; padding: 4px 11px 4px 8px; border-radius: 20px; font-size: 12.5px; font-weight: 500; max-width: 280px; }
.status-pill--valid { background: #F0FDF4; border: 1px solid #BBF7D0; color: #16A34A; }
.status-pill--invalid { background: #FFF1F0; border: 1px solid #FECACA; color: #DC2626; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.status-pill--valid .status-dot { background: #16A34A; box-shadow: 0 0 0 2px #BBF7D0; }
.status-pill--invalid .status-dot { background: #DC2626; box-shadow: 0 0 0 2px #FECACA; }
.status-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.option-wrap { display: flex; align-items: center; gap: 7px; }
.option-label { font-size: 12.5px; color: #9A9690; font-weight: 500; }
.option-select { appearance: none; background: #FAFAF8 url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239A9690' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 8px center; border: 1px solid #DDD9D2; border-radius: 8px; padding: 5px 26px 5px 10px; font-size: 13px; font-family: inherit; color: #3A3830; font-weight: 500; cursor: pointer; }
.option-select:focus { outline: none; border-color: #F97316; }
.toggle-wrap { display: flex; align-items: center; gap: 7px; cursor: pointer; user-select: none; }
.toggle-input { position: absolute; opacity: 0; width: 0; height: 0; }
.toggle-track { width: 32px; height: 18px; border-radius: 9px; background: #DDD9D2; transition: background 0.2s; position: relative; flex-shrink: 0; }
.toggle-input:checked + .toggle-track { background: #F97316; }
.toggle-thumb { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: white; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
.toggle-input:checked + .toggle-track .toggle-thumb { transform: translateX(14px); }
.toggle-label { font-size: 12.5px; color: #6B6860; font-weight: 500; }
.editors { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; min-height: 500px; }
.editor-card { background: #FFF; border: 1px solid #E8E5DF; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04); }
.editor-card--output { background: #FDFCFA; }
.editor-card-header { padding: 12px 16px 10px; border-bottom: 1px solid #F0EDE7; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.editor-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #9A9690; }
.editor-hint { font-size: 11.5px; color: #C2BEB7; }
.editor-body { flex: 1; overflow: hidden; display: flex; }
.editor-textarea { flex: 1; width: 100%; border: none; outline: none; resize: none; padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-size: 13px; background: transparent; color: #1A1916; line-height: 1.65; }

/* Drop zone */
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
.drop-zone--loaded:hover { border-color: #E8E5DF; background: #FFF; }

.file-input { display: none; }

.drop-content { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; height: 100%; padding: 40px; text-align: center; }
.drop-icon { opacity: 0.7; }
.drop-title { font-size: 15px; font-weight: 600; color: #3A3830; }
.drop-hint { font-size: 13px; color: #9A9690; }

.file-loaded { display: flex; align-items: center; gap: 16px; padding: 28px; height: 100%; }
.file-icon { flex-shrink: 0; }
.file-info { flex: 1; }
.file-name { font-size: 14px; font-weight: 600; color: #1A1916; word-break: break-all; }
.file-size { font-size: 12px; color: #9A9690; margin-top: 3px; }
.file-change { padding: 5px 12px; border-radius: 7px; font-size: 12.5px; font-weight: 500; font-family: inherit; border: 1px solid #DDD9D2; background: #FAFAF8; color: #3A3830; cursor: pointer; flex-shrink: 0; transition: all 0.15s; }
.file-change:hover { background: #F3F1EC; }

.loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center; }
.spinner { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.status-enter-active, .status-leave-active { transition: all 0.2s ease; }
.status-enter-from, .status-leave-to { opacity: 0; transform: scale(0.9); }
</style>
