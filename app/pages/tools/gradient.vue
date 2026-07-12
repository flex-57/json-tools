<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">CSS <span class="title-amp">Gradient</span> Generator</h1>
        <p class="page-subtitle">Build linear, radial, and conic CSS gradients visually, then copy the code. Free, no signup, no data sent to servers.</p>
      </div>
    </div>

    <div class="mode-toggle" style="min-width: 250px;">
      <div class="mode-indicator" :style="{ width: 'calc((100% - 6px) / 3)', transform: indicatorTransform }"></div>
      <button v-for="t in TYPES" :key="t.value" class="mode-btn" :class="{ 'mode-btn--active': type === t.value }" @click="type = t.value">{{ t.label }}</button>
    </div>

    <div class="editor-card">
      <div class="preview-box" :style="{ background: css }"></div>

      <div class="controls-body">
        <div v-if="type === 'linear' || type === 'conic'" class="control-row">
          <span class="control-label">Angle</span>
          <input type="range" min="0" max="360" v-model.number="angle" class="grad-slider" />
          <input type="number" min="0" max="360" v-model.number="angle" class="angle-num" />
          <span class="unit">deg</span>
        </div>

        <div v-if="type === 'radial'" class="control-row">
          <span class="control-label">Shape</span>
          <select v-model="shape" class="option-select">
            <option value="ellipse">Ellipse</option>
            <option value="circle">Circle</option>
          </select>
        </div>

        <div v-if="type === 'radial' || type === 'conic'" class="control-row">
          <span class="control-label">Position</span>
          <select v-model="position" class="option-select">
            <option v-for="p in POSITIONS" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>

        <div class="stops-section">
          <div class="stops-header">
            <span class="editor-label">Color stops</span>
            <button class="btn-xs" @click="addStop">+ Add stop</button>
          </div>
          <div class="stops-list">
            <div v-for="stop in stops" :key="stop.id" class="stop-row">
              <input type="color" v-model="stop.color" class="stop-color" :aria-label="`Stop color`" />
              <input type="text" v-model="stop.color" class="stop-hex" spellcheck="false" aria-label="Stop color hex" />
              <input type="range" min="0" max="100" v-model.number="stop.position" class="grad-slider" aria-label="Stop position" />
              <input type="number" min="0" max="100" v-model.number="stop.position" class="stop-pos-num" aria-label="Stop position percent" />
              <span class="unit">%</span>
              <button class="stop-remove" :disabled="stops.length <= 2" @click="removeStop(stop.id)" aria-label="Remove color stop">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="presets-section">
          <span class="editor-label">Presets</span>
          <div class="presets-row">
            <button
              v-for="p in PRESETS" :key="p.name" class="preset-chip"
              :style="{ background: buildGradientCss(p.type, p.angle, 'ellipse', 'center', p.stops) }"
              :title="p.name" :aria-label="`Use ${p.name} preset`" @click="applyPreset(p)"
            ></button>
          </div>
        </div>
      </div>
    </div>

    <div class="editor-card output-card">
      <div class="editor-card-header">
        <span class="editor-label">CSS</span>
        <button class="btn-copy" :class="{ 'btn-copy--done': copied }" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
      </div>
      <pre class="css-output" aria-live="polite">{{ backgroundCss }}</pre>
    </div>

    <SeoSection :cards="cards" />
  </div>
</template>

<script setup lang="ts">
import { useGradientGenerator, buildGradientCss, PRESETS, POSITIONS, type GradientType } from '~/composables/useGradientGenerator'
import { useClipboard } from '~/composables/useClipboard'

useToolSeo(
  'CSS Gradient Generator: Linear, Radial & Conic Gradients Online',
  'Build linear, radial, and conic CSS gradients visually with a live preview. Add color stops, presets, and copy the generated CSS. Free, no signup, 100% client-side.',
)

const { type, angle, shape, position, stops, css, backgroundCss, addStop, removeStop, applyPreset } = useGradientGenerator()

const TYPES: { value: GradientType; label: string }[] = [
  { value: 'linear', label: 'Linear' },
  { value: 'radial', label: 'Radial' },
  { value: 'conic', label: 'Conic' },
]

const indicatorTransform = computed(() => {
  const idx = TYPES.findIndex(t => t.value === type.value)
  if (idx === 0) return 'none'
  return `translateX(${idx * 100}%)`
})

const { copied, copy } = useClipboard(() => backgroundCss.value)

const cards = [
  {
    title: 'Linear, radial, and conic gradients',
    text: 'A linear gradient transitions colors along a straight line at a given angle. A radial gradient radiates from a center point outward, either as a circle or an ellipse. A conic gradient sweeps colors around a center point like a color wheel, useful for pie charts and loading spinners. All three accept the same list of color stops.',
  },
  {
    title: 'What a color stop is',
    text: "A color stop is a color plus a position (0-100%) along the gradient. Two stops is the minimum for any gradient; adding more lets you build multi-color transitions. The browser blends smoothly between each consecutive pair of stops.",
  },
  {
    title: 'Using the generated CSS',
    text: "The output is a full background declaration — paste it directly into a CSS file or a style attribute. Gradients are valid anywhere a color or image value is accepted (background, border-image, mask), and render with no images or extra HTTP requests.",
  },
]
</script>

<style scoped>
.editor-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden; margin-top: 14px; }
.editor-card-header { padding: 12px 16px; border-bottom: 1px solid var(--c-border); display: flex; align-items: center; justify-content: space-between; }
.editor-label { font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--c-t4); }

.preview-box { height: 200px; border-bottom: 1px solid var(--c-border); }

.controls-body { padding: 16px; display: flex; flex-direction: column; gap: 16px; }

.control-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.control-label { font-family: var(--font-body); font-size: 12px; font-weight: 600; color: var(--c-t3); width: 60px; flex-shrink: 0; }
.grad-slider { flex: 1; min-width: 120px; accent-color: var(--c-accent); cursor: pointer; height: 4px; }
.angle-num, .stop-pos-num { width: 60px; height: 32px; padding: 0 8px; border: 1px solid var(--c-border); border-radius: 7px; background: var(--c-subtle); font-family: var(--font-mono); font-size: 13px; color: var(--c-t1); text-align: center; outline: none; transition: border-color 0.15s; flex-shrink: 0; }
.angle-num:focus, .stop-pos-num:focus { border-color: var(--c-accent); }
.unit { font-family: var(--font-mono); font-size: 12px; color: var(--c-t4); flex-shrink: 0; }

.option-select {
  height: 32px; padding: 0 10px; border: 1px solid var(--c-border); border-radius: 7px;
  background: var(--c-subtle); font-family: var(--font-body); font-size: 13px; color: var(--c-t2); font-weight: 500;
  cursor: pointer; transition: border-color 0.15s;
}
.option-select:focus { outline: none; border-color: var(--c-accent); }

.stops-section { display: flex; flex-direction: column; gap: 10px; }
.stops-header { display: flex; align-items: center; justify-content: space-between; }
.stops-list { display: flex; flex-direction: column; gap: 8px; }
.stop-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.stop-color { width: 32px; height: 32px; padding: 0; border: 1px solid var(--c-border); border-radius: 7px; cursor: pointer; background: none; flex-shrink: 0; }
.stop-hex { width: 90px; height: 32px; padding: 0 8px; border: 1px solid var(--c-border); border-radius: 7px; background: var(--c-subtle); font-family: var(--font-mono); font-size: 13px; color: var(--c-t1); outline: none; transition: border-color 0.15s; flex-shrink: 0; }
.stop-hex:focus { border-color: var(--c-accent); }
.stop-remove { width: 26px; height: 26px; border-radius: 50%; border: none; background: var(--c-subtle); color: var(--c-t4); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; }
.stop-remove:hover:not(:disabled) { background: rgb(var(--c-error-rgb) / 0.15); color: var(--c-error); }
.stop-remove:disabled { opacity: 0.3; cursor: not-allowed; }

.presets-section { display: flex; flex-direction: column; gap: 10px; }
.presets-row { display: flex; gap: 8px; flex-wrap: wrap; }
.preset-chip { width: 40px; height: 40px; border-radius: 8px; border: 1px solid var(--c-border); cursor: pointer; padding: 0; transition: transform 0.1s, box-shadow 0.1s; }
.preset-chip:hover { transform: scale(1.08); box-shadow: 0 2px 8px rgba(0,0,0,0.25); }

.output-card .css-output { padding: 16px; margin: 0; font-family: var(--font-mono); font-size: 13px; color: var(--c-t2); white-space: pre-wrap; word-break: break-all; }

@media (max-width: 640px) {
  .grad-slider { flex-basis: 100%; order: 5; }
  .control-label { width: auto; }
}
</style>
