<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">UUID <span class="title-amp">Generator</span></h1>
        <p class="page-subtitle">Generate random UUID v4 identifiers instantly. Choose format, bulk-generate up to 100, copy individually or all at once.</p>
      </div>
    </div>

    <div class="uuid-controls editor-card">
      <div class="editor-card-header"><span class="editor-label">Options</span></div>
      <div class="controls-body">
        <div class="control-group">
          <label class="control-label">Count</label>
          <div class="count-wrap">
            <button class="count-btn" @click="count = Math.max(1, count - 1)">−</button>
            <input v-model.number="count" type="number" min="1" max="100" class="count-input" >
            <button class="count-btn" @click="count = Math.min(100, count + 1)">+</button>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label">Format</label>
          <div class="format-toggle">
            <div class="format-indicator" :style="{ transform: 'translateX(' + formatIndex * 100 + '%)' }" />
            <button v-for="f in FORMATS" :key="f.id" :class="['format-btn', format === f.id ? 'format-btn--active' : '']" @click="format = f.id">{{ f.label }}</button>
          </div>
        </div>

        <div class="control-actions">
          <button class="btn btn-primary" @click="generate">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M1 7a6 6 0 1 0 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M1 3v4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Generate <span class="kb">Ctrl ↵</span>
          </button>
          <button class="btn btn-ghost" :class="{ 'btn--success': copiedAll }" @click="copyAll">
            <svg v-if="!copiedAll" width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            <svg v-else width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ copiedAll ? 'Copied!' : 'Copy all' }}
          </button>
        </div>
      </div>
    </div>

    <div class="uuid-list editor-card">
      <div class="editor-card-header">
        <span class="editor-label">Results</span>
        <span class="hint">{{ uuids.length }} UUIDs</span>
      </div>
      <div class="uuid-body" aria-live="polite">
        <div v-for="(uuid, i) in uuids" :key="i" class="uuid-row">
          <span class="uuid-index">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="uuid-value">{{ formatUuid(uuid) }}</span>
          <button class="uuid-copy" :class="{ 'uuid-copy--done': copiedIndex === i }" @click="copyOne(uuid, i)">{{ copiedIndex === i ? 'Copied!' : 'Copy' }}</button>
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '../../composables/useClipboard'

useToolSeo(
  'UUID Generator: Bulk Random UUID v4, Free & Instant',
  'Generate random UUID v4 identifiers in your browser. Bulk-generate up to 100 UUIDs, choose from standard, uppercase or no-dash formats, copy with one click.',
)

const FORMATS = [
  { id: 'standard', label: 'Standard' },
  { id: 'upper',    label: 'Uppercase' },
  { id: 'nodash',   label: 'No dashes' },
] as const
type Format = typeof FORMATS[number]['id']

const count       = ref(10)
const format      = ref<Format>('standard')
const uuids       = ref<string[]>([])
const { isCopied, copy: copyKeyed } = useClipboard()
const copiedIndex = computed<number | null>(() => {
  const idx = uuids.value.findIndex((_, i) => isCopied('uuid-' + i))
  return idx === -1 ? null : idx
})
const copiedAll   = computed(() => isCopied('all'))

const formatIndex = computed(() => FORMATS.findIndex(f => f.id === format.value))

useToolShortcut(generate)

function generate() {
  uuids.value = Array.from({ length: count.value }, () => crypto.randomUUID())
}

function formatUuid(uuid: string): string {
  if (format.value === 'upper')  return uuid.toUpperCase()
  if (format.value === 'nodash') return uuid.replace(/-/g, '')
  return uuid
}

function copyOne(uuid: string, index: number) {
  copyKeyed('uuid-' + index, formatUuid(uuid))
}

function copyAll() {
  copyKeyed('all', uuids.value.map(formatUuid).join('\n'))
}

onMounted(generate)

const seoCards = [
  {
    title: 'What is a UUID?',
    text: [
      'A UUID (Universally Unique Identifier) is a 128-bit label standardised by RFC 4122. It is represented as 32 hexadecimal digits grouped in five sections separated by hyphens: 8-4-4-4-12.',
      'UUIDs are designed to be unique across space and time without requiring a central registry, making them ideal for distributed systems, database primary keys, session tokens, and any situation where you need a unique ID without coordination.',
    ],
  },
  {
    title: 'UUID v4: random generation',
    text: [
      'Version 4 UUIDs are generated from random or pseudo-random numbers. Two bits are fixed (version and variant), and the remaining 122 bits are random, giving roughly 5.3 × 10³⁶ possible values.',
      'The probability of generating a duplicate is astronomically low: you would need to generate about 2.7 × 10¹⁸ UUIDs before having a 50% chance of a single collision. This tool uses the browser\'s native crypto.randomUUID().',
    ],
  },
  {
    title: 'Format variants',
    text: 'All three formats represent the same 128-bit value.',
    table: [
      { label: 'Standard', value: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx — lowercase, dashed' },
      { label: 'Uppercase', value: 'Same, but A-F instead of a-f — some older systems require it' },
      { label: 'No-dash', value: '32-char string — URLs, filenames, limited-syntax databases' },
    ],
  },
]
</script>

<style scoped>
.editor-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden; }
.editor-card-header { padding: 12px 16px; border-bottom: 1px solid var(--c-border-s); display: flex; align-items: center; justify-content: space-between; }
.editor-label { font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--c-t4); }
.uuid-controls { margin-bottom: 12px; }

.controls-body { display: flex; align-items: center; gap: 24px; padding: 14px 16px; flex-wrap: wrap; }
.control-group { display: flex; align-items: center; gap: 10px; }
.control-label { font-family: var(--font-body); font-size: 12px; font-weight: 600; color: var(--c-t3); white-space: nowrap; }

.count-wrap { display: flex; align-items: center; gap: 0; }
.count-btn { width: 28px; height: 28px; border: 1px solid var(--c-border); background: var(--c-subtle); color: var(--c-t3); font-size: 16px; line-height: 1; cursor: pointer; transition: background 0.1s; display: flex; align-items: center; justify-content: center; }
.count-btn:first-child { border-radius: 6px 0 0 6px; }
.count-btn:last-child  { border-radius: 0 6px 6px 0; }
.count-btn:hover { background: var(--c-border); }
.count-input { width: 52px; height: 28px; text-align: center; border: 1px solid var(--c-border); border-left: none; border-right: none; background: var(--c-card); font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: var(--c-t1); outline: none; appearance: textfield; }
.count-input::-webkit-outer-spin-button, .count-input::-webkit-inner-spin-button { appearance: none; -webkit-appearance: none; }

.format-toggle { position: relative; display: flex; background: var(--c-subtle); border: 1px solid var(--c-border); border-radius: 8px; padding: 2px; }
.format-indicator { position: absolute; top: 2px; left: 2px; width: calc((100% - 4px) / 3); bottom: 2px; background: var(--c-accent); border-radius: 6px; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.format-btn { flex: 1; position: relative; z-index: 1; border: none; background: transparent; font-family: var(--font-body); font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 6px; cursor: pointer; color: var(--c-t3); transition: color 0.15s; white-space: nowrap; }
.format-btn--active { color: var(--c-accent-ink); }

.control-actions { display: flex; gap: 8px; margin-left: auto; }

.uuid-body { display: flex; flex-direction: column; }
.uuid-row { display: flex; align-items: center; gap: 12px; padding: 9px 16px; border-bottom: 1px solid var(--c-border-s); transition: background 0.1s; }
.uuid-row:last-child { border-bottom: none; }
.uuid-row:hover { background: var(--c-faint); }

.uuid-index { font-family: var(--font-mono); font-size: 11px; color: var(--c-t5); flex-shrink: 0; width: 20px; }
.uuid-value { font-family: var(--font-mono); font-size: 13px; color: var(--c-t2); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.uuid-copy { display: flex; align-items: center; font-family: var(--font-body); font-size: 12px; font-weight: 500; padding: 3px 8px; border-radius: 5px; border: 1px solid var(--c-border); background: transparent; color: var(--c-t4); cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.15s; }
.uuid-copy:hover { background: var(--c-subtle); color: var(--c-t2); }
.uuid-copy--done { background: rgb(var(--c-valid-rgb) / 0.12); border-color: rgb(var(--c-valid-rgb) / 0.35); color: var(--c-valid); }

@media (max-width: 640px) { .controls-body { gap: 16px; } .control-actions { margin-left: 0; } .uuid-value { font-size: 11px; } }
</style>
