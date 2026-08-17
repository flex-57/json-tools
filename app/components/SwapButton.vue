<template>
  <button class="swap-btn" title="Switch direction" @click="toggle">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 4.5h12M10 2l3 2.5L10 7M13 9.5H1M4 7l-3 2.5L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  fromPath: string
  toPath: string
}>()

const { toggle } = useToolSwitch(props.fromPath, props.toPath)
</script>
