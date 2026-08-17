<template>
  <div class="mode-toggle">
    <div class="mode-indicator" :class="{ 'mode-indicator--right': !isFrom }" />
    <NuxtLink :to="fromPath" class="mode-btn" :class="{ 'mode-btn--active': isFrom }">{{ fromLabel }}</NuxtLink>
    <NuxtLink :to="toPath" class="mode-btn" :class="{ 'mode-btn--active': !isFrom }">{{ toLabel }}</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  fromPath: string
  toPath: string
  fromLabel: string
  toLabel: string
}>()

const { isFrom } = useToolSwitch(props.fromPath, props.toPath)
</script>
