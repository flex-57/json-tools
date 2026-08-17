import { safeJsonParse } from '../utils/json'
import type { ConvertResult } from '../utils/json'
import { triggerDownload } from '../utils/download'
import { useConverter } from './useConverter'
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

interface CsvConvertResult extends ConvertResult {
  rowCount: number
}

export function csvToJson(input: string, delimiter: Delimiter = 'auto', hasHeader = true): CsvConvertResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty', rowCount: 0 }

  const result = Papa.parse(trimmed, {
    delimiter: delimiter === 'auto' ? '' : delimiter,
    header: hasHeader,
    skipEmptyLines: true,
    dynamicTyping: true,
  })

  if (result.errors.length > 0 && result.data.length === 0) {
    const err = result.errors[0]!
    // PapaParse's `row` is an index into the *parsed data*, not a source
    // line number — approximate the source line by adding back the header
    // row. Blank lines skipped before the error (skipEmptyLines) would
    // throw this off further; PapaParse doesn't expose an exact position.
    const line = typeof err.row === 'number' ? err.row + (hasHeader ? 2 : 1) : null
    return { output: '', error: err.message, rowCount: 0, line, column: null }
  }

  return {
    output: JSON.stringify(result.data, null, 2),
    error: null,
    rowCount: result.data.length,
  }
}

export function jsonToCsv(input: string, delimiter: ',' | ';' | '\t' = ','): CsvConvertResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty', rowCount: 0 }

  // Parses the untrimmed input on purpose: JsonEditor highlights errorLine against the
  // full v-model content, so a trimmed parse would desync the highlighted line from the
  // real error whenever the input has leading blank lines.
  const { data: parsed, error, line, column, tip } = safeJsonParse(input)
  if (error) return { output: '', error, rowCount: 0, line, column, tip }
  const arr = Array.isArray(parsed) ? parsed : [parsed]
  if (arr.length === 0) return { output: '', error: 'Array is empty', rowCount: 0 }
  const csv = Papa.unparse(arr as object[], { delimiter })
  return { output: csv, error: null, rowCount: arr.length }
}

export function useCsvToJson() {
  const delimiter = ref<Delimiter>('auto')
  const hasHeader = ref(true)
  const { input, result, output, error, errorLine, copied, copy, clear } = useConverter(SAMPLE_CSV, s => csvToJson(s, delimiter.value, hasHeader.value))
  const rowCount = computed(() => result.value.rowCount)

  function downloadJson() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'application/json' }), 'converted.json')
  }

  return { input, output, error, errorLine, rowCount, delimiter, hasHeader, copied, copy, downloadJson, clear }
}

export function useJsonToCsv() {
  const delimiter = ref<',' | ';' | '\t'>(',')

  // Live: no click/shortcut needed — same reasoning as json-formatter's move
  // away from a manual trigger. Unlike json-formatter there's no output-mode
  // choice here (only one transform), so unlike FMT/MIN there's no button to
  // keep at all once this is live.
  const { input, result, output, error, errorTip, errorLine, errorColumn, copied, copy, clear } = useConverter(SAMPLE_JSON_ARRAY, s => jsonToCsv(s, delimiter.value))
  const rowCount = computed(() => result.value.rowCount)

  function downloadCsv() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'text/csv' }), 'converted.csv')
  }

  return { input, output, error, errorTip, errorLine, errorColumn, rowCount, delimiter, copied, copy, downloadCsv, clear }
}
