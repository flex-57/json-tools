<template>
  <div class="page">
    <div class="legal-page-inner">
      <div class="page-header">
        <div>
          <h1 class="page-title">Contact</h1>
          <p class="page-subtitle">Questions, bug reports, or feature requests? Reach out.</p>
        </div>
      </div>

      <section class="legal-section">
        <h2>Email</h2>
        <p>The fastest way to reach me. This is a solo-maintained project, so replies may take a few days, but I read every message.</p>
        <p class="email-row">
          <a href="mailto:contact@jsontools.space" class="btn btn-primary">
            <span v-html="ICONS.mail" />
            contact@jsontools.space
          </a>
          <button class="btn-copy" :class="{ 'btn-copy--done': copied }" type="button" @click="copy">{{ copied ? 'Copied!' : 'Copy address' }}</button>
        </p>
        <p class="email-hint">Nothing happens when you click the button above? Your browser may not have a default mail app set up. Copy the address instead.</p>
      </section>

      <section class="legal-section">
        <h2>Bug reports & feature requests</h2>
        <p>If you found a bug or have an idea for a new tool, opening a GitHub issue is often faster than email. It's public, so I can track it and you can follow the status.</p>
        <p>
          <a href="https://github.com/flex-57/json-tools/issues" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <span v-html="ICONS.code" />
            Open an issue on GitHub
          </a>
        </p>
      </section>

      <section class="legal-section">
        <h2>About the project</h2>
        <p>Curious why JSON Tools exists or how it works? <NuxtLink to="/about">Read the About page →</NuxtLink></p>
      </section>

      <div class="legal-back">
        <NuxtLink to="/" class="legal-back-link">← Back to tools</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICONS } from '~/utils/icons'

const { copied, copy } = useClipboard(() => 'contact@jsontools.space')

useSeoMeta({
  title: 'Contact JSON Tools — Report a Bug or Get in Touch',
  description: 'Contact JSON Tools by email or GitHub issue to report a bug, request a new tool, or ask a question. Solo-maintained project, replies may take a few days.',
  ogTitle: 'Contact JSON Tools',
  ogDescription: 'Report a bug, request a feature, or just say hi.',
})
</script>

<style scoped>
.legal-page-inner { max-width: 720px; margin: 0 auto; width: 100%; }

.legal-section .btn { margin-top: 4px; }
.legal-section .btn svg { width: 14px; height: 14px; }

.email-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.email-row .btn-copy { margin-top: 4px; }

.email-hint { font-size: 12.5px; color: var(--c-t4); }

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
