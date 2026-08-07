<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        <strong>Minification</strong> shrinks source code for machines to run, not humans to read: it strips
        whitespace, comments, and redundant syntax, and in JavaScript's case renames local identifiers, without
        changing what the code actually does. It's a build-time step, applied right before deployment, never a
        replacement for readable source under version control.
      </p>
      <p>
        A real minifier parses the input into a syntax tree first, then transforms that tree, it doesn't run
        regex find-and-replace on raw text. That distinction is what makes it safe: every change it makes is one
        it can prove doesn't affect behavior, which a text-level whitespace stripper can't guarantee once a CSS
        <code>calc()</code> expression or a JS string literal happens to look like the syntax being stripped.
      </p>
    </section>

    <section class="guide-section">
      <h2>What each language's minifier actually removes</h2>
      <table class="cheat-table">
        <thead><tr><th/><th>Typical savings</th><th>What it does</th></tr></thead>
        <tbody>
          <tr><td>CSS</td><td>20-40%</td><td>Whitespace, comments, redundant units and values</td></tr>
          <tr><td>HTML</td><td>10-20%</td><td>Inter-tag whitespace, comments, redundant attributes</td></tr>
          <tr><td>JavaScript</td><td>30-60%</td><td>All of the above, plus variable renaming and dead-code removal</td></tr>
        </tbody>
      </table>
      <p>
        HTML minification is the smallest win of the three for a structural reason, not a tooling one: most of
        an HTML document is content, not syntax, so there's simply less to strip. A good HTML minifier still
        recurses into any embedded <code>&lt;style&gt;</code> and <code>&lt;script&gt;</code> blocks and runs
        the CSS/JS minifier on those too, rather than treating them as opaque text.
      </p>
    </section>

    <section class="guide-section">
      <h2>Why JavaScript shrinks the most</h2>
      <p>
        CSS and HTML minification is mostly subtractive, there isn't much left to rename since selectors and tag
        names carry meaning the browser depends on. JavaScript minification adds a second lever: local variable
        and function names are only meaningful to the developer reading them, not to the interpreter, so
        <code>function calculateTotalPrice(items)</code> can become <code>function a(b)</code> with zero change
        in behavior, as long as every reference is renamed consistently across the whole scope.
      </p>
      <p>
        A tree-based minifier goes further still: it can prove a branch is unreachable and delete it outright,
        or inline a constant at every place it's used. That combination, renaming plus structural deletion, is
        why JS routinely compresses 30-60% versus 20-40% for CSS.
      </p>
    </section>

    <section class="guide-section">
      <h2>Minification is not compression</h2>
      <p>
        The two are complementary and normally both run. Minification changes the source text itself before the
        file is ever sent. gzip or Brotli compression happens afterward at the HTTP layer, finding repeated byte
        patterns in whatever text it's handed, minified or not.
      </p>
      <p>
        Minifying first still matters even though the compressor finds repetition on its own: comments and long,
        unique identifier names are exactly the kind of high-entropy content general-purpose compression is
        worst at collapsing, removing them before compression gives the compressor a smaller, more repetitive
        input to work with.
      </p>
    </section>

    <section class="guide-section">
      <h2>Once you minify, you need a source map</h2>
      <p>
        A minified stack trace or breakpoint no longer corresponds to anything recognizable, the variable names
        are gone and the line numbers have shifted. A source map is a lookup table that lets browser DevTools
        translate a minified position back to the original file and line, and every major bundler (Vite,
        webpack, Rollup, esbuild) can emit one automatically as part of production minification.
      </p>
      <p>
        Use the <NuxtLink to="/tools/css-minifier" class="guide-inline-link">CSS</NuxtLink>,
        <NuxtLink to="/tools/html-minifier" class="guide-inline-link">HTML</NuxtLink>, and
        <NuxtLink to="/tools/js-minifier" class="guide-inline-link">JavaScript</NuxtLink> minifiers on this site
        for a quick one-off check on a snippet, but let your actual build pipeline handle minification (and its
        source map) for anything shipping to production.
      </p>
    </section>

  </div>
</template>
