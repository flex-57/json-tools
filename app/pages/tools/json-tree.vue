<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-amp">Tree Viewer</span></h1>
        <p class="page-subtitle">Explore JSON structure as an interactive collapsible tree or graph. Click nodes to expand, hover to copy the full path.</p>
      </div>
      <div class="mode-toggle" style="min-width: 150px;">
        <div class="mode-indicator" :class="{ 'mode-indicator--right': viewMode === 'graph' }"></div>
        <button class="mode-btn" :class="{ 'mode-btn--active': viewMode === 'tree' }" @click="viewMode = 'tree'">Tree</button>
        <button class="mode-btn" :class="{ 'mode-btn--active': viewMode === 'graph' }" @click="switchToGraph">Graph</button>
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
          <template v-if="viewMode === 'tree' && root">
            <div class="tree-toolbar">
              <span class="tree-search-wrap">
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none" class="tree-search-icon"><circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.4"/><path d="M9.5 9.5L13 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                <input v-model="search" class="tree-search" placeholder="Search…" />
                <button v-if="search" class="tree-search-clear" @click="search = ''">×</button>
              </span>
              <button class="btn-xs" @click="expandAll">Expand all</button>
              <button class="btn-xs" @click="collapseAll">Collapse all</button>
            </div>
            <div class="card-actions">
              <button class="btn-xs" @click="exportAsPdf">PDF</button>
            </div>
          </template>
          <template v-else-if="viewMode === 'graph' && graphNodes.length">
            <span class="pane-label">Graph</span>
            <!-- Graph PDF export disabled — persistent UX issues, revisit later.
                 exportGraphAsPdf() below is left intact to re-enable quickly. -->
          </template>
          <template v-else>
            <span class="pane-label">Output</span>
          </template>
        </div>

        <div v-if="viewMode === 'tree'" class="pane-body">
          <div v-if="error" class="tree-message tree-message--error">{{ error }}</div>
          <div v-else-if="!input.trim()" class="tree-message">Paste valid JSON in the input panel</div>
          <div v-else-if="root" class="tree-wrap">
            <JsonTreeNode :node="root" :depth="0" />
          </div>
        </div>

        <div v-else class="pane-body pane-body--graph">
          <div v-if="error" class="tree-message tree-message--error">{{ error }}</div>
          <div v-else-if="!input.trim()" class="tree-message">Paste valid JSON in the input panel</div>
          <div v-else-if="graphLoading" class="tree-message">Building graph…</div>
          <ClientOnly v-else-if="graphNodes.length">
            <VueFlow
              :nodes="graphNodes"
              :edges="graphEdges"
              :node-types="nodeTypes"
              fit-view-on-init
              :nodes-draggable="false"
              :nodes-connectable="false"
              :elements-selectable="false"
              :min-zoom="0.2"
              :max-zoom="2"
              class="vf-instance"
            >
              <Background pattern-color="#26213D" :gap="20" :size="1" />
              <Controls position="bottom-right" />
            </VueFlow>
            <template #fallback><div class="tree-message">Loading graph…</div></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <div class="statusbar" v-if="root">
      <span>{{ nodeCount }} nodes</span>
      <span>json-tree</span>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { parseJsonTree, collectDeepIds, collectAllExpandableIds } from '~/composables/useJsonTree'
import { buildGraph } from '~/composables/useJsonGraph'
import { useColorMode } from '~/composables/useColorMode'
import type { TreeNode } from '~/composables/useJsonTree'

useToolSeo(
  'JSON Tree Viewer: Collapsible Tree & Graph | JSON Tools',
  'Visualize any JSON as an interactive collapsible tree or node graph. Expand/collapse nodes, copy paths with one click, search keys and values.',
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
const search      = ref('')
const collapsed   = ref(new Set<string>())
const root        = ref<TreeNode | null>(null)
const error       = ref('')
const viewMode    = ref<'tree' | 'graph'>('tree')
const graphNodes  = ref<any[]>([])
const graphEdges  = ref<any[]>([])
const graphLoading = ref(false)

const VueFlow    = defineAsyncComponent(() => import('@vue-flow/core').then(m => m.VueFlow))
const Background = defineAsyncComponent(() => import('@vue-flow/background').then(m => m.Background))
const Controls   = defineAsyncComponent(() => import('@vue-flow/controls').then(m => m.Controls))

const nodeTypes: any = { jsonNode: resolveComponent('JsonGraphNode') }

provide('tree:collapsed', collapsed)
provide('tree:toggle', (id: string) => {
  const next = new Set(collapsed.value)
  next.has(id) ? next.delete(id) : next.add(id)
  collapsed.value = next
})
provide('tree:search', search)

watch(input, (val) => {
  if (!val.trim()) { root.value = null; error.value = ''; graphNodes.value = []; graphEdges.value = []; return }
  const { root: r, error: e } = parseJsonTree(val)
  root.value = r
  error.value = e
  graphNodes.value = []
  graphEdges.value = []
  if (r) collapsed.value = new Set(collectDeepIds(r, 2))
}, { immediate: true })

async function switchToGraph() {
  viewMode.value = 'graph'
  if (!root.value || graphNodes.value.length) return
  graphLoading.value = true
  try {
    const { nodes, edges } = await buildGraph(root.value)
    graphNodes.value = nodes as any
    graphEdges.value = edges as any
  } finally {
    graphLoading.value = false
  }
}

watch(root, async (r) => {
  if (viewMode.value === 'graph' && r) {
    graphNodes.value = []
    graphEdges.value = []
    graphLoading.value = true
    try {
      const { nodes, edges } = await buildGraph(r)
      graphNodes.value = nodes as any
      graphEdges.value = edges as any
    } finally {
      graphLoading.value = false
    }
  }
})

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

async function exportGraphAsPdf() {
  const el = document.querySelector('.vf-instance') as HTMLElement
  if (!el) return
  const controls = el.querySelector('.vue-flow__controls') as HTMLElement | null
  if (controls) controls.style.visibility = 'hidden'
  try {
    await captureToPdf(el, isDark.value ? '#0A0912' : '#F5F3FA', 'json-graph.pdf')
  } finally {
    if (controls) controls.style.visibility = ''
  }
}

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
    title: 'What is a JSON Tree Viewer?',
    text: 'A JSON Tree Viewer transforms raw JSON text into a visual, navigable structure. Instead of scanning through hundreds of lines of nested braces and brackets, you can collapse and expand individual nodes to focus on the part of the data that matters. It is especially useful when working with API responses, configuration files, or any deeply nested payload, letting you understand the shape of the data at a glance without modifying it.',
  },
  {
    title: 'Tree view: navigate and search',
    text: 'The tree view renders each key-value pair as an indented row with color-coded types: strings, numbers, booleans and null each get a distinct color. Objects and arrays show a count of their children and can be collapsed to a single line. Hover any node to reveal a copy icon that captures the full dot/bracket path (e.g. features[0].name), ready to paste directly into your code. Use the search box to instantly highlight matching keys and values across the entire tree.',
  },
  {
    title: 'Graph view: visualise the full structure',
    text: 'The graph view renders JSON as an interactive node diagram laid out left-to-right. The root object appears as a content node; each nested object or array becomes a header node connected by arrows to its children. Primitive values inside arrays appear as individual leaf nodes; objects inside arrays show their key-value content inline. Zoom and pan with the mouse or trackpad to explore large payloads. The layout is computed automatically using the Dagre algorithm, so the graph always reflects the actual JSON structure.',
  },
]
</script>

<style>
.vue-flow__controls { background: var(--c-subtle) !important; border: 1px solid var(--c-border) !important; border-radius: 8px !important; overflow: hidden; }
.vue-flow__controls-button { background: var(--c-subtle) !important; border-color: var(--c-border) !important; color: var(--c-t4) !important; }
.vue-flow__controls-button:hover { background: var(--c-faint) !important; color: var(--c-t1) !important; }
.vue-flow__edge-path { stroke: var(--c-border-m) !important; }
</style>

<style scoped>
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

.pane-body--graph { padding: 0; position: relative; }
.vf-instance { width: 100%; height: 100%; min-height: 480px; }

.tree-message {
  display: flex; align-items: center; gap: 8px;
  padding: 32px 16px; font-family: var(--font-mono); font-size: 13px; color: var(--c-t4); justify-content: center;
}
.tree-message--error { color: var(--c-error); }
.tree-wrap { padding: 4px 0; }
</style>
