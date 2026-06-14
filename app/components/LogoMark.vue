<template>
  <svg :width="size" :height="size" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="40" height="40" rx="10" fill="#F97316"/>
    <path d="M15,12 Q10,12 10,16 L10,18.5 Q10,20 7,20 Q10,20 10,21.5 L10,24 Q10,28 15,28"
          stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M25,12 Q30,12 30,16 L30,18.5 Q30,20 33,20 Q30,20 30,21.5 L30,24 Q30,28 25,28"
          stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 32 })
</script>
