<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Text <span class="title-amp">Case</span> Converter</h1>
        <p class="page-subtitle">Convert text between camelCase, PascalCase, snake_case, kebab-case and more, instantly.</p>
      </div>
    </div>

    <div class="input-card" :class="{ 'input-card--focused': focused, 'drop-target--active': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
      <div class="input-header">
        <span class="editor-label">Input</span>
        <div class="input-header-right">
          <span class="hint">paste or type · or drop a .txt file</span>
          <Transition name="fade">
            <span v-if="input" class="word-count">{{ wordCount }} word{{ wordCount !== 1 ? 's' : '' }}</span>
          </Transition>
          <button v-if="input" class="btn-clear" @click="clear">Clear</button>
        </div>
      </div>
      <textarea v-model="input" class="input-textarea" placeholder="Type or paste text (camelCase, snake_case, kebab-case, spaces and mixed input all work)…" spellcheck="false" rows="3" @focus="focused = true" @blur="focused = false" />
    </div>

    <div class="results" aria-live="polite">
      <div v-for="r in results" :key="r.key" class="result-row" :class="{ 'result-row--empty': !r.value }">
        <span class="case-badge">{{ r.label }}</span>
        <span class="result-value">{{ r.value || r.example }}</span>
        <button class="case-copy" :class="{ 'case-copy--done': copiedKey === r.key }" :disabled="!r.value" @click="copy(r.key, r.value)">{{ copiedKey === r.key ? 'Copied!' : 'Copy' }}</button>
      </div>
    </div>

    <div class="info-strip">Auto-detects camelCase, PascalCase, snake_case, kebab-case, spaces and mixed input</div>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['text-case']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useTextCase } from '~/composables/useTextCase'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'Text Case Converter: camelCase, snake_case, kebab-case & more',
  'Convert text between camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, kebab-case, Title Case and more. Auto-detects input format. Free, instant, no data sent to servers.',
  TOOL_FAQS['text-case'],
)

const { input, results, wordCount, copiedKey, copy, clear } = useTextCase()
useUrlInput(input)

const focused = ref(false)

const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}

const seoCards = [
  {
    title: 'When to use each case',
    text: 'Seven conventions cover almost everything you\'ll touch as a developer.',
    table: [
      { label: 'camelCase', value: 'JS/TS variables, functions, object keys' },
      { label: 'PascalCase', value: 'Class names, React components, TS types' },
      { label: 'snake_case', value: 'Python, Ruby, database columns' },
      { label: 'SCREAMING_SNAKE', value: 'Constants, environment variables' },
      { label: 'kebab-case', value: 'CSS classes, HTML attributes, URL slugs' },
      { label: 'Title Case', value: 'Headings and proper nouns' },
      { label: 'dot.case', value: 'Config keys (e.g. logging.level)' },
    ],
  },
  {
    title: 'How auto-detection works',
    text: [
      'The converter parses any input format into a sequence of words, then re-formats them into every target case. It splits on spaces, underscores, hyphens, dots, slashes, and colons.',
      'For camelCase and PascalCase input, it inserts a split point before each uppercase letter following a lowercase one (e.g. "myVariableName" → ["my", "variable", "name"]) and handles acronyms (e.g. "parseHTMLString" splits into "parse", "html", "string" — each case then re-applies its own capitalization). Mixed inputs like "my-Variable_name" are fully supported.',
    ],
  },
  {
    title: 'Case conventions by language',
    text: 'The same case can carry different meaning depending on the ecosystem.',
    table: [
      { label: 'JS / TS', value: 'camelCase vars/fns, PascalCase classes, SCREAMING constants' },
      { label: 'Python', value: 'snake_case vars/fns, PascalCase classes, SCREAMING constants' },
      { label: 'CSS', value: 'kebab-case classes and custom properties (--my-color)' },
      { label: 'SQL', value: 'UPPER_SNAKE keywords by convention, snake_case tables/columns' },
      { label: 'Go', value: 'PascalCase exported, camelCase unexported' },
      { label: 'Rust', value: 'snake_case fns/vars, PascalCase types/traits' },
    ],
  },
]
</script>

<style scoped>
.word-count { font-family: var(--font-mono); font-size: 11.5px; color: var(--c-t5); }

.input-textarea { width: 100%; border: none; outline: none; resize: none; padding: 14px 16px; font-family: var(--font-mono); font-size: 13px; background: transparent; color: var(--c-t1); line-height: 1.7; display: block; }
.input-textarea::placeholder { color: var(--c-t5); }

.results { display: flex; flex-direction: column; border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden; background: var(--c-card); }
.result-row:not(.result-row--empty):hover { background: var(--c-faint); }

.case-badge { font-family: var(--font-mono); font-size: 10.5px; font-weight: 600; color: var(--c-accent); background: rgb(var(--c-accent-rgb) / 0.08); border: 1px solid rgb(var(--c-accent-rgb) / 0.25); border-radius: 4px; padding: 2px 7px; white-space: nowrap; flex-shrink: 0; min-width: 172px; text-align: center; }
.result-value { flex: 1; font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.result-row--empty .result-value { color: var(--c-t5); }

.btn-clear { font-family: var(--font-body); font-size: 12px; color: var(--c-t4); background: none; border: none; cursor: pointer; padding: 2px 7px; border-radius: 5px; transition: all 0.15s; }
.btn-clear:hover { color: var(--c-error); background: rgb(var(--c-error-rgb) / 0.1); }

.case-copy { display: flex; align-items: center; gap: 5px; font-family: var(--font-body); font-size: 12px; font-weight: 500; padding: 3px 10px; border-radius: 6px; flex-shrink: 0; border: 1px solid var(--c-border-m); background: var(--c-faint); color: var(--c-t3); cursor: pointer; transition: all 0.15s; }
.case-copy:hover:not(:disabled) { background: var(--c-subtle); border-color: var(--c-border); }
.case-copy--done { background: rgb(var(--c-valid-rgb) / 0.12); border-color: rgb(var(--c-valid-rgb) / 0.35); color: var(--c-valid); }
.case-copy:disabled { opacity: 0.35; cursor: not-allowed; }

@media (max-width: 768px) { .case-badge { min-width: 140px; font-size: 10px; } .result-row { gap: 10px; padding: 10px 12px; } }
</style>
