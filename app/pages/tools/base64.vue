<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Base64 <span class="title-amp">{{ mode === 'encode' ? 'Encoder' : 'Decoder' }}</span></h1>
        <p class="page-subtitle">Encode text to Base64 or decode Base64 back to text — instantly, client-side.</p>
      </div>
      <div class="header-controls">
        <!-- Mode toggle -->
        <div class="mode-toggle">
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
      <div class="panel-card">
        <div class="panel-header">
          <span class="editor-label">{{ mode === 'encode' ? 'Plain text' : 'Base64 input' }}</span>
          <span v-if="input" class="char-count">{{ input.length }} chars</span>
        </div>
        <textarea
          v-model="input"
          class="panel-textarea"
          :placeholder="mode === 'encode' ? 'Type or paste text to encode…' : 'Paste Base64 string to decode…'"
          spellcheck="false"
        />
      </div>

      <!-- Swap + arrow -->
      <div class="swap-col">
        <button @click="swapToInput" class="swap-btn" :disabled="!output" title="Use output as input">
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
            <span v-if="output" class="char-count">{{ output.length }} chars</span>
            <button @click="copy" class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output">
              {{ copied ? '✓ Copied' : 'Copy' }}
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

    <!-- Footer actions -->
    <div class="footer-bar">
      <button @click="clear" class="btn-ghost">Clear</button>
      <div class="info-chips">
        <span class="info-chip">No data sent to servers</span>
        <span class="info-chip info-chip--sep">·</span>
        <span class="info-chip">Unicode supported</span>
        <span v-if="variant === 'urlsafe'" class="info-chip info-chip--sep">·</span>
        <span v-if="variant === 'urlsafe'" class="info-chip info-chip--highlight">JWT-compatible</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBase64 } from '~/composables/useBase64'

useSeoMeta({
  title: 'Base64 Encoder / Decoder — Free Online Tool',
  description: 'Encode text to Base64 or decode Base64 strings instantly. Supports standard and URL-safe (JWT) variants. Free, no data sent to servers.',
})

const { mode, variant, input, output, error, copied, copy, clear, swap } = useBase64()

function swapToInput() {
  swap()
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
}
</script>

<style scoped>
.page { max-width: 1100px; margin: 0 auto; padding: 32px 24px 40px; width: 100%; flex: 1; display: flex; flex-direction: column; gap: 16px; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.page-title { font-size: 24px; font-weight: 700; color: #1A1916; letter-spacing: -0.6px; }
.title-amp { color: #F97316; font-weight: 400; }
.page-subtitle { margin-top: 6px; font-size: 13.5px; color: #7A776E; }

.header-controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

/* Mode toggle */
.mode-toggle, .variant-toggle {
  display: flex;
  background: white;
  border: 1px solid #E8E5DF;
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.mode-btn, .variant-btn {
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  border: none;
  background: none;
  color: #9A9690;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.mode-btn:hover, .variant-btn:hover { color: #3A3830; background: #F7F5F2; }
.mode-btn--active { background: #F97316; color: white; box-shadow: 0 1px 2px rgba(249,115,22,0.3); }
.mode-btn--active:hover { background: #EA6C0A; }
.variant-btn--active { background: #1A1916; color: white; }
.variant-btn--active:hover { background: #2A2920; }

/* Panels */
.panels { display: grid; grid-template-columns: 1fr 40px 1fr; gap: 0; align-items: stretch; min-height: 360px; }

.panel-card {
  background: white;
  border: 1px solid #E8E5DF;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
}
.panel-card--error { border-color: #FECACA; }

.panel-header {
  padding: 11px 16px;
  border-bottom: 1px solid #F0EDE7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.panel-header-right { display: flex; align-items: center; gap: 8px; }
.editor-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #9A9690; }
.char-count { font-size: 11.5px; color: #C2BEB7; font-family: 'JetBrains Mono', monospace; }

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
  color: #1A1916;
  line-height: 1.7;
  display: block;
}
.panel-textarea::placeholder { color: #C2BEB7; }
.panel-textarea--output { background: #FDFCFA; color: #3A3830; }

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

/* Swap column */
.swap-col { display: flex; align-items: center; justify-content: center; }
.swap-btn {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1px solid #E8E5DF;
  background: white;
  color: #9A9690;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.swap-btn:hover:not(:disabled) { background: #F97316; border-color: #F97316; color: white; transform: scale(1.05); }
.swap-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* Copy button */
.btn-copy {
  font-size: 12px; font-family: inherit; font-weight: 500;
  padding: 3px 10px; border-radius: 6px;
  border: 1px solid #DDD9D2; background: #FAFAF8; color: #6B6860;
  cursor: pointer; transition: all 0.15s;
}
.btn-copy:hover:not(:disabled) { background: #F3F1EC; }
.btn-copy--done { background: #F0FDF4; border-color: #BBF7D0; color: #16A34A; }
.btn-copy:disabled { opacity: 0.4; cursor: not-allowed; }

/* Footer */
.footer-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.btn-ghost { background: none; border: none; font-family: inherit; font-size: 13px; color: #A09C94; cursor: pointer; padding: 4px 0; }
.btn-ghost:hover { color: #DC2626; }
.info-chips { display: flex; align-items: center; gap: 6px; }
.info-chip { font-size: 12px; color: #C2BEB7; }
.info-chip--sep { color: #DDD9D2; }
.info-chip--highlight { color: #F97316; font-weight: 500; }
</style>
