<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Markdown <span class="title-amp">Preview</span></h1>
        <p class="page-subtitle">Write or paste Markdown on the left and see the rendered result instantly — client-side, nothing sent to a server.</p>
        <NuxtLink to="/guides/markdown-cheatsheet" class="guide-link">Markdown syntax cheatsheet →</NuxtLink>
        <NuxtLink to="/guides/what-is-markdown"    class="guide-link">New to Markdown? Read the guide →</NuxtLink>
      </div>
    </div>

    <div class="panels">
      <!-- Input -->
      <div class="panel-card" :class="{ 'panel-card--focused': inputFocused, 'editor-card--drag': isDragging }"
        @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="panel-card-glow" />
        <div class="panel-header">
          <span class="editor-label">Markdown</span>
          <Transition name="fade-slot">
            <div v-if="input" class="panel-header-right">
              <span class="editor-hint">paste or type · or drop a .md file</span>
              <button @click="clear" class="btn-xs">Clear</button>
            </div>
          </Transition>
        </div>
        <div ref="inputRef" class="input-editor" />
      </div>

      <!-- Middle divider -->
      <div class="mid-col">
        <div class="mid-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M9 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- Output -->
      <div class="panel-card panel-card--output">
        <div class="panel-header">
          <span class="editor-label">Preview</span>
          <button
            @click="copy"
            class="btn-copy"
            :class="{ 'btn-copy--done': copied }"
            :disabled="!html"
          >{{ copied ? 'Copied HTML!' : 'Copy HTML' }}</button>
        </div>
        <div v-if="!html && !input.trim()" class="panel-empty">Rendered preview will appear here…</div>
        <div v-else ref="previewRef" class="markdown-body" v-html="html" />
      </div>
    </div>

    <div class="info-strip">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="6" cy="3.8" r="0.6" fill="currentColor"/></svg>
      <span>Rendered client-side · No data sent to servers</span>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { EditorView } from 'codemirror'
import { placeholder } from '@codemirror/view'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { EditorState, Compartment } from '@codemirror/state'
import { oneDarkTheme, oneDarkHighlightStyle } from '@codemirror/theme-one-dark'
import { useColorMode } from '~/composables/useColorMode'
import { useMarkdown } from '~/composables/useMarkdown'

useSeoMeta({
  title: 'Markdown Preview — Render & Preview Markdown Online Free',
  description: 'Write or paste Markdown and see the rendered HTML preview instantly. Supports CommonMark — headings, code blocks, tables, and more. Free, client-side, no signup.',
  ogTitle: 'Markdown Preview — Render & Preview Markdown Online Free',
  ogDescription: 'Write or paste Markdown and see the rendered HTML preview instantly. Supports CommonMark — headings, code blocks, tables, and more. Free, client-side, no signup.',
  twitterTitle: 'Markdown Preview — Render & Preview Markdown Online Free',
  twitterDescription: 'Write or paste Markdown and see the rendered HTML preview instantly. Supports CommonMark — headings, code blocks, tables, and more. Free, client-side, no signup.',
  ogImage: 'https://jsontools.space/og/markdown-preview.png',
  twitterImage: 'https://jsontools.space/og/markdown-preview.png',
})

const { input, html, copied, copy, clear } = useMarkdown()
const { isDark } = useColorMode()

const inputFocused = ref(false)
const isDragging   = ref(false)
const previewRef   = ref<HTMLElement | null>(null)
const inputRef     = ref<HTMLElement | null>(null)
const codeViews: EditorView[] = []
let inputView: EditorView | null = null

const inputThemeCompartment = new Compartment()

function getEditorThemeExts(dark: boolean) {
  return [
    syntaxHighlighting(dark ? oneDarkHighlightStyle : defaultHighlightStyle),
    ...(dark ? [oneDarkTheme] : []),
  ]
}

async function createInputEditor() {
  if (!inputRef.value || !import.meta.client) return
  const { markdown } = await import('@codemirror/lang-markdown')
  inputView = new EditorView({
    state: EditorState.create({
      doc: input.value,
      extensions: [
        markdown(),
        EditorView.lineWrapping,
        placeholder('Paste Markdown here…'),
        inputThemeCompartment.of(getEditorThemeExts(isDark.value)),
        EditorView.updateListener.of(update => {
          if (update.docChanged) input.value = update.state.doc.toString()
        }),
        EditorView.domEventHandlers({
          focus: () => { inputFocused.value = true },
          blur:  () => { inputFocused.value = false },
        }),
        EditorView.theme({
          '&': { height: '100%', fontSize: '12.5px', background: 'transparent' },
          '.cm-scroller': { overflow: 'auto', fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.7' },
          '.cm-content': { padding: '14px 16px', caretColor: 'var(--c-t1)' },
          '.cm-line': { padding: '0' },
          '.cm-cursor': { borderLeftColor: '#F97316' },
          '.cm-placeholder': { color: 'var(--c-t5)' },
          '.cm-gutters': { display: 'none' },
          '.cm-focused': { outline: 'none !important' },
        }),
      ],
    }),
    parent: inputRef.value,
  })
}

watch(isDark, (dark) => {
  inputView?.dispatch({ effects: inputThemeCompartment.reconfigure(getEditorThemeExts(dark)) })
  highlightCodeBlocks()
})

watch(input, (newVal) => {
  if (!inputView) return
  const current = inputView.state.doc.toString()
  if (current === newVal) return
  inputView.dispatch({ changes: { from: 0, to: current.length, insert: newVal } })
})

async function getLangExt(lang: string) {
  const l = lang.toLowerCase()

  if (l === 'js' || l === 'javascript' || l === 'jsx') {
    const { javascript } = await import('@codemirror/lang-javascript')
    return javascript({ jsx: l === 'jsx' })
  }
  if (l === 'ts' || l === 'typescript' || l === 'tsx') {
    const { javascript } = await import('@codemirror/lang-javascript')
    return javascript({ typescript: true, jsx: l === 'tsx' })
  }
  if (l === 'json') {
    const { json } = await import('@codemirror/lang-json')
    return json()
  }
  if (l === 'yaml' || l === 'yml') {
    const { yaml } = await import('@codemirror/lang-yaml')
    return yaml()
  }
  if (l === 'html') {
    const { html } = await import('@codemirror/lang-html')
    return html()
  }
  if (l === 'css' || l === 'scss' || l === 'less') {
    const { css } = await import('@codemirror/lang-css')
    return css()
  }
  if (l === 'xml') {
    const { xml } = await import('@codemirror/lang-xml')
    return xml()
  }
  if (l === 'sql') {
    const { sql } = await import('@codemirror/lang-sql')
    return sql()
  }
  if (l === 'php') {
    const { php } = await import('@codemirror/lang-php')
    return php()
  }
  if (l === 'python' || l === 'py') {
    const { python } = await import('@codemirror/lang-python')
    return python()
  }
  if (l === 'rust' || l === 'rs') {
    const { rust } = await import('@codemirror/lang-rust')
    return rust()
  }
  if (l === 'c' || l === 'cpp' || l === 'c++' || l === 'cc' || l === 'cxx') {
    const { cpp } = await import('@codemirror/lang-cpp')
    return cpp()
  }
  if (l === 'java') {
    const { java } = await import('@codemirror/lang-java')
    return java()
  }
  if (l === 'bash' || l === 'sh' || l === 'shell' || l === 'zsh') {
    const { StreamLanguage } = await import('@codemirror/language')
    const { shell } = await import('@codemirror/legacy-modes/mode/shell')
    return StreamLanguage.define(shell)
  }
  if (l === 'go') {
    const { StreamLanguage } = await import('@codemirror/language')
    const { go } = await import('@codemirror/legacy-modes/mode/go')
    return StreamLanguage.define(go)
  }
  if (l === 'ruby' || l === 'rb') {
    const { StreamLanguage } = await import('@codemirror/language')
    const { ruby } = await import('@codemirror/legacy-modes/mode/ruby')
    return StreamLanguage.define(ruby)
  }
  if (l === 'csharp' || l === 'cs' || l === 'c#') {
    const { StreamLanguage } = await import('@codemirror/language')
    const { csharp } = await import('@codemirror/legacy-modes/mode/clike')
    return StreamLanguage.define(csharp)
  }
  if (l === 'kotlin' || l === 'kt') {
    const { StreamLanguage } = await import('@codemirror/language')
    const { kotlin } = await import('@codemirror/legacy-modes/mode/clike')
    return StreamLanguage.define(kotlin)
  }
  if (l === 'swift') {
    const { StreamLanguage } = await import('@codemirror/language')
    const { swift } = await import('@codemirror/legacy-modes/mode/swift')
    return StreamLanguage.define(swift)
  }
  if (l === 'lua') {
    const { StreamLanguage } = await import('@codemirror/language')
    const { lua } = await import('@codemirror/legacy-modes/mode/lua')
    return StreamLanguage.define(lua)
  }
  if (l === 'r') {
    const { StreamLanguage } = await import('@codemirror/language')
    const { r } = await import('@codemirror/legacy-modes/mode/r')
    return StreamLanguage.define(r)
  }
  return []
}

async function highlightCodeBlocks() {
  await nextTick()
  if (!previewRef.value) return
  codeViews.forEach(v => v.destroy())
  codeViews.length = 0

  const pres = previewRef.value.querySelectorAll('pre')
  for (const pre of pres) {
    const code = pre.querySelector('code')
    if (!code) continue
    const text = code.textContent ?? ''
    const langClass = Array.from(code.classList).find(c => c.startsWith('language-'))
    const lang = langClass ? langClass.replace('language-', '') : ''
    const langExt = await getLangExt(lang)

    const wrapper = document.createElement('div')
    wrapper.className = 'md-code-block'
    pre.replaceWith(wrapper)

    const dark = isDark.value
    const view = new EditorView({
      state: EditorState.create({
        doc: text,
        extensions: [
          ...(Array.isArray(langExt) ? langExt : [langExt]),
          syntaxHighlighting(dark ? oneDarkHighlightStyle : defaultHighlightStyle),
          ...(dark ? [oneDarkTheme] : []),
          EditorView.editable.of(false),
          EditorState.readOnly.of(true),
          EditorView.theme({
            '&': { fontSize: '12.5px', background: 'transparent', borderRadius: '8px', overflow: 'hidden' },
            '.cm-content': { fontFamily: "'JetBrains Mono', monospace", padding: '12px 16px', lineHeight: '1.65' },
            '.cm-gutters': { display: 'none' },
            '.cm-scroller': { overflow: 'auto' },
            '.cm-focused': { outline: 'none !important' },
            '.cm-line': { padding: '0' },
          }),
        ],
      }),
      parent: wrapper,
    })
    codeViews.push(view)
  }
}

watch(html, highlightCodeBlocks)
onMounted(createInputEditor)
onUnmounted(() => {
  codeViews.forEach(v => v.destroy())
  inputView?.destroy()
})

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { input.value = ev.target?.result as string }
  reader.readAsText(file)
}

const seoCards = [
  {
    title: 'What is Markdown?',
    text: 'Markdown is a lightweight markup language created by John Gruber in 2004. It uses plain-text formatting conventions — asterisks for bold, hashes for headings, backticks for code — that are both readable as raw text and convertible to HTML. It is the standard format for README files on GitHub, documentation systems like MkDocs and Docusaurus, note-taking apps like Obsidian and Notion, and static site generators. CommonMark is the widely adopted specification that standardises the syntax across tools.',
  },
  {
    title: 'Reading the preview',
    text: 'The left panel accepts raw Markdown text. As you type, the right panel shows the rendered HTML output in real time. Headings become h1–h6 elements, fenced code blocks (triple backtick) render with monospace styling, tables render with borders, and blockquotes are highlighted with an orange left border. The rendered output is sanitized with DOMPurify before display — raw HTML tags embedded in your Markdown are stripped for safety.',
  },
  {
    title: 'Copying the HTML output',
    text: 'The "Copy HTML" button copies the full rendered HTML to your clipboard — useful when you need to paste the output into a CMS, an email template, or a static site that accepts raw HTML. If you need just the source Markdown, copy it directly from the left panel. You can also pass Markdown to this tool via the ?input= URL parameter to share pre-filled previews with teammates.',
  },
]
</script>

<style scoped>
.page-header { align-items: flex-start; }

/* ── Panels ──────────────────────────────────────────────────────── */
.panels { display: grid; grid-template-columns: 1fr 44px 1fr; gap: 0; align-items: stretch; min-height: 480px; }

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

.input-editor {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.panel-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--c-t5);
  padding: 20px;
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

/* ── Info strip ──────────────────────────────────────────────────── */
.info-strip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--c-t5);
}

/* ── Markdown body ───────────────────────────────────────────────── */
.markdown-body {
  flex: 1;
  padding: 16px 20px;
  font-size: 14px;
  line-height: 1.75;
  color: var(--c-t1);
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.markdown-body :deep(> :first-child) { margin-top: 0; }
.markdown-body :deep(> :last-child)  { margin-bottom: 0; }

.markdown-body :deep(h1), .markdown-body :deep(h2), .markdown-body :deep(h3),
.markdown-body :deep(h4), .markdown-body :deep(h5), .markdown-body :deep(h6) {
  font-weight: 700;
  margin: 1.2em 0 0.4em;
  line-height: 1.3;
  color: var(--c-t1);
}
.markdown-body :deep(h1) { font-size: 1.55em; border-bottom: 1px solid var(--c-border); padding-bottom: 0.3em; }
.markdown-body :deep(h2) { font-size: 1.25em; border-bottom: 1px solid var(--c-border-s); padding-bottom: 0.2em; }
.markdown-body :deep(h3) { font-size: 1.1em; }
.markdown-body :deep(h4), .markdown-body :deep(h5), .markdown-body :deep(h6) { font-size: 1em; }

.markdown-body :deep(p) { margin: 0.6em 0; }

.markdown-body :deep(ul), .markdown-body :deep(ol) { margin: 0.5em 0; padding-left: 1.8em; }
.markdown-body :deep(li) { margin: 0.25em 0; }
.markdown-body :deep(li > ul), .markdown-body :deep(li > ol) { margin: 0.15em 0; }

.markdown-body :deep(blockquote) {
  border-left: 3px solid #F97316;
  margin: 0.8em 0;
  padding: 0.5em 1em;
  color: var(--c-t3);
  background: var(--c-faint);
  border-radius: 0 6px 6px 0;
}
.markdown-body :deep(blockquote > :first-child) { margin-top: 0; }
.markdown-body :deep(blockquote > :last-child)  { margin-bottom: 0; }

.markdown-body :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875em;
  padding: 0.15em 0.4em;
  background: var(--c-card-alt);
  border: 1px solid var(--c-border-s);
  border-radius: 4px;
  color: #F97316;
}
.markdown-body :deep(.md-code-block) {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  margin: 0.8em 0;
  background: var(--c-card-alt);
}

.markdown-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.8em 0;
  font-size: 13px;
}
.markdown-body :deep(th), .markdown-body :deep(td) {
  border: 1px solid var(--c-border);
  padding: 6px 12px;
  text-align: left;
}
.markdown-body :deep(th) {
  background: var(--c-card-alt);
  font-weight: 600;
  color: var(--c-t2);
}
.markdown-body :deep(tr:nth-child(even) td) { background: var(--c-faint); }

.markdown-body :deep(a) { color: #F97316; text-decoration: none; }
.markdown-body :deep(a:hover) { text-decoration: underline; }

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--c-border);
  margin: 1.2em 0;
}

.markdown-body :deep(strong) { font-weight: 700; }
.markdown-body :deep(em) { font-style: italic; color: var(--c-t2); }
.markdown-body :deep(img) { max-width: 100%; border-radius: 6px; }

/* ── Transitions ─────────────────────────────────────────────────── */
.fade-slot-enter-active, .fade-slot-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-slot-enter-from, .fade-slot-leave-to { opacity: 0; transform: translateY(-3px); }

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .panels { grid-template-columns: 1fr; }
  .mid-col { height: 36px; }
}
</style>
