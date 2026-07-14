<template>
  <div class="page">
    <div class="legal-page-inner">
      <div class="page-header">
        <div>
          <h1 class="page-title">About JSON Tools</h1>
          <p class="page-subtitle">Why this site exists, how it works, and who built it.</p>
        </div>
      </div>

      <section class="legal-section">
        <h2>Why it exists</h2>
        <p>Most online "JSON formatter" or "converter" sites are cluttered with intrusive ads, force a signup, or quietly send whatever you paste to a server. JSON Tools started as a personal itch: a place to format JSON, decode a JWT, or convert a CSV without any of that friction.</p>
      </section>

      <section class="legal-section">
        <h2>How it works</h2>
        <p>Every tool runs entirely in your browser. When you paste JSON, a JWT, or a CSV file into any tool, it is processed by client-side JavaScript and never transmitted anywhere. There is no backend that sees your data. The site is a static export with no server-side processing.</p>
        <p><NuxtLink to="/privacy">Read the full Privacy Policy →</NuxtLink></p>
      </section>

      <section class="legal-section">
        <h2>Free, no account, no catch</h2>
        <p>All {{ toolCount }} tools and {{ guideCount }} guides are free, with no usage limits and no premium tier. The site is funded by non-intrusive ads shown only with your consent. There is no plan to add a paywall or gate any tool behind a signup.</p>
      </section>

      <section class="legal-section">
        <h2>Who built it</h2>
        <p>JSON Tools is built and maintained by <strong>flex-57</strong>, an independent developer. The project is open source, and the code, issues, and history are all public on GitHub.</p>
        <p>
          <a href="https://github.com/flex-57/json-tools" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <span v-html="ICONS.code" />
            View source on GitHub
          </a>
        </p>
      </section>

      <section class="legal-section">
        <h2>Get in touch</h2>
        <p>Found a bug, have a feature request, or just want to say hi? <NuxtLink to="/contact">Get in touch →</NuxtLink></p>
      </section>

      <div class="legal-back">
        <NuxtLink to="/" class="legal-back-link">← Back to tools</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICONS } from '~/utils/icons'
import { VISIBLE_TOOL_COUNT } from '~/data/tools'
import { GUIDES } from '~/data/guides'

const toolCount = VISIBLE_TOOL_COUNT
const guideCount = Object.keys(GUIDES).length

useSeoMeta({
  title: 'About JSON Tools — Free, Client-Side Developer Tools',
  description: 'Why JSON Tools exists, how its client-side-only processing works, and who builds and maintains this free, open-source collection of developer utilities.',
  ogTitle: 'About JSON Tools',
  ogDescription: 'A free, open-source collection of developer utilities that never sends your data to a server.',
})
</script>

<style scoped>
.legal-page-inner { max-width: 720px; margin: 0 auto; width: 100%; }

.legal-section .btn {
  margin-top: 4px;
}

.legal-section .btn svg { width: 14px; height: 14px; }

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
