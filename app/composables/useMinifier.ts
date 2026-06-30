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

type LightningModule = { transform: (opts: { filename: string; code: Uint8Array; minify: boolean }) => { code: Uint8Array } }
let _lcss: LightningModule | null | undefined = undefined

async function getLightningCSS(): Promise<LightningModule | null> {
  if (!import.meta.client) return null
  if (_lcss !== undefined) return _lcss
  try {
    const mod = await import('lightningcss-wasm')
    await mod.default()
    _lcss = { transform: mod.transform as LightningModule['transform'] }
  } catch {
    _lcss = null
  }
  return _lcss
}

export async function minifyCSS(input: string): Promise<MinifyResult> {
  const trimmed = input.trim()
  if (!trimmed) return empty(input)
  try {
    const lcss = await getLightningCSS()
    let output: string
    if (lcss) {
      const result = lcss.transform({ filename: 'input.css', code: new TextEncoder().encode(trimmed), minify: true })
      output = new TextDecoder().decode(result.code)
    } else {
      // regex fallback (SSR or WASM load failure)
      output = trimmed
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        .replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
        .replace(/;}/g, '}')
        .trim()
    }
    return { output, error: null, ...stats(input, output) }
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
    const result = await minify(trimmed, { compress: true, mangle: true, ecma: 2020 })
    const output = result.code ?? ''
    return { output, error: null, ...stats(input, output) }
  } catch (e) {
    const raw = (e as Error).message
    const looksLikeTS = /\binterface\s+\w|\btype\s+\w+\s*[=<]|\bas\s+\w|:\s*(string|number|boolean|void|any|never|unknown)\b/.test(trimmed)
    const looksLikeJSX = /<[A-Z][a-zA-Z]*[\s/>]|<\/[A-Z]/.test(trimmed)
    if (looksLikeTS) return { ...empty(input), error: 'TypeScript is not supported — remove type annotations and use plain JavaScript only.' }
    if (looksLikeJSX) return { ...empty(input), error: 'JSX syntax is not supported — this minifier handles plain JavaScript only.' }
    return { ...empty(input), error: raw }
  }
}

const MINIFIERS = { css: minifyCSS, html: minifyHTML, js: minifyJS }

const SAMPLES: Record<MinifyMode, string> = {
  css: `.card {
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
}`,

  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Page</title>
  </head>
  <body>
    <header class="site-header">
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
    <main>
      <h1>Hello, World!</h1>
      <p>This is a sample HTML document.</p>
    </main>
  </body>
</html>`,

  js: `function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

function formatDate(date, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

const result = formatDate(new Date());
console.log(result);`,
}

export function useMinifier() {
  const input   = ref(SAMPLES.css)
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

  watch(mode, (newMode, oldMode) => {
    if (input.value === SAMPLES[oldMode]) input.value = SAMPLES[newMode]
  })

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
