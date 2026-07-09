<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> YAML</h1>
        <p class="page-subtitle">Convert JSON to YAML. Paste or drop a .json file.</p>
        <NuxtLink to="/guides/json-vs-yaml" class="guide-link">JSON vs YAML: what's the difference? →</NuxtLink>
      </div>
      <ToolSwitch from-path="/tools/yaml-to-json" to-path="/tools/json-to-yaml" from-label="YAML → JSON" to-label="JSON → YAML" />
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
          <span class="pane-label">YAML Output</span>
          <div class="card-actions">
            <div class="option-wrap">
              <label class="option-label">Indent</label>
              <select v-model="indent" class="option-select">
                <option :value="2">2 spaces</option>
                <option :value="4">4 spaces</option>
              </select>
            </div>
            <button class="btn-xs" @click="download" :disabled="!output">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" @click="copy" :disabled="!output">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;" aria-live="polite">
          <ClientOnly>
            <JsonEditor v-model="output" :readonly="true" lang="yaml" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <div class="statusbar">
      <span><span class="led" :class="output && !error ? 'valid' : 'error'"></span>{{ output && !error ? 'Converted' : (error && error !== 'empty' ? error : 'Waiting for input') }}</span>
      <span>json-to-yaml</span>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJsonToYaml } from '~/composables/useYamlJson'
useToolSeo(
  'JSON to YAML Converter: Export JSON as YAML Config Online',
  'Convert JSON to YAML instantly. Free online JSON to YAML converter, no data sent to servers.',
)
const { input, output, error, indent, copied, convert, copy, download, clear } = useJsonToYaml()
useToolShortcut(convert)
useUrlInput(input, convert)

const seoCards = [
  {
    title: 'JSON to YAML: from API to config',
    text: 'REST APIs return JSON, but the infrastructure that runs your app is configured in YAML. Kubernetes resource specs, GitHub Actions inputs, Ansible vars files, and Terraform module configs are all YAML. When you\'re scaffolding a new deployment from an API response or translating a JSON schema into a config template, converting JSON to YAML is the fastest path.',
  },
  {
    title: 'Indentation and type serialization',
    text: 'YAML is sensitive to indentation: it\'s part of the syntax. The converter lets you choose 2-space or 4-space indent to match your team\'s style. JSON strings become unquoted YAML scalars where possible. Booleans, numbers, and null values are emitted without quotes. If a string value looks like a YAML keyword (e.g., "true"), it will be quoted to preserve the type.',
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
