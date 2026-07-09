import { useClipboard } from './useClipboard'

export type UrlVariant = 'component' | 'full'

const SAMPLE_PLAIN = 'name=John Doe&city=São Paulo&redirect=https://example.com/path?lang=fr'
const SAMPLE_ENCODED = encodeURIComponent(SAMPLE_PLAIN)

export function useUrlEncode() {
  const mode = ref<'encode' | 'decode'>('encode')
  const variant = ref<UrlVariant>('component')
  const input = ref(SAMPLE_PLAIN)
  const error = ref<string | null>(null)

  watch(mode, (newMode, oldMode) => {
    const oldSample = oldMode === 'encode' ? SAMPLE_PLAIN : SAMPLE_ENCODED
    if (input.value === oldSample) {
      input.value = newMode === 'encode' ? SAMPLE_PLAIN : SAMPLE_ENCODED
    }
  })

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

  const { copied, copy } = useClipboard(() => output.value)

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
