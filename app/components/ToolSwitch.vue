<template>
  <div class="tool-switch">
    <NuxtLink :to="fromPath" class="switch-option" :class="{ 'switch-option--active': isFrom }">{{ fromLabel }}</NuxtLink>
    <button class="switch-arrow" @click="toggle" title="Switch direction">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 4.5h12M10 2l3 2.5L10 7M13 9.5H1M4 7l-3 2.5L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <NuxtLink :to="toPath" class="switch-option" :class="{ 'switch-option--active': !isFrom }">{{ toLabel }}</NuxtLink>
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

.switch-arrow {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 6px; border: none;
  background: transparent; color: var(--c-t5); cursor: pointer; transition: all 0.15s; flex-shrink: 0;
}
.switch-arrow:hover { background: var(--c-faint); color: var(--c-accent); }
</style>
