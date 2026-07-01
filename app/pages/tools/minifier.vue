<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ modeLabel }} <span class="title-amp">Minifier</span></h1>
        <p class="page-subtitle">Compress CSS, HTML, or JavaScript instantly — client-side, nothing is sent to a server.</p>
      </div>
      <div class="mode-toggle">
        <div class="mode-indicator" :style="{ transform: indicatorTransform }" />
        <button
          v-for="m in MODES"
          :key="m.value"
          :class="['mode-btn', mode === m.value ? 'mode-btn--active' : '']"
          @click="mode = m.value"
        >{{ m.label }}</button>
      </div>
    </div>

    <div class="panels">
      <!-- Input -->
      <div class="editor-card" :class="{ 'editor-card--drag': isDragging }"
        @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="panel-card-glow" />
        <div class="panel-header">
          <span class="editor-label">Source Code</span>
          <Transition name="fade-slot">
            <div v-if="input" class="panel-header-right">
              <span class="editor-hint">paste or type · or drop a .{{ mode }} file</span>
              <button @click="clear" class="btn-xs">Clear</button>
            </div>
          </Transition>
        </div>
        <JsonEditor v-model="input" :lang="editorLang" :key="mode" />
      </div>

      <!-- Middle loader -->
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
      <div class="editor-card" :class="{ 'panel-card--error': !!error }">
        <div class="panel-header">
          <span class="editor-label">Minified</span>
          <div class="panel-header-right">
            <Transition name="fade-slot">
              <span v-if="result && !error" class="savings-badge">-{{ result.savings }}%</span>
            </Transition>
            <button class="btn-xs" @click="download" :disabled="!output">Download</button>
            <button
              @click="copy"
              class="btn-copy"
              :class="{ 'btn-copy--done': copied }"
              :disabled="!output"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>
        <div v-if="error" class="error-body">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M7 4v3M7 9.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          {{ error }}
        </div>
        <JsonEditor v-else :model-value="output" :lang="editorLang" :readonly="true" :line-wrap="true" :key="mode + '-out'" />
      </div>
    </div>

    <!-- Stats strip -->
    <Transition name="fade-slot">
      <div v-if="result && !error && result.originalSize > 0" class="stats-strip">
        <span class="stats-size">{{ fmtBytes(result.originalSize) }}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="stats-arrow-icon">
          <path d="M1 6h10M8 3l3 3-3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="stats-size stats-size--min">{{ fmtBytes(result.minifiedSize) }}</span>
        <span class="stats-sep">·</span>
        <span class="stats-savings">{{ result.savings }}% saved</span>
        <span class="stats-sep">·</span>
        <span class="stats-bytes">{{ fmtBytes(result.originalSize - result.minifiedSize) }} removed</span>
      </div>
    </Transition>

    <!-- Info strip -->
    <div class="info-strip">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="6" cy="3.8" r="0.6" fill="currentColor"/></svg>
      <span>No data sent to servers</span>
      <span class="info-sep">·</span>
      <span>Powered by {{ engineLabel }}</span>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useMinifier, type MinifyMode } from '~/composables/useMinifier'
import type { EditorLang } from '~/components/JsonEditor.vue'

useToolSeo(
  'CSS / HTML / JS Minifier — Compress Code Online Free',
  'Minify CSS, HTML, and JavaScript instantly in your browser. Remove whitespace, comments, and redundant code. Embedded CSS and JS inside HTML are minified too. Free, no data sent to servers.',
)

const MODES: { value: MinifyMode; label: string }[] = [
  { value: 'css',  label: 'CSS'  },
  { value: 'html', label: 'HTML' },
  { value: 'js',   label: 'JS'   },
]

const { input, mode, output, error, loading, copied, result, copy, download, clear } = useMinifier()

const isDragging = ref(false)
function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}

const modeLabel = computed(() => MODES.find(m => m.value === mode.value)?.label ?? 'CSS')

const editorLang = computed<EditorLang>(() => {
  if (mode.value === 'css')  return 'css'
  if (mode.value === 'html') return 'html'
  return 'javascript'
})

const placeholder = computed(() => {
  if (mode.value === 'css')  return 'Paste CSS to minify…'
  if (mode.value === 'html') return 'Paste HTML to minify…'
  return 'Paste JavaScript to minify…'
})

const engineLabel = computed(() => {
  if (mode.value === 'css')  return 'lightningcss'
  if (mode.value === 'html') return 'html-minifier-terser'
  return 'terser'
})

const indicatorTransform = computed(() => {
  const idx = MODES.findIndex(m => m.value === mode.value)
  if (idx === 0) return 'none'
  return `translateX(${idx * 100}%)`
})

function fmtBytes(n: number): string {
  if (n === 0) return '0 B'
  if (n < 1024) return n + ' B'
  return (n / 1024).toFixed(1) + ' KB'
}

const seoCards = [
  {
    title: 'Why minify your code?',
    text: 'Minification removes whitespace, comments, and redundant syntax from CSS, HTML, and JavaScript without changing behaviour. The result is smaller files that transfer faster over the network. A typical CSS file shrinks by 20–40%, HTML by 10–20%, and JavaScript by 30–60% with variable renaming. Faster transfers improve page load time, reduce bandwidth costs on servers and CDNs, and positively affect Core Web Vitals scores — especially LCP and FID. Minification is a standard step in every production build pipeline alongside bundling and compression (gzip/brotli).',
  },
  {
    title: 'CSS, HTML, and JS — how each is minified',
    text: 'CSS minification is powered by lightningcss, a Rust-based parser compiled to WebAssembly — it runs entirely in your browser and produces correct, spec-compliant output including nested selectors, custom properties, and modern syntax. HTML minification (html-minifier-terser) collapses inter-element whitespace, strips HTML comments, removes optional closing tags, and recursively minifies any embedded <style> and <script> blocks using the same CSS and JS engines. JavaScript minification (terser) parses the AST, removes dead code, inlines constants, renames local variables to single letters, and removes unreachable branches — achieving the highest compression ratios of the three.',
  },
  {
    title: 'Before deploying minified code',
    text: 'Always keep your original source files — minified code is nearly impossible to debug or maintain. In production, generate source maps alongside your minified files so browser DevTools can map errors back to the original lines. Most build tools (Vite, webpack, Rollup, esbuild) handle minification and source maps automatically via their production mode. Use this tool for quick one-off checks, to understand how much a file compresses, or to minify standalone snippets. For full projects, integrate minification into your build pipeline rather than minifying manually.',
  },
]
</script>

<style scoped>
.page-header { align-items: flex-start; flex-wrap: wrap; gap: 20px; }

/* ── Mode toggle ─────────────────────────────────────────────────── */
.mode-toggle {
  position: relative;
  display: flex;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 3px;
  gap: 0;
  min-width: 215px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.mode-indicator {
  position: absolute;
  top: 3px; bottom: 3px; left: 3px;
  width: calc((100% - 6px) / 3);
  background: linear-gradient(135deg, var(--c-brand) 0%, #FB923C 100%);
  border-radius: 6px;
  box-shadow: 0 1px 4px rgb(var(--c-brand-rgb) / 0.4), 0 2px 10px rgb(var(--c-brand-rgb) / 0.15);
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.mode-btn {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
  padding: 5px 16px;
  border-radius: 6px;
  font-size: 13px;
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

/* ── Panels ──────────────────────────────────────────────────────── */
.panels { display: grid; grid-template-columns: 1fr 44px 1fr; gap: 0; align-items: stretch; min-height: 380px; }

.editor-card:has(.cm-focused) {
  border-color: #FDBA74;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 24px rgb(var(--c-brand-rgb) / 0.08), 0 0 0 3px rgb(var(--c-brand-rgb) / 0.08);
}
.panel-card-glow {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--c-brand) 0%, #FDBA74 60%, transparent 100%);
  opacity: 0;
  transition: opacity 0.25s;
  z-index: 1;
  pointer-events: none;
}
.editor-card:has(.cm-focused) .panel-card-glow { opacity: 1; }
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

/* ── Stats strip ─────────────────────────────────────────────────── */
.stats-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--c-t3);
}
.stats-arrow-icon { color: var(--c-t5); flex-shrink: 0; }
.stats-size { font-weight: 500; }
.stats-size--min { color: #16A34A; }
.stats-sep { color: var(--c-border-m); }
.stats-savings { color: #16A34A; font-weight: 600; }
.stats-bytes { color: var(--c-t4); }

/* ── Savings badge ───────────────────────────────────────────────── */
.savings-badge {
  font-size: 11px; font-weight: 700;
  padding: 2px 7px; border-radius: 20px;
  background: #F0FDF4; color: #16A34A;
  border: 1px solid #BBF7D0;
  font-family: 'JetBrains Mono', monospace;
}

/* ── Buttons ─────────────────────────────────────────────────────── */

/* ── Info strip ──────────────────────────────────────────────────── */
.info-sep { color: var(--c-border-m); }

/* ── Transitions ─────────────────────────────────────────────────── */
.fade-slot-enter-active, .fade-slot-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-slot-enter-from, .fade-slot-leave-to { opacity: 0; transform: translateY(-3px); }

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .panels { grid-template-columns: 1fr; }
  .mid-col { height: 36px; }
  .stats-strip { flex-wrap: wrap; }
  .mode-btn { padding: 5px 12px; }
}
</style>
