import { describe, it, expect } from 'vitest'
import { useJsonToTs } from '../app/composables/useJsonToTs'

describe('useJsonToTs — TypeScript mode', () => {
  it('generates interface for flat object', () => {
    const { input, output } = useJsonToTs()
    input.value = '{"name":"John","age":30}'
    expect(output.value).toContain('interface Root')
    expect(output.value).toContain('name: string')
    expect(output.value).toContain('age: number')
  })

  it('generates boolean type', () => {
    const { input, output } = useJsonToTs()
    input.value = '{"active":true}'
    expect(output.value).toContain('active: boolean')
  })

  it('generates null type', () => {
    const { input, output } = useJsonToTs()
    input.value = '{"val":null}'
    expect(output.value).toContain('null')
  })

  it('generates type alias for array of primitives', () => {
    const { input, output } = useJsonToTs()
    input.value = '[1,2,3]'
    expect(output.value).toContain('type Root')
    expect(output.value).toContain('number')
  })

  it('generates array type for array of objects', () => {
    const { input, output } = useJsonToTs()
    input.value = '[{"id":1,"name":"a"},{"id":2,"name":"b"}]'
    expect(output.value).toContain('id: number')
    expect(output.value).toContain('name: string')
    expect(output.value).toContain('[]')
  })

  it('handles nested objects', () => {
    const { input, output } = useJsonToTs()
    input.value = '{"user":{"name":"John","age":30}}'
    expect(output.value).toContain('user:')
    expect(output.value).toContain('name: string')
    expect(output.value).toContain('age: number')
  })

  it('uses custom root name', () => {
    const { input, output, rootName } = useJsonToTs()
    rootName.value = 'User'
    input.value = '{"name":"John"}'
    expect(output.value).toContain('interface User')
    expect(output.value).not.toContain('interface Root')
  })

  it('falls back to Root when rootName is empty', () => {
    const { input, output, rootName } = useJsonToTs()
    rootName.value = '   '
    input.value = '{"x":1}'
    expect(output.value).toContain('interface Root')
  })

  it('generates union type for mixed-type array', () => {
    const { input, output } = useJsonToTs()
    input.value = '[1,"two",true]'
    expect(output.value).toContain('|')
  })

  it('generates unknown[] for empty array', () => {
    const { input, output } = useJsonToTs()
    input.value = '[]'
    expect(output.value).toContain('unknown[]')
  })

  it('generates optional fields for objects with differing keys in array', () => {
    const { input, output } = useJsonToTs()
    input.value = '[{"a":1},{"a":1,"b":2}]'
    expect(output.value).toContain('b?:')
  })
})

describe('useJsonToTs — Zod mode', () => {
  it('generates Zod schema for object', () => {
    const { input, output, mode } = useJsonToTs()
    mode.value = 'zod'
    input.value = '{"name":"John","age":30}'
    expect(output.value).toContain("import { z } from 'zod'")
    expect(output.value).toContain('z.object(')
    expect(output.value).toContain('z.string()')
    expect(output.value).toContain('z.number()')
  })

  it('generates Zod array schema', () => {
    const { input, output, mode } = useJsonToTs()
    mode.value = 'zod'
    input.value = '[1,2,3]'
    expect(output.value).toContain('z.array(')
    expect(output.value).toContain('z.number()')
  })

  it('generates z.null() for null values', () => {
    const { input, output, mode } = useJsonToTs()
    mode.value = 'zod'
    input.value = '{"val":null}'
    expect(output.value).toContain('z.null()')
  })

  it('generates z.boolean()', () => {
    const { input, output, mode } = useJsonToTs()
    mode.value = 'zod'
    input.value = '{"flag":true}'
    expect(output.value).toContain('z.boolean()')
  })

  it('uses custom name in Zod const and type', () => {
    const { input, output, mode, rootName } = useJsonToTs()
    mode.value = 'zod'
    rootName.value = 'MySchema'
    input.value = '{"x":1}'
    expect(output.value).toContain('const MySchema =')
    expect(output.value).toContain('type MySchema =')
  })

  it('generates z.infer type alias', () => {
    const { input, output, mode } = useJsonToTs()
    mode.value = 'zod'
    input.value = '{}'
    expect(output.value).toContain('z.infer<typeof')
  })
})

describe('useJsonToTs — error handling', () => {
  it('returns empty output for empty input', () => {
    const { output } = useJsonToTs()
    expect(output.value).toBe('')
  })

  it('returns null error for empty input', () => {
    const { error } = useJsonToTs()
    expect(error.value).toBeNull()
  })

  it('returns error for invalid JSON', () => {
    const { input, error } = useJsonToTs()
    input.value = '{bad}'
    expect(error.value).toBe('Invalid JSON')
  })

  it('returns empty output on invalid JSON', () => {
    const { input, output } = useJsonToTs()
    input.value = '{bad}'
    expect(output.value).toBe('')
  })
})
