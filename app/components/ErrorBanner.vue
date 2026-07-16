<template>
  <div class="error-banner">
    <div class="error-banner-icon">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1.5 15 14H1L8 1.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M8 6.3v3.4M8 11.7v.1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
    </div>
    <div class="error-banner-body">
      <div class="error-banner-title">
        <span v-if="sideDot" class="error-banner-dot" :style="{ background: sideDot }"></span>
        <span v-if="sideLabel" class="error-banner-side-label">{{ sideLabel }}</span>
        {{ headline }}
      </div>
      <div v-if="detail" class="error-banner-desc">{{ detail }}</div>
      <div v-if="line || crossLinkTo" class="error-banner-actions">
        <button v-if="line" type="button" class="banner-pill" @click="emit('jump')">Jump to line {{ line }}{{ column ? `, column ${column}` : '' }} →</button>
        <NuxtLink v-if="crossLinkTo" :to="crossLinkTo" class="banner-pill banner-pill--ghost">{{ crossLinkLabel }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  message: string
  line?: number | null
  column?: number | null
  crossLinkTo?: string | null
  crossLinkLabel?: string
  // CSS color for a small dot before the headline — lets a two-pane tool
  // (json-diff) echo the same left/right identity color already shown next
  // to "Original"/"Modified" in the pane header, so the banner visually
  // points at the right panel instead of relying on the text alone.
  sideDot?: string | null
  // e.g. "Original" / "Modified" — rendered in the same uppercase, bold,
  // letter-spaced style as .pane-label, so the banner's side marker reads
  // as the same "tag" a user already recognizes from the pane header above.
  sideLabel?: string | null
}>(), {
  line: null,
  column: null,
  crossLinkTo: null,
  crossLinkLabel: 'Open in JSON Formatter →',
  sideDot: null,
  sideLabel: null,
})

const emit = defineEmits<{ jump: [] }>()

// Tips from getJsonErrorTip() read "Headline — detail." (matches the site's
// existing writing style); a raw browser error message has no em-dash, so it
// renders as a headline alone rather than splitting on the wrong punctuation.
const headline = computed(() => props.message.split(' — ')[0]!)
const detail = computed(() => {
  const parts = props.message.split(' — ')
  return parts.length > 1 ? parts.slice(1).join(' — ') : ''
})
</script>

<style scoped>
.error-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 14px;
  background: rgb(var(--c-error-rgb) / 0.08);
  border: 1px solid rgb(var(--c-error-rgb) / 0.3);
  border-left: 4px solid var(--c-error);
  border-radius: var(--radius-card);
}
.error-banner-icon {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgb(var(--c-error-rgb) / 0.15);
  color: var(--c-error);
  display: flex;
  align-items: center;
  justify-content: center;
}
.error-banner-body { flex: 1; min-width: 0; }
.error-banner-title { font-family: var(--font-body); font-size: 13.5px; font-weight: 700; color: var(--c-t1); }
.error-banner-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 7px; }
.error-banner-side-label {
  font-family: var(--font-body); font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em; color: var(--c-t3);
  margin-right: 7px;
}
.error-banner-desc { font-family: var(--font-body); font-size: 12.5px; color: var(--c-t3); line-height: 1.5; margin-top: 3px; }
.error-banner-actions { display: flex; align-items: center; gap: 8px; margin-top: 9px; flex-wrap: wrap; }

.banner-pill {
  flex-shrink: 0;
  white-space: nowrap;
  font-family: var(--font-body);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--c-error);
  background: transparent;
  text-decoration: none;
  padding: 4px 11px;
  border: 1px solid rgb(var(--c-error-rgb) / 0.35);
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.15s;
}
.banner-pill:hover { background: rgb(var(--c-error-rgb) / 0.1); }
.banner-pill--ghost { color: var(--c-t3); border-color: var(--c-border-m); }
.banner-pill--ghost:hover { background: var(--c-faint); color: var(--c-t1); }
</style>
