import { describe, it, expect } from 'vitest'
import { yamlToJson, jsonToYaml } from '../app/composables/useYamlJson'

const VALID_YAML = `name: Alice\nage: 30\ncity: Paris`

describe('yamlToJson', () => {
  it('converts simple YAML to JSON', () => {
    const r = yamlToJson(VALID_YAML)
    expect(r.error).toBeNull()
    const data = JSON.parse(r.output)
    expect(data.name).toBe('Alice')
    expect(data.age).toBe(30)
  })

  it('handles arrays', () => {
    const yaml = `items:\n  - a\n  - b`
    const r = yamlToJson(yaml)
    expect(r.error).toBeNull()
    const data = JSON.parse(r.output)
    expect(data.items).toEqual(['a', 'b'])
  })

  it('handles nested objects', () => {
    const yaml = `person:\n  name: Bob\n  age: 25`
    const r = yamlToJson(yaml)
    expect(r.error).toBeNull()
    const data = JSON.parse(r.output)
    expect(data.person.name).toBe('Bob')
  })

  it('returns empty error on empty input', () => {
    expect(yamlToJson('').error).toBe('empty')
  })
})

describe('jsonToYaml', () => {
  it('converts JSON to YAML', () => {
    const r = jsonToYaml('{"name":"Alice","age":30}')
    expect(r.error).toBeNull()
    expect(r.output).toContain('name: Alice')
    expect(r.output).toContain('age: 30')
  })

  it('respects indent option', () => {
    const r = jsonToYaml('{"a":{"b":1}}', 4)
    expect(r.error).toBeNull()
    expect(r.output).toContain('    b: 1')
  })

  it('handles arrays', () => {
    const r = jsonToYaml('[1,2,3]')
    expect(r.error).toBeNull()
    expect(r.output).toContain('- 1')
  })

  it('returns error on invalid JSON', () => {
    expect(jsonToYaml('{invalid}').error).not.toBeNull()
  })

  it('returns empty error on empty input', () => {
    expect(jsonToYaml('').error).toBe('empty')
  })
})
