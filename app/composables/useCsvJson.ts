import { safeJsonParse } from '../utils/json'
import { triggerDownload } from '../utils/download'
import { useClipboard } from './useClipboard'
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
  line?: number | null
  column?: number | null
  tip?: string | null
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

  const { data: parsed, error, line, column, tip } = safeJsonParse(trimmed)
  if (error) return { output: '', error, rowCount: 0, line, column, tip }
  const arr = Array.isArray(parsed) ? parsed : [parsed]
  if (arr.length === 0) return { output: '', error: 'Array is empty', rowCount: 0 }
  const csv = Papa.unparse(arr as object[], { delimiter })
  return { output: csv, error: null, rowCount: arr.length }
}

export function useCsvToJson() {
  const input = ref(SAMPLE_CSV)
  const output = ref('')
  const error = ref<string | null>(null)
  const rowCount = ref(0)
  const delimiter = ref<Delimiter>('auto')
  const hasHeader = ref(true)

  function convert() {
    const result = csvToJson(input.value, delimiter.value, hasHeader.value)
    output.value = result.output
    error.value = result.error
    rowCount.value = result.rowCount
  }

  const { copied, copy } = useClipboard(() => output.value)

  function downloadJson() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'application/json' }), 'converted.json')
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
  const delimiter = ref<',' | ';' | '\t'>(',')

  // Live: no click/shortcut needed — same reasoning as json-formatter's move
  // away from a manual trigger. Unlike json-formatter there's no output-mode
  // choice here (only one transform), so unlike FMT/MIN there's no button to
  // keep at all once this is live.
  const result = computed(() => jsonToCsv(input.value, delimiter.value))
  const output      = computed(() => result.value.output)
  const error       = computed(() => (result.value.error && result.value.error !== 'empty') ? result.value.error : null)
  const errorTip    = computed(() => result.value.tip ?? null)
  const errorLine   = computed(() => result.value.line ?? null)
  const errorColumn = computed(() => result.value.column ?? null)
  const rowCount    = computed(() => result.value.rowCount)

  const { copied, copy } = useClipboard(() => output.value)

  function downloadCsv() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'text/csv' }), 'converted.csv')
  }

  function clear() { input.value = '' }

  return { input, output, error, errorTip, errorLine, errorColumn, rowCount, delimiter, copied, copy, downloadCsv, clear }
}
