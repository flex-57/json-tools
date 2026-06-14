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

function diffJson(left: string, right: string): { added: string[]; removed: string[]; same: boolean } {
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

export function useJsonFormatter() {
  const input = ref('')
  const output = ref('')
  const error = ref<string | null>(null)
  const isValid = ref<boolean | null>(null)
  const indent = ref<IndentStyle>(2)
  const copied = ref(false)

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

  async function copy() {
    const text = output.value || input.value
    if (!text) return
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }

  function clear() {
    input.value = ''
    output.value = ''
    error.value = null
    isValid.value = null
  }

  return { input, output, error, isValid, indent, copied, format, minify, validate, copy, clear }
}
