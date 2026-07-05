<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Terms of Use</h1>
        <p class="page-subtitle">Last updated: July 5, 2026</p>
      </div>
    </div>

    <div class="legal-body">
      <section class="legal-section">
        <h2>Acceptance</h2>
        <p>By using jsontools.space you agree to these terms. If you do not agree, please stop using the site.</p>
      </section>

      <section class="legal-section">
        <h2>Free to use</h2>
        <p>JSON Tools is provided free of charge. All tools are available without registration, payment, or any subscription. We reserve the right to change or discontinue any tool or the service as a whole at any time without notice.</p>
      </section>

      <section class="legal-section">
        <h2>Client-side processing</h2>
        <p>All data you enter into the tools is processed entirely within your browser. No data is transmitted to our servers. You are solely responsible for the data you process using the tools and for any actions taken based on the output.</p>
      </section>

      <section class="legal-section">
        <h2>No warranty</h2>
        <p>The tools are provided "as is" without warranty of any kind, express or implied. We make no guarantees regarding the accuracy, completeness, or fitness for a particular purpose of any tool output. Do not rely solely on JSON Tools for critical or production use cases without independent verification.</p>
      </section>

      <section class="legal-section">
        <h2>Limitation of liability</h2>
        <p>To the maximum extent permitted by applicable law, JSON Tools and its author shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the service, including but not limited to data loss, errors in tool output, or service unavailability.</p>
      </section>

      <section class="legal-section">
        <h2>Acceptable use</h2>
        <p>You agree not to use JSON Tools to process data you are not authorized to handle, to attempt to reverse-engineer or scrape the service, or to take any action that could harm the service or its users.</p>
      </section>

      <section class="legal-section">
        <h2>Third-party services</h2>
        <p>With your consent, the site loads Google Analytics and Google AdSense. These are governed by <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Google's Terms of Service</a>. We are not responsible for the practices of these third-party services.</p>
      </section>

      <section class="legal-section">
        <h2>Changes</h2>
        <p>We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the updated terms.</p>
      </section>

      <div class="legal-back">
        <NuxtLink to="/" class="legal-back-link">← Back to tools</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Terms of Use — JSON Tools',
  description: 'Terms of use for jsontools.space: free service, no warranty, client-side processing.',
  robots: 'noindex',
})
</script>

<style scoped>
.legal-body { max-width: 720px; }

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
