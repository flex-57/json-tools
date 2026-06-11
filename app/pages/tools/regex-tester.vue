<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Regex <span class="title-amp">Tester</span></h1>
        <p class="page-subtitle">Test regular expressions with live match highlighting and capture group inspection.</p>
      </div>
      <button @click="clear" class="btn btn-ghost">Clear</button>
    </div>

    <!-- Pattern input -->
    <div class="pattern-card" :class="{ 'pattern-card--error': !!regexError }">
      <div class="pattern-row">
        <span class="pattern-slash">/</span>
        <input
          v-model="pattern"
          class="pattern-input"
          placeholder="[a-z]+"
          spellcheck="false"
          autocomplete="off"
        />
        <span class="pattern-slash">/</span>
        <div class="flag-group">
          <button
            v-for="f in FLAGS"
            :key="f.key"
            :class="['flag-btn', activeFlags.has(f.key) ? 'flag-btn--on' : '']"
            :title="f.title"
            @click="toggleFlag(f.key)"
          >{{ f.key }}</button>
        </div>
        <div class="pattern-status">
          <span v-if="regexError" class="pattern-err-msg">{{ regexError }}</span>
          <span v-else-if="matches.length > 0 && input" class="match-badge">
            {{ matches.length }} match{{ matches.length !== 1 ? 'es' : '' }}
          </span>
          <span v-else-if="pattern && input && !regexError" class="no-match-badge">no match</span>
        </div>
      </div>
    </div>

    <!-- Test string -->
    <div class="editor-card">
      <div class="editor-card-header">
        <span class="editor-label">Test string</span>
        <span v-if="input" class="editor-hint">{{ input.length }} chars</span>
      </div>
      <div class="editor-body">
        <textarea
          v-model="input"
          class="editor-textarea"
          placeholder="Paste or type your test string here…"
          spellcheck="false"
        />
      </div>
    </div>

    <!-- Match highlights -->
    <Transition name="slide-in">
      <div v-if="matches.length > 0 && input" class="highlight-card">
        <div class="editor-card-header">
          <span class="editor-label">Highlighted</span>
          <span class="editor-hint">{{ matches.length }} match{{ matches.length !== 1 ? 'es' : '' }}</span>
        </div>
        <div class="highlight-body" v-html="highlightedHtml" />
      </div>
    </Transition>

    <!-- Match detail -->
    <Transition name="slide-in">
      <div v-if="detailedMatches.length > 0" class="matches-card">
        <div class="editor-card-header">
          <span class="editor-label">Matches</span>
        </div>
        <div class="matches-body">
          <div v-for="(m, i) in detailedMatches" :key="i" class="match-item">
            <div class="match-header">
              <span class="match-index">{{ i + 1 }}</span>
              <code class="match-value">{{ m.value || '(empty)' }}</code>
              <span class="match-pos">@ {{ m.index }}</span>
            </div>
            <div v-if="m.captures.some(c => c !== undefined)" class="match-groups">
              <div v-for="(cap, ci) in m.captures" :key="ci" class="match-group">
                <span class="group-label">${{ ci + 1 }}</span>
                <code class="group-value">{{ cap ?? 'undefined' }}</code>
              </div>
            </div>
            <div v-if="m.groups" class="match-groups">
              <div v-for="(val, name) in m.groups" :key="name" class="match-group">
                <span class="group-label">{{ name }}</span>
                <code class="group-value">{{ val ?? 'undefined' }}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useRegexTester } from '~/composables/useRegexTester'

useSeoMeta({
  title: 'Regex Tester — Free Online Regular Expression Tool',
  description: 'Test regular expressions with live match highlighting, capture group inspection, and flag toggles. Free, no data sent to servers.',
})

const { pattern, flags, input, regexError, matches, highlightedHtml, clear } = useRegexTester()

const FLAGS = [
  { key: 'g', title: 'Global — find all matches' },
  { key: 'i', title: 'Case insensitive' },
  { key: 'm', title: 'Multiline — ^ and $ match line boundaries' },
  { key: 's', title: 'Dotall — . matches newlines too' },
]

const activeFlags = ref(new Set(['g']))

watch(activeFlags, () => {
  flags.value = 'gims'.split('').filter(f => activeFlags.value.has(f)).join('')
}, { immediate: true, deep: true })

function toggleFlag(f: string) {
  const next = new Set(activeFlags.value)
  if (next.has(f)) next.delete(f)
  else next.add(f)
  activeFlags.value = next
}

// Only show detailed match list for first 50 matches to avoid DOM overload
const detailedMatches = computed(() => matches.value.slice(0, 50))

const seoCards = [
  {
    title: 'Flags: g, i, m, s explained',
    text: 'The g (global) flag finds all matches instead of stopping at the first one. The i flag makes matching case-insensitive. The m (multiline) flag makes ^ and $ match the start and end of each line rather than the full string. The s (dotAll) flag makes . match newline characters (\n), which it normally skips. Combining flags like gi is common for case-insensitive global search.',
  },
  {
    title: 'Capture groups and named groups',
    text: 'Wrap part of a pattern in parentheses to create a capture group: (\\d+) captures digits. The captured text appears in $1, $2, etc. Named groups (?<year>\\d{4}) give the capture a label accessible via the match.groups object. Non-capturing groups (?:...) group for quantifiers without capturing. This tool shows all captured groups below each match.',
  },
  {
    title: 'Common regex patterns for developers',
    text: 'Email validation: ^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$. UUID: [0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}. ISO date: \\d{4}-\\d{2}-\\d{2}. IP address: (\\d{1,3}\\.){3}\\d{1,3}. Semantic version: \\d+\\.\\d+\\.\\d+. These are starting points — production validation usually needs stricter patterns or a dedicated library.',
  },
]
</script>

<style scoped>
/* ── Pattern card ────────────────────────────────────────────────── */
.pattern-card {
  background: white;
  border: 1px solid #E8E5DF;
  border-radius: 14px;
  padding: 14px 18px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
  transition: border-color 0.2s;
}
.pattern-card--error { border-color: #FECACA; }

.pattern-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.pattern-slash {
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  color: #C2BEB7;
  line-height: 1;
  user-select: none;
}

.pattern-input {
  flex: 1;
  min-width: 160px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  color: #1A1916;
  background: transparent;
  border: none;
  outline: none;
}
.pattern-input::placeholder { color: #C2BEB7; }

.flag-group { display: flex; gap: 3px; }

.flag-btn {
  width: 28px; height: 28px;
  border-radius: 6px;
  border: 1px solid #E8E5DF;
  background: #FAFAF8;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  color: #9A9690;
  cursor: pointer;
  transition: all 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.flag-btn:hover { background: #F3F1EC; color: #3A3830; }
.flag-btn--on { background: #1A1916; border-color: #1A1916; color: white; }

.pattern-status { margin-left: auto; }
.pattern-err-msg { font-size: 12px; color: #DC2626; max-width: 260px; }
.match-badge { font-size: 12px; font-weight: 600; color: #16A34A; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 20px; padding: 2px 10px; }
.no-match-badge { font-size: 12px; color: #A09C94; background: #F7F5F2; border: 1px solid #E8E5DF; border-radius: 20px; padding: 2px 10px; }

/* ── Highlight card ──────────────────────────────────────────────── */
.highlight-card {
  background: white;
  border: 1px solid #E8E5DF;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
}

.highlight-body {
  padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  color: #3A3830;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 300px;
  overflow: auto;
}

:deep(.rx-match) {
  background: #FED7AA;
  color: #C2410C;
  border-radius: 3px;
  padding: 1px 2px;
  font-weight: 600;
}

/* ── Match detail ────────────────────────────────────────────────── */
.matches-card {
  background: white;
  border: 1px solid #E8E5DF;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
}

.matches-body { max-height: 320px; overflow: auto; }

.match-item {
  padding: 10px 16px;
  border-bottom: 1px solid #F7F5F2;
}
.match-item:last-child { border-bottom: none; }
.match-item:hover { background: #FDFCFA; }

.match-header { display: flex; align-items: center; gap: 10px; }
.match-index {
  width: 20px; height: 20px; border-radius: 50%;
  background: #FFF7ED; border: 1px solid #FED7AA;
  font-size: 11px; font-weight: 700; color: #C2410C;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.match-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  background: #FFF7ED;
  color: #C2410C;
  padding: 1px 6px;
  border-radius: 4px;
  word-break: break-all;
}
.match-pos { font-size: 11px; color: #C2BEB7; margin-left: auto; }

.match-groups { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 7px; }
.match-group { display: flex; align-items: center; gap: 5px; }
.group-label { font-size: 11px; font-weight: 700; color: #7C3AED; background: #F5F3FF; border: 1px solid #DDD6FE; border-radius: 4px; padding: 1px 5px; }
.group-value { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: #3A3830; background: #F7F5F2; border-radius: 4px; padding: 1px 5px; }

/* ── Transitions ─────────────────────────────────────────────────── */
.slide-in-enter-active, .slide-in-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-in-enter-from, .slide-in-leave-to { opacity: 0; transform: translateY(6px); }
</style>
