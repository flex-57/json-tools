import { describe, it, expect } from 'vitest'
import { csvToJson, jsonToCsv } from '../app/composables/useCsvJson'

describe('csvToJson', () => {
  it('converts CSV with headers', () => {
    const csv = 'name,age,city\nAlice,30,Paris\nBob,25,Lyon'
    const result = csvToJson(csv)
    expect(result.error).toBeNull()
    expect(result.rowCount).toBe(2)
    const data = JSON.parse(result.output)
    expect(data[0]).toEqual({ name: 'Alice', age: 30, city: 'Paris' })
    expect(data[1]).toEqual({ name: 'Bob', age: 25, city: 'Lyon' })
  })

  it('converts CSV without headers', () => {
    const csv = 'Alice,30\nBob,25'
    const result = csvToJson(csv, 'auto', false)
    expect(result.error).toBeNull()
    expect(result.rowCount).toBe(2)
    const data = JSON.parse(result.output)
    expect(data[0]).toEqual(['Alice', 30])
  })

  it('handles semicolon delimiter', () => {
    const csv = 'name;age\nAlice;30'
    const result = csvToJson(csv, ';')
    expect(result.error).toBeNull()
    const data = JSON.parse(result.output)
    expect(data[0]).toEqual({ name: 'Alice', age: 30 })
  })

  it('handles tab delimiter', () => {
    const csv = 'name\tage\nAlice\t30'
    const result = csvToJson(csv, '\t')
    expect(result.error).toBeNull()
    const data = JSON.parse(result.output)
    expect(data[0]).toEqual({ name: 'Alice', age: 30 })
  })

  it('returns empty error on empty input', () => {
    expect(csvToJson('').error).toBe('empty')
  })

  it('auto-detects delimiter', () => {
    const csv = 'name,age\nAlice,30'
    const result = csvToJson(csv, 'auto')
    expect(result.error).toBeNull()
    expect(result.rowCount).toBe(1)
  })

  it('casts numbers correctly', () => {
    const csv = 'id,value\n1,3.14'
    const result = csvToJson(csv)
    const data = JSON.parse(result.output)
    expect(typeof data[0].id).toBe('number')
    expect(data[0].value).toBe(3.14)
  })
})

describe('jsonToCsv', () => {
  it('converts JSON array to CSV', () => {
    const json = '[{"name":"Alice","age":30},{"name":"Bob","age":25}]'
    const result = jsonToCsv(json)
    expect(result.error).toBeNull()
    expect(result.rowCount).toBe(2)
    expect(result.output).toContain('name,age')
    expect(result.output).toContain('Alice,30')
  })

  it('uses semicolon delimiter', () => {
    const json = '[{"name":"Alice","age":30}]'
    const result = jsonToCsv(json, ';')
    expect(result.output).toContain('name;age')
  })

  it('wraps single object in array', () => {
    const json = '{"name":"Alice","age":30}'
    const result = jsonToCsv(json)
    expect(result.error).toBeNull()
    expect(result.rowCount).toBe(1)
  })

  it('returns error on invalid JSON', () => {
    const result = jsonToCsv('{invalid}')
    expect(result.error).not.toBeNull()
  })

  it('returns empty error on empty input', () => {
    expect(jsonToCsv('').error).toBe('empty')
  })
})
