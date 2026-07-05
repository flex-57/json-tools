import { describe, it, expect } from 'vitest'
import { buildSchema } from '../app/composables/useJsonSchema'

const OPTS_D7  = { required: true,  draft: 'draft-07'  as const }
const OPTS_REQ = { required: false, draft: 'draft-07'  as const }
const OPTS_20  = { required: true,  draft: '2020-12'   as const }

describe('buildSchema — $schema', () => {
  it('sets Draft-07 URI', () => {
    const s = buildSchema({}, OPTS_D7)
    expect(s['$schema']).toBe('http://json-schema.org/draft-07/schema#')
  })

  it('sets 2020-12 URI', () => {
    const s = buildSchema({}, OPTS_20)
    expect(s['$schema']).toBe('https://json-schema.org/draft/2020-12/schema')
  })
})

describe('buildSchema — primitives', () => {
  it('null → type null', () => {
    expect(buildSchema(null, OPTS_D7)['type']).toBe('null')
  })

  it('boolean → type boolean', () => {
    expect(buildSchema(true, OPTS_D7)['type']).toBe('boolean')
  })

  it('integer → type integer', () => {
    expect(buildSchema(42, OPTS_D7)['type']).toBe('integer')
  })

  it('float → type number', () => {
    expect(buildSchema(3.14, OPTS_D7)['type']).toBe('number')
  })

  it('string → type string', () => {
    expect(buildSchema('hello', OPTS_D7)['type']).toBe('string')
  })
})

describe('buildSchema — objects', () => {
  it('flat object has type object', () => {
    const s = buildSchema({ name: 'John', age: 30 }, OPTS_D7)
    expect(s['type']).toBe('object')
  })

  it('flat object has correct properties', () => {
    const s = buildSchema({ name: 'John', age: 30 }, OPTS_D7)
    const props = s['properties'] as Record<string, Record<string, unknown>>
    expect(props['name']!['type']).toBe('string')
    expect(props['age']!['type']).toBe('integer')
  })

  it('includes required array when option is true', () => {
    const s = buildSchema({ a: 1, b: 2 }, OPTS_D7)
    expect(s['required']).toEqual(['a', 'b'])
  })

  it('omits required array when option is false', () => {
    const s = buildSchema({ a: 1 }, OPTS_REQ)
    expect(s['required']).toBeUndefined()
  })

  it('nested object is recursively typed', () => {
    const s = buildSchema({ user: { name: 'Alice', age: 25 } }, OPTS_D7)
    const userSchema = (s['properties'] as any)['user']
    expect(userSchema['type']).toBe('object')
    expect((userSchema['properties'] as any)['name']['type']).toBe('string')
  })

  it('boolean property typed correctly', () => {
    const s = buildSchema({ active: true }, OPTS_D7)
    expect((s['properties'] as any)['active']['type']).toBe('boolean')
  })

  it('null property typed correctly', () => {
    const s = buildSchema({ val: null }, OPTS_D7)
    expect((s['properties'] as any)['val']['type']).toBe('null')
  })

  it('empty object has empty properties', () => {
    const s = buildSchema({}, OPTS_D7)
    expect(s['type']).toBe('object')
    expect(s['properties']).toEqual({})
    expect(s['required']).toBeUndefined()
  })
})

describe('buildSchema — arrays', () => {
  it('empty array → type array with empty items', () => {
    const s = buildSchema([], OPTS_D7)
    expect(s['type']).toBe('array')
    expect(s['items']).toEqual({})
  })

  it('uniform integer array', () => {
    const s = buildSchema([1, 2, 3], OPTS_D7)
    expect(s['type']).toBe('array')
    expect((s['items'] as any)['type']).toBe('integer')
  })

  it('deduplicates identical item types', () => {
    const s = buildSchema(['a', 'b', 'c'], OPTS_D7)
    expect((s['items'] as any)['type']).toBe('string')
    expect((s['items'] as any)['oneOf']).toBeUndefined()
  })

  it('mixed-type array uses oneOf', () => {
    const s = buildSchema([1, 'hello', true], OPTS_D7)
    const items = s['items'] as any
    expect(items['oneOf']).toBeDefined()
    expect(items['oneOf']).toHaveLength(3)
  })

  it('array with null uses oneOf', () => {
    const s = buildSchema(['a', null], OPTS_D7)
    const items = s['items'] as any
    expect(items['oneOf']).toBeDefined()
    const types = items['oneOf'].map((o: any) => o['type'])
    expect(types).toContain('string')
    expect(types).toContain('null')
  })
})

describe('buildSchema — array of objects', () => {
  it('uniform object array merges into single schema', () => {
    const s = buildSchema([{ id: 1, name: 'a' }, { id: 2, name: 'b' }], OPTS_D7)
    const items = s['items'] as any
    expect(items['type']).toBe('object')
    expect(items['oneOf']).toBeUndefined()
  })

  it('merged schema has all present keys in properties', () => {
    const s = buildSchema([{ id: 1 }, { id: 2, extra: true }], OPTS_D7)
    const items = s['items'] as any
    expect(Object.keys(items['properties'])).toContain('id')
    expect(Object.keys(items['properties'])).toContain('extra')
  })

  it('required contains only keys present in all items', () => {
    const s = buildSchema([{ id: 1 }, { id: 2, extra: true }], OPTS_D7)
    const items = s['items'] as any
    expect(items['required']).toEqual(['id'])
    expect(items['required']).not.toContain('extra')
  })

  it('all keys required when they appear in every item', () => {
    const s = buildSchema([{ a: 1, b: 2 }, { a: 3, b: 4 }], OPTS_D7)
    const items = s['items'] as any
    expect(items['required']).toEqual(expect.arrayContaining(['a', 'b']))
  })
})
