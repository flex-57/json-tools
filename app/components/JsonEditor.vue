<template>
  <div ref="container" class="json-editor" />
</template>

<script setup lang="ts">
import { EditorView, basicSetup } from 'codemirror'
import { Decoration, GutterMarker, gutterLineClass } from '@codemirror/view'
import { syntaxHighlighting, defaultHighlightStyle, StreamLanguage } from '@codemirror/language'
import { EditorState, Compartment, RangeSet, type Extension } from '@codemirror/state'
import { oneDarkTheme, oneDarkHighlightStyle } from '@codemirror/theme-one-dark'
import { useColorMode } from '~/composables/useColorMode'

export type EditorLang = 'json' | 'typescript' | 'javascript' | 'xml' | 'yaml' | 'sql' | 'css' | 'html' | 'toml'

const props = defineProps<{
  modelValue: string
  readonly?: boolean
  lang?: EditorLang
  lineWrap?: boolean
  // 1-based line to highlight (gutter dot + row tint) — e.g. a JSON parse error location.
  errorLine?: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { isDark } = useColorMode()
const container = ref<HTMLElement | null>(null)
let view: EditorView | null = null
const themeConfig = new Compartment()
const highlightConfig = new Compartment()
const langConfig = new Compartment()
const errorLineConfig = new Compartment()

class ErrorGutterMarker extends GutterMarker {
  elementClass = 'cm-error-gutter'
}
const errorGutterMarker = new ErrorGutterMarker()

// Locates the line by counting '\n' in the plain string rather than going
// through view.state.doc — needed at mount time (before `view` exists) and
// kept the same afterwards so both call sites agree on the offset.
function lineOffset(content: string, line: number): number | null {
  const lines = content.split('\n')
  if (line < 1 || line > lines.length) return null
  let from = 0
  for (let i = 0; i < line - 1; i++) from += lines[i]!.length + 1
  return from
}

function buildErrorLineExtension(content: string, line: number | null | undefined): Extension {
  if (!line) return []
  const from = lineOffset(content, line)
  if (from === null) return []
  return [
    EditorView.decorations.of(Decoration.set([
      Decoration.line({ attributes: { class: 'cm-error-line' } }).range(from),
    ])),
    gutterLineClass.of(RangeSet.of([errorGutterMarker.range(from)])),
  ]
}

function scrollToLine(line: number) {
  if (!view || line < 1 || line > view.state.doc.lines) return
  const from = view.state.doc.line(line).from
  view.dispatch({ effects: EditorView.scrollIntoView(from, { y: 'center' }) })
}
defineExpose({ scrollToLine })

const lightTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '12.5px',
    background: 'transparent',
  },
  '.cm-content': {
    fontFamily: "'Fragment Mono', monospace",
    padding: '14px 16px',
    caretColor: 'var(--c-accent)',
    lineHeight: '1.8',
  },
  '.cm-scroller': {
    overflow: 'auto',
  },
  '.cm-focused': {
    outline: 'none !important',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: 'var(--c-accent)',
    borderLeftWidth: '2px',
  },
  '.cm-selectionBackground': {
    background: '#E3B8D2 !important',
  },
  '&.cm-focused .cm-selectionBackground': {
    background: '#D89BC0 !important',
  },
  '.cm-gutters': {
    background: 'var(--c-faint)',
    border: 'none',
    borderRight: '1px solid var(--c-border-s)',
    color: 'var(--c-t5)',
    minWidth: '44px',
  },
  '.cm-gutterElement': {
    padding: '0 8px 0 12px',
  },
  '.cm-activeLine': {
    background: 'var(--c-faint)',
  },
  '.cm-activeLineGutter': {
    background: 'rgb(var(--c-accent-rgb) / 0.08)',
    color: 'var(--c-accent)',
  },
  '.cm-matchingBracket': {
    background: 'rgb(var(--c-accent-rgb) / 0.18)',
    outline: 'none',
  },
  '.cm-lineNumbers': {
    minWidth: '40px',
  },
})

const darkOverride = EditorView.theme({
  '&': { background: 'transparent', fontSize: '12.5px' },
  '.cm-content': {
    fontFamily: "'Fragment Mono', monospace",
    padding: '14px 16px',
    caretColor: 'var(--c-accent)',
    lineHeight: '1.8',
  },
  '.cm-gutters': { background: 'transparent', borderRight: '1px solid var(--c-border)', minWidth: '44px' },
  '.cm-gutterElement': { padding: '0 8px 0 12px' },
  '.cm-lineNumbers': { minWidth: '40px' },
  '&.cm-focused .cm-cursor': { borderLeftColor: 'var(--c-accent)', borderLeftWidth: '2px' },
})

async function getLangExtension() {
  switch (props.lang ?? 'json') {
    case 'typescript': {
      const { javascript } = await import('@codemirror/lang-javascript')
      return javascript({ typescript: true })
    }
    case 'javascript': {
      const { javascript } = await import('@codemirror/lang-javascript')
      return javascript()
    }
    case 'xml': {
      const { xml } = await import('@codemirror/lang-xml')
      return xml()
    }
    case 'yaml': {
      const { yaml } = await import('@codemirror/lang-yaml')
      return yaml()
    }
    case 'sql': {
      const { sql } = await import('@codemirror/lang-sql')
      return sql()
    }
    case 'css': {
      const { css } = await import('@codemirror/lang-css')
      return css()
    }
    case 'html': {
      const { html } = await import('@codemirror/lang-html')
      return html()
    }
    case 'toml': {
      const { toml } = await import('@codemirror/legacy-modes/mode/toml')
      return StreamLanguage.define(toml)
    }
    default: {
      const { json } = await import('@codemirror/lang-json')
      return json()
    }
  }
}

onMounted(async () => {
  if (!container.value) return

  const langExtension = await getLangExtension()

  const extensions = [
    basicSetup,
    langConfig.of(langExtension),
    highlightConfig.of(syntaxHighlighting(isDark.value ? oneDarkHighlightStyle : defaultHighlightStyle)),
    themeConfig.of(isDark.value ? [oneDarkTheme, darkOverride] : lightTheme),
    errorLineConfig.of(buildErrorLineExtension(props.modelValue, props.errorLine)),
    ...(props.lineWrap ? [EditorView.lineWrapping] : []),
  ]

  if (!props.readonly) {
    extensions.push(
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          emit('update:modelValue', update.state.doc.toString())
        }
      }),
    )
  } else {
    extensions.push(EditorState.readOnly.of(true))
  }

  view = new EditorView({
    state: EditorState.create({ doc: props.modelValue, extensions }),
    parent: container.value,
  })
})

watch(isDark, (dark) => {
  view?.dispatch({
    effects: [
      highlightConfig.reconfigure(syntaxHighlighting(dark ? oneDarkHighlightStyle : defaultHighlightStyle)),
      themeConfig.reconfigure(dark ? [oneDarkTheme, darkOverride] : lightTheme),
    ],
  })
})

watch(() => props.lang, async () => {
  const ext = await getLangExtension()
  view?.dispatch({ effects: langConfig.reconfigure(ext) })
})

// Combined on purpose: the error-line decoration is computed against `val`,
// so it must be reconfigured in the same dispatch as the doc change that
// produced it — two separate watchers give Vue no ordering guarantee, which
// could momentarily point the decoration at a line from the previous doc.
let lastErrorLine: number | null | undefined = props.errorLine
watch([() => props.modelValue, () => props.errorLine], ([val, line]) => {
  if (!view) return
  const current = view.state.doc.toString()
  const changes = current === val ? undefined : { from: 0, to: current.length, insert: val }
  const effects = [errorLineConfig.reconfigure(buildErrorLineExtension(val, line))]
  view.dispatch(changes ? { changes, effects } : { effects })
  // Only auto-scroll when the error moves to a *new* line — re-centering on
  // every keystroke while the user is actively fixing that same line would
  // fight their scroll position instead of helping it.
  if (line && line !== lastErrorLine) scrollToLine(line)
  lastErrorLine = line
})

onUnmounted(() => view?.destroy())
</script>

<style scoped>
.json-editor {
  height: 100%;
  min-height: 0;
  flex: 1;
}

.json-editor :deep(.cm-editor) {
  height: 100%;
}

.json-editor :deep(.cm-error-line) {
  background: rgb(var(--c-error-rgb) / 0.15);
  box-shadow: inset 3px 0 0 0 var(--c-error);
}
.json-editor :deep(.cm-error-gutter) {
  color: var(--c-error) !important;
  font-weight: 700;
  position: relative;
}
.json-editor :deep(.cm-error-gutter)::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--c-error);
}
</style>
