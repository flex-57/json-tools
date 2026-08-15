export type GradientType = 'linear' | 'radial' | 'conic'
export type RadialShape = 'circle' | 'ellipse'
export type GradientPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'

export interface ColorStop {
  id: number
  color: string
  position: number
}

export interface GradientPreset {
  name: string
  type: GradientType
  angle: number
  stops: { color: string; position: number }[]
}

export const POSITIONS: GradientPosition[] = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right']

export const GRADIENT_PRESETS: GradientPreset[] = [
  { name: 'Sunset', type: 'linear', angle: 90, stops: [{ color: '#ff3d8f', position: 0 }, { color: '#ffb800', position: 100 }] },
  { name: 'Ocean', type: 'linear', angle: 135, stops: [{ color: '#0ea5e9', position: 0 }, { color: '#6366f1', position: 100 }] },
  { name: 'Mint', type: 'linear', angle: 90, stops: [{ color: '#34d399', position: 0 }, { color: '#06b6d4', position: 100 }] },
  { name: 'Grape', type: 'linear', angle: 120, stops: [{ color: '#7c3aed', position: 0 }, { color: '#ec4899', position: 100 }] },
  { name: 'Fire', type: 'radial', angle: 0, stops: [{ color: '#fbbf24', position: 0 }, { color: '#ef4444', position: 100 }] },
  { name: 'Aurora', type: 'conic', angle: 0, stops: [{ color: '#22d3ee', position: 0 }, { color: '#a78bfa', position: 50 }, { color: '#f472b6', position: 100 }] },
]

export function buildGradientCss(
  type: GradientType,
  angle: number,
  shape: RadialShape,
  position: GradientPosition,
  stops: { color: string; position: number }[],
): string {
  // Sorted by position: CSS gradients don't reorder out-of-order stops, they clamp
  // each one to the previous stop's position instead — authoring them out of order
  // (e.g. after dragging one past a neighbor) would otherwise render a visually
  // broken gradient even though the stop data itself is fine.
  const stopsCss = [...stops].sort((a, b) => a.position - b.position).map(s => `${s.color} ${s.position}%`).join(', ')
  if (type === 'linear') return `linear-gradient(${angle}deg, ${stopsCss})`
  if (type === 'radial') return `radial-gradient(${shape} at ${position}, ${stopsCss})`
  return `conic-gradient(from ${angle}deg at ${position}, ${stopsCss})`
}

let nextStopId = 0
function makeStop(color: string, position: number): ColorStop {
  return { id: nextStopId++, color, position }
}

export function useGradientGenerator() {
  const type = ref<GradientType>('linear')
  const angle = ref(90)
  const shape = ref<RadialShape>('ellipse')
  const position = ref<GradientPosition>('center')
  const stops = ref<ColorStop[]>([makeStop('#ff3d8f', 0), makeStop('#7c3aed', 100)])

  const css = computed(() => buildGradientCss(type.value, angle.value, shape.value, position.value, stops.value))
  const backgroundCss = computed(() => `background: ${css.value};`)

  function addStop() {
    const positions = [...stops.value.map(s => s.position)].sort((a, b) => a - b)
    let newPos: number
    if (positions.length === 0) {
      newPos = 50
    } else if (positions[positions.length - 1]! < 100) {
      newPos = Math.min(100, positions[positions.length - 1]! + 10)
    } else {
      // The "append after the highest stop" spot is already taken (max is 100,
      // as it is by default) — landing a new stop there would be indistinguishable
      // from the existing one. Insert into the largest gap instead.
      let bestGapStart = 0
      let bestGapSize = -1
      for (let i = 1; i < positions.length; i++) {
        const gap = positions[i]! - positions[i - 1]!
        if (gap > bestGapSize) { bestGapSize = gap; bestGapStart = positions[i - 1]! }
      }
      newPos = Math.round(bestGapStart + bestGapSize / 2)
    }
    stops.value = [...stops.value, makeStop('#888888', newPos)]
  }

  function removeStop(id: number) {
    if (stops.value.length <= 2) return
    stops.value = stops.value.filter(s => s.id !== id)
  }

  function applyPreset(preset: GradientPreset) {
    type.value = preset.type
    angle.value = preset.angle
    // Preset swatches are always previewed at the default shape/position (see
    // gradient.vue's preset-chip style) — match that on click, otherwise a
    // previously-changed shape/position silently survives the preset and the
    // applied gradient no longer matches what the swatch showed.
    shape.value = 'ellipse'
    position.value = 'center'
    stops.value = preset.stops.map(s => makeStop(s.color, s.position))
  }

  return { type, angle, shape, position, stops, css, backgroundCss, addStop, removeStop, applyPreset }
}
