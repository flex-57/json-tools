<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Text <span class="title-amp">Case</span> Converter</h1>
        <p class="page-subtitle">Convert text between camelCase, PascalCase, snake_case, kebab-case and more — instantly.</p>
      </div>
    </div>

    <!-- Input -->
    <div class="input-card" :class="{ 'input-card--focused': focused }">
      <div class="input-glow" />
      <div class="input-header">
        <span class="editor-label">Input</span>
        <Transition name="fade-slot">
          <div v-if="input" class="input-header-right">
            <span class="word-count">{{ wordCount }} word{{ wordCount !== 1 ? 's' : '' }}</span>
            <button @click="clear" class="btn-clear">Clear</button>
          </div>
        </Transition>
      </div>
      <textarea
        v-model="input"
        class="input-textarea"
        placeholder="Type or paste text — supports camelCase, snake_case, kebab-case, spaces and mixed input…"
        spellcheck="false"
        rows="3"
        @focus="focused = true"
        @blur="focused = false"
      />
    </div>

    <!-- Results -->
    <div class="results">
      <div
        v-for="r in results"
        :key="r.key"
        class="result-row"
        :class="{ 'result-row--empty': !r.value }"
      >
        <span class="case-badge">{{ r.label }}</span>
        <span class="result-value">{{ r.value || r.example }}</span>
        <button
          @click="copy(r.key, r.value)"
          class="btn-copy"
          :class="{ 'btn-copy--done': copiedKey === r.key }"
          :disabled="!r.value"
        >
          {{ copiedKey === r.key ? 'Copied!' : 'Copy' }}
        </button>
      </div>
    </div>

    <!-- Info strip -->
    <div class="info-strip">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="6" cy="3.8" r="0.6" fill="currentColor"/></svg>
      <span>Auto-detects camelCase, PascalCase, snake_case, kebab-case, spaces and mixed input</span>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useTextCase } from '~/composables/useTextCase'

useSeoMeta({
  title: 'Text Case Converter — camelCase, snake_case, kebab-case & more',
  description: 'Convert text between camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, kebab-case, Title Case and more. Auto-detects input format. Free, instant, no data sent to servers.',
  ogTitle: 'Text Case Converter — camelCase, snake_case, kebab-case & more',
  ogDescription: 'Convert text between camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, kebab-case, Title Case and more. Auto-detects input format. Free, instant, no data sent to servers.',
  twitterTitle: 'Text Case Converter — camelCase, snake_case, kebab-case & more',
  twitterDescription: 'Convert text between camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, kebab-case, Title Case and more. Auto-detects input format. Free, instant, no data sent to servers.',
  ogImage: 'https://jsontools.space/og/text-case.png',
  twitterImage: 'https://jsontools.space/og/text-case.png',
})

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
/* ── Input card ──────────────────────────────────────────────────── */
.input-card {
  position: relative;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
  transition: border-color 0.2s, box-shadow 0.25s;
}
.input-card--focused {
  border-color: #FDBA74;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 24px rgba(249,115,22,0.08), 0 0 0 3px rgba(249,115,22,0.08);
}
.input-glow {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, #F97316 0%, #FDBA74 60%, transparent 100%);
  opacity: 0;
  transition: opacity 0.25s;
  z-index: 1;
  pointer-events: none;
}
.input-card--focused .input-glow { opacity: 1; }

.input-header {
  padding: 11px 16px;
  border-bottom: 1px solid var(--c-border-s);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
}
.input-header-right { display: flex; align-items: center; gap: 8px; }
.word-count { font-size: 11.5px; color: var(--c-t5); font-family: 'JetBrains Mono', monospace; }

.input-textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  background: transparent;
  color: var(--c-t1);
  line-height: 1.7;
  display: block;
}
.input-textarea::placeholder { color: var(--c-t5); }

/* ── Results ─────────────────────────────────────────────────────── */
.results {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
  background: var(--c-card);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
}

.result-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--c-border-s);
  transition: background 0.12s;
}
.result-row:last-child { border-bottom: none; }
.result-row:not(.result-row--empty):hover { background: var(--c-faint); }

.case-badge {
  font-size: 10.5px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  color: #F97316;
  background: rgba(249,115,22,0.08);
  border: 1px solid rgba(249,115,22,0.2);
  border-radius: 4px;
  padding: 2px 7px;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 172px;
  text-align: center;
}

.result-value {
  flex: 1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  color: var(--c-t1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
.result-row--empty .result-value { color: var(--c-t5); }

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
  padding: 3px 10px; border-radius: 6px; flex-shrink: 0;
  border: 1px solid var(--c-border-m); background: var(--c-faint); color: var(--c-t3);
  cursor: pointer; transition: all 0.15s;
}
.btn-copy:hover:not(:disabled) { background: var(--c-subtle); border-color: var(--c-border); }
.btn-copy--done { background: #F0FDF4; border-color: #BBF7D0; color: #16A34A; }
.btn-copy:disabled { opacity: 0.35; cursor: not-allowed; }

/* ── Info strip ──────────────────────────────────────────────────── */
.info-strip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--c-t5);
}

/* ── Transitions ─────────────────────────────────────────────────── */
.fade-slot-enter-active, .fade-slot-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-slot-enter-from, .fade-slot-leave-to { opacity: 0; transform: translateY(-3px); }

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .case-badge { min-width: 140px; font-size: 10px; }
  .result-row { gap: 10px; padding: 10px 12px; }
}
</style>
