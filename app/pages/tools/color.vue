<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Color <span class="title-amp">Picker & Converter</span></h1>
        <p class="page-subtitle">Pick a color visually and convert between HEX, RGBA, HSLA and HSBA. Check WCAG contrast ratios.</p>
        <NuxtLink to="/guides/understanding-color-formats" class="guide-link">HEX, RGB, HSL — what's the difference? →</NuxtLink>
      </div>
    </div>

    <div class="picker-card editor-card">
      <div class="picker-layout">
        <div class="picker-col">
          <div ref="pickerEl" class="picker-sq" :style="pickerBg" @pointerdown="onPickerDown" @pointermove="onPickerMove" @pointerup="onPickerUp" @pointercancel="onPickerUp">
            <div class="picker-cursor" :style="cursorStyle" />
          </div>

          <div ref="hueEl" class="hue-strip" @pointerdown="onHueDown" @pointermove="onHueMove" @pointerup="onHueUp" @pointercancel="onHueUp">
            <div class="hue-thumb" :style="hueThumbStyle" />
          </div>

          <div ref="alphaEl" class="alpha-strip" @pointerdown="onAlphaDown" @pointermove="onAlphaMove" @pointerup="onAlphaUp" @pointercancel="onAlphaUp">
            <div class="alpha-gradient" :style="{ background: alphaGradientBg }" />
            <div class="alpha-thumb" :style="alphaThumbStyle" />
          </div>

          <div class="preview-row">
            <div class="preview-checker"><div class="preview-inner" :style="{ background: currentRgba }" /></div>
            <span class="preview-hex">{{ hexInput }}</span>
          </div>
        </div>

        <div class="values-col">
          <div class="value-row">
            <span class="fmt-label">HEX</span>
            <input v-model="hexInput" class="fmt-input" spellcheck="false" @blur="applyHex(hexInput)" @keydown.enter="applyHex(hexInput)" >
            <button class="copy-btn" :class="{ 'copy-btn--done': copied === 'hex' }" @click="doCopy(hexInput, 'hex')">{{ copied === 'hex' ? 'Copied!' : 'Copy' }}</button>
          </div>

          <div class="value-row">
            <span class="fmt-label">RGB</span>
            <input v-model="rgbInput" class="fmt-input" spellcheck="false" @blur="applyRgb(rgbInput)" @keydown.enter="applyRgb(rgbInput)" >
            <button class="copy-btn" :class="{ 'copy-btn--done': copied === 'rgb' }" @click="doCopy(rgbInput, 'rgb')">{{ copied === 'rgb' ? 'Copied!' : 'Copy' }}</button>
          </div>

          <div class="value-row">
            <span class="fmt-label">HSL</span>
            <input v-model="hslInput" class="fmt-input" spellcheck="false" @blur="applyHsl(hslInput)" @keydown.enter="applyHsl(hslInput)" >
            <button class="copy-btn" :class="{ 'copy-btn--done': copied === 'hsl' }" @click="doCopy(hslInput, 'hsl')">{{ copied === 'hsl' ? 'Copied!' : 'Copy' }}</button>
          </div>

          <div class="value-row">
            <span class="fmt-label">HSB</span>
            <input v-model="hsbInput" class="fmt-input" spellcheck="false" @blur="applyHsb(hsbInput)" @keydown.enter="applyHsb(hsbInput)" >
            <button class="copy-btn" :class="{ 'copy-btn--done': copied === 'hsb' }" @click="doCopy(hsbInput, 'hsb')">{{ copied === 'hsb' ? 'Copied!' : 'Copy' }}</button>
          </div>

          <div class="shades-wrap">
            <span class="shades-label">Shades</span>
            <div class="shades-row">
              <div v-for="shade in shades" :key="shade" class="shade" :style="{ background: shade }" :title="shade" @click="applyHex(shade)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="contrast-card editor-card">
      <div class="editor-card-header">
        <span class="editor-label">Contrast checker</span>
        <span class="hint">WCAG 2.1</span>
      </div>
      <div class="contrast-body">
        <div class="contrast-inputs">
          <div class="contrast-field">
            <label class="c-label">Foreground</label>
            <div class="c-input-row"><div class="c-dot" :style="{ background: contrastFg }" /><input v-model="contrastFg" class="c-hex-input" spellcheck="false" ></div>
          </div>
          <div class="contrast-field">
            <label class="c-label">Background</label>
            <div class="c-input-row"><div class="c-dot" :style="{ background: contrastBg }" /><input v-model="contrastBg" class="c-hex-input" spellcheck="false" ></div>
          </div>
          <button class="btn btn-ghost use-current-btn" title="Use current color (opaque) as background" @click="contrastBg = currentHex">Use current</button>
        </div>

        <div class="contrast-result" aria-live="polite">
          <div class="ratio-value">{{ contrastRatioVal }}:1</div>
          <div class="wcag-badges">
            <span :class="['wcag-badge', contrastRatioVal >= 3 ? 'pass' : 'fail']">AA Large {{ contrastRatioVal >= 3 ? '✓' : '✗' }}</span>
            <span :class="['wcag-badge', contrastRatioVal >= 4.5 ? 'pass' : 'fail']">AA Normal {{ contrastRatioVal >= 4.5 ? '✓' : '✗' }}</span>
            <span :class="['wcag-badge', contrastRatioVal >= 4.5 ? 'pass' : 'fail']">AAA Large {{ contrastRatioVal >= 4.5 ? '✓' : '✗' }}</span>
            <span :class="['wcag-badge', contrastRatioVal >= 7 ? 'pass' : 'fail']">AAA Normal {{ contrastRatioVal >= 7 ? '✓' : '✗' }}</span>
          </div>
          <div class="contrast-preview" :style="{ background: contrastBg, color: contrastFg }">The quick brown fox jumps over the lazy dog.</div>
        </div>
      </div>
    </div>

    <SeoSection :cards="cards" />
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '../../composables/useClipboard'

useToolSeo(
  'Color Picker & Converter: HEX, RGBA, HSL & Contrast Checker',
  'Visual color picker with alpha/transparency support and instant HEX ↔ RGBA ↔ HSLA ↔ HSBA conversion. Check WCAG contrast ratios (AA/AAA), generate color shades. Free, no signup.',
)

const {
  h, s, b, a,
  hexInput, rgbInput, hslInput, hsbInput,
  currentHex, currentRgba, alphaGradientBg, shades,
  applyHex, applyRgb, applyHsl, applyHsb,
  syncAllInputs,
} = useColorPicker()

const pickerEl = ref<HTMLElement | null>(null)
let draggingPicker = false

function onPickerDown(e: PointerEvent) {
  draggingPicker = true
  pickerEl.value!.setPointerCapture(e.pointerId)
  updateFromPicker(e)
}
function onPickerMove(e: PointerEvent) {
  if (!draggingPicker) return
  updateFromPicker(e)
}
function onPickerUp() { draggingPicker = false }

function updateFromPicker(e: PointerEvent) {
  const rect = pickerEl.value!.getBoundingClientRect()
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
  const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
  s.value = Math.round((x / rect.width) * 100)
  b.value = Math.round((1 - y / rect.height) * 100)
  syncAllInputs()
}

const hueEl = ref<HTMLElement | null>(null)
let draggingHue = false

function onHueDown(e: PointerEvent) {
  draggingHue = true
  hueEl.value!.setPointerCapture(e.pointerId)
  updateFromHue(e)
}
function onHueMove(e: PointerEvent) {
  if (!draggingHue) return
  updateFromHue(e)
}
function onHueUp() { draggingHue = false }

function updateFromHue(e: PointerEvent) {
  const rect = hueEl.value!.getBoundingClientRect()
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
  h.value = Math.round((x / rect.width) * 360)
  syncAllInputs()
}

const alphaEl = ref<HTMLElement | null>(null)
let draggingAlpha = false

function onAlphaDown(e: PointerEvent) {
  draggingAlpha = true
  alphaEl.value!.setPointerCapture(e.pointerId)
  updateFromAlpha(e)
}
function onAlphaMove(e: PointerEvent) {
  if (!draggingAlpha) return
  updateFromAlpha(e)
}
function onAlphaUp() { draggingAlpha = false }

function updateFromAlpha(e: PointerEvent) {
  const rect = alphaEl.value!.getBoundingClientRect()
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
  a.value = Math.round((x / rect.width) * 100)
  syncAllInputs()
}

const pickerBg = computed(() => ({
  background:
    'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1)), ' +
    'linear-gradient(to right, #fff, hsl(' + h.value + ', 100%, 50%))',
}))

const cursorStyle = computed(() => ({ left: s.value + '%', top: (100 - b.value) + '%' }))
const hueThumbStyle = computed(() => ({ left: (h.value / 360 * 100) + '%' }))
const alphaThumbStyle = computed(() => ({ left: a.value + '%' }))

const { isCopied, copy: copyKeyed } = useClipboard()
const copied = computed<string | null>(() =>
  (['hex', 'rgb', 'hsl', 'hsb'] as const).find(k => isCopied(k)) ?? null
)

function doCopy(text: string, key: string) {
  copyKeyed(key, text)
}

const contrastFg = ref('#ffffff')
const contrastBg = ref('#0A0912')

const contrastRatioVal = computed(() => calcContrastRatio(contrastFg.value, contrastBg.value))

const cards = [
  {
    title: 'HEX, RGBA, HSLA, HSBA: what is the difference?',
    text: 'Four notations for exactly the same set of colors, including transparency. Conversion between them is lossless.',
    table: [
      { label: 'HEX', value: '#RRGGBB, add two digits for alpha (#RRGGBBAA)' },
      { label: 'RGBA', value: 'Red, Green, Blue 0-255, alpha 0 (transparent) to 1 (opaque)' },
      { label: 'HSLA', value: 'Hue, Saturation, Lightness, alpha — matches human intuition' },
      { label: 'HSBA', value: 'Hue, Saturation, Brightness, alpha — same idea as HSLA' },
    ],
  },
  {
    title: 'How does WCAG contrast work?',
    text: 'WCAG 2.1 defines contrast ratio as (L1+0.05)/(L2+0.05), from L1 and L2, the relative luminances of the two colors. 1:1 is identical colors, 21:1 is maximum (black on white). Only fully opaque colors are defined — the checker always uses the opaque version of your current color.',
    table: [
      { label: 'Normal AA', value: '4.5:1 — text below 18pt / 14pt bold' },
      { label: 'Normal AAA', value: '7:1' },
      { label: 'Large AA', value: '3:1 — text at or above 18pt / 14pt bold' },
      { label: 'Large AAA', value: '4.5:1' },
    ],
  },
  {
    title: 'How to use the color picker',
    text: [
      'Drag inside the square to adjust saturation (left-right) and brightness (top-bottom). Drag the rainbow strip to change hue. Drag the checkerboard strip below it to set opacity: fully right is 100% opaque, fully left is fully transparent.',
      'All format fields (HEX, RGB, HSL, HSB) update instantly and are editable; type a value with or without an alpha component and press Enter to apply. Click any shade swatch to jump to that tone. In the contrast checker, "Use current" loads the opaque version of your color as background.',
    ],
  },
]
</script>

<style scoped>
.editor-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden; }
.editor-card-header { padding: 12px 16px; border-bottom: 1px solid var(--c-border-s); display: flex; align-items: center; justify-content: space-between; }
.editor-label { font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--c-t4); }

.picker-layout { display: grid; grid-template-columns: 260px 1fr; gap: 24px; padding: 16px; }

.picker-sq { width: 100%; aspect-ratio: 1; border-radius: 8px; position: relative; cursor: crosshair; user-select: none; touch-action: none; border: 1px solid var(--c-border); }
.picker-cursor { position: absolute; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1.5px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.35); pointer-events: none; transform: translate(-50%, -50%); }

.hue-strip { height: 14px; border-radius: 7px; background: linear-gradient(to right, #f00, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00); position: relative; margin-top: 12px; cursor: crosshair; touch-action: none; user-select: none; border: 1px solid var(--c-border); }
.hue-thumb { position: absolute; top: 50%; width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 2px solid rgba(0,0,0,0.15); box-shadow: 0 1px 5px rgba(0,0,0,0.3); transform: translate(-50%, -50%); pointer-events: none; }

.alpha-strip { height: 14px; border-radius: 7px; position: relative; margin-top: 8px; cursor: crosshair; touch-action: none; user-select: none; border: 1px solid var(--c-border); background-color: #fff; background-image: linear-gradient(45deg, #bbb 25%, transparent 25%), linear-gradient(-45deg, #bbb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #bbb 75%), linear-gradient(-45deg, transparent 75%, #bbb 75%); background-size: 8px 8px; background-position: 0 0, 0 4px, 4px -4px, -4px 0; }
.alpha-gradient { position: absolute; inset: 0; border-radius: 6px; pointer-events: none; }
.alpha-thumb { position: absolute; top: 50%; width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 2px solid rgba(0,0,0,0.15); box-shadow: 0 1px 5px rgba(0,0,0,0.3); transform: translate(-50%, -50%); pointer-events: none; }

.preview-row { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
.preview-checker { width: 36px; height: 36px; border-radius: 6px; border: 1px solid var(--c-border); flex-shrink: 0; overflow: hidden; background-color: #fff; background-image: linear-gradient(45deg, #bbb 25%, transparent 25%), linear-gradient(-45deg, #bbb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #bbb 75%), linear-gradient(-45deg, transparent 75%, #bbb 75%); background-size: 8px 8px; background-position: 0 0, 0 4px, 4px -4px, -4px 0; }
.preview-inner { width: 100%; height: 100%; }
.preview-hex { font-family: var(--font-mono); font-size: 13px; color: var(--c-t2); }

.values-col { display: flex; flex-direction: column; gap: 10px; justify-content: flex-start; }
.value-row { display: flex; align-items: center; gap: 8px; }
.fmt-label { font-family: var(--font-body); font-size: 11px; font-weight: 700; color: var(--c-t4); width: 32px; flex-shrink: 0; letter-spacing: 0.04em; }
.fmt-input { flex: 1; height: 34px; padding: 0 10px; border: 1px solid var(--c-border); border-radius: 7px; background: var(--c-subtle); font-family: var(--font-mono); font-size: 13px; color: var(--c-t1); outline: none; transition: border-color 0.15s; }
.fmt-input:focus { border-color: var(--c-accent); }

.copy-btn { display: flex; align-items: center; gap: 5px; font-family: var(--font-body); font-size: 12px; font-weight: 500; padding: 4px 10px; border: 1px solid var(--c-border); border-radius: 7px; background: var(--c-subtle); color: var(--c-t3); cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: background 0.1s, color 0.1s, border-color 0.1s; }
.copy-btn:hover { background: var(--c-faint); color: var(--c-t1); }
.copy-btn--done { background: rgb(var(--c-valid-rgb) / 0.12); border-color: rgb(var(--c-valid-rgb) / 0.35); color: var(--c-valid); }

.shades-wrap { margin-top: 8px; }
.shades-label { font-family: var(--font-body); font-size: 11px; font-weight: 700; color: var(--c-t4); letter-spacing: 0.04em; display: block; margin-bottom: 8px; }
.shades-row { display: flex; gap: 5px; }
.shade { flex: 1; height: 28px; border-radius: 5px; cursor: pointer; transition: transform 0.1s, box-shadow 0.1s; border: 1px solid rgba(0,0,0,0.15); }
.shade:hover { transform: scaleY(1.15); box-shadow: 0 2px 6px rgba(0,0,0,0.18); }

.contrast-body { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
.contrast-inputs { display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
.contrast-field { display: flex; flex-direction: column; gap: 6px; }
.c-label { font-family: var(--font-body); font-size: 11px; font-weight: 700; color: var(--c-t4); letter-spacing: 0.04em; }
.c-input-row { display: flex; align-items: center; gap: 8px; }
.c-dot { width: 28px; height: 28px; border-radius: 5px; border: 1px solid var(--c-border); flex-shrink: 0; }
.c-hex-input { height: 34px; width: 130px; padding: 0 10px; border: 1px solid var(--c-border); border-radius: 7px; background: var(--c-subtle); font-family: var(--font-mono); font-size: 13px; color: var(--c-t1); outline: none; transition: border-color 0.15s; }
.c-hex-input:focus { border-color: var(--c-accent); }
.use-current-btn { height: 34px; font-family: var(--font-body); font-size: 12px; padding: 0 12px; white-space: nowrap; }

.contrast-result { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.ratio-value { font-family: var(--font-mono); font-size: 22px; font-weight: 700; color: var(--c-t1); flex-shrink: 0; }
.wcag-badges { display: flex; gap: 6px; flex-wrap: wrap; }
.wcag-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-family: var(--font-body); font-size: 11px; font-weight: 600; white-space: nowrap; }
.wcag-badge.pass { background: rgb(var(--c-valid-rgb) / 0.12); color: var(--c-valid); }
.wcag-badge.fail { background: rgb(var(--c-error-rgb) / 0.12); color: var(--c-error); }

.contrast-preview { flex: 1; min-width: 200px; padding: 12px 16px; border-radius: 8px; font-family: var(--font-body); font-size: 14px; font-weight: 500; border: 1px solid var(--c-border); }

@media (max-width: 640px) {
  .picker-layout { grid-template-columns: 1fr; }
  .picker-col { max-width: 100%; }
  .contrast-result { flex-direction: column; align-items: flex-start; }
  .contrast-preview { min-width: unset; width: 100%; }
}
</style>
