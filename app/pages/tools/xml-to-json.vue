<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">XML <span class="title-arrow">→</span> JSON</h1>
        <p class="page-subtitle">Parse XML and convert it to JSON. Paste text or drop a .xml file.</p>
      </div>
      <ToolSwitch from-path="/tools/xml-to-json" to-path="/tools/json-to-xml" from-label="XML → JSON" to-label="JSON → XML" />
    </div>

    <div class="dualpane">
      <div class="pane" :class="{ 'pane--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <span class="pane-label">XML Input</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .xml file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor v-model="input" lang="xml" />
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
          <span class="pane-label">JSON Output</span>
          <div class="card-actions">
            <button class="btn-xs" @click="download" :disabled="!output">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" @click="copy" :disabled="!output">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor v-model="output" :readonly="true" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <div class="statusbar">
      <span><span class="led" :class="output && !error ? 'valid' : 'error'"></span>{{ output && !error ? 'Converted' : (error && error !== 'empty' ? error : 'Waiting for input') }}</span>
      <span>xml-to-json</span>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useXmlToJson } from '~/composables/useXmlJson'
useToolSeo(
  'XML to JSON Converter Online: Parse & Transform XML Free',
  'Convert XML to JSON instantly. Free online XML to JSON converter, no data sent to servers.',
)
const { input, output, error, copied, convert, copy, download, clear } = useXmlToJson()
useToolShortcut(convert)
useUrlInput(input, convert)

const seoCards = [
  {
    title: 'XML is still everywhere',
    text: 'Despite JSON\'s dominance, XML remains the backbone of enterprise systems, SOAP web services, RSS/Atom feeds, Office Open XML documents, and Android manifests. If you work with any of these, or integrate with a legacy ERP, a bank API, or an XML-based CMS, you\'ll need to convert XML to JSON to work with it in modern JavaScript or Python code.',
  },
  {
    title: 'How XML maps to JSON',
    text: 'XML elements become JSON object keys. Attributes are typically prefixed (e.g., @attr) to distinguish them from child elements. Repeated sibling elements become arrays. Text-only nodes become string values. The converter handles these conventions automatically, so you get a predictable structure you can traverse with standard JSON tooling.',
  },
  {
    title: 'Typical workflows',
    text: 'Backend developers convert SOAP responses to JSON before passing them to a React front-end. DevOps engineers parse Maven POM files or Ant build scripts to extract dependency information. Content teams convert RSS feeds to JSON to feed a Next.js blog or newsletter. Because parsing runs locally, XML documents containing internal data never leave your machine.',
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
