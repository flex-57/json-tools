<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> <span class="title-amp">Schema</span></h1>
        <p class="page-subtitle">Generate a JSON Schema (Draft-07 or 2020-12) from any JSON value, automatically and client-side.</p>
        <NuxtLink to="/guides/how-to-validate-json" class="guide-link">Learn how JSON validation works →</NuxtLink>
      </div>
      <div class="mode-toggle">
        <div class="mode-indicator" :class="{ 'mode-indicator--right': draft === '2020-12' }"/>
        <button class="mode-btn" :class="{ 'mode-btn--active': draft === 'draft-07' }" @click="draft = 'draft-07'">Draft-07</button>
        <button class="mode-btn" :class="{ 'mode-btn--active': draft === '2020-12' }" @click="draft = '2020-12'">2020-12</button>
      </div>
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
            <label class="btn-xs" for="json-schema-file-input">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M2 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Browse
            </label>
            <input id="json-schema-file-input" type="file" accept=".json,application/json" class="file-input" @change="onFileInput" >
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
          <span class="pane-label">JSON Schema</span>
          <div class="card-actions">
            <label class="toggle-wrap">
              <input v-model="required" type="checkbox" class="toggle-input" >
              <span class="toggle-track"><span class="toggle-thumb" /></span>
              <span class="toggle-label">Required</span>
            </label>
            <button class="btn-xs" :disabled="!output" @click="download">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" :class="{ 'pane-body--empty': !output }" :style="output ? 'padding: 0;' : ''" aria-live="polite">
          <Transition name="reveal" mode="out-in">
            <p v-if="!output" key="empty" class="pane-body-placeholder">{{ input.trim() ? 'Fix the error in your input to see the schema' : 'Paste JSON to see the schema' }}</p>
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
        {{ error ? `Invalid${errorLine ? ` · Line ${errorLine}, Column ${errorColumn}` : ''}` : (output ? 'Ready' : 'Waiting for input') }}
      </span>
      <span>json-schema</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['json-schema']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useJsonSchema } from '~/composables/useJsonSchema'
import JsonEditor from '~/components/JsonEditor.vue'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'JSON Schema Generator: Auto-Infer Draft-07 & 2020-12',
  'Generate a JSON Schema from any JSON value instantly. Infers types, required fields, and nested structures. Supports Draft-07 and Draft 2020-12. Free, no data sent to servers.',
  TOOL_FAQS['json-schema'],
)

const { input, draft, required, output, error, errorTip, errorLine, errorColumn, copied, copy, clear, download } = useJsonSchema()
useUrlInput(input)

const inputEditorRef = ref<InstanceType<typeof JsonEditor> | null>(null)

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

const seoCards = [
  {
    title: 'What is JSON Schema?',
    text: [
      'JSON Schema is a vocabulary for annotating and validating JSON data. A schema document describes the expected structure of a JSON value: which keys are required, what types are allowed, and how nested objects and arrays are shaped.',
      'It is supported by validators in every major language (Ajv for JavaScript, jsonschema for Python, networknt for Go) and used in OpenAPI specs, VS Code settings, GitHub Actions, and many API platforms. Draft-07 is the most widely supported version; Draft 2020-12 is the latest stable specification.',
    ],
  },
  {
    title: 'How the inference works',
    text: 'The generator traverses your JSON recursively. Arrays are typed by their elements: if all items share the same structure, a single schema is inferred; mixed arrays produce {"oneOf":[...]}.',
    table: [
      { label: 'string', value: '{"type":"string"}' },
      { label: 'integer', value: '{"type":"integer"}' },
      { label: 'float', value: '{"type":"number"}' },
      { label: 'boolean', value: '{"type":"boolean"}' },
      { label: 'null', value: '{"type":"null"}' },
      { label: 'object', value: '{"type":"object","properties":{...}} + required[]' },
    ],
  },
  {
    title: 'After generation: refine and validate',
    text: 'The generated schema is a structural starting point. To validate your JSON against it, paste both into an online validator or use a library like Ajv (npm install ajv). For API schemas, consider generating from your OpenAPI spec with tools like openapi-typescript rather than from example JSON.',
    table: [
      { label: 'minLength', value: 'maxLength — bounds for strings' },
      { label: 'minimum', value: 'maximum — bounds for numbers' },
      { label: 'pattern', value: 'regex-validated strings' },
      { label: 'format', value: 'emails, dates, and other known shapes' },
      { label: 'enum', value: 'fixed set of allowed values' },
      { label: 'additionalProperties', value: 'false — reject unknown keys' },
    ],
  },
]
</script>

<style scoped>
.file-input { display: none; }
</style>
