<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Markdown <span class="title-amp">Preview</span></h1>
        <p class="page-subtitle">Write or paste Markdown on the left and see the rendered result instantly. Client-side, nothing sent to a server.</p>
        <NuxtLink to="/guides/markdown-cheatsheet" class="guide-link">Markdown syntax cheatsheet →</NuxtLink>
        <NuxtLink to="/guides/what-is-markdown" class="guide-link">New to Markdown? Read the guide →</NuxtLink>
      </div>
    </div>

    <div class="dualpane no-mid">
      <div class="pane" :class="{ 'pane--focus': inputFocused, 'pane--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <div class="pane-header">
          <span class="pane-label">Markdown</span>
          <div class="card-actions">
            <span class="hint">paste or type · or drop a .md file</span>
            <button class="btn-xs" @click="clear"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Clear</button>
          </div>
        </div>
        <div ref="inputRef" class="pane-body" style="padding: 0;" />
      </div>

      <div class="midcol"><span class="mid-arrow"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>

      <div class="pane pane--alt">
        <div class="pane-header">
          <span class="pane-label">Preview</span>
          <button class="btn-copy" :class="{ 'btn-copy--done': copied }" :disabled="!html" @click="copy">{{ copied ? 'Copied HTML!' : 'Copy HTML' }}</button>
        </div>
        <Transition name="reveal">
          <div v-if="!html && !input.trim()" key="empty" class="pane-body pane-body--empty" aria-live="polite">Rendered preview will appear here…</div>
          <div v-else key="output" ref="previewRef" class="markdown-body" aria-live="polite" v-html="html" />
        </Transition>
      </div>
    </div>

    <div class="info-strip">Rendered client-side · No data sent to servers</div>

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

useToolSeo(
  'Markdown Preview: Render & Preview Markdown Online Free',
  'Write or paste Markdown and see the rendered HTML preview instantly. Supports CommonMark: headings, code blocks, tables, and more. Free, client-side, no signup.',
)

const { input, html, copied, copy, clear } = useMarkdown()
useUrlInput(input)
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
          '.cm-scroller': { overflow: 'auto', fontFamily: "'Fragment Mono', monospace", lineHeight: '1.8' },
          '.cm-content': { padding: '14px 16px', caretColor: 'var(--c-accent)' },
          '.cm-line': { padding: '0' },
          '.cm-cursor': { borderLeftColor: 'var(--c-accent)' },
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
            '.cm-content': { fontFamily: "'Fragment Mono', monospace", padding: '12px 16px', lineHeight: '1.8' },
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
    text: [
      'Markdown is a lightweight markup language created by John Gruber in 2004. It uses plain-text formatting conventions (asterisks for bold, hashes for headings, backticks for code) that are both readable as raw text and convertible to HTML.',
      'It is the standard format for README files on GitHub, documentation systems like MkDocs and Docusaurus, note-taking apps like Obsidian and Notion, and static site generators. CommonMark is the widely adopted specification that standardises the syntax across tools.',
    ],
  },
  {
    title: 'Reading the preview',
    text: [
      'The left panel accepts raw Markdown text. As you type, the right panel shows the rendered HTML output in real time. Headings become h1-h6 elements, fenced code blocks (triple backtick) render with monospace styling, tables render with borders, and blockquotes are highlighted with an accent left border.',
      'The rendered output is sanitized with DOMPurify before display, so raw HTML tags embedded in your Markdown are stripped for safety.',
    ],
  },
  {
    title: 'Copying the HTML output',
    text: [
      'The "Copy HTML" button copies the full rendered HTML to your clipboard. Useful when you need to paste the output into a CMS, an email template, or a static site that accepts raw HTML.',
      'If you need just the source Markdown, copy it directly from the left panel. You can also pass Markdown to this tool via the ?input= URL parameter to share pre-filled previews with teammates.',
    ],
  },
]
</script>

<style scoped>
.pane--focus { box-shadow: inset 0 0 0 2px rgb(var(--c-accent-rgb) / 0.2); }

.markdown-body {
  flex: 1;
  padding: 16px 20px;
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.75;
  color: var(--c-t1);
  overflow-y: auto;
}
.markdown-body :deep(> :first-child) { margin-top: 0; }
.markdown-body :deep(> :last-child)  { margin-bottom: 0; }

.markdown-body :deep(h1), .markdown-body :deep(h2), .markdown-body :deep(h3),
.markdown-body :deep(h4), .markdown-body :deep(h5), .markdown-body :deep(h6) {
  font-family: var(--font-display); font-weight: 700; text-transform: uppercase;
  margin: 1.2em 0 0.4em; line-height: 1.3; color: var(--c-t1);
}
.markdown-body :deep(h1) { font-size: 1.4em; border-bottom: 1px solid var(--c-border); padding-bottom: 0.3em; }
.markdown-body :deep(h2) { font-size: 1.15em; border-bottom: 1px solid var(--c-border-s); padding-bottom: 0.2em; }
.markdown-body :deep(h3) { font-size: 1em; }
.markdown-body :deep(h4), .markdown-body :deep(h5), .markdown-body :deep(h6) { font-size: 0.9em; }

.markdown-body :deep(p) { margin: 0.6em 0; }
.markdown-body :deep(ul), .markdown-body :deep(ol) { margin: 0.5em 0; padding-left: 1.8em; }
.markdown-body :deep(li) { margin: 0.25em 0; }
.markdown-body :deep(li > ul), .markdown-body :deep(li > ol) { margin: 0.15em 0; }

.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--c-accent);
  margin: 0.8em 0; padding: 0.5em 1em; color: var(--c-t3);
  background: var(--c-faint); border-radius: 0 6px 6px 0;
}
.markdown-body :deep(blockquote > :first-child) { margin-top: 0; }
.markdown-body :deep(blockquote > :last-child)  { margin-bottom: 0; }

.markdown-body :deep(code) {
  font-family: var(--font-mono); font-size: 0.875em; padding: 0.15em 0.4em;
  background: var(--c-card-alt); border: 1px solid var(--c-border-s); border-radius: 4px; color: var(--c-accent);
}
.markdown-body :deep(.md-code-block) { border: 1px solid var(--c-border); border-radius: 8px; overflow: hidden; margin: 0.8em 0; background: var(--c-card-alt); }

.markdown-body :deep(table) { border-collapse: collapse; width: 100%; margin: 0.8em 0; font-size: 13px; }
.markdown-body :deep(th), .markdown-body :deep(td) { border: 1px solid var(--c-border); padding: 6px 12px; text-align: left; }
.markdown-body :deep(th) { background: var(--c-card-alt); font-weight: 600; color: var(--c-t2); }
.markdown-body :deep(tr:nth-child(even) td) { background: var(--c-faint); }

.markdown-body :deep(a) { color: var(--c-accent); text-decoration: none; }
.markdown-body :deep(a:hover) { text-decoration: underline; }
.markdown-body :deep(hr) { border: none; border-top: 1px solid var(--c-border); margin: 1.2em 0; }
.markdown-body :deep(strong) { font-weight: 700; }
.markdown-body :deep(em) { font-style: italic; color: var(--c-t2); }
.markdown-body :deep(img) { max-width: 100%; border-radius: 6px; }
</style>
