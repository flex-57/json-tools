import { triggerDownload } from '../utils/download'
import { safeJsonParse } from '../utils/json'
import { useClipboard } from './useClipboard'

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

const WORKER_TIMEOUT_MS = 30_000

let _worker: Worker | null = null

function getWorker(): Worker | null {
  if (!import.meta.client) return null
  if (!_worker) {
    try {
      _worker = new Worker(new URL('../workers/excel.worker.ts', import.meta.url), { type: 'module' })
      _worker.onerror = () => { _worker = null }
    }
    catch {
      return null
    }
  }
  return _worker
}

function callWorker<T>(payload: Record<string, unknown>, transfer: Transferable[] = []): Promise<T> {
  return new Promise<T>((resolve) => {
    const worker = getWorker()
    if (!worker) {
      resolve({ error: 'Worker unavailable' } as unknown as T)
      return
    }

    const { port1, port2 } = new MessageChannel()

    const timer = setTimeout(() => {
      port1.close()
      _worker?.terminate()
      _worker = null
      resolve({ error: 'Excel processing timed out' } as unknown as T)
    }, WORKER_TIMEOUT_MS)

    port1.onmessage = (e: MessageEvent) => {
      clearTimeout(timer)
      port1.close()
      // e.data is undefined only if the worker called port.postMessage() with no args — guard defensively
      resolve((e.data ?? { error: 'Worker returned empty response' }) as T)
    }

    port1.onmessageerror = () => {
      clearTimeout(timer)
      port1.close()
      resolve({ error: 'Worker message error' } as unknown as T)
    }

    try {
      worker.postMessage({ ...payload, port: port2 }, [port2, ...transfer])
    }
    catch (postErr) {
      clearTimeout(timer)
      port1.close()
      const msg = postErr instanceof Error ? postErr.message : String(postErr)
      resolve({ error: `Worker postMessage failed: ${msg}` } as unknown as T)
    }
  })
}

export async function excelToJson(file: File, sheetName?: string, hasHeader = true): Promise<ExcelConvertResult> {
  try {
    const buffer = await file.arrayBuffer()
    const result = await callWorker<ExcelConvertResult>(
      { type: 'excelToJson', buffer, sheetName, hasHeader },
      [buffer],
    )
    return {
      output: result.output ?? '',
      error: result.error ?? null,
      sheets: result.sheets ?? [],
      activeSheet: result.activeSheet ?? '',
    }
  }
  catch (e) {
    return { output: '', error: (e as Error).message, sheets: [], activeSheet: '' }
  }
}

export async function jsonToExcel(input: string, sheetName = 'Sheet1'): Promise<{ blob: Blob | null; error: string | null }> {
  const trimmed = input.trim()
  if (!trimmed) return { blob: null, error: 'empty' }
  try {
    const result = await callWorker<{ blobBuffer?: ArrayBuffer; error: string | null }>(
      { type: 'jsonToExcel', input: trimmed, sheetName },
    )
    if (result.error) return { blob: null, error: result.error }
    if (!result.blobBuffer) return { blob: null, error: 'No data returned from worker' }
    return {
      blob: new Blob([new Uint8Array(result.blobBuffer)], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      error: null,
    }
  }
  catch (e) {
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

  const { copied, copy } = useClipboard(() => output.value)

  function clear() {
    file.value = null; output.value = ''; error.value = null
    sheets.value = []; activeSheet.value = ''
  }

  function download() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'application/json' }), 'output.json')
  }

  return { file, output, error, sheets, activeSheet, hasHeader, copied, loading, convert, switchSheet, copy, clear, download }
}

export function useJsonToExcel() {
  const input = ref('')
  // Worker-time failures only (e.g. the xlsx write itself throwing) — kept
  // separate from the live JSON-syntax `error` below so a valid-JSON-but-
  // failed-generation message doesn't get mistaken for a parse error.
  const downloadError = ref<string | null>(null)
  const loading = ref(false)

  // Validated on the main thread, live, as the user types — the worker is
  // only invoked once this already confirms valid JSON, so the banner/line
  // highlight UI doesn't have to wait on a worker round-trip to appear.
  const parsed = computed(() => (input.value.trim() ? safeJsonParse(input.value) : null))
  const isValid = computed(() => input.value.trim() !== '' && !parsed.value?.error)
  const error       = computed(() => parsed.value?.error ?? downloadError.value)
  const errorTip    = computed(() => parsed.value?.tip ?? null)
  const errorLine   = computed(() => parsed.value?.line ?? null)
  const errorColumn = computed(() => parsed.value?.column ?? null)

  async function download() {
    if (!isValid.value) return
    downloadError.value = null
    loading.value = true
    const { blob, error: err } = await jsonToExcel(input.value)
    loading.value = false
    if (err) { downloadError.value = err; return }
    if (!blob) return
    triggerDownload(blob, 'converted.xlsx')
  }

  function clear() { input.value = ''; downloadError.value = null }

  return { input, isValid, error, errorTip, errorLine, errorColumn, loading, download, clear }
}
