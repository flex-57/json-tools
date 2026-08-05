<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Unix <span class="title-amp">Timestamp</span></h1>
        <p class="page-subtitle">Convert Unix timestamps to readable dates and back, instantly and client-side.</p>
        <NuxtLink to="/guides/what-is-unix-timestamp" class="guide-link">New to Unix time? Read our guide →</NuxtLink>
      </div>
      <button class="btn btn-primary" @click="setNow">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M7 4v3l2 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Now
      </button>
    </div>

    <div class="input-card">
      <div class="input-card-inner">
        <input v-model="input" class="ts-input" placeholder="1749649920  or  2026-06-11T14:32:00Z  or  June 11 2026" spellcheck="false" @keydown.enter="setNow" >
        <button v-if="input" class="btn-clear-inline" @click="clear">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
      </div>
      <Transition name="status">
        <div v-if="error" class="input-error">{{ error }}</div>
      </Transition>
    </div>

    <Transition name="slide-in">
      <div v-if="parsed" class="result-card" aria-live="polite">
        <div v-for="row in resultRows" :key="row.key" class="result-row">
          <span class="result-label">{{ row.label }}</span>
          <span v-if="row.key !== 'relative'" class="result-value" :class="row.mono ? 'result-value--mono' : ''">{{ row.value }}</span>
          <span v-else class="result-badge">{{ row.value }}</span>
          <button v-if="row.copyable" class="btn-copy-row" :class="{ 'btn-copy-row--done': copied === row.key }" @click="copyValue(row.value, row.key)">{{ copied === row.key ? 'Copied!' : 'Copy' }}</button>
        </div>
      </div>
    </Transition>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useUnixTimestamp } from '~/composables/useUnixTimestamp'

useToolSeo(
  'Unix Timestamp Converter: Epoch to Date & Date to Epoch',
  'Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds, ISO 8601, UTC, and local time. Free, no data sent to servers.',
)

const { input, parsed, error, unix, unixMs, iso, utc, local, relative, copied, setNow, clear, refresh, copyValue } = useUnixTimestamp()
useUrlInput(input)

const resultRows = computed(() => [
  { key: 'relative', label: 'Relative',     value: relative.value ?? '',  mono: false, copyable: false },
  { key: 'iso',      label: 'ISO 8601',      value: iso.value ?? '',       mono: true,  copyable: true },
  { key: 'utc',      label: 'UTC',           value: utc.value ?? '',       mono: false, copyable: true },
  { key: 'local',    label: 'Local',         value: local.value ?? '',     mono: false, copyable: true },
  { key: 'unix',     label: 'Unix (s)',      value: String(unix.value),    mono: true,  copyable: true },
  { key: 'unixms',   label: 'Unix (ms)',     value: String(unixMs.value),  mono: true,  copyable: true },
].filter(r => r.key !== 'relative' || r.value))

let timer: ReturnType<typeof setInterval>
onMounted(() => { timer = setInterval(refresh, 30000) })
onUnmounted(() => clearInterval(timer))

const seoCards = [
  {
    title: 'What is a Unix timestamp?',
    text: [
      'A Unix timestamp counts the number of seconds elapsed since January 1, 1970 at 00:00:00 UTC, also called the Unix epoch. It is timezone-independent: 1749649920 refers to the same instant everywhere in the world, regardless of local time.',
      'This makes it ideal for storing dates in databases, logging events, and computing time differences without timezone confusion.',
    ],
  },
  {
    title: 'Seconds vs milliseconds',
    text: 'This tool auto-detects: if the number is larger than 10 000 000 000 (13 digits), it\'s treated as milliseconds; otherwise as seconds.',
    table: [
      { label: 'Seconds', value: 'Most Unix systems and APIs, JWT exp/iat claims' },
      { label: 'Milliseconds', value: "JavaScript's Date.now() and most browser APIs" },
      { label: 'Nanoseconds', value: 'Node.js performance timers' },
    ],
  },
  {
    title: 'Common use cases',
    text: [
      'Backend developers use Unix timestamps in JWT exp claims to set token expiration, in database records for created_at and updated_at fields, and in logs for unambiguous event ordering.',
      'Frontend developers convert timestamps to local strings for display and compute relative times ("3 hours ago") for activity feeds. The ISO 8601 format (2026-06-11T14:32:00Z) is the standard for APIs and is sortable as a string.',
    ],
  },
]
</script>

<style scoped>
.input-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius-card); padding: 16px 20px; }
.input-card-inner { display: flex; align-items: center; gap: 8px; }
.ts-input { flex: 1; font-family: var(--font-mono); font-size: 15px; color: var(--c-t1); background: transparent; border: none; outline: none; min-width: 0; }
.ts-input::placeholder { color: var(--c-t5); font-size: 13px; }

.btn-clear-inline { width: 24px; height: 24px; border-radius: 50%; border: none; background: var(--c-subtle); color: var(--c-t4); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; }
.btn-clear-inline:hover { background: rgb(var(--c-error-rgb) / 0.15); color: var(--c-error); }

.input-error { display: flex; align-items: center; gap: 6px; margin-top: 10px; font-family: var(--font-body); font-size: 12.5px; color: var(--c-error); }

.result-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden; }
.result-row:hover { background: var(--c-faint); }

.result-label { font-family: var(--font-body); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--c-t5); width: 90px; flex-shrink: 0; }
.result-value { flex: 1; font-family: var(--font-body); font-size: 13px; color: var(--c-t2); word-break: break-all; min-width: 0; }
.result-value--mono { font-family: var(--font-mono); font-size: 12.5px; }
.result-badge { font-family: var(--font-body); font-size: 12px; font-weight: 500; color: var(--c-accent); background: rgb(var(--c-accent-rgb) / 0.08); border: 1px solid rgb(var(--c-accent-rgb) / 0.25); border-radius: 20px; padding: 2px 10px; flex: 1; }

.btn-copy-row { display: flex; align-items: center; gap: 5px; font-family: var(--font-body); font-size: 12px; font-weight: 500; padding: 4px 10px; border-radius: 6px; border: 1px solid var(--c-border); background: var(--c-faint); color: var(--c-t3); cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.15s; }
.btn-copy-row:hover { background: var(--c-subtle); color: var(--c-t1); }
.btn-copy-row--done { background: rgb(var(--c-valid-rgb) / 0.12); border-color: rgb(var(--c-valid-rgb) / 0.35); color: var(--c-valid); }

.status-enter-active, .status-leave-active { transition: opacity 0.15s, transform 0.15s; }
.status-enter-from, .status-leave-to { opacity: 0; transform: translateY(-3px); }
.slide-in-enter-active, .slide-in-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-in-enter-from, .slide-in-leave-to { opacity: 0; transform: translateY(6px); }
</style>
