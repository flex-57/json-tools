export function useToolShortcut(onPrimaryAction: () => void) {
  const handler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      onPrimaryAction()
    }
  }
  onMounted(() => window.addEventListener('keydown', handler, { capture: true }))
  onUnmounted(() => window.removeEventListener('keydown', handler, { capture: true }))
}
