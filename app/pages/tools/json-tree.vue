<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-amp">Tree Viewer</span></h1>
        <p class="page-subtitle">Explore JSON structure as an interactive collapsible tree. Click nodes to expand, hover to copy the full path — all client-side.</p>
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
            <label class="btn-xs" for="json-tree-file-input">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M2 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Browse
            </label>
            <input id="json-tree-file-input" type="file" accept=".json,application/json" class="file-input" @change="onFileInput" >
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
          <template v-if="root">
            <div class="tree-toolbar">
              <span class="tree-search-wrap">
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none" class="tree-search-icon"><circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.4"/><path d="M9.5 9.5L13 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                <input v-model="search" class="tree-search" placeholder="Search…" aria-label="Search tree nodes" >
                <button v-if="search" class="tree-search-clear" aria-label="Clear search" @click="search = ''">×</button>
              </span>
              <button class="btn-xs" @click="expandAll">Expand all</button>
              <button class="btn-xs" @click="collapseAll">Collapse all</button>
            </div>
            <div class="card-actions">
              <button class="btn-xs" @click="exportAsPdf">PDF</button>
            </div>
          </template>
          <template v-else>
            <span class="pane-label">Output</span>
          </template>
        </div>

        <div class="pane-body" :class="{ 'pane-body--empty': !!error || !input.trim() }" aria-live="polite">
          <div v-if="error" class="tree-message">Fix the error in your input to see the tree</div>
          <div v-else-if="!input.trim()" class="tree-message">Tree will appear here…</div>
          <div v-else-if="root" class="tree-wrap">
            <JsonTreeNode :node="root" :depth="0" />
          </div>
        </div>
      </div>
    </div>

    <StatusBar v-if="root">
      <span :class="{ 'status-warn': truncated }">
        {{ nodeCount }}{{ truncated ? '+' : '' }} nodes<template v-if="truncated"> · large payload, tree truncated to stay responsive</template>
      </span>
      <span>json-tree</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['json-tree']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { parseJsonTree, collectDeepIds, collectAllExpandableIds } from '~/composables/useJsonTree'
import { useColorMode } from '~/composables/useColorMode'
import JsonEditor from '~/components/JsonEditor.vue'
import type { TreeNode } from '~/composables/useJsonTree'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'JSON Tree Viewer: Interactive Collapsible Tree Explorer',
  'Visualize any JSON as an interactive collapsible tree. Expand/collapse nodes, copy paths with one click, search keys and values.',
  TOOL_FAQS['json-tree'],
)

const SAMPLE = `{
  "name": "JSON Tree Viewer",
  "version": "1.0",
  "active": true,
  "score": null,
  "tags": ["json", "tools", "tree"],
  "author": {
    "name": "jsontools",
    "url": "https://jsontools.space"
  },
  "features": [
    { "id": 1, "name": "Collapse nodes", "enabled": true },
    { "id": 2, "name": "Copy path",      "enabled": true },
    { "id": 3, "name": "Search keys",    "enabled": true }
  ]
}`

const { isDark } = useColorMode()
const input       = ref(SAMPLE)
useUrlInput(input)
const search      = ref('')
const collapsed   = ref(new Set<string>())
const root        = ref<TreeNode | null>(null)
const error       = ref('')
const errorTip    = ref<string | null>(null)
const errorLine   = ref<number | null>(null)
const errorColumn = ref<number | null>(null)
const truncated   = ref(false)
const inputEditorRef = ref<InstanceType<typeof JsonEditor> | null>(null)

provide('tree:collapsed', collapsed)
provide('tree:toggle', (id: string) => {
  const next = new Set(collapsed.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  collapsed.value = next
})
provide('tree:search', search)

watch(input, (val) => {
  if (!val.trim()) {
    root.value = null; error.value = ''; errorTip.value = null; errorLine.value = null; errorColumn.value = null
    truncated.value = false
    return
  }
  const { root: r, error: e, line, column, tip, truncated: t } = parseJsonTree(val)
  root.value = r
  error.value = e
  errorTip.value = tip
  errorLine.value = line
  errorColumn.value = column
  truncated.value = t
  if (r) collapsed.value = new Set(collectDeepIds(r, 2))
}, { immediate: true })

function expandAll()  { collapsed.value = new Set() }
function collapseAll() { if (root.value) collapsed.value = new Set(collectAllExpandableIds(root.value)) }
function clear()      { input.value = ''; search.value = '' }

const nodeCount = computed(() => {
  if (!root.value) return 0
  let n = 0
  const walk = (node: TreeNode) => { n++; node.children.forEach(walk) }
  walk(root.value)
  return n
})

async function captureToPdf(el: HTMLElement, bg: string, filename: string) {
  const [{ toPng }, { default: jsPDF }] = await Promise.all([import('html-to-image'), import('jspdf')])
  const dataUrl = await toPng(el, { pixelRatio: 2, backgroundColor: bg })
  const img = new Image()
  img.src = dataUrl
  await new Promise<void>(r => { img.onload = () => r() })
  const PX_TO_MM = 25.4 / 96
  const wMm = (img.naturalWidth / 2) * PX_TO_MM
  const hMm = (img.naturalHeight / 2) * PX_TO_MM
  const pdf = new jsPDF({ unit: 'mm', orientation: wMm > hMm ? 'l' : 'p', format: [wMm, hMm] })
  pdf.addImage(dataUrl, 'PNG', 0, 0, wMm, hMm)
  pdf.save(filename)
}

async function exportAsPdf() {
  const saved = new Set(collapsed.value)
  expandAll()
  await nextTick()
  const treeWrap = document.querySelector('.tree-wrap') as HTMLElement
  if (!treeWrap) { collapsed.value = saved; return }
  try {
    await captureToPdf(treeWrap, isDark.value ? '#100E1C' : '#FFFFFF', 'json-tree.pdf')
  } finally {
    collapsed.value = saved
  }
}

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
    title: 'What is a JSON Tree Viewer?',
    text: [
      'A JSON Tree Viewer transforms raw JSON text into a visual, navigable structure. Instead of scanning through hundreds of lines of nested braces and brackets, you can collapse and expand individual nodes to focus on the part of the data that matters.',
      'It is especially useful when working with API responses, configuration files, or any deeply nested payload, letting you understand the shape of the data at a glance without modifying it.',
    ],
  },
  {
    title: 'Navigate and search',
    text: [
      'The tree view renders each key-value pair as an indented row with color-coded types: strings, numbers, booleans and null each get a distinct color. Objects and arrays show a count of their children and can be collapsed to a single line.',
      'Hover any node to reveal a copy icon that captures the full dot/bracket path (e.g. features[0].name), ready to paste directly into your code. Use the search box to instantly highlight matching keys and values across the entire tree.',
    ],
  },
  {
    title: 'Common use cases',
    text: [
      'Developers exploring an unfamiliar API response collapse everything but the branch they care about, instead of scrolling through a wall of minified text. QA engineers compare the shape of a payload against documentation without writing a parser.',
      'Because rendering happens entirely in your browser, it is safe to paste real API responses or config files containing internal field names — nothing is sent to a server.',
    ],
  },
]
</script>

<style scoped>
.file-input { display: none; }
.status-warn { color: var(--c-error); }
.tree-toolbar { display: flex; align-items: center; gap: 8px; flex: 1; flex-wrap: wrap; }
.tree-search-wrap { position: relative; display: flex; align-items: center; flex: 1; min-width: 120px; max-width: 200px; }
.tree-search-icon { position: absolute; left: 8px; color: var(--c-t4); pointer-events: none; }
.tree-search {
  width: 100%; padding: 4px 26px 4px 26px;
  background: var(--c-subtle); border: 1px solid var(--c-border); border-radius: 6px;
  font-family: var(--font-body); font-size: 12px; color: var(--c-t2); outline: none; transition: border-color 0.15s;
}
.tree-search:focus { border-color: var(--c-accent); }
.tree-search-clear { position: absolute; right: 6px; background: none; border: none; cursor: pointer; color: var(--c-t4); font-size: 14px; line-height: 1; padding: 0 2px; }
.tree-search-clear:hover { color: var(--c-t1); }

.tree-message {
  display: flex; align-items: center; gap: 8px;
  padding: 32px 16px; font-family: var(--font-mono); font-size: 13px; color: var(--c-t4); justify-content: center;
}
.tree-wrap { padding: 4px 0; }
</style>
