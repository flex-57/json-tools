<template>
  <section v-if="tools.length" class="recent-section">
    <button class="recent-toggle" @click="open = !open" :aria-expanded="open">
      <span class="recent-toggle-icon" v-html="ICONS.recent"></span>
      <span class="recent-label">Recently Used</span>
      <svg class="recent-chevron" :class="{ 'recent-chevron--open': open }" width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div v-if="open" class="recent-row">
      <NuxtLink v-for="t in tools" :key="t.slug" :to="`/tools/${t.slug}`" class="recent-pill">
        <span class="recent-pill-icon" v-html="toolIcon(t.slug)"></span>
        <span class="recent-pill-name">{{ t.navLabel ?? t.name }}</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ICONS, toolIcon } from '~/utils/icons'
import type { ToolMeta } from '~/data/tools'

const props = withDefaults(defineProps<{ tools: ToolMeta[]; defaultOpen?: boolean }>(), { defaultOpen: true })
const open = ref(props.defaultOpen)
</script>

<style scoped>
.recent-section { padding: 24px 0 32px; }
.recent-toggle { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; padding: 0; }
.recent-toggle-icon { display: flex; color: var(--c-t5); transition: color 0.15s; }
.recent-toggle:hover .recent-toggle-icon { color: var(--c-t3); }
.recent-label { font-family: var(--font-display); font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--c-t5); transition: color 0.15s; }
.recent-toggle:hover .recent-label { color: var(--c-t3); }
.recent-chevron { flex-shrink: 0; color: var(--c-t5); transition: transform 0.2s ease, color 0.15s; }
.recent-chevron--open { transform: rotate(180deg); }
.recent-toggle:hover .recent-chevron { color: var(--c-t3); }
.recent-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.recent-pill {
  display: flex; align-items: center; gap: 8px; padding: 8px 14px;
  background: var(--c-card); border: 1px solid var(--c-border); border-radius: 20px;
  text-decoration: none; transition: border-color 0.15s, transform 0.1s;
}
.recent-pill:hover { border-color: var(--c-accent); transform: translateY(-1px); }
.recent-pill-icon { display: flex; color: var(--c-t3); transition: color 0.15s; }
.recent-pill:hover .recent-pill-icon { color: var(--c-accent); }
.recent-pill-name { font-family: var(--font-mono); font-size: 12.5px; font-weight: 500; color: var(--c-t2); white-space: nowrap; transition: color 0.15s; }
.recent-pill:hover .recent-pill-name { color: var(--c-t1); }
</style>
