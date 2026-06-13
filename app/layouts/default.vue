<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-inner">
        <NuxtLink to="/" class="brand" @click="mobileOpen = false">
          <div class="brand-mark">{ }</div>
          <span class="brand-name">json<em>tools</em></span>
        </NuxtLink>

        <!-- Desktop nav -->
        <nav class="header-nav">
          <NuxtLink to="/" class="nav-item" :class="{ 'nav-item--active': route.path === '/' }">Formatter</NuxtLink>

          <!-- Converters dropdown -->
          <div class="nav-group">
            <button class="nav-item nav-group-trigger" :class="{ 'nav-item--active': isConverterActive }">
              Converters
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="nav-dropdown">
              <NuxtLink to="/tools/csv-to-json"   class="nav-dropdown-item">CSV ↔ JSON</NuxtLink>
              <NuxtLink to="/tools/xml-to-json"   class="nav-dropdown-item">XML ↔ JSON</NuxtLink>
              <NuxtLink to="/tools/yaml-to-json"  class="nav-dropdown-item">YAML ↔ JSON</NuxtLink>
              <NuxtLink to="/tools/excel-to-json" class="nav-dropdown-item">Excel ↔ JSON</NuxtLink>
            </div>
          </div>

          <!-- Tools mega-menu -->
          <div class="nav-group">
            <button class="nav-item nav-group-trigger" :class="{ 'nav-item--active': isToolActive }">
              Tools
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="nav-dropdown nav-dropdown--mega">
              <div class="mega-col">
                <div class="nav-dropdown-section">JSON</div>
                <NuxtLink to="/tools/json-diff"  class="nav-dropdown-item">JSON Diff</NuxtLink>
                <NuxtLink to="/tools/json-tree"  class="nav-dropdown-item">JSON Tree</NuxtLink>
                <NuxtLink to="/tools/json-to-ts" class="nav-dropdown-item">JSON → TypeScript</NuxtLink>
                <div class="nav-dropdown-section mega-section-gap">Encode</div>
                <NuxtLink to="/tools/base64"      class="nav-dropdown-item">Base64</NuxtLink>
                <NuxtLink to="/tools/url-encode"  class="nav-dropdown-item">URL Encode / Decode</NuxtLink>
                <NuxtLink to="/tools/jwt-decoder" class="nav-dropdown-item">JWT Decoder</NuxtLink>
              </div>
              <div class="mega-divider" />
              <div class="mega-col">
                <div class="nav-dropdown-section">Developer</div>
                <NuxtLink to="/tools/regex-tester"    class="nav-dropdown-item">Regex Tester</NuxtLink>
                <NuxtLink to="/tools/cron-parser"     class="nav-dropdown-item">Cron Parser</NuxtLink>
                <NuxtLink to="/tools/unix-timestamp"  class="nav-dropdown-item">Unix Timestamp</NuxtLink>
                <div class="nav-dropdown-section mega-section-gap">Generate</div>
                <NuxtLink to="/tools/hash"            class="nav-dropdown-item">Hash Generator</NuxtLink>
                <NuxtLink to="/tools/uuid"            class="nav-dropdown-item">UUID Generator</NuxtLink>
              </div>
            </div>
          </div>
        </nav>

        <div class="header-badge">Free · No signup · No tracking</div>

        <!-- Dark mode toggle -->
        <button class="theme-toggle" @click="toggle" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <svg v-if="isDark" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>

        <!-- Mobile hamburger -->
        <button class="mobile-menu-btn" :class="{ 'is-open': mobileOpen }" @click="mobileOpen = !mobileOpen" aria-label="Toggle menu">
          <span class="hb-line" />
          <span class="hb-line" />
          <span class="hb-line" />
        </button>
      </div>
    </header>

    <!-- Mobile nav drawer -->
    <Transition name="mobile-drawer">
      <nav v-if="mobileOpen" class="mobile-nav">
        <div class="mobile-nav-inner">
          <div class="mobile-section">
            <NuxtLink to="/" class="mobile-nav-item mobile-nav-item--main" @click="mobileOpen = false">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7.5L7 2l6 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 9.5V12h8V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Formatter
            </NuxtLink>
          </div>

          <div class="mobile-section">
            <div class="mobile-section-label">Converters</div>
            <NuxtLink to="/tools/csv-to-json"   class="mobile-nav-item" @click="mobileOpen = false">CSV ↔ JSON</NuxtLink>
            <NuxtLink to="/tools/xml-to-json"   class="mobile-nav-item" @click="mobileOpen = false">XML ↔ JSON</NuxtLink>
            <NuxtLink to="/tools/yaml-to-json"  class="mobile-nav-item" @click="mobileOpen = false">YAML ↔ JSON</NuxtLink>
            <NuxtLink to="/tools/excel-to-json" class="mobile-nav-item" @click="mobileOpen = false">Excel ↔ JSON</NuxtLink>
          </div>

          <div class="mobile-section">
            <div class="mobile-section-label">JSON</div>
            <NuxtLink to="/tools/json-diff"  class="mobile-nav-item" @click="mobileOpen = false">JSON Diff</NuxtLink>
            <NuxtLink to="/tools/json-tree"  class="mobile-nav-item" @click="mobileOpen = false">JSON Tree</NuxtLink>
            <NuxtLink to="/tools/json-to-ts" class="mobile-nav-item" @click="mobileOpen = false">JSON → TypeScript</NuxtLink>
          </div>

          <div class="mobile-section">
            <div class="mobile-section-label">Encode</div>
            <NuxtLink to="/tools/base64"      class="mobile-nav-item" @click="mobileOpen = false">Base64</NuxtLink>
            <NuxtLink to="/tools/url-encode"  class="mobile-nav-item" @click="mobileOpen = false">URL Encode / Decode</NuxtLink>
            <NuxtLink to="/tools/jwt-decoder" class="mobile-nav-item" @click="mobileOpen = false">JWT Decoder</NuxtLink>
          </div>

          <div class="mobile-section">
            <div class="mobile-section-label">Developer</div>
            <NuxtLink to="/tools/regex-tester"   class="mobile-nav-item" @click="mobileOpen = false">Regex Tester</NuxtLink>
            <NuxtLink to="/tools/cron-parser"    class="mobile-nav-item" @click="mobileOpen = false">Cron Parser</NuxtLink>
            <NuxtLink to="/tools/unix-timestamp" class="mobile-nav-item" @click="mobileOpen = false">Unix Timestamp</NuxtLink>
          </div>

          <div class="mobile-section">
            <div class="mobile-section-label">Generate</div>
            <NuxtLink to="/tools/hash" class="mobile-nav-item" @click="mobileOpen = false">Hash Generator</NuxtLink>
            <NuxtLink to="/tools/uuid" class="mobile-nav-item" @click="mobileOpen = false">UUID Generator</NuxtLink>
          </div>
        </div>
      </nav>
    </Transition>

    <main class="app-main">
      <slot />
    </main>
    <div class="ad-footer-wrap">
      <AdSlot slot-id="XXXXXXXXXX" />
    </div>
    <AppFooter />
    <CookieBanner />
  </div>
</template>

<script setup>
import { useConsent, trackPageView } from '~/composables/useConsent'
import { useColorMode } from '~/composables/useColorMode'

const route = useRoute()
const mobileOpen = ref(false)
const { init } = useConsent()
const { isDark, init: initColorMode, toggle } = useColorMode()

onMounted(() => {
  init()
  initColorMode()
})

watch(() => route.path, (path) => {
  mobileOpen.value = false
  trackPageView(path)
})

const converterPaths = ['/tools/csv-to-json', '/tools/json-to-csv', '/tools/xml-to-json', '/tools/json-to-xml', '/tools/yaml-to-json', '/tools/json-to-yaml', '/tools/excel-to-json', '/tools/json-to-excel']
const toolPaths = ['/tools/jwt-decoder', '/tools/json-diff', '/tools/json-tree', '/tools/base64', '/tools/url-encode', '/tools/unix-timestamp', '/tools/regex-tester', '/tools/cron-parser', '/tools/json-to-ts', '/tools/hash', '/tools/uuid']
const isConverterActive = computed(() => converterPaths.some(p => route.path.startsWith(p)))
const isToolActive = computed(() => toolPaths.some(p => route.path.startsWith(p)))

const BASE_URL = 'https://jsontools.space'
useHead(() => ({
  link: [{ rel: 'canonical', href: `${BASE_URL}${route.path}` }],
}))
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Outfit', system-ui, sans-serif;
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
  background: #13181F;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 200;
}

.header-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  height: 52px;
  display: flex;
  align-items: center;
  gap: 28px;
}

/* ── Brand ──────────────────────────────────────────────────────── */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-mark {
  width: 30px;
  height: 30px;
  background: #F97316;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: white;
  letter-spacing: -1px;
  flex-shrink: 0;
}

.brand-name {
  font-size: 15px;
  font-weight: 600;
  color: #F1F0EE;
  letter-spacing: -0.3px;
}

.brand-name em {
  font-style: normal;
  color: #F97316;
}

/* ── Desktop nav ────────────────────────────────────────────────── */
.header-nav {
  flex: 1;
  display: flex;
  gap: 4px;
}

.nav-item {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #5C6470;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #C9C8C5;
}

.nav-item--active {
  background: rgba(249, 115, 22, 0.12) !important;
  color: #FB923C !important;
}

.nav-group {
  position: relative;
}

.nav-group-trigger {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
}

/* ── Dropdown (shared) ──────────────────────────────────────────── */
.nav-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: #1C2330;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 5px;
  min-width: 160px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity 0.15s, transform 0.15s, visibility 0.15s;
  z-index: 300;
}

.nav-group:hover .nav-dropdown,
.nav-group:focus-within .nav-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.nav-dropdown-item {
  display: block;
  padding: 7px 12px;
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  color: #8B949E;
  text-decoration: none;
  transition: background 0.1s, color 0.1s;
  white-space: nowrap;
}

.nav-dropdown-item:hover {
  background: rgba(255,255,255,0.06);
  color: #E5E7EB;
}

.nav-dropdown-item.router-link-active {
  background: rgba(249,115,22,0.12);
  color: #FB923C;
}

.nav-dropdown-section {
  padding: 5px 12px 3px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3D4349;
}

.mega-section-gap { margin-top: 6px; }

/* ── Mega-menu ──────────────────────────────────────────────────── */
.nav-dropdown--mega {
  display: flex;
  gap: 0;
  padding: 8px;
  min-width: 360px;
}

.mega-col {
  flex: 1;
  min-width: 0;
}

.mega-divider {
  width: 1px;
  background: rgba(255,255,255,0.06);
  margin: 4px 8px;
  flex-shrink: 0;
}

/* ── Badge ──────────────────────────────────────────────────────── */
.header-badge {
  font-size: 11.5px;
  color: #3D4349;
  flex-shrink: 0;
  letter-spacing: 0.01em;
}

/* ── Theme toggle ───────────────────────────────────────────────── */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  background: rgba(255,255,255,0.04);
  color: #5C6470;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.theme-toggle:hover { background: rgba(255,255,255,0.08); color: #C9C8C5; }

/* ── Hamburger button ───────────────────────────────────────────── */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255,255,255,0.06);
  border-radius: 8px;
  cursor: pointer;
  margin-left: auto;
  flex-shrink: 0;
}

.hb-line {
  display: block;
  width: 16px;
  height: 1.5px;
  background: #8B949E;
  border-radius: 2px;
  transition: transform 0.2s ease, opacity 0.2s ease;
  transform-origin: center;
}

.mobile-menu-btn.is-open .hb-line:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.mobile-menu-btn.is-open .hb-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
.mobile-menu-btn.is-open .hb-line:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* ── Mobile nav drawer ──────────────────────────────────────────── */
.mobile-nav {
  position: fixed;
  top: 52px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #13181F;
  z-index: 150;
  overflow-y: auto;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.mobile-nav-inner {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 480px;
}

.mobile-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #3D4349;
  padding: 8px 12px 4px;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  color: #8B949E;
  text-decoration: none;
  transition: background 0.1s, color 0.1s;
}

.mobile-nav-item--main {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #C9C8C5;
}

.mobile-nav-item:hover,
.mobile-nav-item:active { background: rgba(255,255,255,0.06); color: #E5E7EB; }

.mobile-nav-item.router-link-active { background: rgba(249,115,22,0.12); color: #FB923C; }

/* ── Drawer transition ──────────────────────────────────────────── */
.mobile-drawer-enter-active,
.mobile-drawer-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.mobile-drawer-enter-from,
.mobile-drawer-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── Main ───────────────────────────────────────────────────────── */
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ad-footer-wrap {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px 8px;
}

@media (max-width: 768px) {
  .ad-footer-wrap { padding: 0 16px 8px; }
}

/* ── Responsive ─────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .header-inner { padding: 0 16px; gap: 12px; }
  .header-nav   { display: none; }
  .header-badge { display: none; }
  .mobile-menu-btn { display: flex; }
}
</style>
