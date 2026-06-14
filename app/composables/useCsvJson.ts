import Papa from 'papaparse'

const SAMPLE_CSV = `id,name,email,role,active
1,Alice,alice@example.com,admin,true
2,Bob,bob@example.com,editor,true
3,Carol,carol@example.com,viewer,false`

const SAMPLE_JSON_ARRAY = `[
  { "id": 1, "name": "Alice", "email": "alice@example.com", "role": "admin" },
  { "id": 2, "name": "Bob", "email": "bob@example.com", "role": "editor" },
  { "id": 3, "name": "Carol", "email": "carol@example.com", "role": "viewer" }
]`

export type Delimiter = ',' | ';' | '\t' | 'auto'

interface ConvertResult {
  output: string
  error: string | null
  rowCount: number
}

export function csvToJson(input: string, delimiter: Delimiter = 'auto', hasHeader = true): ConvertResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty', rowCount: 0 }

  const result = Papa.parse(trimmed, {
    delimiter: delimiter === 'auto' ? '' : delimiter,
    header: hasHeader,
    skipEmptyLines: true,
    dynamicTyping: true,
  })

  if (result.errors.length > 0 && result.data.length === 0) {
    return { output: '', error: result.errors[0]!.message, rowCount: 0 }
  }

  return {
    output: JSON.stringify(result.data, null, 2),
    error: null,
    rowCount: result.data.length,
  }
}

export function jsonToCsv(input: string, delimiter: ',' | ';' | '\t' = ','): ConvertResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty', rowCount: 0 }

  try {
    const parsed = JSON.parse(trimmed)
    const arr = Array.isArray(parsed) ? parsed : [parsed]

    if (arr.length === 0) return { output: '', error: 'Array is empty', rowCount: 0 }

    const csv = Papa.unparse(arr, { delimiter })
    return { output: csv, error: null, rowCount: arr.length }
  } catch (e) {
    return { output: '', error: (e as Error).message, rowCount: 0 }
  }
}

export function useCsvToJson() {
  const input = ref(SAMPLE_CSV)
  const output = ref('')
  const error = ref<string | null>(null)
  const rowCount = ref(0)
  const delimiter = ref<Delimiter>('auto')
  const hasHeader = ref(true)
  const copied = ref(false)

  function convert() {
    const result = csvToJson(input.value, delimiter.value, hasHeader.value)
    output.value = result.output
    error.value = result.error
    rowCount.value = result.rowCount
  }

  async function copy() {
    if (!output.value) return
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }

  async function downloadJson() {
    if (!output.value) return
    const blob = new Blob([output.value], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function clear() {
    input.value = ''
    output.value = ''
    error.value = null
    rowCount.value = 0
  }

  onMounted(convert)

  return { input, output, error, rowCount, delimiter, hasHeader, copied, convert, copy, downloadJson, clear }
}

export function useJsonToCsv() {
  const input = ref(SAMPLE_JSON_ARRAY)
  const output = ref('')
  const error = ref<string | null>(null)
  const rowCount = ref(0)
  const delimiter = ref<',' | ';' | '\t'>(',')
  const copied = ref(false)

  function convert() {
    const result = jsonToCsv(input.value, delimiter.value)
    output.value = result.output
    error.value = result.error
    rowCount.value = result.rowCount
  }

  async function copy() {
    if (!output.value) return
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }

  async function downloadCsv() {
    if (!output.value) return
    const blob = new Blob([output.value], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function clear() {
    input.value = ''
    output.value = ''
    error.value = null
    rowCount.value = 0
  }

  onMounted(convert)

  return { input, output, error, rowCount, delimiter, copied, convert, copy, downloadCsv, clear }
}
