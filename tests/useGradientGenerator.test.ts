import { describe, it, expect } from 'vitest'
import { buildGradientCss, useGradientGenerator, GRADIENT_PRESETS } from '../app/composables/useGradientGenerator'

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

  it('sorts out-of-order stops by position before building the CSS', () => {
    // CSS gradients clamp an out-of-order stop to the previous one's position
    // rather than reordering it — authoring them out of order (e.g. after
    // dragging one past a neighbor) would otherwise render visibly wrong.
    const css = buildGradientCss('linear', 90, 'ellipse', 'center', [
      { color: '#c', position: 100 },
      { color: '#a', position: 0 },
      { color: '#b', position: 50 },
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

  it('addStop inserts into the largest gap when the max position is already 100', () => {
    // Default state is stops at 0 and 100 — appending "past the max" would land
    // exactly on the existing 100% stop (invisible, same position). The new stop
    // must get a position distinct from every existing one.
    const { stops, addStop } = useGradientGenerator()
    addStop()
    expect(stops.value).toHaveLength(3)
    const positions = stops.value.map(s => s.position)
    expect(new Set(positions).size).toBe(3)
    expect(stops.value[2]!.position).toBe(50)
  })

  it('addStop appends past the max position when there is room', () => {
    const { stops, addStop } = useGradientGenerator()
    addStop() // stops now at 0, 100, 50
    addStop() // largest gap is now 0-50 or 50-100 (both 50) — still no room above 100
    const positions = stops.value.map(s => s.position)
    expect(new Set(positions).size).toBe(4)
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
    const preset = GRADIENT_PRESETS.find(p => p.type === 'conic')!
    applyPreset(preset)
    expect(type.value).toBe('conic')
    expect(angle.value).toBe(preset.angle)
    expect(stops.value.map(s => s.color)).toEqual(preset.stops.map(s => s.color))
  })

  it('applyPreset resets shape and position to match the preset-chip preview', () => {
    // Preset chips are always previewed at ellipse/center (see gradient.vue) — a
    // previously changed shape/position must not silently survive a preset click,
    // or the applied gradient no longer matches what the chip showed.
    const { shape, position, applyPreset } = useGradientGenerator()
    shape.value = 'circle'
    position.value = 'top left'
    applyPreset(GRADIENT_PRESETS[0]!)
    expect(shape.value).toBe('ellipse')
    expect(position.value).toBe('center')
  })

  it('css reflects the current state reactively', () => {
    const { type, angle, css } = useGradientGenerator()
    type.value = 'linear'
    angle.value = 45
    expect(css.value).toContain('45deg')
  })
})
