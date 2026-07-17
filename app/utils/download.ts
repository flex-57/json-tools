export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function fmtBytes(n: number): string {
  if (n === 0) return '0 B'
  if (n < 1024) return n + ' B'
  return (n / 1024).toFixed(1) + ' KB'
}
