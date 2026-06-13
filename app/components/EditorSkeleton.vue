<template>
  <div class="editor-skeleton">
    <div class="skeleton-gutter">
      <div v-for="i in 10" :key="i" class="skeleton-lnum" :style="{ opacity: Math.max(0.15, 1 - i * 0.09) }" />
    </div>
    <div class="skeleton-body">
      <div
        v-for="(w, i) in LINES"
        :key="i"
        class="skeleton-line"
        :style="{ width: w, animationDelay: i * 40 + 'ms' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const LINES = ['62%', '85%', '47%', '78%', '91%', '54%', '70%', '38%', '65%', '82%']
</script>

<style scoped>
.editor-skeleton {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
}

.skeleton-gutter {
  width: 44px;
  min-width: 44px;
  background: var(--c-faint);
  border-right: 1px solid var(--c-border-s);
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 11px;
  align-items: center;
}

.skeleton-lnum {
  width: 18px;
  height: 10px;
  border-radius: 3px;
  background: var(--c-border);
}

.skeleton-body {
  flex: 1;
  padding: 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.skeleton-line {
  height: 13px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--c-border-s) 0%, var(--c-border) 50%, var(--c-border-s) 100%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.6s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
