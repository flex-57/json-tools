<template>
  <section class="about">
    <div class="about-grid">
      <div v-for="card in cards" :key="card.title" class="about-card">
        <h2 class="about-title">{{ card.title }}</h2>
        <p class="about-text">{{ card.text }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  cards: { title: string; text: string }[]
}>()
</script>

<style scoped>
.about { margin-top: 8px; padding-bottom: 8px; }
.about-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.about-card { background: var(--c-card); border: 1px solid var(--c-border); border-radius: 14px; padding: 20px 22px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
.about-title { font-size: 14px; font-weight: 600; color: var(--c-t1); margin-bottom: 10px; }
.about-text { font-size: 13px; color: var(--c-t3); line-height: 1.75; }
@media (max-width: 900px) { .about-grid { grid-template-columns: 1fr; } }
</style>
