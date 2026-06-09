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
            <template #fallback>
              <textarea v-model="output" readonly class="editor-textarea editor-textarea--readonly" />
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCsvToJson } from '~/composables/useCsvJson'

useSeoMeta({
  title: 'CSV to JSON Converter — Free Online Tool',
  description: 'Convert CSV and TSV files to JSON instantly. Free online CSV to JSON converter, no data sent to servers.',
})

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

<style scoped>
.page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 24px 24px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header { display: flex; align-items: flex-end; justify-content: space-between; }
.page-title { font-size: 24px; font-weight: 700; color: #1A1916; letter-spacing: -0.6px; line-height: 1.2; }
.title-arrow { color: #F97316; font-weight: 300; margin: 0 4px; }
.page-subtitle { margin-top: 6px; font-size: 13.5px; color: #7A776E; }

.toolbar {
  background: #FFFFFF;
  border: 1px solid #E8E5DF;
  border-radius: 14px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
  flex-wrap: wrap;
}

.toolbar-left, .toolbar-right { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1;
}
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary { background: #F97316; color: white; border-color: #F97316; box-shadow: 0 1px 2px rgba(249,115,22,0.3); }
.btn-primary:hover { background: #EA6C0A; box-shadow: 0 2px 8px rgba(249,115,22,0.35); transform: translateY(-0.5px); }
.btn-secondary { background: #FAFAF8; color: #3A3830; border-color: #DDD9D2; }
.btn-secondary:hover:not(:disabled) { background: #F3F1EC; border-color: #C9C5BE; color: #1A1916; }
.btn--success { background: #F0FDF4; color: #16A34A; border-color: #BBF7D0; }
.btn-ghost { background: transparent; color: #A09C94; border-color: transparent; }
.btn-ghost:hover { background: #FFF1F0; color: #DC2626; border-color: #FECACA; }

.status-pill { display: inline-flex; align-items: center; gap: 7px; padding: 4px 11px 4px 8px; border-radius: 20px; font-size: 12.5px; font-weight: 500; max-width: 280px; }
.status-pill--valid { background: #F0FDF4; border: 1px solid #BBF7D0; color: #16A34A; }
.status-pill--invalid { background: #FFF1F0; border: 1px solid #FECACA; color: #DC2626; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.status-pill--valid .status-dot { background: #16A34A; box-shadow: 0 0 0 2px #BBF7D0; }
.status-pill--invalid .status-dot { background: #DC2626; box-shadow: 0 0 0 2px #FECACA; }
.status-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.option-wrap { display: flex; align-items: center; gap: 7px; }
.option-label { font-size: 12.5px; color: #9A9690; font-weight: 500; }
.option-select {
  appearance: none;
  background: #FAFAF8 url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239A9690' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 8px center;
  border: 1px solid #DDD9D2;
  border-radius: 8px;
  padding: 5px 26px 5px 10px;
  font-size: 13px;
  font-family: inherit;
  color: #3A3830;
  font-weight: 500;
  cursor: pointer;
}
.option-select:focus { outline: none; border-color: #F97316; }

.toggle-wrap { display: flex; align-items: center; gap: 7px; cursor: pointer; user-select: none; }
.toggle-input { position: absolute; opacity: 0; width: 0; height: 0; }
.toggle-track {
  width: 32px; height: 18px; border-radius: 9px;
  background: #DDD9D2; transition: background 0.2s;
  position: relative; flex-shrink: 0;
}
.toggle-input:checked + .toggle-track { background: #F97316; }
.toggle-thumb {
  position: absolute; top: 2px; left: 2px;
  width: 14px; height: 14px; border-radius: 50%;
  background: white; transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.toggle-input:checked + .toggle-track .toggle-thumb { transform: translateX(14px); }
.toggle-label { font-size: 12.5px; color: #6B6860; font-weight: 500; }

.editors {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  min-height: 500px;
}

.editor-card {
  background: #FFFFFF;
  border: 1px solid #E8E5DF;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s, border-color 0.2s;
}
.editor-card:focus-within { border-color: #FDBA74; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04), 0 0 0 3px rgba(249,115,22,0.08); }
.editor-card--drag { border-color: #F97316; border-style: dashed; background: #FFFBF6; }
.editor-card--output { background: #FDFCFA; }

.editor-card-header {
  padding: 12px 16px 10px;
  border-bottom: 1px solid #F0EDE7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.editor-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #9A9690; }
.editor-hint { font-size: 11.5px; color: #C2BEB7; }

.editor-body { flex: 1; overflow: hidden; display: flex; }

.editor-textarea {
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  background: transparent;
  color: #1A1916;
  line-height: 1.65;
}
.editor-textarea--readonly { color: #3A3830; background: #FDFCFA; }
.editor-textarea::placeholder { color: #C2BEB7; }

.status-enter-active, .status-leave-active { transition: all 0.2s ease; }
.status-enter-from, .status-leave-to { opacity: 0; transform: scale(0.9); }
</style>
