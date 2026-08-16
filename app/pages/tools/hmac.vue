<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">HMAC <span class="title-amp">Generator</span></h1>
        <p class="page-subtitle">Compute HMAC-SHA1, SHA-256, SHA-384 and SHA-512 signatures with a secret key, instantly in your browser.</p>
        <NuxtLink to="/guides/what-is-hmac" class="guide-link">What is HMAC? Read our guide →</NuxtLink>
      </div>
      <div class="mode-toggle">
        <div class="mode-indicator" :class="{ 'mode-indicator--right': format === 'base64' }"/>
        <button class="mode-btn" :class="{ 'mode-btn--active': format === 'hex' }" @click="format = 'hex'">Hex</button>
        <button class="mode-btn" :class="{ 'mode-btn--active': format === 'base64' }" @click="format = 'base64'">Base64</button>
      </div>
    </div>

    <div class="hmac-layout">
      <div class="editor-card" :class="{ 'editor-card--focus': messageFocused, 'drop-target--active': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="editor-card-header">
          <div class="pane-label-group">
            <span class="editor-label">Message</span>
            <span class="hint">or drop a .txt file</span>
          </div>
          <div class="card-actions">
            <label class="btn-xs" for="hmac-file-input">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M2 10h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Browse
            </label>
            <input id="hmac-file-input" type="file" accept=".txt,text/plain" class="file-input" @change="onFileInput" >
            <span class="hint">{{ byteCount }} bytes</span>
            <button class="btn-xs" @click="clear">Clear</button>
          </div>
        </div>
        <textarea v-model="message" class="hmac-textarea" placeholder="Type or paste the message to sign…" spellcheck="false" @focus="messageFocused = true" @blur="messageFocused = false" />
      </div>

      <div class="editor-card" :class="{ 'editor-card--focus': secretFocused }">
        <div class="editor-card-header">
          <span class="editor-label">Secret key</span>
          <button class="btn-xs" @click="showSecret = !showSecret">{{ showSecret ? 'Hide' : 'Show' }}</button>
        </div>
        <input v-model="secret" :type="showSecret ? 'text' : 'password'" class="hmac-secret-input" placeholder="Enter the shared secret key…" spellcheck="false" autocomplete="off" @focus="secretFocused = true" @blur="secretFocused = false" >
      </div>

      <div class="hash-results" aria-live="polite">
        <div v-for="alg in HMAC_ALGORITHMS" :key="alg" class="hash-row">
          <span class="hash-alg">{{ alg }}</span>
          <span class="hash-value" :class="{ 'hash-value--empty': !hmacs[alg] }">{{ hmacs[alg] || '—' }}</span>
          <button class="hash-copy" :class="{ 'hash-copy--done': copied === alg }" :disabled="!hmacs[alg]" @click="copy(alg)">{{ copied === alg ? 'Copied!' : 'Copy' }}</button>
        </div>
      </div>
    </div>

    <div class="info-strip">No data sent to servers · computed via the native Web Crypto API</div>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['hmac']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '../../composables/useClipboard'
import { computeHmacs, HMAC_ALGORITHMS } from '~/composables/useHmac'
import type { HmacAlgorithm, HmacFormat } from '~/composables/useHmac'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'HMAC Generator: HMAC-SHA256 & SHA-512 Online',
  'Generate HMAC-SHA1, SHA-256, SHA-384 and SHA-512 signatures from a message and secret key, directly in your browser. No data is sent to any server.',
  TOOL_FAQS['hmac'],
)

const message = ref('Hello, World!')
const secret  = ref('secret-key')
const format  = ref<HmacFormat>('hex')
const messageFocused = ref(false)
const secretFocused  = ref(false)
const showSecret     = ref(false)

const hmacs = ref<Record<HmacAlgorithm, string>>({ 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' })

const isDragging = ref(false)
function loadFile(file: File) {
  const reader = new FileReader()
  reader.onload = (ev) => { message.value = ev.target?.result as string }
  reader.readAsText(file)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) loadFile(file)
}

function onFileInput(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) loadFile(file)
  target.value = ''
}

const byteCount = computed(() => new TextEncoder().encode(message.value).length)

let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch([message, secret, format], () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    hmacs.value = await computeHmacs(message.value, secret.value, format.value)
  }, 120)
}, { immediate: true })

const { isCopied, copy: copyKeyed } = useClipboard()
const copied = computed<HmacAlgorithm | null>(() =>
  (Object.keys(hmacs.value) as HmacAlgorithm[]).find(alg => isCopied(alg)) ?? null
)

function copy(alg: HmacAlgorithm) {
  if (!hmacs.value[alg]) return
  copyKeyed(alg, hmacs.value[alg])
}

function clear() { message.value = '' }

const seoCards = [
  {
    title: 'What is HMAC?',
    text: [
      'HMAC (Hash-based Message Authentication Code) combines a hash function with a secret key to produce a signature that proves both the integrity of a message and that it was signed by someone who knows the key.',
      'Unlike a plain hash, HMAC cannot be reproduced without the secret — this is what makes it useful for verifying webhook payloads, signing API requests, and authenticating tokens.',
    ],
  },
  {
    title: 'SHA-1, SHA-256, SHA-384 and SHA-512',
    text: 'Four algorithms cover almost every real-world HMAC use case. HMAC-MD5 is not offered: the Web Crypto API does not implement it, and every common signing scheme (webhooks, AWS SigV4, JWT) already uses SHA.',
    table: [
      { label: 'HMAC-SHA1', value: '160-bit — legacy systems, still common in older webhook schemes' },
      { label: 'HMAC-SHA256', value: '256-bit — the de facto standard (Stripe, GitHub, AWS SigV4, JWT HS256)' },
      { label: 'HMAC-SHA384', value: '384-bit — used by JWT HS384' },
      { label: 'HMAC-SHA512', value: '512-bit — maximum collision resistance, used by JWT HS512' },
    ],
  },
  {
    title: 'Client-side, no data sent',
    text: 'All signatures are computed directly in your browser using the native Web Crypto API (SubtleCrypto.sign). Neither your message nor your secret key ever leaves your machine — though as a general rule, avoid pasting production secrets into any web tool.',
  },
]
</script>

<style scoped>
.file-input { display: none; }
.hmac-layout { display: flex; flex-direction: column; gap: 16px; margin-bottom: 16px; }
.editor-card--focus { box-shadow: inset 0 0 0 2px rgb(var(--c-accent-rgb) / 0.2); }

.hmac-textarea { width: 100%; min-height: 120px; padding: 14px 16px; font-family: var(--font-mono); font-size: 13px; color: var(--c-t1); background: transparent; border: none; outline: none; resize: vertical; line-height: 1.7; }
.hmac-secret-input { width: 100%; padding: 14px 16px; font-family: var(--font-mono); font-size: 13px; color: var(--c-t1); background: transparent; border: none; outline: none; }
</style>
