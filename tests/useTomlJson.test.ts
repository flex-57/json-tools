import { describe, it, expect } from 'vitest'
import { tomlToJson, jsonToToml } from '../app/composables/useTomlJson'

describe('tomlToJson', () => {
  it('converts simple TOML to JSON', () => {
    const r = tomlToJson('name = "Alice"\nage = 30')
    expect(r.error).toBeNull()
    const data = JSON.parse(r.output)
    expect(data.name).toBe('Alice')
    expect(data.age).toBe(30)
  })

  it('handles arrays', () => {
    const r = tomlToJson('tags = ["api", "auth"]')
    expect(r.error).toBeNull()
    expect(JSON.parse(r.output).tags).toEqual(['api', 'auth'])
  })

  it('handles nested tables', () => {
    const r = tomlToJson('[person]\nname = "Bob"\nage = 25')
    expect(r.error).toBeNull()
    expect(JSON.parse(r.output).person.name).toBe('Bob')
  })

  it('handles arrays of tables', () => {
    const r = tomlToJson('[[items]]\nx = 1\n\n[[items]]\nx = 2')
    expect(r.error).toBeNull()
    expect(JSON.parse(r.output).items).toEqual([{ x: 1 }, { x: 2 }])
  })

  it('converts TOML dates to ISO strings', () => {
    const r = tomlToJson('created_at = 2024-01-15T09:00:00Z')
    expect(r.error).toBeNull()
    expect(JSON.parse(r.output).created_at).toBe('2024-01-15T09:00:00.000Z')
  })

  it('returns empty error on empty input', () => {
    expect(tomlToJson('').error).toBe('empty')
  })

  it('returns a 1-indexed line/column on invalid TOML', () => {
    const r = tomlToJson('a = [1, 2\nb = 3')
    expect(r.error).not.toBeNull()
    expect(r.error).not.toContain('\n')
    expect(r.line).toBe(1)
    expect(r.column).toBe(9)
  })
})

describe('jsonToToml', () => {
  it('converts JSON to TOML', () => {
    const r = jsonToToml('{"name":"Alice","age":30}')
    expect(r.error).toBeNull()
    expect(r.output).toContain('name = "Alice"')
    expect(r.output).toContain('age = 30')
  })

  it('handles nested objects as tables', () => {
    const r = jsonToToml('{"person":{"name":"Bob"}}')
    expect(r.error).toBeNull()
    expect(r.output).toContain('[person]')
    expect(r.output).toContain('name = "Bob"')
  })

  it('handles arrays of objects as array-of-tables', () => {
    const r = jsonToToml('{"items":[{"x":1},{"x":2}]}')
    expect(r.error).toBeNull()
    expect(r.output).toContain('[[items]]')
  })

  it('returns error on invalid JSON', () => {
    expect(jsonToToml('{invalid}').error).not.toBeNull()
  })

  it('returns empty error on empty input', () => {
    expect(jsonToToml('').error).toBe('empty')
  })

  it('rejects a top-level array with a clear message', () => {
    const r = jsonToToml('[1,2,3]')
    expect(r.error).toContain('top-level array')
  })

  it('rejects a top-level primitive', () => {
    const r = jsonToToml('42')
    expect(r.error).toContain('top level')
  })

  it('rejects a null value with the offending path', () => {
    const r = jsonToToml('{"user":{"age":null}}')
    expect(r.error).toContain('user.age')
  })

  it('rejects a null value inside an array with the offending path', () => {
    const r = jsonToToml('{"tags":["a",null]}')
    expect(r.error).toContain('tags[1]')
  })

  it('rejects a root-level null', () => {
    const r = jsonToToml('null')
    expect(r.error).not.toBeNull()
  })
})
