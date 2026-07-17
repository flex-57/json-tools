<template>
  <div class="tool-switch">
    <NuxtLink to="/tools/css-minifier" class="switch-option" :class="{ 'switch-option--active': active === 'css' }">CSS</NuxtLink>
    <NuxtLink to="/tools/html-minifier" class="switch-option" :class="{ 'switch-option--active': active === 'html' }">HTML</NuxtLink>
    <NuxtLink to="/tools/js-minifier" class="switch-option" :class="{ 'switch-option--active': active === 'js' }">JS</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{ active: 'css' | 'html' | 'js' }>()
</script>

<style scoped>
.tool-switch {
  display: inline-flex;
  align-items: center;
  background: var(--c-subtle);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
}

.switch-option {
  padding: 5px 14px;
  border-radius: 7px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--c-t3);
  text-decoration: none;
  transition: all 0.15s;
  white-space: nowrap;
}
.switch-option:hover:not(.switch-option--active) { background: var(--c-faint); color: var(--c-t1); }
.switch-option--active { background: var(--c-accent); color: var(--c-accent-ink); }
</style>
