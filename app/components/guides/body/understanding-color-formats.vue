<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        The same color can be written three common ways on the web — <strong>HEX</strong>, <strong>RGB</strong>,
        and <strong>HSL</strong> — and none of them is more "correct" than the others. They are different
        coordinate systems for the exact same point in color space: RGB matches how a screen actually produces
        light, HEX is just RGB written more compactly, and HSL matches how a person intuitively thinks about
        color ("a bit darker", "more saturated").
      </p>
    </section>

    <section class="guide-section">
      <h2>RGB — how the screen actually works</h2>
      <p>
        A screen pixel is three tiny lights: red, green, and blue. RGB gives each one a brightness from 0 to
        255 (one byte, 256 possible values per channel). Mixing all three at full strength produces white;
        all three at zero produces black:
      </p>
      <pre class="code-block"><code>rgb(255, 0, 0)     /* pure red */
rgb(255, 255, 255) /* white — all channels maxed */
rgb(0, 0, 0)       /* black — all channels off */</code></pre>
    </section>

    <section class="guide-section">
      <h2>HEX — RGB written in base 16</h2>
      <p>
        HEX is the same three 0–255 values, each written as a 2-digit hexadecimal number (00 to FF) and
        concatenated: <code>#RRGGBB</code>. See
        <NuxtLink to="/guides/understanding-number-bases" class="guide-inline-link">Understanding Number Bases</NuxtLink>
        for why hex maps cleanly to byte values.
      </p>
      <pre class="code-block"><code>#FF0000  →  rgb(255, 0, 0)   — FF = 255, 00 = 0
#FF3D8F  →  rgb(255, 61, 143)</code></pre>
      <p>
        A 3-digit shorthand exists for colors where each channel's two digits repeat: <code>#F0F</code>
        expands to <code>#FF00FF</code>, not <code>#F00F0F</code> — each shorthand digit is doubled, not padded.
      </p>
    </section>

    <section class="guide-section">
      <h2>HSL — the human-intuitive model</h2>
      <p>
        HSL describes the same color as a position on a color wheel instead of three light intensities:
      </p>
      <ul>
        <li><strong>Hue</strong> (0–360°) — the position on the color wheel: 0° is red, 120° is green, 240° is blue.</li>
        <li><strong>Saturation</strong> (0–100%) — how far from gray: 0% is a shade of gray, 100% is fully vivid.</li>
        <li><strong>Lightness</strong> (0–100%) — how far from black: 0% is always black, 100% is always white, regardless of hue.</li>
      </ul>
      <p>
        This is why HSL is easier to hand-edit than RGB: "make this 10% darker" is just lowering the lightness
        value by 10, with hue and saturation untouched. Doing the same thing in RGB means recomputing all
        three channels proportionally.
      </p>
      <table class="cheat-table">
        <thead><tr><th>Color</th><th>HEX</th><th>RGB</th><th>HSL</th></tr></thead>
        <tbody>
          <tr><td>Pure red</td><td><code>#FF0000</code></td><td><code>255, 0, 0</code></td><td><code>0°, 100%, 50%</code></td></tr>
          <tr><td>Brand pink</td><td><code>#FF3D8F</code></td><td><code>255, 61, 143</code></td><td><code>335°, 100%, 62%</code></td></tr>
          <tr><td>Mid gray</td><td><code>#808080</code></td><td><code>128, 128, 128</code></td><td><code>0°, 0%, 50%</code></td></tr>
        </tbody>
      </table>
    </section>

    <section class="guide-section">
      <h2>Transparency: RGBA, HSLA, 8-digit hex</h2>
      <p>
        Every format has a variant with a fourth alpha channel controlling opacity, from 0 (fully transparent)
        to 1 for RGBA/HSLA, or an extra hex byte (00 to FF) for 8-digit hex:
      </p>
      <pre class="code-block"><code>rgba(255, 61, 143, 0.5)   /* 50% opaque brand pink */
hsla(335, 100%, 62%, 0.5)
#FF3D8F80                 /* 80 in hex ≈ 50% (128/255) */</code></pre>
    </section>

    <section class="guide-section">
      <h2>WCAG contrast ratios</h2>
      <p>
        Beyond just picking colors, the <a href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html" target="_blank" rel="noopener">Web Content Accessibility Guidelines (WCAG 2.1)</a>
        define a minimum contrast ratio between text and its background so the text stays readable for people
        with low vision or color blindness. The ratio is computed from each color's relative luminance and
        ranges from 1:1 (identical colors) to 21:1 (pure black on pure white, the maximum possible):
      </p>
      <table class="cheat-table">
        <thead><tr><th>Level</th><th>Normal text</th><th>Large text (18pt+/14pt bold+)</th></tr></thead>
        <tbody>
          <tr><td>AA (minimum)</td><td>4.5 : 1</td><td>3 : 1</td></tr>
          <tr><td>AAA (enhanced)</td><td>7 : 1</td><td>4.5 : 1</td></tr>
        </tbody>
      </table>
      <p>
        For reference, <code>#767676</code> gray text on a white background sits right at 4.5:1 — the exact
        AA threshold for normal-size text. Anything lighter than that gray fails AA on white.
      </p>
      <p>This site's <NuxtLink to="/tools/color" class="guide-inline-link">Color Picker</NuxtLink> converts between HEX, RGB, and HSL live, and checks the WCAG contrast ratio between any two colors.</p>
    </section>

  </div>
</template>

<style scoped>
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 12px 0; }
.code-block code { font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
</style>
