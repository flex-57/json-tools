import * as XLSX from 'xlsx'

addEventListener('message', async (e: MessageEvent) => {
  const { type, port } = e.data as { type: string; port: MessagePort }

  try {
    if (type === 'excelToJson') {
      const { buffer, sheetName, hasHeader } = e.data as {
        buffer: ArrayBuffer
        sheetName?: string
        hasHeader: boolean
      }

      const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' })
      const sheets: Array<{ name: string; rowCount: number }> = wb.SheetNames.map(name => ({
        name,
        rowCount: XLSX.utils.sheet_to_json(wb.Sheets[name]!).length,
      }))

      const target = sheetName ?? wb.SheetNames[0] ?? ''
      const ws = wb.Sheets[target]
      if (!ws) {
        port.postMessage({ output: '', error: `Sheet "${target}" not found`, sheets, activeSheet: target })
        return
      }

      const data = XLSX.utils.sheet_to_json(ws, { header: hasHeader ? undefined : 1, defval: null })
      port.postMessage({
        output: JSON.stringify(data, null, 2),
        error: null,
        sheets,
        activeSheet: target,
      })
    }
    else if (type === 'jsonToExcel') {
      const { input, sheetName } = e.data as { input: string; sheetName: string }

      const parsed = JSON.parse(input)
      const arr = Array.isArray(parsed) ? parsed : [parsed]
      const ws = XLSX.utils.json_to_sheet(arr)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, sheetName)

      // XLSX.write type:'array' → Uint8Array.
      // new Uint8Array(src) creates a full copy with offset=0 and its own ArrayBuffer,
      // avoiding any byteOffset surprises before transfer.
      const out = new Uint8Array(XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as Uint8Array)
      port.postMessage({ blobBuffer: out.buffer, error: null }, [out.buffer])
    }
  }
  catch (err) {
    // Guard: some environments throw non-Error values; convert to string defensively.
    const message = err instanceof Error ? err.message : String(err)
     
    console.error('[excel.worker]', message, err)
    port.postMessage({ error: message })
  }
})
