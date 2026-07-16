import { safeJsonParse } from '../utils/json'
import { useClipboard } from './useClipboard'
import { triggerDownload } from '../utils/download'

export type IndentStyle = 2 | 4 | '\t'

export interface JsonResult {
  output: string
  error: string | null
  valid: boolean
}

export function formatJson(input: string, indent: IndentStyle = 2): JsonResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty', valid: false }

  const { data, error } = safeJsonParse(trimmed)
  if (error) return { output: trimmed, error, valid: false }
  return { output: JSON.stringify(data, null, indent), error: null, valid: true }
}

export function minifyJson(input: string): JsonResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty', valid: false }

  const { data, error } = safeJsonParse(trimmed)
  if (error) return { output: trimmed, error, valid: false }
  return { output: JSON.stringify(data), error: null, valid: true }
}

export function validateJson(input: string): JsonResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty', valid: false }

  const { error } = safeJsonParse(trimmed)
  if (error) return { output: trimmed, error, valid: false }
  return { output: trimmed, error: null, valid: true }
}

const SAMPLE_JSON = `{
  "id": 1,
  "name": "Alice Martin",
  "email": "alice@example.com",
  "role": "admin",
  "active": true,
  "tags": ["api", "auth"],
  "created_at": "2024-01-15T09:00:00Z"
}`

export type OutputMode = 'format' | 'minify'

export function useJsonFormatter() {
  const input = ref(SAMPLE_JSON)
  const indent = ref<IndentStyle>(2)
  const mode = ref<OutputMode>('format')

  // Live: no click/shortcut needed to (re)validate — see project todo notes
  // on why json-formatter used to be the odd one out among JSON tools here.
  const parsed = computed(() => safeJsonParse(input.value.trim()))
  const isValid = computed(() => input.value.trim() !== '' && parsed.value.error == null)
  const error = computed(() => (input.value.trim() && parsed.value.error) || null)
  const errorTip = computed(() => parsed.value.tip ?? null)
  const errorLine = computed(() => parsed.value.line ?? null)
  const errorColumn = computed(() => parsed.value.column ?? null)

  const output = computed(() => {
    if (!isValid.value) return ''
    return mode.value === 'format' ? JSON.stringify(parsed.value.data, null, indent.value) : JSON.stringify(parsed.value.data)
  })

  const { copied, copy } = useClipboard(() => output.value)

  function clear() { input.value = '' }

  function download() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'application/json' }), 'formatted.json')
  }

  return { input, output, error, errorTip, errorLine, errorColumn, isValid, indent, mode, copied, copy, download, clear }
}
