<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">JWT <span class="title-amp">Decoder</span></h1>
        <p class="page-subtitle">Decode and inspect JSON Web Tokens instantly. No data ever sent to servers.</p>
        <NuxtLink to="/guides/what-is-jwt" class="guide-link">New to JWTs? Read our guide →</NuxtLink>
      </div>
    </div>

    <div class="token-card">
      <div class="token-card-header">
        <span class="editor-label">Token</span>
        <button v-if="token" @click="clear" class="btn-xs">Clear</button>
      </div>
      <textarea v-model="token" class="token-input" placeholder="Paste your JWT here, e.g. eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.signature" spellcheck="false" rows="3" />
      <div v-if="token && !result.error" class="token-parts">
        <span class="token-part token-part--header">{{ result.header.raw }}</span>
        <span class="token-dot">.</span>
        <span class="token-part token-part--payload">{{ result.payload.raw }}</span>
        <span class="token-dot">.</span>
        <span class="token-part token-part--signature">{{ result.signature }}</span>
      </div>
    </div>

    <Transition name="status">
      <div v-if="result.error && result.error !== 'empty'" class="error-bar">{{ result.error }}</div>
    </Transition>

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

    <div v-if="result.header.decoded || result.payload.decoded" class="decoded-grid">
      <div class="decoded-card">
        <div class="decoded-card-header">
          <div class="decoded-label-wrap"><span class="decoded-dot decoded-dot--header" /><span class="editor-label">Header</span></div>
          <button @click="copyHeader" class="btn-copy" :class="{ 'btn-copy--done': copiedHeader }">{{ copiedHeader ? '✓ Copied' : 'Copy' }}</button>
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

      <div class="decoded-card">
        <div class="decoded-card-header">
          <div class="decoded-label-wrap"><span class="decoded-dot decoded-dot--payload" /><span class="editor-label">Payload</span></div>
          <button @click="copyPayload" class="btn-copy" :class="{ 'btn-copy--done': copiedPayload }">{{ copiedPayload ? '✓ Copied' : 'Copy' }}</button>
        </div>
        <div class="decoded-body">
          <template v-if="result.payload.decoded">
            <div v-for="(val, key) in result.payload.decoded" :key="key" class="claim-row">
              <span class="claim-key">{{ key }}<span v-if="knownClaims[key]" class="claim-hint">{{ knownClaims[key] }}</span></span>
              <span class="claim-val" :class="{ 'claim-val--date': isTimestamp(key) }">{{ isTimestamp(key) ? formatTimestamp(val) : formatValue(val) }}</span>
            </div>
          </template>
        </div>
      </div>

      <div class="sig-card">
        <div class="decoded-label-wrap"><span class="decoded-dot decoded-dot--signature" /><span class="editor-label">Signature</span></div>
        <p class="sig-text">{{ result.signature }}</p>
        <p class="sig-note">Signature is not verified. The secret key is never required or sent anywhere.</p>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useJwtDecoder } from '~/composables/useJwtDecoder'

useToolSeo(
  'JWT Decoder Online: Inspect & Decode JWT Tokens Free',
  'Decode and inspect JSON Web Tokens (JWT) instantly. View header, payload and expiration. Free, no data sent to servers.',
)

const { token, result, copiedHeader, copiedPayload, copyHeader, copyPayload, clear } = useJwtDecoder()
useUrlInput(token)

const seoCards = [
  {
    title: 'What is a JWT and what does decoding reveal?',
    text: 'A JSON Web Token (JWT) is a compact, URL-safe token with three Base64URL-encoded parts: a header (algorithm and type), a payload (claims about the user or session), and a signature. Decoding the header and payload requires no secret: it\'s public data. The signature proves integrity but can only be verified with the original key, which stays on your server.',
  },
  {
    title: 'Claims, expiry, and common debugging scenarios',
    text: 'The payload carries standard claims: sub (subject / user ID), iss (issuer), exp (expiration timestamp), iat (issued at), nbf (not before). The most common debugging need is checking whether a token is expired, and the decoder shows exp as a human-readable date alongside the raw timestamp. Custom claims added by your auth service also appear in full.',
  },
  {
    title: 'Security: what you can and cannot do here',
    text: 'This tool decodes (base64-decodes) the header and payload. It does not verify the signature. Verification requires the secret or public key, which you should never paste into a third-party tool. Decoding is safe: there is no secret involved, and because all processing happens in your browser, the token never reaches any server. Use this tool to inspect claims, not to validate tokens in production.',
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
.token-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden; }
.token-card-header { padding: 12px 16px 10px; border-bottom: 1px solid var(--c-border-s); display: flex; align-items: center; justify-content: space-between; }
.editor-label { font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--c-t4); }

.token-input { width: 100%; border: none; outline: none; resize: none; padding: 14px 16px; font-family: var(--font-mono); font-size: 12.5px; background: transparent; color: var(--c-t1); line-height: 1.8; display: block; }
.token-input::placeholder { color: var(--c-t5); }

.token-parts { padding: 10px 16px 14px; border-top: 1px solid var(--c-border-s); font-family: var(--font-mono); font-size: 11px; line-height: 1.8; word-break: break-all; }
.token-part { border-radius: 3px; padding: 1px 3px; }
.token-part--header { background: rgb(var(--c-accent-rgb) / 0.1); color: var(--type-num); }
.token-part--payload { background: rgb(var(--c-valid-rgb) / 0.12); color: var(--c-valid); }
.token-part--signature { background: rgb(var(--c-accent-rgb) / 0.1); color: var(--c-accent); }
.token-dot { color: var(--c-t4); margin: 0 1px; }

.error-bar { padding: 10px 14px; background: rgb(var(--c-error-rgb) / 0.1); border: 1px solid rgb(var(--c-error-rgb) / 0.3); border-radius: 10px; color: var(--c-error); font-family: var(--font-body); font-size: 13px; font-weight: 500; }

.exp-banner { border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.exp-banner--valid { background: rgb(var(--c-valid-rgb) / 0.08); border: 1px solid rgb(var(--c-valid-rgb) / 0.3); }
.exp-banner--expired { background: rgb(var(--c-error-rgb) / 0.08); border: 1px solid rgb(var(--c-error-rgb) / 0.3); }
.exp-main { display: flex; align-items: center; gap: 9px; }
.exp-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.exp-banner--valid .exp-dot { background: var(--c-valid); box-shadow: 0 0 0 3px rgb(var(--c-valid-rgb) / 0.25); }
.exp-banner--expired .exp-dot { background: var(--c-error); box-shadow: 0 0 0 3px rgb(var(--c-error-rgb) / 0.25); }
.exp-status { font-family: var(--font-body); font-weight: 600; font-size: 13.5px; }
.exp-banner--valid .exp-status { color: var(--c-valid); }
.exp-banner--expired .exp-status { color: var(--c-error); }
.exp-time { font-family: var(--font-mono); font-size: 12px; padding: 2px 8px; border-radius: 20px; font-weight: 500; }
.exp-banner--valid .exp-time { background: rgb(var(--c-valid-rgb) / 0.15); color: var(--c-valid); }
.exp-banner--expired .exp-time { background: rgb(var(--c-error-rgb) / 0.15); color: var(--c-error); }
.exp-dates { display: flex; gap: 16px; font-family: var(--font-body); font-size: 12px; color: var(--c-t4); }

.decoded-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; gap: 14px; }
.decoded-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden; }
.decoded-card-header { padding: 11px 16px; border-bottom: 1px solid var(--c-border-s); display: flex; align-items: center; justify-content: space-between; }
.decoded-label-wrap { display: flex; align-items: center; gap: 8px; }
.decoded-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.decoded-dot--header { background: var(--type-num); }
.decoded-dot--payload { background: var(--c-valid); }
.decoded-dot--signature { background: var(--c-accent); }

.decoded-body { padding: 8px 0; }
.claim-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 7px 16px; transition: background 0.1s; }
.claim-row:hover { background: var(--c-faint); }
.claim-key { font-family: var(--font-mono); font-size: 12px; color: var(--c-t2); font-weight: 500; flex-shrink: 0; display: flex; align-items: center; gap: 6px; }
.claim-hint { font-family: var(--font-body); font-size: 11px; color: var(--c-t5); font-weight: 400; }
.claim-val { font-family: var(--font-mono); font-size: 12px; color: var(--c-t3); text-align: right; word-break: break-all; }
.claim-val--date { color: var(--type-num); font-size: 11.5px; }

.sig-card { grid-column: 1 / -1; background: var(--c-card-alt); border: 1px solid var(--c-border); border-radius: var(--radius-card); padding: 14px 16px; display: flex; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
.sig-text { font-family: var(--font-mono); font-size: 11.5px; color: var(--c-accent); word-break: break-all; flex: 1; min-width: 200px; }
.sig-note { font-family: var(--font-body); font-size: 12px; color: var(--c-t4); flex-shrink: 0; max-width: 280px; }

.status-enter-active, .status-leave-active { transition: all 0.2s ease; }
.status-enter-from, .status-leave-to { opacity: 0; transform: translateY(-4px); }

@media (max-width: 768px) { .decoded-grid { grid-template-columns: 1fr; } }
</style>
