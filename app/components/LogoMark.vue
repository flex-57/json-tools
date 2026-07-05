<template>
  <svg :width="size" :height="size" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="1" y="1" width="38" height="38" rx="9" fill="#0A0912" stroke="#26213D" stroke-width="1.5"/>
    <circle cx="20" cy="20" r="6.5" fill="#FF3D8F"/>
    <circle cx="20" cy="20" r="10.5" stroke="#FF3D8F" stroke-width="1.2" opacity="0.35" fill="none"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 32 })
</script>
