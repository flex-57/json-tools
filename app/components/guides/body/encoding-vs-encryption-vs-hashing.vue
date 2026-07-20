<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        Encoding, encryption, and hashing all transform data into a different shape, which is exactly why
        they get mixed up. They exist for three unrelated purposes: encoding is about
        <strong>compatibility</strong>, encryption is about <strong>confidentiality</strong>, and hashing is
        about <strong>integrity and verification</strong>. Using one where another is needed is a real,
        common security mistake — most often, treating Base64 as if it were encryption.
      </p>
    </section>

    <section class="guide-section">
      <h2>Side by side</h2>
      <table class="cheat-table">
        <thead><tr><th/><th>Encoding</th><th>Encryption</th><th>Hashing</th></tr></thead>
        <tbody>
          <tr><td>Purpose</td><td>Safe transport / storage in a system with format restrictions</td><td>Keep data secret from anyone without the key</td><td>Verify integrity or store a value without keeping the original</td></tr>
          <tr><td>Reversible?</td><td>Yes, always, no key needed</td><td>Yes, but only with the correct key</td><td>No — one-way by design</td></tr>
          <tr><td>Needs a secret?</td><td>No</td><td>Yes (a key)</td><td>No (though a salt is added for password storage)</td></tr>
          <tr><td>Example</td><td><NuxtLink to="/guides/what-is-base64" class="guide-inline-link">Base64</NuxtLink>, <NuxtLink to="/guides/what-is-url-encoding" class="guide-inline-link">URL encoding</NuxtLink></td><td>AES, RSA</td><td><NuxtLink to="/guides/what-is-hash" class="guide-inline-link">SHA-256, bcrypt</NuxtLink></td></tr>
        </tbody>
      </table>
    </section>

    <section class="guide-section">
      <h2>Encoding: making data fit, not hiding it</h2>
      <p>
        Encoding schemes like Base64 or percent-encoding exist because some systems only accept a limited
        character set — an email body, a URL, a JSON string — and the data to embed (binary content, or
        characters the format reserves for its own syntax) does not fit as-is. Encoding re-represents the same
        data using an allowed character set. Anyone can reverse it instantly with no secret required: it is a
        public, standardized, two-way transformation, not a security measure of any kind.
      </p>
    </section>

    <section class="guide-section">
      <h2>Encryption: reversible, but only with the key</h2>
      <p>
        Encryption scrambles data using an algorithm and a secret key, producing ciphertext that is
        computationally infeasible to reverse without that key. <strong>Symmetric</strong> encryption (AES) uses
        the same key to encrypt and decrypt — fast, used for encrypting data at rest or in transit once a
        shared key is established. <strong>Asymmetric</strong> encryption (RSA) uses a public key to encrypt and
        a separate private key to decrypt — slower, but solves the problem of exchanging a secret over an
        insecure channel in the first place.
      </p>
      <p>
        A <NuxtLink to="/guides/what-is-jwt" class="guide-inline-link">standard JWT</NuxtLink> is signed, not
        encrypted: its payload is Base64url-encoded (reversible by anyone) and a signature proves it was not
        tampered with, but the claims inside remain fully readable without any key. Actual JWT encryption
        (JWE) is a distinct, less common variant.
      </p>
    </section>

    <section class="guide-section">
      <h2>Hashing: one-way, for verification</h2>
      <p>
        A hash function maps input of any size to a fixed-size digest, and — deliberately — there is no
        inverse operation to recover the input from the digest. This is exactly the property needed for
        storing passwords: the server never needs to store or read back the original password, only compare
        a freshly computed hash against the stored one. It is also used to verify a downloaded file was not
        corrupted or tampered with, by comparing its hash against a published value.
      </p>
      <p>
        For password storage specifically, a fast general-purpose hash (SHA-256) is the wrong tool — see
        <NuxtLink to="/guides/what-is-hash" class="guide-inline-link">What is a Hash Function?</NuxtLink>
        for why bcrypt/Argon2/scrypt exist, and
        <NuxtLink to="/guides/password-entropy-explained" class="guide-inline-link">Password Strength and Entropy</NuxtLink>
        for what actually makes a password resistant to guessing in the first place.
      </p>
    </section>

    <section class="guide-section">
      <h2>The most common mistake: Base64 is not encryption</h2>
      <p>
        Base64-encoding a password or API key and calling it "encrypted" is a frequent, genuine security bug.
        Base64 has no key and no secret — decoding it back to plaintext takes one line of code in any
        language, or a five-second paste into an online decoder. If a value needs to stay secret, it needs
        encryption (or, if it is a credential being verified rather than retrieved, hashing) — encoding alone
        provides exactly zero confidentiality.
      </p>
    </section>

  </div>
</template>
