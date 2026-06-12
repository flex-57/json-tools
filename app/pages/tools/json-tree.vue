<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-amp">Tree Viewer</span></h1>
        <p class="page-subtitle">Explore JSON structure as an interactive collapsible tree. Click nodes to expand, hover to copy the full path.</p>
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

      <!-- Tree panel -->
      <div class="editor-card tree-card">
        <div class="editor-card-header tree-header">
          <span class="editor-label">Tree</span>
          <div v-if="root" class="tree-controls">
            <div class="tree-search-wrap">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" class="tree-search-icon">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.4"/>
                <path d="M9.5 9.5L13 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              <input v-model="search" class="tree-search" placeholder="Search keys & values…" />
              <button v-if="search" class="tree-search-clear" @click="search = ''">×</button>
            </div>
            <button class="btn-xs" @click="expandAll">Expand all</button>
            <button class="btn-xs" @click="collapseAll">Collapse all</button>
            <span class="tree-count">{{ nodeCount }} nodes</span>
          </div>
        </div>

        <div class="tree-body">
          <div v-if="error" class="tree-message tree-message--error">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M7 4v3M7 9.5v.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            {{ error }}
          </div>
          <div v-else-if="!input.trim()" class="tree-message">
            Paste valid JSON in the input panel
          </div>
          <div v-else-if="root" class="tree-wrap">
            <JsonTreeNode :node="root" :depth="0" />
          </div>
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { parseJsonTree, collectDeepIds, collectAllExpandableIds } from '~/composables/useJsonTree'
import type { TreeNode } from '~/composables/useJsonTree'

useHead({
  title: 'JSON Tree Viewer — Explore JSON as Collapsible Tree | JSON Tools',
  meta: [
    { name: 'description', content: 'Visualize any JSON as an interactive collapsible tree. Expand and collapse nodes, copy paths with one click, search keys and values instantly.' },
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

provide('tree:collapsed', collapsed)
provide('tree:toggle', (id: string) => {
  const next = new Set(collapsed.value)
  next.has(id) ? next.delete(id) : next.add(id)
  collapsed.value = next
})
provide('tree:search', search)

watch(input, (val) => {
  if (!val.trim()) { root.value = null; error.value = ''; return }
  const { root: r, error: e } = parseJsonTree(val)
  root.value = r
  error.value = e
  if (r) {
    // Auto-collapse nodes at depth >= 2
    collapsed.value = new Set(collectDeepIds(r, 2))
  }
}, { immediate: true })

const nodeCount = computed(() => {
  if (!root.value) return 0
  let count = 0
  function walk(n: TreeNode) { count++; n.children.forEach(walk) }
  walk(root.value)
  return count
})

function expandAll() {
  collapsed.value = new Set()
}
function collapseAll() {
  if (!root.value) return
  collapsed.value = new Set(collectAllExpandableIds(root.value))
}
function clear() {
  input.value = ''
  search.value = ''
}

const seoCards = [
  {
    title: 'Interactive collapsible tree',
    body: 'Click any object or array node to collapse or expand it. Deep structures auto-collapse at depth 2 so you get a clean overview without scrolling through hundreds of lines.',
  },
  {
    title: 'Copy path in one click',
    body: 'Hover any node to reveal the copy icon. Click it to copy the full dot/bracket path (e.g. users[0].email) directly to your clipboard — ready to use in code.',
  },
  {
    title: 'Search keys and values',
    body: 'Type in the search box to instantly highlight matching keys and values across the entire tree. Non-matching nodes are dimmed while parent context stays visible.',
  },
]
</script>

<style scoped>
.tree-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.tree-card { display: flex; flex-direction: column; min-height: 480px; }

.tree-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  min-height: 40px;
}

.tree-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  flex-wrap: wrap;
}

.tree-search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 140px;
  max-width: 220px;
}
.tree-search-icon {
  position: absolute;
  left: 8px;
  color: #9A9690;
  pointer-events: none;
}
.tree-search {
  width: 100%;
  padding: 4px 28px 4px 26px;
  background: #F7F5F2;
  border: 1px solid #E8E5DF;
  border-radius: 6px;
  font-size: 12px;
  color: #3A3830;
  outline: none;
  transition: border-color 0.15s;
}
.tree-search:focus { border-color: #F97316; }
.tree-search-clear {
  position: absolute;
  right: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9A9690;
  font-size: 14px;
  line-height: 1;
  padding: 0 2px;
}
.tree-search-clear:hover { color: #3A3830; }

.btn-xs {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 5px;
  border: 1px solid #E2DDD7;
  background: #F3F1EC;
  color: #6B6760;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.1s, color 0.1s;
}
.btn-xs:hover { background: #E8E5DF; color: #3A3830; }

.tree-count {
  font-size: 11px;
  color: #9A9690;
  white-space: nowrap;
  margin-left: auto;
}

.tree-body {
  flex: 1;
  overflow: auto;
  padding: 12px;
  background: #1A1B1E;
  border-radius: 0 0 10px 10px;
}

.tree-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
  font-size: 13px;
  color: #5C6470;
  font-family: 'JetBrains Mono', monospace;
  justify-content: center;
}
.tree-message--error { color: #E06C75; }

.tree-wrap { padding: 4px 0; }

@media (max-width: 768px) {
  .tree-layout { grid-template-columns: 1fr; }
  .tree-controls { gap: 6px; }
  .tree-search-wrap { max-width: 100%; }
}
</style>
