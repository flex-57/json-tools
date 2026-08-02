<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        A <strong>number base</strong> (or radix) is how many distinct digits a counting system uses before
        it carries over to the next column. Decimal — the system taught in school — is base 10: ten digits,
        <code>0</code> through <code>9</code>, and the column after <code>9</code> rolls over to <code>10</code>.
        Binary, octal, and hexadecimal follow the exact same positional logic with a different digit count.
      </p>
      <p>
        Computers do not have a native concept of decimal. Every value in memory is a sequence of on/off
        switches — binary — and octal and hexadecimal exist purely as more compact, human-readable ways to
        write down binary values without losing the exact bit pattern.
      </p>
    </section>

    <section class="guide-section">
      <h2>The three bases that matter</h2>
      <table class="cheat-table">
        <thead><tr><th>Base</th><th>Digits used</th><th>Bits per digit</th><th>Where you'll see it</th></tr></thead>
        <tbody>
          <tr><td><strong>Binary</strong> (base 2)</td><td><code>0 1</code></td><td>1</td><td>The actual bit pattern in memory — everything else is a shorthand for this</td></tr>
          <tr><td><strong>Octal</strong> (base 8)</td><td><code>0–7</code></td><td>3</td><td>Unix file permissions (<code>chmod 755</code>)</td></tr>
          <tr><td><strong>Hexadecimal</strong> (base 16)</td><td><code>0–9, A–F</code></td><td>4</td><td>Colors, memory addresses, byte values, hashes, UUIDs</td></tr>
        </tbody>
      </table>
      <p>
        Hex won over octal for most modern uses because a byte (8 bits) splits evenly into two 4-bit
        hex digits, but not evenly into 8/3 octal digits — hex maps to bit patterns more cleanly.
      </p>
    </section>

    <section class="guide-section">
      <h2>Conversion table: 0 to 15</h2>
      <table class="cheat-table">
        <thead><tr><th>Decimal</th><th>Binary</th><th>Octal</th><th>Hex</th></tr></thead>
        <tbody>
          <tr><td>0</td><td>0000</td><td>0</td><td>0</td></tr>
          <tr><td>1</td><td>0001</td><td>1</td><td>1</td></tr>
          <tr><td>2</td><td>0010</td><td>2</td><td>2</td></tr>
          <tr><td>7</td><td>0111</td><td>7</td><td>7</td></tr>
          <tr><td>8</td><td>1000</td><td>10</td><td>8</td></tr>
          <tr><td>9</td><td>1001</td><td>11</td><td>9</td></tr>
          <tr><td>10</td><td>1010</td><td>12</td><td>A</td></tr>
          <tr><td>15</td><td>1111</td><td>17</td><td>F</td></tr>
        </tbody>
      </table>
      <p>
        Past 9, hexadecimal keeps counting with letters: <code>A</code> = 10, <code>B</code> = 11, up to
        <code>F</code> = 15. One hex digit always covers exactly the same range as 4 binary digits, which is
        the whole reason it is convenient — 15 is the largest value 4 bits can hold, and <code>F</code> is
        the largest single hex digit.
      </p>
    </section>

    <section class="guide-section">
      <h2>Converting hex to binary is just substitution</h2>
      <p>
        Because one hex digit is exactly 4 bits, converting hex to binary (or back) needs no arithmetic —
        just replace each digit with its 4-bit pattern from the table above:
      </p>
      <pre class="code-block"><code>0xC0  →  1100 0000
0xA8  →  1010 1000
0xFF  →  1111 1111</code></pre>
      <p>
        Decimal does not divide evenly into binary this way, which is why converting decimal to binary needs
        actual division (repeatedly dividing by 2 and reading the remainders bottom-up), while hex-to-binary
        is pure lookup.
      </p>
      <p>This site's <NuxtLink to="/tools/number-base" class="guide-inline-link">Number Base Converter</NuxtLink> converts any value between binary, octal, decimal, and hex instantly.</p>
    </section>

    <section class="guide-section">
      <h2>Reading number literals in code</h2>
      <p>Most C-family languages (JavaScript, Python, Rust, Go) recognize the same prefixes for non-decimal literals:</p>
      <pre class="code-block"><code>0xFF        // hexadecimal — 255
0b11111111  // binary — 255
0o377       // octal — 255
1_000_000   // underscore as a digit separator (readability only)</code></pre>
      <p>
        C and C++ are the outliers: a bare leading zero means octal (<code>0755</code>, not <code>0o755</code>),
        a frequent source of bugs when a decimal number is accidentally zero-padded and silently reinterpreted.
      </p>
    </section>

    <section class="guide-section">
      <h2>Where each base shows up in practice</h2>
      <ul>
        <li><strong>Unix permissions</strong> — <code>chmod 755</code> means owner <code>rwx</code> (7 = 111),
          group <code>r-x</code> (5 = 101), others <code>r-x</code> (5 = 101). Octal exists here because 3 bits
          maps exactly to the 3 permission flags (read/write/execute).</li>
        <li><strong>CSS/HTML colors</strong> — <code>#RRGGBB</code>, each channel one byte (00–FF) in hex.</li>
        <li><strong>Network addresses</strong> — <code>192.168.1.1</code> is <code>0xC0A80101</code> as a
          32-bit hex integer; subnet masks like <code>255.255.255.0</code> are 24 binary ones followed by 8 zeros.</li>
        <li><strong>Character encodings</strong> — ASCII and Unicode code points are conventionally written in
          hex: the letter <code>A</code> is <code>0x41</code> (decimal 65).</li>
        <li><strong>Hashes and UUIDs</strong> — a
          <NuxtLink to="/guides/what-is-hash" class="guide-inline-link">SHA-256 digest</NuxtLink>
          or a <NuxtLink to="/guides/what-is-uuid" class="guide-inline-link">UUID</NuxtLink> is displayed as
          hex because the raw value is binary and hex is the standard compact text representation for it.</li>
      </ul>
    </section>

  </div>
</template>

<style scoped>
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 12px 0; }
.code-block code { font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
</style>
