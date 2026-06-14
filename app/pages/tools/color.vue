<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Color <span class="title-amp">Picker & Converter</span></h1>
        <p class="page-subtitle">Pick a color visually and convert between HEX, RGBA, HSLA and HSBA. Check WCAG contrast ratios.</p>
      </div>
    </div>

    <!-- Picker + values -->
    <div class="picker-card editor-card">
      <div class="picker-layout">

        <!-- Left: visual picker -->
        <div class="picker-col">
          <div
            class="picker-sq"
            ref="pickerEl"
            :style="pickerBg"
            @pointerdown="onPickerDown"
            @pointermove="onPickerMove"
            @pointerup="onPickerUp"
            @pointercancel="onPickerUp"
          >
            <div class="picker-cursor" :style="cursorStyle" />
          </div>

          <div
            class="hue-strip"
            ref="hueEl"
            @pointerdown="onHueDown"
            @pointermove="onHueMove"
            @pointerup="onHueUp"
            @pointercancel="onHueUp"
          >
            <div class="hue-thumb" :style="hueThumbStyle" />
          </div>

          <div
            class="alpha-strip"
            ref="alphaEl"
            @pointerdown="onAlphaDown"
            @pointermove="onAlphaMove"
            @pointerup="onAlphaUp"
            @pointercancel="onAlphaUp"
          >
            <div class="alpha-gradient" :style="{ background: alphaGradientBg }" />
            <div class="alpha-thumb" :style="alphaThumbStyle" />
          </div>

          <div class="preview-row">
            <div class="preview-checker">
              <div class="preview-inner" :style="{ background: currentRgba }" />
            </div>
            <span class="preview-hex">{{ hexInput }}</span>
          </div>
        </div>

        <!-- Right: format values + shades -->
        <div class="values-col">
          <div class="value-row">
            <span class="fmt-label">HEX</span>
            <input
              v-model="hexInput"
              class="fmt-input"
              spellcheck="false"
              @blur="applyHex(hexInput)"
              @keydown.enter="applyHex(hexInput)"
            />
            <button class="copy-btn" :class="{ 'copy-btn--done': copied === 'hex' }" @click="doCopy(hexInput, 'hex')">
              <svg v-if="copied !== 'hex'" width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              <svg v-else width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{ copied === 'hex' ? 'Copied!' : 'Copy' }}
            </button>
          </div>

          <div class="value-row">
            <span class="fmt-label">RGB</span>
            <input
              v-model="rgbInput"
              class="fmt-input"
              spellcheck="false"
              @blur="applyRgb(rgbInput)"
              @keydown.enter="applyRgb(rgbInput)"
            />
            <button class="copy-btn" :class="{ 'copy-btn--done': copied === 'rgb' }" @click="doCopy(rgbInput, 'rgb')">
              <svg v-if="copied !== 'rgb'" width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              <svg v-else width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{ copied === 'rgb' ? 'Copied!' : 'Copy' }}
            </button>
          </div>

          <div class="value-row">
            <span class="fmt-label">HSL</span>
            <input
              v-model="hslInput"
              class="fmt-input"
              spellcheck="false"
              @blur="applyHsl(hslInput)"
              @keydown.enter="applyHsl(hslInput)"
            />
            <button class="copy-btn" :class="{ 'copy-btn--done': copied === 'hsl' }" @click="doCopy(hslInput, 'hsl')">
              <svg v-if="copied !== 'hsl'" width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              <svg v-else width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{ copied === 'hsl' ? 'Copied!' : 'Copy' }}
            </button>
          </div>

          <div class="value-row">
            <span class="fmt-label">HSB</span>
            <input
              v-model="hsbInput"
              class="fmt-input"
              spellcheck="false"
              @blur="applyHsb(hsbInput)"
              @keydown.enter="applyHsb(hsbInput)"
            />
            <button class="copy-btn" :class="{ 'copy-btn--done': copied === 'hsb' }" @click="doCopy(hsbInput, 'hsb')">
              <svg v-if="copied !== 'hsb'" width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="1.5" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M1.5 4.5v7a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              <svg v-else width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{ copied === 'hsb' ? 'Copied!' : 'Copy' }}
            </button>
          </div>

          <div class="shades-wrap">
            <span class="shades-label">Shades</span>
            <div class="shades-row">
              <div
                v-for="shade in shades"
                :key="shade"
                class="shade"
                :style="{ background: shade }"
                :title="shade"
                @click="applyHex(shade)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contrast checker -->
    <div class="contrast-card editor-card">
      <div class="editor-card-header">
        <span class="editor-label">Contrast checker</span>
        <span class="editor-hint">WCAG 2.1</span>
      </div>
      <div class="contrast-body">
        <div class="contrast-inputs">
          <div class="contrast-field">
            <label class="c-label">Foreground</label>
            <div class="c-input-row">
              <div class="c-dot" :style="{ background: contrastFg }" />
              <input v-model="contrastFg" class="c-hex-input" spellcheck="false" />
            </div>
          </div>
          <div class="contrast-field">
            <label class="c-label">Background</label>
            <div class="c-input-row">
              <div class="c-dot" :style="{ background: contrastBg }" />
              <input v-model="contrastBg" class="c-hex-input" spellcheck="false" />
            </div>
          </div>
          <button class="btn btn-ghost use-current-btn" @click="contrastBg = currentHex" title="Use current color (opaque) as background">
            Use current
          </button>
        </div>

        <div class="contrast-result">
          <div class="ratio-value">{{ contrastRatioVal }}:1</div>
          <div class="wcag-badges">
            <span :class="['wcag-badge', contrastRatioVal >= 3 ? 'pass' : 'fail']">AA Large {{ contrastRatioVal >= 3 ? '✓' : '✗' }}</span>
            <span :class="['wcag-badge', contrastRatioVal >= 4.5 ? 'pass' : 'fail']">AA Normal {{ contrastRatioVal >= 4.5 ? '✓' : '✗' }}</span>
            <span :class="['wcag-badge', contrastRatioVal >= 4.5 ? 'pass' : 'fail']">AAA Large {{ contrastRatioVal >= 4.5 ? '✓' : '✗' }}</span>
            <span :class="['wcag-badge', contrastRatioVal >= 7 ? 'pass' : 'fail']">AAA Normal {{ contrastRatioVal >= 7 ? '✓' : '✗' }}</span>
          </div>
          <div class="contrast-preview" :style="{ background: contrastBg, color: contrastFg }">
            The quick brown fox jumps over the lazy dog.
          </div>
        </div>
      </div>
    </div>

    <SeoSection :cards="cards" />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Color Picker & Converter — HEX RGBA HSL Alpha | JSON Tools',
  description: 'Visual color picker with alpha/transparency support and instant HEX ↔ RGBA ↔ HSLA ↔ HSBA conversion. Check WCAG contrast ratios (AA/AAA), generate color shades. Free, no signup.',
  ogTitle: 'Color Picker & Converter — HEX RGBA HSL Alpha | JSON Tools',
  ogDescription: 'Visual color picker with alpha/transparency support and instant HEX ↔ RGBA ↔ HSLA ↔ HSBA conversion. Check WCAG contrast ratios (AA/AAA), generate color shades. Free, no signup.',
  twitterTitle: 'Color Picker & Converter — HEX RGBA HSL Alpha | JSON Tools',
  twitterDescription: 'Visual color picker with alpha/transparency support and instant HEX ↔ RGBA ↔ HSLA ↔ HSBA conversion. Check WCAG contrast ratios (AA/AAA), generate color shades. Free, no signup.',
  ogImage: 'https://jsontools.space/og/color.png',
  twitterImage: 'https://jsontools.space/og/color.png',
})

const {
  h, s, b, a,
  hexInput, rgbInput, hslInput, hsbInput,
  currentHex, currentRgba, alphaGradientBg, shades,
  applyHex, applyRgb, applyHsl, applyHsb,
  syncAllInputs,
} = useColorPicker()

/* ── Picker drag ──────────────────────────────────────────── */
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

/* ── Hue drag ─────────────────────────────────────────────── */
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

/* ── Alpha drag ───────────────────────────────────────────── */
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

/* ── Computed styles ──────────────────────────────────────── */
const pickerBg = computed(() => ({
  background:
    'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1)), ' +
    'linear-gradient(to right, #fff, hsl(' + h.value + ', 100%, 50%))',
}))

const cursorStyle = computed(() => ({
  left: s.value + '%',
  top: (100 - b.value) + '%',
}))

const hueThumbStyle = computed(() => ({
  left: (h.value / 360 * 100) + '%',
}))

const alphaThumbStyle = computed(() => ({
  left: a.value + '%',
}))

/* ── Copy ─────────────────────────────────────────────────── */
const copied = ref<string | null>(null)

async function doCopy(text: string, key: string) {
  await navigator.clipboard.writeText(text)
  copied.value = key
  setTimeout(() => { copied.value = null }, 1500)
}

/* ── Contrast checker ─────────────────────────────────────── */
const contrastFg = ref('#ffffff')
const contrastBg = ref('#1a1916')

const contrastRatioVal = computed(() => calcContrastRatio(contrastFg.value, contrastBg.value))

/* ── SEO cards ────────────────────────────────────────────── */
const cards = [
  {
    title: 'HEX, RGBA, HSLA, HSBA — what is the difference?',
    text: 'HEX is a 6-digit hexadecimal notation (#RRGGBB) widely used in HTML and CSS — add two more digits for alpha (#RRGGBBAA). RGBA (Red, Green, Blue, Alpha) expresses color as three 0–255 values plus an alpha channel from 0 (transparent) to 1 (opaque). HSLA (Hue, Saturation, Lightness, Alpha) and HSBA (Hue, Saturation, Brightness, Alpha) are cylindrical models that match human intuition, extended with an alpha component. All four families describe exactly the same set of colors including transparency — conversion is lossless.',
  },
  {
    title: 'How does WCAG contrast work?',
    text: 'The Web Content Accessibility Guidelines (WCAG 2.1) define contrast ratio as (L1+0.05)/(L2+0.05), where L1 and L2 are the relative luminances of the two colors (computed from gamma-corrected RGB). A ratio of 1:1 means identical colors; 21:1 is maximum (black on white). For normal-size text (below 18pt / 14pt bold), AA requires 4.5:1 and AAA requires 7:1. Large text has lower thresholds — 3:1 for AA and 4.5:1 for AAA. Note: WCAG 2.1 defines contrast only for fully opaque colors. The contrast checker always uses the opaque version of your current color.',
  },
  {
    title: 'How to use the color picker',
    text: 'Drag inside the square to adjust saturation (left–right) and brightness (top–bottom). Drag the rainbow strip to change hue. Drag the checkerboard strip below it to set opacity — fully right is 100% opaque, fully left is fully transparent. All format fields (HEX, RGB, HSL, HSB) update instantly and are editable; type a value with or without an alpha component and press Enter to apply. Click any shade swatch to jump to that tone. In the contrast checker, "Use current" loads the opaque version of your color as background.',
  },
]
</script>

<style scoped>
/* ── Layout ───────────────────────────────────────────────── */
.picker-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  padding: 16px;
}

/* ── Picker square ────────────────────────────────────────── */
.picker-sq {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  position: relative;
  cursor: crosshair;
  user-select: none;
  touch-action: none;
  border: 1px solid rgba(0,0,0,0.12);
}

.picker-cursor {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1.5px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.35);
  pointer-events: none;
  transform: translate(-50%, -50%);
}

/* ── Hue strip ────────────────────────────────────────────── */
.hue-strip {
  height: 14px;
  border-radius: 7px;
  background: linear-gradient(to right, #f00, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00);
  position: relative;
  margin-top: 12px;
  cursor: crosshair;
  touch-action: none;
  user-select: none;
  border: 1px solid rgba(0,0,0,0.08);
}

.hue-thumb {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid rgba(0,0,0,0.15);
  box-shadow: 0 1px 5px rgba(0,0,0,0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* ── Alpha strip ──────────────────────────────────────────── */
.alpha-strip {
  height: 14px;
  border-radius: 7px;
  position: relative;
  margin-top: 8px;
  cursor: crosshair;
  touch-action: none;
  user-select: none;
  border: 1px solid rgba(0,0,0,0.08);
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #bbb 25%, transparent 25%),
    linear-gradient(-45deg, #bbb 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #bbb 75%),
    linear-gradient(-45deg, transparent 75%, #bbb 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0;
}

.alpha-gradient {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  pointer-events: none;
}

.alpha-thumb {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid rgba(0,0,0,0.15);
  box-shadow: 0 1px 5px rgba(0,0,0,0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* ── Preview ──────────────────────────────────────────────── */
.preview-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.preview-checker {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid var(--c-border);
  flex-shrink: 0;
  overflow: hidden;
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #bbb 25%, transparent 25%),
    linear-gradient(-45deg, #bbb 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #bbb 75%),
    linear-gradient(-45deg, transparent 75%, #bbb 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0;
}

.preview-inner {
  width: 100%;
  height: 100%;
}

.preview-hex {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--c-t2);
}

/* ── Format rows ──────────────────────────────────────────── */
.values-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-start;
}

.value-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fmt-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--c-t4);
  width: 32px;
  flex-shrink: 0;
  letter-spacing: 0.04em;
}

.fmt-input {
  flex: 1;
  height: 34px;
  padding: 0 10px;
  border: 1px solid var(--c-border);
  border-radius: 7px;
  background: var(--c-subtle);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--c-t1);
  outline: none;
  transition: border-color 0.15s;
}
.fmt-input:focus { border-color: #E8874A; }

.copy-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-family: inherit;
  font-weight: 500;
  padding: 4px 10px;
  border: 1px solid var(--c-border);
  border-radius: 7px;
  background: var(--c-subtle);
  color: var(--c-t3);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.1s, color 0.1s, border-color 0.1s;
}
.copy-btn:hover { background: var(--c-border); color: var(--c-t1); }
.copy-btn--done { background: #ECFDF5; border-color: #6EE7B7; color: #059669; }

/* ── Shades ───────────────────────────────────────────────── */
.shades-wrap {
  margin-top: 8px;
}

.shades-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--c-t4);
  letter-spacing: 0.04em;
  display: block;
  margin-bottom: 8px;
}

.shades-row {
  display: flex;
  gap: 5px;
}

.shade {
  flex: 1;
  height: 28px;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  border: 1px solid rgba(0,0,0,0.06);
}
.shade:hover {
  transform: scaleY(1.15);
  box-shadow: 0 2px 6px rgba(0,0,0,0.18);
}

/* ── Contrast checker ─────────────────────────────────────── */
.contrast-card { }

.contrast-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contrast-inputs {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.contrast-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.c-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--c-t4);
  letter-spacing: 0.04em;
}

.c-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.c-dot {
  width: 28px;
  height: 28px;
  border-radius: 5px;
  border: 1px solid var(--c-border);
  flex-shrink: 0;
}

.c-hex-input {
  height: 34px;
  width: 130px;
  padding: 0 10px;
  border: 1px solid var(--c-border);
  border-radius: 7px;
  background: var(--c-subtle);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--c-t1);
  outline: none;
  transition: border-color 0.15s;
}
.c-hex-input:focus { border-color: #E8874A; }

.use-current-btn {
  height: 34px;
  font-size: 12px;
  padding: 0 12px;
  white-space: nowrap;
}

.contrast-result {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.ratio-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 700;
  color: var(--c-t1);
  flex-shrink: 0;
}

.wcag-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.wcag-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}
.wcag-badge.pass { background: #ECFDF5; color: #059669; }
.wcag-badge.fail { background: #FEF2F2; color: #DC2626; }

.contrast-preview {
  flex: 1;
  min-width: 200px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid var(--c-border);
}

/* ── Responsive ───────────────────────────────────────────── */
@media (max-width: 640px) {
  .picker-layout {
    grid-template-columns: 1fr;
  }

  .picker-col {
    max-width: 100%;
  }

  .contrast-result {
    flex-direction: column;
    align-items: flex-start;
  }

  .contrast-preview {
    min-width: unset;
    width: 100%;
  }
}
</style>
