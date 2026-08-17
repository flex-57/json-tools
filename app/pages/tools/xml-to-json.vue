<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">XML <span class="title-arrow">→</span> JSON</h1>
        <p class="page-subtitle">Parse XML and convert it to JSON, entirely in your browser.</p>
      </div>
      <ToolSwitch from-path="/tools/xml-to-json" to-path="/tools/json-to-xml" from-label="XML → JSON" to-label="JSON → XML" />
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
            <span class="pane-label">XML Input</span>
            <span class="hint">paste or type · or drop a .xml file</span>
          </div>
          <div class="card-actions">
            <label class="btn-xs" for="xml-to-json-file-input">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M2 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Browse
            </label>
            <input id="xml-to-json-file-input" type="file" accept=".xml,text/xml,application/xml" class="file-input" @change="onFileInput" >
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor ref="inputEditorRef" v-model="input" lang="xml" :error-line="errorLine" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="midcol"><SwapButton from-path="/tools/xml-to-json" to-path="/tools/json-to-xml" /></div>

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
            <p v-if="!output" key="empty" class="pane-body-placeholder">{{ input.trim() ? 'Fix the error in your input to see JSON output' : 'JSON output will appear here…' }}</p>
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
      <span>xml-to-json</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['xml-to-json']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useXmlToJson } from '~/composables/useXmlJson'
import JsonEditor from '~/components/JsonEditor.vue'
import { TOOL_FAQS } from '~/data/tool-faqs'
useToolSeo(
  'XML to JSON Converter Online: Parse & Transform XML Free',
  'Convert XML to JSON instantly in your browser. Preserves attributes (prefixed with @) and nested elements as objects or arrays. Free, no data sent to servers.',
  TOOL_FAQS['xml-to-json'],
)
const { input, output, error, errorLine, errorColumn, copied, copy, download, clear } = useXmlToJson()
useUrlInput(input)

const inputEditorRef = ref<InstanceType<typeof JsonEditor> | null>(null)

const seoCards = [
  {
    title: 'XML is still everywhere',
    text: [
      'Despite JSON\'s dominance, XML remains the backbone of enterprise systems, SOAP web services, RSS/Atom feeds, Office Open XML documents, and Android manifests.',
      'If you work with any of these, or integrate with a legacy ERP, a bank API, or an XML-based CMS, you\'ll need to convert XML to JSON to work with it in modern JavaScript or Python code.',
    ],
  },
  {
    title: 'How XML maps to JSON',
    text: 'The converter handles these conventions automatically, so you get a predictable structure you can traverse with standard JSON tooling.',
    table: [
      { label: 'Element', value: 'Becomes a JSON object key' },
      { label: 'Attribute', value: 'Prefixed (e.g. @attr) to distinguish from children' },
      { label: 'Repeated sibling', value: 'Becomes an array' },
      { label: 'Text-only node', value: 'Becomes a string value' },
    ],
  },
  {
    title: 'Typical workflows',
    text: [
      'Backend developers convert SOAP responses to JSON before passing them to a React front-end. DevOps engineers parse Maven POM files or Ant build scripts to extract dependency information.',
      'Content teams convert RSS feeds to JSON to feed a Next.js blog or newsletter. Because parsing runs locally, XML documents containing internal data never leave your machine.',
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
