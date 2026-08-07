<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">SVG to <span class="title-amp">JSX</span></h1>
        <p class="page-subtitle">Turn an SVG file into a React component: className, camelCase props, style objects. Entirely in your browser.</p>
        <NuxtLink to="/guides/what-is-svg" class="guide-link">What is SVG? Read our guide →</NuxtLink>
      </div>
    </div>

    <ErrorBanner v-if="error" :message="error" />

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--drag': isDragging, 'pane--invalid': error }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <span class="pane-label">Source SVG</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .svg file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor v-model="input" lang="xml" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="midcol"><span class="mid-arrow"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">JSX</span>
          <div class="card-actions">
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" :class="{ 'pane-body--empty': !output }" :style="output ? 'padding: 0;' : ''" aria-live="polite">
          <template v-if="!output">{{ input.trim() ? 'Fix the error in your input to see JSX output' : 'Paste an SVG to see JSX output' }}</template>
          <ClientOnly v-else>
            <JsonEditor :model-value="output" lang="jsx" :readonly="true" :line-wrap="true" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <div class="jsx-options">
      <label class="toggle-wrap">
        <input v-model="asComponent" type="checkbox" class="toggle-input" >
        <span class="toggle-track"><span class="toggle-thumb" /></span>
        <span class="toggle-label">Wrap in component</span>
      </label>
      <label v-if="asComponent" class="name-field">
        <span class="hint">name</span>
        <input v-model="componentName" type="text" class="name-input" spellcheck="false" >
      </label>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useSvgToJsx } from '~/composables/useSvgToJsx'
import JsonEditor from '~/components/JsonEditor.vue'

useToolSeo(
  'SVG to JSX Converter: React Component from SVG',
  'Convert SVG markup into a React component: class becomes className, kebab-case attributes become camelCase, inline style strings become JS objects. Free, 100% client-side.',
)

const { input, componentName, asComponent, output, error, copied, copy, clear } = useSvgToJsx()

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
    title: 'What changes',
    text: 'SVG is valid XML; JSX is not quite HTML. The converter renames class to className, renames kebab-case attributes to camelCase (stroke-width becomes strokeWidth), turns a style string into a JS object, and turns XML comments into JSX comments.',
    table: [
      { label: 'class="icon"', value: 'className="icon"' },
      { label: 'stroke-width="2"', value: 'strokeWidth="2"' },
      { label: 'style="fill:red"', value: 'style={{ fill: \'red\' }}' },
      { label: '<!-- note -->', value: '{/* note */}' },
    ],
  },
  {
    title: 'Why not Vue or Svelte too?',
    text: 'SVG is already valid template syntax in both Vue and Svelte, so a converted output would just be the same markup pasted under a <template> tag with no real transform behind it. JSX is the one target where the syntax actually differs from raw SVG.',
  },
  {
    title: 'Attributes React doesn\'t recognize',
    text: 'React passes unrecognized kebab-case attributes straight through as literal DOM attribute names, so an obscure or vendor-specific attribute missing from the camelCase list still renders correctly, just not in idiomatic camelCase form.',
  },
]
</script>

<style scoped>
.jsx-options { display: flex; align-items: center; gap: 16px; margin-top: 14px; flex-wrap: wrap; }
.name-field { display: flex; align-items: center; gap: 8px; }
.name-input { width: 140px; height: 28px; padding: 0 8px; border: 1px solid var(--c-border); border-radius: 6px; background: var(--c-subtle); font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t1); outline: none; transition: border-color 0.15s; }
.name-input:focus { border-color: var(--c-accent); }
</style>
