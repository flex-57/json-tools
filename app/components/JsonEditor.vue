<template>
  <div ref="container" class="json-editor" />
</template>

<script setup lang="ts">
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { json } from '@codemirror/lang-json'

const props = defineProps<{
  modelValue: string
  readonly?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const container = ref<HTMLElement | null>(null)
let view: EditorView | null = null

const lightTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '13px',
    background: 'transparent',
  },
  '.cm-content': {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    padding: '14px 16px',
    caretColor: '#F97316',
    lineHeight: '1.65',
  },
  '.cm-scroller': {
    overflow: 'auto',
  },
  '.cm-focused': {
    outline: 'none !important',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#F97316',
    borderLeftWidth: '2px',
  },
  '.cm-selectionBackground': {
    background: '#FED7AA !important',
  },
  '&.cm-focused .cm-selectionBackground': {
    background: '#FDBA74 !important',
  },
  '.cm-gutters': {
    background: '#FAFAF8',
    border: 'none',
    borderRight: '1px solid #F0EDE7',
    color: '#C2BEB7',
    minWidth: '44px',
  },
  '.cm-gutterElement': {
    padding: '0 8px 0 12px',
  },
  '.cm-activeLine': {
    background: '#FFFBF6',
  },
  '.cm-activeLineGutter': {
    background: '#FFF7ED',
    color: '#F97316',
  },
  '.cm-matchingBracket': {
    background: '#FED7AA',
    outline: 'none',
  },
  '.cm-lineNumbers': {
    minWidth: '40px',
  },
})

onMounted(() => {
  if (!container.value) return

  const extensions = [
    basicSetup,
    json(),
    lightTheme,
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
