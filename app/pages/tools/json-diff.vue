<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-amp">Diff</span></h1>
        <p class="page-subtitle">Compare two JSON objects and highlight every addition and deletion.</p>
      </div>
      <button @click="swap" class="btn btn-ghost" title="Swap left and right">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 4h9M7 1l3 3-3 3M13 10H4M7 7l-3 3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Swap
      </button>
    </div>

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--drag': isDraggingLeft }" @dragover.prevent="isDraggingLeft = true" @dragleave="isDraggingLeft = false" @drop.prevent="onDropLeft">
        <div class="pane-header">
          <span class="pane-label"><span class="side-dot side-dot--left"></span>Original</span>
          <div class="card-actions">
            <span v-if="result && !result.error" class="diff-stat diff-stat--removed">-{{ result.deletions }}</span>
            <span class="hint">drop a .json file</span>
            <button class="btn-xs" @click="left = ''"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor v-model="left" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="midcol">
        <button class="swap-btn" @click="swap" title="Swap left and right">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 5h11M9 2l3 3-3 3M15 11H4M7 8l-3 3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>

      <div class="pane pane--alt" :class="{ 'pane--drag': isDraggingRight }" @dragover.prevent="isDraggingRight = true" @dragleave="isDraggingRight = false" @drop.prevent="onDropRight">
        <div class="pane-header">
          <span class="pane-label"><span class="side-dot side-dot--right"></span>Modified</span>
          <div class="card-actions">
            <span v-if="result && !result.error" class="diff-stat diff-stat--added">+{{ result.additions }}</span>
            <span class="hint">drop a .json file</span>
            <button class="btn-xs" @click="right = ''"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor v-model="right" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <Transition name="status">
      <div v-if="result" class="diff-section" aria-live="polite">
        <div class="statusbar" :class="result.error ? 'error' : result.same ? 'same' : ''">
          <template v-if="result.error">{{ result.error }}</template>
          <template v-else-if="result.same">Identical, no differences found</template>
          <template v-else>
            <span class="diff-stat diff-stat--added">+{{ result.additions }} addition{{ result.additions !== 1 ? 's' : '' }}</span>
            <span class="diff-stat diff-stat--removed">-{{ result.deletions }} deletion{{ result.deletions !== 1 ? 's' : '' }}</span>
          </template>
        </div>

        <div v-if="!result.error && !result.same" class="diff-view">
          <div v-for="(entry, i) in result.lines" :key="i" :class="['diff-line', `diff-line--${entry.type}`]">
            <span class="diff-gutter">{{ entry.lineLeft ?? '' }}</span>
            <span class="diff-gutter">{{ entry.lineRight ?? '' }}</span>
            <span class="diff-sign">{{ entry.type === 'added' ? '+' : entry.type === 'removed' ? '-' : ' ' }}</span>
            <span class="diff-content">{{ entry.line }}</span>
          </div>
        </div>
      </div>
    </Transition>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJsonDiff } from '~/composables/useJsonDiff'

useToolSeo(
  'JSON Diff Tool: Compare & Highlight JSON Differences Online',
  'Compare two JSON objects side by side and see every addition and deletion highlighted. Free, instant, no data sent to servers.',
)

const { left, right, result, swap } = useJsonDiff()

const isDraggingLeft = ref(false)
const isDraggingRight = ref(false)

function onDropLeft(e: DragEvent) {
  isDraggingLeft.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { left.value = ev.target?.result as string }
  reader.readAsText(file)
}
function onDropRight(e: DragEvent) {
  isDraggingRight.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { right.value = ev.target?.result as string }
  reader.readAsText(file)
}

const seoCards = [
  {
    title: 'Why compare JSON rather than raw text',
    text: 'A plain text diff treats {"b":2,"a":1} and {"a":1,"b":2} as different, but they\'re the same JSON object. A JSON-aware diff normalises key order and data types before comparing, so you see only semantic differences: a field that changed value, a key that was added, an array element that was removed. This eliminates noise from formatting and key reordering.',
  },
  {
    title: 'Reading the diff output',
    text: 'Lines highlighted in the error tone appear only in the left document (removed). Lines highlighted in the valid tone appear only in the right document (added). Unchanged lines are shown in neutral color. The counters in each panel header tell you at a glance how many additions and removals there are. Paste the two JSON documents and the diff updates immediately.',
  },
  {
    title: 'Debugging and review use cases',
    text: 'Developers compare API responses across environments to catch configuration drift between staging and production. QA engineers diff before/after snapshots of database records to verify a migration. Backend teams review the delta between two versions of a config file before deployment. Because both documents stay in your browser, you can paste sensitive payloads without concern.',
  },
]
</script>

<style scoped>
.side-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 6px; }
.side-dot--left { background: var(--c-error); }
.side-dot--right { background: var(--c-valid); }

.diff-stat { font-family: var(--font-mono); font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 20px; }
.diff-stat--removed { background: rgb(var(--c-error-rgb) / 0.12); color: var(--c-error); }
.diff-stat--added { background: rgb(var(--c-valid-rgb) / 0.12); color: var(--c-valid); }

.diff-section { display: flex; flex-direction: column; border-radius: var(--radius-card); overflow: hidden; border: 1px solid var(--c-border); }

.statusbar.same { color: var(--c-valid); }
.statusbar.error { color: var(--c-error); }

.diff-view { background: var(--c-card); overflow-x: auto; }
.diff-line { display: flex; align-items: baseline; font-family: var(--font-mono); font-size: 12.5px; line-height: 1.7; min-height: 26px; }
.diff-line--unchanged { color: var(--c-t3); }
.diff-line--added { background: rgb(var(--c-valid-rgb) / 0.08); color: var(--c-valid); }
.diff-line--removed { background: rgb(var(--c-error-rgb) / 0.08); color: var(--c-error); }
.diff-gutter { width: 34px; min-width: 34px; padding: 4px 6px; text-align: right; font-size: 11px; color: var(--c-t5); user-select: none; }
.diff-sign { width: 18px; min-width: 18px; text-align: center; font-weight: 700; user-select: none; padding: 4px 0; }
.diff-content { flex: 1; padding: 4px 14px 4px 6px; white-space: pre; }

.status-enter-active, .status-leave-active { transition: all 0.2s ease; }
.status-enter-from, .status-leave-to { opacity: 0; transform: translateY(8px); }
</style>
