<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JWT <span class="title-amp">Generator</span></h1>
        <p class="page-subtitle">Create signed JSON Web Tokens in your browser. The secret never leaves your device.</p>
        <NuxtLink to="/guides/what-is-jwt" class="guide-link">New to JWTs? Read our guide →</NuxtLink>
      </div>
      <div class="mode-toggle">
        <div class="mode-indicator" :style="{ width: 'calc((100% - 6px) / 3)', transform: indicatorTransform }"/>
        <button v-for="a in ALGOS" :key="a" class="mode-btn" :class="{ 'mode-btn--active': algorithm === a }" @click="algorithm = a">{{ a }}</button>
      </div>
    </div>

    <div class="section-card" :class="{ 'section-card--error': !!error && !payloadValid, 'drop-target--active': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
      <div class="section-header">
        <span class="editor-label">Payload <span class="editor-label-sub">(JSON)</span></span>
        <div class="section-header-right">
          <span class="hint">or drop a .json file</span>
          <button class="btn-hint" :disabled="!payloadValid" title="Set iat to current timestamp" @click="setIatNow">iat = now</button>
          <button class="btn-hint" :disabled="!payloadValid" title="Add exp claim: iat + 1 hour" @click="addExp(1)">+ exp 1h</button>
          <button class="btn-xs" @click="clear">Clear</button>
        </div>
      </div>
      <textarea v-model="payload" class="section-textarea" spellcheck="false" rows="6" />
      <Transition name="fade">
        <div v-if="error" class="error-line">{{ error }}</div>
      </Transition>
    </div>

    <div class="section-card">
      <div class="section-header">
        <span class="editor-label">Secret Key</span>
        <span class="algo-hint">HMAC · {{ algorithm }}</span>
      </div>
      <input v-model="secret" class="secret-input" type="text" placeholder="your-256-bit-secret" spellcheck="false" autocomplete="off" >
    </div>

    <div class="output-card">
      <div class="section-header">
        <span class="editor-label">Generated JWT</span>
        <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!token" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
      </div>
      <div class="token-body" aria-live="polite">
        <div v-if="token" class="token-parts">
          <span class="token-part token-part--header">{{ parts[0] }}</span>
          <span class="token-dot">.</span>
          <span class="token-part token-part--payload">{{ parts[1] }}</span>
          <span class="token-dot">.</span>
          <span class="token-part token-part--signature">{{ parts[2] }}</span>
        </div>
        <div v-else class="token-placeholder">Generated token will appear here…</div>
      </div>
    </div>

    <div class="info-strip">Signed using the Web Crypto API. Your secret never leaves the browser</div>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['jwt-generator']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useJwtGenerator } from '~/composables/useJwtGenerator'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'JWT Generator: Create Signed JSON Web Tokens Online',
  'Generate signed JSON Web Tokens (JWT) in your browser. Supports HS256, HS384 and HS512. Set custom payload claims, secret key and expiry. Free, secret never sent to servers.',
  TOOL_FAQS['jwt-generator'],
)

const { algorithm, payload, secret, token, parts, error, copied, payloadValid, copy, clear, setIatNow, addExp } = useJwtGenerator()

const ALGOS = ['HS256', 'HS384', 'HS512'] as const

const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { payload.value = ev.target?.result as string }
  reader.readAsText(file)
}

const indicatorTransform = computed(() => {
  const idx = ALGOS.indexOf(algorithm.value)
  return idx === 0 ? 'none' : `translateX(${idx * 100}%)`
})

const seoCards = [
  {
    title: 'What is a JSON Web Token?',
    text: [
      'A JSON Web Token (JWT) is a compact, URL-safe string used to securely transmit information between parties. It consists of three Base64URL-encoded parts separated by dots: the header (algorithm and token type), the payload (claims such as user ID, roles, and expiry), and the signature.',
      'The signature is computed by hashing the header and payload with a secret key, allowing the receiver to verify that the token was not tampered with. JWTs are stateless: all the information needed to authenticate a request is contained within the token itself.',
    ],
  },
  {
    title: 'HS256 vs HS384 vs HS512',
    text: 'All three are HMAC algorithms that use a shared secret key — the number is the SHA hash size in bits. HS256 is by far the most common: fast, widely supported, and secure as long as the secret is strong (at least 256 bits of entropy). For asymmetric signing, use RS256 or ES256 instead — those need a key pair and aren\'t covered by this tool.',
    table: [
      { label: 'HS256', value: '32-byte signature — the common default' },
      { label: 'HS384', value: '48-byte signature — rarely needed' },
      { label: 'HS512', value: '64-byte signature — rarely needed' },
    ],
  },
  {
    title: 'Standard JWT claims',
    text: 'All registered claims are optional. The iat = now and + exp 1h buttons above are shortcuts for the two most commonly set ones during development and testing.',
    table: [
      { label: 'iss', value: 'Issuer — who issued the token' },
      { label: 'sub', value: 'Subject — usually a user ID' },
      { label: 'aud', value: 'Audience — the intended recipient' },
      { label: 'exp', value: 'Expiration time — Unix timestamp' },
      { label: 'nbf', value: 'Not before — Unix timestamp' },
      { label: 'iat', value: 'Issued at — when the token was created' },
      { label: 'jti', value: 'JWT ID — unique, prevents replay attacks' },
    ],
  },
]
</script>

<style scoped>
.section-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden; transition: border-color 0.2s; }
.section-card--error { border-color: rgb(var(--c-error-rgb) / 0.4); }
.section-header { padding: 11px 16px; border-bottom: 1px solid var(--c-border-s); display: flex; align-items: center; justify-content: space-between; min-height: 42px; flex-wrap: wrap; gap: 6px; }
.section-header-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.section-header-right .hint { white-space: nowrap; }
.editor-label-sub { font-family: var(--font-body); font-size: 11px; color: var(--c-t5); font-weight: 400; text-transform: none; letter-spacing: 0; }

.section-textarea { width: 100%; border: none; outline: none; resize: none; padding: 14px 16px; font-family: var(--font-mono); font-size: 12.5px; background: transparent; color: var(--c-t1); line-height: 1.8; display: block; }
.secret-input { width: 100%; border: none; outline: none; padding: 14px 16px; font-family: var(--font-mono); font-size: 13px; background: transparent; color: var(--c-t1); display: block; }
.secret-input::placeholder { color: var(--c-t5); }
.algo-hint { font-family: var(--font-mono); font-size: 11px; font-weight: 600; color: var(--c-t5); letter-spacing: 0.03em; }

.btn-hint { font-family: var(--font-mono); font-size: 11px; font-weight: 500; color: var(--c-t4); background: var(--c-faint); border: 1px solid var(--c-border-m); border-radius: 5px; padding: 2px 8px; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
.btn-hint:hover:not(:disabled) { color: var(--c-accent); border-color: rgb(var(--c-accent-rgb) / 0.4); background: rgb(var(--c-accent-rgb) / 0.05); }
.btn-hint:disabled { opacity: 0.35; cursor: not-allowed; }

.output-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden; }
.token-body { padding: 16px; background: var(--c-card-alt); min-height: 80px; }
.token-parts { font-family: var(--font-mono); font-size: 12.5px; line-height: 1.8; word-break: break-all; }
.token-part { border-radius: 3px; padding: 1px 3px; }
.token-part--header { background: rgb(var(--c-accent-rgb) / 0.1); color: var(--type-num); }
.token-part--payload { background: rgb(var(--c-valid-rgb) / 0.12); color: var(--c-valid); }
.token-part--signature { background: rgb(var(--c-accent-rgb) / 0.1); color: var(--c-accent); }
.token-dot { color: var(--c-t4); margin: 0 1px; }
.token-placeholder { font-family: var(--font-body); font-size: 13px; color: var(--c-t5); padding: 8px 0; }

.error-line { padding: 8px 16px; font-family: var(--font-body); font-size: 12.5px; color: var(--c-error); border-top: 1px solid rgb(var(--c-error-rgb) / 0.3); background: rgb(var(--c-error-rgb) / 0.06); }

@media (max-width: 768px) { .mode-btn { padding: 5px 10px; } }
</style>
