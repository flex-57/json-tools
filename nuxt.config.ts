export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tools.css', '@vue-flow/core/dist/style.css', '@vue-flow/core/dist/theme-default.css', '@vue-flow/controls/dist/style.css'],
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  nitro: {
    prerender: {
      routes: ['/sitemap.xml'],
    },
  },
  vite: {
    optimizeDeps: {
      include: ['codemirror', '@codemirror/state', '@codemirror/lang-json', '@codemirror/theme-one-dark', '@vue-flow/core', '@dagrejs/dagre'],
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'robots', content: 'index, follow' },
        { name: 'google-adsense-account', content: 'ca-pub-6010651564611690' },
        { name: 'theme-color', content: '#F97316' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'JSON Tools' },
        { property: 'og:image', content: 'https://jsontools.space/og/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://jsontools.space/og/og-image.png' },
      ],
      script: [
        {
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6010651564611690',
          async: true,
          crossorigin: 'anonymous',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;1,400&display=swap' },
      ],
    },
  },
})
