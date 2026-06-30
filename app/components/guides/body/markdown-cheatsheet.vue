<template>
  <div class="guide-body">

    <!-- Intro -->
    <section class="guide-section">
      <p>
        This page is a quick reference for all standard Markdown syntax — from headings to task lists.
        Every example below is interactive: paste it directly into the
        <NuxtLink to="/tools/markdown-preview" class="inline-link">Markdown Preview</NuxtLink>
        to see the rendered output. New to Markdown?
        Start with <NuxtLink to="/guides/what-is-markdown" class="inline-link">What is Markdown?</NuxtLink>
        first.
      </p>
    </section>

    <!-- Headings -->
    <section class="guide-section">
      <h2>Headings</h2>
      <p>Use 1–6 hash characters followed by a space. The number of hashes sets the heading level.</p>
      <table class="cheat-table">
        <thead><tr><th>Markdown</th><th>Rendered as</th></tr></thead>
        <tbody>
          <tr><td><code># Heading 1</code></td><td><span class="rh rh-1">Heading 1</span></td></tr>
          <tr><td><code>## Heading 2</code></td><td><span class="rh rh-2">Heading 2</span></td></tr>
          <tr><td><code>### Heading 3</code></td><td><span class="rh rh-3">Heading 3</span></td></tr>
          <tr><td><code>#### Heading 4</code></td><td><span class="rh rh-4">Heading 4</span></td></tr>
        </tbody>
      </table>
    </section>

    <!-- Text formatting -->
    <section class="guide-section">
      <h2>Text formatting</h2>
      <table class="cheat-table">
        <thead><tr><th>Markdown</th><th>Result</th><th>Notes</th></tr></thead>
        <tbody>
          <tr v-for="r in FORMAT" :key="r[0]">
            <td><code>{{ r[0] }}</code></td>
            <td><span v-html="r[1]" /></td>
            <td class="ct-note">{{ r[2] }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Links and images -->
    <section class="guide-section">
      <h2>Links and images</h2>
      <table class="cheat-table">
        <thead><tr><th>Markdown</th><th>Result</th></tr></thead>
        <tbody>
          <tr v-for="r in LINKS" :key="r[0]">
            <td><code>{{ r[0] }}</code></td>
            <td><span v-html="r[1]" /></td>
          </tr>
        </tbody>
      </table>
      <p class="note-text">
        Reference-style links: define <code>[label]: url</code> anywhere in the document and use
        <code>[text][label]</code> inline. Useful when the same URL appears multiple times.
      </p>
    </section>

    <!-- Lists -->
    <section class="guide-section">
      <h2>Lists</h2>
      <div class="list-grid">
        <div v-for="l in LISTS" :key="l.title" class="list-card">
          <div class="list-card-title">{{ l.title }}</div>
          <pre class="list-card-src">{{ l.src }}</pre>
          <div class="list-card-sep">renders as</div>
          <div class="list-card-render" v-html="l.html" />
        </div>
      </div>
    </section>

    <!-- Code -->
    <section class="guide-section">
      <h2>Code</h2>
      <table class="cheat-table">
        <thead><tr><th>Markdown</th><th>Result</th></tr></thead>
        <tbody>
          <tr>
            <td><code>`inline code`</code></td>
            <td><code class="r-inline">inline code</code></td>
          </tr>
          <tr>
            <td><code>```js … ```</code></td>
            <td><span class="ct-note">Fenced block with syntax highlighting</span></td>
          </tr>
          <tr>
            <td><code>    4-space indent</code></td>
            <td><span class="ct-note">Also a code block (legacy style)</span></td>
          </tr>
        </tbody>
      </table>

      <div class="code-example">
        <div class="ce-label">Fenced block — specify the language after the opening backticks:</div>
        <pre class="ce-src">```javascript
const greet = (name) => `Hello, ${name}!`
console.log(greet('World'))
```</pre>
        <div class="ce-note">Supported languages: js, ts, python, php, go, rust, java, c, cpp, bash, sql, html, css, yaml, json, and more.</div>
      </div>
    </section>

    <!-- Tables -->
    <section class="guide-section">
      <h2>Tables</h2>
      <p>Separate columns with <code>|</code>. The second row must be a separator with at least three dashes per cell.</p>
      <div class="code-example">
        <pre class="ce-src">| Name   | Type   | Required |
|--------|--------|----------|
| id     | number | yes      |
| email  | string | yes      |
| avatar | string | no       |</pre>
      </div>
      <p>
        Add a colon to the separator to control alignment:
        <code>:---</code> left · <code>:---:</code> center · <code>---:</code> right.
      </p>
    </section>

    <!-- Blockquotes -->
    <section class="guide-section">
      <h2>Blockquotes and horizontal rules</h2>
      <table class="cheat-table">
        <thead><tr><th>Markdown</th><th>Renders as</th></tr></thead>
        <tbody>
          <tr>
            <td><code>&gt; A blockquote</code></td>
            <td><blockquote class="r-bq">A blockquote</blockquote></td>
          </tr>
          <tr>
            <td><code>&gt; Multi-line<br>&gt; blockquote</code></td>
            <td><blockquote class="r-bq">Multi-line<br>blockquote</blockquote></td>
          </tr>
          <tr>
            <td><code>---</code> or <code>***</code></td>
            <td><hr class="r-hr"></td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Escaping -->
    <section class="guide-section">
      <h2>Escaping special characters</h2>
      <p>Prefix any Markdown character with a backslash to render it literally:</p>
      <table class="cheat-table">
        <thead><tr><th>You type</th><th>You get</th></tr></thead>
        <tbody>
          <tr><td><code>\*not italic\*</code></td><td>*not italic*</td></tr>
          <tr><td><code>\# not a heading</code></td><td># not a heading</td></tr>
          <tr><td><code>\[not a link\]</code></td><td>[not a link]</td></tr>
          <tr><td><code>\`not code\`</code></td><td>`not code`</td></tr>
        </tbody>
      </table>
      <p class="note-text">Escapable characters: <code>\ ` * _ { } [ ] ( ) # + - . !</code></p>
    </section>

    <!-- Line breaks -->
    <section class="guide-section">
      <h2>Line breaks and paragraphs</h2>
      <div class="guide-steps">
        <div class="step">
          <div class="step-head">New paragraph</div>
          <p>Leave a blank line between two blocks of text. A single newline within a paragraph is treated as a space.</p>
        </div>
        <div class="step">
          <div class="step-head">Hard line break</div>
          <p>End a line with <strong>two or more spaces</strong>, then press Enter. Or use a backslash <code>\</code> at the end of the line (most modern parsers support this).</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
const FORMAT = [
  ['**bold**',              '<strong>bold</strong>',                                   'Also __bold__'],
  ['*italic*',              '<em>italic</em>',                                         'Also _italic_'],
  ['***bold italic***',     '<strong><em>bold italic</em></strong>',                   ''],
  ['~~strikethrough~~',     '<del>strikethrough</del>',                                'GFM extension'],
  ['`inline code`',         '<code class="r-inline">inline code</code>',              ''],
  ['==highlight==',         '<mark style="background:#F97316;color:#fff;padding:0 3px;border-radius:2px">highlight</mark>', 'Not all parsers'],
]

const LINKS = [
  ['[text](https://example.com)',       '<a style="color:#F97316">text</a>'],
  ['[text](url "tooltip")',             '<a style="color:#F97316" title="tooltip">text with tooltip</a>'],
  ['<https://example.com>',             '<a style="color:#F97316">https://example.com</a> (auto-link)'],
  ['![alt text](image.png)',            '<span style="color:var(--c-t4);font-style:italic">🖼 image (alt text)</span>'],
  ['[![alt](img.png)](url)',            '<span style="color:var(--c-t4);font-style:italic">🖼 clickable image</span>'],
]

const LISTS = [
  {
    title: 'Unordered',
    src: '- Apple\n- Banana\n- Cherry',
    html: '<ul style="margin:0;padding-left:18px;font-size:13px;color:var(--c-t2)"><li>Apple</li><li>Banana</li><li>Cherry</li></ul>',
  },
  {
    title: 'Ordered',
    src: '1. First\n2. Second\n3. Third',
    html: '<ol style="margin:0;padding-left:18px;font-size:13px;color:var(--c-t2)"><li>First</li><li>Second</li><li>Third</li></ol>',
  },
  {
    title: 'Task list (GFM)',
    src: '- [x] Done\n- [ ] Todo\n- [ ] Later',
    html: '<ul style="margin:0;padding-left:4px;list-style:none;font-size:13px;color:var(--c-t2)"><li>✅ Done</li><li>⬜ Todo</li><li>⬜ Later</li></ul>',
  },
  {
    title: 'Nested',
    src: '- Parent\n  - Child\n    - Grandchild',
    html: '<ul style="margin:0;padding-left:18px;font-size:13px;color:var(--c-t2)"><li>Parent<ul style="padding-left:16px"><li>Child<ul style="padding-left:16px"><li>Grandchild</li></ul></li></ul></li></ul>',
  },
]
</script>

<style scoped>
/* ── Inline link ───────────────────────────────────────────── */
.inline-link { color: #F97316; text-decoration: none; font-weight: 500; }
.inline-link:hover { text-decoration: underline; }

/* ── Cheat table ───────────────────────────────────────────── */
.cheat-table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0 4px;
  font-size: 13px;
}

.cheat-table thead tr { border-bottom: 1px solid var(--c-border); }

.cheat-table th {
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-t4);
  padding: 8px 12px;
}

.cheat-table td {
  padding: 9px 12px;
  color: var(--c-t2);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  vertical-align: middle;
}

.cheat-table td code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #60A5FA;
  background: rgba(96,165,250,0.08);
  padding: 1px 5px;
  border-radius: 4px;
  white-space: nowrap;
}

.ct-note { font-size: 12px !important; color: var(--c-t4) !important; }

/* ── Rendered heading sizes ────────────────────────────────── */
.rh { font-weight: 700; color: var(--c-t1); line-height: 1.2; }
.rh-1 { font-size: 1.4em; }
.rh-2 { font-size: 1.2em; }
.rh-3 { font-size: 1.05em; }
.rh-4 { font-size: 1em; }

/* ── Inline code render ────────────────────────────────────── */
.r-inline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85em;
  background: var(--c-card-alt);
  border: 1px solid var(--c-border-s);
  border-radius: 4px;
  padding: 1px 5px;
  color: #F97316;
}

/* ── Blockquote render ─────────────────────────────────────── */
.r-bq {
  border-left: 3px solid #F97316;
  padding: 4px 10px;
  background: var(--c-faint);
  border-radius: 0 5px 5px 0;
  color: var(--c-t3);
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
}

.r-hr {
  border: none;
  border-top: 1px solid var(--c-border);
  margin: 6px 0;
}

/* ── List cards ────────────────────────────────────────────── */
.list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
  margin: 16px 0;
}

.list-card {
  border: 1px solid var(--c-border);
  border-radius: 10px;
  overflow: hidden;
}

.list-card-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--c-t4);
  padding: 8px 12px;
  background: var(--c-faint);
  border-bottom: 1px solid var(--c-border-s);
}

.list-card-src {
  margin: 0;
  padding: 10px 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  color: var(--c-t2);
  background: transparent;
  border-bottom: 1px solid var(--c-border-s);
  white-space: pre;
  line-height: 1.6;
}

.list-card-sep {
  font-size: 10.5px;
  color: var(--c-t5);
  text-align: center;
  padding: 4px;
  background: var(--c-faint);
  border-bottom: 1px solid var(--c-border-s);
}

.list-card-render {
  padding: 10px 12px;
}

/* ── Code example block ────────────────────────────────────── */
.code-example {
  margin: 16px 0;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  overflow: hidden;
}

.ce-label {
  font-size: 12px;
  color: var(--c-t4);
  padding: 8px 14px;
  background: var(--c-faint);
  border-bottom: 1px solid var(--c-border-s);
}

.ce-src {
  margin: 0;
  padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  color: var(--c-t2);
  background: transparent;
  white-space: pre;
  line-height: 1.65;
  overflow-x: auto;
}

.ce-note {
  font-size: 12px;
  color: var(--c-t4);
  padding: 8px 14px;
  background: var(--c-faint);
  border-top: 1px solid var(--c-border-s);
}

/* ── Note text ─────────────────────────────────────────────── */
.note-text {
  font-size: 12.5px;
  color: var(--c-t4);
  margin-top: 10px;
}

.note-text code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #60A5FA;
  background: rgba(96,165,250,0.08);
  padding: 1px 5px;
  border-radius: 4px;
}

/* ── Steps ─────────────────────────────────────────────────── */
.guide-steps { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }

.step {
  padding: 16px 18px;
  background: var(--c-subtle);
  border: 1px solid var(--c-border);
  border-radius: 10px;
}

.step-head {
  font-size: 13px;
  font-weight: 700;
  color: var(--c-t1);
  margin-bottom: 8px;
}

.step p {
  font-size: 13px;
  color: var(--c-t3);
  line-height: 1.7;
  margin: 0;
}

.step code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #60A5FA;
  background: rgba(96,165,250,0.08);
  padding: 1px 5px;
  border-radius: 4px;
}

/* ── Responsive ────────────────────────────────────────────── */
@media (max-width: 600px) {
  .cheat-table th:nth-child(3), .cheat-table td:nth-child(3) { display: none; }
  .list-grid { grid-template-columns: 1fr; }
}
</style>
