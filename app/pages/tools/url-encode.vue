<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">URL <span class="title-amp">{{ mode === 'encode' ? 'Encoder' : 'Decoder' }}</span></h1>
        <p class="page-subtitle">Percent-encode or decode URL components, instantly and client-side.</p>
      </div>
      <div style="display:flex; gap: 8px; align-items:center; flex-wrap: wrap;">
        <div class="mode-toggle">
          <div class="mode-indicator" :class="{ 'mode-indicator--right': mode === 'decode' }"/>
          <button class="mode-btn" :class="{ 'mode-btn--active': mode === 'encode' }" @click="mode = 'encode'">Encode</button>
          <button class="mode-btn" :class="{ 'mode-btn--active': mode === 'decode' }" @click="mode = 'decode'">Decode</button>
        </div>
        <div class="variant-toggle">
          <button class="variant-btn" :class="{ 'variant-btn--active': variant === 'component' }" title="encodeURIComponent: encodes ?, &, =, #, + and more. Use for query param values and path segments." @click="variant = 'component'">Component</button>
          <button class="variant-btn" :class="{ 'variant-btn--active': variant === 'full' }" title="encodeURI: preserves URI structure characters like /, ?, #, &. Use for full URLs." @click="variant = 'full'">Full URI</button>
        </div>
      </div>
    </div>

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--focus': inputFocused, 'pane--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <span class="pane-label">{{ mode === 'encode' ? 'Plain text' : 'Encoded URL' }}</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .txt file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <textarea
          v-model="input"
          class="pane-textarea"
          style="padding: 14px 16px;"
          :placeholder="mode === 'encode' ? 'Type or paste text to encode…' : 'Paste percent-encoded string to decode…'"
          spellcheck="false"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
        />
      </div>

      <div class="midcol">
        <button class="swap-btn" :class="{ 'swap-btn--spinning': swapping }" :disabled="!output" title="Use output as input" @click="handleSwap">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 5h11M9 2l3 3-3 3M15 11H4M7 8l-3 3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">{{ mode === 'encode' ? 'URL-encoded' : 'Plain text' }}</span>
          <div class="card-actions">
            <span v-if="output && !error" class="hint">{{ output.length }} chars</span>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div v-if="error" class="pane-body" style="color: var(--c-error);" aria-live="polite">{{ error }}</div>
        <textarea v-else :value="output" class="pane-textarea" style="padding: 14px 16px;" readonly aria-live="polite" :placeholder="mode === 'encode' ? 'URL-encoded output will appear here…' : 'Decoded text will appear here…'" spellcheck="false" />
      </div>
    </div>

    <div class="info-strip">No data sent to servers · {{ variant === 'component' ? 'encodeURIComponent' : 'encodeURI' }}</div>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['url-encode']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useUrlEncode } from '~/composables/useUrlEncode'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'URL Encode & Decode Online: Percent-Encoding Tool',
  'Percent-encode or decode URL components and full URLs instantly. Supports encodeURIComponent and encodeURI. Free, no data sent to servers.',
  TOOL_FAQS['url-encode'],
)

const { mode, variant, input, output, error, copied, copy, clear, swap } = useUrlEncode()
useUrlInput(input)

const inputFocused = ref(false)
const swapping = ref(false)

const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}

function handleSwap() {
  swapping.value = true
  swap()
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  setTimeout(() => { swapping.value = false }, 350)
}

const seoCards = [
  {
    title: 'Component vs Full URI encoding',
    text: 'Both leave letters, digits, and - _ . ! ~ * \' ( ) untouched — the difference is what else they preserve.',
    table: [
      { label: 'encodeURIComponent', value: 'Encodes ?, &, =, #, / too — for query values and path segments' },
      { label: 'encodeURI', value: 'Preserves : / ? # [ ] @ ! $ & \' ( ) * + , ; = — for a full URL' },
    ],
  },
  {
    title: 'When you need percent-encoding',
    text: [
      'Spaces, non-ASCII characters, and reserved symbols must be encoded before being placed in a URL. A space becomes %20 (or + in form-encoded contexts), é becomes %C3%A9, and & in a query value must be %26 or it will be parsed as a parameter separator.',
      'OAuth signatures, redirect_uri parameters, and search queries all require proper encoding: a single unencoded character can break the entire request.',
    ],
  },
  {
    title: 'Reading percent-encoded sequences',
    text: 'Each sequence is a % followed by two hex digits representing one byte of a UTF-8 character. Multi-byte characters need multiple sequences. The Decode mode here converts any valid percent-encoded string back to its original form.',
    table: [
      { label: '%20', value: 'Space (byte 0x20)' },
      { label: '%2F', value: 'Slash (/)' },
      { label: '%3A', value: 'Colon (:)' },
      { label: '%E2%82%AC', value: 'Euro sign € — 3 bytes in UTF-8' },
    ],
  },
]
</script>
