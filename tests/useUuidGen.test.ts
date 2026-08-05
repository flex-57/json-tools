import { describe, it, expect } from 'vitest'
import { generateUuidV7, generateUlid, generateBatch, decodeUuidV7Timestamp, decodeUlidTimestamp } from '../app/composables/useUuidGen'

describe('generateUuidV7 — structure', () => {
  it('has the RFC 9562 version nibble (7) and variant nibble (8-b)', () => {
    for (let i = 0; i < 50; i++) {
      const id = generateUuidV7()
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    }
  })

  it('encodes a timestamp close to Date.now()', () => {
    const before = Date.now()
    const id = generateUuidV7()
    const after = Date.now()
    const ts = decodeUuidV7Timestamp(id)
    expect(ts).toBeGreaterThanOrEqual(before)
    expect(ts).toBeLessThanOrEqual(after)
  })

  it('produces different values on successive calls', () => {
    const a = generateUuidV7()
    const b = generateUuidV7()
    expect(a).not.toBe(b)
  })
})

describe('generateUuidV7 — monotonicity within the same millisecond', () => {
  it('a batch of 100 generated back-to-back sorts identically as strings and by index', () => {
    const batch = Array.from({ length: 100 }, () => generateUuidV7())
    const sorted = [...batch].sort()
    expect(batch).toEqual(sorted)
  })

  it('every id in a batch is strictly greater than the previous one', () => {
    const batch = Array.from({ length: 100 }, () => generateUuidV7())
    for (let i = 1; i < batch.length; i++) {
      expect(batch[i]! > batch[i - 1]!).toBe(true)
    }
  })
})

describe('generateUlid — structure', () => {
  it('is 26 Crockford-base32 characters', () => {
    for (let i = 0; i < 50; i++) {
      const id = generateUlid()
      expect(id).toHaveLength(26)
      expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/)
    }
  })

  it('encodes a timestamp close to Date.now()', () => {
    const before = Date.now()
    const id = generateUlid()
    const after = Date.now()
    const ts = decodeUlidTimestamp(id)
    expect(ts).toBeGreaterThanOrEqual(before)
    expect(ts).toBeLessThanOrEqual(after)
  })
})

describe('generateUlid — monotonicity within the same millisecond', () => {
  it('a batch of 100 generated back-to-back sorts identically as strings', () => {
    const batch = Array.from({ length: 100 }, () => generateUlid())
    const sorted = [...batch].sort()
    expect(batch).toEqual(sorted)
  })
})

describe('generateBatch', () => {
  it('generates the requested count for each version', () => {
    expect(generateBatch('v4', 5)).toHaveLength(5)
    expect(generateBatch('v7', 5)).toHaveLength(5)
    expect(generateBatch('ulid', 5)).toHaveLength(5)
  })

  it('v4 batch entries are valid RFC 4122 v4 UUIDs', () => {
    const batch = generateBatch('v4', 10)
    for (const id of batch) {
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    }
  })

  it('a 100-entry v7 batch is sorted', () => {
    const batch = generateBatch('v7', 100)
    expect(batch).toEqual([...batch].sort())
  })

  it('a 100-entry ulid batch is sorted', () => {
    const batch = generateBatch('ulid', 100)
    expect(batch).toEqual([...batch].sort())
  })
})
