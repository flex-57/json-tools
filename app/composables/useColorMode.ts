const isDark = ref(false)

export function useColorMode() {
  function apply(dark: boolean) {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
  }

  function init() {
    const stored = localStorage.getItem('color-mode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    apply(stored ? stored === 'dark' : prefersDark)
  }

  function toggle() {
    const next = !isDark.value
    localStorage.setItem('color-mode', next ? 'dark' : 'light')
    apply(next)
  }

  return { isDark: readonly(isDark), init, toggle }
}
