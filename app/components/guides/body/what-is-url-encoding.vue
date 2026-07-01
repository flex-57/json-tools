<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        <strong>URL encoding</strong> (also called <em>percent-encoding</em>) is the process of converting characters
        into a format that can be safely transmitted in a URL. It replaces unsafe characters with a
        <code>%</code> sign followed by two hexadecimal digits representing the character's UTF-8 byte value.
        A space, for example, becomes <code>%20</code>.
      </p>
      <p>
        The rules are defined in <a href="https://datatracker.ietf.org/doc/html/rfc3986" target="_blank" rel="noopener">RFC 3986</a>.
        Every URL you see in a browser is subject to these rules — only a limited set of characters are allowed as-is.
      </p>
    </section>

    <section class="guide-section">
      <h2>Safe vs reserved characters</h2>
      <p>
        RFC 3986 divides URL characters into two groups:
      </p>
      <ul>
        <li><strong>Unreserved characters</strong> — safe to use anywhere without encoding: <code>A–Z a–z 0–9 - _ . ~</code></li>
        <li><strong>Reserved characters</strong> — have special meaning in URLs (<code>: / ? # [ ] @ ! $ &amp; ' ( ) * + , ; =</code>). They must be percent-encoded when used as data, not as URL structure.</li>
      </ul>
      <p>
        Any character outside these two groups — including spaces, accented characters, emoji, and symbols
        like <code>&lt;</code> or <code>&gt;</code> — must always be encoded.
      </p>
    </section>

    <section class="guide-section">
      <h2>How encoding works</h2>
      <p>
        Each byte of the UTF-8 representation of a character is encoded as <code>%XX</code>, where <code>XX</code>
        is the byte's hexadecimal value. For single-byte ASCII characters this is straightforward:
      </p>
      <table class="cheat-table">
        <thead><tr><th>Character</th><th>Encoded</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td>Space</td><td><code>%20</code></td><td>Byte 0x20 in ASCII</td></tr>
          <tr><td><code>/</code></td><td><code>%2F</code></td><td>Reserved path separator</td></tr>
          <tr><td><code>?</code></td><td><code>%3F</code></td><td>Reserved query delimiter</td></tr>
          <tr><td><code>&amp;</code></td><td><code>%26</code></td><td>Reserved parameter separator</td></tr>
          <tr><td><code>=</code></td><td><code>%3D</code></td><td>Reserved key=value separator</td></tr>
          <tr><td><code>#</code></td><td><code>%23</code></td><td>Reserved fragment delimiter</td></tr>
          <tr><td><code>@</code></td><td><code>%40</code></td><td>Reserved authority delimiter</td></tr>
          <tr><td><code>+</code></td><td><code>%2B</code></td><td>Ambiguous (means space in forms)</td></tr>
          <tr><td><code>é</code></td><td><code>%C3%A9</code></td><td>Two UTF-8 bytes: 0xC3 0xA9</td></tr>
          <tr><td><code>€</code></td><td><code>%E2%82%AC</code></td><td>Three UTF-8 bytes</td></tr>
        </tbody>
      </table>
    </section>

    <section class="guide-section">
      <h2>URL encoding vs form encoding</h2>
      <p>
        There are two different encoding schemes you will encounter, and they differ in one key place: the space character.
      </p>
      <ul>
        <li><strong>Percent-encoding (RFC 3986)</strong> — space → <code>%20</code>. Used in path segments and query strings built manually or in headers.</li>
        <li><strong>Form encoding (<code>application/x-www-form-urlencoded</code>)</strong> — space → <code>+</code>. Used when an HTML form is submitted with the default method. The <code>+</code> is only valid in the query string, not in path segments.</li>
      </ul>
      <p>
        When in doubt, use <code>%20</code> — it is unambiguous in all contexts.
      </p>
    </section>

    <section class="guide-section">
      <h2>JavaScript: encodeURI vs encodeURIComponent</h2>
      <p>
        JavaScript provides two built-in functions, and choosing the wrong one is a common source of bugs:
      </p>
      <table class="cheat-table">
        <thead><tr><th>Function</th><th>Does NOT encode</th><th>Use when</th></tr></thead>
        <tbody>
          <tr>
            <td><code>encodeURI()</code></td>
            <td><code>A–Z a–z 0–9 - _ . ~ : / ? # [ ] @ ! $ &amp; ' ( ) * + , ; =</code></td>
            <td>Encoding a complete URL to make it safe for a header or attribute without breaking its structure</td>
          </tr>
          <tr>
            <td><code>encodeURIComponent()</code></td>
            <td><code>A–Z a–z 0–9 - _ . ~ !</code></td>
            <td>Encoding individual query parameter values or path segments — it encodes <code>/ ? # &amp; =</code> and everything else</td>
          </tr>
        </tbody>
      </table>
      <p>
        Rule of thumb: if you are encoding a <em>value</em> that goes inside a URL (a search query, a redirect URI,
        a file name), use <code>encodeURIComponent()</code>. If you are encoding the entire URL itself,
        use <code>encodeURI()</code>.
      </p>
    </section>

    <section class="guide-section">
      <h2>Common pitfalls</h2>
      <ul>
        <li><strong>Double encoding</strong> — encoding an already-encoded string turns <code>%20</code> into <code>%2520</code>. Always decode first, or check whether the input is already encoded.</li>
        <li><strong>Encoding the <code>&amp;</code> separator</strong> — in <code>?a=1&amp;b=2</code>, the <code>&amp;</code> is structure, not data. Only encode <code>&amp;</code> when it appears inside a value.</li>
        <li><strong>OAuth and redirect URIs</strong> — the <code>redirect_uri</code> parameter must be percent-encoded, and the value itself may contain characters like <code>=</code> or <code>&amp;</code> that need encoding inside the outer query string.</li>
      </ul>
      <p>
        URL encoding is closely related to <NuxtLink to="/guides/what-is-base64" class="guide-inline-link">Base64 encoding</NuxtLink> —
        both convert data to a safe text representation, but Base64 is for binary data in text channels,
        while percent-encoding is specifically for URLs.
      </p>
    </section>

  </div>
</template>
