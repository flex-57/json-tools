<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">YAML <span class="title-arrow">→</span> JSON</h1>
        <p class="page-subtitle">Convert YAML to JSON — paste text or drop a .yaml / .yml file.</p>
      </div>
      <ToolSwitch from-path="/tools/yaml-to-json" to-path="/tools/json-to-yaml" from-label="YAML → JSON" to-label="JSON → YAML" />
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
          <span class="editor-label">YAML Input</span>
          <span class="editor-hint">or drop a .yaml / .yml file</span>
        </div>
        <div class="editor-body">
          <textarea v-model="input" placeholder="name: Alice&#10;age: 30&#10;skills:&#10;  - PHP&#10;  - Vue" class="editor-textarea" spellcheck="false" />
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
import { useYamlToJson } from '~/composables/useYamlJson'
useSeoMeta({ title: 'YAML to JSON Converter — Free Online Tool', description: 'Convert YAML to JSON instantly. Free online YAML to JSON converter, no data sent to servers.' })
const { input, output, error, copied, convert, copy, clear } = useYamlToJson()

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
