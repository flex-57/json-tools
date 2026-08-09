<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">CSS <span class="title-amp">Box-Shadow</span> Generator</h1>
        <p class="page-subtitle">Build single or layered box-shadow values visually, then copy the CSS. Free, no signup, no data sent to servers.</p>
      </div>
    </div>

    <div class="editor-card">
      <div class="preview-box" :style="{ background: bgColor }">
        <div class="preview-swatch" :style="{ boxShadow: css }" />
      </div>

      <div class="controls-body">
        <div class="control-row">
          <span class="control-label">Preview bg</span>
          <input v-model="bgColor" type="color" class="stop-color" aria-label="Preview background color" >
          <input v-model="bgColor" type="text" class="stop-hex" spellcheck="false" aria-label="Preview background hex" >
        </div>

        <div class="layers-section">
          <div class="layers-header">
            <span class="editor-label">Shadow layers</span>
            <button class="btn-xs" @click="addLayer">+ Add layer</button>
          </div>
          <div class="layers-list">
            <div v-for="layer in layers" :key="layer.id" class="layer-row">
              <label class="inset-toggle"><input v-model="layer.inset" type="checkbox" >inset</label>
              <div class="field-group"><label>X</label><input v-model.number="layer.offsetX" type="number" class="shadow-num" ></div>
              <div class="field-group"><label>Y</label><input v-model.number="layer.offsetY" type="number" class="shadow-num" ></div>
              <div class="field-group"><label>Blur</label><input v-model.number="layer.blur" type="number" min="0" class="shadow-num" ></div>
              <div class="field-group"><label>Spread</label><input v-model.number="layer.spread" type="number" class="shadow-num" ></div>
              <input v-model="layer.color" type="color" class="stop-color" aria-label="Shadow color" >
              <input v-model="layer.color" type="text" class="stop-hex" spellcheck="false" aria-label="Shadow color value" >
              <button class="stop-remove" :disabled="layers.length <= 1" aria-label="Remove shadow layer" @click="removeLayer(layer.id)">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="presets-section">
          <span class="editor-label">Presets</span>
          <div class="presets-row">
            <button
              v-for="p in SHADOW_PRESETS" :key="p.name" class="preset-chip"
              :title="p.name" :aria-label="`Use ${p.name} preset`" @click="applyPreset(p)"
            >{{ p.name }}</button>
          </div>
        </div>
      </div>
    </div>

    <div class="editor-card import-card">
      <div class="editor-card-header">
        <span class="editor-label">Import an existing value</span>
        <button class="btn-xs" :disabled="!importText.trim()" @click="doImport">Import</button>
      </div>
      <textarea v-model="importText" class="import-textarea" placeholder="Paste a box-shadow value, e.g. 0 4px 12px rgba(0,0,0,.15), inset 0 0 2px #fff" spellcheck="false" rows="2" />
      <div v-if="importError" class="import-error">{{ importError }}</div>
    </div>

    <div class="editor-card output-card">
      <div class="editor-card-header">
        <span class="editor-label">CSS</span>
        <button class="btn-copy" :class="{ 'btn-copy--done': copied }" @click="copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
      </div>
      <pre class="css-output" aria-live="polite">{{ declaration }}</pre>
    </div>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['box-shadow']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useBoxShadowGenerator, SHADOW_PRESETS } from '~/composables/useBoxShadowGenerator'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'CSS Box-Shadow Generator: Layered Shadows Online',
  'Build single or layered CSS box-shadow values visually with a live preview. Import an existing value, stack multiple shadows, and copy the generated CSS. Free, 100% client-side.',
  TOOL_FAQS['box-shadow'],
)

const { layers, bgColor, css, declaration, addLayer, removeLayer, applyPreset, importError, importCss, copied, copy } = useBoxShadowGenerator()

const importText = ref('')
function doImport() {
  if (!importText.value.trim()) return
  importCss(importText.value)
}

const seoCards = [
  {
    title: 'The box-shadow syntax',
    text: 'A box-shadow value is offset-x, offset-y, blur-radius, spread-radius, and a color, with an optional inset keyword to draw the shadow inside the element instead of outside it.',
    table: [
      { label: 'offset-x / offset-y', value: 'Horizontal / vertical distance — negative values shift left / up' },
      { label: 'blur-radius', value: 'Higher values spread the shadow into a softer edge; 0 is a hard-edged shadow' },
      { label: 'spread-radius', value: 'Grows (positive) or shrinks (negative) the shadow shape before blurring' },
      { label: 'inset', value: 'Draws the shadow inside the element\'s border box instead of outside it' },
    ],
  },
  {
    title: 'Layering multiple shadows',
    text: [
      'box-shadow accepts a comma-separated list: each layer paints independently, in the order written, with the first shadow on top. A common pattern for realistic depth is two layers, a tight, low-opacity shadow close to the element plus a larger, softer one further out, rather than a single large blur.',
      'Layering an inset shadow with a regular one is also how many "pressed button" or "carved" effects are built: the inset layer darkens the inner edge while the outer layer keeps the element grounded.',
    ],
  },
  {
    title: 'Performance note',
    text: 'A large blur-radius forces the browser to repaint a bigger area on every frame, which matters for shadows on elements that animate or scroll. If a hover-triggered shadow causes visible jank, try animating opacity on a pseudo-element with the shadow instead of the blur radius itself.',
  },
]
</script>

<style scoped>
.editor-card { margin-top: 14px; }
.preview-box { height: 220px; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--c-border); }
.preview-swatch { width: 140px; height: 100px; border-radius: 12px; background: var(--c-card); }

.controls-body { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
.control-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.control-label { font-family: var(--font-body); font-size: 12px; font-weight: 600; color: var(--c-t3); width: 80px; flex-shrink: 0; }

.layers-section { display: flex; flex-direction: column; gap: 10px; }
.layers-header { display: flex; align-items: center; justify-content: space-between; }
.layers-list { display: flex; flex-direction: column; gap: 8px; }
.layer-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 8px; border: 1px solid var(--c-border-s); border-radius: 8px; }

.inset-toggle { display: flex; align-items: center; gap: 5px; font-family: var(--font-body); font-size: 11.5px; color: var(--c-t3); cursor: pointer; flex-shrink: 0; }
.inset-toggle input { accent-color: var(--c-accent); cursor: pointer; }

.field-group { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
.field-group label { font-family: var(--font-mono); font-size: 10.5px; color: var(--c-t5); }
.shadow-num { width: 56px; height: 30px; padding: 0 6px; border: 1px solid var(--c-border); border-radius: 6px; background: var(--c-subtle); font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t1); text-align: center; outline: none; transition: border-color 0.15s; }
.shadow-num:focus { border-color: var(--c-accent); }

.stop-color { width: 30px; height: 30px; padding: 0; border: 1px solid var(--c-border); border-radius: 7px; cursor: pointer; background: none; flex-shrink: 0; }
.stop-hex { width: 100px; height: 30px; padding: 0 8px; border: 1px solid var(--c-border); border-radius: 7px; background: var(--c-subtle); font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t1); outline: none; transition: border-color 0.15s; flex-shrink: 0; }
.stop-hex:focus { border-color: var(--c-accent); }
.stop-remove { width: 26px; height: 26px; border-radius: 50%; border: none; background: var(--c-subtle); color: var(--c-t4); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; margin-left: auto; }
.stop-remove:hover:not(:disabled) { background: rgb(var(--c-error-rgb) / 0.15); color: var(--c-error); }
.stop-remove:disabled { opacity: 0.3; cursor: not-allowed; }

.presets-section { display: flex; flex-direction: column; gap: 10px; }
.presets-row { display: flex; gap: 8px; flex-wrap: wrap; }
.preset-chip { padding: 6px 12px; border-radius: 8px; border: 1px solid var(--c-border); background: var(--c-subtle); color: var(--c-t2); font-family: var(--font-body); font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
.preset-chip:hover { border-color: var(--c-accent); color: var(--c-t1); }

.import-card { margin-top: 14px; }
.import-textarea { width: 100%; padding: 12px 16px; font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); background: transparent; border: none; outline: none; resize: vertical; line-height: 1.6; }
.import-textarea::placeholder { color: var(--c-t5); }
.import-error { padding: 0 16px 12px; font-family: var(--font-body); font-size: 12px; color: var(--c-error); }

.output-card { margin-top: 14px; }
.output-card .css-output { padding: 16px; margin: 0; font-family: var(--font-mono); font-size: 13px; color: var(--c-t2); white-space: pre-wrap; word-break: break-all; }

@media (max-width: 640px) {
  .layer-row { justify-content: flex-start; }
  .stop-remove { margin-left: 0; }
}
</style>
