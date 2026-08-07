<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-arrow">→</span> <span class="title-amp">{{ mode === 'ts' ? 'TypeScript' : 'Zod' }}</span></h1>
        <p class="page-subtitle">Generate TypeScript interfaces or Zod schemas from any JSON, automatically and client-side.</p>
      </div>
      <div style="display:flex; align-items:center; gap:16px; flex-wrap: wrap;">
        <div class="option-wrap">
          <label class="option-label">Name</label>
          <input v-model="rootName" class="root-input" placeholder="Root" spellcheck="false" >
        </div>
        <div class="mode-toggle" style="min-width: 230px;">
          <div class="mode-indicator" :class="{ 'mode-indicator--right': mode === 'zod' }"/>
          <button class="mode-btn" :class="{ 'mode-btn--active': mode === 'ts' }" @click="mode = 'ts'">TypeScript</button>
          <button class="mode-btn" :class="{ 'mode-btn--active': mode === 'zod' }" @click="mode = 'zod'">Zod</button>
        </div>
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
          <span class="pane-label">JSON Input</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .json file</span>
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
          <span class="pane-label">{{ mode === 'ts' ? 'TypeScript' : 'Zod' }}</span>
          <div class="card-actions">
            <template v-if="mode === 'ts'">
              <label class="toggle-wrap">
                <input v-model="readonlyFields" type="checkbox" class="toggle-input" >
                <span class="toggle-track"><span class="toggle-thumb" /></span>
                <span class="toggle-label">readonly</span>
              </label>
              <label class="toggle-wrap">
                <input v-model="useType" type="checkbox" class="toggle-input" >
                <span class="toggle-track"><span class="toggle-thumb" /></span>
                <span class="toggle-label">type</span>
              </label>
            </template>
            <template v-else>
              <label class="toggle-wrap">
                <input v-model="zodStrict" type="checkbox" class="toggle-input" >
                <span class="toggle-track"><span class="toggle-thumb" /></span>
                <span class="toggle-label">.strict()</span>
              </label>
            </template>
            <button class="btn-xs" :disabled="!output" @click="download">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1.5v7.5M4 6.5L7 9.5 10 6.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 11.5h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              Download
            </button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>
        <div class="pane-body" :class="{ 'pane-body--empty': !output }" :style="output ? 'padding: 0;' : ''" aria-live="polite">
          <Transition name="reveal" mode="out-in">
            <p v-if="!output" key="empty" class="pane-body-placeholder">{{ input.trim() ? 'Fix the error in your input to see the generated code' : 'Paste JSON to see the generated code' }}</p>
            <div v-else key="output" class="pane-body-editor-wrap">
              <ClientOnly>
                <JsonEditor v-model="output" :readonly="true" lang="typescript" />
                <template #fallback><EditorSkeleton /></template>
              </ClientOnly>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <StatusBar>
      <span>
        <span class="led" :class="error ? 'error' : 'valid'"/>
        {{ error ? `Invalid${errorLine ? ` · Line ${errorLine}, Column ${errorColumn}` : ''}` : 'Valid' }} · {{ lineCount }} lines · {{ charCount }} chars
      </span>
      <span>json-to-ts</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJsonToTs } from '~/composables/useJsonToTs'
import JsonEditor from '~/components/JsonEditor.vue'

useToolSeo(
  'JSON to TypeScript Generator: Interfaces & Zod Schemas Online',
  'Generate TypeScript interfaces and Zod schemas from JSON automatically. Free, no data sent to servers. Supports nested objects, arrays, unions, and optional fields.',
)

const { input, mode, rootName, output, error, errorTip, errorLine, errorColumn, copied, copy, clear, readonlyFields, useType, zodStrict, download } = useJsonToTs()
useUrlInput(input)

const inputEditorRef = ref<InstanceType<typeof JsonEditor> | null>(null)

const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}

const lineCount = computed(() => output.value ? output.value.split('\n').length : 0)
const charCount = computed(() => output.value?.length ?? 0)

const seoCards = [
  {
    title: 'TypeScript interfaces vs Zod schemas',
    text: [
      'TypeScript interfaces exist only at compile time: they validate types during development and are erased at runtime. Zod schemas are runtime objects that can parse and validate data, generate TypeScript types via z.infer<>, and throw detailed errors when data doesn\'t match.',
      'Use interfaces when you control the data source and just need IDE support. Use Zod (or similar: Valibot, Yup, ArkType) when you receive data from untrusted sources like APIs, form inputs, or config files.',
    ],
  },
  {
    title: 'How type inference works',
    text: 'This tool traverses your JSON value recursively. Arrays are typed by their elements: if all elements share the same structure, a single type is inferred; mixed arrays produce union types (string | number). Missing keys across objects are marked optional.',
    table: [
      { label: 'primitive', value: 'string, number, boolean, null' },
      { label: 'object', value: 'interface or z.object() — one field per key' },
      { label: 'optional key', value: 'key?: Type or .optional()' },
    ],
  },
  {
    title: 'Next steps after generation',
    text: [
      'The generated types are a starting point. For stricter validation, refine Zod schemas with constraints like z.string().email(), z.number().positive(), or z.array(...).min(1).',
      'For TypeScript interfaces, consider adding readonly modifiers and replacing any with proper union types. If your JSON comes from an API with a published OpenAPI spec, tools like openapi-typescript or Orval can generate more complete, versioned types directly from the spec.',
    ],
  },
]
</script>

<style scoped>
.root-input {
  font-family: var(--font-mono);
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
.root-input:focus { border-color: var(--c-accent); background: var(--c-card); }
.toggle-label { font-family: var(--font-mono); }
</style>
