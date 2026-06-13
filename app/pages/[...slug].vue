<template>
  <div class="page page-404">
    <div class="not-found">
      <div class="error-glyph">{ <span class="error-num">404</span> }</div>
      <h1 class="error-title">Page not found</h1>
      <p class="error-sub">This route doesn't exist — much like an undefined JSON key.</p>
      <NuxtLink to="/" class="btn btn-primary">Back to Formatter</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '404 — Page Not Found',
  description: 'This page does not exist.',
  ogTitle: '404 — Page Not Found',
  ogDescription: 'This page does not exist.',
  twitterTitle: '404 — Page Not Found',
  twitterDescription: 'This page does not exist.',
})
</script>

<style scoped>
.page-404 {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.error-glyph {
  font-family: 'JetBrains Mono', monospace;
  font-size: 52px;
  font-weight: 700;
  color: var(--c-t5);
  letter-spacing: -2px;
  line-height: 1;
}

.error-num {
  color: #F97316;
}

.error-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--c-t1);
  letter-spacing: -0.4px;
}

.error-sub {
  font-size: 14px;
  color: var(--c-t3);
  max-width: 340px;
  line-height: 1.6;
}
</style>
