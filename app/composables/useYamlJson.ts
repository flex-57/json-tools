import yaml from 'js-yaml'

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
  const input = ref('')
  const output = ref('')
  const error = ref<string | null>(null)
  const copied = ref(false)

  function convert() {
    const r = yamlToJson(input.value)
    output.value = r.output
    error.value = r.error
  }

  async function copy() {
    if (!output.value) return
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }

  function clear() { input.value = ''; output.value = ''; error.value = null }

  return { input, output, error, copied, convert, copy, clear }
}

export function useJsonToYaml() {
  const input = ref('')
  const output = ref('')
  const error = ref<string | null>(null)
  const indent = ref(2)
  const copied = ref(false)

  function convert() {
    const r = jsonToYaml(input.value, indent.value)
    output.value = r.output
    error.value = r.error
  }

  async function copy() {
    if (!output.value) return
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }

  async function download() {
    if (!output.value) return
    const blob = new Blob([output.value], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'converted.yaml'; a.click()
    URL.revokeObjectURL(url)
  }

  function clear() { input.value = ''; output.value = ''; error.value = null }

  return { input, output, error, indent, copied, convert, copy, download, clear }
}
