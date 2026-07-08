<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-inner">
        <NuxtLink to="/" class="brand" @click="mobileOpen = false">
          <LogoMark :size="30" class="brand-mark" />
          <span class="brand-name">json<em>tools</em></span>
        </NuxtLink>

        <!-- Desktop nav — un dropdown par catégorie, piloté par app/data/tools.ts -->
        <nav class="header-nav">
          <div
            v-for="(label, key) in CATEGORIES"
            :key="key"
            class="nav-group"
            :class="{ 'nav-group--open': activeGroup === key }"
            @mouseenter="activeGroup = key"
            @mouseleave="activeGroup = null"
            @focusout="closeIfFocusLeft"
          >
            <button
              class="nav-item nav-group-trigger"
              :class="{ 'nav-item--active': isCategoryActive(key) }"
              @click="activeGroup = key"
              @focus="activeGroup = key"
            >
              {{ label }}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="nav-dropdown" @click="activeGroup = null">
              <template v-for="t in toolsByCategory(key)" :key="t.slug">
                <div v-if="t.navDividerBefore" class="nav-dropdown-divider" />
                <NuxtLink :to="`/tools/${t.slug}`" class="nav-dropdown-item">{{ t.navLabel ?? t.name }}</NuxtLink>
              </template>
            </div>
          </div>

          <NuxtLink to="/guides" class="nav-item" :class="{ 'nav-item--active': isGuidesActive }">Guides</NuxtLink>
        </nav>

        <div class="header-badge">Free · No signup · No tracking</div>

        <button class="theme-toggle" @click="toggle" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <svg v-if="isDark" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="3.2" stroke="currentColor" stroke-width="1.4"/><path d="M7 1v1.6M7 11.4V13M13 7h-1.6M2.6 7H1M11.2 2.8l-1.1 1.1M3.9 10.1l-1.1 1.1M11.2 11.2l-1.1-1.1M3.9 3.9L2.8 2.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 8.2A5 5 0 116.3 2.5 4 4 0 0011 8.2z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
        </button>

        <button class="mobile-menu-btn" :class="{ 'is-open': mobileOpen }" @click="mobileOpen = !mobileOpen" aria-label="Toggle menu">
          <span class="hb-line" />
          <span class="hb-line" />
          <span class="hb-line" />
        </button>
      </div>
    </header>

    <Transition name="mobile-drawer">
      <nav v-if="mobileOpen" class="mobile-nav">
        <div class="mobile-nav-inner">
          <div class="mobile-section">
            <NuxtLink to="/" class="mobile-nav-item mobile-nav-item--main" @click="mobileOpen = false">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7.5L7 2l6 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 9.5V12h8V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Home
            </NuxtLink>
          </div>

          <div v-for="(label, key) in CATEGORIES" :key="key" class="mobile-section">
            <div class="mobile-section-label">{{ label }}</div>
            <template v-for="t in toolsByCategory(key)" :key="t.slug">
              <div v-if="t.navDividerBefore" class="mobile-nav-divider" />
              <NuxtLink :to="`/tools/${t.slug}`" class="mobile-nav-item" @click="mobileOpen = false">{{ t.navLabel ?? t.name }}</NuxtLink>
            </template>
          </div>

          <div class="mobile-section">
            <div class="mobile-section-label">Guides</div>
            <NuxtLink to="/guides" class="mobile-nav-item" @click="mobileOpen = false">All Guides</NuxtLink>
          </div>
        </div>
      </nav>
    </Transition>

    <div v-if="breadcrumbName" class="breadcrumb-bar">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/" class="bc-home">JSON Tools</NuxtLink>
        <span class="bc-sep" aria-hidden="true">›</span>
        <span class="bc-current">{{ breadcrumbName }}</span>
      </nav>
    </div>

    <main class="app-main">
      <slot />
    </main>
    <div class="ad-footer-wrap">
      <AdSlot slot-id="6882001481" />
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { trackPageView } from '~/composables/useConsent'
import { useColorMode } from '~/composables/useColorMode'
import { CATEGORIES, toolsByCategory, toolMeta } from '~/data/tools'

const route = useRoute()
const mobileOpen = ref(false)
const activeGroup = ref(null)

function closeIfFocusLeft(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) activeGroup.value = null
}
const { isDark, init: initColorMode, toggle } = useColorMode()
const { addRecent } = useRecentTools()

onMounted(() => {
  initColorMode()
  if (route.path.startsWith('/tools/')) {
    addRecent(route.path.replace('/tools/', ''))
  }
})

watch(() => route.path, (path) => {
  mobileOpen.value = false
  activeGroup.value = null
  trackPageView(path)
  if (path.startsWith('/tools/')) {
    addRecent(path.replace('/tools/', ''))
  }
})

function isCategoryActive(category) {
  return toolsByCategory(category).some(t => route.path === `/tools/${t.slug}`)
}
const isGuidesActive = computed(() => route.path.startsWith('/guides'))

const breadcrumbName = computed(() => {
  const path = route.path
  if (!path.startsWith('/tools/')) return null
  const slug = path.replace('/tools/', '')
  return toolMeta(slug)?.name ?? null
})

const BASE_URL = 'https://jsontools.space'
useHead(() => ({
  link: [{ rel: 'canonical', href: `${BASE_URL}${route.path}` }],
}))

useHead(() => {
  const path = route.path
  if (!path.startsWith('/tools/')) return {}
  const slug = path.replace('/tools/', '')
  const meta = toolMeta(slug)
  const name = meta?.name ?? slug
  const url = `${BASE_URL}${path}`
  return {
    script: [
      {
        key: 'schema-webapp',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name,
          url,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }),
      },
      {
        key: 'schema-breadcrumb',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'JSON Tools', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name, item: url },
          ],
        }),
      },
    ],
  }
})
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--c-bg);
  background-image: radial-gradient(circle, var(--c-dots) 0.75px, transparent 0.75px);
  background-size: 22px 22px;
  transition: background-color 0.2s ease;
}

/* ── Header ─────────────────────────────────────────────────────── */
.app-header {
  background: var(--c-card-alt);
  border-bottom: 1px solid var(--c-border);
  position: sticky;
  top: 0;
  z-index: 200;
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 52px;
  display: flex;
  align-items: center;
  gap: 28px;
}

.brand { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
.brand-mark { flex-shrink: 0; display: block; }
.brand-name { font-family: var(--font-display); font-size: 16px; font-weight: 800; text-transform: uppercase; color: var(--c-t1); }
.brand-name em { font-style: normal; color: var(--c-accent); }

.header-nav { flex: 1; display: flex; gap: 4px; align-items: center; }

.nav-item {
  padding: 5px 12px;
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: var(--c-t3);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.nav-item:hover { background: var(--c-subtle); color: var(--c-t1); }
.nav-item--active { background: rgb(var(--c-accent-rgb) / 0.12) !important; color: var(--c-accent) !important; }

.nav-group { position: relative; }
.nav-group-trigger { display: flex; align-items: center; gap: 5px; background: none; border: none; cursor: pointer; }

.nav-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: var(--c-subtle);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 5px;
  min-width: 180px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity 0.15s, transform 0.15s, visibility 0.15s;
  z-index: 300;
}
.nav-group--open .nav-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }

.nav-dropdown-item {
  display: block;
  padding: 7px 12px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--c-t3);
  text-decoration: none;
  transition: background 0.1s, color 0.1s;
  white-space: nowrap;
}
.nav-dropdown-item:hover { background: var(--c-faint); color: var(--c-t1); }

.nav-dropdown-divider { height: 1px; background: var(--c-border); margin: 5px 8px; }
.nav-dropdown-item.router-link-active { background: rgb(var(--c-accent-rgb) / 0.12); color: var(--c-accent); }

.header-badge { font-size: 11.5px; font-family: var(--font-body); color: var(--c-t5); flex-shrink: 0; letter-spacing: 0.01em; }

.theme-toggle {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border: 1px solid var(--c-border); border-radius: 8px;
  background: var(--c-subtle); color: var(--c-t3);
  cursor: pointer; flex-shrink: 0; transition: background 0.15s, color 0.15s;
}
.theme-toggle:hover { background: var(--c-faint); color: var(--c-t1); }

.mobile-menu-btn {
  display: none; flex-direction: column; justify-content: center; align-items: center; gap: 5px;
  width: 36px; height: 36px; border: none; background: var(--c-subtle); border-radius: 8px;
  cursor: pointer; margin-left: auto; flex-shrink: 0;
}
.hb-line { display: block; width: 16px; height: 1.5px; background: var(--c-t3); border-radius: 2px; transition: transform 0.2s ease, opacity 0.2s ease; transform-origin: center; }
.mobile-menu-btn.is-open .hb-line:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.mobile-menu-btn.is-open .hb-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
.mobile-menu-btn.is-open .hb-line:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

.mobile-nav {
  position: fixed; top: 52px; left: 0; right: 0; bottom: 0;
  background: var(--c-card-alt); z-index: 150; overflow-y: auto; border-top: 1px solid var(--c-border);
}
.mobile-nav-inner { padding: 16px; display: flex; flex-direction: column; gap: 8px; max-width: 480px; }
.mobile-section { display: flex; flex-direction: column; gap: 2px; }
.mobile-nav-divider { height: 1px; background: var(--c-border); margin: 4px 12px; }
.mobile-section-label { font-family: var(--font-body); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--c-t5); padding: 8px 12px 4px; }
.mobile-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; font-family: var(--font-mono); font-size: 13px; font-weight: 500; color: var(--c-t3); text-decoration: none; transition: background 0.1s, color 0.1s; }
.mobile-nav-item--main { font-family: var(--font-body); font-size: 14px; font-weight: 600; color: var(--c-t1); }
.mobile-nav-item:hover, .mobile-nav-item:active { background: var(--c-subtle); color: var(--c-t1); }
.mobile-nav-item.router-link-active { background: rgb(var(--c-accent-rgb) / 0.12); color: var(--c-accent); }

.mobile-drawer-enter-active, .mobile-drawer-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.mobile-drawer-enter-from, .mobile-drawer-leave-to { opacity: 0; transform: translateY(-8px); }

.app-main { flex: 1; display: flex; flex-direction: column; }

.ad-footer-wrap { max-width: 1280px; width: 100%; margin: 0 auto; padding: 0 24px 8px; }

.breadcrumb-bar { max-width: 1280px; margin: 0 auto; width: 100%; padding: 14px 24px 0; }
.breadcrumb { display: flex; align-items: center; gap: 6px; }
.bc-home { font-family: var(--font-body); font-size: 12.5px; color: var(--c-t4); text-decoration: none; transition: color 0.15s; }
.bc-home:hover { color: var(--c-accent); }
.bc-sep { font-size: 12px; color: var(--c-t5); line-height: 1; }
.bc-current { font-family: var(--font-body); font-size: 12.5px; color: var(--c-t2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }

@media (max-width: 1100px) {
  .header-badge { display: none; }
  .header-inner { gap: 16px; }
}

@media (max-width: 768px) {
  .header-inner { padding: 0 16px; gap: 12px; }
  .header-nav   { display: none; }
  .mobile-menu-btn { display: flex; }
  .ad-footer-wrap { padding: 0 16px 8px; }
  .breadcrumb-bar { padding: 12px 16px 0; }
  .bc-current { max-width: 200px; }
}
</style>
