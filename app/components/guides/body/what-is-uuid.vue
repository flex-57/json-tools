<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        A <strong>UUID</strong> (Universally Unique Identifier) is a 128-bit label used to identify
        information in computer systems. Its design goal is that it can be generated independently —
        without a central authority — and still be unique across all space and time with overwhelming probability.
      </p>
      <p>
        UUIDs are standardized in <a href="https://www.rfc-editor.org/rfc/rfc9562" target="_blank" rel="noopener">RFC 9562</a>
        and written as 32 hexadecimal characters separated by hyphens in the format
        <code>xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx</code>, where <code>M</code> is the version digit and
        <code>N</code> encodes the variant.
      </p>
    </section>

    <section class="guide-section">
      <h2>Anatomy of a UUID</h2>
      <div class="uuid-display">
        <span class="uuid-part uuid-a">550e8400</span><!--
        --><span class="uuid-sep">-</span><!--
        --><span class="uuid-part uuid-b">e29b</span><!--
        --><span class="uuid-sep">-</span><!--
        --><span class="uuid-part uuid-c">41d4</span><!--
        --><span class="uuid-sep">-</span><!--
        --><span class="uuid-part uuid-d">a716</span><!--
        --><span class="uuid-sep">-</span><!--
        --><span class="uuid-part uuid-e">446655440000</span>
      </div>
      <div class="uuid-legend">
        <span class="ul ul-a">time_low (32 bits)</span>
        <span class="ul ul-b">time_mid (16 bits)</span>
        <span class="ul ul-c">version + time_hi (16 bits)</span>
        <span class="ul ul-d">variant + clock_seq (16 bits)</span>
        <span class="ul ul-e">node (48 bits)</span>
      </div>
      <p class="uuid-caption">Total: 128 bits — 32 hex characters + 4 hyphens = 36 characters.</p>
    </section>

    <section class="guide-section">
      <h2>UUID versions</h2>
      <table class="cheat-table">
        <thead><tr><th>Version</th><th>How generated</th><th>Sortable</th><th>Use when</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>v1</strong></td>
            <td>Timestamp + MAC address</td>
            <td>Yes (roughly)</td>
            <td>You need time-ordered IDs and don't mind exposing MAC addresses</td>
          </tr>
          <tr>
            <td><strong>v3</strong></td>
            <td>MD5 hash of a namespace + name</td>
            <td>No</td>
            <td>Deterministic UUIDs from a name (legacy)</td>
          </tr>
          <tr>
            <td><strong>v4</strong></td>
            <td>122 bits of random data</td>
            <td>No</td>
            <td>General purpose — the most widely used version today</td>
          </tr>
          <tr>
            <td><strong>v5</strong></td>
            <td>SHA-1 hash of a namespace + name</td>
            <td>No</td>
            <td>Deterministic UUIDs from a name (preferred over v3)</td>
          </tr>
          <tr>
            <td><strong>v7</strong></td>
            <td>Unix timestamp + random data</td>
            <td>Yes — lexicographically</td>
            <td>Database primary keys where chronological ordering matters</td>
          </tr>
        </tbody>
      </table>
      <p>
        When in doubt, use <strong>v4</strong> for general identifiers and <strong>v7</strong> if you need
        UUIDs that sort correctly (e.g. as database primary keys with B-tree indexes).
      </p>
    </section>

    <section class="guide-section">
      <h2>UUID vs auto-increment IDs</h2>
      <table class="cheat-table">
        <thead><tr><th></th><th>UUID (v4)</th><th>Auto-increment integer</th></tr></thead>
        <tbody>
          <tr><td>Globally unique</td><td>Yes</td><td>Only within one table</td></tr>
          <tr><td>Merge-safe</td><td>Yes — no conflicts when merging databases</td><td>No — IDs collide</td></tr>
          <tr><td>Predictable / guessable</td><td>No — opaque to outside users</td><td>Yes — sequential</td></tr>
          <tr><td>Index performance</td><td>Slower — random values cause B-tree fragmentation</td><td>Faster — sequential</td></tr>
          <tr><td>Storage</td><td>16 bytes (binary) or 36 bytes (string)</td><td>4–8 bytes</td></tr>
          <tr><td>Expose record count</td><td>No</td><td>Yes — users can infer total records</td></tr>
        </tbody>
      </table>
      <p>
        UUID v7 largely eliminates the index performance issue because it is time-ordered, combining the
        global uniqueness of UUIDs with index performance close to auto-increment.
      </p>
    </section>

    <section class="guide-section">
      <h2>The nil and max UUIDs</h2>
      <p>
        Two special UUIDs are defined by the standard:
      </p>
      <ul>
        <li><strong>Nil UUID</strong> — all zeros: <code>00000000-0000-0000-0000-000000000000</code>. Used as a "no value" sentinel, similar to <code>null</code>.</li>
        <li><strong>Max UUID</strong> — all <code>f</code>s: <code>ffffffff-ffff-ffff-ffff-ffffffffffff</code>. Useful as an upper bound in range queries.</li>
      </ul>
    </section>

    <section class="guide-section">
      <h2>Are UUIDs truly unique?</h2>
      <p>
        UUID v4 has 122 bits of randomness, giving approximately
        5.3 × 10<sup>36</sup> possible values. The probability of generating a
        duplicate when producing 1 billion UUIDs per second for 100 years is still negligible —
        far smaller than the probability of a hardware error occurring in the same period.
        In practice, UUID v4 collisions do not happen.
      </p>
      <p>
        UUID v5 deterministically produces the same UUID for the same input, which is useful for stable,
        reproducible identifiers. It uses <NuxtLink to="/guides/what-is-hash" class="guide-inline-link">SHA-1 hashing</NuxtLink>
        internally, though the security concerns around SHA-1 collisions do not apply here since
        the goal is uniqueness, not collision resistance against adversaries.
      </p>
    </section>

  </div>
</template>

<style scoped>
.uuid-display {
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin: 24px 0 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0;
}
.uuid-sep { color: var(--c-t5); }
.uuid-part { padding: 2px 0; }
.uuid-a { color: #60a5fa; }
.uuid-b { color: #34d399; }
.uuid-c { color: var(--c-brand); }
.uuid-d { color: #a78bfa; }
.uuid-e { color: #f472b6; }

.uuid-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 12px;
}
.ul { padding: 2px 10px; border-radius: 20px; font-family: 'JetBrains Mono', monospace; }
.ul-a { background: rgba(96,165,250,0.12);  color: #60a5fa; }
.ul-b { background: rgba(52,211,153,0.12);  color: #34d399; }
.ul-c { background: rgb(var(--c-brand-rgb) / 0.12);  color: var(--c-brand); }
.ul-d { background: rgba(167,139,250,0.12); color: #a78bfa; }
.ul-e { background: rgba(244,114,182,0.12); color: #f472b6; }
.uuid-caption { font-size: 12.5px; color: var(--c-t4); }
</style>
