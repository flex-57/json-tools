<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-amp">Tree Viewer</span></h1>
        <p class="page-subtitle">Explore JSON structure as an interactive collapsible tree or graph. Click nodes to expand, hover to copy the full path.</p>
      </div>
      <div class="header-actions">
        <button @click="clear" class="btn btn-ghost">Clear</button>
      </div>
    </div>

    <div class="tree-layout">
      <!-- Input panel -->
      <div class="editor-card" :class="{ 'editor-card--focus': editorFocus }">
        <div class="editor-card-header">
          <span class="editor-label">JSON Input</span>
          <span class="editor-hint">paste or type JSON</span>
        </div>
        <div class="editor-body" @focusin="editorFocus = true" @focusout="editorFocus = false">
          <ClientOnly>
            <JsonEditor v-model="input" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <!-- Output panel -->
      <div class="editor-card output-card">
        <div class="editor-card-header output-header">
          <!-- Mode toggle -->
          <div class="view-toggle">
            <div class="view-indicator" :class="{ 'view-indicator--right': viewMode === 'graph' }" />
            <button :class="['view-btn', viewMode === 'tree' ? 'view-btn--active' : '']" @click="viewMode = 'tree'">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 2h2M1 6h2M1 10h2M4 2h7M4 6h5M4 10h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
              Tree
            </button>
            <button :class="['view-btn', viewMode === 'graph' ? 'view-btn--active' : '']" @click="switchToGraph">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="2" cy="6" r="1.5" stroke="currentColor" stroke-width="1.2"/><circle cx="10" cy="2" r="1.5" stroke="currentColor" stroke-width="1.2"/><circle cx="10" cy="10" r="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M3.5 6l5-3.5M3.5 6l5 3.5" stroke="currentColor" stroke-width="1.2"/></svg>
              Graph
            </button>
          </div>

          <!-- Tree controls -->
          <template v-if="viewMode === 'tree' && root">
            <div class="tree-controls">
              <div class="tree-search-wrap">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" class="tree-search-icon">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.4"/>
                  <path d="M9.5 9.5L13 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                </svg>
                <input v-model="search" class="tree-search" placeholder="Search…" />
                <button v-if="search" class="tree-search-clear" @click="search = ''">×</button>
              </div>
              <button class="btn-xs" @click="expandAll">Expand all</button>
              <button class="btn-xs" @click="collapseAll">Collapse all</button>
            </div>
          </template>
        </div>

        <!-- Tree view -->
        <div v-if="viewMode === 'tree'" class="output-body">
          <div v-if="error" class="tree-message tree-message--error">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M7 4v3M7 9.5v.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            {{ error }}
          </div>
          <div v-else-if="!input.trim()" class="tree-message">Paste valid JSON in the input panel</div>
          <div v-else-if="root" class="tree-wrap">
            <JsonTreeNode :node="root" :depth="0" />
          </div>
        </div>

        <!-- Graph view -->
        <div v-else class="output-body output-body--graph">
          <div v-if="error" class="tree-message tree-message--error">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M7 4v3M7 9.5v.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            {{ error }}
          </div>
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
              <Background pattern-color="#2A3140" :gap="20" :size="1" />
              <Controls position="bottom-right" />
            </VueFlow>
            <template #fallback>
              <div class="tree-message">Loading graph…</div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { parseJsonTree, collectDeepIds, collectAllExpandableIds } from '~/composables/useJsonTree'
import { buildGraph } from '~/composables/useJsonGraph'
import type { TreeNode } from '~/composables/useJsonTree'
import type { VfNode, VfEdge } from '~/composables/useJsonGraph'

useHead({
  title: 'JSON Tree Viewer — Collapsible Tree & Graph | JSON Tools',
  meta: [
    { name: 'description', content: 'Visualize any JSON as an interactive collapsible tree or node graph. Expand/collapse nodes, copy paths with one click, search keys and values.' },
  ],
})

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

const input       = ref(SAMPLE)
const search      = ref('')
const editorFocus = ref(false)
const collapsed   = ref(new Set<string>())
const root        = ref<TreeNode | null>(null)
const error       = ref('')
const viewMode    = ref<'tree' | 'graph'>('tree')
const graphNodes  = ref<VfNode[]>([])
const graphEdges  = ref<VfEdge[]>([])
const graphLoading = ref(false)

// Lazy-import Vue Flow components only on client
const VueFlow   = defineAsyncComponent(() => import('@vue-flow/core').then(m => m.VueFlow))
const Background = defineAsyncComponent(() => import('@vue-flow/background').then(m => m.Background))
const Controls   = defineAsyncComponent(() => import('@vue-flow/controls').then(m => m.Controls))

const nodeTypes = { jsonNode: resolveComponent('JsonGraphNode') }

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

// Rebuild graph when input changes and graph mode is active
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

const seoCards = [
  {
    title: 'What is a JSON Tree Viewer?',
    text: 'A JSON Tree Viewer transforms raw JSON text into a visual, navigable structure. Instead of scanning through hundreds of lines of nested braces and brackets, you can collapse and expand individual nodes to focus on the part of the data that matters. It is especially useful when working with API responses, configuration files, or any deeply nested payload — making it easy to understand the shape of the data at a glance without modifying it.',
  },
  {
    title: 'Tree view: navigate and search',
    text: 'The tree view renders each key-value pair as an indented row with color-coded types: strings in green, numbers in blue, booleans in amber, and null in grey. Objects and arrays show a count of their children and can be collapsed to a single line. Hover any node to reveal a copy icon that captures the full dot/bracket path (e.g. features[0].name) — ready to paste directly into your code. Use the search box to instantly highlight matching keys and values across the entire tree.',
  },
  {
    title: 'Graph view: visualise the full structure',
    text: 'The graph view renders JSON as an interactive node diagram laid out left-to-right. The root object appears as a content node; each nested object or array becomes a header node connected by arrows to its children. Primitive values inside arrays appear as individual leaf nodes; objects inside arrays show their key-value content inline. Zoom and pan with the mouse or trackpad to explore large payloads. The layout is computed automatically using the Dagre algorithm, so the graph always reflects the actual JSON structure.',
  },
]
</script>

<style>
/* Vue Flow global overrides — must be unscoped */
.vue-flow__controls { background: #1C2330 !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 8px !important; overflow: hidden; }
.vue-flow__controls-button { background: #1C2330 !important; border-color: rgba(255,255,255,0.08) !important; color: #8B949E !important; }
.vue-flow__controls-button:hover { background: #252D3B !important; color: #C9C8C5 !important; }
.vue-flow__edge-path { stroke: #3D4349 !important; }
</style>

<style scoped>
.tree-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.output-card { display: flex; flex-direction: column; min-height: 520px; }

.output-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  min-height: 40px;
}

/* View toggle pill */
.view-toggle {
  position: relative;
  display: flex;
  background: #F3F1EC;
  border: 1px solid #E2DDD7;
  border-radius: 8px;
  padding: 2px;
  flex-shrink: 0;
}
.view-indicator {
  position: absolute;
  top: 2px; left: 2px;
  width: calc(50% - 2px);
  bottom: 2px;
  background: #1A1916;
  border-radius: 6px;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.view-indicator--right { transform: translateX(calc(100% + 2px)); }
.view-btn {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 5px;
  border: none; background: transparent;
  font-size: 12px; font-weight: 600;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: #9A9690;
  transition: color 0.15s;
  white-space: nowrap;
}
.view-btn--active { color: white; }

/* Tree controls */
.tree-controls {
  display: flex; align-items: center; gap: 8px; flex: 1; flex-wrap: wrap;
}
.tree-search-wrap {
  position: relative; display: flex; align-items: center;
  flex: 1; min-width: 120px; max-width: 200px;
}
.tree-search-icon { position: absolute; left: 8px; color: #9A9690; pointer-events: none; }
.tree-search {
  width: 100%; padding: 4px 26px 4px 26px;
  background: #F7F5F2; border: 1px solid #E8E5DF; border-radius: 6px;
  font-size: 12px; color: #3A3830; outline: none; transition: border-color 0.15s;
}
.tree-search:focus { border-color: #F97316; }
.tree-search-clear {
  position: absolute; right: 6px;
  background: none; border: none; cursor: pointer;
  color: #9A9690; font-size: 14px; line-height: 1; padding: 0 2px;
}
.tree-search-clear:hover { color: #3A3830; }

.btn-xs {
  font-size: 11px; font-weight: 500; padding: 3px 9px;
  border-radius: 5px; border: 1px solid #E2DDD7;
  background: #F3F1EC; color: #6B6760; cursor: pointer;
  white-space: nowrap; transition: background 0.1s, color 0.1s;
}
.btn-xs:hover { background: #E8E5DF; color: #3A3830; }

/* Output body */
.output-body {
  flex: 1; overflow: auto; padding: 12px;
  background: #1A1B1E; border-radius: 0 0 10px 10px;
}
.output-body--graph { padding: 0; position: relative; }

.vf-instance { width: 100%; height: 100%; min-height: 480px; }

.tree-message {
  display: flex; align-items: center; gap: 8px;
  padding: 32px 16px; font-size: 13px; color: #5C6470;
  font-family: 'JetBrains Mono', monospace; justify-content: center;
}
.tree-message--error { color: #E06C75; }
.tree-wrap { padding: 4px 0; }

@media (max-width: 768px) {
  .tree-layout { grid-template-columns: 1fr; }
  .tree-controls { gap: 6px; }
  .tree-search-wrap { max-width: 100%; }
}
</style>
