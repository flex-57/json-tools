<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Hash <span class="title-amp">Generator</span></h1>
        <p class="page-subtitle">Compute MD5, SHA-1, SHA-256 and SHA-512 hashes instantly in your browser — nothing is sent to any server.</p>
      </div>
      <div class="header-actions">
        <button @click="clear" class="btn btn-ghost">Clear</button>
      </div>
    </div>

    <div class="hash-layout">
      <!-- Input -->
      <div class="editor-card" :class="{ 'editor-card--focus': focused }">
        <div class="editor-card-header">
          <span class="editor-label">Input</span>
          <span class="editor-hint">{{ byteCount }} bytes</span>
        </div>
        <textarea
          v-model="input"
          class="hash-textarea"
          placeholder="Type or paste any text…"
          spellcheck="false"
          @focus="focused = true"
          @blur="focused = false"
        />
      </div>

      <!-- Results -->
      <div class="hash-results">
        <div v-for="alg in HASH_ALGORITHMS" :key="alg" class="hash-row">
          <span class="hash-alg">{{ alg }}</span>
          <span class="hash-value" :class="{ 'hash-value--empty': !hashes[alg] }">
            {{ hashes[alg] || '—' }}
          </span>
          <button class="hash-copy" :class="{ 'hash-copy--done': copied === alg }" :disabled="!hashes[alg]" @click="copy(alg)" :title="'Copy ' + alg">
            <svg v-if="copied !== alg" width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            <svg v-else width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { computeHashes, HASH_ALGORITHMS } from '~/composables/useHash'
import type { HashAlgorithm } from '~/composables/useHash'

useHead({
  title: 'Hash Generator — MD5, SHA-1, SHA-256, SHA-512 | JSON Tools',
  meta: [{ name: 'description', content: 'Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text, directly in your browser. No data is sent to any server.' }],
})

const input   = ref('')
const focused = ref(false)
const copied  = ref<HashAlgorithm | null>(null)
const hashes  = ref<Record<HashAlgorithm, string>>({ 'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-512': '' })

const byteCount = computed(() => new TextEncoder().encode(input.value).length)

watchDebounced(input, async (val) => {
  hashes.value = await computeHashes(val)
}, { debounce: 120, immediate: true })

async function copy(alg: HashAlgorithm) {
  if (!hashes.value[alg]) return
  await navigator.clipboard.writeText(hashes.value[alg])
  copied.value = alg
  setTimeout(() => { copied.value = null }, 1500)
}

function clear() { input.value = '' }

const seoCards = [
  {
    title: 'What is a hash function?',
    text: 'A hash function takes an input of any size and produces a fixed-length string called a digest or checksum. The same input always produces the same output, but even a single character change produces a completely different hash. Hash functions are used to verify file integrity, store passwords (SHA-256 and above), generate cache keys, and sign API requests.',
  },
  {
    title: 'MD5, SHA-1, SHA-256 and SHA-512',
    text: 'MD5 produces a 128-bit (32 hex characters) digest and is still widely used for checksums and non-security identifiers. SHA-1 produces 160 bits (40 hex chars) and is now deprecated for security. SHA-256 (256 bits, 64 hex chars) is the current standard for most security applications. SHA-512 (512 bits, 128 hex chars) provides extra margin and is used when maximum collision resistance is needed.',
  },
  {
    title: 'Client-side, no data sent',
    text: 'All hashes are computed directly in your browser using the native Web Crypto API (SHA family) and a pure JavaScript MD5 implementation. Your input never leaves your machine. This makes the tool safe to use with sensitive data such as passwords, tokens, or private keys — though you should never hash production secrets in a web tool as a general rule.',
  },
]
</script>

<style scoped>
.hash-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.hash-textarea {
  width: 100%;
  min-height: 160px;
  padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #1A1916;
  background: transparent;
  border: none;
  outline: none;
  resize: vertical;
  line-height: 1.6;
}

.hash-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hash-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 1px solid #E8E5DF;
  border-radius: 10px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

.hash-alg {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: white;
  background: #1A1916;
  border-radius: 5px;
  padding: 3px 8px;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.03em;
  min-width: 68px;
  text-align: center;
}

.hash-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #3A3830;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}
.hash-value--empty { color: #C9C7C2; }

.hash-copy {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #E8E5DF;
  background: #F7F5F2;
  cursor: pointer;
  color: #9A9690;
  transition: background 0.1s, color 0.1s, border-color 0.1s;
}
.hash-copy:hover:not(:disabled) { background: #EDEAE4; color: #3A3830; }
.hash-copy:disabled { opacity: 0.4; cursor: default; }
.hash-copy--done { background: #ECFDF5; border-color: #6EE7B7; color: #059669; }

@media (max-width: 640px) {
  .hash-value { font-size: 10px; }
  .hash-alg { min-width: 52px; font-size: 10px; }
}
</style>
