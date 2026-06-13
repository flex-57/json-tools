<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Base64 <span class="title-amp">{{ mode === 'encode' ? 'Encoder' : 'Decoder' }}</span></h1>
        <p class="page-subtitle">Encode text to Base64 or decode Base64 back to text — instantly, client-side.</p>
      </div>
      <div class="header-controls">
        <!-- Mode toggle — sliding pill -->
        <div class="mode-toggle">
          <div class="mode-indicator" :class="{ 'mode-indicator--right': mode === 'decode' }" />
          <button :class="['mode-btn', mode === 'encode' ? 'mode-btn--active' : '']" @click="mode = 'encode'">Encode</button>
          <button :class="['mode-btn', mode === 'decode' ? 'mode-btn--active' : '']" @click="mode = 'decode'">Decode</button>
        </div>
        <!-- Variant toggle -->
        <div class="variant-toggle">
          <button :class="['variant-btn', variant === 'standard' ? 'variant-btn--active' : '']" @click="variant = 'standard'" title="Standard Base64 (A-Z a-z 0-9 + /)">Standard</button>
          <button :class="['variant-btn', variant === 'urlsafe' ? 'variant-btn--active' : '']" @click="variant = 'urlsafe'" title="URL-safe Base64 (- _ no padding) — used in JWT">URL-safe</button>
        </div>
      </div>
    </div>

    <div class="panels">
      <!-- Input -->
      <div class="panel-card" :class="{ 'panel-card--focused': inputFocused }">
        <div class="panel-card-glow" />
        <div class="panel-header">
          <span class="editor-label">{{ mode === 'encode' ? 'Plain text' : 'Base64 input' }}</span>
          <Transition name="fade-slot">
            <div v-if="input" class="panel-header-right">
              <span class="char-count">{{ input.length }} chars</span>
              <button @click="clear" class="btn-clear">Clear</button>
            </div>
          </Transition>
        </div>
        <textarea
          v-model="input"
          class="panel-textarea"
          :placeholder="mode === 'encode' ? 'Type or paste text to encode…' : 'Paste Base64 string to decode…'"
          spellcheck="false"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
        />
      </div>

      <!-- Swap -->
      <div class="swap-col">
        <button @click="handleSwap" class="swap-btn" :class="{ 'swap-btn--spinning': swapping }" :disabled="!output" title="Use output as input">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M1 5h11M9 2l3 3-3 3M15 11H4M7 8l-3 3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Output -->
      <div class="panel-card" :class="{ 'panel-card--error': !!error }">
        <div class="panel-header">
          <span class="editor-label">{{ mode === 'encode' ? 'Base64 output' : 'Decoded text' }}</span>
          <div class="panel-header-right">
            <Transition name="fade-slot">
              <span v-if="output && !error" class="char-count">{{ output.length }} chars</span>
            </Transition>
            <button @click="copy" class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output">
              <svg v-if="!copied" width="13" height="13" viewBox="0 0 14 14" fill="none">
                <rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <svg v-else width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>
        <div v-if="error" class="error-body">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M7 4v3M7 9.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          {{ error }}
        </div>
        <textarea
          v-else
          :value="output"
          class="panel-textarea panel-textarea--output"
          readonly
          :placeholder="mode === 'encode' ? 'Base64 output will appear here…' : 'Decoded text will appear here…'"
          spellcheck="false"
        />
      </div>
    </div>

    <!-- Info strip -->
    <div class="info-strip">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="6" cy="3.8" r="0.6" fill="currentColor"/></svg>
      <span>No data sent to servers</span>
      <span class="info-sep">·</span>
      <span>Unicode supported</span>
      <Transition name="fade-slot">
        <span v-if="variant === 'urlsafe'" class="info-jwt">· JWT-compatible</span>
      </Transition>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useBase64 } from '~/composables/useBase64'

useSeoMeta({
  title: 'Base64 Encoder / Decoder — Free Online Tool',
  description: 'Encode text to Base64 or decode Base64 strings instantly. Supports standard and URL-safe (JWT) variants. Free, no data sent to servers.',
  ogTitle: 'Base64 Encoder / Decoder — Free Online Tool',
  ogDescription: 'Encode text to Base64 or decode Base64 strings instantly. Supports standard and URL-safe (JWT) variants. Free, no data sent to servers.',
  twitterTitle: 'Base64 Encoder / Decoder — Free Online Tool',
  twitterDescription: 'Encode text to Base64 or decode Base64 strings instantly. Supports standard and URL-safe (JWT) variants. Free, no data sent to servers.',
})

const { mode, variant, input, output, error, copied, copy, clear, swap } = useBase64()

const inputFocused = ref(false)
const swapping = ref(false)

function handleSwap() {
  swapping.value = true
  swap()
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  setTimeout(() => { swapping.value = false }, 350)
}

const seoCards = [
  {
    title: 'What Base64 encoding is and is not',
    text: 'Base64 is an encoding scheme, not encryption. It converts binary data or text into a safe ASCII string using 64 printable characters. The output is about 33% larger than the input. It doesn\'t hide data — anyone can decode it instantly. Its purpose is transport safety: embedding binary in JSON, XML, or HTTP headers that only accept text.',
  },
  {
    title: 'Standard vs URL-safe (Base64url)',
    text: 'Standard Base64 uses + and / characters, which are special in URLs and can break query strings. URL-safe Base64 (Base64url) replaces + with - and / with _, making the output safe for URLs, filenames, and HTTP headers. JWT tokens use Base64url for their header and payload sections — the "JWT-compatible" variant here matches that format exactly.',
  },
  {
    title: 'Common uses: images, auth tokens, data URIs',
    text: 'Developers encode images or PDFs to Base64 to embed them directly in HTML data URIs or JSON API responses, avoiding a separate file request. Auth tokens, API keys, and session cookies are often Base64-encoded before being placed in Authorization headers. Configuration systems encode secrets to prevent accidental whitespace or special-character corruption in environment variables.',
  },
]
</script>

<style scoped>
.page-header { align-items: flex-start; flex-wrap: wrap; gap: 20px; }
.header-controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

/* ── Mode toggle — sliding pill ─────────────────────────────────── */
.mode-toggle {
  position: relative;
  display: flex;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.mode-indicator {
  position: absolute;
  top: 3px; bottom: 3px; left: 3px;
  width: calc(50% - 3.5px);
  background: linear-gradient(135deg, #F97316 0%, #FB923C 100%);
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(249,115,22,0.4), 0 2px 10px rgba(249,115,22,0.15);
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.mode-indicator--right { transform: translateX(calc(100% + 2px)); }

.mode-btn {
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 5px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  border: none;
  background: none;
  color: var(--c-t4);
  cursor: pointer;
  transition: color 0.2s;
  white-space: nowrap;
}
.mode-btn--active { color: white; }
.mode-btn:not(.mode-btn--active):hover { color: var(--c-t2); }

/* ── Variant toggle ──────────────────────────────────────────────── */
.variant-toggle {
  display: flex;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.variant-btn {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 500;
  font-family: inherit;
  border: none;
  background: none;
  color: var(--c-t4);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.variant-btn:hover { color: var(--c-t2); background: var(--c-subtle); }
.variant-btn--active { background: #1A1916; color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
.variant-btn--active:hover { background: #2A2920; }

/* ── Panels ──────────────────────────────────────────────────────── */
.panels { display: grid; grid-template-columns: 1fr 44px 1fr; gap: 0; align-items: stretch; min-height: 380px; }

.panel-card {
  position: relative;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
  transition: border-color 0.2s, box-shadow 0.25s;
}
.panel-card--focused {
  border-color: #FDBA74;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 24px rgba(249,115,22,0.08), 0 0 0 3px rgba(249,115,22,0.08);
}
/* Gradient strip at top — fades in when focused */
.panel-card-glow {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, #F97316 0%, #FDBA74 60%, transparent 100%);
  opacity: 0;
  transition: opacity 0.25s;
  z-index: 1;
  pointer-events: none;
}
.panel-card--focused .panel-card-glow { opacity: 1; }
.panel-card--error { border-color: #FECACA; }

.panel-header {
  padding: 11px 16px;
  border-bottom: 1px solid var(--c-border-s);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  min-height: 42px;
}
.panel-header-right { display: flex; align-items: center; gap: 8px; }
.char-count { font-size: 11.5px; color: var(--c-t5); font-family: 'JetBrains Mono', monospace; }

.panel-textarea {
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  background: transparent;
  color: var(--c-t1);
  line-height: 1.7;
  display: block;
}
.panel-textarea::placeholder { color: var(--c-t5); }
.panel-textarea--output {
  background: linear-gradient(160deg, var(--c-card-alt) 0%, var(--c-faint) 100%);
  color: var(--c-t2);
}

.error-body {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 14px 16px;
  font-size: 13px;
  color: #DC2626;
  background: #FFF8F8;
}

/* ── Swap ────────────────────────────────────────────────────────── */
.swap-col { display: flex; align-items: center; justify-content: center; }
.swap-btn {
  width: 34px; height: 34px;
  border-radius: 50%;
  border: 1px solid var(--c-border);
  background: var(--c-card);
  color: var(--c-t4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.swap-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #F97316, #FB923C);
  border-color: #F97316;
  color: white;
  box-shadow: 0 2px 10px rgba(249,115,22,0.4);
  transform: scale(1.1);
}
.swap-btn--spinning svg { animation: swap-rotate 0.35s cubic-bezier(0.4, 0, 0.2, 1) both; }
.swap-btn:disabled { opacity: 0.3; cursor: not-allowed; }

@keyframes swap-rotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(180deg); }
}

/* ── Buttons ─────────────────────────────────────────────────────── */
.btn-clear {
  font-size: 12px; color: var(--c-t4); background: none; border: none;
  cursor: pointer; font-family: inherit; padding: 2px 7px;
  border-radius: 5px; transition: all 0.15s;
}
.btn-clear:hover { color: #DC2626; background: #FFF1F0; }

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
.info-sep { color: var(--c-border-m); }
.info-jwt { color: #F97316; font-weight: 500; }

/* ── Transitions ─────────────────────────────────────────────────── */
.fade-slot-enter-active, .fade-slot-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-slot-enter-from, .fade-slot-leave-to { opacity: 0; transform: translateY(-3px); }

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .panels { grid-template-columns: 1fr; }
  .swap-col { height: 36px; }
  .header-controls { gap: 6px; }
}
</style>
