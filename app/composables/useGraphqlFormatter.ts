import { useClipboard } from './useClipboard'
import { triggerDownload } from '../utils/download'

const SAMPLE_GRAPHQL = `query GetUser($id: ID!) { user(id: $id) { name email posts { title comments { body author { name } } } } }`

export interface GraphqlFormatResult {
  output: string
  error: string | null
  line: number | null
  column: number | null
}

// parse() + print() from graphql-js's own reference printer act as the
// formatter: they round-trip queries, mutations, subscriptions, fragments,
// and SDL (type definitions) through the same canonical pretty-printer, so
// there's no separate "mode" needed for schema vs. operation documents.
export async function formatGraphql(input: string): Promise<GraphqlFormatResult> {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: null, line: null, column: null }

  const { parse, print } = await import('graphql/language')
  try {
    return { output: print(parse(trimmed)), error: null, line: null, column: null }
  } catch (e) {
    // parse() only ever throws GraphQLError, which carries `.locations`
    // (1-indexed line/column) — duck-typed rather than an `instanceof`
    // import from graphql/error, to avoid a second chunk for one check.
    const loc = (e as { locations?: { line: number; column: number }[] }).locations?.[0]
    return { output: '', error: (e as Error).message, line: loc?.line ?? null, column: loc?.column ?? null }
  }
}

export function useGraphqlFormatter() {
  const input   = ref(SAMPLE_GRAPHQL)
  const output  = ref('')
  const error   = ref<string | null>(null)
  const errorLine   = ref<number | null>(null)
  const errorColumn = ref<number | null>(null)
  const loading = ref(false)

  let timer: ReturnType<typeof setTimeout> | null = null

  async function run() {
    loading.value = true
    const result = await formatGraphql(input.value)
    output.value = result.output
    error.value = result.error
    errorLine.value = result.line
    errorColumn.value = result.column
    loading.value = false
  }

  watch(input, () => {
    if (!import.meta.client) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(run, 250)
  })

  onMounted(run)

  const { copied, copy } = useClipboard(() => output.value)

  function clear() { input.value = ''; output.value = ''; error.value = null; errorLine.value = null; errorColumn.value = null }

  function download() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'text/plain' }), 'formatted.graphql')
  }

  return { input, output, error, errorLine, errorColumn, loading, copied, copy, download, clear }
}
