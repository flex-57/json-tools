<template>
  <div class="tool-switch-row">
    <div class="mode-toggle">
      <div class="mode-indicator" :class="{ 'mode-indicator--right': !isFrom }" />
      <NuxtLink :to="fromPath" class="mode-btn" :class="{ 'mode-btn--active': isFrom }">{{ fromLabel }}</NuxtLink>
      <NuxtLink :to="toPath" class="mode-btn" :class="{ 'mode-btn--active': !isFrom }">{{ toLabel }}</NuxtLink>
    </div>
    <button class="swap-btn" title="Switch direction" @click="toggle">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 4.5h12M10 2l3 2.5L10 7M13 9.5H1M4 7l-3 2.5L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
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
.tool-switch-row { display: flex; align-items: center; gap: 8px; }
</style>
