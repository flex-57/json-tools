import { describe, it, expect } from 'vitest'
import { buildBoxShadowCss, parseBoxShadow, type ShadowLayer } from '../app/composables/useBoxShadowGenerator'

const LAYER: Omit<ShadowLayer, 'id'> = { offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: 'rgba(0, 0, 0, 0.15)', inset: false }

describe('buildBoxShadowCss', () => {
  it('builds a single layer', () => {
    expect(buildBoxShadowCss([{ id: 1, ...LAYER }])).toBe('0px 4px 12px 0px rgba(0, 0, 0, 0.15)')
  })

  it('prefixes inset layers', () => {
    expect(buildBoxShadowCss([{ id: 1, ...LAYER, inset: true }])).toBe('inset 0px 4px 12px 0px rgba(0, 0, 0, 0.15)')
  })

  it('joins multiple layers with a comma', () => {
    const css = buildBoxShadowCss([{ id: 1, ...LAYER }, { id: 2, ...LAYER, offsetY: 8, inset: true }])
    expect(css).toBe('0px 4px 12px 0px rgba(0, 0, 0, 0.15), inset 0px 8px 12px 0px rgba(0, 0, 0, 0.15)')
  })

  it('returns "none" for an empty layer list', () => {
    expect(buildBoxShadowCss([])).toBe('none')
  })
})

describe('parseBoxShadow', () => {
  it('parses a simple shadow', () => {
    const layers = parseBoxShadow('0px 4px 12px 0px rgba(0, 0, 0, 0.15)')
    expect(layers).toEqual([{ offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: 'rgba(0, 0, 0, 0.15)', inset: false }])
  })

  it('parses inset regardless of position', () => {
    expect(parseBoxShadow('inset 0 2px 6px #fff')?.[0]?.inset).toBe(true)
    expect(parseBoxShadow('0 2px 6px #fff inset')?.[0]?.inset).toBe(true)
  })

  it('parses multiple comma-separated layers without splitting inside rgba()', () => {
    const layers = parseBoxShadow('0px 4px 8px 0px rgba(0,0,0,0.5), inset 0px 0px 2px 0px #ffffff')
    expect(layers).toHaveLength(2)
    expect(layers?.[0]?.color).toBe('rgba(0,0,0,0.5)')
    expect(layers?.[1]?.inset).toBe(true)
    expect(layers?.[1]?.color).toBe('#ffffff')
  })

  it('parses a hex color and a named color', () => {
    expect(parseBoxShadow('2px 2px 4px #ff3d8f')?.[0]?.color).toBe('#ff3d8f')
    expect(parseBoxShadow('2px 2px 4px red')?.[0]?.color).toBe('red')
  })

  it('defaults missing blur/spread to 0', () => {
    expect(parseBoxShadow('2px 2px black')?.[0]).toMatchObject({ offsetX: 2, offsetY: 2, blur: 0, spread: 0 })
  })

  it('accepts a leading "box-shadow:" and trailing semicolon', () => {
    const layers = parseBoxShadow('box-shadow: 2px 2px 4px red;')
    expect(layers).toEqual([{ offsetX: 2, offsetY: 2, blur: 4, spread: 0, color: 'red', inset: false }])
  })

  it('returns an empty array for "none"', () => {
    expect(parseBoxShadow('none')).toEqual([])
  })

  it('returns null for unparseable input', () => {
    expect(parseBoxShadow('not a shadow at all')).toBeNull()
  })

  it('round-trips build -> parse -> build to the same CSS', () => {
    const original = buildBoxShadowCss([{ id: 1, ...LAYER }, { id: 2, offsetX: 1, offsetY: 1, blur: 2, spread: 1, color: '#123456', inset: true }])
    const parsed = parseBoxShadow(original)
    expect(parsed).not.toBeNull()
    const rebuilt = buildBoxShadowCss(parsed!.map((l, i) => ({ id: i, ...l })))
    expect(rebuilt).toBe(original)
  })
})
