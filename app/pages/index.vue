<template>
  <div class="page">
    <div class="page-header">
      <div class="page-title-wrap">
        <h1 class="page-title">JSON Formatter <span class="title-amp">&amp;</span> Validator</h1>
        <p class="page-subtitle">Format, validate, and minify JSON instantly — free, no data sent to servers.</p>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <button @click="format" class="btn btn-primary">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h10M2 7h6M2 11h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          Format
        </button>
        <button @click="minify" class="btn btn-secondary">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M5 4l-3 3 3 3M9 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Minify
        </button>
        <button @click="validate" class="btn btn-secondary">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Validate
        </button>
        <div class="toolbar-sep" />
        <button @click="copy" class="btn btn-secondary" :class="{ 'btn--success': copied }">
          <svg v-if="!copied" width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
      <div class="toolbar-right">
        <Transition name="status">
          <div v-if="isValid !== null" :class="['status-pill', isValid ? 'status-pill--valid' : 'status-pill--invalid']">
            <span class="status-dot" />
            <span class="status-text">{{ isValid ? 'Valid JSON' : error }}</span>
          </div>
        </Transition>
        <div class="indent-wrap">
          <label class="indent-label">Indent</label>
          <select v-model="indentValue" class="indent-select">
            <option :value="2">2 spaces</option>
            <option :value="4">4 spaces</option>
            <option value="	">Tabs</option>
          </select>
        </div>
        <button @click="clear" class="btn btn-ghost">Clear</button>
      </div>
    </div>

    <div class="editors">
      <div class="editor-card">
        <div class="editor-card-header">
          <span class="editor-label">Input</span>
          <span class="editor-hint">Paste or type JSON</span>
        </div>
        <div class="editor-body">
          <ClientOnly>
            <JsonEditor v-model="input" />
            <template #fallback>
              <textarea v-model="input" placeholder="Paste your JSON here..." class="editor-fallback" />
            </template>
          </ClientOnly>
        </div>
      </div>

      <div class="editor-card editor-card--output">
        <div class="editor-card-header">
          <span class="editor-label">Output</span>
          <span class="editor-hint">Result appears here</span>
        </div>
        <div class="editor-body">
          <ClientOnly>
            <JsonEditor v-model="output" :readonly="true" />
            <template #fallback>
              <textarea v-model="output" readonly class="editor-fallback" />
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <section class="about">
      <div class="about-grid">
        <div class="about-card">
          <h2 class="about-title">What is a JSON Formatter?</h2>
          <p class="about-text">A JSON formatter takes raw, unindented or minified JSON and outputs it in a human-readable structure with consistent indentation. It makes deeply nested objects and arrays easy to read at a glance — especially useful when working with API responses or config files.</p>
        </div>
        <div class="about-card">
          <h2 class="about-title">JSON Validation explained</h2>
          <p class="about-text">Valid JSON must follow strict syntax rules: keys must be quoted strings, values can be strings, numbers, booleans, null, arrays or objects. A single missing comma or trailing comma breaks the whole document. The validator pinpoints the exact error so you can fix it immediately.</p>
        </div>
        <div class="about-card">
          <h2 class="about-title">Minify JSON for production</h2>
          <p class="about-text">Minifying removes all unnecessary whitespace, reducing payload size for API responses and config files. A 10 KB formatted JSON typically compresses to under 4 KB — a meaningful saving at scale. All processing happens in your browser; your data never leaves your machine.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useJsonFormatter } from '~/composables/useJsonFormatter'

useSeoMeta({
  title: 'JSON Formatter & Validator — Free Online Tool',
  description: 'Format, validate, and minify JSON instantly. Free online JSON formatter with syntax highlighting. No data sent to servers.',
})

const { input, output, error, isValid, indent, copied, format, minify, validate, copy, clear } = useJsonFormatter()

const indentValue = computed({
  get: () => indent.value,
  set: (v) => { indent.value = v as 2 | 4 | '\t' },
})
</script>

<style scoped>
.page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 24px 24px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1A1916;
  letter-spacing: -0.6px;
  line-height: 1.2;
}

.title-amp {
  color: #F97316;
  font-style: italic;
  font-weight: 400;
}

.page-subtitle {
  margin-top: 6px;
  font-size: 13.5px;
  color: #7A776E;
  font-weight: 400;
}

/* Toolbar */
.toolbar {
  background: #FFFFFF;
  border: 1px solid #E8E5DF;
  border-radius: 14px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
  flex-wrap: wrap;
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.toolbar-sep {
  width: 1px;
  height: 20px;
  background: #E8E5DF;
  margin: 0 2px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1;
}

.btn:focus-visible {
  outline: 2px solid #F97316;
  outline-offset: 2px;
}

.btn-primary {
  background: #F97316;
  color: white;
  border-color: #F97316;
  box-shadow: 0 1px 2px rgba(249,115,22,0.3);
}

.btn-primary:hover {
  background: #EA6C0A;
  border-color: #EA6C0A;
  box-shadow: 0 2px 8px rgba(249,115,22,0.35);
  transform: translateY(-0.5px);
}

.btn-primary:active { transform: translateY(0); }

.btn-secondary {
  background: #FAFAF8;
  color: #3A3830;
  border-color: #DDD9D2;
}

.btn-secondary:hover {
  background: #F3F1EC;
  border-color: #C9C5BE;
  color: #1A1916;
}

.btn--success {
  background: #F0FDF4;
  color: #16A34A;
  border-color: #BBF7D0;
}

.btn-ghost {
  background: transparent;
  color: #A09C94;
  border-color: transparent;
}

.btn-ghost:hover {
  background: #FFF1F0;
  color: #DC2626;
  border-color: #FECACA;
}

/* Status pill */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 11px 4px 8px;
  border-radius: 20px;
  font-size: 12.5px;
  font-weight: 500;
  max-width: 300px;
  overflow: hidden;
}

.status-pill--valid {
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  color: #16A34A;
}

.status-pill--invalid {
  background: #FFF1F0;
  border: 1px solid #FECACA;
  color: #DC2626;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-pill--valid .status-dot { background: #16A34A; box-shadow: 0 0 0 2px #BBF7D0; }
.status-pill--invalid .status-dot { background: #DC2626; box-shadow: 0 0 0 2px #FECACA; }

.status-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Indent control */
.indent-wrap {
  display: flex;
  align-items: center;
  gap: 7px;
}

.indent-label {
  font-size: 12.5px;
  color: #9A9690;
  font-weight: 500;
}

.indent-select {
  appearance: none;
  background: #FAFAF8 url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239A9690' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 8px center;
  border: 1px solid #DDD9D2;
  border-radius: 8px;
  padding: 5px 26px 5px 10px;
  font-size: 13px;
  font-family: inherit;
  color: #3A3830;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s;
}

.indent-select:focus {
  outline: none;
  border-color: #F97316;
}

/* Editors */
.editors {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  min-height: 500px;
}

.editor-card {
  background: #FFFFFF;
  border: 1px solid #E8E5DF;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s, border-color 0.2s;
}

.editor-card:focus-within {
  border-color: #FDBA74;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04), 0 0 0 3px rgba(249,115,22,0.08);
}

.editor-card--output {
  background: #FDFCFA;
}

.editor-card-header {
  padding: 12px 16px 10px;
  border-bottom: 1px solid #F0EDE7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.editor-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9A9690;
}

.editor-hint {
  font-size: 11.5px;
  color: #C2BEB7;
}

.editor-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.editor-fallback {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  background: transparent;
  color: #1A1916;
  line-height: 1.6;
}

/* Status transition */
.status-enter-active, .status-leave-active { transition: all 0.2s ease; }
.status-enter-from, .status-leave-to { opacity: 0; transform: scale(0.9); }

/* SEO section */
.about { margin-top: 8px; padding-bottom: 8px; }
.about-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.about-card { background: white; border: 1px solid #E8E5DF; border-radius: 14px; padding: 20px 22px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
.about-title { font-size: 14px; font-weight: 600; color: #1A1916; margin-bottom: 10px; }
.about-text { font-size: 13px; color: #7A776E; line-height: 1.75; }
@media (max-width: 900px) { .about-grid { grid-template-columns: 1fr; } }
</style>
