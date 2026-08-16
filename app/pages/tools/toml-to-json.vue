<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">TOML <span class="title-arrow">→</span> JSON</h1>
        <p class="page-subtitle">Convert TOML to JSON.</p>
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
            <span class="pane-label">TOML Input</span>
            <span class="hint">paste or type · or drop a .toml file</span>
          </div>
          <div class="card-actions">
            <label class="btn-xs" for="toml-to-json-file-input">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M2 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Browse
            </label>
            <input id="toml-to-json-file-input" type="file" accept=".toml" class="file-input" @change="onFileInput" >
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor ref="inputEditorRef" v-model="input" lang="toml" :error-line="errorLine" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="midcol"><span class="mid-arrow"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">JSON Output</span>
          <div class="card-actions">
            <button class="btn-xs" :disabled="!output" @click="download">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" :class="{ 'pane-body--empty': !output }" :style="output ? 'padding: 0;' : ''" aria-live="polite">
          <Transition name="reveal" mode="out-in">
            <p v-if="!output" key="empty" class="pane-body-placeholder">{{ input.trim() ? 'Fix the error in your input to see JSON output' : 'Paste TOML to see JSON output' }}</p>
            <div v-else key="output" class="pane-body-editor-wrap">
              <ClientOnly>
                <JsonEditor v-model="output" :readonly="true" />
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
      <span>toml-to-json</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['toml-to-json']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useTomlToJson } from '~/composables/useTomlJson'
import JsonEditor from '~/components/JsonEditor.vue'
import { TOOL_FAQS } from '~/data/tool-faqs'
useToolSeo(
  'TOML to JSON Converter Online: Parse TOML Files Free',
  'Convert TOML to JSON instantly in your browser. Parses tables, arrays, and inline tables per the TOML 1.0 spec. Free, no data sent to servers.',
  TOOL_FAQS['toml-to-json'],
)
const { input, output, error, errorLine, errorColumn, copied, copy, download, clear } = useTomlToJson()
useUrlInput(input)

const inputEditorRef = ref<InstanceType<typeof JsonEditor> | null>(null)

const seoCards = [
  {
    title: 'TOML: config files meant to be read by humans',
    text: [
      'TOML (Tom\'s Obvious Minimal Language) is the config format behind Cargo.toml (Rust), pyproject.toml (Python), and countless CLI tools. It was designed to map unambiguously to a hash table, so every parser produces the same structure.',
      'When you need to feed a Cargo.toml or pyproject.toml into a script, or inspect what a tool\'s config actually resolves to, converting it to JSON is the fastest way to see the real shape.',
    ],
  },
  {
    title: 'What the conversion preserves',
    text: 'TOML has a small, strict type system that maps cleanly onto JSON.',
    table: [
      { label: 'Tables & nested tables', value: 'Become nested JSON objects' },
      { label: 'Arrays of tables ([[x]])', value: 'Become JSON arrays of objects' },
      { label: 'Dates & date-times', value: 'Converted to ISO 8601 strings' },
      { label: 'Comments', value: 'Dropped — no equivalent in JSON' },
    ],
  },
  {
    title: 'Common use cases',
    text: [
      'Rust developers paste a Cargo.toml here to check exactly which dependency versions and features a workspace resolves to. Python developers do the same with pyproject.toml to debug build-system or tool configuration.',
      'Because parsing runs entirely in your browser, it is safe to paste config files that contain internal package names or private registry URLs.',
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
