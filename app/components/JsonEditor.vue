<template>
  <div ref="container" class="json-editor" />
</template>

<script setup lang="ts">
import { EditorView, basicSetup } from 'codemirror'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { EditorState, Compartment } from '@codemirror/state'
import { oneDarkTheme, oneDarkHighlightStyle } from '@codemirror/theme-one-dark'
import { useColorMode } from '~/composables/useColorMode'

export type EditorLang = 'json' | 'typescript' | 'javascript' | 'xml' | 'yaml' | 'sql' | 'css' | 'html'

const props = defineProps<{
  modelValue: string
  readonly?: boolean
  lang?: EditorLang
  lineWrap?: boolean
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

watch(() => props.modelValue, (val) => {
  if (!view) return
  const current = view.state.doc.toString()
  if (current === val) return
  view.dispatch({
    changes: { from: 0, to: current.length, insert: val },
  })
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
</style>
