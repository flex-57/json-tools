<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> XML</h1>
        <p class="page-subtitle">Convert a JSON object to XML. Paste or drop a .json file.</p>
      </div>
      <ToolSwitch from-path="/tools/xml-to-json" to-path="/tools/json-to-xml" from-label="XML → JSON" to-label="JSON → XML" />
    </div>

    <div class="dualpane">
      <div class="pane" :class="{ 'pane--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <span class="pane-label">JSON Input</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .json file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor v-model="input" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="midcol">
        <button class="mid-btn" title="Convert (Ctrl + Enter)" @click="convert">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>CONV</span>
        </button>
      </div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">XML Output</span>
          <div class="card-actions">
            <button class="btn-xs" @click="download" :disabled="!output">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" @click="copy" :disabled="!output">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;" aria-live="polite">
          <ClientOnly>
            <JsonEditor v-model="output" :readonly="true" lang="xml" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <div class="statusbar">
      <span><span class="led" :class="output && !error ? 'valid' : 'error'"></span>{{ output && !error ? 'Converted' : (error && error !== 'empty' ? error : 'Waiting for input') }}</span>
      <span>json-to-xml</span>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJsonToXml } from '~/composables/useXmlJson'
useToolSeo(
  'JSON to XML Converter: Generate Valid XML from JSON Online',
  'Convert JSON to XML instantly. Free online JSON to XML converter, no data sent to servers.',
)
const { input, output, error, copied, convert, copy, download, clear } = useJsonToXml()
useToolShortcut(convert)
useUrlInput(input, convert)

const seoCards = [
  {
    title: 'Why generate XML from JSON',
    text: 'Enterprise service buses, SOAP APIs, SAP integrations, and legacy B2B platforms often require XML payloads. If your application stores data as JSON but needs to talk to one of these systems, generating XML by hand is error-prone. Paste your JSON object, get valid XML back, and use it directly in your SOAP envelope or configuration file.',
  },
  {
    title: 'How JSON keys become XML elements',
    text: 'Each JSON key becomes an XML element name. String and number values become text content. Arrays produce repeated sibling elements with the same tag. Nested objects become nested elements. One constraint: XML element names cannot start with a number or contain spaces, so keep your JSON keys valid XML identifiers to get clean output.',
  },
  {
    title: 'Integration and config use cases',
    text: 'Developers use this to prototype SOAP request bodies before building a client library. Teams migrating data between systems generate XML configuration files from JSON seed data. QA engineers create XML test fixtures from JSON responses captured in staging. The download button lets you save the output directly as a .xml file.',
  },
]
const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string; convert() }
  reader.readAsText(file)
}
</script>
