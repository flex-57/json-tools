import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { encodeBase64, decodeBase64, useBase64 } from '../app/composables/useBase64'

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

describe('useBase64 — mode switch keeps the sample valid', () => {
  it('swaps the untouched sample to its encoded form when switching to decode, without error', async () => {
    const { input, output, mode, error } = useBase64()
    const plainSample = input.value
    mode.value = 'decode'
    await nextTick()
    expect(input.value).not.toBe(plainSample)
    expect(error.value).toBeNull()
    expect(output.value).toBe(plainSample)
  })

  it('swaps back to the plain sample when returning to encode', async () => {
    const { input, mode } = useBase64()
    const plainSample = input.value
    mode.value = 'decode'
    await nextTick()
    mode.value = 'encode'
    await nextTick()
    expect(input.value).toBe(plainSample)
  })

  it('does not touch input the user has typed themselves', async () => {
    const { input, mode } = useBase64()
    input.value = 'my own text, not the sample'
    mode.value = 'decode'
    await nextTick()
    expect(input.value).toBe('my own text, not the sample')
  })
})
