import { describe, it, expect } from 'vitest'
import { formatJson, minifyJson, validateJson, diffJson } from '../app/composables/useJsonFormatter'

const VALID_JSON = '{"name":"John","age":30,"active":true}'
const PRETTY_JSON = `{
  "name": "John",
  "age": 30,
  "active": true
}`
const INVALID_JSON = '{name: "John"}'

describe('formatJson', () => {
  it('formats valid JSON with 2-space indent', () => {
    const result = formatJson(VALID_JSON)
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
    expect(result.output).toBe(PRETTY_JSON)
  })

  it('formats with 4-space indent', () => {
    const result = formatJson(VALID_JSON, 4)
    expect(result.output).toContain('    "name"')
  })

  it('formats with tab indent', () => {
    const result = formatJson(VALID_JSON, '\t')
    expect(result.output).toContain('\t"name"')
  })

  it('returns error on invalid JSON', () => {
    const result = formatJson(INVALID_JSON)
    expect(result.valid).toBe(false)
    expect(result.error).not.toBeNull()
  })

  it('returns empty error on empty input', () => {
    const result = formatJson('')
    expect(result.error).toBe('empty')
    expect(result.valid).toBe(false)
  })

  it('handles whitespace-only input', () => {
    const result = formatJson('   ')
    expect(result.error).toBe('empty')
  })

  it('handles arrays', () => {
    const result = formatJson('[1,2,3]')
    expect(result.valid).toBe(true)
    expect(result.output).toBe('[\n  1,\n  2,\n  3\n]')
  })

  it('handles nested objects', () => {
    const result = formatJson('{"a":{"b":1}}')
    expect(result.valid).toBe(true)
    expect(result.output).toContain('"b": 1')
  })
})

describe('minifyJson', () => {
  it('minifies pretty JSON', () => {
    const result = minifyJson(PRETTY_JSON)
    expect(result.valid).toBe(true)
    expect(result.output).toBe(VALID_JSON)
  })

  it('returns error on invalid JSON', () => {
    const result = minifyJson(INVALID_JSON)
    expect(result.valid).toBe(false)
  })

  it('handles empty input', () => {
    const result = minifyJson('')
    expect(result.error).toBe('empty')
  })
})

describe('validateJson', () => {
  it('validates valid JSON', () => {
    expect(validateJson(VALID_JSON).valid).toBe(true)
  })

  it('rejects invalid JSON', () => {
    expect(validateJson(INVALID_JSON).valid).toBe(false)
  })

  it('validates null', () => {
    expect(validateJson('null').valid).toBe(true)
  })

  it('validates boolean', () => {
    expect(validateJson('true').valid).toBe(true)
  })

  it('validates number', () => {
    expect(validateJson('42').valid).toBe(true)
  })

  it('returns empty error on empty input', () => {
    expect(validateJson('').error).toBe('empty')
  })
})

describe('diffJson', () => {
  it('detects identical JSON', () => {
    const result = diffJson(VALID_JSON, VALID_JSON)
    expect(result.same).toBe(true)
    expect(result.added).toHaveLength(0)
    expect(result.removed).toHaveLength(0)
  })

  it('detects added keys', () => {
    const left = '{"a":1}'
    const right = '{"a":1,"b":2}'
    const result = diffJson(left, right)
    expect(result.same).toBe(false)
    expect(result.added.length).toBeGreaterThan(0)
  })

  it('detects removed keys', () => {
    const left = '{"a":1,"b":2}'
    const right = '{"a":1}'
    const result = diffJson(left, right)
    expect(result.same).toBe(false)
    expect(result.removed.length).toBeGreaterThan(0)
  })

  it('ignores formatting differences', () => {
    const result = diffJson(VALID_JSON, PRETTY_JSON)
    expect(result.same).toBe(true)
  })

  it('handles invalid JSON gracefully', () => {
    const result = diffJson(INVALID_JSON, VALID_JSON)
    expect(result.same).toBe(false)
  })
})
