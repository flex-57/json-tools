import { describe, it, expect } from 'vitest'
import { computeHmacs, HMAC_ALGORITHMS } from '../app/composables/useHmac'

describe('HMAC_ALGORITHMS', () => {
  it('includes the four SHA algorithms (no MD5 — Web Crypto does not implement HMAC-MD5)', () => {
    expect([...HMAC_ALGORITHMS]).toEqual(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'])
  })
})

describe('computeHmacs — hex output, RFC test vectors', () => {
  // RFC 2202 / RFC 4231 Test Case 1: key = 20 bytes of 0x0b, data = "Hi There"
  const key = '\x0b'.repeat(20)
  const data = 'Hi There'

  it('matches the RFC 2202 / RFC 4231 vectors for all four algorithms', async () => {
    const result = await computeHmacs(data, key, 'hex')
    expect(result['SHA-1']).toBe('b617318655057264e28bc0b6fb378c8ef146be00')
    expect(result['SHA-256']).toBe('b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7')
    expect(result['SHA-384']).toBe('afd03944d84895626b0825f4ab46907f15f9dadbe4101ec682aa034c7cebc59cfaea9ea9076ede7f4af152e8b2fa9cb6')
    expect(result['SHA-512']).toBe('87aa7cdea5ef619d4ff0b4241a1d6cb02379f4e2ce4ec2787ad0b30545e17cdedaa833b7d6b8a702038b274eaea3f4e4be9d914eeb61f1702e696c203a126854')
  })
})

describe('computeHmacs — general behavior', () => {
  it('returns empty strings for all algorithms when message is empty', async () => {
    const result = await computeHmacs('', 'key', 'hex')
    expect(Object.values(result).every(v => v === '')).toBe(true)
  })

  it('returns empty strings for all algorithms when secret is empty', async () => {
    const result = await computeHmacs('message', '', 'hex')
    expect(Object.values(result).every(v => v === '')).toBe(true)
  })

  it('returns all algorithm keys', async () => {
    const result = await computeHmacs('message', 'key', 'hex')
    expect(Object.keys(result)).toEqual(expect.arrayContaining([...HMAC_ALGORITHMS]))
  })

  it('different secrets produce different digests for the same message', async () => {
    const a = await computeHmacs('message', 'key1', 'hex')
    const b = await computeHmacs('message', 'key2', 'hex')
    expect(a['SHA-256']).not.toBe(b['SHA-256'])
  })

  it('different messages produce different digests for the same secret', async () => {
    const a = await computeHmacs('message1', 'key', 'hex')
    const b = await computeHmacs('message2', 'key', 'hex')
    expect(a['SHA-256']).not.toBe(b['SHA-256'])
  })

  it('is deterministic for the same inputs', async () => {
    const a = await computeHmacs('message', 'key', 'hex')
    const b = await computeHmacs('message', 'key', 'hex')
    expect(a).toEqual(b)
  })

  it('SHA-1 hex output is 40 hex chars, SHA-512 is 128', async () => {
    const result = await computeHmacs('message', 'key', 'hex')
    expect(result['SHA-1']).toHaveLength(40)
    expect(result['SHA-1']).toMatch(/^[0-9a-f]+$/)
    expect(result['SHA-512']).toHaveLength(128)
  })
})

describe('computeHmacs — base64 output', () => {
  it('base64 output decodes to the same bytes as the hex output', async () => {
    const hex = await computeHmacs('message', 'key', 'hex')
    const b64 = await computeHmacs('message', 'key', 'base64')
    expect(Buffer.from(b64['SHA-256'], 'base64').toString('hex')).toBe(hex['SHA-256'])
  })
})
