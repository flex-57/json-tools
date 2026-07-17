// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts'],
  fonts: {
    // Site content is English with the occasional accented Latin character
    // (café, naïve...) — the module's default subset list also fetches
    // cyrillic/greek/vietnamese we never display, so restrict to latin/latin-ext.
    defaults: { subsets: ['latin', 'latin-ext'] },
    families: [
      { name: 'Big Shoulders', provider: 'google', weights: [500, 700, 800] },
      { name: 'Public Sans', provider: 'google', weights: [400, 500, 600, 700], styles: ['normal', 'italic'] },
      { name: 'Fragment Mono', provider: 'google', styles: ['normal', 'italic'] },
    ],
  },
  css: ['~/assets/css/tools.css', '@vue-flow/core/dist/style.css', '@vue-flow/core/dist/theme-default.css', '@vue-flow/controls/dist/style.css'],
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
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://tpc.googlesyndication.com https://*.adtrafficquality.google https://fundingchoicesmessages.google.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com https://fundingchoicesmessages.google.com https://*.adtrafficquality.google; frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com https://pagead2.googlesyndication.com https://*.adtrafficquality.google; object-src 'none'; base-uri 'self'; frame-ancestors 'none';",
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
    optimizeDeps: {
      include: ['codemirror', '@codemirror/state', '@codemirror/lang-json', '@codemirror/lang-javascript', '@codemirror/lang-xml', '@codemirror/lang-yaml', '@codemirror/lang-sql', '@codemirror/lang-css', '@codemirror/lang-html', '@codemirror/language', '@codemirror/theme-one-dark', '@vue-flow/core', '@dagrejs/dagre'],
      exclude: ['lightningcss-wasm'],
    },
  },
  router: {
    options: { strict: true },
  },
  experimental: {
    // Default NuxtLink prefetch fires on viewport visibility, not on hover/click —
    // on the homepage's tool grid that silently downloads every visible tool's JS
    // chunk (CodeMirror, Vue Flow+D3...) before the visitor ever clicks one.
    defaults: {
      nuxtLink: {
        prefetchOn: { visibility: false, interaction: true },
      },
    },
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
        { name: 'theme-color', content: '#FF3D8F' },
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
          // Dark is the brand default — only an explicit stored 'light' opts out. Must match useColorMode.ts.
          innerHTML: "(function(){try{var m=localStorage.getItem('color-mode');if(m!=='light'){document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()",
        },
        {
          // Consent Mode default must run before gtag.js/adsbygoogle.js execute — Google's CMP (configured
          // in AdSense > Privacy & messaging) updates this automatically once the visitor answers the popup.
          // Denial is scoped to EEA/UK/Switzerland ONLY (region param) — everywhere else defaults to granted,
          // so GA4/ads aren't blocked worldwide while Google's CMP is inactive/pending (e.g. site still under
          // AdSense review). Without this scoping, a global 'denied' default with no CMP ever granting it
          // back silently kills analytics for every visitor, everywhere, indefinitely.
          // Both tags are appended here (not as separate head.script entries) because unhead renders
          // src-scripts before inline ones regardless of array order, which would break the required
          // sequencing. adsbygoogle.js also triggers the Funding Choices popup for EEA/UK/CH visitors — it
          // must load unconditionally, not gated behind our own consent decision.
          innerHTML: `
            window.dataLayer=window.dataLayer||[];
            function gtag(){window.dataLayer.push(arguments)}
            gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH']});
            gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
            gtag('js',new Date());
            gtag('config','G-2YDLBQ1QSH');
            var gtagScript=document.createElement('script');
            gtagScript.async=true;
            gtagScript.src='https://www.googletagmanager.com/gtag/js?id=G-2YDLBQ1QSH';
            document.head.appendChild(gtagScript);
            var adsScript=document.createElement('script');
            adsScript.async=true;
            adsScript.crossOrigin='anonymous';
            adsScript.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6010651564611690';
            document.head.appendChild(adsScript);
          `,
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'manifest', href: '/manifest.json' },
        // @nuxt/fonts' own `preload` option isn't subset/style-aware — it preloaded
        // the latin-ext + italic variants instead of the normal-weight latin ones
        // every page actually renders above the fold (headline, body text, mono
        // labels), so the browser only discovered the real ones after parsing the
        // CSS. Preloading these 3 explicitly (found via the compiled CSS's
        // unicode-range: U+0000-00FF entries) removes that extra round-trip.
        // Content-hashed from the font data itself, not our code — stable across
        // app rebuilds, only changes if the fonts.families config above does.
        { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: 'anonymous', href: '/_fonts/v0Gof_ovEr_VMeGc8oizTPGRJxogA8OY-x4wxCppOPc-BZrL8W8Nayz5Luu0puSoa0E3ijn1ZSXSztDAnTtPmN0.woff2' },
        { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: 'anonymous', href: '/_fonts/GsKUclqeNLJ96g5AU593ug6yanivOiwjW_7zESNPChw-jHA4tBeM1bjF7LATGUpfBuSTyomIFrWBTzjF7txVYfg.woff2' },
        { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: 'anonymous', href: '/_fonts/uad4kCqb7y1SeJd0GABjFyKl9Dw1alPHDBrHPL_iMGk-7xHwdlxahUomNQdGjCBQJJPfKB4xxi3x2UXnCqH_m_o.woff2' },
      ],
    },
  },
})
