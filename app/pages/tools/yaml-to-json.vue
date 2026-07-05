<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">YAML <span class="title-arrow">→</span> JSON</h1>
        <p class="page-subtitle">Convert YAML to JSON — paste text or drop a .yaml / .yml file.</p>
        <NuxtLink to="/guides/json-vs-yaml" class="guide-link">JSON vs YAML: what's the difference? →</NuxtLink>
      </div>
      <ToolSwitch from-path="/tools/yaml-to-json" to-path="/tools/json-to-yaml" from-label="YAML → JSON" to-label="JSON → YAML" />
    </div>

    <div class="dualpane">
      <div class="pane" :class="{ 'pane--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <span class="pane-label">YAML Input</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .yaml / .yml file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor v-model="input" lang="yaml" />
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
      <span>yaml-to-json</span>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useYamlToJson } from '~/composables/useYamlJson'
useToolSeo(
  'YAML to JSON Converter Online — Parse YAML Files Free',
  'Convert YAML to JSON instantly. Free online YAML to JSON converter, no data sent to servers.',
)
const { input, output, error, copied, convert, copy, download, clear } = useYamlToJson()
useToolShortcut(convert)
useUrlInput(input, convert)

const seoCards = [
  {
    title: 'YAML: the config language of the cloud',
    text: 'Kubernetes manifests, GitHub Actions workflows, Docker Compose files, Ansible playbooks, and Helm charts are all written in YAML. It\'s designed for humans to write — but programs consume JSON. When you need to read a Kubernetes resource in code, pass a GitHub Actions config to an API, or debug what a Helm chart resolves to, YAML-to-JSON is the first step.',
  },
  {
    title: 'What the conversion preserves and drops',
    text: 'YAML comments are not part of the data model and are dropped — JSON has no equivalent. YAML anchors (&) and aliases (*) are resolved before conversion, so the JSON output is fully expanded. YAML booleans (true/false/yes/no) and null values (null/~) are correctly typed in the JSON output. Indentation and block style are irrelevant once parsed.',
  },
  {
    title: 'Debugging and introspection use cases',
    text: 'Platform engineers paste Kubernetes YAML into this tool to inspect the exact structure that kubectl apply will see, without running a cluster. Developers debug GitHub Actions by converting the workflow YAML to JSON and querying it with jq. DevOps teams validate Helm chart values.yaml by checking what a downstream template will receive. All parsing runs locally — paste your secrets safely.',
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
