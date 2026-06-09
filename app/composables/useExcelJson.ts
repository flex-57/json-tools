export interface SheetInfo {
  name: string
  rowCount: number
}

export interface ExcelConvertResult {
  output: string
  error: string | null
  sheets: SheetInfo[]
  activeSheet: string
}

export async function excelToJson(file: File, sheetName?: string, hasHeader = true): Promise<ExcelConvertResult> {
  const XLSX = await import('xlsx')
  try {
    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(buffer, { type: 'array' })

    const sheets: SheetInfo[] = wb.SheetNames.map(name => ({
      name,
      rowCount: XLSX.utils.sheet_to_json(wb.Sheets[name]).length,
    }))

    const target = sheetName ?? wb.SheetNames[0]
    const ws = wb.Sheets[target]
    if (!ws) return { output: '', error: `Sheet "${target}" not found`, sheets, activeSheet: target }

    const data = XLSX.utils.sheet_to_json(ws, { header: hasHeader ? undefined : 1, defval: null })
    return {
      output: JSON.stringify(data, null, 2),
      error: null,
      sheets,
      activeSheet: target,
    }
  } catch (e) {
    return { output: '', error: (e as Error).message, sheets: [], activeSheet: '' }
  }
}

export async function jsonToExcel(input: string, sheetName = 'Sheet1'): Promise<{ blob: Blob | null, error: string | null }> {
  const trimmed = input.trim()
  if (!trimmed) return { blob: null, error: 'empty' }
  try {
    const XLSX = await import('xlsx')
    const parsed = JSON.parse(trimmed)
    const arr = Array.isArray(parsed) ? parsed : [parsed]
    const ws = XLSX.utils.json_to_sheet(arr)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    return { blob: new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), error: null }
  } catch (e) {
    return { blob: null, error: (e as Error).message }
  }
}

export function useExcelToJson() {
  const file = ref<File | null>(null)
  const output = ref('')
  const error = ref<string | null>(null)
  const sheets = ref<SheetInfo[]>([])
  const activeSheet = ref('')
  const hasHeader = ref(true)
  const copied = ref(false)
  const loading = ref(false)

  async function convert(f?: File) {
    const target = f ?? file.value
    if (!target) return
    file.value = target
    loading.value = true
    const result = await excelToJson(target, activeSheet.value || undefined, hasHeader.value)
    output.value = result.output
    error.value = result.error
    sheets.value = result.sheets
    if (!activeSheet.value) activeSheet.value = result.activeSheet
    loading.value = false
  }

  async function switchSheet(name: string) {
    activeSheet.value = name
    if (file.value) await convert()
  }

  async function copy() {
    if (!output.value) return
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }

  function clear() {
    file.value = null; output.value = ''; error.value = null
    sheets.value = []; activeSheet.value = ''
  }

  return { file, output, error, sheets, activeSheet, hasHeader, copied, loading, convert, switchSheet, copy, clear }
}

export function useJsonToExcel() {
  const input = ref('')
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function download() {
    loading.value = true
    const { blob, error: err } = await jsonToExcel(input.value)
    loading.value = false
    if (err) { error.value = err; return }
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'converted.xlsx'; a.click()
    URL.revokeObjectURL(url)
    error.value = null
  }

  function clear() { input.value = ''; error.value = null }

  return { input, error, loading, download, clear }
}
