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

        <!-- Mode toggle -->
        <div class="mode-toggle">
          <div class="mode-indicator" :class="{ 'mode-indicator--right': mode === 'zod' }" />
          <button :class="['mode-btn', mode === 'ts' ? 'mode-btn--active' : '']" @click="mode = 'ts'">TypeScript</button>
          <button :class="['mode-btn', mode === 'zod' ? 'mode-btn--active' : '']" @click="mode = 'zod'">Zod</button>
        </div>

        <!-- Root name -->
        <div class="root-wrap">
          <label class="option-label">Name</label>
          <input v-model="rootName" class="root-input" placeholder="Root" spellcheck="false" />
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
          <span class="editor-label">{{ mode === 'ts' ? 'TypeScript Interface' : 'Zod Schema' }}</span>
          <span class="editor-hint">Auto-generated</span>
        </div>
        <div class="editor-body">
          <textarea v-model="output" readonly class="editor-textarea" spellcheck="false"
            :placeholder="mode === 'ts' ? 'interface Root { ... }' : 'z.object({ ... })'" />
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJsonToTs } from '~/composables/useJsonToTs'

useSeoMeta({
  title: 'JSON to TypeScript / Zod Generator — Free Online Tool',
  description: 'Generate TypeScript interfaces and Zod schemas from JSON automatically. Free, no data sent to servers. Supports nested objects, arrays, unions, and optional fields.',
})

const { input, mode, rootName, output, error, copied, copy, clear } = useJsonToTs()

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

/* ── Mode toggle (sliding pill) ──────────────────────────────────── */
.mode-toggle {
  position: relative;
  display: flex;
  background: #F3F1EC;
  border: 1px solid #E2DDD7;
  border-radius: 8px;
  padding: 2px;
  gap: 0;
}

.mode-indicator {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(50% - 2px);
  bottom: 2px;
  background: #1A1916;
  border-radius: 6px;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.mode-indicator--right {
  transform: translateX(calc(100% + 2px));
}

.mode-btn {
  position: relative;
  z-index: 1;
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 13px;
  border-radius: 6px;
  cursor: pointer;
  color: #9A9690;
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
  color: #3A3830;
  background: #F7F5F2;
  border: 1px solid #E8E5DF;
  border-radius: 6px;
  padding: 5px 10px;
  outline: none;
  width: 90px;
  transition: border-color 0.15s;
}
.root-input:focus { border-color: #C8C4BB; background: white; }

/* ── Status pills (from tools.css pattern) ───────────────────────── */
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

/* ── Mobile ──────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .toolbar-right { margin-left: 0; }
  .status-pill { display: none; }
}
</style>
