<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        A <strong>hash function</strong> takes an input of any size and produces a fixed-length output called a
        <em>digest</em> or <em>hash</em>. Change a single character in the input and the entire output changes
        completely — this is called the <em>avalanche effect</em>. Hash functions are one-way: you cannot
        reconstruct the original input from its hash.
      </p>
      <p>
        They are fundamental to computer security — used to verify file integrity, store passwords, sign
        documents, deduplicate content, and power blockchain systems.
      </p>
    </section>

    <section class="guide-section">
      <h2>Four properties of a cryptographic hash function</h2>
      <ul>
        <li><strong>Deterministic</strong> — the same input always produces the same output.</li>
        <li><strong>Fixed-length output</strong> — regardless of input size, the digest is always the same number of bits.</li>
        <li><strong>Avalanche effect</strong> — a tiny change in input completely changes the output. <code>hello</code> and <code>hello!</code> produce entirely different hashes.</li>
        <li><strong>Collision resistance</strong> — it should be computationally infeasible to find two different inputs that produce the same hash.</li>
      </ul>
    </section>

    <section class="guide-section">
      <h2>MD5, SHA-1, SHA-256, SHA-512 compared</h2>
      <table class="cheat-table">
        <thead><tr><th>Algorithm</th><th>Output size</th><th>Speed</th><th>Security</th><th>Common use</th></tr></thead>
        <tbody>
          <tr>
            <td><code>MD5</code></td>
            <td>128 bit (32 hex)</td>
            <td>Very fast</td>
            <td class="sec-broken">Broken</td>
            <td>Non-security checksums, legacy systems</td>
          </tr>
          <tr>
            <td><code>SHA-1</code></td>
            <td>160 bit (40 hex)</td>
            <td>Fast</td>
            <td class="sec-broken">Broken</td>
            <td>Git commit IDs (transitioning to SHA-256)</td>
          </tr>
          <tr>
            <td><code>SHA-256</code></td>
            <td>256 bit (64 hex)</td>
            <td>Fast</td>
            <td class="sec-ok">Secure</td>
            <td>TLS certificates, JWT signatures (HS256), file integrity</td>
          </tr>
          <tr>
            <td><code>SHA-512</code></td>
            <td>512 bit (128 hex)</td>
            <td>Slightly slower</td>
            <td class="sec-ok">Secure</td>
            <td>High-security applications, 64-bit platforms where it is faster than SHA-256</td>
          </tr>
        </tbody>
      </table>
      <p>
        <em>Broken</em> means that collisions (two inputs producing the same hash) can be computed in
        practice. MD5 collisions take seconds on modern hardware. Never use MD5 or SHA-1 for anything
        security-critical.
      </p>
      <p>This site's <NuxtLink to="/tools/hash" class="guide-inline-link">Hash Generator</NuxtLink> computes MD5, SHA-1, SHA-256, and SHA-512 digests for any text instantly.</p>
    </section>

    <section class="guide-section">
      <h2>Use cases</h2>
      <h3>File integrity and checksums</h3>
      <p>
        Download a file, compute its SHA-256 hash, compare it to the hash published by the author.
        If they match, the file was not tampered with in transit. Package managers (npm, pip, apt) do
        this automatically for every package they install.
      </p>
      <h3>Content deduplication</h3>
      <p>
        Git hashes every file and every commit. If two files have the same SHA-1 hash, Git considers
        them identical without comparing their content byte-by-byte. This makes repositories fast and
        space-efficient.
      </p>
      <h3>Digital signatures</h3>
      <p>
        To sign a document, you hash it first, then encrypt the hash with your private key. The recipient
        decrypts the hash with your public key and verifies it matches their own hash of the document.
        Signing the hash is much faster than signing the entire document.
      </p>
      <h3>Password storage</h3>
      <p>
        Storing raw passwords is catastrophic — if the database is compromised, every account is exposed.
        Instead, store the hash. When the user logs in, hash their input and compare it to the stored hash.
      </p>
      <p>
        <strong>Important:</strong> never use MD5, SHA-1, or even raw SHA-256 to hash passwords.
        These algorithms are designed to be fast, which makes brute-force attacks trivial. Use a
        password hashing algorithm specifically designed to be slow and salt-aware:
        <strong>bcrypt</strong>, <strong>Argon2</strong>, or <strong>scrypt</strong>.
      </p>
    </section>

    <section class="guide-section">
      <h2>Hashes vs encryption</h2>
      <p>
        Hashing and encryption are fundamentally different:
      </p>
      <table class="cheat-table">
        <thead><tr><th/><th>Hashing</th><th>Encryption</th></tr></thead>
        <tbody>
          <tr><td>Reversible?</td><td>No — one-way only</td><td>Yes — with the key</td></tr>
          <tr><td>Output size</td><td>Fixed</td><td>Variable (close to input size)</td></tr>
          <tr><td>Requires a key?</td><td>No</td><td>Yes</td></tr>
          <tr><td>Use case</td><td>Verification, fingerprinting</td><td>Protecting data in transit or at rest</td></tr>
        </tbody>
      </table>
      <p>
        Hashing is also distinct from <NuxtLink to="/guides/what-is-base64" class="guide-inline-link">Base64 encoding</NuxtLink>
        — Base64 is fully reversible and adds no security, it simply converts binary data to text.
      </p>
    </section>

  </div>
</template>

<style scoped>
.sec-broken { color: #ef4444; font-weight: 600; }
.sec-ok     { color: #22c55e; font-weight: 600; }
</style>
