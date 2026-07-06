<template>
  <div class="page">
    <div class="legal-page-inner">
    <div class="page-header">
      <div>
        <h1 class="page-title">Privacy Policy</h1>
        <p class="page-subtitle">Last updated: July 5, 2026</p>
      </div>
    </div>

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
.legal-page-inner { max-width: 720px; margin: 0 auto; width: 100%; }

.legal-section ul {
  margin: 10px 0 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legal-section li {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--c-t3);
  line-height: 1.7;
}

.legal-section code {
  font-family: var(--font-mono);
  font-size: 12.5px;
  background: rgb(var(--c-accent-rgb) / 0.08);
  color: var(--c-accent);
  padding: 1px 5px;
  border-radius: 4px;
}

.legal-back {
  margin-top: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--c-border);
}

.legal-back-link {
  font-family: var(--font-body);
  font-size: 13.5px;
  color: var(--c-t3);
  text-decoration: none;
  transition: color 0.15s;
}

.legal-back-link:hover { color: var(--c-accent); }
</style>
