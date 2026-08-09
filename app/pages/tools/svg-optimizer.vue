<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">SVG <span class="title-amp">Optimizer</span></h1>
        <p class="page-subtitle">Compress SVG markup with SVGO, entirely in your browser. Paste or drop a .svg file.</p>
        <NuxtLink to="/guides/what-is-svg" class="guide-link">What is SVG? Read our guide →</NuxtLink>
      </div>
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
          <span class="pane-label">Source SVG</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .svg file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor ref="inputEditorRef" v-model="input" lang="xml" :error-line="errorLine" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="midcol"><span class="mid-arrow"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">Optimized SVG</span>
          <div class="card-actions">
            <span v-if="output && !error" class="savings-badge">-{{ savings }}%</span>
            <button class="btn-xs" :disabled="!output" @click="download">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div class="pane-body" :class="{ 'pane-body--empty': !output }" :style="output ? 'padding: 0;' : ''" aria-live="polite">
          <Transition name="reveal" mode="out-in">
            <p v-if="!output" key="empty" class="pane-body-placeholder">{{ input.trim() ? 'Fix the error in your input to see optimized output' : 'Paste an SVG to see optimized output' }}</p>
            <div v-else key="output" class="pane-body-editor-wrap">
              <ClientOnly>
                <JsonEditor :model-value="output" lang="xml" :readonly="true" :line-wrap="true" />
                <template #fallback><EditorSkeleton /></template>
              </ClientOnly>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <div class="svg-options">
      <label class="toggle-wrap">
        <input v-model="removeScripts" type="checkbox" class="toggle-input" >
        <span class="toggle-track"><span class="toggle-thumb" /></span>
        <span class="toggle-label">Strip scripts &amp; event handlers</span>
      </label>
      <span class="hint">Optimizing is not sanitizing: leave this on unless you have a specific reason to keep a script.</span>
    </div>

    <div v-if="output && !error" class="svg-preview-row">
      <div class="svg-preview">
        <span class="svg-preview-label">Before</span>
        <div class="svg-preview-checker"><img :src="beforeDataUri" alt="Original SVG preview" ></div>
      </div>
      <div class="svg-preview">
        <span class="svg-preview-label">After</span>
        <div class="svg-preview-checker"><img :src="afterDataUri" alt="Optimized SVG preview" ></div>
      </div>
    </div>

    <StatusBar>
      <span>
        <span class="led" :class="output && !error ? 'valid' : 'error'"/>
        <template v-if="output && !error && originalSize > 0">{{ fmtBytes(originalSize) }} → {{ fmtBytes(optimizedSize) }} · <strong style="color: var(--c-valid);">{{ savings }}% saved</strong></template>
        <template v-else>{{ error ? `Invalid${errorLine ? ` · Line ${errorLine}, Column ${errorColumn}` : ''}` : 'Waiting for input' }}</template>
      </span>
      <span>powered by SVGO</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['svg-optimizer']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useSvgOptimizer } from '~/composables/useSvgOptimizer'
import { fmtBytes } from '~/utils/download'
import JsonEditor from '~/components/JsonEditor.vue'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'SVG Optimizer: Compress SVG Files Online Free',
  'Optimize and compress SVG markup with SVGO, entirely in your browser. Strips comments, metadata, and redundant precision. Free, no data sent to servers.',
  TOOL_FAQS['svg-optimizer'],
)

const { input, output, error, errorLine, errorColumn, originalSize, optimizedSize, savings, removeScripts, copied, copy, download, clear } = useSvgOptimizer()

const inputEditorRef = ref<InstanceType<typeof JsonEditor> | null>(null)

// SVG in <img> (or CSS background) context never executes embedded scripts
// or event handlers, unlike v-html — so the preview is safe by construction
// and needs no sanitization pass, independent of the removeScripts toggle
// above. encodeURIComponent, not base64: avoids btoa's throw on non-Latin1
// characters (e.g. a <text> node containing "é" or CJK glyphs).
function svgDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
const beforeDataUri = computed(() => svgDataUri(input.value))
const afterDataUri  = computed(() => svgDataUri(output.value))

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
    title: 'Why optimize SVG?',
    text: 'Design tools (Figma, Illustrator, Sketch) export SVG with editor metadata, excessive coordinate precision, and redundant grouping that add nothing visually but bloat the file. SVGO removes it while keeping the rendered result identical.',
    table: [
      { label: 'Typical', value: 'Shrinks 30-60% on tool-exported files' },
      { label: 'Removes', value: 'Comments, metadata, editor namespaces, excess precision' },
      { label: 'Keeps', value: 'Visual output — always compare the before/after preview' },
    ],
  },
  {
    title: 'What the optimizer changes',
    text: [
      'SVGO runs a real XML parser and a set of transform passes: it strips comments and <metadata>, merges and shortens paths, converts basic shapes to paths where smaller, rounds numeric precision, and drops unused namespace declarations and empty groups.',
      'None of this is a lossy visual change; SVGO\'s default preset is designed to preserve rendering. Still, always check the before/after preview below, since an unusual SVG (heavy use of CSS classes, embedded fonts) is more likely to hit an edge case than a plain icon.',
    ],
  },
  {
    title: 'Optimizing is not sanitizing',
    text: [
      'SVG can carry a <script> element or onload/onclick event handlers, and SVGO\'s default preset does not touch either — they pass straight through an "optimized" file. The "Strip scripts & event handlers" toggle above (on by default) explicitly removes both, plus javascript: links.',
      'This matters if you plan to inline the output directly into a page with v-html or dangerouslySetInnerHTML rather than use it as an <img> src: an inlined SVG executes any script it carries, an <img>-loaded one never does.',
    ],
  },
]
</script>

<style scoped>
.svg-options { display: flex; align-items: center; gap: 12px; margin-top: 14px; flex-wrap: wrap; }

.svg-preview-row { display: flex; gap: 16px; margin-top: 16px; flex-wrap: wrap; }
.svg-preview { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 8px; }
.svg-preview-label { font-family: var(--font-body); font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--c-t4); }
.svg-preview-checker {
  height: 160px; border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  background-color: #fff;
  background-image: linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%);
  background-size: 16px 16px; background-position: 0 0, 0 8px, 8px -8px, -8px 0;
}
.svg-preview-checker img { max-width: 90%; max-height: 90%; object-fit: contain; }

.savings-badge { font-family: var(--font-mono); font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 20px; background: rgb(var(--c-valid-rgb) / 0.1); color: var(--c-valid); border: 1px solid rgb(var(--c-valid-rgb) / 0.3); }
</style>
