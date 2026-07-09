<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> <span class="title-amp">Schema</span></h1>
        <p class="page-subtitle">Generate a JSON Schema (Draft-07 or 2020-12) from any JSON value, automatically and client-side.</p>
        <NuxtLink to="/guides/how-to-validate-json" class="guide-link">Learn how JSON validation works →</NuxtLink>
      </div>
      <div class="mode-toggle" style="min-width: 200px;">
        <div class="mode-indicator" :class="{ 'mode-indicator--right': draft === '2020-12' }"></div>
        <button class="mode-btn" :class="{ 'mode-btn--active': draft === 'draft-07' }" @click="draft = 'draft-07'">Draft-07</button>
        <button class="mode-btn" :class="{ 'mode-btn--active': draft === '2020-12' }" @click="draft = '2020-12'">2020-12</button>
      </div>
    </div>

    <div class="dualpane no-mid">
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

      <div class="midcol"><span class="mid-arrow"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">JSON Schema</span>
          <div class="card-actions">
            <label class="toggle-wrap">
              <input type="checkbox" class="toggle-input" v-model="required" />
              <span class="toggle-track"><span class="toggle-thumb" /></span>
              <span class="toggle-label">Required</span>
            </label>
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
      <span><span class="led" :class="output && !error ? 'valid' : 'error'"></span>{{ error || (output ? 'Ready' : 'Waiting for input') }}</span>
      <span>json-schema</span>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJsonSchema } from '~/composables/useJsonSchema'

useToolSeo(
  'JSON Schema Generator: Auto-Infer Draft-07 & 2020-12',
  'Generate a JSON Schema from any JSON value instantly. Infers types, required fields, and nested structures. Supports Draft-07 and Draft 2020-12. Free, no data sent to servers.',
)

const { input, draft, required, output, error, copied, copy, clear, download } = useJsonSchema()

const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}

const seoCards = [
  {
    title: 'What is JSON Schema?',
    text: 'JSON Schema is a vocabulary for annotating and validating JSON data. A schema document describes the expected structure of a JSON value: which keys are required, what types are allowed, and how nested objects and arrays are shaped. It is supported by validators in every major language (Ajv for JavaScript, jsonschema for Python, networknt for Go) and used in OpenAPI specs, VS Code settings, GitHub Actions, and many API platforms. Draft-07 is the most widely supported version. Draft 2020-12 is the latest stable specification.',
  },
  {
    title: 'How the inference works',
    text: 'The generator traverses your JSON recursively. Each primitive maps to its JSON Schema type: strings become {"type":"string"}, integers {"type":"integer"}, floats {"type":"number"}, booleans {"type":"boolean"}, and null {"type":"null"}. Objects become {"type":"object","properties":{...}} with a required array listing all present keys. Arrays are typed by their elements: if all items share the same structure, a single schema is inferred; mixed arrays produce {"oneOf":[...]}. Arrays of objects merge all item schemas: keys present in every item are required, keys present in only some are not.',
  },
  {
    title: 'After generation: refine and validate',
    text: 'The generated schema is a structural starting point. You will usually want to add constraints: use minLength/maxLength for strings, minimum/maximum for numbers, pattern for regex-validated strings, format for emails or dates, and enum for fixed value sets. Set additionalProperties: false on objects to reject unknown keys. To validate your JSON against the schema, paste both into an online validator or use a library like Ajv (npm install ajv). For API schemas, consider generating from your OpenAPI spec with tools like openapi-typescript rather than from example JSON.',
  },
]
</script>
