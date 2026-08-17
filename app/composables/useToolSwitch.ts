export function useToolSwitch(fromPath: string, toPath: string) {
  const route = useRoute()
  const router = useRouter()

  const isFrom = computed(() => route.path === fromPath)

  function toggle() {
    router.push(isFrom.value ? toPath : fromPath)
  }

  return { isFrom, toggle }
}
