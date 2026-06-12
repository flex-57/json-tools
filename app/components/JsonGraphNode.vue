<template>
  <div class="gn" :style="{ width: GRAPH_NODE_WIDTH + 'px' }">
    <Handle type="target" :position="Position.Left" class="gn-handle" />

    <div class="gn-header">
      <span class="gn-label">{{ data.label === 'root' ? 'root' : '"' + data.label + '"' }}</span>
      <span class="gn-badge">{{ data.nodeType === 'array' ? '[' + data.size + ']' : '{' + data.size + '}' }}</span>
    </div>

    <div class="gn-body">
      <div v-for="entry in data.entries" :key="entry.key" class="gn-entry">
        <span class="gn-ekey">"{{ entry.key }}"</span>
        <span class="gn-esep">:&nbsp;</span>
        <span :class="['gn-eval', 'gn-eval--' + entry.type]">{{ entry.value }}</span>
      </div>
      <div v-if="!data.entries.length" class="gn-empty">— empty —</div>
    </div>

    <Handle type="source" :position="Position.Right" class="gn-handle" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { GRAPH_NODE_WIDTH } from '~/composables/useJsonGraph'
import type { GraphNodeData } from '~/composables/useJsonGraph'

defineProps<{ data: GraphNodeData }>()
</script>

<style scoped>
.gn {
  background: #1C2330;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
}

.gn-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #252D3B;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  gap: 8px;
}

.gn-label {
  color: #E06C75;
  font-weight: 600;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.gn-badge {
  font-size: 10px;
  color: #5C6470;
  background: rgba(255,255,255,0.06);
  border-radius: 4px;
  padding: 1px 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

.gn-body {
  padding: 6px 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.gn-entry {
  display: flex;
  align-items: baseline;
  gap: 0;
  overflow: hidden;
  line-height: 1.6;
}

.gn-ekey  { color: #ABB2BF; white-space: nowrap; }
.gn-esep  { color: #5C6470; }
.gn-eval  { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; flex: 1; }
.gn-eval--string  { color: #98C379; }
.gn-eval--number  { color: #61AFEF; }
.gn-eval--boolean { color: #E5C07B; }
.gn-eval--null    { color: #5C6470; font-style: italic; }

.gn-empty { color: #3D4349; font-style: italic; padding: 4px 0; }

.gn-handle {
  width: 8px !important;
  height: 8px !important;
  background: #3D4349 !important;
  border: 1px solid #5C6470 !important;
}
</style>
