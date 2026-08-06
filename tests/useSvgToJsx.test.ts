import { describe, it, expect } from 'vitest'
import { svgAttrToJsxProp, styleStringToJsxObject, quoteJsxAttrValue } from '../app/composables/useSvgToJsx'

describe('svgAttrToJsxProp', () => {
  it('camelCases known kebab-case SVG attributes', () => {
    expect(svgAttrToJsxProp('stroke-width')).toBe('strokeWidth')
    expect(svgAttrToJsxProp('fill-rule')).toBe('fillRule')
    expect(svgAttrToJsxProp('clip-path')).toBe('clipPath')
    expect(svgAttrToJsxProp('stroke-linecap')).toBe('strokeLinecap')
    expect(svgAttrToJsxProp('font-family')).toBe('fontFamily')
  })

  it('renames class to className and for to htmlFor', () => {
    expect(svgAttrToJsxProp('class')).toBe('className')
    expect(svgAttrToJsxProp('for')).toBe('htmlFor')
  })

  it('leaves attributes already camelCase in the SVG spec untouched', () => {
    expect(svgAttrToJsxProp('viewBox')).toBe('viewBox')
    expect(svgAttrToJsxProp('preserveAspectRatio')).toBe('preserveAspectRatio')
    expect(svgAttrToJsxProp('gradientTransform')).toBe('gradientTransform')
    expect(svgAttrToJsxProp('stdDeviation')).toBe('stdDeviation')
  })

  it('passes unknown attributes through unchanged (React accepts kebab-case as a fallback)', () => {
    expect(svgAttrToJsxProp('data-testid')).toBe('data-testid')
    expect(svgAttrToJsxProp('aria-hidden')).toBe('aria-hidden')
    expect(svgAttrToJsxProp('some-unmapped-attr')).toBe('some-unmapped-attr')
  })
})

describe('styleStringToJsxObject', () => {
  it('converts declarations to a quoted-string JS object', () => {
    expect(styleStringToJsxObject('fill:red;stroke-width:2')).toBe('{ "fill": "red", "strokeWidth": "2" }')
  })

  it('ignores a trailing semicolon without adding an empty entry', () => {
    expect(styleStringToJsxObject('fill:red;')).toBe('{ "fill": "red" }')
  })

  it('keeps CSS custom property names literal, not camelCased', () => {
    expect(styleStringToJsxObject('--my-color:red')).toBe('{ "--my-color": "red" }')
  })

  it('camelCases vendor-prefixed properties with a capitalized first letter', () => {
    expect(styleStringToJsxObject('-webkit-transform:rotate(5deg)')).toBe('{ "WebkitTransform": "rotate(5deg)" }')
  })

  it('handles multiple declarations', () => {
    expect(styleStringToJsxObject('fill:red;stroke:blue;opacity:0.5')).toBe('{ "fill": "red", "stroke": "blue", "opacity": "0.5" }')
  })

  it('returns an empty object for an empty string', () => {
    expect(styleStringToJsxObject('')).toBe('{  }')
  })
})

describe('quoteJsxAttrValue', () => {
  it('double-quotes a plain value', () => {
    expect(quoteJsxAttrValue('24')).toBe('"24"')
  })

  it('falls back to single quotes when the value contains a double quote', () => {
    expect(quoteJsxAttrValue('a "quoted" word')).toBe('\'a "quoted" word\'')
  })

  it('falls back to a JS expression when the value contains both quote types', () => {
    expect(quoteJsxAttrValue(`a "double" and a 'single'`)).toBe(`{${JSON.stringify(`a "double" and a 'single'`)}}`)
  })
})
