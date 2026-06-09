export type Base64Variant = 'standard' | 'urlsafe'

function toUrlSafe(b64: string): string {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromUrlSafe(b64: string): string {
  const s = b64.replace(/-/g, '+').replace(/_/g, '/')
  return s + '=='.slice(0, (4 - (s.length % 4)) % 4)
}

export function encodeBase64(input: string, variant: Base64Variant = 'standard'): string {
  const b64 = btoa(unescape(encodeURIComponent(input)))
  return variant === 'urlsafe' ? toUrlSafe(b64) : b64
}

export function decodeBase64(input: string, variant: Base64Variant = 'standard'): string {
  const normalized = variant === 'urlsafe' ? fromUrlSafe(input.trim()) : input.trim()
  return decodeURIComponent(escape(atob(normalized)))
}

export function useBase64() {
  const mode = ref<'encode' | 'decode'>('encode')
  const variant = ref<Base64Variant>('standard')
  const input = ref('')
  const error = ref<string | null>(null)
  const copied = ref(false)

  const output = computed(() => {
    if (!input.value) return ''
    try {
      error.value = null
      return mode.value === 'encode'
        ? encodeBase64(input.value, variant.value)
        : decodeBase64(input.value, variant.value)
    } catch (e) {
      error.value = mode.value === 'decode' ? 'Invalid Base64 input' : (e as Error).message
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
