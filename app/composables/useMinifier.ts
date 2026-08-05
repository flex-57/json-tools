import { useClipboard } from './useClipboard'
import { triggerDownload } from '../utils/download'

export type MinifyMode = 'css' | 'html' | 'js'

export interface MinifyResult {
  output: string
  error: string | null
  errorLine: number | null
  errorColumn: number | null
  // Non-blocking: set when the document minified fine overall but an
  // embedded <script> block failed and was left as-is (see minifyHTML).
  warning: string | null
  originalSize: number
  minifiedSize: number
  savings: number
}

function empty(input: string): MinifyResult {
  return { output: '', error: null, errorLine: null, errorColumn: null, warning: null, originalSize: input.length, minifiedSize: 0, savings: 0 }
}

// clean-css (used internally by html-minifier-terser for embedded <style>
// blocks) can hang forever instead of erroring: its own minify() wraps a
// callback in `new Promise((resolve) => {...})` with no reject path, so if
// something inside throws before that callback fires, the promise we're
// awaiting just never settles — verified live, an empty <style></style> hit
// exactly this via a missing `path` global (see below) and left the page
// showing stale output with no visible error. This bounds the wait so any
// future internal snag — this one or an unrelated one — surfaces as a
// message instead of a silent hang.
function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms)
    promise.then(
      (v) => { clearTimeout(timer); resolve(v) },
      (e) => { clearTimeout(timer); reject(e) },
    )
  })
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

type MinifyHtmlFn = typeof import('html-minifier-terser')['minify']
let _minifyHtml: MinifyHtmlFn | undefined

async function getMinifyHtml(): Promise<MinifyHtmlFn> {
  if (!_minifyHtml) {
    _minifyHtml = (await import('html-minifier-terser')).minify
  }
  return _minifyHtml
}

// lightningcss-wasm's error carries no usable position: its `loc`/`data`
// fields come back empty {} regardless of error type (verified against the
// actual .wasm binary, not just the JS wrapper — same binary is used for the
// browser and Node builds). Only the message text is real, and it's terse —
// rephrase the few variants seen in practice, honestly leave the rest as-is
// rather than guess a fake tip for messages we haven't verified against.
export function humanizeCssError(message: string): string {
  if (/^Unexpected end of input/i.test(message)) {
    return 'Unexpected end of input — check for an unclosed { or a missing value.'
  }
  if (/^Invalid media query/i.test(message)) {
    return 'Invalid media query — check the feature syntax, e.g. (min-width: 600px).'
  }
  if (/^Invalid dangling combinator/i.test(message)) {
    return 'Invalid dangling combinator in selector — remove the trailing >, +, or ~, or add a selector after it.'
  }
  if (/^Unexpected token/i.test(message)) {
    return `${message} — check for a stray character or misplaced bracket.`
  }
  return message
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
    return { output, error: null, errorLine: null, errorColumn: null, warning: null, ...stats(input, output) }
  } catch (e) {
    return { ...empty(input), error: humanizeCssError((e as Error).message) }
  }
}

// html-minifier-terser throws `Error('Parse Error: ' + <everything left
// unparsed>)` when its tokenizer gets stuck (typically an unclosed tag or
// attribute quote that swallows the rest of the document) — no line/column
// property on the error at all. But that trailing text is always an exact
// suffix of the source being parsed (verified against 6 cases: LF/CRLF, and
// a break point preceded by a comment/script/style/entities) because the
// parser consumes the string from the front as it goes — so the position is
// derivable exactly, not guessed, by measuring how much was consumed before
// the point it gave up.
function parseHtmlParseError(message: string, source: string): { error: string; line: number | null; column: number | null } {
  const prefix = 'Parse Error: '
  if (!message.startsWith(prefix)) return { error: message, line: null, column: null }
  const remainder = message.slice(prefix.length)
  if (!remainder || !source.endsWith(remainder)) return { error: message, line: null, column: null }
  const consumed = source.slice(0, source.length - remainder.length)
  const line = (consumed.match(/\n/g)?.length ?? 0) + 1
  const column = consumed.length - consumed.lastIndexOf('\n')
  return { error: 'Unclosed tag or attribute — the parser could not recover past this point.', line, column }
}

export async function minifyHTML(input: string): Promise<MinifyResult> {
  const trimmed = input.trim()
  if (!trimmed) return empty(input)
  try {
    // clean-css (html-minifier-terser dep) calls process.cwd()/.nextTick()
    // when it actually minifies embedded CSS. `globalThis.process` is never
    // actually undefined here client-side: Nuxt itself injects a shim
    // (process.client/.server/.dev/.env/...) for legacy compat, which has no
    // .cwd — so the old `typeof globalThis.process === 'undefined'` guard
    // never fired and this crashed with "process.cwd is not a function" on
    // any <style> tag (verified live: Nuxt's shim keys are exactly
    // ['browser','client','dev','env','nitro','prerender','server','test']).
    // Patch only the missing pieces onto Nuxt's own object instead of
    // replacing it, so process.client/.dev checks elsewhere keep working.
    const proc = globalThis.process as { cwd?: () => string; nextTick?: (fn: (...a: unknown[]) => void, ...args: unknown[]) => void; env?: Record<string, string> } | undefined
    if (!proc) {
      const g = globalThis as unknown as { process: { env: Record<string, string>; nextTick: (fn: (...a: unknown[]) => void, ...args: unknown[]) => void; cwd: () => string } }
      g.process = {
        env: {},
        nextTick: (fn: (...a: unknown[]) => void, ...args: unknown[]) => setTimeout(() => fn(...args), 0),
        cwd: () => '/',
      }
    } else {
      if (typeof proc.cwd !== 'function') proc.cwd = () => '/'
      if (typeof proc.nextTick !== 'function') proc.nextTick = (fn, ...args) => setTimeout(() => fn(...args), 0)
      if (!proc.env) proc.env = {}
    }
    // clean-css also unconditionally computes a default rebase-from directory
    // via path.resolve/.isAbsolute/.relative/.dirname (clean-css/lib/options/
    // rebase-to.js, reader/read-sources.js). Unlike process, `path` is never
    // read as a global — it's `import`ed at module scope, so there's nothing
    // to patch here at runtime; see the `path` → `pathe` alias in
    // nuxt.config.ts for the actual fix (verified live: a global patch had
    // zero effect since clean-css's bundled code never consults it).
    const minify = await getMinifyHtml()
    // html-minifier-terser deliberately never lets a broken embedded <script>
    // fail the whole document: it catches terser's error internally and
    // falls back to leaving that block unminified (see its source). The only
    // way to know that happened is this `log` hook — untyped in
    // @types/html-minifier-terser, hence the cast below. It also receives
    // benign "minified in: Xms" timing strings (as plain strings, verified
    // empirically), so only `instanceof Error` entries are real failures.
    // terser's line/col are relative to that <script> block's own content,
    // not the document — worded as "its line N" below to avoid implying it
    // lines up with the JsonEditor's document-wide gutter numbers.
    const jsErrors: { message: string; line: number | null }[] = []
    const output = await withTimeout(
      minify(trimmed, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: { compress: true, mangle: true },
        log: (msg: unknown) => {
          if (msg instanceof Error) {
            // `msg` is narrowed to Error here, which doesn't declare `line`
            // itself (terser's SyntaxError subtype adds it at runtime) — cast
            // through `unknown` first rather than straight to `{ line }`,
            // since Error and `{ line: number }` don't structurally overlap.
            const rawLine = (msg as unknown as { line?: unknown }).line
            const line = typeof rawLine === 'number' ? rawLine : null
            jsErrors.push({ message: msg.message, line })
          }
        },
      } as Parameters<typeof minify>[1]),
      8000,
      'Minification timed out — this document may use a feature this browser-based minifier cannot process.',
    )
    const warning = jsErrors.length === 0 ? null : jsErrors.length === 1
      ? `1 embedded <script> block was left unminified — ${jsErrors[0]!.message}${jsErrors[0]!.line ? ` (its line ${jsErrors[0]!.line}).` : '.'}`
      : `${jsErrors.length} embedded <script> blocks were left unminified — ${jsErrors.map((e, i) => `#${i + 1}: ${e.message}${e.line ? ` (its line ${e.line})` : ''}`).join('; ')}.`
    return { output, error: null, errorLine: null, errorColumn: null, warning, ...stats(input, output) }
  } catch (e) {
    const parsed = parseHtmlParseError((e as Error).message, trimmed)
    return { ...empty(input), error: parsed.error, errorLine: parsed.line, errorColumn: parsed.column }
  }
}

// terser's SyntaxError already carries clean 1-indexed line + 0-indexed col
// (verified against real thrown errors), so only the message text needs
// rephrasing for the couple of cryptic-but-common shapes seen in practice.
function humanizeJsError(message: string): string {
  if (/^Unterminated string constant/i.test(message)) {
    return 'Unterminated string — check for a missing closing quote.'
  }
  if (/token:?\s*eof\b/i.test(message)) {
    return 'The code is cut off — check for a missing closing }, ), or ].'
  }
  return message
}

export async function minifyJS(input: string): Promise<MinifyResult> {
  const trimmed = input.trim()
  if (!trimmed) return empty(input)
  try {
    const { minify } = await import('terser')
    const result = await minify(trimmed, { compress: true, mangle: true, ecma: 2020 })
    const output = result.code ?? ''
    return { output, error: null, errorLine: null, errorColumn: null, warning: null, ...stats(input, output) }
  } catch (e) {
    const raw = (e as Error).message
    const looksLikeTS = /\binterface\s+\w|\btype\s+\w+\s*[=<]|\bas\s+\w|:\s*(string|number|boolean|void|any|never|unknown)\b/.test(trimmed)
    const looksLikeJSX = /<[A-Z][a-zA-Z]*[\s/>]|<\/[A-Z]/.test(trimmed)
    if (looksLikeTS) return { ...empty(input), error: 'TypeScript is not supported — remove type annotations and use plain JavaScript only.' }
    if (looksLikeJSX) return { ...empty(input), error: 'JSX syntax is not supported — this minifier handles plain JavaScript only.' }
    const line = typeof (e as { line?: unknown }).line === 'number' ? (e as { line: number }).line : null
    const col = typeof (e as { col?: unknown }).col === 'number' ? (e as { col: number }).col : null
    return { ...empty(input), error: humanizeJsError(raw), errorLine: line, errorColumn: col !== null ? col + 1 : null }
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

// One page per language now (css-minifier / html-minifier / js-minifier) —
// each fixed to a single mode, so there's no toggle-driven sample-swapping
// or mode ref to expose, unlike the old combined-page composable this replaces.
function useSingleMinifier(mode: MinifyMode) {
  const input   = ref(SAMPLES[mode])
  const loading = ref(false)
  const result  = ref<MinifyResult | null>(null)

  let timer: ReturnType<typeof setTimeout> | null = null

  async function run() {
    if (!input.value.trim()) { result.value = null; return }
    loading.value = true
    result.value = await MINIFIERS[mode](input.value)
    loading.value = false
  }

  watch(input, () => {
    if (!import.meta.client) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(run, 280)
  })

  onMounted(run)

  const output      = computed(() => result.value?.output ?? '')
  const error       = computed(() => result.value?.error ?? null)
  const errorLine   = computed(() => result.value?.errorLine ?? null)
  const errorColumn = computed(() => result.value?.errorColumn ?? null)
  const warning     = computed(() => result.value?.warning ?? null)

  const { copied, copy } = useClipboard(() => output.value)

  function clear() { input.value = ''; result.value = null }

  function download() {
    if (!output.value) return
    const mime = mode === 'js' ? 'application/javascript' : mode === 'css' ? 'text/css' : 'text/html'
    triggerDownload(new Blob([output.value], { type: mime }), `minified.${mode}`)
  }

  return { input, output, error, errorLine, errorColumn, warning, loading, copied, result, copy, download, clear }
}

export function useCssMinifier()  { return useSingleMinifier('css') }
export function useHtmlMinifier() { return useSingleMinifier('html') }
export function useJsMinifier()   { return useSingleMinifier('js') }
