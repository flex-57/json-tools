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

export function useJsonFormatter() {
  const input = ref(SAMPLE_JSON)
  const output = ref('')
  const error = ref<string | null>(null)
  const isValid = ref<boolean | null>(null)
  const indent = ref<IndentStyle>(2)

  function format() {
    const result = formatJson(input.value, indent.value)
    output.value = result.output
    error.value = result.error
    isValid.value = result.valid
  }

  watch(indent, format)

  function minify() {
    const result = minifyJson(input.value)
    output.value = result.output
    error.value = result.error
    isValid.value = result.valid
  }

  function validate() {
    const result = validateJson(input.value)
    output.value = result.output
    error.value = result.error
    isValid.value = result.valid
  }

  const { copied, copy } = useClipboard(() => output.value || input.value)

  function clear() {
    input.value = ''
    output.value = ''
    error.value = null
    isValid.value = null
  }

  function download() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'application/json' }), 'formatted.json')
  }

  onMounted(format)

  return { input, output, error, isValid, indent, copied, format, minify, validate, copy, download, clear }
}
