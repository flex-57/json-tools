export type SqlDialect = 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'tsql'

export function useSqlFormatter() {
  const input      = ref('')
  const dialect    = ref<SqlDialect>('sql')
  const uppercase  = ref(true)
  const indentSize = ref(2)
  const output     = ref('')
  const error      = ref<string | null>(null)
  const loading    = ref(false)
  const copied     = ref(false)

  let timer: ReturnType<typeof setTimeout> | null = null

  async function run() {
    const sql = input.value.trim()
    if (!sql) { output.value = ''; error.value = null; return }
    loading.value = true
    error.value = null
    try {
      const { format } = await import('sql-formatter')
      output.value = format(sql, {
        language: dialect.value,
        keywordCase: uppercase.value ? 'upper' : 'preserve',
        indentStyle: 'standard',
        tabWidth: indentSize.value,
      })
    } catch (e) {
      error.value = (e as Error).message
      output.value = ''
    } finally {
      loading.value = false
    }
  }

  watch([input, dialect, uppercase, indentSize], () => {
    if (!import.meta.client) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(run, 250)
  })

  async function copy() {
    if (!output.value) return
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }

  function clear() { input.value = ''; output.value = ''; error.value = null }

  return { input, dialect, uppercase, indentSize, output, error, loading, copied, copy, clear }
}
