<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JSON <span class="title-amp">Diff</span></h1>
        <p class="page-subtitle">Compare two JSON objects and highlight every addition and deletion.</p>
      </div>
      <div class="header-actions">
        <button @click="swap" class="btn btn-ghost" title="Swap left and right">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 4h9M7 1l3 3-3 3M13 10H4M7 7l-3 3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Swap
        </button>
        <button @click="clear" class="btn btn-ghost">Clear</button>
      </div>
    </div>

    <!-- Editors -->
    <div class="editors">
      <div class="editor-card" :class="{ 'editor-card--focus': leftFocus }">
        <div class="editor-card-header">
          <div class="label-wrap">
            <span class="side-dot side-dot--left" />
            <span class="editor-label">Original</span>
          </div>
          <span v-if="result && !result.error" class="editor-stat editor-stat--removed">-{{ result.deletions }}</span>
        </div>
        <div class="editor-body" @focusin="leftFocus = true" @focusout="leftFocus = false">
          <ClientOnly>
            <JsonEditor v-model="left" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="editor-card" :class="{ 'editor-card--focus': rightFocus }">
        <div class="editor-card-header">
          <div class="label-wrap">
            <span class="side-dot side-dot--right" />
            <span class="editor-label">Modified</span>
          </div>
          <span v-if="result && !result.error" class="editor-stat editor-stat--added">+{{ result.additions }}</span>
        </div>
        <div class="editor-body" @focusin="rightFocus = true" @focusout="rightFocus = false">
          <ClientOnly>
            <JsonEditor v-model="right" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Status + diff output -->
    <Transition name="slide">
      <div v-if="result" class="diff-section">

        <!-- Status bar -->
        <div :class="['status-bar', result.error ? 'status-bar--error' : result.same ? 'status-bar--same' : 'status-bar--diff']">
          <template v-if="result.error">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M7 4v3M7 9.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            {{ result.error }}
          </template>
          <template v-else-if="result.same">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Identical — no differences found
          </template>
          <template v-else>
            <span class="stat-chip stat-chip--added">+{{ result.additions }} addition{{ result.additions !== 1 ? 's' : '' }}</span>
            <span class="stat-chip stat-chip--removed">-{{ result.deletions }} deletion{{ result.deletions !== 1 ? 's' : '' }}</span>
          </template>
        </div>

        <!-- Diff view -->
        <div v-if="!result.error && !result.same" class="diff-view">
          <div
            v-for="(entry, i) in result.lines"
            :key="i"
            :class="['diff-line', `diff-line--${entry.type}`]"
          >
            <span class="diff-gutter diff-gutter--left">{{ entry.lineLeft ?? '' }}</span>
            <span class="diff-gutter diff-gutter--right">{{ entry.lineRight ?? '' }}</span>
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

useSeoMeta({
  title: 'JSON Diff — Compare JSON Online',
  description: 'Compare two JSON objects side by side and see every addition and deletion highlighted. Free, instant, no data sent to servers.',
})

const { left, right, result, swap, clear } = useJsonDiff()

const seoCards = [
  {
    title: 'Why compare JSON rather than raw text',
    text: 'A plain text diff treats {"b":2,"a":1} and {"a":1,"b":2} as different — but they\'re the same JSON object. A JSON-aware diff normalises key order and data types before comparing, so you see only semantic differences: a field that changed value, a key that was added, an array element that was removed. This eliminates noise from formatting and key reordering.',
  },
  {
    title: 'Reading the diff output',
    text: 'Lines highlighted in red appear only in the left document (removed). Lines highlighted in green appear only in the right document (added). Unchanged lines are shown in neutral color. The counters in each panel header tell you at a glance how many additions and removals there are. Paste the two JSON documents, click Compare, and the diff updates immediately.',
  },
  {
    title: 'Debugging and review use cases',
    text: 'Developers compare API responses across environments to catch configuration drift between staging and production. QA engineers diff before/after snapshots of database records to verify a migration. Backend teams review the delta between two versions of a config file before deployment. Because both documents stay in your browser, you can paste sensitive payloads without concern.',
  },
]
const leftFocus = ref(false)
const rightFocus = ref(false)
</script>

<style scoped>
.header-actions { display: flex; gap: 6px; }

/* Bordered ghost override for page-header context */
.btn-ghost { background: white; color: #A09C94; border-color: #E8E5DF; }
.btn-ghost:hover { background: #F3F1EC; color: #3A3830; border-color: #C9C5BE; }

/* Editors — shorter min-height for the diff tool */
.editors { min-height: 320px; }
.editor-card--focus { border-color: #FDBA74; box-shadow: 0 0 0 3px rgba(249,115,22,0.08); }
.editor-card-header { padding: 11px 16px; }
.label-wrap { display: flex; align-items: center; gap: 8px; }
.side-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.side-dot--left { background: #EF4444; }
.side-dot--right { background: #22C55E; }
.editor-stat { font-size: 12px; font-weight: 700; font-family: 'JetBrains Mono', monospace; padding: 2px 8px; border-radius: 20px; }
.editor-stat--removed { background: #FEE2E2; color: #DC2626; }
.editor-stat--added { background: #DCFCE7; color: #16A34A; }

/* Diff section */
.diff-section { display: flex; flex-direction: column; gap: 0; border-radius: 14px; overflow: hidden; border: 1px solid #E8E5DF; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04); }

.status-bar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; font-size: 13px; font-weight: 500; }
.status-bar--same { background: #F0FDF4; color: #15803D; border-bottom: 1px solid #BBF7D0; }
.status-bar--error { background: #FFF1F0; color: #DC2626; border-bottom: 1px solid #FECACA; }
.status-bar--diff { background: #FDFCFA; color: #3A3830; border-bottom: 1px solid #F0EDE7; }

.stat-chip { padding: 2px 9px; border-radius: 20px; font-size: 12.5px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.stat-chip--added { background: #DCFCE7; color: #16A34A; }
.stat-chip--removed { background: #FEE2E2; color: #DC2626; }

/* Diff view */
.diff-view { background: white; overflow-x: auto; }
.diff-line { display: flex; align-items: baseline; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.7; min-height: 28px; border-bottom: 1px solid transparent; }
.diff-line--unchanged { background: white; color: #6B6860; }
.diff-line--added { background: #F0FDF4; color: #15803D; border-bottom-color: #DCFCE7; }
.diff-line--removed { background: #FFF1F0; color: #B91C1C; border-bottom-color: #FEE2E2; text-decoration-line: none; }
.diff-gutter { width: 36px; min-width: 36px; padding: 4px 8px; text-align: right; font-size: 11px; color: #C2BEB7; user-select: none; border-right: 1px solid #F0EDE7; }
.diff-line--added .diff-gutter { color: #86EFAC; border-right-color: #BBF7D0; }
.diff-line--removed .diff-gutter { color: #FCA5A5; border-right-color: #FEE2E2; }
.diff-sign { width: 20px; min-width: 20px; text-align: center; font-weight: 700; user-select: none; padding: 4px 0; }
.diff-line--added .diff-sign { color: #16A34A; }
.diff-line--removed .diff-sign { color: #DC2626; }
.diff-line--unchanged .diff-sign { color: #E2DFD8; }
.diff-content { flex: 1; padding: 4px 14px 4px 6px; white-space: pre; }

.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(8px); }
</style>
