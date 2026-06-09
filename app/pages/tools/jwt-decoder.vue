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
  </div>
</template>

<script setup lang="ts">
import { useJwtDecoder } from '~/composables/useJwtDecoder'

useSeoMeta({
  title: 'JWT Decoder — Free Online Tool',
  description: 'Decode and inspect JSON Web Tokens (JWT) instantly. View header, payload and expiration. Free, no data sent to servers.',
})

const { token, result, copiedHeader, copiedPayload, copyHeader, copyPayload, clear } = useJwtDecoder()

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
.page { max-width: 900px; margin: 0 auto; padding: 32px 24px 40px; width: 100%; flex: 1; display: flex; flex-direction: column; gap: 14px; }
.page-header { margin-bottom: 4px; }
.page-title { font-size: 24px; font-weight: 700; color: #1A1916; letter-spacing: -0.6px; }
.title-amp { color: #F97316; font-weight: 400; }
.page-subtitle { margin-top: 6px; font-size: 13.5px; color: #7A776E; }

/* Token input card */
.token-card {
  background: white;
  border: 1px solid #E8E5DF;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
}
.token-card-header {
  padding: 12px 16px 10px;
  border-bottom: 1px solid #F0EDE7;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.editor-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #9A9690; }
.btn-clear { font-size: 12px; color: #A09C94; background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; }
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
  color: #1A1916;
  line-height: 1.6;
  display: block;
}
.token-input::placeholder { color: #C2BEB7; }

.token-parts {
  padding: 10px 16px 14px;
  border-top: 1px solid #F7F5F2;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  line-height: 1.8;
  word-break: break-all;
}
.token-part { border-radius: 3px; padding: 1px 3px; }
.token-part--header { background: #EFF6FF; color: #1D4ED8; }
.token-part--payload { background: #F0FDF4; color: #15803D; }
.token-part--signature { background: #FFF7ED; color: #C2410C; }
.token-dot { color: #9A9690; margin: 0 1px; }

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
  background: white;
  border: 1px solid #E8E5DF;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
}
.decoded-card-header {
  padding: 11px 16px;
  border-bottom: 1px solid #F0EDE7;
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
  border: 1px solid #DDD9D2; background: #FAFAF8; color: #6B6860;
  cursor: pointer; transition: all 0.15s;
}
.btn-copy:hover { background: #F3F1EC; }
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
.claim-row:hover { background: #FAFAF8; }
.claim-key {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #3A3830;
  font-weight: 500;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}
.claim-hint { font-family: inherit; font-size: 11px; color: #C2BEB7; font-weight: 400; }
.claim-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #6B6860;
  text-align: right;
  word-break: break-all;
}
.claim-val--date { color: #7C3AED; font-size: 11.5px; }

/* Signature */
.sig-card {
  grid-column: 1 / -1;
  background: #FDFCFA;
  border: 1px solid #E8E5DF;
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
  color: #9A9690;
  flex-shrink: 0;
  max-width: 280px;
}

.status-enter-active, .status-leave-active { transition: all 0.2s ease; }
.status-enter-from, .status-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
