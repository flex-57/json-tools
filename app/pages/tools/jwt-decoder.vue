<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JWT <span class="title-amp">Decoder</span></h1>
        <p class="page-subtitle">Decode and inspect JSON Web Tokens instantly — no data sent to servers, never.</p>
      </div>
    </div>

    <!-- Token input -->
    <div class="token-card">
      <div class="token-card-header">
        <span class="editor-label">Token</span>
        <button v-if="token" @click="clear" class="btn-clear">Clear</button>
      </div>
      <textarea
        v-model="token"
        class="token-input"
        placeholder="Paste your JWT here — eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.signature"
        spellcheck="false"
        rows="3"
      />
      <!-- Token parts highlight -->
      <div v-if="token && !result.error" class="token-parts">
        <span class="token-part token-part--header">{{ result.header.raw }}</span>
        <span class="token-dot">.</span>
        <span class="token-part token-part--payload">{{ result.payload.raw }}</span>
        <span class="token-dot">.</span>
        <span class="token-part token-part--signature">{{ result.signature }}</span>
      </div>
    </div>

    <!-- Error -->
    <Transition name="status">
      <div v-if="result.error && result.error !== 'empty'" class="error-bar">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M7 4v3M7 9.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        {{ result.error }}
      </div>
    </Transition>

    <!-- Expiration banner -->
    <Transition name="status">
      <div v-if="result.isExpired !== null" :class="['exp-banner', result.isExpired ? 'exp-banner--expired' : 'exp-banner--valid']">
        <div class="exp-main">
          <span class="exp-dot" />
          <span class="exp-status">{{ result.isExpired ? 'Token expired' : 'Token valid' }}</span>
          <span class="exp-time">{{ result.timeLeft }}</span>
        </div>
        <div class="exp-dates">
          <span v-if="result.issuedAt">Issued: {{ formatDate(result.issuedAt) }}</span>
          <span v-if="result.expiresAt">Expires: {{ formatDate(result.expiresAt) }}</span>
        </div>
      </div>
    </Transition>

    <!-- Header + Payload -->
    <div v-if="result.header.decoded || result.payload.decoded" class="decoded-grid">
      <!-- Header -->
      <div class="decoded-card">
        <div class="decoded-card-header">
          <div class="decoded-label-wrap">
            <span class="decoded-dot decoded-dot--header" />
            <span class="editor-label">Header</span>
          </div>
          <button @click="copyHeader" class="btn-copy" :class="{ 'btn-copy--done': copiedHeader }">
            {{ copiedHeader ? '✓ Copied' : 'Copy' }}
          </button>
        </div>
        <div class="decoded-body">
          <template v-if="result.header.decoded">
            <div v-for="(val, key) in result.header.decoded" :key="key" class="claim-row">
              <span class="claim-key">{{ key }}</span>
              <span class="claim-val">{{ formatValue(val) }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- Payload -->
      <div class="decoded-card">
        <div class="decoded-card-header">
          <div class="decoded-label-wrap">
            <span class="decoded-dot decoded-dot--payload" />
            <span class="editor-label">Payload</span>
          </div>
          <button @click="copyPayload" class="btn-copy" :class="{ 'btn-copy--done': copiedPayload }">
            {{ copiedPayload ? '✓ Copied' : 'Copy' }}
          </button>
        </div>
        <div class="decoded-body">
          <template v-if="result.payload.decoded">
            <div v-for="(val, key) in result.payload.decoded" :key="key" class="claim-row">
              <span class="claim-key">{{ key }}<span v-if="knownClaims[key]" class="claim-hint">{{ knownClaims[key] }}</span></span>
              <span class="claim-val" :class="{ 'claim-val--date': isTimestamp(key) }">
                {{ isTimestamp(key) ? formatTimestamp(val) : formatValue(val) }}
              </span>
            </div>
          </template>
        </div>
      </div>

      <!-- Signature -->
      <div class="sig-card">
        <div class="decoded-label-wrap">
          <span class="decoded-dot decoded-dot--signature" />
          <span class="editor-label">Signature</span>
        </div>
        <p class="sig-text">{{ result.signature }}</p>
        <p class="sig-note">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2"/><path d="M6 4v3M6 8.5v.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
          Signature is not verified — the secret key is never required or sent anywhere.
        </p>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJwtDecoder } from '~/composables/useJwtDecoder'

useSeoMeta({
  title: 'JWT Decoder — Free Online Tool',
  description: 'Decode and inspect JSON Web Tokens (JWT) instantly. View header, payload and expiration. Free, no data sent to servers.',
  ogTitle: 'JWT Decoder — Free Online Tool',
  ogDescription: 'Decode and inspect JSON Web Tokens (JWT) instantly. View header, payload and expiration. Free, no data sent to servers.',
  twitterTitle: 'JWT Decoder — Free Online Tool',
  twitterDescription: 'Decode and inspect JSON Web Tokens (JWT) instantly. View header, payload and expiration. Free, no data sent to servers.',
})

const { token, result, copiedHeader, copiedPayload, copyHeader, copyPayload, clear } = useJwtDecoder()

const seoCards = [
  {
    title: 'What is a JWT and what does decoding reveal?',
    text: 'A JSON Web Token (JWT) is a compact, URL-safe token with three Base64URL-encoded parts: a header (algorithm and type), a payload (claims about the user or session), and a signature. Decoding the header and payload requires no secret — it\'s public data. The signature proves integrity but can only be verified with the original key, which stays on your server.',
  },
  {
    title: 'Claims, expiry, and common debugging scenarios',
    text: 'The payload carries standard claims: sub (subject / user ID), iss (issuer), exp (expiration timestamp), iat (issued at), nbf (not before). The most common debugging need is checking whether a token is expired — the decoder shows exp as a human-readable date alongside the raw timestamp. Custom claims added by your auth service also appear in full.',
  },
  {
    title: 'Security: what you can and cannot do here',
    text: 'This tool decodes (base64-decodes) the header and payload — it does not verify the signature. Verification requires the secret or public key, which you should never paste into a third-party tool. Decoding is safe: there is no secret involved, and because all processing happens in your browser, the token never reaches any server. Use this tool to inspect claims, not to validate tokens in production.',
  },
]

const knownClaims: Record<string, string> = {
  sub: 'subject', iss: 'issuer', aud: 'audience',
  exp: 'expires', iat: 'issued at', nbf: 'not before',
  jti: 'jwt id',
}

const timestampKeys = new Set(['exp', 'iat', 'nbf'])
function isTimestamp(key: string) { return timestampKeys.has(key) }

function formatValue(val: unknown): string {
  if (val === null) return 'null'
  if (Array.isArray(val)) return val.join(', ')
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

function formatTimestamp(ts: unknown): string {
  return new Date((ts as number) * 1000).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}

function formatDate(d: Date): string {
  return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}
</script>

<style scoped>
/* Token input card */
.token-card {
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
}
.token-card-header {
  padding: 12px 16px 10px;
  border-bottom: 1px solid var(--c-border-s);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btn-clear { font-size: 12px; color: var(--c-t4); background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; }
.btn-clear:hover { color: #DC2626; }

.token-input {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  background: transparent;
  color: var(--c-t1);
  line-height: 1.6;
  display: block;
}
.token-input::placeholder { color: var(--c-t5); }

.token-parts {
  padding: 10px 16px 14px;
  border-top: 1px solid var(--c-border-s);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  line-height: 1.8;
  word-break: break-all;
}
.token-part { border-radius: 3px; padding: 1px 3px; }
.token-part--header { background: #EFF6FF; color: #1D4ED8; }
.token-part--payload { background: #F0FDF4; color: #15803D; }
.token-part--signature { background: #FFF7ED; color: #C2410C; }
.token-dot { color: var(--c-t4); margin: 0 1px; }

/* Error bar */
.error-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #FFF1F0;
  border: 1px solid #FECACA;
  border-radius: 10px;
  color: #DC2626;
  font-size: 13px;
  font-weight: 500;
}

/* Expiration banner */
.exp-banner {
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.exp-banner--valid { background: #F0FDF4; border: 1px solid #BBF7D0; }
.exp-banner--expired { background: #FFF1F0; border: 1px solid #FECACA; }
.exp-main { display: flex; align-items: center; gap: 9px; }
.exp-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.exp-banner--valid .exp-dot { background: #16A34A; box-shadow: 0 0 0 3px #BBF7D0; }
.exp-banner--expired .exp-dot { background: #DC2626; box-shadow: 0 0 0 3px #FECACA; }
.exp-status { font-weight: 600; font-size: 13.5px; }
.exp-banner--valid .exp-status { color: #15803D; }
.exp-banner--expired .exp-status { color: #DC2626; }
.exp-time { font-size: 12.5px; padding: 2px 8px; border-radius: 20px; font-weight: 500; }
.exp-banner--valid .exp-time { background: #DCFCE7; color: #15803D; }
.exp-banner--expired .exp-time { background: #FEE2E2; color: #DC2626; }
.exp-dates { display: flex; gap: 16px; font-size: 12px; color: #6B7280; }

/* Decoded grid */
.decoded-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; gap: 14px; }

.decoded-card {
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
}
.decoded-card-header {
  padding: 11px 16px;
  border-bottom: 1px solid var(--c-border-s);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.decoded-label-wrap { display: flex; align-items: center; gap: 8px; }
.decoded-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.decoded-dot--header { background: #3B82F6; }
.decoded-dot--payload { background: #16A34A; }
.decoded-dot--signature { background: #F97316; }

.btn-copy {
  font-size: 12px; font-family: inherit; font-weight: 500;
  padding: 4px 10px; border-radius: 6px;
  border: 1px solid var(--c-border-m); background: var(--c-faint); color: var(--c-t3);
  cursor: pointer; transition: all 0.15s;
}
.btn-copy:hover { background: var(--c-subtle); }
.btn-copy--done { background: #F0FDF4; border-color: #BBF7D0; color: #16A34A; }

.decoded-body { padding: 8px 0; }
.claim-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 16px;
  transition: background 0.1s;
}
.claim-row:hover { background: var(--c-faint); }
.claim-key {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--c-t2);
  font-weight: 500;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}
.claim-hint { font-family: inherit; font-size: 11px; color: var(--c-t5); font-weight: 400; }
.claim-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--c-t3);
  text-align: right;
  word-break: break-all;
}
.claim-val--date { color: #7C3AED; font-size: 11.5px; }

/* Signature */
.sig-card {
  grid-column: 1 / -1;
  background: var(--c-card-alt);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  flex-wrap: wrap;
}
.sig-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  color: #C2410C;
  word-break: break-all;
  flex: 1;
  min-width: 200px;
}
.sig-note {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--c-t4);
  flex-shrink: 0;
  max-width: 280px;
}

.status-enter-active, .status-leave-active { transition: all 0.2s ease; }
.status-enter-from, .status-leave-to { opacity: 0; transform: translateY(-4px); }

@media (max-width: 768px) {
  .decoded-grid { grid-template-columns: 1fr; }
}</style>
