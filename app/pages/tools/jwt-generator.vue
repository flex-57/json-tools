<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JWT <span class="title-amp">Generator</span></h1>
        <p class="page-subtitle">Create signed JSON Web Tokens in your browser — secret never leaves your device.</p>
      </div>
      <div class="mode-toggle">
        <div class="mode-indicator" :style="{ transform: indicatorTransform }" />
        <button
          v-for="a in ALGOS"
          :key="a"
          :class="['mode-btn', algorithm === a ? 'mode-btn--active' : '']"
          @click="algorithm = a"
        >{{ a }}</button>
      </div>
    </div>

    <!-- Payload -->
    <div class="section-card" :class="{ 'section-card--error': !!error && !payloadValid }">
      <div class="section-header">
        <span class="editor-label">Payload <span class="editor-label-sub">(JSON)</span></span>
        <div class="section-header-right">
          <button @click="setIatNow" class="btn-hint" :disabled="!payloadValid" title="Set iat to current timestamp">iat = now</button>
          <button @click="addExp(1)" class="btn-hint" :disabled="!payloadValid" title="Add exp claim: iat + 1 hour">+ exp 1h</button>
        </div>
      </div>
      <textarea
        v-model="payload"
        class="section-textarea"
        spellcheck="false"
        rows="6"
      />
      <Transition name="fade-slot">
        <div v-if="error" class="error-line">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M7 4v3M7 9.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          {{ error }}
        </div>
      </Transition>
    </div>

    <!-- Secret -->
    <div class="section-card">
      <div class="section-header">
        <span class="editor-label">Secret Key</span>
        <span class="section-header-right">
          <span class="algo-hint">HMAC · {{ algorithm }}</span>
        </span>
      </div>
      <input
        v-model="secret"
        class="secret-input"
        type="text"
        placeholder="your-256-bit-secret"
        spellcheck="false"
        autocomplete="off"
      />
    </div>

    <!-- Output -->
    <div class="output-card">
      <div class="section-header">
        <span class="editor-label">Generated JWT</span>
        <button
          @click="copy"
          class="btn-copy"
          :class="{ 'btn-copy--done': copied }"
          :disabled="!token"
        >
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
      <div class="token-body">
        <div v-if="token" class="token-parts">
          <span class="token-part token-part--header">{{ parts[0] }}</span>
          <span class="token-dot">.</span>
          <span class="token-part token-part--payload">{{ parts[1] }}</span>
          <span class="token-dot">.</span>
          <span class="token-part token-part--signature">{{ parts[2] }}</span>
        </div>
        <div v-else class="token-placeholder">
          Generated token will appear here…
        </div>
      </div>
    </div>

    <!-- Info strip -->
    <div class="info-strip">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="6" cy="3.8" r="0.6" fill="currentColor"/></svg>
      <span>Signed using the Web Crypto API — your secret never leaves the browser</span>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJwtGenerator } from '~/composables/useJwtGenerator'

useSeoMeta({
  title: 'JWT Generator — Create Signed JSON Web Tokens Online',
  description: 'Generate signed JSON Web Tokens (JWT) in your browser. Supports HS256, HS384 and HS512. Set custom payload claims, secret key and expiry. Free, secret never sent to servers.',
  ogTitle: 'JWT Generator — Create Signed JSON Web Tokens Online',
  ogDescription: 'Generate signed JSON Web Tokens (JWT) in your browser. Supports HS256, HS384 and HS512. Set custom payload claims, secret key and expiry. Free, secret never sent to servers.',
  twitterTitle: 'JWT Generator — Create Signed JSON Web Tokens Online',
  twitterDescription: 'Generate signed JSON Web Tokens (JWT) in your browser. Supports HS256, HS384 and HS512. Set custom payload claims, secret key and expiry. Free, secret never sent to servers.',
  ogImage: 'https://jsontools.space/og/jwt-generator.png',
  twitterImage: 'https://jsontools.space/og/jwt-generator.png',
})

const { algorithm, payload, secret, token, parts, error, copied, payloadValid, copy, clear, setIatNow, addExp } = useJwtGenerator()

const ALGOS = ['HS256', 'HS384', 'HS512'] as const

const indicatorTransform = computed(() => {
  const idx = ALGOS.indexOf(algorithm.value)
  return idx === 0 ? 'none' : `translateX(${idx * 100}%)`
})

const seoCards = [
  {
    title: 'What is a JSON Web Token?',
    text: 'A JSON Web Token (JWT) is a compact, URL-safe string used to securely transmit information between parties. It consists of three Base64URL-encoded parts separated by dots: the header (algorithm and token type), the payload (claims such as user ID, roles, and expiry), and the signature. The signature is computed by hashing the header and payload with a secret key, allowing the receiver to verify that the token was not tampered with. JWTs are stateless — the server does not need to store session data because all the information needed to authenticate a request is contained within the token itself.',
  },
  {
    title: 'HS256 vs HS384 vs HS512',
    text: 'All three are HMAC algorithms that use a shared secret key. The number refers to the SHA hash size in bits: HS256 produces a 32-byte signature, HS384 a 48-byte signature, and HS512 a 64-byte signature. HS256 is by far the most common — it is fast, widely supported, and secure for most use cases as long as the secret is strong (at least 256 bits of entropy). HS384 and HS512 offer marginally stronger signatures but are rarely needed in practice. For asymmetric signing (where you want to verify without revealing the signing key), use RS256 or ES256 instead — those require a private/public key pair and are not covered by this tool.',
  },
  {
    title: 'Standard JWT claims',
    text: 'The JWT specification defines several registered claim names: iss (issuer) identifies who issued the token; sub (subject) identifies the principal (usually a user ID); aud (audience) identifies the intended recipient; exp (expiration time) is a Unix timestamp after which the token must not be accepted; nbf (not before) is a timestamp before which the token must not be accepted; iat (issued at) records when the token was created; jti (JWT ID) is a unique identifier to prevent replay attacks. All of these are optional. The iat = now and + exp 1h buttons above are shortcuts for the two most commonly set claims during development and testing.',
  },
]
</script>

<style scoped>
.page-header { align-items: flex-start; flex-wrap: wrap; gap: 20px; }

/* ── Algorithm toggle ────────────────────────────────────────────── */
.mode-toggle {
  position: relative;
  display: flex;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 3px;
  gap: 0;
  min-width: 210px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  margin-top: 4px;
}
.mode-indicator {
  position: absolute;
  top: 3px; bottom: 3px; left: 3px;
  width: calc((100% - 6px) / 3);
  background: linear-gradient(135deg, #F97316 0%, #FB923C 100%);
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(249,115,22,0.4), 0 2px 10px rgba(249,115,22,0.15);
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.mode-btn {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  border: none;
  background: none;
  color: var(--c-t4);
  cursor: pointer;
  transition: color 0.2s;
  white-space: nowrap;
}
.mode-btn--active { color: white; }
.mode-btn:not(.mode-btn--active):hover { color: var(--c-t2); }

/* ── Section cards ───────────────────────────────────────────────── */
.section-card {
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
  transition: border-color 0.2s;
}
.section-card--error { border-color: #FECACA; }

.section-header {
  padding: 11px 16px;
  border-bottom: 1px solid var(--c-border-s);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
}
.section-header-right { display: flex; align-items: center; gap: 8px; }
.editor-label-sub { font-size: 11px; color: var(--c-t5); font-weight: 400; }

.section-textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  background: transparent;
  color: var(--c-t1);
  line-height: 1.75;
  display: block;
}

.secret-input {
  width: 100%;
  border: none;
  outline: none;
  padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  background: transparent;
  color: var(--c-t1);
  display: block;
}
.secret-input::placeholder { color: var(--c-t5); }

.algo-hint {
  font-size: 11px;
  font-weight: 600;
  color: var(--c-t5);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.03em;
}

/* ── Hint buttons (iat / exp) ────────────────────────────────────── */
.btn-hint {
  font-size: 11.5px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  color: var(--c-t4);
  background: var(--c-faint);
  border: 1px solid var(--c-border-m);
  border-radius: 5px;
  padding: 2px 8px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.btn-hint:hover:not(:disabled) { color: #F97316; border-color: rgba(249,115,22,0.4); background: rgba(249,115,22,0.05); }
.btn-hint:disabled { opacity: 0.35; cursor: not-allowed; }

/* ── Output card ─────────────────────────────────────────────────── */
.output-card {
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
}

.token-body {
  padding: 16px;
  background: linear-gradient(160deg, var(--c-card-alt) 0%, var(--c-faint) 100%);
  min-height: 80px;
}

.token-parts {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  line-height: 1.8;
  word-break: break-all;
}
.token-part { border-radius: 3px; padding: 1px 3px; }
.token-part--header    { background: #EFF6FF; color: #1D4ED8; }
.token-part--payload   { background: #F0FDF4; color: #15803D; }
.token-part--signature { background: #FFF7ED; color: #C2410C; }
.token-dot { color: var(--c-t4); margin: 0 1px; }

.token-placeholder {
  font-size: 13px;
  color: var(--c-t5);
  padding: 8px 0;
}

/* ── Error line ──────────────────────────────────────────────────── */
.error-line {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 12.5px;
  color: #DC2626;
  border-top: 1px solid #FECACA;
  background: #FFF8F8;
}

/* ── Copy button ─────────────────────────────────────────────────── */
.btn-copy {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; font-family: inherit; font-weight: 500;
  padding: 3px 10px; border-radius: 6px;
  border: 1px solid var(--c-border-m); background: var(--c-faint); color: var(--c-t3);
  cursor: pointer; transition: all 0.15s;
}
.btn-copy:hover:not(:disabled) { background: var(--c-subtle); border-color: var(--c-border); }
.btn-copy--done { background: #F0FDF4; border-color: #BBF7D0; color: #16A34A; }
.btn-copy:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Info strip ──────────────────────────────────────────────────── */
.info-strip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--c-t5);
}

/* ── Transitions ─────────────────────────────────────────────────── */
.fade-slot-enter-active, .fade-slot-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-slot-enter-from, .fade-slot-leave-to { opacity: 0; transform: translateY(-3px); }

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .mode-toggle { min-width: 180px; }
  .mode-btn { padding: 5px 10px; }
}
</style>
