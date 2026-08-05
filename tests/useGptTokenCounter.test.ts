import { describe, it, expect } from 'vitest'
import { countGptTokens } from '../app/composables/useGptTokenCounter'

describe('countGptTokens', () => {
  it('returns 0 for empty input', async () => {
    expect(await countGptTokens('')).toBe(0)
  })

  it('returns a positive count for non-empty input', async () => {
    const count = await countGptTokens('Hello, world!')
    expect(count).toBeGreaterThan(0)
  })

  it('is consistent with encode().length from the same encoding', async () => {
    const { encode } = await import('gpt-tokenizer/encoding/o200k_base')
    const text = 'The quick brown fox jumps over the lazy dog, 1234567890 times.'
    const count = await countGptTokens(text)
    expect(count).toBe(encode(text).length)
  })

  it('longer text produces more tokens than shorter text', async () => {
    const short = await countGptTokens('Hello')
    const long = await countGptTokens('Hello, this is a much longer sentence with many more words in it.')
    expect(long).toBeGreaterThan(short)
  })

  it('repeated identical text scales roughly linearly in token count', async () => {
    const one = await countGptTokens('the quick brown fox '.repeat(1))
    const ten = await countGptTokens('the quick brown fox '.repeat(10))
    // Not exactly 10x due to BPE merges at the seams, but should be in the right order of magnitude.
    expect(ten).toBeGreaterThan(one * 5)
    expect(ten).toBeLessThan(one * 15)
  })

  it('is deterministic', async () => {
    const text = 'Deterministic tokenization check.'
    const a = await countGptTokens(text)
    const b = await countGptTokens(text)
    expect(a).toBe(b)
  })
})
