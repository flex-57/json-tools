<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">XML <span class="title-arrow">→</span> JSON</h1>
        <p class="page-subtitle">Parse XML and convert it to JSON — paste text or drop a .xml file.</p>
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
          {{ copied ? 'Copied!' : 'Copy JSON' }}
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
          <span class="editor-label">XML Input</span>
          <span class="editor-hint">or drop a .xml file</span>
        </div>
        <div class="editor-body">
          <textarea v-model="input" placeholder="<root>&#10;  <name>Alice</name>&#10;  <age>30</age>&#10;</root>" class="editor-textarea" spellcheck="false" />
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
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useXmlToJson } from '~/composables/useXmlJson'
useSeoMeta({
  title: 'XML to JSON Converter — Free Online Tool',
  description: 'Convert XML to JSON instantly. Free online XML to JSON converter, no data sent to servers.',
  ogTitle: 'XML to JSON Converter — Free Online Tool',
  ogDescription: 'Convert XML to JSON instantly. Free online XML to JSON converter, no data sent to servers.',
  twitterTitle: 'XML to JSON Converter — Free Online Tool',
  twitterDescription: 'Convert XML to JSON instantly. Free online XML to JSON converter, no data sent to servers.',
  ogImage: 'https://jsontools.space/og/xml-to-json.png',
  twitterImage: 'https://jsontools.space/og/xml-to-json.png',
})
const { input, output, error, copied, convert, copy, clear } = useXmlToJson()

const seoCards = [
  {
    title: 'XML is still everywhere',
    text: 'Despite JSON\'s dominance, XML remains the backbone of enterprise systems, SOAP web services, RSS/Atom feeds, Office Open XML documents, and Android manifests. If you work with any of these — or integrate with a legacy ERP, a bank API, or an XML-based CMS — you\'ll need to convert XML to JSON to work with it in modern JavaScript or Python code.',
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
