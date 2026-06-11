<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> XML</h1>
        <p class="page-subtitle">Convert a JSON object to XML — paste or drop a .json file.</p>
      </div>
      <ToolSwitch from-path="/tools/xml-to-json" to-path="/tools/json-to-xml" from-label="XML → JSON" to-label="JSON → XML" />
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
          {{ copied ? 'Copied!' : 'Copy XML' }}
        </button>
        <button @click="download" class="btn btn-secondary" :disabled="!output">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v7M4 6l3 3 3-3M2 11h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Download
        </button>
        <button @click="clear" class="btn btn-ghost">Clear</button>
      </div>
      <div class="toolbar-right">
        <Transition name="status">
          <div v-if="error && error !== 'empty'" class="status-pill status-pill--invalid">
            <span class="status-dot" /><span class="status-text">{{ error }}</span>
          </div>
          <div v-else-if="output" class="status-pill status-pill--valid">
            <span class="status-dot" /><span>Converted</span>
          </div>
        </Transition>
      </div>
    </div>

    <div class="editors">
      <div class="editor-card" :class="{ 'editor-card--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="editor-card-header">
          <span class="editor-label">JSON Input</span>
          <span class="editor-hint">or drop a .json file</span>
        </div>
        <div class="editor-body">
          <ClientOnly>
            <JsonEditor v-model="input" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
      <div class="editor-card editor-card--output">
        <div class="editor-card-header">
          <span class="editor-label">XML Output</span>
          <span class="editor-hint">Result</span>
        </div>
        <div class="editor-body">
          <textarea v-model="output" readonly class="editor-textarea" spellcheck="false" />
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJsonToXml } from '~/composables/useXmlJson'
useSeoMeta({ title: 'JSON to XML Converter — Free Online Tool', description: 'Convert JSON to XML instantly. Free online JSON to XML converter, no data sent to servers.' })
const { input, output, error, copied, convert, copy, download, clear } = useJsonToXml()

const seoCards = [
  {
    title: 'Why generate XML from JSON',
    text: 'Enterprise service buses, SOAP APIs, SAP integrations, and legacy B2B platforms often require XML payloads. If your application stores data as JSON but needs to talk to one of these systems, generating XML by hand is error-prone. Paste your JSON object, get valid XML back, and use it directly in your SOAP envelope or configuration file.',
  },
  {
    title: 'How JSON keys become XML elements',
    text: 'Each JSON key becomes an XML element name. String and number values become text content. Arrays produce repeated sibling elements with the same tag. Nested objects become nested elements. One constraint: XML element names cannot start with a number or contain spaces — keep your JSON keys valid XML identifiers to get clean output.',
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
