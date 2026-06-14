<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">UUID <span class="title-amp">Generator</span></h1>
        <p class="page-subtitle">Generate random UUID v4 identifiers instantly. Choose format, bulk-generate up to 100, copy individually or all at once.</p>
      </div>
    </div>

    <!-- Controls -->
    <div class="uuid-controls editor-card">
      <div class="editor-card-header">
        <span class="editor-label">Options</span>
      </div>
      <div class="controls-body">
        <div class="control-group">
          <label class="control-label">Count</label>
          <div class="count-wrap">
            <button class="count-btn" @click="count = Math.max(1, count - 1)">−</button>
            <input v-model.number="count" type="number" min="1" max="100" class="count-input" />
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
          <button @click="generate" class="btn btn-primary">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M1 7a6 6 0 1 0 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M1 3v4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Generate
          </button>
          <button @click="copyAll" class="btn btn-ghost" :class="{ 'btn--success': copiedAll }">
            <svg v-if="!copiedAll" width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            <svg v-else width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ copiedAll ? 'Copied!' : 'Copy all' }}
          </button>
        </div>
      </div>
    </div>

    <!-- UUID list -->
    <div class="uuid-list editor-card">
      <div class="editor-card-header">
        <span class="editor-label">Results</span>
        <span class="editor-hint">{{ uuids.length }} UUIDs</span>
      </div>
      <div class="uuid-body">
        <div v-for="(uuid, i) in uuids" :key="i" class="uuid-row">
          <span class="uuid-index">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="uuid-value">{{ formatUuid(uuid) }}</span>
          <button class="uuid-copy" :class="{ 'uuid-copy--done': copiedIndex === i }" @click="copyOne(uuid, i)">
            {{ copiedIndex === i ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'UUID Generator — Random UUID v4 | JSON Tools',
  description: 'Generate random UUID v4 identifiers in your browser. Bulk-generate up to 100 UUIDs, choose from standard, uppercase or no-dash formats, copy with one click.',
  ogTitle: 'UUID Generator — Random UUID v4 | JSON Tools',
  ogDescription: 'Generate random UUID v4 identifiers in your browser. Bulk-generate up to 100 UUIDs, choose from standard, uppercase or no-dash formats, copy with one click.',
  twitterTitle: 'UUID Generator — Random UUID v4 | JSON Tools',
  twitterDescription: 'Generate random UUID v4 identifiers in your browser. Bulk-generate up to 100 UUIDs, choose from standard, uppercase or no-dash formats, copy with one click.',
  ogImage: 'https://jsontools.space/og/uuid.png',
  twitterImage: 'https://jsontools.space/og/uuid.png',
})

const FORMATS = [
  { id: 'standard', label: 'Standard' },
  { id: 'upper',    label: 'Uppercase' },
  { id: 'nodash',   label: 'No dashes' },
] as const
type Format = typeof FORMATS[number]['id']

const count       = ref(10)
const format      = ref<Format>('standard')
const uuids       = ref<string[]>([])
const copiedIndex = ref<number | null>(null)
const copiedAll   = ref(false)

const formatIndex = computed(() => FORMATS.findIndex(f => f.id === format.value))

function generate() {
  uuids.value = Array.from({ length: count.value }, () => crypto.randomUUID())
}

function formatUuid(uuid: string): string {
  if (format.value === 'upper')  return uuid.toUpperCase()
  if (format.value === 'nodash') return uuid.replace(/-/g, '')
  return uuid
}

async function copyOne(uuid: string, index: number) {
  await navigator.clipboard.writeText(formatUuid(uuid))
  copiedIndex.value = index
  setTimeout(() => { copiedIndex.value = null }, 1500)
}

async function copyAll() {
  await navigator.clipboard.writeText(uuids.value.map(formatUuid).join('\n'))
  copiedAll.value = true
  setTimeout(() => { copiedAll.value = false }, 1500)
}

onMounted(generate)

const seoCards = [
  {
    title: 'What is a UUID?',
    text: 'A UUID (Universally Unique Identifier) is a 128-bit label standardised by RFC 4122. It is represented as 32 hexadecimal digits grouped in five sections separated by hyphens: 8-4-4-4-12. UUIDs are designed to be unique across space and time without requiring a central registry, making them ideal for distributed systems, database primary keys, session tokens, and any situation where you need a unique ID without coordination.',
  },
  {
    title: 'UUID v4 — random generation',
    text: 'Version 4 UUIDs are generated from random or pseudo-random numbers. Two bits are fixed (version and variant), and the remaining 122 bits are random, giving roughly 5.3 × 10³⁶ possible values. The probability of generating a duplicate is astronomically low — you would need to generate about 2.7 × 10¹⁸ UUIDs before having a 50% chance of a single collision. This tool uses the browser\'s native crypto.randomUUID() which relies on a cryptographically secure random number generator.',
  },
  {
    title: 'Format variants',
    text: 'The standard format uses lowercase and dashes: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx. Uppercase format is identical but with A–F instead of a–f, which some older systems require. The no-dash format strips the hyphens to produce a 32-character string, useful in URLs, filenames, or databases that do not support the full UUID syntax. All three formats represent the same 128-bit value.',
  },
]
</script>

<style scoped>
.uuid-controls { margin-bottom: 12px; }

.controls-body {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 14px 16px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-t3);
  white-space: nowrap;
}

/* Count stepper */
.count-wrap { display: flex; align-items: center; gap: 0; }
.count-btn {
  width: 28px; height: 28px;
  border: 1px solid var(--c-border);
  background: var(--c-subtle);
  color: var(--c-t3);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.1s;
  display: flex; align-items: center; justify-content: center;
}
.count-btn:first-child { border-radius: 6px 0 0 6px; }
.count-btn:last-child  { border-radius: 0 6px 6px 0; }
.count-btn:hover { background: var(--c-border); }
.count-input {
  width: 52px; height: 28px;
  text-align: center;
  border: 1px solid var(--c-border);
  border-left: none; border-right: none;
  background: var(--c-card);
  font-size: 13px;
  font-weight: 600;
  color: var(--c-t1);
  outline: none;
  -moz-appearance: textfield;
}
.count-input::-webkit-outer-spin-button,
.count-input::-webkit-inner-spin-button { -webkit-appearance: none; }

/* Format toggle */
.format-toggle {
  position: relative;
  display: flex;
  background: var(--c-subtle);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 2px;
}
.format-indicator {
  position: absolute;
  top: 2px; left: 2px;
  width: calc((100% - 4px) / 3);
  bottom: 2px;
  background: #1A1916;
  border-radius: 6px;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.format-btn {
  flex: 1;
  position: relative; z-index: 1;
  border: none; background: transparent;
  font-size: 12px; font-weight: 600;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--c-t4);
  transition: color 0.15s;
  white-space: nowrap;
}
.format-btn--active { color: white; }

.control-actions { display: flex; gap: 8px; margin-left: auto; }

/* UUID list */
.uuid-body { display: flex; flex-direction: column; }

.uuid-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 16px;
  border-bottom: 1px solid var(--c-border-s);
  transition: background 0.1s;
}
.uuid-row:last-child { border-bottom: none; }
.uuid-row:hover { background: var(--c-faint); }

.uuid-index {
  font-size: 11px;
  color: var(--c-t5);
  font-family: 'JetBrains Mono', monospace;
  flex-shrink: 0;
  width: 20px;
}

.uuid-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--c-t2);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.uuid-copy {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-family: inherit;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 5px;
  border: 1px solid var(--c-border);
  background: transparent;
  color: var(--c-t4);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.1s, color 0.1s, border-color 0.1s;
}
.uuid-copy:hover { background: var(--c-subtle); color: var(--c-t2); }
.uuid-copy--done { background: #ECFDF5; border-color: #6EE7B7; color: #059669; }

@media (max-width: 640px) {
  .controls-body { gap: 16px; }
  .control-actions { margin-left: 0; }
  .uuid-value { font-size: 11px; }
}
</style>
