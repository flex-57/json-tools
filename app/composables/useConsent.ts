// ── Replace these with your actual IDs ──────────────────────────────
export const GA4_ID      = 'G-2YDLBQ1QSH'          // analytics.google.com → Admin → Data Streams
export const ADSENSE_ID  = 'ca-pub-4709844187083671' // adsense.google.com → Account → Account info
// ────────────────────────────────────────────────────────────────────

export type ConsentState = 'accepted' | 'declined' | null

const STORAGE_KEY = 'jt-consent'

export function useConsent() {
  const consent = useState<ConsentState>('consent', () => null)

  function init() {
    if (import.meta.server) return
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentState | null
    if (stored === 'accepted' || stored === 'declined') {
      consent.value = stored
      if (stored === 'accepted') {
        loadGA4()
        loadAdSense()
      }
    }
  }

  function accept() {
    consent.value = 'accepted'
    localStorage.setItem(STORAGE_KEY, 'accepted')
    loadGA4()
    loadAdSense()
  }

  function decline() {
    consent.value = 'declined'
    localStorage.setItem(STORAGE_KEY, 'declined')
  }

  return { consent, init, accept, decline }
}

export function loadGA4() {
  if (import.meta.server) return
  const w = window as any
  if (w.__ga4loaded) return
  w.__ga4loaded = true

  const s = document.createElement('script')
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`
  s.async = true
  document.head.appendChild(s)

  w.dataLayer = w.dataLayer || []
  // Must use `arguments` (not rest params) — GA4 checks for Arguments object
  w.gtag = function () { w.dataLayer.push(arguments) }
  w.gtag('js', new Date())
  w.gtag('config', GA4_ID)
}

export function loadAdSense() {
  if (import.meta.server) return
  const w = window as any
  if (w.__adsenseloaded) return
  w.__adsenseloaded = true

  const s = document.createElement('script')
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`
  s.async = true
  s.crossOrigin = 'anonymous'
  document.head.appendChild(s)
}

export function trackPageView(path: string) {
  const w = window as any
  if (typeof w.gtag === 'function') {
    w.gtag('event', 'page_view', { page_path: path })
  }
}
