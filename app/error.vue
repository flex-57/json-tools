<template>
  <NuxtLayout>
    <div class="page page-404">
      <div class="not-found">
        <div class="error-glyph">{ <span class="error-num">{{ error?.statusCode ?? 404 }}</span> }</div>
        <h1 class="error-title">Page not found</h1>
        <p class="error-sub">This route doesn't exist — much like an undefined JSON key.</p>
        <NuxtLink to="/" class="btn btn-primary" @click="handleClick">Back to tools</NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message?: string } }>()

useSeoMeta({
  title: '404 — Page Not Found',
  description: 'This page does not exist.',
  robots: 'noindex',
})

function handleClick() {
  clearError({ redirect: '/' })
}
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
  font-family: var(--font-mono);
  font-size: 52px;
  font-weight: 700;
  color: var(--c-t5);
  letter-spacing: -2px;
  line-height: 1;
}

.error-num { color: var(--c-accent); }

.error-title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--c-t1);
  letter-spacing: 0.01em;
}

.error-sub {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--c-t3);
  max-width: 340px;
  line-height: 1.6;
}
</style>
