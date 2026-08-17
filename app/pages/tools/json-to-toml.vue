<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> TOML</h1>
        <p class="page-subtitle">Convert JSON to TOML, entirely in your browser.</p>
        <NuxtLink to="/guides/what-is-toml" class="guide-link">New to TOML? Read our guide →</NuxtLink>
      </div>
      <ToolSwitch from-path="/tools/toml-to-json" to-path="/tools/json-to-toml" from-label="TOML → JSON" to-label="JSON → TOML" />
    </div>

    <Transition name="fade">
      <ErrorBanner
        v-if="error"
        :message="error"
        :line="errorLine"
        :column="errorColumn"
        @jump="errorLine && inputEditorRef?.scrollToLine(errorLine)"
      />
    </Transition>

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--drag': isDragging, 'pane--invalid': error }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <div class="pane-label-group">
            <span class="pane-label">JSON Input</span>
            <span class="hint">paste or type · or drop a .json file</span>
          </div>
          <div class="card-actions">
            <label class="btn-xs" for="json-to-toml-file-input">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M2 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Browse
            </label>
            <input id="json-to-toml-file-input" type="file" accept=".json,application/json" class="file-input" @change="onFileInput" >
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

      <div class="midcol"><SwapButton from-path="/tools/toml-to-json" to-path="/tools/json-to-toml" /></div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">TOML Output</span>
          <div class="card-actions">
            <button class="btn-xs" :disabled="!output" @click="download">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" :class="{ 'pane-body--empty': !output }" :style="output ? 'padding: 0;' : ''" aria-live="polite">
          <Transition name="reveal" mode="out-in">
            <p v-if="!output" key="empty" class="pane-body-placeholder">{{ input.trim() ? 'Fix the error in your input to see TOML output' : 'TOML output will appear here…' }}</p>
            <div v-else key="output" class="pane-body-editor-wrap">
              <ClientOnly>
                <JsonEditor v-model="output" :readonly="true" lang="toml" />
                <template #fallback><EditorSkeleton /></template>
              </ClientOnly>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <StatusBar>
      <span>
        <span class="led" :class="output && !error ? 'valid' : (error ? 'error' : 'neutral')"/>
        {{ output && !error ? 'Converted' : (error ? `Invalid${errorLine ? ` · Line ${errorLine}, Column ${errorColumn}` : ''}` : 'Waiting for input') }}
      </span>
      <span>json-to-toml</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['json-to-toml']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useJsonToToml } from '~/composables/useTomlJson'
import JsonEditor from '~/components/JsonEditor.vue'
import { TOOL_FAQS } from '~/data/tool-faqs'
useToolSeo(
  'JSON to TOML Converter: Export JSON as TOML Config Online',
  'Convert JSON to TOML instantly in your browser, generating valid TOML 1.0 output from objects, arrays, and nested tables. Free, no data sent to servers.',
  TOOL_FAQS['json-to-toml'],
)
const { input, output, error, errorLine, errorColumn, copied, copy, download, clear } = useJsonToToml()
useUrlInput(input)

const inputEditorRef = ref<InstanceType<typeof JsonEditor> | null>(null)

const seoCards = [
  {
    title: 'JSON to TOML: from API response to config file',
    text: [
      'When you\'re scaffolding a new Rust crate, Python package, or CLI tool, you often start from a JSON example (an API response, a design doc) and need it as a real Cargo.toml or pyproject.toml.',
      'This converter turns any JSON object into equivalent TOML: nested objects become tables, arrays of objects become arrays of tables ([[items]]).',
    ],
  },
  {
    title: 'What TOML cannot represent',
    text: 'TOML\'s type system is deliberately small, and two common JSON shapes have no TOML equivalent.',
    table: [
      { label: 'Top-level array', value: 'Not allowed — TOML documents must be a table (object) at the root' },
      { label: 'null', value: 'No null literal exists in TOML — remove the key or give it a real value' },
      { label: 'Nested objects & arrays', value: 'Fully supported, as tables and arrays of tables' },
    ],
  },
  {
    title: 'Why the converter refuses instead of guessing',
    text: [
      'Some TOML libraries silently drop null fields rather than erroring, which quietly changes your data. This tool checks for both cases first and tells you exactly which key is the problem, so nothing gets lost without you knowing.',
      'Everything runs locally: it is safe to paste config values that include internal package names or private registry URLs.',
    ],
  },
]
function loadFile(file: File) {
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}

const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) loadFile(file)
}

function onFileInput(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) loadFile(file)
  target.value = ''
}
</script>

<style scoped>
.file-input { display: none; }
</style>
