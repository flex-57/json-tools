export type SqlDialect = 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'tsql'

const SAMPLE_SQL = `select u.id, u.name, u.email, count(o.id) as order_count, sum(o.total) as total_spent
from users u
left join orders o on u.id = o.user_id
where u.active = 1 and o.created_at >= '2024-01-01'
group by u.id, u.name, u.email
having total_spent > 100
order by total_spent desc
limit 20`

export function useSqlFormatter() {
  const input      = ref(SAMPLE_SQL)
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

  onMounted(run)

  async function copy() {
    if (!output.value) return
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }

  function clear() { input.value = ''; output.value = ''; error.value = null }

  return { input, dialect, uppercase, indentSize, output, error, loading, copied, copy, clear }
}
