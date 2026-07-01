<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> <span class="title-amp">TypeScript</span></h1>
        <p class="page-subtitle">Generate TypeScript interfaces or Zod schemas from any JSON — automatically, client-side.</p>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <div class="mode-toggle">
          <div class="mode-indicator" :class="{ 'mode-indicator--right': mode === 'zod' }" />
          <button :class="['mode-btn', mode === 'ts' ? 'mode-btn--active' : '']" @click="mode = 'ts'">TypeScript</button>
          <button :class="['mode-btn', mode === 'zod' ? 'mode-btn--active' : '']" @click="mode = 'zod'">Zod</button>
        </div>
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

        <div class="toolbar-sep" />

        <!-- Root name -->
        <div class="root-wrap">
          <label class="option-label">Name</label>
          <input v-model="rootName" class="root-input" placeholder="Root" spellcheck="false" />
        </div>
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
          <span class="editor-label">Output</span>
          <div class="card-actions">
            <template v-if="mode === 'ts'">
              <label class="toggle-wrap">
                <input type="checkbox" class="toggle-input" v-model="readonlyFields" />
                <span class="toggle-track"><span class="toggle-thumb" /></span>
                <span class="toggle-label">readonly</span>
              </label>
              <label class="toggle-wrap">
                <input type="checkbox" class="toggle-input" v-model="useType" />
                <span class="toggle-track"><span class="toggle-thumb" /></span>
                <span class="toggle-label">type</span>
              </label>
            </template>
            <template v-else>
              <label class="toggle-wrap">
                <input type="checkbox" class="toggle-input" v-model="zodStrict" />
                <span class="toggle-track"><span class="toggle-thumb" /></span>
                <span class="toggle-label">.strict()</span>
              </label>
            </template>
            <button class="btn-xs" @click="download" :disabled="!output">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" @click="copy" :disabled="!output">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="editor-body">
          <ClientOnly>
            <JsonEditor v-model="output" :readonly="true" lang="typescript" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJsonToTs } from '~/composables/useJsonToTs'

useToolSeo(
  'JSON to TypeScript Generator — Interfaces & Zod Schemas Online',
  'Generate TypeScript interfaces and Zod schemas from JSON automatically. Free, no data sent to servers. Supports nested objects, arrays, unions, and optional fields.',
)

const { input, mode, rootName, output, error, copied, copy, clear, readonlyFields, useType, zodStrict, download } = useJsonToTs()

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
    title: 'TypeScript interfaces vs Zod schemas',
    text: 'TypeScript interfaces exist only at compile time — they validate types during development and are erased at runtime. Zod schemas are runtime objects that can parse and validate data, generate TypeScript types via z.infer<>, and throw detailed errors when data doesn\'t match. Use interfaces when you control the data source and just need IDE support. Use Zod (or similar: Valibot, Yup, ArkType) when you receive data from untrusted sources like APIs, form inputs, or config files.',
  },
  {
    title: 'How type inference works',
    text: 'This tool traverses your JSON value recursively. Each primitive maps to its TypeScript type (string, number, boolean, null). Objects become interfaces or z.object() schemas with one field per key. Arrays are typed by their elements: if all elements share the same structure, a single type is inferred; mixed arrays produce union types (string | number). When JSON contains an array of objects with different keys, missing keys are marked optional (key?: Type or .optional()) and present types are merged.',
  },
  {
    title: 'Next steps after generation',
    text: 'The generated types are a starting point. For stricter validation, refine Zod schemas with constraints like z.string().email(), z.number().positive(), or z.array(...).min(1). For TypeScript interfaces, consider adding readonly modifiers and replacing any with proper union types. If your JSON comes from an API with a published OpenAPI spec, tools like openapi-typescript or Orval can generate more complete, versioned types directly from the spec.',
  },
]
</script>

<style scoped>
/* ── Toolbar ─────────────────────────────────────────────────────── */
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* ── Mode toggle (sliding pill) in output card header ────────────── */
.mode-toggle {
  position: relative;
  display: flex;
  background: var(--c-subtle);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 2px;
  min-width: 210px;
  gap: 0;
}

.mode-indicator {
  position: absolute;
  top: 2px; left: 2px; bottom: 2px;
  width: calc(50% - 2px);
  background: #1A1916;
  border-radius: 6px;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.mode-indicator--right {
  transform: translateX(100%);
}

.mode-btn {
  flex: 1;
  position: relative;
  z-index: 1;
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--c-t4);
  transition: color 0.15s;
  white-space: nowrap;
}
.mode-btn--active { color: white; }

/* ── Root name input ─────────────────────────────────────────────── */
.root-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.root-input {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  color: var(--c-t2);
  background: var(--c-subtle);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 5px 10px;
  outline: none;
  width: 90px;
  transition: border-color 0.15s;
}
.root-input:focus { border-color: var(--c-t5); background: var(--c-card); }

/* ── Status pills ───────────────────────────────────────────────── */
.status-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

.status-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-pill--valid { background: #F0FDF4; color: #15803D; border: 1px solid #BBF7D0; }
.status-pill--valid .status-dot { background: #22C55E; }
.status-pill--invalid { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
.status-pill--invalid .status-dot { background: #EF4444; }

.status-enter-active, .status-leave-active { transition: opacity 0.15s, transform 0.15s; }
.status-enter-from, .status-leave-to { opacity: 0; transform: translateX(4px); }

/* ── Toggle checkboxes (readonly / type / .strict) ──────────────── */
.toggle-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-track {
  position: relative;
  width: 28px;
  height: 16px;
  border-radius: 8px;
  background: var(--c-border-m);
  transition: background 0.18s;
  flex-shrink: 0;
}

.toggle-input:checked + .toggle-track { background: var(--c-brand); }

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toggle-input:checked + .toggle-track .toggle-thumb { transform: translateX(12px); }

.toggle-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--c-t3);
  font-family: 'JetBrains Mono', monospace;
}

/* ── Mobile ──────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .toolbar-right { margin-left: 0; }
  .status-pill { display: none; }
}
</style>
