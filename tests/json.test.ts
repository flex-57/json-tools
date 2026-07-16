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

  it('exposes structured line/column alongside the message', () => {
    const result = safeJsonParse('{"a":')
    expect(result.line).toBe(1)
    expect(result.column).toBe(6)
  })

  it('tips a trailing comma before "}"', () => {
    const result = safeJsonParse('{"a":1,}')
    expect(result.tip).toMatch(/trailing comma/i)
    expect(result.tip).toContain('"}"')
    expect(result.line).toBe(1)
  })

  it('tips a trailing comma before "]" even when V8 gives no position', () => {
    const result = safeJsonParse('{"tags":["api","auth",]}')
    expect(result.tip).toMatch(/trailing comma|unexpected "\]"/i)
    // V8 doesn't expose a position for this shape — line/column honestly stay null
    // rather than guessing from the message's text snippet.
    expect(result.line).toBeNull()
  })

  it('tips a single-quoted key', () => {
    const result = safeJsonParse("{'a':1}")
    expect(result.tip).toMatch(/double quotes/i)
  })

  it('tips an unquoted key', () => {
    const result = safeJsonParse('{a:1}')
    expect(result.tip).toMatch(/must be quoted/i)
  })

  it('tips truncated JSON', () => {
    const result = safeJsonParse('{"a":')
    expect(result.tip).toMatch(/cut off/i)
  })

  it('tips trailing content after a valid value', () => {
    const result = safeJsonParse('{"a":1} extra')
    expect(result.tip).toMatch(/extra content/i)
    expect(result.line).toBe(1)
  })

  it('does not fabricate a tip for unrecognized error shapes', () => {
    const result = safeJsonParse('{"a":1')
    expect(result.tip).toBeNull()
    expect(result.error).toBeTruthy()
  })

  it('returns undefined line/column/tip on success', () => {
    const result = safeJsonParse('{"a":1}')
    expect(result.line).toBeUndefined()
    expect(result.column).toBeUndefined()
    expect(result.tip).toBeUndefined()
  })
})
