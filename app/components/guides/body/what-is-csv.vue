<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        <strong>CSV</strong> (Comma-Separated Values) is a plain-text format for tabular data: rows of records,
        each split into fields by a delimiter, usually a comma. It predates JSON by decades — spreadsheet
        programs have exported CSV since the 1970s — and remains the default hand-off format between
        spreadsheets, databases, and just about any tool that deals with rows and columns.
      </p>
      <p>
        There is no single official CSV standard. <a href="https://www.rfc-editor.org/rfc/rfc4180" target="_blank" rel="noopener">RFC 4180</a>
        describes the common conventions most parsers follow, but it is informational, not enforced, which is
        exactly why CSV files from different sources sometimes disagree on quoting, line endings, or delimiters.
      </p>
    </section>

    <section class="guide-section">
      <h2>Anatomy of a CSV file</h2>
      <p>The first line is usually a header row naming each column. Every line after it is one record:</p>
      <pre class="code-block" data-lang="csv"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">name,</span><span style="color:#D73A49;--shiki-dark:#FF79C6">age,</span><span style="color:#6F42C1;--shiki-dark:#50FA7B">city</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">Alice,</span><span style="color:#D73A49;--shiki-dark:#FF79C6">30,</span><span style="color:#6F42C1;--shiki-dark:#50FA7B">Paris</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">Bob,</span><span style="color:#D73A49;--shiki-dark:#FF79C6">25,</span><span style="color:#6F42C1;--shiki-dark:#50FA7B">Lyon</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">Chloé,</span><span style="color:#D73A49;--shiki-dark:#FF79C6">41,</span><span style="color:#6F42C1;--shiki-dark:#50FA7B">Marseille</span></span></code></pre>
      <p>
        Fields are separated by the delimiter, records by a line break. There is no type system: every value
        is text until something downstream decides otherwise. <code>30</code> is not a number in the CSV
        itself — it is the two characters <code>3</code> and <code>0</code>, interpreted as a number only by
        whatever reads the file next.
      </p>
    </section>

    <section class="guide-section">
      <h2>Quoting and escaping</h2>
      <p>
        Plain fields need no quotes. A field only needs double quotes when it contains the delimiter itself,
        a double quote, or a line break — otherwise the parser cannot tell where the field ends:
      </p>
      <pre class="code-block" data-lang="csv"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">name,</span><span style="color:#D73A49;--shiki-dark:#FF79C6">address,</span><span style="color:#6F42C1;--shiki-dark:#50FA7B">age</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">Alice,</span><span style="color:#D73A49;--shiki-dark:#FF79C6">"12 Rue de Paris, 3rd floor",</span><span style="color:#6F42C1;--shiki-dark:#50FA7B">30</span></span></code></pre>
      <p>
        Without the quotes, the comma inside the address would look like a third field and shift every
        column after it. To put a literal double quote inside a quoted field, double it:
      </p>
      <pre class="code-block" data-lang="csv"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">quote,</span><span style="color:#D73A49;--shiki-dark:#FF79C6">speaker</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">"She said ""hello"" and left.",</span><span style="color:#D73A49;--shiki-dark:#FF79C6">Alice</span></span></code></pre>
      <p>
        That field decodes to <code>She said "hello" and left.</code> — RFC 4180's rule is simple but easy to
        get wrong when writing CSV by hand: forgetting to double an embedded quote produces a file that looks
        fine until a parser hits it and either throws an error or silently misaligns columns.
      </p>
    </section>

    <section class="guide-section">
      <h2>Delimiters: comma, semicolon, tab</h2>
      <p>
        The comma is the default, but not universal. In locales where the comma is the decimal separator
        (most of continental Europe: <code>3,14</code> instead of <code>3.14</code>), Excel exports CSV with
        a <strong>semicolon</strong> delimiter instead, to avoid colliding with decimal numbers. A file that
        opens as one giant column in a US-locale spreadsheet is often just semicolon-delimited CSV from a
        European one.
      </p>
      <p>
        <strong>TSV</strong> (Tab-Separated Values) sidesteps the whole problem: tabs rarely appear inside
        real data, so quoting is almost never needed. It is common in bioinformatics and command-line tooling,
        less common as a spreadsheet export default.
      </p>
      <table class="cheat-table">
        <thead><tr><th>Delimiter</th><th>Typical source</th><th>Needs quoting when field contains</th></tr></thead>
        <tbody>
          <tr><td>Comma <code>,</code></td><td>US/UK spreadsheet exports, most APIs</td><td>Comma, quote, or line break</td></tr>
          <tr><td>Semicolon <code>;</code></td><td>European-locale Excel exports</td><td>Semicolon, quote, or line break</td></tr>
          <tr><td>Tab <code>\t</code></td><td>Command-line tools, bioinformatics</td><td>Tab, quote, or line break (rarely needed)</td></tr>
        </tbody>
      </table>
    </section>

    <section class="guide-section">
      <h2>CSV vs JSON</h2>
      <table class="cheat-table">
        <thead><tr><th/><th>CSV</th><th>JSON</th></tr></thead>
        <tbody>
          <tr><td>Structure</td><td>Flat — rows and columns only</td><td>Nested — objects and arrays at any depth</td></tr>
          <tr><td>Types</td><td>None — everything is text</td><td>String, number, boolean, null, object, array</td></tr>
          <tr><td>Human editing</td><td>Comfortable in any spreadsheet app</td><td>Needs a text or code editor</td></tr>
          <tr><td>File size</td><td>Smaller — no repeated key names</td><td>Larger — every object repeats its keys</td></tr>
          <tr><td>Ubiquity</td><td>Every spreadsheet and BI tool</td><td>Every API and programming language</td></tr>
        </tbody>
      </table>
      <p>
        Converting between the two means picking a shape: turning a JSON array of flat objects into CSV rows
        is straightforward, but nested objects or arrays inside a field either get flattened, dropped, or
        serialized as a JSON string inside a single CSV cell — there is no lossless general mapping between
        the two formats.
      </p>
      <p>This site's <NuxtLink to="/tools/csv-to-json" class="guide-inline-link">CSV ↔ JSON Converter</NuxtLink> handles this conversion directly, including the quoting edge cases described above.</p>
    </section>

    <section class="guide-section">
      <h2>Common pitfalls</h2>
      <h3>Excel rewrites your data on open</h3>
      <p>
        Opening a CSV in Excel is not a neutral preview — Excel applies its own type-guessing on the way in.
        A ZIP code like <code>07430</code> becomes <code>7430</code> (leading zero dropped), a 16-digit ID
        number gets displayed in scientific notation and loses precision beyond 15 significant digits, and a
        date-like string such as <code>03-04</code> silently turns into a date. None of this touches the
        underlying file until you save — but it is a frequent source of "the CSV looks wrong" reports that are
        actually Excel's rendering, not a bad export.
      </p>
      <h3>Encoding and the BOM</h3>
      <p>
        A CSV file is just bytes; nothing in it declares its own character encoding. If a file uses UTF-8 and
        contains accented characters (<code>é</code>, <code>ü</code>), Excel on Windows may misread them
        unless the file starts with a UTF-8 byte-order mark (BOM). Other tools expect the opposite and treat a
        BOM as three stray characters at the top of the first cell. There is no encoding setting that satisfies
        every consumer at once.
      </p>
      <h3>Ragged rows</h3>
      <p>
        Nothing enforces that every row has the same number of fields. A row with a missing trailing comma has
        one column fewer than the header; a row with an extra unescaped comma has one more. Strict parsers
        reject these files outright, lenient ones silently misalign columns from that row onward.
      </p>
    </section>

  </div>
</template>

<style scoped>
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 12px 0; }
.code-block code { font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
</style>
