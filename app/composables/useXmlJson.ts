import { XMLParser, XMLBuilder } from 'fast-xml-parser'

export interface ConvertResult {
  output: string
  error: string | null
}

export function xmlToJson(input: string): ConvertResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty' }
  try {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@', parseAttributeValue: true, parseTagValue: true })
    const parsed = parser.parse(trimmed)
    return { output: JSON.stringify(parsed, null, 2), error: null }
  } catch (e) {
    return { output: '', error: (e as Error).message }
  }
}

export function jsonToXml(input: string): ConvertResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty' }
  try {
    const parsed = JSON.parse(trimmed)
    const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: '@', format: true, indentBy: '  ' })
    return { output: builder.build(parsed), error: null }
  } catch (e) {
    return { output: '', error: (e as Error).message }
  }
}

export function useXmlToJson() {
  const input = ref('')
  const output = ref('')
  const error = ref<string | null>(null)
  const copied = ref(false)

  function convert() {
    const r = xmlToJson(input.value)
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

export function useJsonToXml() {
  const input = ref('')
  const output = ref('')
  const error = ref<string | null>(null)
  const copied = ref(false)

  function convert() {
    const r = jsonToXml(input.value)
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
    const blob = new Blob([output.value], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'converted.xml'; a.click()
    URL.revokeObjectURL(url)
  }

  function clear() { input.value = ''; output.value = ''; error.value = null }

  return { input, output, error, copied, convert, copy, download, clear }
}
