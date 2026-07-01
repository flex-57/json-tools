<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> <span class="title-amp">Schema</span></h1>
        <p class="page-subtitle">Generate a JSON Schema (Draft-07 or 2020-12) from any JSON value — automatically, client-side.</p>
        <NuxtLink to="/guides/how-to-validate-json" class="guide-link">Learn how JSON validation works →</NuxtLink>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
      </div>
      <div class="toolbar-right" aria-live="polite">
        <Transition name="status">
          <div v-if="error" class="status-pill status-pill--invalid">
            <span class="status-dot" /><span class="status-text">{{ error }}</span>
          </div>
          <div v-else-if="output" class="status-pill status-pill--valid">
            <span class="status-dot" /><span>Ready</span>
          </div>
        </Transition>

        <!-- Required toggle -->
        <label class="toggle-row">
          <span class="option-label">Required</span>
          <button
            class="toggle-switch"
            :class="{ 'toggle-switch--on': required }"
            @click="required = !required"
            :aria-pressed="required"
            aria-label="Include required fields"
          >
            <span class="toggle-thumb" />
          </button>
        </label>

      </div>
    </div>

    <div class="editors">
      <div class="editor-card" :class="{ 'editor-card--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="editor-card-header">
          <span class="editor-label">JSON Input</span>
          <div class="card-actions">
            <span class="editor-hint">paste or type · or drop a .json file</span>
            <button class="btn-xs" @click="clear">Clear</button>
          </div>
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
          <span class="editor-label">JSON Schema</span>
          <div class="card-actions">
            <div class="draft-toggle">
              <div class="draft-indicator" :class="{ 'draft-indicator--right': draft === '2020-12' }" />
              <button :class="['draft-btn', draft === 'draft-07' ? 'draft-btn--active' : '']" @click="draft = 'draft-07'">Draft-07</button>
              <button :class="['draft-btn', draft === '2020-12' ? 'draft-btn--active' : '']" @click="draft = '2020-12'">2020-12</button>
            </div>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" @click="copy" :disabled="!output">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
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
import { useJsonSchema } from '~/composables/useJsonSchema'

useToolSeo(
  'JSON Schema Generator — Draft-07 & 2020-12 | JSON Tools',
  'Generate a JSON Schema from any JSON value instantly. Infers types, required fields, and nested structures. Supports Draft-07 and Draft 2020-12. Free, no data sent to servers.',
)

const { input, draft, required, output, error, copied, copy, clear } = useJsonSchema()

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
    text: 'The generator traverses your JSON recursively. Each primitive maps to its JSON Schema type: strings become {"type":"string"}, integers {"type":"integer"}, floats {"type":"number"}, booleans {"type":"boolean"}, and null {"type":"null"}. Objects become {"type":"object","properties":{...}} with a required array listing all present keys. Arrays are typed by their elements: if all items share the same structure, a single schema is inferred; mixed arrays produce {"oneOf":[...]}. Arrays of objects merge all item schemas — keys present in every item are required, keys present in only some are not.',
  },
  {
    title: 'After generation: refine and validate',
    text: 'The generated schema is a structural starting point. You will usually want to add constraints: use minLength/maxLength for strings, minimum/maximum for numbers, pattern for regex-validated strings, format for emails or dates, and enum for fixed value sets. Set additionalProperties: false on objects to reject unknown keys. To validate your JSON against the schema, paste both into an online validator or use a library like Ajv (npm install ajv). For API schemas, consider generating from your OpenAPI spec with tools like openapi-typescript rather than from example JSON.',
  },
]
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.toolbar-left  { display: flex; align-items: center; gap: 8px; }
.toolbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

/* Status pills */
.status-pill {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 500;
  padding: 4px 10px; border-radius: 20px; white-space: nowrap;
}
.status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.status-pill--valid   { background: #F0FDF4; color: #15803D; border: 1px solid #BBF7D0; }
.status-pill--valid   .status-dot { background: #22C55E; }
.status-pill--invalid { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
.status-pill--invalid .status-dot { background: #EF4444; }
.status-enter-active, .status-leave-active { transition: opacity 0.15s, transform 0.15s; }
.status-enter-from, .status-leave-to { opacity: 0; transform: translateX(4px); }

/* Toggle switch */
.toggle-row { display: flex; align-items: center; gap: 7px; cursor: pointer; }
.toggle-switch {
  position: relative; width: 32px; height: 18px;
  border-radius: 9px; border: none; cursor: pointer;
  background: var(--c-border-m); transition: background 0.18s;
  flex-shrink: 0;
}
.toggle-switch--on { background: var(--c-brand); }
.toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 12px; height: 12px; border-radius: 50%;
  background: #fff;
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toggle-switch--on .toggle-thumb { transform: translateX(14px); }

/* Draft toggle */
.draft-toggle {
  position: relative; display: flex;
  background: var(--c-subtle); border: 1px solid var(--c-border);
  border-radius: 8px; padding: 2px;
}
.draft-indicator {
  position: absolute; top: 2px; left: 2px;
  width: calc(50% - 2px); bottom: 2px;
  background: #1A1916; border-radius: 6px;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.draft-indicator--right { transform: translateX(100%); }
.draft-btn {
  flex: 1;
  position: relative; z-index: 1;
  border: none; background: transparent;
  font-size: 12px; font-weight: 600;
  padding: 5px 12px; border-radius: 6px; cursor: pointer;
  color: var(--c-t4); transition: color 0.15s; white-space: nowrap;
}
.draft-btn--active { color: white; }

@media (max-width: 768px) {
  .toolbar-right { margin-left: 0; }
  .status-pill { display: none; }
}
</style>
