<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> <span class="title-amp">Schema</span></h1>
        <p class="page-subtitle">Generate a JSON Schema (Draft-07 or 2020-12) from any JSON value — automatically, client-side.</p>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <button @click="copy" class="btn btn-primary" :class="{ 'btn--success': copied }" :disabled="!output">
          <svg v-if="!copied" width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
        <button @click="clear" class="btn btn-ghost">Clear</button>
      </div>
      <div class="toolbar-right">
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

        <!-- Draft selector -->
        <div class="draft-toggle">
          <div class="draft-indicator" :class="{ 'draft-indicator--right': draft === '2020-12' }" />
          <button :class="['draft-btn', draft === 'draft-07' ? 'draft-btn--active' : '']" @click="draft = 'draft-07'">Draft-07</button>
          <button :class="['draft-btn', draft === '2020-12' ? 'draft-btn--active' : '']" @click="draft = '2020-12'">2020-12</button>
        </div>
      </div>
    </div>

    <div class="editors">
      <div class="editor-card">
        <div class="editor-card-header">
          <span class="editor-label">JSON Input</span>
          <span class="editor-hint">paste or type JSON</span>
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
          <span class="editor-hint">{{ draft === 'draft-07' ? 'Draft-07' : 'Draft 2020-12' }}</span>
        </div>
        <div class="editor-body">
          <textarea
            :value="output"
            readonly
            class="editor-textarea"
            spellcheck="false"
            placeholder='{ "$schema": "http://json-schema.org/draft-07/schema#", "type": "object", ... }'
          />
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJsonSchema } from '~/composables/useJsonSchema'

useSeoMeta({
  title: 'JSON Schema Generator — Draft-07 & 2020-12 | JSON Tools',
  description: 'Generate a JSON Schema from any JSON value instantly. Infers types, required fields, and nested structures. Supports Draft-07 and Draft 2020-12. Free, no data sent to servers.',
  ogTitle: 'JSON Schema Generator — Draft-07 & 2020-12 | JSON Tools',
  ogDescription: 'Generate a JSON Schema from any JSON value instantly. Infers types, required fields, and nested structures. Supports Draft-07 and Draft 2020-12. Free, no data sent to servers.',
  twitterTitle: 'JSON Schema Generator — Draft-07 & 2020-12 | JSON Tools',
  twitterDescription: 'Generate a JSON Schema from any JSON value instantly. Infers types, required fields, and nested structures. Supports Draft-07 and Draft 2020-12. Free, no data sent to servers.',
})

const { input, draft, required, output, error, copied, copy, clear } = useJsonSchema()

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
.toggle-switch--on { background: #F97316; }
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
.draft-indicator--right { transform: translateX(calc(100% + 2px)); }
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
