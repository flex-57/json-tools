import { triggerDownload } from '../utils/download'
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
}

export function yamlToJson(input: string): ConvertResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty' }
  try {
    const parsed = yaml.load(trimmed)
    return { output: JSON.stringify(parsed, null, 2), error: null }
  } catch (e) {
    return { output: '', error: (e as Error).message }
  }
}

export function jsonToYaml(input: string, indent = 2): ConvertResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty' }
  try {
    const parsed = JSON.parse(trimmed)
    return { output: yaml.dump(parsed, { indent, lineWidth: -1 }), error: null }
  } catch (e) {
    return { output: '', error: (e as Error).message }
  }
}

export function useYamlToJson() {
  const input = ref(SAMPLE_YAML)
  const output = ref('')
  const error = ref<string | null>(null)

  function convert() {
    const r = yamlToJson(input.value)
    output.value = r.output
    error.value = r.error
  }

  const { copied, copy } = useClipboard(() => output.value)

  function clear() { input.value = ''; output.value = ''; error.value = null }

  onMounted(convert)

  return { input, output, error, copied, convert, copy, clear }
}

export function useJsonToYaml() {
  const input = ref(SAMPLE_JSON)
  const output = ref('')
  const error = ref<string | null>(null)
  const indent = ref(2)

  function convert() {
    const r = jsonToYaml(input.value, indent.value)
    output.value = r.output
    error.value = r.error
  }

  const { copied, copy } = useClipboard(() => output.value)

  function download() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'text/yaml' }), 'converted.yaml')
  }

  function clear() { input.value = ''; output.value = ''; error.value = null }

  onMounted(convert)

  return { input, output, error, indent, copied, convert, copy, download, clear }
}
