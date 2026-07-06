<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">SQL <span class="title-amp">Formatter</span></h1>
        <p class="page-subtitle">Format and beautify SQL queries instantly. Supports MySQL, PostgreSQL, SQLite, T-SQL and more.</p>
      </div>
      <div style="display:flex; flex-direction: column; gap: 10px; align-items: flex-end;">
        <div class="mode-toggle" style="min-width: 570px;">
          <div class="mode-indicator" :style="{ width: 'calc((100% - 6px) / 5)', transform: indicatorTransform }"></div>
          <button v-for="d in DIALECTS" :key="d.value" class="mode-btn" :class="{ 'mode-btn--active': dialect === d.value }" @click="dialect = d.value">{{ d.label }}</button>
        </div>
        <div class="option-wrap">
          <label class="option-label"><input type="checkbox" v-model="uppercase" style="accent-color: var(--c-accent); margin-right: 5px;" />UPPERCASE keywords</label>
          <label class="option-label">Indent</label>
          <select v-model="indentSizeNum" class="option-select">
            <option :value="2">2 spaces</option>
            <option :value="4">4 spaces</option>
            <option :value="1">1 tab</option>
          </select>
        </div>
      </div>
    </div>

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <span class="pane-label">Raw SQL</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .sql file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor v-model="input" lang="sql" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>

      <div class="midcol">
        <span class="mid-arrow" :class="{ spinner: loading }">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">Formatted SQL</span>
          <div class="card-actions">
            <span v-if="output && !error" class="dialect-badge">{{ dialectLabel }}</span>
            <button class="btn-xs" @click="download" :disabled="!output">Download</button>
            <button class="btn-copy" :class="{ 'btn-copy--done': copied }" @click="copy" :disabled="!output">{{ copied ? 'Copied!' : 'Copy' }}</button>
          </div>
        </div>
        <div v-if="error" class="pane-body">{{ error }}</div>
        <div v-else class="pane-body" style="padding: 0;">
          <ClientOnly>
            <JsonEditor v-model="output" :readonly="true" lang="sql" />
            <template #fallback><EditorSkeleton /></template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useSqlFormatter, type SqlDialect } from '~/composables/useSqlFormatter'

useToolSeo(
  'SQL Formatter: Free Online SQL Beautifier | JSON Tools',
  'Format and beautify SQL queries instantly in your browser. Supports MySQL, PostgreSQL, SQLite, T-SQL (SQL Server), and standard SQL. Choose indent size and keyword case. Free, no data sent to servers.',
)

const DIALECTS: { value: SqlDialect; label: string }[] = [
  { value: 'sql',        label: 'SQL'        },
  { value: 'mysql',      label: 'MySQL'      },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite',     label: 'SQLite'     },
  { value: 'tsql',       label: 'T-SQL'      },
]

const { input, dialect, uppercase, indentSize, output, error, loading, copied, copy, download, clear } = useSqlFormatter()

const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}

const indentSizeNum = computed({
  get: () => indentSize.value,
  set: (v: number) => { indentSize.value = v },
})

const dialectLabel = computed(() => DIALECTS.find(d => d.value === dialect.value)?.label ?? 'SQL')

const indicatorTransform = computed(() => {
  const idx = DIALECTS.findIndex(d => d.value === dialect.value)
  if (idx === 0) return 'none'
  return `translateX(${idx * 100}%)`
})

const seoCards = [
  {
    title: 'Why format SQL queries?',
    text: 'Unformatted SQL is notoriously hard to read, especially complex queries with multiple JOINs, subqueries, or CTEs. Consistent formatting makes it easier to spot errors, understand query structure at a glance, and collaborate with teammates. Formatted SQL is also easier to diff in version control: a consistently formatted file produces clean, meaningful diffs instead of noise from whitespace changes. This formatter applies standard indentation, aligns clauses (SELECT, FROM, WHERE, JOIN, GROUP BY…), and optionally uppercases SQL keywords to visually separate them from identifiers.',
  },
  {
    title: 'SQL dialect differences',
    text: 'While standard SQL (ISO/ANSI) is the foundation, each database engine extends or modifies the syntax. MySQL uses backtick identifiers and has specific functions like GROUP_CONCAT. PostgreSQL uses double-quote identifiers, supports dollar-quoted strings ($$ … $$), and has a rich set of extensions (RETURNING, DISTINCT ON, lateral joins). SQLite is more permissive: it accepts many syntax variants and ignores type constraints. T-SQL (SQL Server / Azure SQL) uses square-bracket identifiers, TOP instead of LIMIT, and has constructs like NOLOCK hints. Selecting the right dialect ensures the formatter applies correct keyword sets and quoting conventions.',
  },
  {
    title: 'Tips for clean SQL',
    text: 'Uppercase SQL keywords (SELECT, FROM, WHERE) and lowercase identifiers (table names, columns) is the most common convention. Use meaningful table aliases (u for users, o for orders) rather than single letters like a, b. Break long SELECT lists onto separate lines, one column per line. Place each JOIN on its own line with the ON condition indented beneath it. Use CTEs (WITH … AS) to name and reuse complex subqueries instead of nesting them. Add trailing commas rather than leading commas; most style guides now prefer this. Finally, run EXPLAIN or EXPLAIN ANALYZE on slow queries to understand the execution plan rather than guessing at optimisations.',
  },
]
</script>

<style scoped>
.dialect-badge {
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  padding: 2px 7px; border-radius: 20px;
  background: rgb(var(--c-accent-rgb) / 0.1); color: var(--c-accent);
  border: 1px solid rgb(var(--c-accent-rgb) / 0.3);
}
</style>
