export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tools.css'],
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  vite: {
    optimizeDeps: {
      include: ['codemirror', '@codemirror/state', '@codemirror/lang-json', '@codemirror/theme-one-dark'],
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'robots', content: 'index, follow' },
        { name: 'google-adsense-account', content: 'ca-pub-XXXXXXXXXXXXXXXXX' },
        { name: 'theme-color', content: '#F97316' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'JSON Tools' },
        { property: 'og:image', content: 'https://json-tools-one.vercel.app/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://json-tools-one.vercel.app/og-image.png' },
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
