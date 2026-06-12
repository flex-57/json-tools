<template>
  <!-- Leaf node: single primitive value from array -->
  <div v-if="data.nodeType === 'leaf'" class="gn-leaf">
    <Handle type="target" :position="Position.Left" class="gn-handle" />
    <span :class="['gn-leaf-val', 'gn-leaf-val--' + data.leafType]">{{ data.leafValue }}</span>
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
        <span v-if="!entry.isContainer" class="gn-etype">{{ entry.type }}</span>
      </div>
    </div>
    <Handle type="source" :position="Position.Right" class="gn-handle" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { GraphNodeData } from '~/composables/useJsonGraph'

defineProps<{ data: GraphNodeData }>()
</script>

<style scoped>
/* ── Shared ──────────────────────────────────────────────── */
.gn-handle {
  width: 7px !important; height: 7px !important;
  background: #2E3540 !important;
  border: 1px solid #4A5568 !important;
  border-radius: 50% !important;
}

/* ── Leaf node ───────────────────────────────────────────── */
.gn-leaf {
  padding: 7px 14px;
  background: #1C2330;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  min-width: 60px;
  text-align: center;
}
.gn-leaf-val--string  { color: #98C379; }
.gn-leaf-val--number  { color: #61AFEF; }
.gn-leaf-val--boolean { color: #E5C07B; }
.gn-leaf-val--null    { color: #5C6470; font-style: italic; }

/* ── Header node ─────────────────────────────────────────── */
.gn-header-node {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  background: #252D3B;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 7px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.gn-hkey   { color: #E06C75; font-weight: 600; }
.gn-hbadge { color: #5C6470; font-size: 11px; background: rgba(255,255,255,0.05); border-radius: 3px; padding: 1px 5px; }
.gn-hicon  { color: #4A5568; flex-shrink: 0; }

/* ── Body node ───────────────────────────────────────────── */
.gn-body-node {
  background: #1C2330;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 7px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.35);
  min-width: 140px;
}
.gn-entries { padding: 9px 13px 10px; display: flex; flex-direction: column; gap: 1px; }
.gn-entry   { display: flex; gap: 6px; line-height: 1.65; overflow: hidden; }
.gn-ekey    { color: #ABB2BF; white-space: nowrap; flex-shrink: 0; }
.gn-eval    { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.gn-eval--string    { color: #98C379; }
.gn-eval--number    { color: #61AFEF; }
.gn-eval--boolean   { color: #E5C07B; }
.gn-eval--null      { color: #5C6470; font-style: italic; }
.gn-eval--container { color: #5C6470; }
.gn-etype { font-size: 10px; color: #3D4349; margin-left: auto; flex-shrink: 0; padding-left: 6px; }
</style>
