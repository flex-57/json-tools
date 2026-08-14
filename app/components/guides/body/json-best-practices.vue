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
          <pre class="code-block" data-lang="json"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">{</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">first_name</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Alice</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">last-name</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Martin</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">UserEmail</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">alice@example.com</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">}</span></span></code></pre>
        </div>
        <div>
          <p class="col-label good">Prefer</p>
          <pre class="code-block" data-lang="json"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">{</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">firstName</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Alice</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">lastName</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Martin</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">userEmail</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">alice@example.com</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">}</span></span></code></pre>
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
          <pre class="code-block" data-lang="json"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">{</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">active</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">true</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">deleted</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 1</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">verified</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">yes</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">}</span></span></code></pre>
        </div>
        <div>
          <p class="col-label good">Prefer</p>
          <pre class="code-block" data-lang="json"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">{</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">active</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> true</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">deleted</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> false</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">verified</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> true</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">}</span></span></code></pre>
        </div>
      </div>
    </section>

    <section class="guide-section">
      <h2>Pagination</h2>
      <p>
        Wrap paginated lists in an object — never return a bare array at the top level,
        because adding metadata later would break the API contract:
      </p>
      <pre class="code-block" data-lang="json"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">{</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">data</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> [</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">    { </span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">id</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">u_1</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">, </span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">name</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Alice</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> },</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">    { </span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">id</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">u_2</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">, </span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">name</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Bob</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> }</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">  ],</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">pagination</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> {</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">    "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">page</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 1</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">    "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">perPage</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 20</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">    "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">total</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#005CC5;--shiki-dark:#BD93F9"> 142</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">    "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">nextCursor</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">eyJpZCI6InVfMiJ9</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">  }</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">}</span></span></code></pre>
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
      <pre class="code-block" data-lang="json"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">{</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">error</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> {</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">    "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">code</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">VALIDATION_ERROR</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">    "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">message</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Request body is invalid</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">    "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">details</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> [</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">      { </span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">field</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">email</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">, </span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">message</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Must be a valid email address</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> },</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">      { </span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">field</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">age</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,   </span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">message</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Must be a positive integer</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> }</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">    ]</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">  }</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">}</span></span></code></pre>
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
          <pre class="code-block" data-lang="json"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">{</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">user</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> {</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">    "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">profile</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> {</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">      "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">address</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> {</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">        "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">city</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#24292E;--shiki-dark:#F8F8F2"> {</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">          "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">name</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Paris</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">        }</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">      }</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">    }</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">  }</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">}</span></span></code></pre>
        </div>
        <div>
          <p class="col-label good">Prefer (flat)</p>
          <pre class="code-block" data-lang="json"><code class="shiki-code"><span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">{</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">userId</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">u_42</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">cityName</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">Paris</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">addressLine1</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">1 rue de Rivoli</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span><span style="color:#24292E;--shiki-dark:#F8F8F2">,</span></span>
<span class="line"><span style="color:#005CC5;--shiki-dark:#8BE9FE">  "</span><span style="color:#005CC5;--shiki-dark:#8BE9FD">addressPostalCode</span><span style="color:#005CC5;--shiki-dark:#8BE9FE">"</span><span style="color:#24292E;--shiki-dark:#FF79C6">:</span><span style="color:#032F62;--shiki-dark:#E9F284"> "</span><span style="color:#032F62;--shiki-dark:#F1FA8C">75001</span><span style="color:#032F62;--shiki-dark:#E9F284">"</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#F8F8F2">}</span></span></code></pre>
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
      <p>This site's <NuxtLink to="/tools/json-schema" class="guide-inline-link">JSON Schema Generator</NuxtLink> can infer a first draft directly from an example payload, often faster than writing one by hand.</p>
    </section>

  </div>
</template>

<style scoped>
.compare { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 12px 0; }
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 8px 0; }
.code-block code { font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
.col-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 4px; }
.col-label.bad { color: #f87171; }
.col-label.good { color: #34d399; }
@media (max-width: 640px) { .compare { grid-template-columns: 1fr; } }
</style>
