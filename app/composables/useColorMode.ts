const isDark = ref(true)

export function useColorMode() {
  function apply(dark: boolean) {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
  }

  function init() {
    try {
      const stored = localStorage.getItem('color-mode')
      // Dark is the brand default — only an explicit stored 'light' opts out.
      apply(stored ? stored === 'dark' : true)
    } catch {
      apply(true)
    }
  }

  function toggle() {
    const next = !isDark.value
    try { localStorage.setItem('color-mode', next ? 'dark' : 'light') } catch { /* ignore */ }
    apply(next)
  }

  return { isDark: readonly(isDark), init, toggle }
}
