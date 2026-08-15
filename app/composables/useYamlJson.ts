import { triggerDownload } from '../utils/download'
import { safeJsonParse } from '../utils/json'
import { useClipboard } from './useClipboard'
import yaml from 'js-yaml'

const SAMPLE_YAML = `name: Alice Martin
email: alice@example.com
role: admin
active: true
tags:
  - api
  - auth
created_at: "2024-01-15T09:00:00Z"`

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
  tip?: string | null
}

export function yamlToJson(input: string): ConvertResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty' }
  try {
    const parsed = yaml.load(trimmed)
    return { output: JSON.stringify(parsed, null, 2), error: null }
  } catch (e) {
    // js-yaml's YAMLException carries a clean `reason` (no ASCII-art
    // snippet) plus a structured `mark` with 0-indexed line/column — far
    // more useful than the raw .message, which mashes both together onto
    // one line that's unreadable once it hits a single-line status bar.
    if (e instanceof yaml.YAMLException) {
      return {
        output: '',
        error: e.reason || e.message,
        line: e.mark ? e.mark.line + 1 : null,
        column: e.mark ? e.mark.column + 1 : null,
      }
    }
    return { output: '', error: (e as Error).message }
  }
}

export function jsonToYaml(input: string, indent = 2): ConvertResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty' }
  // Parses the untrimmed input on purpose: JsonEditor highlights errorLine against the
  // full v-model content, so a trimmed parse would desync the highlighted line from the
  // real error whenever the input has leading blank lines.
  const { data, error, line, column, tip } = safeJsonParse(input)
  if (error) return { output: '', error, line, column, tip }
  try {
    return { output: yaml.dump(data, { indent, lineWidth: -1 }), error: null }
  } catch (e) {
    return { output: '', error: (e as Error).message }
  }
}

export function useYamlToJson() {
  const input = ref(SAMPLE_YAML)

  const result = computed(() => yamlToJson(input.value))
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

export function useJsonToYaml() {
  const input = ref(SAMPLE_JSON)
  const indent = ref(2)

  const result = computed(() => jsonToYaml(input.value, indent.value))
  const output      = computed(() => result.value.output)
  const error       = computed(() => (result.value.error && result.value.error !== 'empty') ? result.value.error : null)
  const errorTip    = computed(() => result.value.tip ?? null)
  const errorLine   = computed(() => result.value.line ?? null)
  const errorColumn = computed(() => result.value.column ?? null)

  const { copied, copy } = useClipboard(() => output.value)

  function download() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'text/yaml' }), 'converted.yaml')
  }

  function clear() { input.value = '' }

  return { input, output, error, errorTip, errorLine, errorColumn, indent, copied, copy, download, clear }
}
