<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        <strong>JSON Schema</strong> is a vocabulary that lets you describe the structure and constraints
        of a JSON document. Think of it as a type definition for JSON — you write a schema, and any
        conforming JSON must match it.
      </p>
      <p>
        It answers questions like: is <code>age</code> a number between 0 and 150? Is <code>email</code>
        present and a valid email string? If <code>type</code> is <code>"premium"</code>, is
        <code>billingPlan</code> required? JSON Schema lets you express all of this declaratively.
      </p>
    </section>

    <section class="guide-section">
      <h2>A minimal example</h2>
      <p>Given this JSON:</p>
      <pre class="code-block"><code>{
  "id": 42,
  "name": "Alice",
  "email": "alice@example.com",
  "role": "admin"
}</code></pre>
      <p>A JSON Schema that validates it:</p>
      <pre class="code-block"><code>{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id":    { "type": "integer", "minimum": 1 },
    "name":  { "type": "string", "minLength": 1 },
    "email": { "type": "string", "format": "email" },
    "role":  { "type": "string", "enum": ["admin", "editor", "viewer"] }
  },
  "additionalProperties": false
}</code></pre>
    </section>

    <section class="guide-section">
      <h2>Core keywords</h2>
      <table class="cheat-table">
        <thead><tr><th>Keyword</th><th>What it does</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td><code>type</code></td><td>Constrains the JSON type</td><td><code>"type": "string"</code></td></tr>
          <tr><td><code>properties</code></td><td>Defines sub-schemas for object keys</td><td><code>"properties": { "age": { "type": "integer" } }</code></td></tr>
          <tr><td><code>required</code></td><td>Array of keys that must be present</td><td><code>"required": ["id", "email"]</code></td></tr>
          <tr><td><code>additionalProperties</code></td><td>Whether extra keys are allowed (<code>false</code> = strict)</td><td><code>"additionalProperties": false</code></td></tr>
          <tr><td><code>enum</code></td><td>Value must be one of a fixed list</td><td><code>"enum": ["red", "green", "blue"]</code></td></tr>
          <tr><td><code>format</code></td><td>Semantic format hint (email, date, uri…)</td><td><code>"format": "date-time"</code></td></tr>
          <tr><td><code>minimum</code> / <code>maximum</code></td><td>Numeric range constraints</td><td><code>"minimum": 0, "maximum": 100</code></td></tr>
          <tr><td><code>minLength</code> / <code>maxLength</code></td><td>String length constraints</td><td><code>"minLength": 8</code></td></tr>
          <tr><td><code>pattern</code></td><td>String must match a regex</td><td><code>"pattern": "^[a-z]+"</code></td></tr>
          <tr><td><code>items</code></td><td>Schema for array elements</td><td><code>"items": { "type": "number" }</code></td></tr>
          <tr><td><code>$ref</code></td><td>References another schema by URI or anchor</td><td><code>"$ref": "#/$defs/Address"</code></td></tr>
          <tr><td><code>$defs</code></td><td>Reusable sub-schema definitions (2020-12)</td><td><code>"$defs": { "Address": { … } }</code></td></tr>
        </tbody>
      </table>
    </section>

    <section class="guide-section">
      <h2>Composition keywords</h2>
      <p>Schemas can be combined with boolean logic:</p>
      <table class="cheat-table">
        <thead><tr><th>Keyword</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>anyOf</code></td><td>Valid if the data matches <em>at least one</em> of the listed schemas</td></tr>
          <tr><td><code>oneOf</code></td><td>Valid if the data matches <em>exactly one</em> of the listed schemas</td></tr>
          <tr><td><code>allOf</code></td><td>Valid if the data matches <em>all</em> listed schemas — used for schema inheritance / mixins</td></tr>
          <tr><td><code>not</code></td><td>Valid if the data does <em>not</em> match the given schema</td></tr>
          <tr><td><code>if / then / else</code></td><td>Conditional validation — if the <code>if</code> schema matches, apply <code>then</code>; otherwise apply <code>else</code></td></tr>
        </tbody>
      </table>
      <pre class="code-block"><code>// A field that is either a string or null
{ "anyOf": [{ "type": "string" }, { "type": "null" }] }

// Conditional: if premium, require billingPlan
{
  "if":   { "properties": { "type": { "const": "premium" } } },
  "then": { "required": ["billingPlan"] }
}</code></pre>
    </section>

    <section class="guide-section">
      <h2>Draft-07 vs 2020-12</h2>
      <p>
        JSON Schema has several published drafts. The two most widely used are:
      </p>
      <table class="cheat-table">
        <thead><tr><th></th><th>Draft-07</th><th>2020-12</th></tr></thead>
        <tbody>
          <tr><td>$schema URI</td><td><code>http://json-schema.org/draft-07/schema</code></td><td><code>https://json-schema.org/draft/2020-12/schema</code></td></tr>
          <tr><td>Reusable definitions</td><td><code>definitions</code></td><td><code>$defs</code> (renamed)</td></tr>
          <tr><td>Anchors</td><td>Limited</td><td><code>$anchor</code> and <code>$dynamicAnchor</code></td></tr>
          <tr><td><code>items</code> keyword</td><td>Schema for all items, or tuple</td><td>Schema for all items; <code>prefixItems</code> for tuples</td></tr>
          <tr><td>Vocab support</td><td>No</td><td>Yes — allows modular schema extensions</td></tr>
          <tr><td>Ecosystem support</td><td>Very wide — most validators support it</td><td>Growing — preferred for new projects</td></tr>
        </tbody>
      </table>
      <p>
        Use <strong>2020-12</strong> for new projects if your validator supports it. Use <strong>Draft-07</strong>
        if you need maximum ecosystem compatibility or are targeting tools like OpenAPI 3.0.
      </p>
    </section>

    <section class="guide-section">
      <h2>Where JSON Schema is used</h2>
      <ul>
        <li><strong>API validation</strong> — validate request bodies and responses in Express, FastAPI, Spring, etc.</li>
        <li><strong>OpenAPI / Swagger</strong> — API definitions use JSON Schema to describe request/response shapes.</li>
        <li><strong>VS Code settings</strong> — <code>settings.json</code> and <code>tsconfig.json</code> are validated by JSON Schema.</li>
        <li><strong>Form generation</strong> — tools like <a href="https://rjsf-team.github.io/react-jsonschema-form/" target="_blank" rel="noopener">react-jsonschema-form</a> generate forms from schemas.</li>
        <li><strong>Configuration files</strong> — many tools use JSON Schema to validate their config files.</li>
      </ul>
      <p>
        JSON Schema validates at <em>runtime</em>, while
        <NuxtLink to="/guides/what-is-json" class="guide-inline-link">JSON itself</NuxtLink> is just the data format.
        For <em>compile-time</em> type checking in TypeScript, you would use TypeScript interfaces or Zod schemas —
        though tools like <code>zod-to-json-schema</code> can bridge the two.
      </p>
    </section>

  </div>
</template>

<style scoped>
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 16px 0; }
.code-block code { font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
</style>
