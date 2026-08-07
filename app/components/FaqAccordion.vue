<template>
  <div class="faq-list">
    <div v-for="(item, i) in items" :key="i" class="faq-item" :class="{ 'faq-item--open': openIndex === i }">
      <button class="faq-q" @click="openIndex = openIndex === i ? null : i">
        {{ item.q }}
        <svg class="faq-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 6l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="faq-collapse" :aria-hidden="openIndex !== i">
        <div class="faq-a">
          <div class="faq-a-inner">
            <p v-for="(para, j) in item.a" :key="j">{{ para }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: { q: string; a: string[] }[] }>()

const openIndex = ref<number | null>(0)
</script>

<style scoped>
.faq-list { display: flex; flex-direction: column; border: 1px solid var(--c-border); border-radius: 12px; overflow: hidden; }
.faq-item { border-bottom: 1px solid var(--c-border); }
.faq-item:last-child { border-bottom: none; }
.faq-q {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 16px 18px; background: var(--c-card); border: none; cursor: pointer; text-align: left;
  font-family: var(--font-body); font-size: 13.5px; font-weight: 600; color: var(--c-t1); transition: background 0.15s, color 0.15s;
}
.faq-q:hover { background: var(--c-subtle); }
.faq-item--open .faq-q { color: var(--c-accent); }
.faq-chevron { flex-shrink: 0; color: var(--c-t4); transition: transform var(--dur-reveal) var(--ease-spring); }
.faq-item--open .faq-chevron { transform: rotate(180deg); color: var(--c-accent); }
.faq-collapse { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--dur-reveal) var(--ease-out); background: var(--c-card); }
.faq-item--open .faq-collapse { grid-template-rows: 1fr; }
/* min-height:0 alone isn't enough to reach a true 0px row — padding on the grid
   item itself still counts toward its box height regardless. Padding has to live
   on a nested child (faq-a-inner) so overflow:hidden on faq-a can clip it away. */
.faq-a { overflow: hidden; min-height: 0; }
.faq-a-inner { padding: 0 18px 18px; display: flex; flex-direction: column; gap: 10px; }
.faq-a p { font-family: var(--font-body); font-size: 13px; color: var(--c-t3); line-height: 1.7; }

@media (max-width: 768px) {
  .faq-q { font-size: 13px; padding: 14px; }
  .faq-a-inner { padding: 0 14px 14px; }
}
</style>
