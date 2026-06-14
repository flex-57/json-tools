<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">SQL <span class="title-amp">Formatter</span></h1>
        <p class="page-subtitle">Format and beautify SQL queries instantly — supports MySQL, PostgreSQL, SQLite, T-SQL and more.</p>
      </div>
      <div class="toolbar">
        <div class="mode-toggle">
          <div class="mode-indicator" :style="{ transform: indicatorTransform }" />
          <button
            v-for="d in DIALECTS"
            :key="d.value"
            :class="['mode-btn', dialect === d.value ? 'mode-btn--active' : '']"
            @click="dialect = d.value"
          >{{ d.label }}</button>
        </div>
        <div class="options">
          <label class="option-label">
            <input type="checkbox" v-model="uppercase" class="option-check" />
            <span>UPPERCASE keywords</span>
          </label>
          <label class="option-label">
            <span>Indent</span>
            <select v-model="indentSizeNum" class="option-select">
              <option :value="2">2 spaces</option>
              <option :value="4">4 spaces</option>
              <option :value="1">1 tab</option>
            </select>
          </label>
        </div>
      </div>
    </div>

    <div class="panels">
      <!-- Input -->
      <div class="panel-card" :class="{ 'panel-card--focused': inputFocused }">
        <div class="panel-card-glow" />
        <div class="panel-header">
          <span class="editor-label">Raw SQL</span>
          <Transition name="fade-slot">
            <div v-if="input" class="panel-header-right">
              <span class="char-count">{{ lineCount }} lines</span>
              <button @click="clear" class="btn-clear">Clear</button>
            </div>
          </Transition>
        </div>
        <textarea
          v-model="input"
          class="panel-textarea"
          placeholder="Paste SQL to format…"
          spellcheck="false"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
        />
      </div>

      <!-- Middle -->
      <div class="mid-col">
        <div class="mid-icon" :class="{ 'mid-icon--spinning': loading }">
          <svg v-if="!loading" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M9 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="6 6"/>
          </svg>
        </div>
      </div>

      <!-- Output -->
      <div class="panel-card" :class="{ 'panel-card--error': !!error }">
        <div class="panel-header">
          <span class="editor-label">Formatted SQL</span>
          <div class="panel-header-right">
            <Transition name="fade-slot">
              <span v-if="output && !error" class="dialect-badge">{{ dialectLabel }}</span>
            </Transition>
            <button
              @click="copy"
              class="btn-copy"
              :class="{ 'btn-copy--done': copied }"
              :disabled="!output"
            >
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
          placeholder="Formatted SQL will appear here…"
          spellcheck="false"
        />
      </div>
    </div>

    <!-- Info strip -->
    <div class="info-strip">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="6" cy="3.8" r="0.6" fill="currentColor"/></svg>
      <span>Formatting runs entirely in your browser — no SQL is sent to any server</span>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useSqlFormatter, type SqlDialect } from '~/composables/useSqlFormatter'

useSeoMeta({
  title: 'SQL Formatter — Free Online SQL Beautifier | JSON Tools',
  description: 'Format and beautify SQL queries instantly in your browser. Supports MySQL, PostgreSQL, SQLite, T-SQL (SQL Server), and standard SQL. Choose indent size and keyword case. Free, no data sent to servers.',
  ogTitle: 'SQL Formatter — Free Online SQL Beautifier | JSON Tools',
  ogDescription: 'Format and beautify SQL queries instantly in your browser. Supports MySQL, PostgreSQL, SQLite, T-SQL (SQL Server), and standard SQL. Choose indent size and keyword case. Free, no data sent to servers.',
  twitterTitle: 'SQL Formatter — Free Online SQL Beautifier | JSON Tools',
  twitterDescription: 'Format and beautify SQL queries instantly in your browser. Supports MySQL, PostgreSQL, SQLite, T-SQL (SQL Server), and standard SQL. Choose indent size and keyword case. Free, no data sent to servers.',
  ogImage: 'https://jsontools.space/og/sql-formatter.png',
  twitterImage: 'https://jsontools.space/og/sql-formatter.png',
})

const DIALECTS: { value: SqlDialect; label: string }[] = [
  { value: 'sql',        label: 'SQL'        },
  { value: 'mysql',      label: 'MySQL'      },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite',     label: 'SQLite'     },
  { value: 'tsql',       label: 'T-SQL'      },
]

const { input, dialect, uppercase, indentSize, output, error, loading, copied, copy, clear } = useSqlFormatter()

const inputFocused = ref(false)

const indentSizeNum = computed({
  get: () => indentSize.value,
  set: (v: number) => { indentSize.value = v },
})

const lineCount = computed(() => input.value.split('\n').length)

const dialectLabel = computed(() => DIALECTS.find(d => d.value === dialect.value)?.label ?? 'SQL')

const indicatorTransform = computed(() => {
  const idx = DIALECTS.findIndex(d => d.value === dialect.value)
  if (idx === 0) return 'none'
  return `translateX(${idx * 100}%)`
})

const seoCards = [
  {
    title: 'Why format SQL queries?',
    text: 'Unformatted SQL is notoriously hard to read — especially complex queries with multiple JOINs, subqueries, or CTEs. Consistent formatting makes it easier to spot errors, understand query structure at a glance, and collaborate with teammates. Formatted SQL is also easier to diff in version control: a consistently formatted file produces clean, meaningful diffs instead of noise from whitespace changes. This formatter applies standard indentation, aligns clauses (SELECT, FROM, WHERE, JOIN, GROUP BY…), and optionally uppercases SQL keywords to visually separate them from identifiers.',
  },
  {
    title: 'SQL dialect differences',
    text: 'While standard SQL (ISO/ANSI) is the foundation, each database engine extends or modifies the syntax. MySQL uses backtick identifiers and has specific functions like GROUP_CONCAT. PostgreSQL uses double-quote identifiers, supports dollar-quoted strings ($$ … $$), and has a rich set of extensions (RETURNING, DISTINCT ON, lateral joins). SQLite is more permissive — it accepts many syntax variants and ignores type constraints. T-SQL (SQL Server / Azure SQL) uses square-bracket identifiers, TOP instead of LIMIT, and has constructs like NOLOCK hints. Selecting the right dialect ensures the formatter applies correct keyword sets and quoting conventions.',
  },
  {
    title: 'Tips for clean SQL',
    text: 'Uppercase SQL keywords (SELECT, FROM, WHERE) and lowercase identifiers (table names, columns) is the most common convention. Use meaningful table aliases (u for users, o for orders) rather than single letters like a, b. Break long SELECT lists onto separate lines, one column per line. Place each JOIN on its own line with the ON condition indented beneath it. Use CTEs (WITH … AS) to name and reuse complex subqueries instead of nesting them. Add trailing commas rather than leading commas — most style guides now prefer this. Finally, run EXPLAIN or EXPLAIN ANALYZE on slow queries to understand the execution plan rather than guessing at optimisations.',
  },
]
</script>

<style scoped>
.page-header { align-items: flex-start; flex-wrap: wrap; gap: 20px; }

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

/* ── Mode toggle ─────────────────────────────────────────────────── */
.mode-toggle {
  position: relative;
  display: flex;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 3px;
  gap: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.mode-indicator {
  position: absolute;
  top: 3px; bottom: 3px; left: 3px;
  width: calc((100% - 6px) / 5);
  background: linear-gradient(135deg, #F97316 0%, #FB923C 100%);
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(249,115,22,0.4), 0 2px 10px rgba(249,115,22,0.15);
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.mode-btn {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 12.5px;
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

/* ── Options ─────────────────────────────────────────────────────── */
.options {
  display: flex;
  align-items: center;
  gap: 16px;
}
.option-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--c-t3);
  cursor: pointer;
  white-space: nowrap;
}
.option-check {
  width: 14px;
  height: 14px;
  accent-color: #F97316;
  cursor: pointer;
}
.option-select {
  font-size: 12.5px;
  font-family: inherit;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 5px;
  color: var(--c-t2);
  padding: 2px 6px;
  cursor: pointer;
}

/* ── Panels ──────────────────────────────────────────────────────── */
.panels { display: grid; grid-template-columns: 1fr 44px 1fr; gap: 0; align-items: stretch; min-height: 420px; }

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
  font-family: 'JetBrains Mono', monospace;
}

/* ── Middle icon ─────────────────────────────────────────────────── */
.mid-col { display: flex; align-items: center; justify-content: center; }
.mid-icon {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1px solid var(--c-border);
  background: var(--c-card);
  color: var(--c-t4);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.mid-icon--spinning svg { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Dialect badge ───────────────────────────────────────────────── */
.dialect-badge {
  font-size: 11px; font-weight: 700;
  padding: 2px 7px; border-radius: 20px;
  background: rgba(249,115,22,0.1); color: #F97316;
  border: 1px solid rgba(249,115,22,0.25);
  font-family: 'JetBrains Mono', monospace;
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

/* ── Transitions ─────────────────────────────────────────────────── */
.fade-slot-enter-active, .fade-slot-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-slot-enter-from, .fade-slot-leave-to { opacity: 0; transform: translateY(-3px); }

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .panels { grid-template-columns: 1fr; }
  .mid-col { height: 36px; }
  .toolbar { align-items: flex-start; }
  .options { flex-wrap: wrap; gap: 10px; }
  .mode-btn { padding: 5px 10px; }
}
</style>
