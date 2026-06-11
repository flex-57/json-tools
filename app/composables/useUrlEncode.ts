export type UrlVariant = 'component' | 'full'

export function useUrlEncode() {
  const mode = ref<'encode' | 'decode'>('encode')
  const variant = ref<UrlVariant>('component')
  const input = ref('')
  const error = ref<string | null>(null)
  const copied = ref(false)

  const output = computed(() => {
    if (!input.value) return ''
    try {
      error.value = null
      if (mode.value === 'encode') {
        return variant.value === 'component'
          ? encodeURIComponent(input.value)
          : encodeURI(input.value)
      } else {
        return variant.value === 'component'
          ? decodeURIComponent(input.value)
          : decodeURI(input.value)
      }
    } catch (e) {
      error.value = mode.value === 'decode'
        ? 'Invalid percent-encoded sequence'
        : (e as Error).message
      return ''
    }
  })

  async function copy() {
    if (!output.value) return
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }

  function clear() {
    input.value = ''
    error.value = null
  }

  function swap() {
    if (!output.value) return
    input.value = output.value
  }

  return { mode, variant, input, output, error, copied, copy, clear, swap }
}
