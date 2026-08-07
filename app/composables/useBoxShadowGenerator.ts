import { useClipboard } from './useClipboard'

export interface ShadowLayer {
  id: number
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  inset: boolean
}

export interface ShadowPreset {
  name: string
  layers: Omit<ShadowLayer, 'id'>[]
}

export const SHADOW_PRESETS: ShadowPreset[] = [
  { name: 'Soft', layers: [{ offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: 'rgba(0, 0, 0, 0.15)', inset: false }] },
  { name: 'Medium', layers: [{ offsetX: 0, offsetY: 8, blur: 20, spread: -4, color: 'rgba(0, 0, 0, 0.25)', inset: false }] },
  { name: 'Hard', layers: [{ offsetX: 6, offsetY: 6, blur: 0, spread: 0, color: 'rgba(0, 0, 0, 0.9)', inset: false }] },
  {
    name: 'Layered depth',
    layers: [
      { offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: 'rgba(0, 0, 0, 0.24)', inset: false },
      { offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: 'rgba(0, 0, 0, 0.18)', inset: false },
    ],
  },
  { name: 'Neon glow', layers: [{ offsetX: 0, offsetY: 0, blur: 20, spread: 2, color: 'rgba(255, 61, 143, 0.65)', inset: false }] },
  { name: 'Inset', layers: [{ offsetX: 0, offsetY: 2, blur: 6, spread: 0, color: 'rgba(0, 0, 0, 0.35)', inset: true }] },
]

function buildLayerCss(l: Omit<ShadowLayer, 'id'>): string {
  return `${l.inset ? 'inset ' : ''}${l.offsetX}px ${l.offsetY}px ${l.blur}px ${l.spread}px ${l.color}`
}

export function buildBoxShadowCss(layers: ShadowLayer[]): string {
  if (layers.length === 0) return 'none'
  return layers.map(buildLayerCss).join(', ')
}

// Splits on commas that aren't inside a color function's parens, e.g.
// "0 4px 8px rgba(0,0,0,.5), inset 0 0 2px #fff" -> two shadow layers, not
// five fragments cut at every rgba() argument.
function splitTopLevelCommas(value: string): string[] {
  const parts: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < value.length; i++) {
    const c = value[i]
    if (c === '(') depth++
    else if (c === ')') depth--
    else if (c === ',' && depth === 0) { parts.push(value.slice(start, i)); start = i + 1 }
  }
  parts.push(value.slice(start))
  return parts.map(p => p.trim()).filter(Boolean)
}

function parseShadowLayer(chunk: string): Omit<ShadowLayer, 'id'> | null {
  let text = chunk.trim()
  let inset = false

  const insetMatch = text.match(/(^|\s)inset(\s|$)/i)
  if (insetMatch) {
    inset = true
    text = (text.slice(0, insetMatch.index) + ' ' + text.slice(insetMatch.index! + insetMatch[0].length)).trim()
  }

  let color = '#000000'
  const funcMatch = text.match(/(rgba?|hsla?)\([^)]*\)/i)
  if (funcMatch) {
    color = funcMatch[0]
    text = (text.slice(0, funcMatch.index) + ' ' + text.slice(funcMatch.index! + funcMatch[0].length)).trim()
  } else {
    const hexMatch = text.match(/#[0-9a-f]{3,8}\b/i)
    if (hexMatch) {
      color = hexMatch[0]
      text = (text.slice(0, hexMatch.index) + ' ' + text.slice(hexMatch.index! + hexMatch[0].length)).trim()
    } else {
      const words = text.split(/\s+/).filter(Boolean)
      const namedIdx = words.findIndex(w => !/^-?[\d.]+(px|em|rem|%)?$/.test(w))
      if (namedIdx !== -1) {
        color = words[namedIdx]!
        words.splice(namedIdx, 1)
        text = words.join(' ')
      }
    }
  }

  const lengths = text.split(/\s+/).filter(Boolean).map(v => Number.parseFloat(v))
  if (lengths.length < 2 || lengths.some(Number.isNaN)) return null
  const [offsetX, offsetY, blur = 0, spread = 0] = lengths as [number, number, number?, number?]
  return { offsetX, offsetY, blur, spread, color, inset }
}

export function parseBoxShadow(value: string): Omit<ShadowLayer, 'id'>[] | null {
  const trimmed = value.trim().replace(/^box-shadow\s*:\s*/i, '').replace(/;\s*$/, '')
  if (!trimmed || trimmed.toLowerCase() === 'none') return []
  const chunks = splitTopLevelCommas(trimmed)
  const layers = chunks.map(parseShadowLayer)
  if (layers.some(l => l === null)) return null
  return layers as Omit<ShadowLayer, 'id'>[]
}

let nextId = 0
function makeLayer(l: Omit<ShadowLayer, 'id'>): ShadowLayer {
  return { id: nextId++, ...l }
}

export function useBoxShadowGenerator() {
  const layers = ref<ShadowLayer[]>([makeLayer(SHADOW_PRESETS[0]!.layers[0]!)])
  const bgColor = ref('#1c1830')

  const css = computed(() => buildBoxShadowCss(layers.value))
  const declaration = computed(() => `box-shadow: ${css.value};`)

  function addLayer() {
    layers.value = [...layers.value, makeLayer({ offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: 'rgba(0, 0, 0, 0.3)', inset: false })]
  }

  function removeLayer(id: number) {
    if (layers.value.length <= 1) return
    layers.value = layers.value.filter(l => l.id !== id)
  }

  function applyPreset(preset: ShadowPreset) {
    layers.value = preset.layers.map(makeLayer)
  }

  const importError = ref<string | null>(null)
  function importCss(value: string) {
    const parsed = parseBoxShadow(value)
    if (parsed === null) { importError.value = 'Could not parse this as a box-shadow value'; return }
    if (parsed.length === 0) { importError.value = 'No shadow layers found'; return }
    layers.value = parsed.map(makeLayer)
    importError.value = null
  }

  const { copied, copy } = useClipboard(() => declaration.value)

  return { layers, bgColor, css, declaration, addLayer, removeLayer, applyPreset, importError, importCss, copied, copy }
}
