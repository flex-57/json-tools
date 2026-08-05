<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">String <span class="title-amp">{{ mode === 'escape' ? 'Escaper' : 'Unescaper' }}</span></h1>
        <p class="page-subtitle">Escape or unescape \n, \t, \", \\ and Unicode sequences for JSON or code string literals.</p>
      </div>
      <div style="display:flex; gap: 8px; align-items:center; flex-wrap: wrap;">
        <div class="mode-toggle" style="min-width: 170px;">
          <div class="mode-indicator" :class="{ 'mode-indicator--right': mode === 'unescape' }"/>
          <button class="mode-btn" :class="{ 'mode-btn--active': mode === 'escape' }" @click="mode = 'escape'">Escape</button>
          <button class="mode-btn" :class="{ 'mode-btn--active': mode === 'unescape' }" @click="mode = 'unescape'">Unescape</button>
        </div>
        <label v-if="mode === 'escape'" class="toggle-wrap">
          <input v-model="escapeUnicode" type="checkbox" class="toggle-input" >
          <span class="toggle-track"><span class="toggle-thumb" /></span>
          <span class="toggle-label">Escape non-ASCII</span>
        </label>
      </div>
    </div>

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--focus': inputFocused, 'pane--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <span class="pane-label">{{ mode === 'escape' ? 'Raw text' : 'Escaped text' }}</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .txt file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <textarea
          v-model="input"
          class="pane-textarea"
          style="padding: 14px 16px;"
          :placeholder="mode === 'escape' ? 'Type or paste raw text to escape…' : 'Paste escaped text to unescape…'"
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
          <span class="pane-label">{{ mode === 'escape' ? 'Escaped text' : 'Raw text' }}</span>
          <div class="card-actions">
            <span v-if="output && !error" class="hint">{{ output.length }} chars</span>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!output" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div v-if="error" class="pane-body" style="color: var(--c-error);" aria-live="polite">{{ error }}</div>
        <textarea v-else :value="output" class="pane-textarea" style="padding: 14px 16px;" readonly aria-live="polite" :placeholder="mode === 'escape' ? 'Escaped output will appear here…' : 'Unescaped output will appear here…'" spellcheck="false" />
      </div>
    </div>

    <div class="info-strip">No data sent to servers · JSON / JavaScript string escaping rules</div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useStringEscape } from '~/composables/useStringEscape'

useToolSeo(
  'String Escape / Unescape Online: JSON & Code String Tool',
  'Escape or unescape \\n, \\t, \\", \\\\ and \\uXXXX Unicode sequences for JSON or code string literals. Free, instant, no data sent to servers.',
)

const { mode, escapeUnicode, input, output, error, copied, copy, clear, swap } = useStringEscape()
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
  mode.value = mode.value === 'escape' ? 'unescape' : 'escape'
  setTimeout(() => { swapping.value = false }, 350)
}

const seoCards = [
  {
    title: 'Escape sequences this tool handles',
    text: 'Standard JSON and JavaScript string escapes, both directions.',
    table: [
      { label: '\\n \\r \\t', value: 'Newline, carriage return, tab' },
      { label: '\\b \\f', value: 'Backspace, form feed' },
      { label: '\\" \\\' \\\\', value: 'Quote, single quote, backslash' },
      { label: '\\uXXXX', value: '4-digit Unicode code unit, including surrogate pairs for emoji and other astral characters' },
    ],
  },
  {
    title: 'Why escape a string',
    text: [
      'Control characters, quotes, and backslashes cannot appear literally inside a JSON or JavaScript string literal — they have to be escaped or the surrounding code fails to parse.',
      'This matters when embedding user text, file contents, or multi-line strings into JSON payloads, source code, or config files by hand.',
    ],
  },
  {
    title: 'The "Escape non-ASCII" option',
    text: 'Off by default: accented and non-Latin characters are left as-is, since both JSON and JavaScript accept raw UTF-8 in strings. Turn it on to force every character above the ASCII range into a \\uXXXX sequence — useful for older systems or contexts that require pure-ASCII output.',
  },
]
</script>
