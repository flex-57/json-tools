// HMAC-MD5 is deliberately not offered: Web Crypto's `subtle.sign('HMAC', ...)`
// only accepts SHA-family hashes as the underlying digest, and MD5 is
// deprecated for anything security-adjacent anyway — every real HMAC use case
// (webhook signatures, AWS SigV4, JWT HS256/384/512) already uses SHA.
export const HMAC_ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const
export type HmacAlgorithm = typeof HMAC_ALGORITHMS[number]
export type HmacFormat = 'hex' | 'base64'

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

async function hmacSign(message: string, secret: string, alg: HmacAlgorithm): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: alg },
    false,
    ['sign'],
  )
  return crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
}

export async function computeHmacs(message: string, secret: string, format: HmacFormat): Promise<Record<HmacAlgorithm, string>> {
  if (!message || !secret) return { 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' }
  const entries = await Promise.all(HMAC_ALGORITHMS.map(async (alg) => {
    const buf = await hmacSign(message, secret, alg)
    return [alg, format === 'hex' ? toHex(buf) : toBase64(buf)] as const
  }))
  return Object.fromEntries(entries) as Record<HmacAlgorithm, string>
}
