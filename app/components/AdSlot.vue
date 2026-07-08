<template>
  <ClientOnly>
    <div class="ad-slot">
      <ins
        ref="insEl"
        class="adsbygoogle"
        style="display:block"
        :data-ad-client="ADSENSE_ID"
        :data-ad-slot="slotId"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ADSENSE_ID } from '~/composables/useConsent'

defineProps<{ slotId: string }>()

const insEl = ref<HTMLElement | null>(null)

onMounted(() => {
  nextTick(() => {
    if (!insEl.value) return
    try {
      const w = window as any
      ;(w.adsbygoogle = w.adsbygoogle || []).push({})
    } catch {}
  })
})
</script>

<style scoped>
.ad-slot {
  width: 100%;
  min-height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
