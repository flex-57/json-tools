const isDark = ref(false)

export function useColorMode() {
  function apply(dark: boolean) {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
  }

  function init() {
    try {
      const stored = localStorage.getItem('color-mode')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      apply(stored ? stored === 'dark' : prefersDark)
    } catch {
      apply(false)
    }
  }

  function toggle() {
    const next = !isDark.value
    try { localStorage.setItem('color-mode', next ? 'dark' : 'light') } catch { /* ignore */ }
    apply(next)
  }

  return { isDark: readonly(isDark), init, toggle }
}
