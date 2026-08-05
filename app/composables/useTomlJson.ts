import { parse, stringify, TomlError } from 'smol-toml'
import { safeJsonParse } from '../utils/json'
import { triggerDownload } from '../utils/download'
import { useClipboard } from './useClipboard'

const SAMPLE_TOML = `name = "Alice Martin"
email = "alice@example.com"
role = "admin"
active = true
tags = ["api", "auth"]
created_at = 2024-01-15T09:00:00Z`

const SAMPLE_JSON = `{
  "id": 1,
  "name": "Alice Martin",
  "email": "alice@example.com",
  "role": "admin",
  "active": true,
  "tags": ["api", "auth"],
  "created_at": "2024-01-15T09:00:00Z"
}`

interface ConvertResult {
  output: string
  error: string | null
  line?: number | null
  column?: number | null
}

export function tomlToJson(input: string): ConvertResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty' }
  try {
    const parsed = parse(trimmed)
    return { output: JSON.stringify(parsed, null, 2), error: null }
  } catch (e) {
    if (e instanceof TomlError) {
      return { output: '', error: e.message.split('\n')[0], line: e.line ?? null, column: e.column ?? null }
    }
    return { output: '', error: (e as Error).message }
  }
}

// smol-toml's stringify() is inconsistent on values TOML can't represent: a
// top-level null throws a confusing "Cannot convert undefined or null to
// object", a null nested under a key is silently dropped from the output,
// and a null inside an array throws a clear error — three different
// behaviors for the same underlying problem. TOML has no null literal at
// all, so we walk the parsed value ourselves first and refuse with one
// consistent, honest message rather than let the library's mixed behavior
// leak through (matching safeJsonParse's "surface it, don't guess" stance).
function findNullPath(value: unknown, path = ''): string | null {
  if (value === null) return path || 'root value'
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const found = findNullPath(value[i], `${path}[${i}]`)
      if (found) return found
    }
    return null
  }
  if (typeof value === 'object') {
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      const found = findNullPath(v, path ? `${path}.${key}` : key)
      if (found) return found
    }
  }
  return null
}

export function jsonToToml(input: string): ConvertResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty' }
  const { data, error, line, column } = safeJsonParse(trimmed)
  if (error) return { output: '', error, line, column }

  if (Array.isArray(data)) {
    return { output: '', error: 'TOML has no top-level array — wrap it in an object first, e.g. { "items": [...] }' }
  }
  if (data === null || typeof data !== 'object') {
    return { output: '', error: 'TOML documents must be an object at the top level, e.g. { "key": "value" }' }
  }
  const nullPath = findNullPath(data)
  if (nullPath) {
    return { output: '', error: `TOML has no null value — "${nullPath}" is null. Remove the key or replace it with a value.` }
  }

  try {
    return { output: stringify(data as object), error: null }
  } catch (e) {
    return { output: '', error: (e as Error).message }
  }
}

export function useTomlToJson() {
  const input = ref(SAMPLE_TOML)

  const result = computed(() => tomlToJson(input.value))
  const output      = computed(() => result.value.output)
  const error       = computed(() => (result.value.error && result.value.error !== 'empty') ? result.value.error : null)
  const errorLine   = computed(() => result.value.line ?? null)
  const errorColumn = computed(() => result.value.column ?? null)

  const { copied, copy } = useClipboard(() => output.value)

  function download() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'application/json' }), 'converted.json')
  }

  function clear() { input.value = '' }

  return { input, output, error, errorLine, errorColumn, copied, copy, download, clear }
}

export function useJsonToToml() {
  const input = ref(SAMPLE_JSON)

  const result = computed(() => jsonToToml(input.value))
  const output      = computed(() => result.value.output)
  const error       = computed(() => (result.value.error && result.value.error !== 'empty') ? result.value.error : null)
  const errorLine   = computed(() => result.value.line ?? null)
  const errorColumn = computed(() => result.value.column ?? null)

  const { copied, copy } = useClipboard(() => output.value)

  function download() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'application/toml' }), 'converted.toml')
  }

  function clear() { input.value = '' }

  return { input, output, error, errorLine, errorColumn, copied, copy, download, clear }
}
