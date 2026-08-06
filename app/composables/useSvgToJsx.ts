import { useClipboard } from './useClipboard'

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="9" stroke="#FF0066" stroke-width="2"/>
  <path d="M8 12l2.5 2.5L16 9" stroke="#FF0066" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

// Known kebab-case SVG/CSS attributes that need camelCasing to read as
// idiomatic JSX. Missing an entry here isn't a correctness bug — React passes
// unrecognized kebab-case attributes through as literal DOM attribute names —
// so this only needs to cover attributes that actually show up in real-world
// SVG, not the full (mostly obsolete SVG-font) attribute space. Attributes
// already camelCase in the SVG spec itself (viewBox, preserveAspectRatio,
// gradientTransform, stdDeviation, ...) need no entry: they pass through as-is.
const ATTR_MAP: Record<string, string> = {
  'accent-height': 'accentHeight',
  'alignment-baseline': 'alignmentBaseline',
  'arabic-form': 'arabicForm',
  'baseline-shift': 'baselineShift',
  'cap-height': 'capHeight',
  'clip-path': 'clipPath',
  'clip-rule': 'clipRule',
  'color-interpolation': 'colorInterpolation',
  'color-interpolation-filters': 'colorInterpolationFilters',
  'color-rendering': 'colorRendering',
  'dominant-baseline': 'dominantBaseline',
  'enable-background': 'enableBackground',
  'fill-opacity': 'fillOpacity',
  'fill-rule': 'fillRule',
  'flood-color': 'floodColor',
  'flood-opacity': 'floodOpacity',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-stretch': 'fontStretch',
  'font-style': 'fontStyle',
  'font-variant': 'fontVariant',
  'font-weight': 'fontWeight',
  'glyph-name': 'glyphName',
  'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
  'glyph-orientation-vertical': 'glyphOrientationVertical',
  'horiz-adv-x': 'horizAdvX',
  'horiz-origin-x': 'horizOriginX',
  'image-rendering': 'imageRendering',
  'letter-spacing': 'letterSpacing',
  'lighting-color': 'lightingColor',
  'marker-end': 'markerEnd',
  'marker-mid': 'markerMid',
  'marker-start': 'markerStart',
  'mask-type': 'maskType',
  'overline-position': 'overlinePosition',
  'overline-thickness': 'overlineThickness',
  'paint-order': 'paintOrder',
  'panose-1': 'panose1',
  'pointer-events': 'pointerEvents',
  'shape-rendering': 'shapeRendering',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'strikethrough-position': 'strikethroughPosition',
  'strikethrough-thickness': 'strikethroughThickness',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-opacity': 'strokeOpacity',
  'stroke-width': 'strokeWidth',
  'tabindex': 'tabIndex',
  'text-anchor': 'textAnchor',
  'text-decoration': 'textDecoration',
  'text-rendering': 'textRendering',
  'underline-position': 'underlinePosition',
  'underline-thickness': 'underlineThickness',
  'unicode-bidi': 'unicodeBidi',
  'unicode-range': 'unicodeRange',
  'units-per-em': 'unitsPerEm',
  'v-alphabetic': 'vAlphabetic',
  'v-hanging': 'vHanging',
  'v-ideographic': 'vIdeographic',
  'v-mathematical': 'vMathematical',
  'vector-effect': 'vectorEffect',
  'vert-adv-y': 'vertAdvY',
  'vert-origin-x': 'vertOriginX',
  'vert-origin-y': 'vertOriginY',
  'word-spacing': 'wordSpacing',
  'writing-mode': 'writingMode',
  'x-height': 'xHeight',
}

export function svgAttrToJsxProp(name: string): string {
  if (name === 'class') return 'className'
  if (name === 'for') return 'htmlFor'
  return ATTR_MAP[name] ?? name
}

function camelizeCssProp(prop: string): string {
  // Leading "--" marks a CSS custom property — its name is never camelCased.
  if (prop.startsWith('--')) return prop
  return prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}

// "fill:red;stroke-width:2" -> "{ fill: 'red', strokeWidth: '2' }". Values are
// always quoted as strings (React accepts numeric CSS values as strings too),
// which sidesteps guessing which properties are unitless numbers.
export function styleStringToJsxObject(styleStr: string): string {
  const entries = styleStr
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
    .map((decl) => {
      const idx = decl.indexOf(':')
      if (idx === -1) return null
      const prop = decl.slice(0, idx).trim()
      const value = decl.slice(idx + 1).trim()
      if (!prop || !value) return null
      return `${JSON.stringify(camelizeCssProp(prop))}: ${JSON.stringify(value)}`
    })
    .filter((e): e is string => e !== null)
  return `{ ${entries.join(', ')} }`
}

// JSX string-attribute values don't support backslash escapes (unlike JS
// string literals) — a literal `"` inside a double-quoted value is a syntax
// error, not an escaped character. Switch quote style, or fall back to a JS
// expression (which does support escaping) if the value has both.
export function quoteJsxAttrValue(value: string): string {
  if (!value.includes('"')) return `"${value}"`
  if (!value.includes('\'')) return `'${value}'`
  return `{${JSON.stringify(value)}}`
}

function isWhitespaceText(n: ChildNode): boolean {
  return n.nodeType === 3 && !(n.textContent ?? '').trim()
}

function relevantChildren(el: Element): ChildNode[] {
  return Array.from(el.childNodes).filter(n => !isWhitespaceText(n) && (n.nodeType === 1 || n.nodeType === 3 || n.nodeType === 8))
}

function serializeAttrs(el: Element, extra: string | null): string {
  const attrs: string[] = []
  for (const attr of Array.from(el.attributes)) {
    if (attr.name === 'style') attrs.push(`style={${styleStringToJsxObject(attr.value)}}`)
    else attrs.push(`${svgAttrToJsxProp(attr.name)}=${quoteJsxAttrValue(attr.value)}`)
  }
  if (extra) attrs.push(extra)
  return attrs.length ? ' ' + attrs.join(' ') : ''
}

function serializeNode(node: ChildNode, depth: number, extraRootAttr: string | null): string {
  const indent = '  '.repeat(depth)
  if (node.nodeType === 8) return `${indent}{/* ${(node.textContent ?? '').trim()} */}`
  if (node.nodeType === 3) return `${indent}${(node.textContent ?? '').trim()}`

  const el = node as Element
  const attrStr = serializeAttrs(el, extraRootAttr)
  const children = relevantChildren(el)

  if (children.length === 0) return `${indent}<${el.tagName}${attrStr} />`
  if (children.length === 1 && children[0]!.nodeType === 3) {
    return `${indent}<${el.tagName}${attrStr}>${(children[0]!.textContent ?? '').trim()}</${el.tagName}>`
  }
  const inner = children.map(c => serializeNode(c, depth + 1, null)).join('\n')
  return `${indent}<${el.tagName}${attrStr}>\n${inner}\n${indent}</${el.tagName}>`
}

export interface SvgToJsxResult {
  output: string
  error: string | null
}

// Requires DOMParser, so this only runs in the browser (see the "node" test
// environment note in useOgGenerator.ts for the same constraint). The pure
// pieces above (attribute mapping, style conversion, value quoting) are unit
// tested directly; this walker is verified against real SVG in the browser.
export function svgToJsx(svgString: string, componentName: string, asComponent: boolean): SvgToJsxResult {
  const trimmed = svgString.trim()
  if (!trimmed) return { output: '', error: null }

  const doc = new DOMParser().parseFromString(trimmed, 'image/svg+xml')
  const parserError = doc.querySelector('parsererror')
  if (parserError) return { output: '', error: (parserError.textContent ?? '').trim() || 'Could not parse this as valid SVG/XML' }

  const root = doc.documentElement
  if (!root || root.tagName.toLowerCase() !== 'svg') return { output: '', error: 'Expected an <svg> root element' }

  const markup = serializeNode(root, asComponent ? 2 : 0, asComponent ? '{...props}' : null)
  if (!asComponent) return { output: markup, error: null }

  const name = componentName.trim() || 'SvgIcon'
  const output = [`export default function ${name}(props) {`, `  return (`, markup, `  )`, `}`].join('\n')
  return { output, error: null }
}

export function useSvgToJsx() {
  const input = ref(SAMPLE_SVG)
  const componentName = ref('SvgIcon')
  const asComponent = ref(true)

  const result = computed<SvgToJsxResult>(() => {
    if (import.meta.server) return { output: '', error: null }
    return svgToJsx(input.value, componentName.value, asComponent.value)
  })
  const output = computed(() => result.value.output)
  const error = computed(() => result.value.error)

  const { copied, copy } = useClipboard(() => output.value)

  function clear() { input.value = '' }

  return { input, componentName, asComponent, output, error, copied, copy, clear }
}
