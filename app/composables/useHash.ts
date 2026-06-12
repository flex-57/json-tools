export const HASH_ALGORITHMS = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'] as const
export type HashAlgorithm = typeof HASH_ALGORITHMS[number]

// Compact MD5 — RFC 1321 (public domain)
function md5(input: string): string {
  const msg = new TextEncoder().encode(input)
  const len = msg.length
  const padLen = len % 64 < 56 ? 56 - (len % 64) : 120 - (len % 64)
  const padded = new Uint8Array(len + padLen + 8)
  padded.set(msg)
  padded[len] = 0x80
  const dv = new DataView(padded.buffer)
  dv.setUint32(len + padLen,     (len * 8) >>> 0,                          true)
  dv.setUint32(len + padLen + 4, Math.floor((len * 8) / 0x100000000) >>> 0, true)

  const T = Array.from({ length: 64 }, (_, i) => (Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0)
  const S = [7,12,17,22, 5,9,14,20, 4,11,16,23, 6,10,15,21]
  const rol = (x: number, n: number) => (x << n) | (x >>> (32 - n))

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476

  for (let off = 0; off < padded.length; off += 64) {
    const M = Array.from({ length: 16 }, (_, i) => dv.getUint32(off + i * 4, true))
    let [a, b, c, d] = [a0, b0, c0, d0]
    for (let i = 0; i < 64; i++) {
      let f: number, g: number
      if      (i < 16) { f = (b & c) | (~b & d); g = i }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16 }
      else if (i < 48) { f = b ^ c ^ d;           g = (3 * i + 5) % 16 }
      else             { f = c ^ (b | ~d);         g = (7 * i) % 16 }
      const s = S[(i >> 4) * 4 + (i & 3)]
      const tmp = d; d = c; c = b
      b = (b + rol((a + f + T[i] + M[g]) >>> 0, s)) >>> 0
      a = tmp
    }
    a0 = (a0 + a) >>> 0; b0 = (b0 + b) >>> 0
    c0 = (c0 + c) >>> 0; d0 = (d0 + d) >>> 0
  }

  const out = new Uint8Array(16)
  const ov = new DataView(out.buffer)
  ov.setUint32(0, a0, true); ov.setUint32(4, b0, true)
  ov.setUint32(8, c0, true); ov.setUint32(12, d0, true)
  return Array.from(out).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function sha(alg: string, input: string): Promise<string> {
  const buf = await crypto.subtle.digest(alg, new TextEncoder().encode(input))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function computeHashes(input: string): Promise<Record<HashAlgorithm, string>> {
  if (!input) return { 'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-512': '' }
  const [sha1, sha256, sha512] = await Promise.all([
    sha('SHA-1', input),
    sha('SHA-256', input),
    sha('SHA-512', input),
  ])
  return { 'MD5': md5(input), 'SHA-1': sha1, 'SHA-256': sha256, 'SHA-512': sha512 }
}
