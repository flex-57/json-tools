export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tools.css', '@vue-flow/core/dist/style.css', '@vue-flow/core/dist/theme-default.css', '@vue-flow/controls/dist/style.css'],
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml'],
    },
    routeRules: {
      '/**': {
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'X-Powered-By': '',
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://tpc.googlesyndication.com https://ep1.adtrafficquality.google; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com; frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com; object-src 'none'; base-uri 'self';",
          'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
      '/_nuxt/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable',
        },
      },
    },
  },
  vite: {
    define: {
      'process.env': '{}',
      'process.nextTick': '((fn, ...args) => setTimeout(() => fn(...args), 0))',
      'process.cwd': '(() => "/")',
    },
    optimizeDeps: {
      include: ['codemirror', '@codemirror/state', '@codemirror/lang-json', '@codemirror/lang-javascript', '@codemirror/lang-xml', '@codemirror/lang-yaml', '@codemirror/lang-sql', '@codemirror/lang-css', '@codemirror/lang-html', '@codemirror/language', '@codemirror/theme-one-dark', '@vue-flow/core', '@dagrejs/dagre'],
      exclude: ['lightningcss-wasm'],
    },
  },
  router: {
    options: { strict: true },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'google-site-verification', content: '8DE8D4b24zhqlMDyZA48SH3D1xLDYIwN2_PXDoRMG3E' },
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
          innerHTML: "(function(){try{var m=localStorage.getItem('color-mode');if(m==='dark'||(m===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()",
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;1,400&display=swap' },
      ],
    },
  },
})
