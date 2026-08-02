<template>
  <article class="guide-body">

    <section class="guide-section">
      <h2>What is a cron expression?</h2>
      <p>A <strong>cron expression</strong> is a string of five fields that defines a recurring schedule on Unix-based systems. Each field represents a unit of time, and together they describe exactly when a job should run — every minute, every weekday at 9 AM, the first of every month, and so on.</p>
      <p>The name comes from <em>chronos</em> (Greek for time). The <code>cron</code> daemon reads a <code>crontab</code> file and executes commands at the scheduled times.</p>
    </section>

    <section class="guide-section">
      <h2>Anatomy of a cron expression</h2>
      <p>A standard cron expression has exactly <strong>5 fields</strong>, separated by spaces:</p>

      <div class="cron-anatomy">
        <div v-for="f in FIELDS" :key="f.name" class="cron-field" :style="{ '--field-color': f.color }">
          <div class="cron-field-name">{{ f.name }}</div>
          <div class="cron-field-value">{{ f.example }}</div>
          <div class="cron-field-range">{{ f.range }}</div>
        </div>
      </div>

      <div class="code-block">
        <span class="code-header">full expression</span>
        <code><span v-for="f in FIELDS" :key="f.name" class="cron-token" :style="{ color: f.color }">{{ f.example }}<span class="cron-space"/></span><span class="cron-comment"># {{ fullDescription }}</span></code>
      </div>
    </section>

    <section class="guide-section">
      <h2>Special characters</h2>
      <div class="chars-table">
        <div class="chars-row chars-row--head">
          <span>Character</span>
          <span>Meaning</span>
          <span>Example</span>
        </div>
        <div v-for="c in CHARS" :key="c.char" class="chars-row">
          <span><code>{{ c.char }}</code></span>
          <span>{{ c.meaning }}</span>
          <span><code>{{ c.example }}</code> — {{ c.desc }}</span>
        </div>
      </div>
    </section>

    <section class="guide-section">
      <h2>Common examples</h2>

      <div v-for="group in EXAMPLES" :key="group.label" class="example-group">
        <h3>{{ group.label }}</h3>
        <div class="example-table">
          <div class="example-row example-row--head">
            <span>Expression</span>
            <span>Description</span>
          </div>
          <div v-for="ex in group.items" :key="ex.expr" class="example-row">
            <span><code>{{ ex.expr }}</code></span>
            <span>{{ ex.desc }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="guide-section">
      <h2>Extended cron (6 fields)</h2>
      <p>Some platforms add a <strong>seconds</strong> field at the beginning, giving 6 fields total. Standard Unix cron has a 1-minute minimum resolution — the seconds field is non-standard.</p>
      <div class="code-block">
        <span class="code-header">6-field cron (Quartz, AWS, GitHub Actions)</span>
        <code>0/30 * * * * ?   # every 30 seconds (Quartz syntax)</code>
      </div>
      <p>Always check which format your platform expects. Tools like Kubernetes CronJobs use standard 5-field cron. GitHub Actions workflows and AWS EventBridge use their own extended syntax.</p>
      <p>This site's <NuxtLink to="/tools/cron-parser" class="guide-inline-link">Cron Parser</NuxtLink> translates any expression like these into a plain-English description instantly.</p>
    </section>

  </article>
</template>

<script setup lang="ts">
const FIELDS = [
  { name: 'Minute',       example: '0',  range: '0–59',  color: '#63B3ED' },
  { name: 'Hour',         example: '9',  range: '0–23',  color: '#68D391' },
  { name: 'Day of month', example: '*',  range: '1–31',  color: '#F6AD55' },
  { name: 'Month',        example: '*',  range: '1–12',  color: '#FC8181' },
  { name: 'Day of week',  example: '1-5', range: '0–6 (Sun=0)', color: '#B794F4' },
]

const fullDescription = 'every weekday at 9:00 AM'

const CHARS = [
  { char: '*', meaning: 'Any value',   example: '* * * * *',  desc: 'every minute' },
  { char: ',', meaning: 'List',        example: '0 9,17 * * *', desc: '9 AM and 5 PM daily' },
  { char: '-', meaning: 'Range',       example: '0 9 * * 1-5', desc: 'weekdays at 9 AM' },
  { char: '/', meaning: 'Step',        example: '*/15 * * * *', desc: 'every 15 minutes' },
]

const EXAMPLES = [
  {
    label: 'Every minute / hour',
    items: [
      { expr: '* * * * *',     desc: 'Every minute' },
      { expr: '*/5 * * * *',   desc: 'Every 5 minutes' },
      { expr: '*/15 * * * *',  desc: 'Every 15 minutes' },
      { expr: '*/30 * * * *',  desc: 'Every 30 minutes' },
      { expr: '0 * * * *',     desc: 'Every hour, on the hour' },
      { expr: '0 */2 * * *',   desc: 'Every 2 hours' },
    ],
  },
  {
    label: 'Daily',
    items: [
      { expr: '0 0 * * *',     desc: 'Every day at midnight' },
      { expr: '0 6 * * *',     desc: 'Every day at 6:00 AM' },
      { expr: '0 9 * * *',     desc: 'Every day at 9:00 AM' },
      { expr: '30 23 * * *',   desc: 'Every day at 11:30 PM' },
      { expr: '0 8-18 * * *',  desc: 'Every hour from 8 AM to 6 PM' },
    ],
  },
  {
    label: 'Weekdays / weekends',
    items: [
      { expr: '0 9 * * 1-5',   desc: 'Every weekday (Mon–Fri) at 9:00 AM' },
      { expr: '0 0 * * 6,0',   desc: 'Saturday and Sunday at midnight' },
      { expr: '*/5 9-17 * * 1-5', desc: 'Every 5 min during business hours (weekdays)' },
      { expr: '0 8 * * 1',     desc: 'Every Monday at 8:00 AM' },
      { expr: '0 17 * * 5',    desc: 'Every Friday at 5:00 PM' },
    ],
  },
  {
    label: 'Weekly / monthly',
    items: [
      { expr: '0 0 * * 0',     desc: 'Every Sunday at midnight' },
      { expr: '0 0 1 * *',     desc: 'First day of every month at midnight' },
      { expr: '0 0 L * *',     desc: 'Last day of every month (extended cron only)' },
      { expr: '30 4 1,15 * *', desc: '4:30 AM on the 1st and 15th of each month' },
      { expr: '0 0 1 */3 *',   desc: 'First day of every quarter (Jan, Apr, Jul, Oct)' },
    ],
  },
  {
    label: 'Yearly',
    items: [
      { expr: '0 0 1 1 *',     desc: 'January 1st at midnight (once a year)' },
      { expr: '0 0 25 12 *',   desc: 'December 25th at midnight' },
      { expr: '0 9 1 1 *',     desc: 'New Year\'s Day at 9:00 AM' },
    ],
  },
]
</script>

<style scoped>
/* ── Cron anatomy ─────────────────────────────────────────── */
.cron-anatomy {
  display: flex;
  gap: 6px;
  margin: 16px 0;
  flex-wrap: wrap;
}

.cron-field {
  flex: 1;
  min-width: 100px;
  border: 1px solid var(--c-border);
  border-top: 3px solid var(--field-color);
  border-radius: 6px;
  padding: 10px 12px;
  background: var(--c-card);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cron-field-name {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--field-color);
}

.cron-field-value {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 700;
  color: var(--c-t1);
  line-height: 1;
}

.cron-field-range {
  font-size: 11px;
  color: var(--c-t4);
}

.cron-token { font-weight: 600; }
.cron-space { color: var(--c-t5); }
.cron-comment { color: var(--c-t5); font-style: italic; }

/* ── Special chars table ──────────────────────────────────── */
.chars-table {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  margin: 12px 0;
  font-size: 13px;
}

.chars-row {
  display: grid;
  grid-template-columns: 80px 1fr 1.8fr;
  border-bottom: 1px solid var(--c-border);
}
.chars-row:last-child { border-bottom: none; }

.chars-row--head {
  background: var(--c-subtle);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-t4);
}

.chars-row > span {
  padding: 10px 14px;
  border-right: 1px solid var(--c-border);
  color: var(--c-t3);
  line-height: 1.5;
}
.chars-row > span:last-child { border-right: none; }

.chars-row code {
  font-family: var(--font-mono);
  font-size: 12px;
  background: rgb(var(--c-accent-rgb) / 0.08);
  color: var(--c-accent);
  padding: 1px 5px;
  border-radius: 4px;
}

/* ── Examples ─────────────────────────────────────────────── */
.example-group { margin-bottom: 8px; }

.example-table {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  font-size: 13px;
}

.example-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  border-bottom: 1px solid var(--c-border);
}
.example-row:last-child { border-bottom: none; }

.example-row--head {
  background: var(--c-subtle);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-t4);
}

.example-row > span {
  padding: 9px 14px;
  border-right: 1px solid var(--c-border);
  color: var(--c-t3);
  line-height: 1.5;
}
.example-row > span:last-child { border-right: none; }

.example-row code {
  font-family: var(--font-mono);
  font-size: 12px;
  background: rgb(var(--c-accent-rgb) / 0.08);
  color: var(--c-accent);
  padding: 1px 5px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .cron-anatomy { gap: 4px; }
  .cron-field { min-width: calc(50% - 4px); flex: none; }
  .chars-row { grid-template-columns: 1fr; }
  .chars-row > span { border-right: none; }
  .example-row { grid-template-columns: 1fr; }
  .example-row > span { border-right: none; }
  .example-row--head > span:last-child,
  .chars-row--head > span:last-child { display: none; }
}
</style>
