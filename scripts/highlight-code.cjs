#!/usr/bin/env node
// Bakes Shiki syntax highlighting into guide code blocks at authoring time.
// Build-time only, on purpose: this site prerenders guides but navigates
// between them client-side (no full page reload), so a component that ran
// Shiki live would have to ship the highlighter in the client bundle just so
// it can re-run on the next client-side guide visit. Baking colored spans
// straight into the .vue source avoids that entirely — zero highlighting JS
// ever reaches the browser, same principle as generate-og.cjs.
//
// Usage: node scripts/highlight-code.cjs <guide-slug> [<guide-slug> ...]
//
// Mark a block to highlight with data-lang right after class="code-block",
// on either wrapper this codebase uses:
//   <pre class="code-block" data-lang="yaml"><code>...raw code...</code></pre>
//   <div class="code-block" data-lang="yaml"><code>...raw code...</code></div>
// The <div> form may carry a <span class="code-header">label</span> before
// <code> (preserved as-is) and/or other attributes after data-lang (e.g.
// style="...", also preserved) — data-lang must come first so both forms
// stay easy to match. Re-run safely any time — already-highlighted blocks
// (class="shiki-code" on the <code>) are left alone.

const fs = require('fs')
const path = require('path')
const { codeToHtml } = require('shiki')

const BODY_DIR = path.join(__dirname, '../app/components/guides/body')
// github-dark is tuned for a neutral gray background; this site's dark mode
// background is a strong violet-black (--c-bg: #0A0912), which washed out its
// green/blue. Dracula's own background (#282A36) is in the same purple-black
// family, so its palette was calibrated against a comparable backdrop — and
// its pink (#FF79C6) happens to closely match the site's own accent pink
// (--c-accent: #FF3D8F), for free brand coherence.
const THEMES = { light: 'github-light', dark: 'dracula' }

// Blocks are still HTML-encoded in the source (&amp;, &lt;, &gt;...) since
// they render as literal template markup — decode back to real source text
// before handing it to Shiki, which re-encodes correctly on the way out.
function decodeEntities(html) {
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .replace(/&amp;/g, '&')
}

const PRE_RE = /<pre class="code-block" data-lang="([a-z]+)"><code>([\s\S]*?)<\/code><\/pre>/g
const DIV_RE = /<div class="code-block" data-lang="([a-z]+)"([^>]*)>(\s*<span class="code-header">[^<]*<\/span>\s*)?<code>([\s\S]*?)<\/code>\s*<\/div>/g

async function processFile(slug) {
  const filePath = path.join(BODY_DIR, `${slug}.vue`)
  if (!fs.existsSync(filePath)) {
    console.error(`✗ ${slug}.vue not found in ${BODY_DIR}`)
    return
  }

  let content = fs.readFileSync(filePath, 'utf8')
  let count = 0

  for (const m of [...content.matchAll(PRE_RE)]) {
    const [full, lang, rawInner] = m
    const code = decodeEntities(rawInner)
    const html = await codeToHtml(code, { lang, themes: THEMES })
    const inner = html.match(/<code>([\s\S]*)<\/code>/)[1]
    const replacement = `<pre class="code-block" data-lang="${lang}"><code class="shiki-code">${inner}</code></pre>`
    content = content.replace(full, replacement)
    count++
  }

  for (const m of [...content.matchAll(DIV_RE)]) {
    const [full, lang, restAttrs, header, rawInner] = m
    const code = decodeEntities(rawInner)
    const html = await codeToHtml(code, { lang, themes: THEMES })
    const inner = html.match(/<code>([\s\S]*)<\/code>/)[1]
    const replacement = `<div class="code-block" data-lang="${lang}"${restAttrs}>${header ?? ''}<code class="shiki-code">${inner}</code></div>`
    content = content.replace(full, replacement)
    count++
  }

  if (count === 0) {
    console.log(`${slug}.vue: no un-highlighted data-lang blocks found`)
    return
  }

  fs.writeFileSync(filePath, content)
  console.log(`✓ ${slug}.vue: ${count} block(s) highlighted`)
}

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node scripts/highlight-code.cjs <guide-slug> [<guide-slug> ...]')
  process.exit(1)
}

;(async () => {
  for (const slug of args) {
    await processFile(slug)
  }
})()
