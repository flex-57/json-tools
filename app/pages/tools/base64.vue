<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Base64 <span class="title-amp">{{ mode === 'encode' ? 'Encoder' : 'Decoder' }}</span></h1>
        <p class="page-subtitle">Encode text to Base64 or decode Base64 back to text, instantly and client-side.</p>
        <NuxtLink to="/guides/what-is-base64" class="guide-link">What is Base64? Read our guide →</NuxtLink>
      </div>
      <div style="display:flex; gap: 8px; align-items:center; flex-wrap: wrap;">
        <div class="mode-toggle" style="min-width: 170px;">
          <div class="mode-indicator" :class="{ 'mode-indicator--right': mode === 'decode' }"></div>
          <button class="mode-btn" :class="{ 'mode-btn--active': mode === 'encode' }" @click="mode = 'encode'">Encode</button>
          <button class="mode-btn" :class="{ 'mode-btn--active': mode === 'decode' }" @click="mode = 'decode'">Decode</button>
        </div>
        <div class="variant-toggle">
          <button class="variant-btn" :class="{ 'variant-btn--active': variant === 'standard' }" @click="variant = 'standard'" title="Standard Base64 (A-Z a-z 0-9 + /)">Standard</button>
          <button class="variant-btn" :class="{ 'variant-btn--active': variant === 'urlsafe' }" @click="variant = 'urlsafe'" title="URL-safe Base64 (- _ no padding), used in JWT">URL-safe</button>
        </div>
      </div>
    </div>

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--focus': inputFocused }">
        <div class="pane-header">
          <span class="pane-label">{{ mode === 'encode' ? 'Plain text' : 'Base64 input' }}</span>
          <div class="card-actions">
            <span v-if="input" class="hint">{{ input.length }} chars</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <textarea
          v-model="input"
          class="pane-textarea"
          style="padding: 14px 16px;"
          :placeholder="mode === 'encode' ? 'Type or paste text to encode…' : 'Paste Base64 string to decode…'"
          spellcheck="false"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
        />
      </div>

      <div class="midcol">
        <button class="swap-btn" :class="{ 'swap-btn--spinning': swapping }" @click="handleSwap" :disabled="!output" title="Use output as input">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 5h11M9 2l3 3-3 3M15 11H4M7 8l-3 3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">{{ mode === 'encode' ? 'Base64 output' : 'Decoded text' }}</span>
          <div class="card-actions">
            <span v-if="output && !error" class="hint">{{ output.length }} chars</span>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" @click="copy" :disabled="!output">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div v-if="error" class="pane-body" style="color: var(--c-error);">{{ error }}</div>
        <textarea v-else :value="output" class="pane-textarea" style="padding: 14px 16px;" readonly :placeholder="mode === 'encode' ? 'Base64 output will appear here…' : 'Decoded text will appear here…'" spellcheck="false" />
      </div>
    </div>

    <div class="info-strip">No data sent to servers · Unicode supported<span v-if="variant === 'urlsafe'"> · JWT-compatible</span></div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useBase64 } from '~/composables/useBase64'

useToolSeo(
  'Base64 Encode & Decode Online: Text & File Converter',
  'Encode text to Base64 or decode Base64 strings instantly. Supports standard and URL-safe (JWT) variants. Free, no data sent to servers.',
)

const { mode, variant, input, output, error, copied, copy, clear, swap } = useBase64()
useUrlInput(input)

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
    text: 'Base64 is an encoding scheme, not encryption. It converts binary data or text into a safe ASCII string using 64 printable characters. The output is about 33% larger than the input. It doesn\'t hide data: anyone can decode it instantly. Its purpose is transport safety, embedding binary in JSON, XML, or HTTP headers that only accept text.',
  },
  {
    title: 'Standard vs URL-safe (Base64url)',
    text: 'Standard Base64 uses + and / characters, which are special in URLs and can break query strings. URL-safe Base64 (Base64url) replaces + with - and / with _, making the output safe for URLs, filenames, and HTTP headers. JWT tokens use Base64url for their header and payload sections, which is exactly what the "JWT-compatible" variant here produces.',
  },
  {
    title: 'Common uses: images, auth tokens, data URIs',
    text: 'Developers encode images or PDFs to Base64 to embed them directly in HTML data URIs or JSON API responses, avoiding a separate file request. Auth tokens, API keys, and session cookies are often Base64-encoded before being placed in Authorization headers. Configuration systems encode secrets to prevent accidental whitespace or special-character corruption in environment variables.',
  },
]
</script>
