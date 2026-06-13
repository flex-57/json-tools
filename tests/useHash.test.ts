import { describe, it, expect } from 'vitest'
import { computeHashes, HASH_ALGORITHMS } from '../app/composables/useHash'

describe('HASH_ALGORITHMS', () => {
  it('includes all five algorithms', () => {
    const expected = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']
    expected.forEach(a => expect(HASH_ALGORITHMS).toContain(a))
  })
})

describe('computeHashes', () => {
  it('returns all algorithm keys', async () => {
    const result = await computeHashes('hello')
    expect(Object.keys(result)).toEqual(expect.arrayContaining([...HASH_ALGORITHMS]))
  })

  it('returns empty strings for empty input', async () => {
    const result = await computeHashes('')
    expect(Object.values(result).every(v => v === '')).toBe(true)
  })

  it('computes correct MD5 for known input', async () => {
    const result = await computeHashes('hello')
    expect(result['MD5']).toBe('5d41402abc4b2a76b9719d911017c592')
  })

  it('computes correct MD5 for longer input', async () => {
    const result = await computeHashes('The quick brown fox jumps over the lazy dog')
    expect(result['MD5']).toBe('9e107d9d372bb6826bd81d3542a419d6')
  })

  it('computes correct SHA-256 for known input', async () => {
    const result = await computeHashes('hello')
    expect(result['SHA-256']).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  })

  it('SHA-1 output is 40 hex chars', async () => {
    const result = await computeHashes('hello')
    expect(result['SHA-1']).toHaveLength(40)
    expect(result['SHA-1']).toMatch(/^[0-9a-f]+$/)
  })

  it('SHA-384 output is 96 hex chars', async () => {
    const result = await computeHashes('hello')
    expect(result['SHA-384']).toHaveLength(96)
    expect(result['SHA-384']).toMatch(/^[0-9a-f]+$/)
  })

  it('SHA-512 output is 128 hex chars', async () => {
    const result = await computeHashes('hello')
    expect(result['SHA-512']).toHaveLength(128)
    expect(result['SHA-512']).toMatch(/^[0-9a-f]+$/)
  })

  it('different inputs produce different hashes', async () => {
    const r1 = await computeHashes('hello')
    const r2 = await computeHashes('world')
    expect(r1['MD5']).not.toBe(r2['MD5'])
    expect(r1['SHA-256']).not.toBe(r2['SHA-256'])
  })

  it('is case-sensitive', async () => {
    const r1 = await computeHashes('hello')
    const r2 = await computeHashes('Hello')
    expect(r1['MD5']).not.toBe(r2['MD5'])
  })
})
