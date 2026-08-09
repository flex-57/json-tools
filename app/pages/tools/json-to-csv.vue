<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> CSV</h1>
        <p class="page-subtitle">Convert a JSON array to CSV format. Paste or drop a .json file.</p>
        <NuxtLink to="/guides/what-is-csv" class="guide-link">New to CSV? Read our guide →</NuxtLink>
      </div>
      <ToolSwitch from-path="/tools/csv-to-json" to-path="/tools/json-to-csv" from-label="CSV → JSON" to-label="JSON → CSV" />
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
          <span class="pane-label">CSV Output</span>
          <div class="card-actions">
            <div class="option-wrap">
              <label class="option-label">Sep</label>
              <select v-model="delimiter" class="option-select">
                <option value=",">Comma</option>
                <option value=";">Semicolon</option>
                <option value="	">Tab</option>
              </select>
            </div>
            <button class="btn-xs" :disabled="!output" @click="downloadCsv">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" :class="{ 'pane-body--empty': !output }" aria-live="polite">
          <Transition name="reveal" mode="out-in">
            <p v-if="!output" key="empty" class="pane-body-placeholder">{{ error ? 'Fix the error in your input to see CSV output' : 'Paste JSON to see CSV output' }}</p>
            <textarea v-else key="output" v-model="output" readonly class="pane-textarea" spellcheck="false" />
          </Transition>
        </div>
      </div>
    </div>

    <StatusBar>
      <span>
        <span class="led" :class="rowCount > 0 ? 'valid' : 'error'"/>
        {{ rowCount > 0 ? `${rowCount} row${rowCount > 1 ? 's' : ''} converted` : (error ? `Invalid${errorLine ? ` · Line ${errorLine}, Column ${errorColumn}` : ''}` : 'Waiting for input') }}
      </span>
      <span>json-to-csv</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['json-to-csv']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useJsonToCsv } from '~/composables/useCsvJson'
import JsonEditor from '~/components/JsonEditor.vue'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'JSON to CSV Converter: Export JSON Arrays to CSV Free',
  'Convert JSON arrays to CSV format instantly. Free online JSON to CSV converter, no data sent to servers.',
  TOOL_FAQS['json-to-csv'],
)

const { input, output, error, errorTip, errorLine, errorColumn, rowCount, delimiter, copied, copy, downloadCsv, clear } = useJsonToCsv()
useUrlInput(input)

const inputEditorRef = ref<InstanceType<typeof JsonEditor> | null>(null)

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
    title: 'When JSON data needs to become a spreadsheet',
    text: [
      'REST APIs return JSON, but analysts, PMs, and clients want CSV they can open in Excel or Google Sheets. Converting JSON to CSV bridges that gap instantly, without a Python script or an ETL pipeline.',
      'It\'s particularly useful for API responses that return flat arrays of records, which map naturally to CSV rows.',
    ],
  },
  {
    title: 'How column headers are derived',
    text: [
      'The converter scans the first object in the array and uses its keys as column headers. Every subsequent object is flattened to match.',
      'If your JSON array contains objects with different keys, you\'ll see empty cells where a key was absent, which is the correct, lossless representation in CSV. Nested objects are not supported; flatten them first if needed.',
    ],
  },
  {
    title: 'Use cases: reporting, exports, data handoff',
    text: [
      'Product teams export API data to CSV to build pivot tables without engineering help. Data analysts pull JSON from internal tools and drop it into BI platforms that require CSV import.',
      'Developers generate CSV fixtures from seed data for database migrations. All conversion happens in your browser, and nothing is sent to a server.',
    ],
  },
]
</script>
