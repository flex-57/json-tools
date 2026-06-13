<template>
  <div class="tn" :class="{ 'tn--dim': isDimmed }">
    <div class="tn-row" :class="{ 'tn-row--clickable': hasChildren }" @click="hasChildren ? toggle(node.id) : null">
      <span v-for="d in depth" :key="d" class="tn-indent"><span class="tn-guide" /></span>

      <span class="tn-toggle-slot">
        <svg v-if="hasChildren" class="tn-chevron" :class="{ 'tn-chevron--open': !isCollapsed }" width="8" height="8" viewBox="0 0 8 8">
          <path d="M2 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>

      <span v-if="node.key !== ''" class="tn-key" :class="{ 'tn-key--match': keyMatch }">
        <template v-if="isArrayIndex"><span class="tn-index">{{ node.key }}</span></template>
        <template v-else>"<span class="tn-key-text">{{ node.key }}</span>"</template>
        <span class="tn-sep">:&nbsp;</span>
      </span>

      <template v-if="hasChildren">
        <span class="tn-bracket">{{ node.type === 'array' ? '[' : '{' }}</span>
        <template v-if="isCollapsed">
          <span class="tn-ellipsis">&nbsp;…&nbsp;</span>
          <span class="tn-count">{{ node.size }} {{ node.type === 'array' ? (node.size === 1 ? 'item' : 'items') : (node.size === 1 ? 'key' : 'keys') }}</span>
          <span class="tn-bracket">&nbsp;{{ node.type === 'array' ? ']' : '}' }}</span>
        </template>
      </template>

      <span v-else :class="['tn-val', 'tn-val--' + node.type, { 'tn-val--match': valueMatch }]">{{ displayValue }}</span>
      <span class="tn-type">{{ node.type }}</span>

      <button v-if="node.path" class="tn-copy" @click.stop="copy" :title="`Copy path: ${node.path}`">
        <svg v-if="!copied" width="11" height="11" viewBox="0 0 12 12" fill="none">
          <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
          <path d="M8 4V2.5A1.5 1.5 0 006.5 1h-4A1.5 1.5 0 001 2.5v4A1.5 1.5 0 002.5 8H4" stroke="currentColor" stroke-width="1.2"/>
        </svg>
        <svg v-else width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <template v-if="hasChildren && !isCollapsed">
      <JsonTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :is-array-parent="node.type === 'array'"
      />
      <div class="tn-row tn-row--close">
        <span v-for="d in depth" :key="d" class="tn-indent"><span class="tn-guide" /></span>
        <span class="tn-toggle-slot" />
        <span class="tn-bracket">{{ node.type === 'array' ? ']' : '}' }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { nodeHasMatch } from '~/composables/useJsonTree'
import type { TreeNode } from '~/composables/useJsonTree'

const props = defineProps<{
  node: TreeNode
  depth: number
  isArrayParent?: boolean
}>()

const collapsed = inject<Ref<Set<string>>>('tree:collapsed')!
const toggle    = inject<(id: string) => void>('tree:toggle')!
const search    = inject<Ref<string>>('tree:search')!

const hasChildren  = computed(() => props.node.children.length > 0)
const isCollapsed  = computed(() => collapsed.value.has(props.node.id))
const isArrayIndex = computed(() => props.isArrayParent === true)

const keyMatch = computed(() =>
  !!search.value && props.node.key.toLowerCase().includes(search.value.toLowerCase())
)
const valueMatch = computed(() => {
  if (!search.value || props.node.value == null) return false
  return String(props.node.value).toLowerCase().includes(search.value.toLowerCase())
})
const isDimmed = computed(() =>
  !!search.value && !nodeHasMatch(props.node, search.value)
)

const displayValue = computed(() => {
  const v = props.node.value
  if (props.node.type === 'null') return 'null'
  if (props.node.type === 'string') {
    const s = String(v)
    return `"${s.length > 120 ? s.slice(0, 120) + '…' : s}"`
  }
  return String(v)
})

const copied = ref(false)
async function copy() {
  await navigator.clipboard.writeText(props.node.path)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}
</script>

<style scoped>
.tn { font-family: 'JetBrains Mono', monospace; font-size: 13px; }
.tn--dim { opacity: 0.2; }

.tn-row {
  display: flex;
  align-items: center;
  min-height: 24px;
  padding: 1px 8px 1px 0;
  border-radius: 4px;
  position: relative;
}
.tn-row--clickable { cursor: pointer; }
.tn-row--clickable:hover { background: rgba(255,255,255,0.04); }
.tn-row:hover .tn-copy { opacity: 1; }

.tn-indent {
  display: inline-flex;
  align-items: stretch;
  width: 18px;
  flex-shrink: 0;
  position: relative;
}
.tn-guide {
  position: absolute;
  left: 9px;
  top: -2px;
  bottom: -2px;
  width: 1px;
  background: rgba(255,255,255,0.07);
}

.tn-toggle-slot {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 4px;
}
.tn-chevron {
  color: #5C6470;
  transition: transform 0.15s ease;
  transform: rotate(0deg);
}
.tn-chevron--open { transform: rotate(90deg); }

.tn-key { color: #E06C75; white-space: nowrap; }
.tn-key--match { background: rgba(249,115,22,0.2); border-radius: 3px; padding: 0 2px; }
.tn-key-text { color: #E06C75; }
.tn-index { color: #5C6470; }
.tn-sep { color: #5C6470; }

.tn-bracket { color: #ABB2BF; }
.tn-ellipsis { color: #5C6470; }
.tn-count {
  font-size: 11px;
  color: #5C6470;
  background: rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 1px 7px;
  margin: 0 4px;
}

.tn-val { white-space: pre; }
.tn-val--string  { color: #98C379; }
.tn-val--number  { color: #61AFEF; }
.tn-val--boolean { color: #E5C07B; }
.tn-val--null    { color: #5C6470; font-style: italic; }
.tn-val--match   { background: rgba(249,115,22,0.2); border-radius: 3px; padding: 0 2px; }

.tn-copy {
  opacity: 0;
  margin-left: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #5C6470;
  padding: 2px;
  border-radius: 3px;
  transition: opacity 0.1s, color 0.1s;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}
.tn-copy:hover { color: var(--c-t2); }
.tn-type { font-size: 10px; color: #5C6470; margin-left: 8px; flex-shrink: 0; }
</style>
