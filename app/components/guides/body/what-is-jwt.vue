<template>
  <article class="guide-body">

    <section class="guide-section">
      <h2>What is a JWT?</h2>
      <p>A <strong>JWT (JSON Web Token)</strong> is an open standard (<a href="https://datatracker.ietf.org/doc/html/rfc7519" target="_blank" rel="noopener noreferrer">RFC 7519</a>) that defines a compact, self-contained way to securely transmit information between two parties as a JSON object. The information is digitally signed, which means it can be verified and trusted.</p>
      <p>JWTs are most commonly used for <strong>authentication</strong>: once a user logs in, the server issues a JWT. The client includes that token in subsequent requests, and the server validates it without needing to query a database on every call.</p>
    </section>

    <section class="guide-section">
      <h2>The three parts of a JWT</h2>
      <p>A JWT is a string of three base64url-encoded parts separated by dots:</p>
      <div class="jwt-anatomy">
        <span class="jwt-part jwt-part--header">header</span>
        <span class="jwt-dot">.</span>
        <span class="jwt-part jwt-part--payload">payload</span>
        <span class="jwt-dot">.</span>
        <span class="jwt-part jwt-part--sig">signature</span>
      </div>
      <div class="code-block">
        <span class="code-header">example JWT</span>
        <code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9<span class="code-dot">.</span>eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNzE2MjM5MDIyLCJleHAiOjE3MTYyNDI2MjJ9<span class="code-dot">.</span>r8d5mFpCpFTKJzn0xqQ4p9klO8KxD2yKpBiAqJf1234</code>
      </div>

      <h3>Header</h3>
      <p>The header declares the token type (<code>JWT</code>) and the signing algorithm (<code>alg</code>). After base64url decoding:</p>
      <div class="code-block">
        <span class="code-header">decoded header</span>
        <code>{"alg": "HS256", "typ": "JWT"}</code>
      </div>

      <h3>Payload</h3>
      <p>The payload contains <strong>claims</strong> — statements about the user or additional data. Standard claims include:</p>
      <ul>
        <li><code>sub</code> — subject (usually the user ID)</li>
        <li><code>iat</code> — issued at (Unix timestamp)</li>
        <li><code>exp</code> — expiration time (Unix timestamp)</li>
        <li><code>iss</code> — issuer (who created the token)</li>
        <li><code>aud</code> — audience (who the token is intended for)</li>
      </ul>
      <div class="code-block">
        <span class="code-header">decoded payload</span>
        <code>{"sub": "1234567890", "name": "Jane Doe", "iat": 1716239022, "exp": 1716242622}</code>
      </div>
      <div class="guide-callout guide-callout--warn">
        <strong>Important:</strong> The payload is base64url-encoded, not encrypted. Anyone who has the token can decode and read the payload. Never store sensitive data (passwords, secrets) in a JWT payload.
      </div>

      <h3>Signature</h3>
      <p>The signature is computed by taking the encoded header and payload, joining them with a dot, and signing with the algorithm and a secret key:</p>
      <div class="code-block">
        <span class="code-header">signature (HS256)</span>
        <code>HMACSHA256(base64url(header) + "." + base64url(payload), secretKey)</code>
      </div>
      <p>The signature guarantees that the token hasn't been tampered with. If anyone modifies the payload, the signature no longer matches and the server rejects the token.</p>
    </section>

    <section class="guide-section">
      <h2>How JWT authentication works</h2>
      <ol class="guide-steps">
        <li><strong>Login</strong> — the user submits credentials. The server verifies them and creates a signed JWT.</li>
        <li><strong>Storage</strong> — the client receives the token and stores it (cookie or memory).</li>
        <li><strong>Request</strong> — on each API call, the client sends the token in the <code>Authorization</code> header:<br><code>Authorization: Bearer &lt;token&gt;</code></li>
        <li><strong>Verification</strong> — the server validates the signature and checks <code>exp</code>. If valid, the request is authorized. No database lookup needed.</li>
      </ol>
    </section>

    <section class="guide-section">
      <h2>Signing algorithms</h2>

      <!-- Desktop: grid table -->
      <div class="algo-table">
        <div class="algo-row algo-row--head">
          <span>Algorithm</span>
          <span>Type</span>
          <span>Use case</span>
        </div>
        <div v-for="a in ALGORITHMS" :key="a.code" class="algo-row">
          <span><code>{{ a.code }}</code></span>
          <span>{{ a.type }}</span>
          <span>{{ a.use }}</span>
        </div>
      </div>

      <!-- Mobile: accordion -->
      <div class="algo-accordion">
        <div
          v-for="(a, i) in ALGORITHMS"
          :key="a.code"
          class="algo-acc-item"
          :class="{ 'algo-acc-item--open': algoOpen === i }"
        >
          <button class="algo-acc-trigger" @click="algoOpen = algoOpen === i ? null : i">
            <code>{{ a.code }}</code>
            <svg class="algo-acc-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div v-if="algoOpen === i" class="algo-acc-body">
            <div class="algo-acc-row"><span class="algo-acc-label">Type</span><span>{{ a.type }}</span></div>
            <div class="algo-acc-row"><span class="algo-acc-label">Use case</span><span>{{ a.use }}</span></div>
          </div>
        </div>
      </div>

      <p>When in doubt, use <strong>HS256</strong> for simple internal services and <strong>RS256</strong> when multiple services need to verify tokens without sharing a secret.</p>
    </section>

    <section class="guide-section">
      <h2>Security best practices</h2>
      <ul>
        <li><strong>Always verify the signature</strong> — never decode a JWT and trust the payload without checking the signature first.</li>
        <li><strong>Check the <code>exp</code> claim</strong> — reject expired tokens even if the signature is valid.</li>
        <li><strong>Use short expiration times</strong> — 15–60 minutes for access tokens, longer for refresh tokens.</li>
        <li><strong>Store in HttpOnly cookies</strong> — immune to XSS attacks, unlike localStorage.</li>
        <li><strong>Use HTTPS</strong> — tokens in transit must be encrypted.</li>
        <li><strong>Validate the <code>alg</code> header</strong> — some libraries historically accepted <code>"alg": "none"</code>, bypassing signature verification entirely. Always enforce the expected algorithm server-side.</li>
      </ul>
    </section>

  </article>
</template>

<script setup lang="ts">
const ALGORITHMS = [
  { code: 'HS256 / HS384 / HS512', type: 'Symmetric (HMAC)', use: 'Single service — one shared secret for both signing and verification' },
  { code: 'RS256 / RS384 / RS512', type: 'Asymmetric (RSA)', use: "Distributed systems — private key signs, public key verifies (services don't need the secret)" },
  { code: 'ES256 / ES384 / ES512', type: 'Asymmetric (ECDSA)', use: 'Same as RSA but smaller tokens and faster operations' },
]

const algoOpen = ref<number | null>(null)
</script>

<style scoped>
/* ── JWT anatomy ──────────────────────────────────────────── */
.jwt-anatomy {
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 16px 0;
  flex-wrap: wrap;
}

.jwt-part {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 6px;
}

.jwt-part--header  { background: rgba(99, 179, 237, 0.12); color: #63B3ED; }
.jwt-part--payload { background: rgba(104, 211, 145, 0.12); color: #68D391; }
.jwt-part--sig     { background: rgba(252, 129, 74, 0.12);  color: #FC814A; }

.jwt-dot {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 700;
  color: var(--c-t5);
  line-height: 1;
}

/* ── Algorithm table ──────────────────────────────────────── */
.algo-table {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  margin: 12px 0;
  font-size: 13px;
}

.algo-row {
  display: grid;
  grid-template-columns: 1.6fr 1fr 2fr;
}

.algo-row--head {
  background: var(--c-subtle);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-t4);
}

.algo-row > span {
  padding: 10px 14px;
  border-bottom: 1px solid var(--c-border);
  border-right: 1px solid var(--c-border);
  color: var(--c-t3);
  line-height: 1.5;
}

.algo-row > span:last-child { border-right: none; }
.algo-row:last-child > span { border-bottom: none; }

.algo-row code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  background: rgb(var(--c-brand-rgb) / 0.08);
  color: var(--c-brand);
  padding: 1px 5px;
  border-radius: 4px;
}

/* ── Algo accordion (mobile) ──────────────────────────────── */
.algo-accordion { display: none; }

.algo-acc-item { border-bottom: 1px solid var(--c-border); }
.algo-acc-item:last-child { border-bottom: none; }

.algo-acc-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 14px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}
.algo-acc-trigger:hover,
.algo-acc-item--open .algo-acc-trigger { background: rgb(var(--c-brand-rgb) / 0.04); }

.algo-acc-trigger code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  background: rgb(var(--c-brand-rgb) / 0.08);
  color: var(--c-brand);
  padding: 2px 6px;
  border-radius: 4px;
}

.algo-acc-chevron {
  flex-shrink: 0;
  color: var(--c-t4);
  transition: transform 0.2s ease;
}
.algo-acc-item--open .algo-acc-chevron { transform: rotate(180deg); }

.algo-acc-body { padding: 4px 14px 14px; display: flex; flex-direction: column; gap: 8px; }

.algo-acc-row { display: flex; flex-direction: column; gap: 2px; }

.algo-acc-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--c-t4);
}

.algo-acc-row > span:last-child { font-size: 13px; color: var(--c-t3); line-height: 1.6; }

@media (max-width: 768px) {
  .algo-table { display: none; }
  .algo-accordion {
    display: block;
    border: 1px solid var(--c-border);
    border-radius: 8px;
    overflow: hidden;
    margin: 12px 0;
  }
}
</style>
