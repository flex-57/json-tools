<template>
  <div class="guide-body">

    <!-- Intro -->
    <section class="guide-section">
      <p>
        <strong>Markdown</strong> is a lightweight markup language created by John Gruber in 2004.
        The idea is simple: write plain text using a handful of punctuation conventions, and a processor
        converts it to clean HTML automatically. A hash at the start of a line becomes an <code>&lt;h1&gt;</code>,
        double asterisks become <code>&lt;strong&gt;</code>, and a hyphen list becomes <code>&lt;ul&gt;</code>.
      </p>
      <p>
        The original design goal was that the raw source should be readable as-is — you should not need
        to mentally parse HTML tags to understand what a Markdown document says.
      </p>
    </section>

    <!-- How it works -->
    <section class="guide-section">
      <h2>How it works</h2>
      <p>A Markdown processor reads your plain text and outputs HTML. Here is what that looks like in practice:</p>

      <div class="md-demo">
        <div class="md-demo-col">
          <div class="md-demo-label">Markdown source</div>
          <pre class="md-demo-code"># Getting Started

Write **bold** text, *italic*, or
`inline code` anywhere.

- Item one
- Item two

&gt; A blockquote stands out.

```js
const x = 42
```</pre>
        </div>
        <div class="md-demo-arrow">→</div>
        <div class="md-demo-col">
          <div class="md-demo-label">Rendered output</div>
          <div class="md-demo-render">
            <div class="mdr-h1">Getting Started</div>
            <p class="mdr-p">Write <strong>bold</strong> text, <em>italic</em>, or <code class="mdr-code">inline code</code> anywhere.</p>
            <ul class="mdr-list">
              <li>Item one</li>
              <li>Item two</li>
            </ul>
            <blockquote class="mdr-blockquote">A blockquote stands out.</blockquote>
            <div class="mdr-codeblock">const x = 42</div>
          </div>
        </div>
      </div>

      <p>
        The conversion happens client-side in your browser — no server, no round trip.
        <NuxtLink to="/tools/markdown-preview" class="inline-link">Try the Markdown Preview tool</NuxtLink>
        to see this in real time.
      </p>
    </section>

    <!-- Core syntax -->
    <section class="guide-section">
      <h2>Core syntax at a glance</h2>
      <p>
        Markdown covers the most common text formatting needs with just a few characters.
        For the full reference, see the
        <NuxtLink to="/guides/markdown-cheatsheet" class="inline-link">Markdown Cheatsheet</NuxtLink>.
      </p>

      <table class="cheat-table">
        <thead><tr><th>You type</th><th>You get</th><th>HTML output</th></tr></thead>
        <tbody>
          <tr v-for="r in SYNTAX" :key="r[0]">
            <td><code>{{ r[0] }}</code></td>
            <td><span v-html="r[1]" /></td>
            <td><code>{{ r[2] }}</code></td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Where it's used -->
    <section class="guide-section">
      <h2>Where Markdown is used</h2>
      <p>Markdown went from a simple Perl script to the default writing format across the developer world.</p>

      <div class="usage-grid">
        <div v-for="u in USAGES" :key="u.label" class="usage-card">
          <div class="usage-icon" v-html="u.icon" />
          <div>
            <div class="usage-label">{{ u.label }}</div>
            <div class="usage-examples">{{ u.examples }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Flavors -->
    <section class="guide-section">
      <h2>Markdown flavors</h2>
      <p>
        The original 2004 spec left many edge cases undefined, which led to dozens of incompatible
        implementations. <strong>CommonMark</strong> (2014) resolved this with a precise, unambiguous
        specification. It is now the de facto standard.
      </p>

      <div class="flavor-list">
        <div v-for="f in FLAVORS" :key="f.name" class="flavor-row">
          <div class="flavor-name">{{ f.name }}</div>
          <div class="flavor-desc">{{ f.desc }}</div>
        </div>
      </div>

      <p>
        This tool uses <strong>CommonMark</strong> via the <code>marked</code> library.
        GitHub Flavored Markdown (GFM) extensions — tables, task lists, strikethrough — are supported
        by most tools including GitHub, VS Code, and Notion.
      </p>
    </section>

    <!-- Markdown vs HTML -->
    <section class="guide-section">
      <h2>Markdown vs. HTML</h2>
      <div class="guide-steps">
        <div class="step">
          <div class="step-head">Use Markdown when…</div>
          <p>You are writing content meant to be read by humans: README files, documentation, blog posts, notes, messages. It is faster to type and easier to review in version control.</p>
        </div>
        <div class="step">
          <div class="step-head">Use HTML when…</div>
          <p>You need precise control over layout, custom attributes, or elements that Markdown has no shorthand for (forms, tables with colspan, embedded video). You can mix HTML directly inside Markdown when needed.</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
const SYNTAX = [
  ['# Heading 1',       '<strong style="font-size:1.1em">Heading 1</strong>',             '<h1>'],
  ['## Heading 2',      '<strong>Heading 2</strong>',                                       '<h2>'],
  ['**bold**',          '<strong>bold</strong>',                                             '<strong>'],
  ['*italic*',          '<em>italic</em>',                                                   '<em>'],
  ['~~strike~~',        '<del>strike</del>',                                                '<del>'],
  ['`code`',            '<code style="background:var(--c-card-alt);padding:1px 4px;border-radius:3px;font-size:.88em">code</code>', '<code>'],
  ['[text](url)',       '<span style="color:var(--c-accent)">text</span>',                          '<a href="url">'],
  ['![alt](img.png)',   '<em style="color:var(--c-t4)">image</em>',                        '<img alt="alt">'],
  ['- item',            '• item',                                                            '<ul><li>'],
  ['1. item',           '1. item',                                                           '<ol><li>'],
  ['> quote',           '<span style="border-left:3px solid var(--c-accent);padding-left:8px;color:var(--c-t3)">quote</span>', '<blockquote>'],
  ['---',               '<hr style="border-top:1px solid var(--c-border);margin:4px 0">',   '<hr>'],
]

const USAGES = [
  {
    label: 'Code hosting',
    examples: 'GitHub, GitLab, Bitbucket — READMEs and wikis',
    icon: '<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>',
  },
  {
    label: 'Documentation sites',
    examples: 'Docusaurus, MkDocs, VitePress, Astro, GitBook',
    icon: '<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="10" height="14" rx="1" stroke="currentColor" stroke-width="1.3"/><path d="M5 5h5M5 8h5M5 11h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M12 4h2v10H8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    label: 'Note-taking apps',
    examples: 'Obsidian, Notion, Bear, Typora, iA Writer',
    icon: '<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 2h10v12H3z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  },
  {
    label: 'Chat & forums',
    examples: 'Discord, Slack, Reddit, Stack Overflow, Discourse',
    icon: '<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 2h12v9H9l-3 3v-3H2z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',
  },
  {
    label: 'CI / DevOps',
    examples: 'GitHub Actions, Jira, Confluence, Linear',
    icon: '<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/><path d="M8 5v3l2 2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  },
  {
    label: 'Static site generators',
    examples: 'Hugo, Jekyll, Next.js (MDX), Gatsby, Eleventy',
    icon: '<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 12L8 2l6 10H2z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',
  },
]

const FLAVORS = [
  { name: 'CommonMark', desc: 'The canonical specification (2014). Precise and unambiguous. Implemented by GitHub, GitLab, Discourse, Reddit, and this tool.' },
  { name: 'GitHub Flavored Markdown (GFM)', desc: 'CommonMark + tables, task lists (- [ ]), strikethrough, and auto-linked URLs. The most widely used superset.' },
  { name: 'MDX', desc: 'Markdown with embedded JSX components. Used by Next.js, Astro, and Docusaurus for interactive documentation.' },
  { name: 'MultiMarkdown / Pandoc', desc: 'Extended flavors with footnotes, citations, LaTeX math, and metadata headers. Used in academic and publishing workflows.' },
]
</script>

<style scoped>
/* ── Markdown demo block ───────────────────────────────────── */
.md-demo {
  display: grid;
  grid-template-columns: 1fr 32px 1fr;
  gap: 0;
  margin: 24px 0 28px;
  border: 1px solid var(--c-border);
  border-radius: 12px;
  overflow: hidden;
}

.md-demo-col {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.md-demo-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--c-t4);
  padding: 10px 16px;
  border-bottom: 1px solid var(--c-border-s);
  background: var(--c-faint);
}

.md-demo-code {
  flex: 1;
  margin: 0;
  padding: 16px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--c-t2);
  line-height: 1.65;
  background: transparent;
  white-space: pre-wrap;
  word-break: break-word;
}

.md-demo-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--c-t4);
  background: var(--c-faint);
  border-left: 1px solid var(--c-border-s);
  border-right: 1px solid var(--c-border-s);
}

.md-demo-render {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13.5px;
  line-height: 1.7;
}

.mdr-h1 {
  font-size: 1.3em;
  font-weight: 700;
  color: var(--c-t1);
  border-bottom: 1px solid var(--c-border);
  padding-bottom: 4px;
  margin-bottom: 4px;
}

.mdr-p { color: var(--c-t2); margin: 0; }

.mdr-code {
  font-family: var(--font-mono);
  font-size: 0.85em;
  background: var(--c-card-alt);
  border: 1px solid var(--c-border-s);
  border-radius: 4px;
  padding: 1px 5px;
  color: var(--c-accent);
}

.mdr-list {
  margin: 0;
  padding-left: 18px;
  color: var(--c-t2);
}

.mdr-blockquote {
  border-left: 3px solid var(--c-accent);
  padding: 6px 12px;
  background: var(--c-faint);
  border-radius: 0 6px 6px 0;
  color: var(--c-t3);
  margin: 0;
  font-size: 13px;
}

.mdr-codeblock {
  font-family: var(--font-mono);
  font-size: 12px;
  background: var(--c-card-alt);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 8px 12px;
  color: var(--c-t2);
}

/* ── Cheat table ───────────────────────────────────────────── */
.cheat-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0 4px;
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
  font-family: var(--font-mono);
  font-size: 12px;
  color: #60A5FA;
  background: rgba(96,165,250,0.08);
  padding: 1px 5px;
  border-radius: 4px;
  white-space: nowrap;
}

/* ── Usage grid ────────────────────────────────────────────── */
.usage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;
  margin: 16px 0;
}

.usage-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 10px;
}

.usage-icon {
  color: var(--c-accent);
  flex-shrink: 0;
  margin-top: 2px;
}

.usage-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-t1);
  margin-bottom: 3px;
}

.usage-examples {
  font-size: 12px;
  color: var(--c-t4);
  line-height: 1.5;
}

/* ── Flavor list ───────────────────────────────────────────── */
.flavor-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  overflow: hidden;
  margin: 16px 0 20px;
}

.flavor-row {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 0;
  border-bottom: 1px solid var(--c-border-s);
  padding: 12px 16px;
  align-items: start;
  gap: 12px;
}
.flavor-row:last-child { border-bottom: none; }

.flavor-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-t1);
  flex-shrink: 0;
}

.flavor-desc {
  font-size: 13px;
  color: var(--c-t3);
  line-height: 1.6;
}

/* ── Steps ─────────────────────────────────────────────────── */
.guide-steps { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }

/* ── Inline link ───────────────────────────────────────────── */
.inline-link { color: var(--c-accent); text-decoration: none; font-weight: 500; }
.inline-link:hover { text-decoration: underline; }

/* ── Responsive ────────────────────────────────────────────── */
@media (max-width: 640px) {
  .md-demo { grid-template-columns: 1fr; }
  .md-demo-arrow { display: none; }
  .flavor-row { grid-template-columns: 1fr; }
  .cheat-table th:nth-child(3), .cheat-table td:nth-child(3) { display: none; }
}
</style>
