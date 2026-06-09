<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-inner">
        <NuxtLink to="/" class="brand">
          <div class="brand-mark">{ }</div>
          <span class="brand-name">json<em>tools</em></span>
        </NuxtLink>
        <nav class="header-nav">
          <NuxtLink to="/" class="nav-item" active-class="nav-item--active">Formatter</NuxtLink>
          <div class="nav-group">
            <button class="nav-item nav-group-trigger" :class="{ 'nav-item--active': isConverterActive }">
              Tools
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="nav-dropdown">
              <div class="nav-dropdown-section">Converters</div>
              <NuxtLink to="/tools/csv-to-json" class="nav-dropdown-item">CSV ↔ JSON</NuxtLink>
              <NuxtLink to="/tools/xml-to-json" class="nav-dropdown-item">XML ↔ JSON</NuxtLink>
              <NuxtLink to="/tools/yaml-to-json" class="nav-dropdown-item">YAML ↔ JSON</NuxtLink>
            </div>
          </div>
        </nav>
        <div class="header-badge">Free · No signup · No tracking</div>
      </div>
    </header>
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
const route = useRoute()
const isConverterActive = computed(() => route.path.startsWith('/tools/'))
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
  background-color: #F4F2ED;
  background-image: radial-gradient(circle, #CAC7BE 0.75px, transparent 0.75px);
  background-size: 22px 22px;
}

.app-header {
  background: #13181F;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
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
  font-style: normal;
}

.brand-name em {
  font-style: normal;
  color: #F97316;
}

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

.nav-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: #1C2330;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 5px;
  min-width: 150px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity 0.15s, transform 0.15s, visibility 0.15s;
  z-index: 200;
}

.nav-group:hover .nav-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.nav-dropdown-item {
  display: block;
  padding: 7px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #8B949E;
  text-decoration: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  transition: background 0.1s, color 0.1s;
  white-space: nowrap;
}

.nav-dropdown-item:hover {
  background: rgba(255,255,255,0.06);
  color: #E5E7EB;
}

.nav-dropdown-section {
  padding: 5px 12px 3px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3D4349;
}

.nav-dropdown-item.router-link-active {
  background: rgba(249,115,22,0.12);
  color: #FB923C;
}

.header-badge {
  font-size: 11.5px;
  color: #3D4349;
  flex-shrink: 0;
  letter-spacing: 0.01em;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
