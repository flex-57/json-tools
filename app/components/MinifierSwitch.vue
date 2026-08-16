<template>
  <div class="mode-toggle" style="min-width: 210px;">
    <div class="mode-indicator" :style="{ '--mode-count': 3, '--mode-index': ['css', 'html', 'js'].indexOf(active) }" />
    <NuxtLink to="/tools/css-minifier" class="mode-btn" :class="{ 'mode-btn--active': active === 'css' }">CSS</NuxtLink>
    <NuxtLink to="/tools/html-minifier" class="mode-btn" :class="{ 'mode-btn--active': active === 'html' }">HTML</NuxtLink>
    <NuxtLink to="/tools/js-minifier" class="mode-btn" :class="{ 'mode-btn--active': active === 'js' }">JS</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{ active: 'css' | 'html' | 'js' }>()
</script>
