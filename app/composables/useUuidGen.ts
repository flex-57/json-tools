// UUIDv7 per RFC 9562 §5.7 — verified against the RFC's own field-layout
// diagram, not derived from a general "48-bit timestamp + random" sketch:
//   bits   0-47  unix_ts_ms  (48-bit big-endian ms since epoch)
//   bits  48-51  ver         (0b0111)
//   bits  52-63  rand_a      (12 bits)
//   bits  64-65  var         (0b10)
//   bits  66-127 rand_b      (62 bits)
//
// Bulk generation can produce many IDs within the same millisecond, where
// pure per-call randomness gives no ordering guarantee — RFC 9562's
// "Monotonic Random" method (§6.2, Method 3) is used instead: the 74
// combined rand_a+rand_b bits are treated as a counter that's incremented
// (by 1 plus a small random amount, to avoid a trivially guessable
// sequence) whenever the clock hasn't advanced since the last call, so a
// batch generated back-to-back sorts in generation order. ULID (a separate
// spec, not part of RFC 9562) uses the same technique over its own 80-bit
// randomness field.

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function randomBits(bits: number): bigint {
  const byteLen = Math.ceil(bits / 8)
  const buf = new Uint8Array(byteLen)
  crypto.getRandomValues(buf)
  let val = 0n
  for (const b of buf) val = (val << 8n) | BigInt(b)
  const mask = (1n << BigInt(bits)) - 1n
  return val & mask
}

function bytesToHexUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

function encodeBase32(value: bigint, bits: number): string {
  const chars = Math.ceil(bits / 5)
  let out = ''
  for (let i = chars - 1; i >= 0; i--) {
    const idx = Number((value >> BigInt(i * 5)) & 0x1fn)
    out += CROCKFORD[idx]
  }
  return out
}

function decodeBase32(str: string): bigint {
  let val = 0n
  for (const ch of str) {
    const idx = CROCKFORD.indexOf(ch.toUpperCase())
    if (idx === -1) throw new Error(`Invalid Crockford base32 character: ${ch}`)
    val = (val << 5n) | BigInt(idx)
  }
  return val
}

// --- UUIDv7 -----------------------------------------------------------

const RAND74_MAX = (1n << 74n) - 1n
let _v7LastMs = -1n
let _v7LastRand = 0n

export function generateUuidV7(): string {
  let ms = BigInt(Date.now())
  let rand: bigint

  if (ms > _v7LastMs) {
    _v7LastMs = ms
    rand = randomBits(74)
  } else {
    ms = _v7LastMs
    const increment = 1n + randomBits(16)
    rand = _v7LastRand + increment
    if (rand > RAND74_MAX) {
      _v7LastMs += 1n
      ms = _v7LastMs
      rand = randomBits(74)
    }
  }
  _v7LastRand = rand

  const randA = (rand >> 62n) & 0xfffn
  const randB = rand & 0x3fffffffffffffn

  const bytes = new Uint8Array(16)
  for (let i = 0; i < 6; i++) bytes[i] = Number((ms >> BigInt(40 - i * 8)) & 0xffn)
  bytes[6] = 0x70 | Number((randA >> 8n) & 0x0fn)
  bytes[7] = Number(randA & 0xffn)
  bytes[8] = 0x80 | Number((randB >> 56n) & 0x3fn)
  for (let i = 0; i < 7; i++) bytes[9 + i] = Number((randB >> BigInt(48 - i * 8)) & 0xffn)

  return bytesToHexUuid(bytes)
}

/** Decodes the 48-bit millisecond timestamp back out of a UUIDv7 string. Test/debug helper. */
export function decodeUuidV7Timestamp(uuid: string): number {
  const hex = uuid.replace(/-/g, '').slice(0, 12)
  return Number(BigInt(`0x${hex}`))
}

// --- ULID ---------------------------------------------------------------
// Not part of RFC 9562 — see https://github.com/ulid/spec. 48-bit ms
// timestamp (10 base32 chars) followed by 80 bits of randomness (16 base32
// chars), 26 chars total, no separators, Crockford's base32 (excludes
// I/L/O/U to avoid visual ambiguity).

const RAND80_MAX = (1n << 80n) - 1n
let _ulidLastMs = -1n
let _ulidLastRand = 0n

export function generateUlid(): string {
  let ms = BigInt(Date.now())
  let rand: bigint

  if (ms > _ulidLastMs) {
    _ulidLastMs = ms
    rand = randomBits(80)
  } else {
    ms = _ulidLastMs
    const increment = 1n + randomBits(16)
    rand = _ulidLastRand + increment
    if (rand > RAND80_MAX) {
      _ulidLastMs += 1n
      ms = _ulidLastMs
      rand = randomBits(80)
    }
  }
  _ulidLastRand = rand

  return encodeBase32(ms, 48) + encodeBase32(rand, 80)
}

/** Decodes the 48-bit millisecond timestamp back out of a ULID string. Test/debug helper. */
export function decodeUlidTimestamp(ulid: string): number {
  return Number(decodeBase32(ulid.slice(0, 10)))
}

// --- batch generation -----------------------------------------------------

export type UuidVersion = 'v4' | 'v7' | 'ulid'

export function generateBatch(version: UuidVersion, count: number): string[] {
  if (version === 'v4') return Array.from({ length: count }, () => crypto.randomUUID())
  if (version === 'v7') return Array.from({ length: count }, () => generateUuidV7())
  return Array.from({ length: count }, () => generateUlid())
}
