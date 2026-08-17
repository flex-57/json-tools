<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-amp">Graph Viewer</span></h1>
        <p class="page-subtitle">Visualize JSON as an interactive node graph — zoom, pan, and trace relationships across deeply nested structures, entirely in your browser.</p>
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
            <label class="btn-xs" for="json-graph-file-input">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M2 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Browse
            </label>
            <input id="json-graph-file-input" type="file" accept=".json,application/json" class="file-input" @change="onFileInput" >
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
          <template v-if="graphNodes.length">
            <span class="pane-label">Graph</span>
            <!-- PDF export disabled — persistent UX issues, revisit later.
                 exportGraphAsPdf() below is left intact to re-enable quickly. -->
          </template>
          <template v-else>
            <span class="pane-label">Output</span>
          </template>
        </div>

        <div class="pane-body pane-body--graph" :class="{ 'pane-body--empty': !!error || !input.trim() || graphLoading }" aria-live="polite">
          <div v-if="error" class="tree-message">Fix the error in your input to see the graph</div>
          <div v-else-if="!input.trim()" class="tree-message">Graph will appear here…</div>
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

    <StatusBar v-if="root">
      <span :class="{ 'status-warn': truncated }">
        {{ nodeCount }}{{ truncated ? '+' : '' }} nodes<template v-if="truncated"> · large payload, graph truncated to stay responsive</template>
      </span>
      <span>json-graph</span>
    </StatusBar>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['json-graph']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { parseJsonTree } from '~/composables/useJsonTree'
import { buildGraph } from '~/composables/useJsonGraph'
import { useColorMode } from '~/composables/useColorMode'
import JsonEditor from '~/components/JsonEditor.vue'
import type { TreeNode } from '~/composables/useJsonTree'
import type { VfNode, VfEdge } from '~/composables/useJsonGraph'
import type { NodeComponent, NodeTypesObject } from '@vue-flow/core'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'JSON Graph Viewer: Interactive Node Diagram Online',
  'Turn any JSON into an interactive node graph. Zoom, pan, and explore deeply nested objects and arrays visually, entirely in your browser.',
  TOOL_FAQS['json-graph'],
)

const SAMPLE = `{
  "name": "JSON Graph Viewer",
  "version": "1.0",
  "active": true,
  "score": null,
  "tags": ["json", "tools", "graph"],
  "author": {
    "name": "jsontools",
    "url": "https://jsontools.space"
  },
  "features": [
    { "id": 1, "name": "Zoom & pan", "enabled": true },
    { "id": 2, "name": "Auto layout", "enabled": true },
    { "id": 3, "name": "Node graph", "enabled": true }
  ]
}`

const { isDark } = useColorMode()
const input       = ref(SAMPLE)
useUrlInput(input)
const root        = ref<TreeNode | null>(null)
const error       = ref('')
const errorTip    = ref<string | null>(null)
const errorLine   = ref<number | null>(null)
const errorColumn = ref<number | null>(null)
const truncated   = ref(false)
const inputEditorRef = ref<InstanceType<typeof JsonEditor> | null>(null)
const graphNodes  = ref<VfNode[]>([])
const graphEdges  = ref<VfEdge[]>([])
const graphLoading = ref(false)

const VueFlow    = defineAsyncComponent(() => import('@vue-flow/core').then(m => m.VueFlow))
const Background = defineAsyncComponent(() => import('@vue-flow/background').then(m => m.Background))
const Controls   = defineAsyncComponent(() => import('@vue-flow/controls').then(m => m.Controls))

// JsonGraphNode only declares the `data` prop it actually uses, not Vue Flow's full NodeProps
// shape, so resolveComponent()'s return type can't structurally satisfy NodeComponent — assert
// this one value rather than widen nodeTypes itself.
const nodeTypes: NodeTypesObject = { jsonNode: resolveComponent('JsonGraphNode') as NodeComponent }

async function rebuildGraph(r: TreeNode) {
  graphNodes.value = []
  graphEdges.value = []
  graphLoading.value = true
  try {
    const { nodes, edges } = await buildGraph(r)
    graphNodes.value = nodes
    graphEdges.value = edges
  } finally {
    graphLoading.value = false
  }
}

watch(input, (val) => {
  if (!val.trim()) {
    root.value = null; error.value = ''; errorTip.value = null; errorLine.value = null; errorColumn.value = null
    truncated.value = false; graphNodes.value = []; graphEdges.value = []
    return
  }
  const { root: r, error: e, line, column, tip, truncated: t } = parseJsonTree(val)
  root.value = r
  error.value = e
  errorTip.value = tip
  errorLine.value = line
  errorColumn.value = column
  truncated.value = t
  if (r) rebuildGraph(r)
  else { graphNodes.value = []; graphEdges.value = [] }
}, { immediate: true })

function clear() { input.value = '' }

const nodeCount = computed(() => {
  if (!root.value) return 0
  let n = 0
  const walk = (node: TreeNode) => { n++; node.children.forEach(walk) }
  walk(root.value)
  return n
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function exportGraphAsPdf() {
  const [{ toPng }, { default: jsPDF }] = await Promise.all([import('html-to-image'), import('jspdf')])
  const el = document.querySelector('.vf-instance') as HTMLElement
  if (!el) return
  const controls = el.querySelector('.vue-flow__controls') as HTMLElement | null
  if (controls) controls.style.visibility = 'hidden'
  try {
    const bg = isDark.value ? '#0A0912' : '#F5F3FA'
    const dataUrl = await toPng(el, { pixelRatio: 2, backgroundColor: bg })
    const img = new Image()
    img.src = dataUrl
    await new Promise<void>(r => { img.onload = () => r() })
    const PX_TO_MM = 25.4 / 96
    const wMm = (img.naturalWidth / 2) * PX_TO_MM
    const hMm = (img.naturalHeight / 2) * PX_TO_MM
    const pdf = new jsPDF({ unit: 'mm', orientation: wMm > hMm ? 'l' : 'p', format: [wMm, hMm] })
    pdf.addImage(dataUrl, 'PNG', 0, 0, wMm, hMm)
    pdf.save('json-graph.pdf')
  } finally {
    if (controls) controls.style.visibility = ''
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
    title: 'What is a JSON Graph Viewer?',
    text: [
      'A JSON Graph Viewer turns raw JSON text into a node-and-edge diagram, the same visual language used for entity-relationship diagrams and dependency graphs. Instead of scanning nested braces and brackets, you follow arrows from parent to child.',
      'It is most useful once a payload is too deeply nested for a flat text view to stay readable — API responses, GraphQL results, or configuration files with several levels of objects and arrays.',
    ],
  },
  {
    title: 'How the graph is built',
    text: [
      'Each object or array becomes a header node connected to a body node listing its key-value pairs; nested objects and arrays branch off as further header nodes. Primitive values inside an array render as individual leaf nodes.',
      'Layout is computed automatically left-to-right using the Dagre algorithm, so nodes never overlap regardless of how irregular the JSON shape is. Zoom and pan with the mouse or trackpad to explore large payloads.',
    ],
  },
  {
    title: 'Common use cases',
    text: [
      'Backend developers trace how a deeply nested API response is actually structured before writing a parser. Frontend developers use it to understand an unfamiliar GraphQL or REST payload at a glance.',
      'Because rendering happens entirely in your browser, it is safe to paste real API responses or config files containing internal field names — nothing is sent to a server.',
    ],
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
.file-input { display: none; }
.status-warn { color: var(--c-error); }
.pane-body--graph { padding: 0; position: relative; }
.vf-instance { width: 100%; height: 100%; min-height: 480px; }

.tree-message {
  display: flex; align-items: center; gap: 8px;
  padding: 32px 16px; font-family: var(--font-mono); font-size: 13px; color: var(--c-t4); justify-content: center;
}
</style>
