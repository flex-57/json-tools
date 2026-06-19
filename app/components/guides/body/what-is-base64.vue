<template>
  <article class="guide-body">

    <section class="guide-section">
      <h2>What is Base64?</h2>
      <p><strong>Base64</strong> is an encoding scheme that converts binary data into a string of printable ASCII characters. It uses an alphabet of 64 characters — A–Z, a–z, 0–9, plus <code>+</code> and <code>/</code> — to represent any sequence of bytes as readable text.</p>
      <p>The name comes directly from that alphabet size: 64 symbols, each representing 6 bits of data. It was standardized in <a href="https://datatracker.ietf.org/doc/html/rfc4648" target="_blank" rel="noopener noreferrer">RFC 4648</a> and is used everywhere binary data needs to travel through a text-only channel.</p>
    </section>

    <section class="guide-section">
      <h2>How it works</h2>
      <p>Base64 processes input in chunks of <strong>3 bytes (24 bits)</strong>. Each chunk is split into 4 groups of 6 bits. Each 6-bit group maps to one character in the Base64 alphabet:</p>

      <div class="b64-visual">
        <div class="b64-row b64-row--bytes">
          <span class="b64-cell b64-cell--label">Bytes</span>
          <span class="b64-cell b64-cell--byte">M<br><span class="b64-bits">01001101</span></span>
          <span class="b64-cell b64-cell--byte">a<br><span class="b64-bits">01100001</span></span>
          <span class="b64-cell b64-cell--byte">n<br><span class="b64-bits">01101110</span></span>
        </div>
        <div class="b64-row b64-row--groups">
          <span class="b64-cell b64-cell--label">6-bit groups</span>
          <span class="b64-cell b64-cell--group">010011<br><span class="b64-bits">T</span></span>
          <span class="b64-cell b64-cell--group">010110<br><span class="b64-bits">W</span></span>
          <span class="b64-cell b64-cell--group">000101<br><span class="b64-bits">F</span></span>
          <span class="b64-cell b64-cell--group">101110<br><span class="b64-bits">u</span></span>
        </div>
      </div>

      <p>So <code>Man</code> (3 bytes) encodes to <code>TWFu</code> (4 chars). Every 3 input bytes produce 4 output characters — a <strong>33% size overhead</strong>.</p>

      <h3>Padding</h3>
      <p>When the input length is not a multiple of 3, Base64 adds <code>=</code> padding characters to make the output length a multiple of 4:</p>
      <div class="code-block">
        <span class="code-header">padding examples</span>
        <code>"Ma"   (2 bytes) → "TWE="   (1 padding char)
"M"    (1 byte)  → "TQ=="  (2 padding chars)
"Man"  (3 bytes) → "TWFu"  (no padding)</code>
      </div>
    </section>

    <section class="guide-section">
      <h2>Common use cases</h2>
      <ul>
        <li><strong>Data URIs</strong> — embed images directly in HTML or CSS without a separate file request: <code>src="data:image/png;base64,iVBOR..."</code></li>
        <li><strong>Email attachments (MIME)</strong> — email protocols were designed for 7-bit ASCII. Base64 encodes binary attachments so they survive transit.</li>
        <li><strong>JSON payloads</strong> — JSON only supports text. Binary data (images, files, keys) must be Base64-encoded before being included in a JSON field.</li>
        <li><strong>HTTP Basic Auth</strong> — credentials are sent as <code>Authorization: Basic base64(user:password)</code>.</li>
        <li><strong>JWT tokens</strong> — each part of a JWT (header, payload, signature) is Base64url-encoded (a URL-safe variant).</li>
        <li><strong>Cryptographic keys</strong> — PEM files (.pem, .crt) store keys and certificates as Base64-encoded DER data.</li>
      </ul>
    </section>

    <section class="guide-section">
      <h2>Base64 vs Base64url</h2>
      <p>Standard Base64 uses <code>+</code> and <code>/</code> characters that have special meanings in URLs, requiring percent-encoding. <strong>Base64url</strong> is a URL-safe variant that solves this:</p>

      <div class="b64-compare">
        <div class="b64-compare-col">
          <div class="b64-compare-head">Base64 (standard)</div>
          <div class="b64-compare-row"><span>Alphabet</span><code>A–Z a–z 0–9 + /</code></div>
          <div class="b64-compare-row"><span>Padding</span><code>=</code></div>
          <div class="b64-compare-row"><span>Used in</span><span>Files, email, data URIs</span></div>
        </div>
        <div class="b64-compare-col">
          <div class="b64-compare-head b64-compare-head--alt">Base64url (URL-safe)</div>
          <div class="b64-compare-row"><span>Alphabet</span><code>A–Z a–z 0–9 - _</code></div>
          <div class="b64-compare-row"><span>Padding</span><span>Omitted</span></div>
          <div class="b64-compare-row"><span>Used in</span><span>JWTs, OAuth tokens, URLs</span></div>
        </div>
      </div>
    </section>

    <section class="guide-section">
      <h2>What Base64 is NOT</h2>
      <div class="guide-callout guide-callout--warn">
        <strong>Base64 is not encryption.</strong> It is completely reversible without any key. Encoding data in Base64 provides zero security — anyone can decode it in seconds.
      </div>
      <div class="guide-callout guide-callout--info">
        <strong>Base64 is not compression.</strong> It adds ~33% overhead. If you need to reduce size, use gzip or Brotli instead.
      </div>
      <p>Base64 is purely a <em>representation</em> format — it makes binary data safe to handle in text contexts. Nothing more.</p>
    </section>

  </article>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* ── Byte encoding visual ─────────────────────────────────── */
.b64-visual {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  margin: 14px 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}

.b64-row {
  display: flex;
  border-bottom: 1px solid var(--c-border);
}
.b64-row:last-child { border-bottom: none; }

.b64-cell {
  padding: 10px 14px;
  border-right: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 4px;
  line-height: 1.4;
  color: var(--c-t2);
}
.b64-cell:last-child { border-right: none; }

.b64-cell--label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-t4);
  background: var(--c-subtle);
  min-width: 90px;
  align-items: flex-start;
  text-align: left;
}

.b64-cell--byte  { flex: 1; font-size: 15px; font-weight: 700; color: #63B3ED; }
.b64-cell--group { flex: 1; font-size: 13px; font-weight: 600; color: #68D391; }

.b64-row--bytes  { background: rgba(99, 179, 237, 0.04); }
.b64-row--groups { background: rgba(104, 211, 145, 0.04); }

.b64-bits { font-size: 10px; color: var(--c-t4); font-weight: 400; letter-spacing: 0.05em; }

/* ── Base64 vs Base64url comparison ───────────────────────── */
.b64-compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 14px 0;
}

.b64-compare-col {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  font-size: 13px;
}

.b64-compare-head {
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: var(--c-subtle);
  color: var(--c-t3);
  border-bottom: 1px solid var(--c-border);
}

.b64-compare-head--alt {
  background: rgba(249, 115, 22, 0.06);
  color: #F97316;
}

.b64-compare-row {
  display: flex;
  gap: 8px;
  padding: 9px 14px;
  border-bottom: 1px solid var(--c-border);
  align-items: baseline;
}
.b64-compare-row:last-child { border-bottom: none; }

.b64-compare-row > span:first-child {
  font-size: 11px;
  font-weight: 600;
  color: var(--c-t4);
  min-width: 55px;
  flex-shrink: 0;
}

.b64-compare-row > span:last-child { color: var(--c-t3); }

.b64-compare-row code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  background: rgba(249, 115, 22, 0.08);
  color: #F97316;
  padding: 1px 5px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .b64-compare { grid-template-columns: 1fr; }
  .b64-visual { font-size: 11px; }
  .b64-cell--label { min-width: 70px; }
}
</style>
