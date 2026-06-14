export type JwtAlgorithm = 'HS256' | 'HS384' | 'HS512'

const DEFAULT_PAYLOAD = `{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}`

function base64urlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  bytes.forEach(b => { bin += String.fromCharCode(b) })
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64urlFromBuf(buf: ArrayBuffer): string {
  let bin = ''
  new Uint8Array(buf).forEach(b => { bin += String.fromCharCode(b) })
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function signHmac(alg: JwtAlgorithm, secret: string, data: string): Promise<string> {
  const hash = { HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512' }[alg]
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return base64urlFromBuf(sig)
}

export function useJwtGenerator() {
  const algorithm = ref<JwtAlgorithm>('HS256')
  const payload   = ref(DEFAULT_PAYLOAD)
  const secret    = ref('your-256-bit-secret')
  const token     = ref('')
  const error     = ref<string | null>(null)
  const copied    = ref(false)

  let timer: ReturnType<typeof setTimeout> | null = null

  async function generate() {
    const pl = payload.value.trim()
    if (!pl) { token.value = ''; error.value = null; return }

    let payloadObj: Record<string, unknown>
    try { payloadObj = JSON.parse(pl) } catch { error.value = 'Invalid JSON payload'; token.value = ''; return }
    error.value = null

    try {
      const header = { alg: algorithm.value, typ: 'JWT' }
      const h   = base64urlEncode(JSON.stringify(header))
      const p   = base64urlEncode(JSON.stringify(payloadObj))
      const sig = await signHmac(algorithm.value, secret.value, h + '.' + p)
      token.value = h + '.' + p + '.' + sig
    } catch {
      error.value = 'Signing failed'
      token.value = ''
    }
  }

  watch([payload, secret, algorithm], () => {
    if (!import.meta.client) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(generate, 150)
  })

  function setIatNow() {
    try {
      const obj = JSON.parse(payload.value)
      obj.iat = Math.floor(Date.now() / 1000)
      payload.value = JSON.stringify(obj, null, 2)
    } catch { /* ignore invalid JSON */ }
  }

  function addExp(hours = 1) {
    try {
      const obj = JSON.parse(payload.value)
      const base = typeof obj.iat === 'number' ? obj.iat : Math.floor(Date.now() / 1000)
      if (!obj.iat) obj.iat = base
      obj.exp = base + hours * 3600
      payload.value = JSON.stringify(obj, null, 2)
    } catch { /* ignore */ }
  }

  async function copy() {
    if (!token.value) return
    await navigator.clipboard.writeText(token.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }

  function clear() { payload.value = DEFAULT_PAYLOAD; secret.value = 'your-256-bit-secret'; token.value = ''; error.value = null }

  const parts = computed(() => token.value.split('.'))

  const payloadValid = computed(() => { try { JSON.parse(payload.value); return true } catch { return false } })

  return { algorithm, payload, secret, token, parts, error, copied, payloadValid, copy, clear, setIatNow, addExp }
}
