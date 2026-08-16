<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">YAML <span class="title-arrow">→</span> JSON</h1>
        <p class="page-subtitle">Convert YAML to JSON. Paste text or drop a .yaml / .yml file.</p>
        <NuxtLink to="/guides/json-vs-yaml" class="guide-link">JSON vs YAML: what's the difference? →</NuxtLink>
      </div>
      <ToolSwitch from-path="/tools/yaml-to-json" to-path="/tools/json-to-yaml" from-label="YAML → JSON" to-label="JSON → YAML" :min-width="235" />
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
          <span class="pane-label">YAML Input</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .yaml / .yml file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor ref="inputEditorRef" v-model="input" lang="yaml" :error-line="errorLine" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="midcol"><span class="mid-arrow"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>

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
            <p v-if="!output" key="empty" class="pane-body-placeholder">{{ input.trim() ? 'Fix the error in your input to see JSON output' : 'Paste YAML to see JSON output' }}</p>
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
      <span>yaml-to-json</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['yaml-to-json']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useYamlToJson } from '~/composables/useYamlJson'
import JsonEditor from '~/components/JsonEditor.vue'
import { TOOL_FAQS } from '~/data/tool-faqs'
useToolSeo(
  'YAML to JSON Converter Online: Parse YAML Files Free',
  'Convert YAML to JSON instantly in your browser. Parses nested mappings, sequences, and scalars with js-yaml. Free, no data sent to servers.',
  TOOL_FAQS['yaml-to-json'],
)
const { input, output, error, errorLine, errorColumn, copied, copy, download, clear } = useYamlToJson()
useUrlInput(input)

const inputEditorRef = ref<InstanceType<typeof JsonEditor> | null>(null)

const seoCards = [
  {
    title: 'YAML: the config language of the cloud',
    text: [
      'Kubernetes manifests, GitHub Actions workflows, Docker Compose files, Ansible playbooks, and Helm charts are all written in YAML. It\'s designed for humans to write, but programs consume JSON.',
      'When you need to read a Kubernetes resource in code, pass a GitHub Actions config to an API, or debug what a Helm chart resolves to, YAML-to-JSON is the first step.',
    ],
  },
  {
    title: 'What the conversion preserves and drops',
    text: 'Indentation and block style are irrelevant once parsed.',
    table: [
      { label: 'Comments', value: 'Dropped — no equivalent in JSON' },
      { label: 'Anchors & aliases', value: 'Resolved — output is fully expanded' },
      { label: 'Booleans / null', value: 'true/false and null/~ correctly typed — yes/no/on/off stay plain strings' },
    ],
  },
  {
    title: 'Debugging and introspection use cases',
    text: [
      'Platform engineers paste Kubernetes YAML into this tool to inspect the exact structure that kubectl apply will see, without running a cluster. Developers debug GitHub Actions by converting the workflow YAML to JSON and querying it with jq.',
      'DevOps teams validate Helm chart values.yaml by checking what a downstream template will receive. All parsing runs locally, so it\'s safe to paste your secrets.',
    ],
  },
]
const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}
</script>
