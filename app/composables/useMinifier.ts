export type MinifyMode = 'css' | 'html' | 'js'

export interface MinifyResult {
  output: string
  error: string | null
  originalSize: number
  minifiedSize: number
  savings: number
}

function empty(input: string): MinifyResult {
  return { output: '', error: null, originalSize: input.length, minifiedSize: 0, savings: 0 }
}

function stats(input: string, output: string): Pick<MinifyResult, 'originalSize' | 'minifiedSize' | 'savings'> {
  const orig = new TextEncoder().encode(input).length
  const min  = new TextEncoder().encode(output).length
  return { originalSize: orig, minifiedSize: min, savings: orig > 0 ? Math.round((1 - min / orig) * 100) : 0 }
}

export async function minifyCSS(input: string): Promise<MinifyResult> {
  const trimmed = input.trim()
  if (!trimmed) return empty(input)
  try {
    const { default: CleanCSS } = await import('clean-css')
    const result = new CleanCSS({ level: 2 }).minify(trimmed)
    if (result.errors.length) return { ...empty(input), error: result.errors.join(' | ') }
    return { output: result.styles, error: null, ...stats(input, result.styles) }
  } catch (e) {
    return { ...empty(input), error: (e as Error).message }
  }
}

export async function minifyHTML(input: string): Promise<MinifyResult> {
  const trimmed = input.trim()
  if (!trimmed) return empty(input)
  try {
    const { minify } = await import('html-minifier-terser')
    const output = await minify(trimmed, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: { compress: true, mangle: true },
    })
    return { output, error: null, ...stats(input, output) }
  } catch (e) {
    return { ...empty(input), error: (e as Error).message }
  }
}

export async function minifyJS(input: string): Promise<MinifyResult> {
  const trimmed = input.trim()
  if (!trimmed) return empty(input)
  try {
    const { minify } = await import('terser')
    const result = await minify(trimmed, { compress: true, mangle: true })
    const output = result.code ?? ''
    return { output, error: null, ...stats(input, output) }
  } catch (e) {
    return { ...empty(input), error: (e as Error).message }
  }
}

const MINIFIERS = { css: minifyCSS, html: minifyHTML, js: minifyJS }

const SAMPLE_CSS = `.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}`

export function useMinifier() {
  const input   = ref(SAMPLE_CSS)
  const mode    = ref<MinifyMode>('css')
  const copied  = ref(false)
  const loading = ref(false)
  const result  = ref<MinifyResult | null>(null)

  let timer: ReturnType<typeof setTimeout> | null = null

  async function run() {
    if (!input.value.trim()) { result.value = null; return }
    loading.value = true
    result.value = await MINIFIERS[mode.value]!(input.value)
    loading.value = false
  }

  watch([input, mode], () => {
    if (!import.meta.client) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(run, 280)
  })

  onMounted(run)

  const output  = computed(() => result.value?.output ?? '')
  const error   = computed(() => result.value?.error ?? null)

  async function copy() {
    if (!output.value) return
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }

  function clear() { input.value = ''; result.value = null }

  return { input, mode, output, error, loading, copied, result, copy, clear }
}
