export interface JwtPart {
  raw: string
  decoded: Record<string, unknown> | null
  error: string | null
}

export interface JwtResult {
  header: JwtPart
  payload: JwtPart
  signature: string
  error: string | null
  isExpired: boolean | null
  expiresAt: Date | null
  issuedAt: Date | null
  timeLeft: string | null
}

function base64urlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '=='.slice(0, (4 - (base64.length % 4)) % 4)
  return decodeURIComponent(
    atob(padded).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''),
  )
}

function parsePart(raw: string): JwtPart {
  try {
    const decoded = JSON.parse(base64urlDecode(raw))
    return { raw, decoded, error: null }
  } catch (e) {
    return { raw, decoded: null, error: (e as Error).message }
  }
}

function formatTimeLeft(seconds: number): string {
  if (seconds < 0) return 'expired'
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function decodeJwt(token: string): JwtResult {
  const trimmed = token.trim()

  if (!trimmed) {
    return { header: { raw: '', decoded: null, error: null }, payload: { raw: '', decoded: null, error: null }, signature: '', error: 'empty', isExpired: null, expiresAt: null, issuedAt: null, timeLeft: null }
  }

  const parts = trimmed.split('.')
  if (parts.length !== 3) {
    return { header: { raw: '', decoded: null, error: null }, payload: { raw: '', decoded: null, error: null }, signature: '', error: 'Invalid JWT — expected 3 parts separated by dots', isExpired: null, expiresAt: null, issuedAt: null, timeLeft: null }
  }

  const [rawHeader, rawPayload, signature] = parts as [string, string, string]
  const header = parsePart(rawHeader)
  const payload = parsePart(rawPayload)

  let isExpired: boolean | null = null
  let expiresAt: Date | null = null
  let issuedAt: Date | null = null
  let timeLeft: string | null = null

  if (payload.decoded) {
    const p = payload.decoded as Record<string, unknown>
    if (typeof p.exp === 'number') {
      expiresAt = new Date(p.exp * 1000)
      const secondsLeft = p.exp - Date.now() / 1000
      isExpired = secondsLeft < 0
      timeLeft = formatTimeLeft(secondsLeft)
    }
    if (typeof p.iat === 'number') {
      issuedAt = new Date(p.iat * 1000)
    }
  }

  return {
    header,
    payload,
    signature,
    error: header.error ?? payload.error,
    isExpired,
    expiresAt,
    issuedAt,
    timeLeft,
  }
}

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export function useJwtDecoder() {
  const token = ref(SAMPLE_JWT)
  const result = computed(() => decodeJwt(token.value))
  const copiedHeader = ref(false)
  const copiedPayload = ref(false)

  async function copyHeader() {
    if (!result.value.header.decoded) return
    await navigator.clipboard.writeText(JSON.stringify(result.value.header.decoded, null, 2))
    copiedHeader.value = true
    setTimeout(() => { copiedHeader.value = false }, 2000)
  }

  async function copyPayload() {
    if (!result.value.payload.decoded) return
    await navigator.clipboard.writeText(JSON.stringify(result.value.payload.decoded, null, 2))
    copiedPayload.value = true
    setTimeout(() => { copiedPayload.value = false }, 2000)
  }

  function clear() { token.value = '' }

  return { token, result, copiedHeader, copiedPayload, copyHeader, copyPayload, clear }
}
