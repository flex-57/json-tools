<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        <strong>HMAC</strong> (Hash-based Message Authentication Code) combines a hash function with a secret key
        to produce a signature that proves two things at once: the message hasn't been altered, and it was
        signed by someone who holds the key. It's defined in <a href="https://datatracker.ietf.org/doc/html/rfc2104" target="_blank" rel="noopener">RFC 2104</a>
        and works with any underlying hash function, SHA-1, SHA-256, SHA-384, or SHA-512 are the common choices today.
      </p>
      <p>
        A plain hash answers "did this data change?" — anyone can compute <code>SHA-256(message)</code> and check
        it matches. HMAC answers a stronger question: "did someone who knows the secret produce this?" Without the
        key, an attacker can't forge a valid signature even if they know exactly which hash function is in use.
      </p>
    </section>

    <section class="guide-section">
      <h2>The construction: two hash passes, not one</h2>
      <p>
        HMAC doesn't just hash the key and message together. It nests two hash operations, mixing the key into
        each with a different padding constant:
      </p>
      <pre class="code-block"><code>HMAC(key, message) = H( (key' XOR opad) || H( (key' XOR ipad) || message ) )

ipad = 0x36 repeated to the hash's block size
opad = 0x5c repeated to the hash's block size
key' = key, hashed down or zero-padded to exactly one block</code></pre>
      <p>
        The inner hash binds the key to the message; the outer hash binds the key to that result. This two-pass
        structure is what makes HMAC resistant to length-extension attacks, a real weakness in the naive
        approach of hashing a secret and message concatenated together (see the FAQ below).
      </p>
    </section>

    <section class="guide-section">
      <h2>Plain hash vs HMAC</h2>
      <table class="cheat-table">
        <thead><tr><th/><th>Plain hash</th><th>HMAC</th></tr></thead>
        <tbody>
          <tr><td>Inputs</td><td>Message only</td><td>Message + secret key</td></tr>
          <tr><td>Anyone can compute it</td><td>Yes</td><td>Only with the key</td></tr>
          <tr><td>Proves</td><td>Data integrity</td><td>Integrity + authenticity</td></tr>
          <tr><td>Typical use</td><td>Checksums, deduplication</td><td>Webhook signatures, API request signing, JWT HS256/384/512</td></tr>
        </tbody>
      </table>
      <p>
        This site's <NuxtLink to="/tools/hash" class="guide-inline-link">Hash Generator</NuxtLink> computes the
        plain version; the <NuxtLink to="/tools/hmac" class="guide-inline-link">HMAC Generator</NuxtLink> adds the
        secret-key input and shows how the same message produces a completely different signature once a key is involved.
      </p>
    </section>

    <section class="guide-section">
      <h2>Where HMAC shows up</h2>
      <p>
        <strong>Webhook verification</strong>: Stripe, GitHub, and most webhook providers sign the request body
        with HMAC-SHA256 and send the signature in a header (<code>Stripe-Signature</code>,
        <code>X-Hub-Signature-256</code>). The receiving server recomputes the HMAC with its copy of the shared
        secret and compares, no request is trusted unless the signature matches.
      </p>
      <p>
        <strong>AWS SigV4</strong> chains HMAC-SHA256 through several derivation steps to sign API requests
        without ever putting the raw secret key on the wire. <strong>JWTs</strong> signed with the HS256, HS384,
        or HS512 algorithm are literally the token's header and payload run through HMAC with the API's shared
        secret, that's what makes a tampered JWT fail verification.
      </p>
    </section>

  </div>
</template>

<style scoped>
.code-block { background: var(--c-faint); border: 1px solid var(--c-border); border-radius: 8px; padding: 16px 18px; overflow-x: auto; margin: 12px 0; }
.code-block code { font-family: var(--font-mono); font-size: 12.5px; color: var(--c-t2); line-height: 1.7; white-space: pre; }
</style>
