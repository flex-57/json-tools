<template>
  <div class="legal-page">
    <div class="legal-inner">
      <h1 class="legal-title">Privacy Policy</h1>
      <p class="legal-date">Last updated: June 18, 2026</p>

      <section class="legal-section">
        <h2>Overview</h2>
        <p>JSON Tools (jsontools.space) is a free collection of browser-based developer utilities. All data processing happens locally in your browser — nothing you enter into any tool is ever sent to our servers.</p>
      </section>

      <section class="legal-section">
        <h2>Data we collect</h2>
        <p>We collect analytics and advertising data only after you explicitly consent via the cookie banner.</p>
        <ul>
          <li><strong>Google Analytics 4</strong> — measures anonymous traffic (page views, session duration, referrer). No personally identifiable information is collected. Data is processed by Google under their <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
          <li><strong>Google AdSense</strong> — displays advertisements. Google may use cookies to serve ads based on your prior visits to this and other websites. You can opt out via <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
        </ul>
        <p>If you click <strong>Decline</strong> on the cookie banner, neither Google Analytics nor AdSense scripts are loaded. Your choice is stored locally in your browser (<code>jt-consent</code> key in localStorage) and never transmitted anywhere.</p>
      </section>

      <section class="legal-section">
        <h2>Your data in the tools</h2>
        <p>Any JSON, CSV, text, JWT, or other data you paste into our tools is processed entirely in your browser using client-side JavaScript. It never leaves your machine. We have no access to it and do not log it.</p>
      </section>

      <section class="legal-section">
        <h2>Cookies</h2>
        <p>We use one first-party localStorage entry (<code>jt-consent</code>) to remember your cookie preference. This is not a tracking cookie — it contains only your consent choice ("accepted" or "declined") and no personal data.</p>
        <p>If you consent to analytics and ads, Google may set additional cookies. You can manage or delete these via your browser settings.</p>
      </section>

      <section class="legal-section">
        <h2>Your rights (GDPR / EEA)</h2>
        <p>If you are located in the European Economic Area, you have the right to access, correct, port, or delete personal data about you. Since we do not store any personal data ourselves, any such requests relate to data held by Google Analytics or Google AdSense. Please refer to <a href="https://myaccount.google.com/data-and-privacy" target="_blank" rel="noopener noreferrer">Google's data controls</a> for these.</p>
      </section>

      <section class="legal-section">
        <h2>Changes to this policy</h2>
        <p>We may update this policy occasionally. Changes will be reflected by the "Last updated" date above.</p>
      </section>

      <div class="legal-back">
        <NuxtLink to="/" class="legal-back-link">← Back to tools</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy — JSON Tools',
  description: 'Privacy policy for jsontools.space: what data we collect, how we use it, and your rights.',
  robots: 'noindex',
})
</script>

<style scoped>
.legal-page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

.legal-inner {
  max-width: 700px;
  margin: 0 auto;
}

.legal-title {
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 700;
  color: var(--c-t1);
  letter-spacing: -0.03em;
  margin-bottom: 8px;
}

.legal-date {
  font-size: 13px;
  color: var(--c-t4);
  margin-bottom: 40px;
}

.legal-section ul {
  margin: 10px 0 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legal-section li {
  font-size: 14px;
  color: var(--c-t3);
  line-height: 1.7;
}

.legal-section code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  background: rgba(249, 115, 22, 0.08);
  color: #F97316;
  padding: 1px 5px;
  border-radius: 4px;
}

.legal-back {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--c-border);
}

.legal-back-link {
  font-size: 13.5px;
  color: var(--c-t3);
  text-decoration: none;
  transition: color 0.15s;
}

.legal-back-link:hover { color: #F97316; }

@media (max-width: 768px) {
  .legal-page { padding: 32px 16px 64px; }
}
</style>
