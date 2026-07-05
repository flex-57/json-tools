<template>
  <!-- Leaf node: single primitive value from array -->
  <div v-if="data.nodeType === 'leaf'" class="gn-leaf">
    <Handle type="target" :position="Position.Left" class="gn-handle" />
    <span :class="['gn-leaf-val', 'gn-leaf-val--' + data.leafType]">{{ data.leafValue }}</span>
    <span class="gn-leaf-type">{{ data.leafType }}</span>
  </div>

  <!-- Header node: container key + badge + link icon -->
  <div v-else-if="data.nodeType === 'header'" class="gn-header-node">
    <Handle type="target" :position="Position.Left" class="gn-handle" />
    <span class="gn-hkey">{{ data.label }}</span>
    <span class="gn-hbadge">{{ data.containerType === 'array' ? '[' + data.size + ']' : '{' + data.size + '}' }}</span>
    <svg class="gn-hicon" width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M5 3H3a1.5 1.5 0 000 3h2M8 3h2a1.5 1.5 0 010 3H8M4 4.5h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M5 9H3a1.5 1.5 0 000 3h2M8 9h2a1.5 1.5 0 010 3H8M4 10.5h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    </svg>
    <Handle type="source" :position="Position.Right" class="gn-handle" />
  </div>

  <!-- Body node: key-value content -->
  <div v-else class="gn-body-node">
    <Handle type="target" :position="Position.Left" class="gn-handle" />
    <div class="gn-entries">
      <div v-for="entry in data.entries" :key="entry.key" class="gn-entry">
        <span class="gn-ekey">{{ entry.key }}:</span>
        <span :class="['gn-eval', entry.isContainer ? 'gn-eval--container' : 'gn-eval--' + entry.type]">{{ entry.value }}</span>
        <span class="gn-etype">{{ entry.type }}</span>
      </div>
    </div>
    <Handle v-if="data.hasOutgoing" type="source" :position="Position.Right" class="gn-handle" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { GraphNodeData } from '~/composables/useJsonGraph'

defineProps<{ data: GraphNodeData }>()
</script>

<style scoped>
.gn-handle {
  width: 7px !important; height: 7px !important;
  background: var(--c-border) !important;
  border: 1px solid var(--c-border-m) !important;
  border-radius: 50% !important;
}

.gn-leaf {
  padding: 7px 14px;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
  min-width: 60px;
  text-align: center;
}
.gn-leaf-val--string  { color: var(--type-str); }
.gn-leaf-val--number  { color: var(--type-num); }
.gn-leaf-val--boolean { color: var(--type-bool); }
.gn-leaf-val--null    { color: var(--type-null); font-style: italic; }
.gn-leaf-type { font-size: 10px; color: var(--c-t5); margin-left: 8px; }

.gn-header-node {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  background: var(--c-subtle);
  border: 1px solid var(--c-border-m);
  border-radius: 7px;
  font-family: var(--font-mono);
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.gn-hkey   { color: var(--c-t1); font-weight: 600; }
.gn-hbadge { color: var(--c-t4); font-size: 11px; background: var(--c-faint); border-radius: 3px; padding: 1px 5px; }
.gn-hicon  { color: var(--c-t5); flex-shrink: 0; }

.gn-body-node {
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 7px;
  font-family: var(--font-mono);
  font-size: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.35);
  min-width: 140px;
}
.gn-entries { padding: 9px 13px 10px; display: flex; flex-direction: column; gap: 1px; }
.gn-entry   { display: flex; gap: 6px; line-height: 1.65; overflow: hidden; }
.gn-ekey    { color: var(--c-t3); white-space: nowrap; flex-shrink: 0; }
.gn-eval    { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.gn-eval--string    { color: var(--type-str); }
.gn-eval--number    { color: var(--type-num); }
.gn-eval--boolean   { color: var(--type-bool); }
.gn-eval--null      { color: var(--type-null); font-style: italic; }
.gn-eval--container { color: var(--c-t4); }
.gn-etype { font-size: 10px; color: var(--c-t5); margin-left: auto; flex-shrink: 0; padding-left: 6px; }
</style>
