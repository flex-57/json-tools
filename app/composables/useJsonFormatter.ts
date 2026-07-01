import { useClipboard } from './useClipboard'

export type IndentStyle = 2 | 4 | '\t'

export interface JsonResult {
  output: string
  error: string | null
  valid: boolean
}

export function formatJson(input: string, indent: IndentStyle = 2): JsonResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty', valid: false }

  try {
    const parsed = JSON.parse(trimmed)
    return {
      output: JSON.stringify(parsed, null, indent),
      error: null,
      valid: true,
    }
  } catch (e) {
    return { output: trimmed, error: (e as Error).message, valid: false }
  }
}

export function minifyJson(input: string): JsonResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty', valid: false }

  try {
    const parsed = JSON.parse(trimmed)
    return { output: JSON.stringify(parsed), error: null, valid: true }
  } catch (e) {
    return { output: trimmed, error: (e as Error).message, valid: false }
  }
}

export function validateJson(input: string): JsonResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty', valid: false }

  try {
    JSON.parse(trimmed)
    return { output: trimmed, error: null, valid: true }
  } catch (e) {
    return { output: trimmed, error: (e as Error).message, valid: false }
  }
}

export function diffJsonLines(left: string, right: string): { added: string[]; removed: string[]; same: boolean } {
  try {
    const l = JSON.stringify(JSON.parse(left.trim()), null, 2).split('\n')
    const r = JSON.stringify(JSON.parse(right.trim()), null, 2).split('\n')
    const lSet = new Set(l)
    const rSet = new Set(r)
    const added = r.filter(line => !lSet.has(line))
    const removed = l.filter(line => !rSet.has(line))
    return { added, removed, same: added.length === 0 && removed.length === 0 }
  } catch {
    return { added: [], removed: [], same: false }
  }
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

  function minify() {
    const result = minifyJson(input.value)
    output.value = result.output
    error.value = result.error
    isValid.value = result.valid
  }

  function validate() {
    const result = validateJson(input.value)
    output.value = ''
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

  onMounted(format)

  return { input, output, error, isValid, indent, copied, format, minify, validate, copy, clear }
}
