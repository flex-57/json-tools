import { useClipboard } from './useClipboard'
import { triggerDownload } from '../utils/download'

export type SqlDialect = 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'tsql'

const SAMPLE_SQL = `select u.id, u.name, u.email, count(o.id) as order_count, sum(o.total) as total_spent
from users u
left join orders o on u.id = o.user_id
where u.active = 1 and o.created_at >= '2024-01-01'
group by u.id, u.name, u.email
having total_spent > 100
order by total_spent desc
limit 20`

export interface SqlFormatOptions {
  dialect: SqlDialect
  uppercase: boolean
  indentSize: number
}

export interface SqlFormatResult {
  output: string
  error: string | null
}

// The "1 tab" option in the UI stores indentSize as 1, a sentinel meaning
// "use a real tab character" — sql-formatter's tabWidth option only controls
// the WIDTH of a space-based indent, so tabWidth: 1 alone produces a single
// space per level, not an actual \t. Getting a real tab requires the
// separate useTabs flag, derived here from that same sentinel value.
export async function formatSql(sql: string, opts: SqlFormatOptions): Promise<SqlFormatResult> {
  const trimmed = sql.trim()
  if (!trimmed) return { output: '', error: null }
  try {
    const { format } = await import('sql-formatter')
    const output = format(trimmed, {
      language: opts.dialect,
      keywordCase: opts.uppercase ? 'upper' : 'preserve',
      indentStyle: 'standard',
      tabWidth: opts.indentSize,
      useTabs: opts.indentSize === 1,
    })
    return { output, error: null }
  } catch (e) {
    return { output: '', error: (e as Error).message }
  }
}

export function useSqlFormatter() {
  const input      = ref(SAMPLE_SQL)
  const dialect    = ref<SqlDialect>('sql')
  const uppercase  = ref(true)
  const indentSize = ref(2)
  const output     = ref('')
  const error      = ref<string | null>(null)
  const loading    = ref(false)

  let timer: ReturnType<typeof setTimeout> | null = null

  async function run() {
    loading.value = true
    const result = await formatSql(input.value, { dialect: dialect.value, uppercase: uppercase.value, indentSize: indentSize.value })
    output.value = result.output
    error.value = result.error
    loading.value = false
  }

  watch([input, dialect, uppercase, indentSize], () => {
    if (!import.meta.client) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(run, 250)
  })

  onMounted(run)

  const { copied, copy } = useClipboard(() => output.value)

  function clear() { input.value = ''; output.value = ''; error.value = null }

  function download() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'text/plain' }), 'formatted.sql')
  }

  return { input, dialect, uppercase, indentSize, output, error, loading, copied, copy, download, clear }
}
