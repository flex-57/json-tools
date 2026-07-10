import { describe, it, expect } from 'vitest'
import { safeJsonParse } from '../app/utils/json'

describe('safeJsonParse', () => {
  it('parses valid JSON', () => {
    const result = safeJsonParse('{"a":1}')
    expect(result.error).toBeNull()
    expect(result.data).toEqual({ a: 1 })
  })

  it('passes through V8 messages that already include line/column', () => {
    const result = safeJsonParse('{"a":1,}')
    expect(result.data).toBeNull()
    expect(result.error).toMatch(/\(line \d+ column \d+\)/i)
    // our own appended format should not be duplicated on top of V8's
    expect(result.error).not.toMatch(/\(Line \d+, Column \d+\).*\(Line \d+, Column \d+\)/)
  })

  it('adds line/column for truncated JSON ("unexpected end of input")', () => {
    const result = safeJsonParse('{"a":')
    expect(result.data).toBeNull()
    expect(result.error).toMatch(/unexpected end of json input/i)
    expect(result.error).toMatch(/\(Line 1, Column 6\)/)
  })

  it('computes the correct line for a multi-line truncated input', () => {
    const input = '{\n  "a": 1,\n  "b":'
    const result = safeJsonParse(input)
    expect(result.error).toMatch(/\(Line 3, Column 7\)/)
  })

  it('returns empty-input error unchanged', () => {
    const result = safeJsonParse('')
    expect(result.data).toBeNull()
    expect(result.error).toMatch(/unexpected end of json input/i)
  })
})
