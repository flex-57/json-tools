import type { Ref } from 'vue'

export function useUrlInput(inputRef: Ref<string>, onReady?: () => void) {
  const route = useRoute()
  onMounted(() => {
    const param = route.query.input
    if (typeof param === 'string' && param) {
      inputRef.value = decodeURIComponent(param)
      nextTick(() => onReady?.())
    }
  })
}
