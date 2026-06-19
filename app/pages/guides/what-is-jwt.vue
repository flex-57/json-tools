<template>
  <div class="guide-page">
    <div class="guide-inner">

      <!-- Breadcrumb -->
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/" class="bc-link">JSON Tools</NuxtLink>
        <span class="bc-sep" aria-hidden="true">›</span>
        <span class="bc-link">Guides</span>
        <span class="bc-sep" aria-hidden="true">›</span>
        <span class="bc-current">What is a JWT Token?</span>
      </nav>

      <!-- Hero -->
      <header class="guide-hero">
        <h1 class="guide-title">What is a JWT Token?</h1>
        <p class="guide-subtitle">JSON Web Tokens explained: structure, how they work, common algorithms, and security best practices.</p>
        <div class="guide-meta">
          <span class="guide-meta-item">6 min read</span>
          <span class="guide-meta-sep">·</span>
          <span class="guide-meta-item">Updated June 2026</span>
        </div>
      </header>

      <!-- Article body -->
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
          <p>The header declares the token type (<code>JWT</code>) and the signing algorithm (<code>alg</code>). After base64url decoding the first part above:</p>
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
                <div class="algo-acc-row">
                  <span class="algo-acc-label">Type</span>
                  <span>{{ a.type }}</span>
                </div>
                <div class="algo-acc-row">
                  <span class="algo-acc-label">Use case</span>
                  <span>{{ a.use }}</span>
                </div>
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

      <!-- Tool CTAs -->
      <div class="guide-tools">
        <p class="guide-tools-label">Try it now</p>
        <div class="guide-tool-cards">
          <NuxtLink to="/tools/jwt-decoder" class="tool-card">
            <div class="tool-card-icon">⟨/⟩</div>
            <div>
              <div class="tool-card-name">JWT Decoder</div>
              <div class="tool-card-desc">Paste any JWT to instantly inspect its header, payload, and expiration — no server, fully client-side.</div>
            </div>
            <span class="tool-card-arrow">→</span>
          </NuxtLink>
          <NuxtLink to="/tools/jwt-generator" class="tool-card">
            <div class="tool-card-icon">⊕</div>
            <div>
              <div class="tool-card-name">JWT Generator</div>
              <div class="tool-card-desc">Create signed JWTs with custom claims and algorithm (HS256, HS384, HS512) directly in your browser.</div>
            </div>
            <span class="tool-card-arrow">→</span>
          </NuxtLink>
        </div>
      </div>

      <!-- FAQ -->
      <section class="guide-faq">
        <h2 class="guide-faq-title">Frequently asked questions</h2>
        <div class="faq-list">
          <div v-for="(item, i) in FAQS" :key="i" class="faq-item" :class="{ 'faq-item--open': openFaq === i }">
            <button class="faq-q" @click="openFaq = openFaq === i ? null : i">
              {{ item.q }}
              <svg class="faq-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="openFaq === i" class="faq-a">
              <p v-for="(para, j) in item.a" :key="j">{{ para }}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
const FAQS = [
  {
    q: 'Is a JWT encrypted?',
    a: [
      'No. A JWT is base64url-encoded, not encrypted. The payload is readable by anyone who has the token — just paste it into a JWT decoder to see the contents.',
      'If you need to protect the payload from being read (not just tampered with), use a JWE (JSON Web Encryption) instead.',
    ],
  },
  {
    q: 'Where should I store a JWT on the client?',
    a: [
      'The safest option is an HttpOnly cookie — it cannot be accessed by JavaScript, so it is immune to XSS attacks. The browser sends it automatically on every request to the same domain.',
      'Storing in localStorage is common and convenient, but makes the token accessible to any JavaScript running on the page, including malicious scripts.',
    ],
  },
  {
    q: 'Can a JWT be invalidated before it expires?',
    a: [
      'Not natively — that is a known limitation of the stateless JWT model. Once issued, a token is valid until its exp timestamp, regardless of what happens server-side.',
      'Common workarounds: keep expiration times short (15 minutes), use a refresh token rotation pattern, or maintain a server-side token blocklist for critical actions like logout.',
    ],
  },
  {
    q: 'What is the difference between a JWT and a session token?',
    a: [
      'A session token is an opaque random string that maps to user state stored on the server (database or cache). Every request requires a server-side lookup to validate it.',
      'A JWT is self-contained: all the information needed to validate and identify the user is inside the token itself. The server only needs the secret key — no database call.',
    ],
  },
]

const ALGORITHMS = [
  {
    code: 'HS256 / HS384 / HS512',
    type: 'Symmetric (HMAC)',
    use: 'Single service — one shared secret for both signing and verification',
  },
  {
    code: 'RS256 / RS384 / RS512',
    type: 'Asymmetric (RSA)',
    use: 'Distributed systems — private key signs, public key verifies (services don\'t need the secret)',
  },
  {
    code: 'ES256 / ES384 / ES512',
    type: 'Asymmetric (ECDSA)',
    use: 'Same as RSA but smaller tokens and faster operations',
  },
]

const algoOpen = ref<number | null>(null)
const openFaq = ref<number | null>(null)

useSeoMeta({
  title: 'What is a JWT Token? A Complete Guide — JSON Tools',
  description: 'Learn what JSON Web Tokens (JWT) are, how they work, their three-part structure (header, payload, signature), signing algorithms, and security best practices.',
  ogTitle: 'What is a JWT Token? A Complete Guide — JSON Tools',
  ogDescription: 'Learn what JSON Web Tokens (JWT) are, how they work, their three-part structure (header, payload, signature), signing algorithms, and security best practices.',
  twitterTitle: 'What is a JWT Token? A Complete Guide',
  twitterDescription: 'Learn what JSON Web Tokens (JWT) are, how they work, their three-part structure (header, payload, signature), signing algorithms, and security best practices.',
})

useHead({
  script: [
    {
      key: 'schema-article',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'What is a JWT Token? A Complete Guide',
        description: 'JSON Web Tokens explained: structure, how they work, common algorithms, and security best practices.',
        url: 'https://jsontools.space/guides/what-is-jwt',
        datePublished: '2026-06-19',
        dateModified: '2026-06-19',
        author: { '@type': 'Organization', name: 'JSON Tools', url: 'https://jsontools.space' },
        publisher: { '@type': 'Organization', name: 'JSON Tools', url: 'https://jsontools.space' },
      }),
    },
    {
      key: 'schema-breadcrumb',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'JSON Tools', item: 'https://jsontools.space/' },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://jsontools.space/guides' },
          { '@type': 'ListItem', position: 3, name: 'What is a JWT Token?', item: 'https://jsontools.space/guides/what-is-jwt' },
        ],
      }),
    },
    {
      key: 'schema-faq',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a.join(' ') },
        })),
      }),
    },
  ],
})
</script>

<style scoped>
.guide-page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 24px 80px;
}

.guide-inner {
  max-width: 760px;
  margin: 0 auto;
}

/* ── Breadcrumb ─────────────────────────────────────────── */
.guide-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 32px;
}

.bc-link {
  font-size: 12.5px;
  color: var(--c-t4);
  text-decoration: none;
  transition: color 0.15s;
}
.bc-link:hover { color: #F97316; }
.bc-sep { font-size: 12px; color: var(--c-t5); }
.bc-current { font-size: 12.5px; color: var(--c-t3); }

/* ── Hero ───────────────────────────────────────────────── */
.guide-hero {
  margin-bottom: 48px;
}

.guide-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 700;
  color: var(--c-t1);
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 14px;
}

.guide-subtitle {
  font-size: 16px;
  color: var(--c-t3);
  line-height: 1.65;
  margin-bottom: 16px;
}

.guide-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.guide-meta-item {
  font-size: 12.5px;
  color: var(--c-t4);
}

.guide-meta-sep { font-size: 12px; color: var(--c-t5); }

/* ── Article body ───────────────────────────────────────── */
.guide-body {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.guide-section h2 {
  font-size: 19px;
  font-weight: 700;
  color: var(--c-t1);
  letter-spacing: -0.02em;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--c-border);
}

.guide-section h3 {
  font-size: 14px;
  font-weight: 700;
  color: var(--c-t2);
  margin: 20px 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.guide-section p {
  font-size: 14.5px;
  color: var(--c-t3);
  line-height: 1.75;
  margin-bottom: 12px;
}

.guide-section p:last-child { margin-bottom: 0; }

.guide-section ul,
.guide-section ol {
  margin: 8px 0 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.guide-section li {
  font-size: 14.5px;
  color: var(--c-t3);
  line-height: 1.7;
}

.guide-section a {
  color: #F97316;
  text-decoration: none;
}
.guide-section a:hover { text-decoration: underline; }

.guide-section code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  background: rgba(249, 115, 22, 0.08);
  color: #F97316;
  padding: 1px 5px;
  border-radius: 4px;
}

/* ── JWT anatomy ────────────────────────────────────────── */
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
.jwt-part--sig     { background: rgba(252, 129, 74, 0.12); color: #FC814A; }

.jwt-dot {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 700;
  color: var(--c-t5);
  line-height: 1;
}

/* ── Code block ─────────────────────────────────────────── */
.code-block {
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  margin: 12px 0;
}

.code-header {
  display: block;
  padding: 7px 14px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-t5);
  background: var(--c-subtle);
  border-bottom: 1px solid var(--c-border);
}

.code-block code {
  display: block;
  padding: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  color: var(--c-t2);
  line-height: 1.6;
  word-break: break-all;
  background: none;
  border-radius: 0;
}

.code-dot { color: #F97316; font-weight: 700; }

/* ── Callout ────────────────────────────────────────────── */
.guide-callout {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13.5px;
  line-height: 1.65;
  margin: 12px 0;
}

.guide-callout--warn {
  background: rgba(249, 115, 22, 0.07);
  border-left: 3px solid #F97316;
  color: var(--c-t2);
}

/* ── Steps (ordered) ────────────────────────────────────── */
.guide-steps {
  margin: 8px 0 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  counter-reset: steps;
}

/* ── Algorithm table ────────────────────────────────────── */
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
  gap: 0;
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
  background: rgba(249, 115, 22, 0.08);
  color: #F97316;
  padding: 1px 5px;
  border-radius: 4px;
}

/* ── Tool CTA cards ─────────────────────────────────────── */
.guide-tools {
  margin-top: 56px;
  padding-top: 40px;
  border-top: 1px solid var(--c-border);
}

.guide-tools-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-t4);
  margin-bottom: 14px;
}

.guide-tool-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.tool-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  text-decoration: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  position: relative;
}

.tool-card:hover {
  border-color: #F97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.08);
}

.tool-card-icon {
  font-size: 18px;
  color: #F97316;
  font-family: 'JetBrains Mono', monospace;
  flex-shrink: 0;
  margin-top: 1px;
}

.tool-card-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--c-t1);
  margin-bottom: 5px;
}

.tool-card-desc {
  font-size: 12.5px;
  color: var(--c-t4);
  line-height: 1.6;
}

.tool-card-arrow {
  font-size: 16px;
  color: var(--c-t5);
  margin-left: auto;
  flex-shrink: 0;
  align-self: center;
  transition: color 0.15s, transform 0.15s;
}

.tool-card:hover .tool-card-arrow {
  color: #F97316;
  transform: translateX(3px);
}

/* ── FAQ ────────────────────────────────────────────────── */
.guide-faq {
  margin-top: 56px;
  padding-top: 40px;
  border-top: 1px solid var(--c-border);
}

.guide-faq-title {
  font-size: 19px;
  font-weight: 700;
  color: var(--c-t1);
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

.faq-list {
  border: 1px solid var(--c-border);
  border-radius: 12px;
  overflow: hidden;
}

.faq-item {
  border-bottom: 1px solid var(--c-border);
}
.faq-item:last-child { border-bottom: none; }

.faq-q {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--c-t1);
  transition: background 0.15s;
}
.faq-q:hover { background: rgba(249, 115, 22, 0.04); }
.faq-item--open .faq-q { color: #F97316; }

.faq-chevron {
  flex-shrink: 0;
  color: var(--c-t4);
  transition: transform 0.2s ease;
}
.faq-item--open .faq-chevron { transform: rotate(180deg); }

.faq-a {
  padding: 0 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.faq-a p {
  font-size: 13.5px;
  color: var(--c-t3);
  line-height: 1.7;
}

/* ── Algo accordion (mobile only) ───────────────────────── */
.algo-accordion { display: none; }

.algo-acc-item {
  border-bottom: 1px solid var(--c-border);
}
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
.algo-acc-trigger:hover { background: rgba(249, 115, 22, 0.04); }
.algo-acc-item--open .algo-acc-trigger { background: rgba(249, 115, 22, 0.04); }

.algo-acc-trigger code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  background: rgba(249, 115, 22, 0.08);
  color: #F97316;
  padding: 2px 6px;
  border-radius: 4px;
}

.algo-acc-chevron {
  flex-shrink: 0;
  color: var(--c-t4);
  transition: transform 0.2s ease;
}
.algo-acc-item--open .algo-acc-chevron { transform: rotate(180deg); }

.algo-acc-body {
  padding: 4px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.algo-acc-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.algo-acc-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--c-t4);
}

.algo-acc-row > span:last-child {
  font-size: 13px;
  color: var(--c-t3);
  line-height: 1.6;
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 768px) {
  .guide-page { padding: 24px 16px 64px; }
  .guide-hero { margin-bottom: 36px; }
  .guide-tool-cards { grid-template-columns: 1fr; }
  .algo-table { display: none; }
  .algo-accordion {
    display: block;
    border: 1px solid var(--c-border);
    border-radius: 8px;
    overflow: hidden;
    margin: 12px 0;
  }
  .faq-q { font-size: 13.5px; padding: 16px; }
  .faq-a { padding: 0 16px 16px; }
}
</style>
