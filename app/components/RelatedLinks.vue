<template>
  <div v-if="items.length" class="related-row">
    <span class="related-label">{{ label }}</span>
    <NuxtLink v-for="i in items" :key="i.to" :to="i.to" class="related-link">{{ i.label }}</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; items: { to: string; label: string }[] }>()
</script>

<style scoped>
.related-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
  padding: 0 2px;
}

.related-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--c-t5);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-right: 2px;
  flex-shrink: 0;
}

.related-link {
  font-size: 12px;
  font-weight: 500;
  color: var(--c-t3);
  text-decoration: none;
  padding: 3px 11px;
  border-radius: 20px;
  border: 1px solid var(--c-border);
  background: var(--c-card);
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

.related-link:hover {
  color: var(--c-accent);
  border-color: rgb(var(--c-accent-rgb) / 0.35);
  background: rgb(var(--c-accent-rgb) / 0.06);
}
</style>
