import { describe, it, expect } from 'vitest'
import { buildGradientCss, useGradientGenerator, PRESETS } from '../app/composables/useGradientGenerator'

describe('buildGradientCss', () => {
  it('builds a linear gradient', () => {
    const css = buildGradientCss('linear', 90, 'ellipse', 'center', [
      { color: '#ff0000', position: 0 },
      { color: '#0000ff', position: 100 },
    ])
    expect(css).toBe('linear-gradient(90deg, #ff0000 0%, #0000ff 100%)')
  })

  it('builds a radial gradient with shape and position', () => {
    const css = buildGradientCss('radial', 0, 'circle', 'top left', [
      { color: '#fff', position: 0 },
      { color: '#000', position: 100 },
    ])
    expect(css).toBe('radial-gradient(circle at top left, #fff 0%, #000 100%)')
  })

  it('builds a conic gradient with angle and position', () => {
    const css = buildGradientCss('conic', 45, 'ellipse', 'center', [
      { color: '#fff', position: 0 },
      { color: '#000', position: 100 },
    ])
    expect(css).toBe('conic-gradient(from 45deg at center, #fff 0%, #000 100%)')
  })

  it('supports more than two stops', () => {
    const css = buildGradientCss('linear', 90, 'ellipse', 'center', [
      { color: '#a', position: 0 },
      { color: '#b', position: 50 },
      { color: '#c', position: 100 },
    ])
    expect(css).toBe('linear-gradient(90deg, #a 0%, #b 50%, #c 100%)')
  })
})

describe('useGradientGenerator', () => {
  it('starts with 2 stops and a linear gradient', () => {
    const { type, stops, css } = useGradientGenerator()
    expect(type.value).toBe('linear')
    expect(stops.value).toHaveLength(2)
    expect(css.value).toContain('linear-gradient(')
  })

  it('addStop appends a new stop past the current max position', () => {
    const { stops, addStop } = useGradientGenerator()
    addStop()
    expect(stops.value).toHaveLength(3)
    expect(stops.value[2]!.position).toBe(100) // clamped: max(0,100)+10 -> 110 -> clamped to 100
  })

  it('removeStop removes a stop by id', () => {
    const { stops, addStop, removeStop } = useGradientGenerator()
    addStop()
    const idToRemove = stops.value[1]!.id
    removeStop(idToRemove)
    expect(stops.value.find(s => s.id === idToRemove)).toBeUndefined()
    expect(stops.value).toHaveLength(2)
  })

  it('removeStop refuses to go below 2 stops', () => {
    const { stops, removeStop } = useGradientGenerator()
    removeStop(stops.value[0]!.id)
    expect(stops.value).toHaveLength(2)
  })

  it('applyPreset sets type, angle and stops from the preset', () => {
    const { type, angle, stops, applyPreset } = useGradientGenerator()
    const preset = PRESETS.find(p => p.type === 'conic')!
    applyPreset(preset)
    expect(type.value).toBe('conic')
    expect(angle.value).toBe(preset.angle)
    expect(stops.value.map(s => s.color)).toEqual(preset.stops.map(s => s.color))
  })

  it('css reflects the current state reactively', () => {
    const { type, angle, css } = useGradientGenerator()
    type.value = 'linear'
    angle.value = 45
    expect(css.value).toContain('45deg')
  })
})
