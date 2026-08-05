<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        <strong>TOML</strong> (Tom's Obvious, Minimal Language) is a config-file format created by GitHub
        co-founder Tom Preston-Werner. It was designed to map unambiguously to a hash table: any two compliant
        parsers reading the same file produce the exact same structure, with nothing left to interpretation.
      </p>
      <p>
        That predictability is the whole point. Where YAML's indentation-based nesting and implicit type
        coercion (a bare <code>NO</code> silently parsing as boolean <code>false</code> is the classic example)
        leave room for parsers to disagree, every TOML value only has one valid reading. It ships as a
        versioned spec at <a href="https://toml.io" target="_blank" rel="noopener">toml.io</a>, currently at 1.0.0/1.1.0.
      </p>
    </section>

    <section class="guide-section">
      <h2>Anatomy of a TOML file</h2>
      <p>Flat key-value pairs at the top, grouped into named tables below:</p>
      <pre class="code-block"><code>name = "my-app"
version = "1.2.0"
authors = ["Alice", "Bob"]

[dependencies]
serde = "1.0"
tokio = { version = "1", features = ["full"] }

[[bin]]
name = "server"
path = "src/main.rs"</code></pre>
      <p>
        A <code>[table]</code> header groups the keys under it, equivalent to a nested JSON object. A
        <code>[[array-of-tables]]</code> header (double brackets) starts a new entry in an array every time it
        repeats, equivalent to a JSON array of objects — that's what <code>[[bin]]</code> becomes if it appears
        twice in the file.
      </p>
    </section>

    <section class="guide-section">
      <h2>Types, including a native date</h2>
      <p>
        TOML's type system is deliberately small: strings, integers, floats, booleans, arrays, tables, and one
        type most config formats leave out entirely: a first-class date-time.
      </p>
      <pre class="code-block"><code>created_at = 2024-01-15T09:00:00Z   # offset date-time, no quotes needed
release_date = 2024-01-15           # local date
port = 8080
timeout = 30_000                    # underscores allowed as digit separators
debug = false
tags = ["api", "auth"]</code></pre>
      <p>
        Because <code>2024-01-15T09:00:00Z</code> is a real typed value and not a string, a TOML parser can
        validate it's a well-formed date at parse time. Converted to JSON, it becomes an ISO 8601 string, since
        JSON has no native date type of its own.
      </p>
    </section>

    <section class="guide-section">
      <h2>TOML vs YAML vs JSON</h2>
      <table class="cheat-table">
        <thead><tr><th/><th>TOML</th><th>YAML</th><th>JSON</th></tr></thead>
        <tbody>
          <tr><td>Nesting</td><td>Explicit <code>[table]</code> headers</td><td>Indentation</td><td>Braces</td></tr>
          <tr><td>Comments</td><td><code>#</code></td><td><code>#</code></td><td>None</td></tr>
          <tr><td>Native dates</td><td>Yes</td><td>Yes (implicit)</td><td>No — strings only</td></tr>
          <tr><td>Ambiguity</td><td>None by design</td><td>Norway problem, tab-vs-space, 1.1 vs 1.2 parsers</td><td>None</td></tr>
          <tr><td>Written by</td><td>Humans, config files</td><td>Humans, config files</td><td>Machines, API payloads</td></tr>
        </tbody>
      </table>
      <p>Pick TOML when you want config that's diffable and unambiguous without YAML's indentation risk. Pick JSON for anything machine-generated or API-facing.</p>
    </section>

    <section class="guide-section">
      <h2>What TOML cannot represent</h2>
      <h3>No null value</h3>
      <p>
        The spec never defined one. A key either has a real value or it's absent from the document, there's no
        third state for "present but empty." Converting JSON to TOML, a <code>null</code> field has to be
        resolved first: drop the key, or replace it with a real value.
      </p>
      <h3>No top-level array</h3>
      <p>
        A TOML document is always a table at the root. <code>["a", "b", "c"]</code> on its own isn't valid TOML;
        it has to be wrapped in a key first, e.g. <code>items = ["a", "b", "c"]</code>.
      </p>
      <p>This site's <NuxtLink to="/tools/toml-to-json" class="guide-inline-link">TOML ↔ JSON Converter</NuxtLink> checks for both cases up front and tells you exactly which key is the problem, rather than silently dropping data.</p>
    </section>

    <section class="guide-section">
      <h2>Where TOML is used</h2>
      <p>
        <code>Cargo.toml</code> is the manifest for every Rust package: dependencies, features, build targets.
        <code>pyproject.toml</code> is the standard build-system and tool config for Python (PEP 518/621), read
        by Poetry, Black, and Ruff. Hugo, Gitea, and a long list of CLI tools default to TOML for their own
        config files, for the same reason: predictable parsing without a YAML indentation mistake breaking a
        build.
      </p>
    </section>

  </div>
</template>

<style scoped>
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 12px 0; }
.code-block code { font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
</style>
