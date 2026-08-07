<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        <strong>Open Graph</strong> is a protocol, originally launched by Facebook in 2010 and documented at
        <a href="https://ogp.me" target="_blank" rel="noopener">ogp.me</a>, for controlling how a URL looks when
        it's shared on a social platform: the title, description, and preview image shown in the card. Without
        it, a crawler is left guessing, usually falling back to the page's <code>&lt;title&gt;</code> tag and
        whatever image it finds first, which is rarely the one you'd actually pick.
      </p>
      <p>
        Open Graph tags are plain <code>&lt;meta&gt;</code> elements in the page's <code>&lt;head&gt;</code>,
        read by each platform's own crawler at share time, not by the browser rendering the page for a visitor.
      </p>
    </section>

    <section class="guide-section">
      <h2>The four required properties</h2>
      <pre class="code-block"><code>&lt;meta property="og:title" content="Page Title" /&gt;
&lt;meta property="og:type" content="website" /&gt;
&lt;meta property="og:image" content="https://example.com/og.png" /&gt;
&lt;meta property="og:url" content="https://example.com/page" /&gt;</code></pre>
      <p>
        Note the attribute: <code>property=</code>, not <code>name=</code>. Open Graph is built on RDFa, and
        RDFa metadata uses <code>property</code>, that's a real spec distinction, not a stylistic choice, even
        though a browser renders either attribute name identically since meta tags carry no visual behavior of
        their own. <code>og:description</code> and <code>og:site_name</code> aren't required but are what makes
        a card look complete rather than bare.
      </p>
    </section>

    <section class="guide-section">
      <h2>Twitter/X cards fall back to Open Graph</h2>
      <p>
        X's crawler reads <code>twitter:</code> tags first, which use the ordinary HTML <code>name=</code>
        attribute instead of <code>property=</code>, and falls back to the matching <code>og:</code> tag
        whenever a <code>twitter:</code> one is missing. <code>twitter:title</code> falls back to
        <code>og:title</code>, <code>twitter:image</code> to <code>og:image</code>, and so on. In practice this
        means writing the <code>og:</code> tags once covers Facebook, LinkedIn, Slack, Discord, and X together,
        the <code>twitter:card</code> value (with no Open Graph equivalent) is really the only tag that needs
        setting separately.
      </p>
      <table class="cheat-table">
        <thead><tr><th/><th>summary_large_image</th><th>summary</th></tr></thead>
        <tbody>
          <tr><td>Image</td><td>Full-width, 1.91:1</td><td>Small square thumbnail</td></tr>
          <tr><td>Layout</td><td>Image above text</td><td>Image beside text</td></tr>
          <tr><td>Looks like</td><td>Facebook / LinkedIn card</td><td>Older, compact link preview</td></tr>
        </tbody>
      </table>
    </section>

    <section class="guide-section">
      <h2>Why 1200×630, and why the cache trips people up</h2>
      <p>
        1.91:1 (1200×630 is the common concrete size) is the aspect ratio every major platform converged on for
        the large-image card, Facebook, X, LinkedIn, Slack, and Discord all crop or letterbox other ratios to
        fit it, so keep any text or logo away from the edges since different platforms crop differently.
      </p>
      <p>
        The other common surprise: link-sharing platforms cache the scraped Open Graph data aggressively,
        sometimes for days, so a page you already shared once won't pick up a new <code>og:image</code>
        automatically. Facebook's Sharing Debugger and LinkedIn's Post Inspector both have a "scrape again"
        action that forces the refetch, that's the actual fix, not waiting.
      </p>
      <p>
        Build and preview your tags with the
        <NuxtLink to="/tools/og-generator" class="guide-inline-link">Open Graph Meta Tag Generator</NuxtLink> on
        this site, it can also import an existing <code>&lt;meta&gt;</code> block to edit in place.
      </p>
    </section>

  </div>
</template>

<style scoped>
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 12px 0; }
.code-block code { font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
</style>
