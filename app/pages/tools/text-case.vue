<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Text <span class="title-amp">Case</span> Converter</h1>
        <p class="page-subtitle">Convert text between camelCase, PascalCase, snake_case, kebab-case and more, instantly.</p>
      </div>
    </div>

    <div class="input-card" :class="{ 'input-card--focused': focused }">
      <div class="input-header">
        <span class="editor-label">Input</span>
        <Transition name="fade-slot">
          <div v-if="input" class="input-header-right">
            <span class="word-count">{{ wordCount }} word{{ wordCount !== 1 ? 's' : '' }}</span>
            <button @click="clear" class="btn-clear">Clear</button>
          </div>
        </Transition>
      </div>
      <textarea v-model="input" class="input-textarea" placeholder="Type or paste text (camelCase, snake_case, kebab-case, spaces and mixed input all work)…" spellcheck="false" rows="3" @focus="focused = true" @blur="focused = false" />
    </div>

    <div class="results" aria-live="polite">
      <div v-for="r in results" :key="r.key" class="result-row" :class="{ 'result-row--empty': !r.value }">
        <span class="case-badge">{{ r.label }}</span>
        <span class="result-value">{{ r.value || r.example }}</span>
        <button @click="copy(r.key, r.value)" class="case-copy" :class="{ 'case-copy--done': copiedKey === r.key }" :disabled="!r.value">{{ copiedKey === r.key ? 'Copied!' : 'Copy' }}</button>
      </div>
    </div>

    <div class="info-strip">Auto-detects camelCase, PascalCase, snake_case, kebab-case, spaces and mixed input</div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useTextCase } from '~/composables/useTextCase'

useToolSeo(
  'Text Case Converter: camelCase, snake_case, kebab-case & more',
  'Convert text between camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, kebab-case, Title Case and more. Auto-detects input format. Free, instant, no data sent to servers.',
)

const { input, results, wordCount, copiedKey, copy, clear } = useTextCase()

const focused = ref(false)

const seoCards = [
  {
    title: 'When to use each case',
    text: 'camelCase is the standard for JavaScript and TypeScript variables, functions, and object keys. PascalCase (UpperCamelCase) is used for class names, React components, and TypeScript types. snake_case is common in Python, Ruby, and database column names. SCREAMING_SNAKE_CASE is the convention for constants and environment variables. kebab-case is used in CSS class names, HTML attributes, URL slugs, and npm package names. Title Case appears in headings and proper nouns. dot.case is used in configuration keys (e.g. logging.level) and some framework conventions.',
  },
  {
    title: 'How auto-detection works',
    text: 'The converter parses any input format into a sequence of words, then re-formats them into every target case. It splits on spaces, underscores, hyphens, dots, slashes, and colons. For camelCase and PascalCase input, it inserts a split point before each uppercase letter following a lowercase one (e.g. "myVariableName" → ["my", "variable", "name"]) and handles consecutive uppercase sequences like acronyms (e.g. "parseHTMLString" → ["parse", "HTML", "string"]). Mixed inputs like "my-Variable_name" are fully supported.',
  },
  {
    title: 'Case conventions by language',
    text: 'JavaScript / TypeScript: camelCase for variables and functions, PascalCase for classes and components, SCREAMING_SNAKE_CASE for constants. Python: snake_case for variables and functions, PascalCase for classes, SCREAMING_SNAKE_CASE for constants. CSS: kebab-case for class names and custom properties (--my-color). SQL: UPPER_SNAKE_CASE for keywords by convention, snake_case for table and column names. Go: PascalCase for exported identifiers, camelCase for unexported. Rust: snake_case for functions and variables, PascalCase for types and traits, SCREAMING_SNAKE_CASE for constants.',
  },
]
</script>

<style scoped>
.input-card { position: relative; background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden; transition: box-shadow 0.2s; }
.input-card--focused { box-shadow: inset 0 0 0 2px rgb(var(--c-accent-rgb) / 0.2); }

.input-header { padding: 11px 16px; border-bottom: 1px solid var(--c-border-s); display: flex; align-items: center; justify-content: space-between; min-height: 42px; }
.input-header-right { display: flex; align-items: center; gap: 8px; }
.editor-label { font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--c-t4); }
.word-count { font-family: var(--font-mono); font-size: 11.5px; color: var(--c-t5); }

.input-textarea { width: 100%; border: none; outline: none; resize: none; padding: 14px 16px; font-family: var(--font-mono); font-size: 13px; background: transparent; color: var(--c-t1); line-height: 1.7; display: block; }
.input-textarea::placeholder { color: var(--c-t5); }

.results { display: flex; flex-direction: column; border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden; background: var(--c-card); }
.result-row { display: flex; align-items: center; gap: 14px; padding: 11px 20px; border-bottom: 1px solid var(--c-border-s); transition: background 0.12s; }
.result-row:last-child { border-bottom: none; }
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

.fade-slot-enter-active, .fade-slot-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-slot-enter-from, .fade-slot-leave-to { opacity: 0; transform: translateY(-3px); }

@media (max-width: 768px) { .case-badge { min-width: 140px; font-size: 10px; } .result-row { gap: 10px; padding: 10px 12px; } }
</style>
