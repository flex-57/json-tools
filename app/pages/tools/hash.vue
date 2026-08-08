<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Hash <span class="title-amp">Generator</span></h1>
        <p class="page-subtitle">Compute MD5, SHA-1, SHA-256 and SHA-512 hashes instantly in your browser. Nothing is sent to any server.</p>
        <NuxtLink to="/guides/what-is-hash" class="guide-link">What is a hash function? Read our guide →</NuxtLink>
      </div>
    </div>

    <div class="hash-layout">
      <div class="editor-card" :class="{ 'editor-card--focus': focused, 'drop-target--active': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="editor-card-header">
          <span class="editor-label">Input</span>
          <div class="card-actions">
            <span class="hint">{{ byteCount }} bytes · or drop a .txt file</span>
            <button class="btn-xs" @click="clear">Clear</button>
          </div>
        </div>
        <textarea v-model="input" class="hash-textarea" placeholder="Type or paste any text…" spellcheck="false" @focus="focused = true" @blur="focused = false" />
      </div>

      <div class="hash-results" aria-live="polite">
        <div v-for="alg in HASH_ALGORITHMS" :key="alg" class="hash-row">
          <span class="hash-alg">{{ alg }}</span>
          <span class="hash-value" :class="{ 'hash-value--empty': !hashes[alg] }">{{ hashes[alg] || '—' }}</span>
          <button class="hash-copy" :class="{ 'hash-copy--done': copied === alg }" :disabled="!hashes[alg]" @click="copy(alg)">{{ copied === alg ? 'Copied!' : 'Copy' }}</button>
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['hash']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '../../composables/useClipboard'
import { computeHashes, HASH_ALGORITHMS } from '~/composables/useHash'
import type { HashAlgorithm } from '~/composables/useHash'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'Hash Generator: MD5, SHA-1, SHA-256, SHA-512 Online',
  'Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text, directly in your browser. No data is sent to any server.',
  TOOL_FAQS['hash'],
)

const input   = ref('Hello, World!')
useUrlInput(input)
const focused = ref(false)
const hashes  = ref<Record<HashAlgorithm, string>>({ 'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' })

const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}

const byteCount = computed(() => new TextEncoder().encode(input.value).length)

let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(input, async (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    hashes.value = await computeHashes(val)
  }, 120)
}, { immediate: true })

const { isCopied, copy: copyKeyed } = useClipboard()
const copied = computed<HashAlgorithm | null>(() =>
  (Object.keys(hashes.value) as HashAlgorithm[]).find(alg => isCopied(alg)) ?? null
)

function copy(alg: HashAlgorithm) {
  if (!hashes.value[alg]) return
  copyKeyed(alg, hashes.value[alg])
}

function clear() { input.value = '' }

const seoCards = [
  {
    title: 'What is a hash function?',
    text: [
      'A hash function takes an input of any size and produces a fixed-length string called a digest or checksum. The same input always produces the same output, but even a single character change produces a completely different hash.',
      'Hash functions are used to verify file integrity, store passwords (SHA-256 and above), generate cache keys, and sign API requests.',
    ],
  },
  {
    title: 'MD5, SHA-1, SHA-256 and SHA-512',
    text: 'Four algorithms cover almost every use case, from legacy checksums to modern security.',
    table: [
      { label: 'MD5', value: '128-bit · 32 hex chars — checksums, non-security IDs' },
      { label: 'SHA-1', value: '160-bit · 40 hex chars — deprecated for security' },
      { label: 'SHA-256', value: '256-bit · 64 hex chars — current security standard' },
      { label: 'SHA-512', value: '512-bit · 128 hex chars — maximum collision resistance' },
    ],
  },
  {
    title: 'Client-side, no data sent',
    text: [
      'All hashes are computed directly in your browser using the native Web Crypto API (SHA family) and a pure JavaScript MD5 implementation. Your input never leaves your machine.',
      'This makes the tool safe to use with sensitive data such as passwords, tokens, or private keys, though as a general rule you should never hash production secrets in a web tool.',
    ],
  },
]
</script>

<style scoped>
.hash-layout { display: flex; flex-direction: column; gap: 16px; margin-bottom: 16px; }
.editor-card--focus { box-shadow: inset 0 0 0 2px rgb(var(--c-accent-rgb) / 0.2); }

.hash-textarea { width: 100%; min-height: 160px; padding: 14px 16px; font-family: var(--font-mono); font-size: 13px; color: var(--c-t1); background: transparent; border: none; outline: none; resize: vertical; line-height: 1.7; }
</style>
