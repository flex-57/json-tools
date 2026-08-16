<template>
  <footer class="footer">

    <div class="footer-brand-row">
      <div class="footer-brand">
        <LogoMark :size="34" />
        <div>
          <div class="brand-name">json<em>tools</em></div>
          <p class="brand-tagline">Free developer tools.<br>No signup, no tracking, no nonsense.</p>
        </div>
      </div>
    </div>

    <!-- Desktop : grille par catégorie, pilotée par le registre app/data/tools.ts -->
    <nav class="footer-nav-desktop" aria-label="Site navigation">
      <div v-for="(label, key) in CATEGORIES" :key="key" class="footer-col">
        <span class="footer-col-title">{{ label }}</span>
        <NuxtLink v-for="t in toolsByCategory(key)" :key="t.slug" :to="`/tools/${t.slug}`" class="footer-link">{{ t.navLabel ?? t.name }}</NuxtLink>
      </div>
    </nav>

    <div class="footer-guides-desktop">
      <span class="footer-guides-label">Guides</span>
      <div class="footer-guides-pills">
        <NuxtLink v-for="g in GUIDE_LINKS" :key="g.to" :to="g.to" class="footer-pill">{{ g.label }}</NuxtLink>
      </div>
    </div>

    <!-- Mobile : rows + pills, mêmes données -->
    <nav class="footer-nav-mobile" aria-label="Site navigation">
      <div v-for="(label, key) in CATEGORIES" :key="key" class="footer-mobile-row">
        <span class="footer-mobile-cat">{{ label }}</span>
        <div class="footer-mobile-pills">
          <NuxtLink v-for="t in toolsByCategory(key)" :key="t.slug" :to="`/tools/${t.slug}`" class="footer-pill">{{ t.navLabel ?? t.name }}</NuxtLink>
        </div>
      </div>
      <div class="footer-mobile-row">
        <span class="footer-mobile-cat">Guides</span>
        <div class="footer-mobile-pills">
          <NuxtLink v-for="g in GUIDE_LINKS" :key="g.to" :to="g.to" class="footer-pill">{{ g.label }}</NuxtLink>
        </div>
      </div>
    </nav>

    <div class="footer-bottom">
      <span>© {{ new Date().getFullYear() }} JSON Tools</span>
      <span class="footer-sep">·</span>
      <span>Free · No signup · No tracking</span>
      <span class="footer-sep">·</span>
      <span>100% client-side</span>
      <span class="footer-sep">·</span>
      <NuxtLink to="/about" class="footer-bottom-link">About</NuxtLink>
      <span class="footer-sep">·</span>
      <NuxtLink to="/contact" class="footer-bottom-link">Contact</NuxtLink>
      <span class="footer-sep">·</span>
      <NuxtLink to="/faq" class="footer-bottom-link">FAQ</NuxtLink>
      <span class="footer-sep">·</span>
      <NuxtLink to="/privacy" class="footer-bottom-link">Privacy</NuxtLink>
      <span class="footer-sep">·</span>
      <NuxtLink to="/terms" class="footer-bottom-link">Terms</NuxtLink>
    </div>

  </footer>
</template>

<script setup lang="ts">
import { CATEGORIES, toolsByCategory } from '~/data/tools'
import { GUIDES } from '~/data/guides'

const GUIDE_LINKS = Object.values(GUIDES).map(g => ({
  label: g.title,
  to: `/guides/${g.slug}`,
}))
</script>

<style scoped>
.footer {
  background: var(--c-card-alt);
  border-top: 1px solid var(--c-border);
  margin-top: auto;
  font-family: var(--font-body);
}

.footer-brand-row {
  max-width: var(--container-w);
  margin: 0 auto;
  padding: 36px 24px 28px;
  border-bottom: 1px solid var(--c-border);
}

.footer-brand { display: flex; gap: 14px; align-items: flex-start; }

.brand-name { font-family: var(--font-display); font-size: 16px; font-weight: 800; text-transform: uppercase; color: var(--c-t1); margin-bottom: 6px; }
.brand-name em { font-style: normal; color: var(--c-accent); }

.brand-tagline { font-size: 12px; color: var(--c-t4); line-height: 1.7; }

.footer-nav-desktop {
  max-width: var(--container-w);
  margin: 0 auto;
  padding: 32px 24px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px 32px;
}

.footer-col { display: flex; flex-direction: column; gap: 9px; }

.footer-col-title {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-t5);
  margin-bottom: 3px;
}

.footer-link {
  font-size: 13px;
  color: var(--c-t4);
  text-decoration: none;
  font-family: var(--font-mono);
  transition: color 0.15s;
}
.footer-link:hover { color: var(--c-accent); }

.footer-guides-desktop {
  max-width: var(--container-w);
  margin: 0 auto;
  padding: 16px 24px 32px;
  border-top: 1px solid var(--c-border-s);
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-guides-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-t5);
  flex-shrink: 0;
}

.footer-guides-pills { display: flex; flex-wrap: wrap; gap: 6px; }

.footer-pill {
  font-size: 12px;
  color: var(--c-t4);
  text-decoration: none;
  font-family: var(--font-mono);
  padding: 3px 10px;
  border: 1px solid var(--c-border);
  border-radius: 20px;
  background: var(--c-faint);
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
}
.footer-pill:hover { color: var(--c-accent); border-color: rgb(var(--c-accent-rgb) / 0.35); }

.footer-nav-mobile { display: none; }

.footer-mobile-row { display: flex; flex-direction: column; gap: 8px; }

.footer-mobile-cat {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-t5);
}

.footer-mobile-pills { display: flex; flex-wrap: wrap; gap: 6px; }

.footer-bottom {
  max-width: var(--container-w);
  margin: 0 auto;
  padding: 14px 24px 20px;
  border-top: 1px solid var(--c-border-s);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--c-t4);
}

.footer-sep { color: var(--c-t4); }

.footer-bottom-link { color: var(--c-t4); text-decoration: none; border-bottom: 1px solid rgb(var(--c-accent-rgb) / 0.3); padding-bottom: 2px; transition: color 0.15s, border-color 0.15s; }
.footer-bottom-link:hover { color: var(--c-accent); border-bottom-color: var(--c-accent); }

@media (max-width: 768px) {
  .footer-nav-desktop    { display: none; }
  .footer-guides-desktop { display: none; }
  .footer-nav-mobile {
    display: flex;
    flex-direction: column;
    gap: 18px;
    max-width: var(--container-w);
    margin: 0 auto;
    padding: 24px 20px 28px;
  }
}
</style>
