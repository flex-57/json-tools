<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        <strong>SVG</strong> (Scalable Vector Graphics) describes images as XML markup, shapes, paths, and text
        defined by coordinates and math, instead of a grid of pixels. That's the whole difference from PNG or
        JPEG: a raster image is fixed resolution and blurs when scaled up, an SVG is resolution-independent and
        renders crisp at any size, from a 16px favicon to a full-bleed hero graphic.
      </p>
      <p>
        Because it's XML, an SVG is also just text: readable, diffable in version control, stylable with CSS,
        and scriptable with JavaScript the same way any other DOM node is. A raster image can't do any of that.
      </p>
    </section>

    <section class="guide-section">
      <h2>Anatomy of an SVG file</h2>
      <pre class="code-block"><code>&lt;svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"&gt;
  &lt;path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/&gt;
  &lt;circle cx="12" cy="17" r="3" stroke="currentColor" stroke-width="1.5"/&gt;
&lt;/svg&gt;</code></pre>
      <p>
        <code>viewBox="min-x min-y width height"</code> defines the internal coordinate system: it's what lets
        the SVG scale to fill whatever box CSS gives it, independent of any width/height attribute on the root
        element. <code>&lt;path d="..."&gt;</code> is the workhorse element, its <code>d</code> attribute is a
        compact command language (M = move to, L = line to, C = curve, Z = close path) that most shapes eventually
        compile down to, even ones drawn with <code>&lt;circle&gt;</code> or <code>&lt;rect&gt;</code> in the source file.
      </p>
    </section>

    <section class="guide-section">
      <h2>What SVGO actually optimizes</h2>
      <p>
        Files exported from Figma, Illustrator, or Sketch carry a lot that never affects rendering: editor
        namespaces, <code>&lt;metadata&gt;</code> blocks, XML comments, and coordinate precision far beyond what a
        screen can display (<code>12.847293847</code> instead of <code>12.85</code>). SVGO's default preset
        strips all of it while keeping the rendered output pixel-identical, which is typically a 30-60% size
        reduction on tool-exported icons.
      </p>
      <p>
        One thing worth knowing if you've used SVGO before: <strong>viewBox removal is not part of the default
        preset as of SVGO v4</strong> (this site's version). It used to be, in v2 and v3, which caused real
        problems, dropping viewBox while a fixed width/height stuck around meant the SVG stopped scaling to fill
        a responsive container. If you're troubleshooting an SVG that lost its viewBox somewhere in a build
        pipeline, that's almost always an older SVGO version or an explicit override, not this tool.
      </p>
      <p>
        Optimizing is not the same as sanitizing. SVG can carry a <code>&lt;script&gt;</code> element or
        <code>onload</code>/<code>onclick</code> handlers, and the default preset doesn't touch either, that's a
        file-size pass, not a security pass. The <NuxtLink to="/tools/svg-optimizer" class="guide-inline-link">SVG Optimizer</NuxtLink>
        on this site has a separate "strip scripts & event handlers" toggle for exactly this reason, on by default,
        worth keeping on unless you have a specific reason not to.
      </p>
    </section>

    <section class="guide-section">
      <h2>SVG in JSX</h2>
      <p>
        Pasting raw SVG markup into a React component almost works, and then fails on a handful of attributes:
        <code>class</code> is a reserved word in JSX (it becomes <code>className</code>), kebab-case attributes
        like <code>stroke-width</code> aren't valid JSX and need <code>strokeWidth</code>, and an inline
        <code>style="fill:red"</code> string has to become a JS object, <code>style=&#123;{ fill: 'red' }}</code>.
      </p>
      <p>
        The <NuxtLink to="/tools/svg-to-jsx" class="guide-inline-link">SVG to JSX</NuxtLink> converter on this
        site handles that rename pass automatically and can wrap the result in a named functional component.
        Vue and Svelte don't need an equivalent tool for this specific problem: SVG is already valid template
        syntax in both, so there's no attribute-renaming step to do.
      </p>
    </section>

  </div>
</template>

<style scoped>
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 12px 0; }
.code-block code { font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
</style>
