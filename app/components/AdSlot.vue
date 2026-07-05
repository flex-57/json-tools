<template>
  <ClientOnly>
    <div v-if="consent === 'accepted'" class="ad-slot">
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
import { useConsent, ADSENSE_ID } from '~/composables/useConsent'

defineProps<{ slotId: string }>()

const { consent } = useConsent()
const insEl = ref<HTMLElement | null>(null)
const pushed = ref(false)

function pushAd() {
  if (pushed.value || !insEl.value) return
  pushed.value = true
  try {
    const w = window as any
    ;(w.adsbygoogle = w.adsbygoogle || []).push({})
  } catch {}
}

onMounted(() => {
  if (consent.value === 'accepted') nextTick(pushAd)
})

watch(consent, (val) => {
  if (val === 'accepted') nextTick(pushAd)
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
