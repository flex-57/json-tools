<template>
  <div class="tool-switch">
    <NuxtLink :to="fromPath" class="switch-option" :class="{ 'switch-option--active': isFrom }">
      {{ fromLabel }}
    </NuxtLink>
    <button class="switch-arrow" @click="toggle" title="Switch direction">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 4.5h12M10 2l3 2.5L10 7M13 9.5H1M4 7l-3 2.5L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <NuxtLink :to="toPath" class="switch-option" :class="{ 'switch-option--active': !isFrom }">
      {{ toLabel }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  fromPath: string
  toPath: string
  fromLabel: string
  toLabel: string
}>()

const route = useRoute()
const router = useRouter()

const isFrom = computed(() => route.path === props.fromPath)

function toggle() {
  router.push(isFrom.value ? props.toPath : props.fromPath)
}
</script>

<style scoped>
.tool-switch {
  display: inline-flex;
  align-items: center;
  background: var(--c-card);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.switch-option {
  padding: 5px 14px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  font-family: 'JetBrains Mono', monospace;
  color: var(--c-t4);
  text-decoration: none;
  transition: all 0.15s;
  white-space: nowrap;
}

.switch-option:hover:not(.switch-option--active) {
  background: var(--c-bg);
  color: var(--c-t2);
}

.switch-option--active {
  background: #F97316;
  color: white;
  box-shadow: 0 1px 4px rgba(249,115,22,0.35);
}

.switch-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--c-t5);
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.switch-arrow:hover {
  background: var(--c-bg);
  color: #F97316;
}
</style>
