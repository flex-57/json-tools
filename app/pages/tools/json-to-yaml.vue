<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> YAML</h1>
        <p class="page-subtitle">Convert JSON to YAML.</p>
        <NuxtLink to="/guides/json-vs-yaml" class="guide-link">JSON vs YAML: what's the difference? →</NuxtLink>
      </div>
      <ToolSwitch from-path="/tools/yaml-to-json" to-path="/tools/json-to-yaml" from-label="YAML → JSON" to-label="JSON → YAML" />
    </div>

    <Transition name="fade">
      <ErrorBanner
        v-if="error"
        :message="errorTip || error"
        :line="errorLine"
        :column="errorColumn"
        @jump="errorLine && inputEditorRef?.scrollToLine(errorLine)"
      />
    </Transition>

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--drag': isDragging, 'pane--invalid': error }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <div class="pane-label-group">
            <span class="pane-label">JSON Input</span>
            <span class="hint">paste or type · or drop a .json file</span>
          </div>
          <div class="card-actions">
            <label class="btn-xs" for="json-to-yaml-file-input">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M2 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Browse
            </label>
            <input id="json-to-yaml-file-input" type="file" accept=".json,application/json" class="file-input" @change="onFileInput" >
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor ref="inputEditorRef" v-model="input" :error-line="errorLine" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="midcol"><span class="mid-arrow"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>

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
            <button class="btn-xs" :disabled="!output" @click="download">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" :class="{ 'pane-body--empty': !output }" :style="output ? 'padding: 0;' : ''" aria-live="polite">
          <Transition name="reveal" mode="out-in">
            <p v-if="!output" key="empty" class="pane-body-placeholder">{{ input.trim() ? 'Fix the error in your input to see YAML output' : 'Paste JSON to see YAML output' }}</p>
            <div v-else key="output" class="pane-body-editor-wrap">
              <ClientOnly>
                <JsonEditor v-model="output" :readonly="true" lang="yaml" />
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
      <span>json-to-yaml</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['json-to-yaml']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useJsonToYaml } from '~/composables/useYamlJson'
import JsonEditor from '~/components/JsonEditor.vue'
import { TOOL_FAQS } from '~/data/tool-faqs'
useToolSeo(
  'JSON to YAML Converter: Export JSON as YAML Config Online',
  'Convert JSON to readable YAML instantly in your browser, with proper indentation for nested objects and arrays. Free, no data sent to servers.',
  TOOL_FAQS['json-to-yaml'],
)
const { input, output, error, errorTip, errorLine, errorColumn, indent, copied, copy, download, clear } = useJsonToYaml()
useUrlInput(input)

const inputEditorRef = ref<InstanceType<typeof JsonEditor> | null>(null)

const seoCards = [
  {
    title: 'JSON to YAML: from API to config',
    text: [
      'REST APIs return JSON, but the infrastructure that runs your app is configured in YAML. Kubernetes resource specs, GitHub Actions inputs, Ansible vars files, and Terraform module configs are all YAML.',
      'When you\'re scaffolding a new deployment from an API response or translating a JSON schema into a config template, converting JSON to YAML is the fastest path.',
    ],
  },
  {
    title: 'Indentation and type serialization',
    text: [
      'YAML is sensitive to indentation: it\'s part of the syntax. The converter lets you choose 2-space or 4-space indent to match your team\'s style.',
      'JSON strings become unquoted YAML scalars where possible. Booleans, numbers, and null values are emitted without quotes. If a string value looks like a YAML keyword (e.g., "true"), it will be quoted to preserve the type.',
    ],
  },
  {
    title: 'Scaffolding and templating use cases',
    text: [
      'Infrastructure engineers convert JSON Terraform state output to YAML to populate Ansible inventory files. Backend developers generate Kubernetes ConfigMap data from a JSON config object.',
      'Technical writers convert JSON API examples to YAML for documentation that targets Swagger or AsyncAPI. Use the Download button to save the output as a .yaml file ready to commit.',
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
