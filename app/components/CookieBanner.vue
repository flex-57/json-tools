<template>
  <Transition name="banner-rise">
    <div v-if="consent === null" class="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div class="cookie-inner">
        <div class="cookie-text">
          <span class="cookie-title">Cookies &amp; analytics</span>
          <span class="cookie-desc">We use Google Analytics and AdSense to measure traffic and show ads. No personal data is sold or shared.</span>
        </div>
        <div class="cookie-actions">
          <button class="cookie-btn cookie-btn--decline" @click="decline">Decline</button>
          <button class="cookie-btn cookie-btn--accept" @click="accept">Accept</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useConsent } from '~/composables/useConsent'
const { consent, accept, decline } = useConsent()
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: var(--c-card-alt);
  border-top: 1px solid var(--c-border);
  box-shadow: 0 -8px 32px rgba(0,0,0,0.4);
}

.cookie-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.cookie-text {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  min-width: 200px;
  font-family: var(--font-body);
}

.cookie-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-t1);
  white-space: nowrap;
}

.cookie-desc {
  font-size: 12.5px;
  color: var(--c-t4);
  line-height: 1.5;
}

.cookie-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.cookie-btn {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  padding: 7px 18px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  border: 1px solid transparent;
}

.cookie-btn--decline {
  background: transparent;
  border-color: var(--c-border-m);
  color: var(--c-t3);
}
.cookie-btn--decline:hover { border-color: var(--c-t4); color: var(--c-t1); }

.cookie-btn--accept {
  background: var(--c-accent);
  border-color: var(--c-accent);
  color: var(--c-accent-ink);
}
.cookie-btn--accept:hover { filter: brightness(1.08); }

.banner-rise-enter-active { transition: transform 0.3s ease, opacity 0.3s ease; }
.banner-rise-leave-active { transition: transform 0.2s ease, opacity 0.2s ease; }
.banner-rise-enter-from,
.banner-rise-leave-to { transform: translateY(100%); opacity: 0; }

@media (max-width: 640px) {
  .cookie-inner { padding: 12px 16px; gap: 12px; }
  .cookie-text { flex-direction: column; gap: 4px; }
  .cookie-actions { width: 100%; justify-content: flex-end; }
}
</style>
