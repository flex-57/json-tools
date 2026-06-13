<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Cron <span class="title-amp">Parser</span></h1>
        <p class="page-subtitle">Parse cron expressions, see them in plain English, and preview the next scheduled runs.</p>
      </div>
    </div>

    <!-- Input -->
    <div class="cron-input-card" :class="{ 'cron-input-card--error': !!error }">
      <div class="cron-input-row">
        <input
          v-model="expression"
          class="cron-input"
          placeholder="0 9 * * 1-5"
          spellcheck="false"
          autocomplete="off"
        />
        <button v-if="expression" @click="expression = ''" class="btn-clear-inline">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
      </div>

      <!-- Field labels -->
      <div class="cron-field-labels">
        <span>minute</span>
        <span>hour</span>
        <span>day</span>
        <span>month</span>
        <span>weekday</span>
      </div>

      <Transition name="fade-slot">
        <div v-if="error" class="cron-error">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M7 4v3M7 9.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          {{ error }}
        </div>
      </Transition>

      <!-- Presets -->
      <div class="cron-presets">
        <button v-for="p in PRESETS" :key="p.expr" class="cron-preset" @click="expression = p.expr">
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- Description + schedule -->
    <Transition name="slide-in">
      <div v-if="description && !error" class="result-section">
        <!-- Human description -->
        <div class="desc-card">
          <div class="desc-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.93 2.93l1.42 1.41M9.65 9.65l1.41 1.42M2.93 11.07l1.42-1.41M9.65 4.35l1.41-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <span class="desc-text">{{ description }}</span>
        </div>

        <!-- Next executions -->
        <div class="schedule-card">
          <div class="schedule-header">
            <span class="schedule-title">Next executions</span>
            <span class="schedule-badge">{{ nextExecutions.length }} upcoming</span>
          </div>
          <div class="schedule-list">
            <div v-for="(date, i) in nextExecutions" :key="i" class="schedule-item">
              <span class="schedule-num">{{ i + 1 }}</span>
              <div class="schedule-info">
                <span class="schedule-date">{{ formatDate(date) }}</span>
                <span class="schedule-rel">{{ formatRelative(date) }}</span>
              </div>
              <code class="schedule-iso">{{ date.toISOString() }}</code>
            </div>
            <div v-if="nextExecutions.length === 0" class="schedule-empty">
              No executions found in the next 4 years
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Cron syntax reference -->
    <div class="reference-card">
      <div class="reference-header">Cron syntax reference</div>
      <div class="reference-grid">
        <div class="ref-item" v-for="r in REFERENCE" :key="r.expr">
          <code class="ref-expr">{{ r.expr }}</code>
          <span class="ref-desc">{{ r.desc }}</span>
        </div>
      </div>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useCronParser } from '~/composables/useCronParser'

useSeoMeta({
  title: 'Cron Expression Parser — Free Online Tool',
  description: 'Parse and validate cron expressions. See the schedule in plain English and preview the next 5 execution dates. Free, client-side, no data sent to servers.',
})

const { expression, error, description, nextExecutions } = useCronParser()

const PRESETS = [
  { label: 'Every minute',  expr: '* * * * *'   },
  { label: 'Every hour',    expr: '0 * * * *'   },
  { label: 'Daily 9 AM',    expr: '0 9 * * *'   },
  { label: 'Weekdays 9 AM', expr: '0 9 * * 1-5' },
  { label: 'Every Sunday',  expr: '0 0 * * 0'   },
  { label: '1st of month',  expr: '0 0 1 * *'   },
]

const REFERENCE = [
  { expr: '*',     desc: 'Any value' },
  { expr: '*/n',   desc: 'Every n units' },
  { expr: 'n',     desc: 'Exact value' },
  { expr: 'n-m',   desc: 'Range from n to m' },
  { expr: 'n,m',   desc: 'List of values' },
  { expr: '1-5',   desc: 'Mon through Fri' },
  { expr: '@daily',    desc: 'Alias for 0 0 * * *' },
  { expr: '@hourly',   desc: 'Alias for 0 * * * *' },
  { expr: '@weekly',   desc: 'Alias for 0 0 * * 0' },
  { expr: '@monthly',  desc: 'Alias for 0 0 1 * *' },
]

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDate(date: Date): string {
  const d = DAY_NAMES[date.getDay()]
  const mo = MONTH_NAMES[date.getMonth()]
  const day = date.getDate()
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${d}, ${mo} ${day} at ${h}:${m}`
}

function formatRelative(date: Date): string {
  const diffMs = date.getTime() - Date.now()
  const diffMin = Math.round(diffMs / 60000)
  if (diffMin < 60) return `in ${diffMin} min`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `in ${diffHr}h`
  const diffDay = Math.round(diffHr / 24)
  return `in ${diffDay}d`
}

const seoCards = [
  {
    title: 'What is cron?',
    text: 'Cron is a time-based job scheduler in Unix-like operating systems. A cron expression describes a recurring schedule using five space-separated fields: minute (0–59), hour (0–23), day of month (1–31), month (1–12), and day of week (0–7, where both 0 and 7 mean Sunday). Cron is commonly used to run scripts, backups, reports, and maintenance tasks at regular intervals without manual intervention.',
  },
  {
    title: 'Field syntax: *, /, -, and ,',
    text: 'An asterisk (*) matches every value in a field. A step expression (*/15) matches every nth value — */15 in minutes means "at 0, 15, 30, and 45". A range (1-5) includes all values between two bounds. A list (1,3,5) combines specific values. These constructs can be mixed: 1-5/2 means "every 2nd value from 1 to 5", i.e. 1, 3, and 5. Day-of-month and day-of-week work as a logical OR when both are non-wildcard.',
  },
  {
    title: 'Common cron patterns',
    text: '"0 * * * *" runs at the start of every hour. "0 0 * * *" runs daily at midnight. "0 9 * * 1-5" runs at 9 AM on weekdays. "0 0 1 * *" runs at midnight on the first of every month. "*/5 * * * *" runs every 5 minutes. Most cloud schedulers (GitHub Actions, Cloud Run Jobs, AWS EventBridge) accept the same 5-field syntax. Some also support a 6-field format with seconds as the first field — this tool uses the standard 5-field format.',
  },
]
</script>

<style scoped>
/* ── Cron input card ─────────────────────────────────────────────── */
.cron-input-card {
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 18px 20px 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
  transition: border-color 0.2s;
}
.cron-input-card--error { border-color: #FECACA; }

.cron-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cron-input {
  flex: 1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 500;
  color: var(--c-t1);
  background: transparent;
  border: none;
  outline: none;
  letter-spacing: 0.12em;
  min-width: 0;
}
.cron-input::placeholder { color: var(--c-t5); font-size: 22px; letter-spacing: 0.12em; }

.btn-clear-inline {
  width: 24px; height: 24px;
  border-radius: 50%;
  border: none;
  background: var(--c-subtle);
  color: var(--c-t4);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.btn-clear-inline:hover { background: #FECACA; color: #DC2626; }

.cron-field-labels {
  display: flex;
  gap: 0;
  margin-top: 4px;
  padding-left: 2px;
}
.cron-field-labels span {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--c-t5);
  width: calc(100% / 5);
}

.cron-error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 12.5px;
  color: #DC2626;
}

.cron-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--c-border-s);
}

.cron-preset {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  color: var(--c-t3);
  background: var(--c-subtle);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.15s;
}
.cron-preset:hover { background: var(--c-subtle); color: var(--c-t2); border-color: var(--c-border-m); }

/* ── Description + schedule ──────────────────────────────────────── */
.result-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.desc-card {
  background: #FFF7ED;
  border: 1px solid #FED7AA;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.desc-icon {
  width: 32px;
  height: 32px;
  background: #F97316;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.desc-text {
  font-size: 15px;
  font-weight: 500;
  color: #92400E;
}

.schedule-card {
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
}

.schedule-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--c-border-s);
}

.schedule-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--c-t4);
}

.schedule-badge {
  font-size: 11px;
  font-weight: 600;
  color: #16A34A;
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 20px;
  padding: 2px 8px;
}

.schedule-list { display: flex; flex-direction: column; }

.schedule-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 18px;
  border-bottom: 1px solid var(--c-border-s);
  transition: background 0.1s;
}
.schedule-item:last-child { border-bottom: none; }
.schedule-item:hover { background: var(--c-card-alt); }

.schedule-num {
  width: 22px; height: 22px;
  border-radius: 50%;
  background: var(--c-subtle);
  border: 1px solid var(--c-border);
  font-size: 11px;
  font-weight: 700;
  color: var(--c-t4);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.schedule-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.schedule-date {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--c-t2);
}

.schedule-rel {
  font-size: 11px;
  color: #F97316;
  font-weight: 500;
}

.schedule-iso {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--c-t5);
  background: var(--c-subtle);
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
}

.schedule-empty {
  padding: 20px 18px;
  font-size: 13px;
  color: var(--c-t4);
  text-align: center;
}

/* ── Reference card ──────────────────────────────────────────────── */
.reference-card {
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
}

.reference-header {
  padding: 11px 18px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--c-t4);
  border-bottom: 1px solid var(--c-border-s);
}

.reference-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
}

.ref-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 18px;
  border-bottom: 1px solid var(--c-border-s);
}
.ref-item:nth-child(even) { border-left: 1px solid var(--c-border-s); }
.ref-item:last-child, .ref-item:nth-last-child(2):nth-child(odd) { border-bottom: none; }

.ref-expr {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #F97316;
  background: #FFF7ED;
  border-radius: 4px;
  padding: 2px 6px;
  flex-shrink: 0;
  min-width: 70px;
}

.ref-desc {
  font-size: 12.5px;
  color: var(--c-t3);
}

/* ── Transitions ─────────────────────────────────────────────────── */
.fade-slot-enter-active, .fade-slot-leave-active { transition: opacity 0.15s, transform 0.15s; }
.fade-slot-enter-from, .fade-slot-leave-to { opacity: 0; transform: translateY(-3px); }

.slide-in-enter-active, .slide-in-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-in-enter-from, .slide-in-leave-to { opacity: 0; transform: translateY(6px); }

/* ── Mobile ──────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .cron-input { font-size: 16px; }
  .cron-input::placeholder { font-size: 16px; }
  .reference-grid { grid-template-columns: 1fr; }
  .ref-item:nth-child(even) { border-left: none; }
  .ref-item { border-bottom: 1px solid var(--c-border-s); }
  .schedule-iso { display: none; }
}
</style>
