<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> YAML</h1>
        <p class="page-subtitle">Convert JSON to YAML — paste or drop a .json file.</p>
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
          {{ copied ? 'Copied!' : 'Copy YAML' }}
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
        <div class="option-wrap">
          <label class="option-label">Indent</label>
          <select v-model="indent" class="option-select">
            <option :value="2">2 spaces</option>
            <option :value="4">4 spaces</option>
          </select>
        </div>
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
          <span class="editor-label">YAML Output</span>
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
import { useJsonToYaml } from '~/composables/useYamlJson'
useSeoMeta({ title: 'JSON to YAML Converter — Free Online Tool', description: 'Convert JSON to YAML instantly. Free online JSON to YAML converter, no data sent to servers.' })
const { input, output, error, indent, copied, convert, copy, download, clear } = useJsonToYaml()

const seoCards = [
  {
    title: 'JSON to YAML: from API to config',
    text: 'REST APIs return JSON, but the infrastructure that runs your app is configured in YAML. Kubernetes resource specs, GitHub Actions inputs, Ansible vars files, and Terraform module configs are all YAML. When you\'re scaffolding a new deployment from an API response or translating a JSON schema into a config template, converting JSON to YAML is the fastest path.',
  },
  {
    title: 'Indentation and type serialization',
    text: 'YAML is sensitive to indentation — it\'s part of the syntax. The converter lets you choose 2-space or 4-space indent to match your team\'s style. JSON strings become unquoted YAML scalars where possible. Booleans, numbers, and null values are emitted without quotes. If a string value looks like a YAML keyword (e.g., "true"), it will be quoted to preserve the type.',
  },
  {
    title: 'Scaffolding and templating use cases',
    text: 'Infrastructure engineers convert JSON Terraform state output to YAML to populate Ansible inventory files. Backend developers generate Kubernetes ConfigMap data from a JSON config object. Technical writers convert JSON API examples to YAML for documentation that targets Swagger or AsyncAPI. Use the Download button to save the output as a .yaml file ready to commit.',
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
