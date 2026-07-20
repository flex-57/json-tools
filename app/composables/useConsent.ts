// ── Replace with your actual AdSense ID — must match nuxt.config.ts head scripts ──
export const ADSENSE_ID = 'ca-pub-6010651564611690' // adsense.google.com → Account → Account info
// ───────────────────────────────────────────────────────────────────────────────────

export function trackPageView(path: string) {
  const w = window as unknown as { gtag: (...args: unknown[]) => void }
  if (typeof w.gtag === 'function') {
    w.gtag('event', 'page_view', { page_path: path })
  }
}
