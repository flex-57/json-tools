import { optimize, type PluginConfig } from 'svgo/browser'
import { triggerDownload } from '../utils/download'
import { useClipboard } from './useClipboard'

const SAMPLE_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Exported by a design tool -->
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <metadata>Generated content</metadata>
  <g id="layer1">
    <circle cx="32" cy="32" r="28" fill="#FF0066" stroke="none"/>
    <path d="M 16.000000 32.000000 L 48.000000 32.000000" stroke="#FFFFFF" stroke-width="4.000000"/>
  </g>
</svg>`

export interface SvgOptimizeResult {
  output: string
  error: string | null
  line: number | null
  column: number | null
  originalSize: number
  optimizedSize: number
  savings: number
}

function empty(): SvgOptimizeResult {
  return { output: '', error: null, line: null, column: null, originalSize: 0, optimizedSize: 0, savings: 0 }
}

function stats(input: string, output: string): Pick<SvgOptimizeResult, 'originalSize' | 'optimizedSize' | 'savings'> {
  const orig = new TextEncoder().encode(input).length
  const opt  = new TextEncoder().encode(output).length
  return { originalSize: orig, optimizedSize: opt, savings: orig > 0 ? Math.round((1 - opt / orig) * 100) : 0 }
}

// SVGO's error message has the shape "<input>:LINE:COL: reason" (SvgoParserError) —
// pull the line/column out for the same jump-to-line UX the other converters get
// from their own parsers, rather than showing the raw "<input>:..." prefix.
const PARSE_ERROR_RE = /^<input>:(\d+):(\d+):\s*(.*)$/s

export function optimizeSvg(input: string, removeScripts = true): SvgOptimizeResult {
  const trimmed = input.trim()
  if (!trimmed) return empty()

  try {
    const plugins: PluginConfig[] = removeScripts ? ['preset-default', 'removeScripts'] : ['preset-default']
    const result = optimize(trimmed, { multipass: true, plugins })
    return { output: result.data, error: null, line: null, column: null, ...stats(trimmed, result.data) }
  } catch (e) {
    const message = (e as Error).message
    const match = message.match(PARSE_ERROR_RE)
    const zeroStats = { originalSize: new TextEncoder().encode(trimmed).length, optimizedSize: 0, savings: 0 }
    if (match) {
      return { output: '', error: match[3]!, line: Number(match[1]), column: Number(match[2]), ...zeroStats }
    }
    return { output: '', error: message, line: null, column: null, ...zeroStats }
  }
}

export function useSvgOptimizer() {
  const input = ref(SAMPLE_SVG)
  const removeScripts = ref(true)

  const result = computed(() => optimizeSvg(input.value, removeScripts.value))
  const output        = computed(() => result.value.output)
  const error          = computed(() => result.value.error)
  const errorLine      = computed(() => result.value.line)
  const errorColumn    = computed(() => result.value.column)
  const originalSize   = computed(() => result.value.originalSize)
  const optimizedSize  = computed(() => result.value.optimizedSize)
  const savings        = computed(() => result.value.savings)

  const { copied, copy } = useClipboard(() => output.value)

  function download() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'image/svg+xml' }), 'optimized.svg')
  }

  function clear() { input.value = '' }

  return { input, output, error, errorLine, errorColumn, originalSize, optimizedSize, savings, removeScripts, copied, copy, download, clear }
}
