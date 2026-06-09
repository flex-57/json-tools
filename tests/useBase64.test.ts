import { describe, it, expect } from 'vitest'
import { encodeBase64, decodeBase64 } from '../app/composables/useBase64'

describe('encodeBase64', () => {
  it('encodes ASCII text', () => {
    expect(encodeBase64('Hello, World!')).toBe('SGVsbG8sIFdvcmxkIQ==')
  })

  it('encodes unicode text', () => {
    const encoded = encodeBase64('café')
    expect(encoded).toBeTruthy()
    expect(decodeBase64(encoded)).toBe('café')
  })

  it('produces urlsafe variant (no +/=)', () => {
    const encoded = encodeBase64('Hello, World!', 'urlsafe')
    expect(encoded).not.toContain('+')
    expect(encoded).not.toContain('/')
    expect(encoded).not.toContain('=')
  })

  it('standard and urlsafe round-trip are consistent', () => {
    const text = 'user:password123'
    expect(decodeBase64(encodeBase64(text, 'standard'), 'standard')).toBe(text)
    expect(decodeBase64(encodeBase64(text, 'urlsafe'), 'urlsafe')).toBe(text)
  })
})

describe('decodeBase64', () => {
  it('decodes standard base64', () => {
    expect(decodeBase64('SGVsbG8sIFdvcmxkIQ==')).toBe('Hello, World!')
  })

  it('decodes without padding', () => {
    expect(decodeBase64('SGVsbG8sIFdvcmxkIQ')).toBe('Hello, World!')
  })

  it('decodes urlsafe variant', () => {
    const encoded = encodeBase64('Hello, World!', 'urlsafe')
    expect(decodeBase64(encoded, 'urlsafe')).toBe('Hello, World!')
  })

  it('throws on invalid base64', () => {
    expect(() => decodeBase64('not!!valid@@base64')).toThrow()
  })

  it('round-trips emoji', () => {
    const text = 'Hello 🌍'
    expect(decodeBase64(encodeBase64(text))).toBe(text)
  })
})
