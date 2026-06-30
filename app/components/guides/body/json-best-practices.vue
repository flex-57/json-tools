<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        JSON is simple by design, but it's easy to make choices that create friction later —
        inconsistent naming, ambiguous nulls, brittle date strings. This guide collects the
        conventions that save the most debugging time. For a foundations refresher, see
        <NuxtLink to="/guides/what-is-json" class="guide-inline-link">What is JSON?</NuxtLink>
      </p>
    </section>

    <section class="guide-section">
      <h2>Naming conventions</h2>
      <p>
        <strong>Use <code>camelCase</code> for keys.</strong> It is the dominant convention in JSON APIs,
        matches JavaScript's native style, and most JSON serializers in other languages (Jackson, Newtonsoft.Json,
        encoding/json with struct tags) map to it automatically.
      </p>
      <div class="compare">
        <div>
          <p class="col-label bad">Avoid</p>
          <pre class="code-block"><code>{
  "first_name": "Alice",
  "last-name": "Martin",
  "UserEmail": "alice@example.com"
}</code></pre>
        </div>
        <div>
          <p class="col-label good">Prefer</p>
          <pre class="code-block"><code>{
  "firstName": "Alice",
  "lastName": "Martin",
  "userEmail": "alice@example.com"
}</code></pre>
        </div>
      </div>
      <p>
        Use <code>snake_case</code> if your primary consumers are Python or PostgreSQL (where snake_case is idiomatic).
        What matters most is <strong>consistency</strong> — pick one and stick to it across the entire API.
      </p>
    </section>

    <section class="guide-section">
      <h2>Dates and times</h2>
      <p>
        <strong>Always use ISO 8601.</strong> Never invent custom date formats — <code>"01/06/2026"</code>
        is ambiguous (January 6th or June 1st?), locale-dependent, and unparseable by standard libraries.
      </p>
      <table class="cheat-table">
        <thead><tr><th>Use case</th><th>Format</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>Date only</td><td><code>YYYY-MM-DD</code></td><td><code>"2026-06-30"</code></td></tr>
          <tr><td>Date + time (UTC)</td><td><code>YYYY-MM-DDTHH:mm:ssZ</code></td><td><code>"2026-06-30T14:30:00Z"</code></td></tr>
          <tr><td>Date + time (with offset)</td><td><code>YYYY-MM-DDTHH:mm:ss+HH:mm</code></td><td><code>"2026-06-30T16:30:00+02:00"</code></td></tr>
          <tr><td>Millisecond precision</td><td><code>YYYY-MM-DDTHH:mm:ss.SSSZ</code></td><td><code>"2026-06-30T14:30:00.123Z"</code></td></tr>
        </tbody>
      </table>
      <p>
        Prefer UTC timestamps in APIs — consumers can convert to local time. Store epoch milliseconds
        as integers only if you need maximum compactness (e.g. high-volume event logs).
      </p>
    </section>

    <section class="guide-section">
      <h2>Null vs omitting a field</h2>
      <p>These are different semantics and should be used deliberately:</p>
      <table class="cheat-table">
        <thead><tr><th>Representation</th><th>Semantics</th><th>When to use</th></tr></thead>
        <tbody>
          <tr>
            <td><code>"middleName": null</code></td>
            <td>The field exists and is explicitly empty</td>
            <td>When the consumer needs to distinguish "known to be absent" from "not provided"</td>
          </tr>
          <tr>
            <td><em>(field omitted)</em></td>
            <td>The field is not part of this response</td>
            <td>Optional fields that don't apply in this context; reduces payload size</td>
          </tr>
        </tbody>
      </table>
      <p>
        Choose one approach and document it. Never mix them: an API that sometimes omits a field and
        sometimes returns <code>null</code> for it forces consumers to handle both cases.
      </p>
    </section>

    <section class="guide-section">
      <h2>Numbers</h2>
      <p>
        JSON numbers are conceptually arbitrary-precision, but in practice most parsers use IEEE 754
        double-precision floats — which gives you exact integers up to 2<sup>53</sup>.
      </p>
      <ul>
        <li><strong>Large IDs</strong> — if your IDs exceed 2<sup>53</sup> (e.g. Twitter/X snowflake IDs), send them as strings: <code>"id": "1234567890123456789"</code>. JavaScript loses precision silently otherwise.</li>
        <li><strong>Money</strong> — never use floats for currency: <code>0.1 + 0.2 ≠ 0.3</code>. Use integer cents/pence: <code>"amountCents": 1099</code>, or a string with a fixed decimal: <code>"amount": "10.99"</code>.</li>
        <li><strong>Floats for display</strong> — round server-side before sending; don't push rounding responsibilities to clients.</li>
      </ul>
    </section>

    <section class="guide-section">
      <h2>Booleans</h2>
      <p>
        Use actual JSON booleans (<code>true</code> / <code>false</code>), never string substitutes:
      </p>
      <div class="compare">
        <div>
          <p class="col-label bad">Avoid</p>
          <pre class="code-block"><code>{
  "active": "true",
  "deleted": 1,
  "verified": "yes"
}</code></pre>
        </div>
        <div>
          <p class="col-label good">Prefer</p>
          <pre class="code-block"><code>{
  "active": true,
  "deleted": false,
  "verified": true
}</code></pre>
        </div>
      </div>
    </section>

    <section class="guide-section">
      <h2>Pagination</h2>
      <p>
        Wrap paginated lists in an object — never return a bare array at the top level,
        because adding metadata later would break the API contract:
      </p>
      <pre class="code-block"><code>{
  "data": [
    { "id": "u_1", "name": "Alice" },
    { "id": "u_2", "name": "Bob" }
  ],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 142,
    "nextCursor": "eyJpZCI6InVfMiJ9"
  }
}</code></pre>
      <p>
        Cursor-based pagination (<code>nextCursor</code>) is more robust than page numbers for large or
        frequently-updated datasets — it doesn't skip or duplicate items when records are inserted.
      </p>
    </section>

    <section class="guide-section">
      <h2>Error responses</h2>
      <p>
        Return a consistent error shape regardless of HTTP status code.
        Consumer code can then handle errors generically:
      </p>
      <pre class="code-block"><code>{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body is invalid",
    "details": [
      { "field": "email", "message": "Must be a valid email address" },
      { "field": "age",   "message": "Must be a positive integer" }
    ]
  }
}</code></pre>
      <ul>
        <li><code>code</code> — machine-readable, stable string (not an HTTP status number).</li>
        <li><code>message</code> — human-readable, safe to display in developer tooling.</li>
        <li><code>details</code> — optional array of per-field errors for validation failures.</li>
      </ul>
    </section>

    <section class="guide-section">
      <h2>Nesting depth</h2>
      <p>
        Deep nesting is a sign the data model needs rethinking.
        Prefer flat structures where possible:
      </p>
      <div class="compare">
        <div>
          <p class="col-label bad">Avoid (deep nesting)</p>
          <pre class="code-block"><code>{
  "user": {
    "profile": {
      "address": {
        "city": {
          "name": "Paris"
        }
      }
    }
  }
}</code></pre>
        </div>
        <div>
          <p class="col-label good">Prefer (flat)</p>
          <pre class="code-block"><code>{
  "userId": "u_42",
  "cityName": "Paris",
  "addressLine1": "1 rue de Rivoli",
  "addressPostalCode": "75001"
}</code></pre>
        </div>
      </div>
      <p>
        Keep nesting to 2–3 levels max for most objects. Embed arrays for 1:many when the child
        list is always fetched with the parent; use IDs + separate endpoints when the child list
        is large or independently queried.
      </p>
    </section>

    <section class="guide-section">
      <h2>Versioning</h2>
      <p>
        Plan for evolution from day one. Additive changes (new fields) are generally safe —
        compliant clients ignore unknown keys. Breaking changes (removing, renaming, or retyping fields) require a new version.
      </p>
      <ul>
        <li><strong>URL versioning</strong> — <code>/api/v2/users</code> — explicit and cacheable.</li>
        <li><strong>Header versioning</strong> — <code>Accept: application/vnd.api+json;version=2</code> — cleaner URLs but harder to test in browsers.</li>
        <li>Always include a <code>"version"</code> or <code>"schemaVersion"</code> field in responses for APIs that embed schema info.</li>
      </ul>
    </section>

    <section class="guide-section">
      <h2>Validate your JSON with JSON Schema</h2>
      <p>
        Document your API shape as a
        <NuxtLink to="/guides/what-is-json-schema" class="guide-inline-link">JSON Schema</NuxtLink>
        and run validation on both sides (server: reject bad input; client: reject unexpected responses).
        This catches contract violations at the boundary, before bad data propagates into your system.
      </p>
    </section>

  </div>
</template>

<style scoped>
.compare { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 12px 0; }
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 8px 0; }
.code-block code { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
.col-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 4px; }
.col-label.bad { color: #f87171; }
.col-label.good { color: #34d399; }
.cheat-table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0; }
.cheat-table th { text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--c-t4); padding: 0 12px 10px 0; border-bottom: 1px solid var(--c-border); }
.cheat-table td { padding: 9px 12px 9px 0; border-bottom: 1px solid var(--c-border); color: var(--c-t2); vertical-align: top; line-height: 1.55; }
.cheat-table tr:last-child td { border-bottom: none; }
.guide-inline-link { color: #F97316; text-decoration: none; border-bottom: 1px solid rgba(249,115,22,0.3); }
.guide-inline-link:hover { border-bottom-color: #F97316; }
@media (max-width: 640px) { .compare { grid-template-columns: 1fr; } }
</style>
