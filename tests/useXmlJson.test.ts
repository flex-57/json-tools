import { describe, it, expect } from 'vitest'
import { xmlToJson, jsonToXml } from '../app/composables/useXmlJson'

const VALID_XML = `<person><name>Alice</name><age>30</age></person>`

describe('xmlToJson', () => {
  it('converts simple XML to JSON', () => {
    const r = xmlToJson(VALID_XML)
    expect(r.error).toBeNull()
    const data = JSON.parse(r.output)
    expect(data.person.name).toBe('Alice')
    expect(data.person.age).toBe(30)
  })

  it('handles attributes', () => {
    const xml = `<person id="1"><name>Alice</name></person>`
    const r = xmlToJson(xml)
    expect(r.error).toBeNull()
    const data = JSON.parse(r.output)
    expect(data.person['@id']).toBe(1)
  })

  it('returns empty error on empty input', () => {
    expect(xmlToJson('').error).toBe('empty')
  })

  it('returns a structured line/column on invalid XML', () => {
    const bad = `<users><user id="1"><name>Alice</name></user><user id="2"><name>Bob</user></users>`
    const r = xmlToJson(bad)
    expect(r.error).not.toBeNull()
    expect(r.error).not.toContain('\n')
    expect(r.line).toBeGreaterThan(0)
    expect(r.column).toBeGreaterThan(0)
  })
})

describe('jsonToXml', () => {
  it('converts JSON to XML', () => {
    const json = '{"person":{"name":"Alice","age":30}}'
    const r = jsonToXml(json)
    expect(r.error).toBeNull()
    expect(r.output).toContain('<name>Alice</name>')
  })

  it('returns error on invalid JSON', () => {
    expect(jsonToXml('{invalid}').error).not.toBeNull()
  })

  it('returns empty error on empty input', () => {
    expect(jsonToXml('').error).toBe('empty')
  })

  it('does not wrap when a single key already gives one natural root', () => {
    const json = '{"person":{"name":"Alice","age":30}}'
    const r = jsonToXml(json)
    expect(r.error).toBeNull()
    expect(r.output.trim().startsWith('<person>')).toBe(true)
    expect(r.output).not.toContain('<root>')
  })

  it('wraps multiple top-level keys in a single root element', () => {
    const json = '{"a":1,"b":2}'
    const r = jsonToXml(json)
    expect(r.error).toBeNull()
    expect(r.output.trim().startsWith('<root>')).toBe(true)
    expect(r.output.trim().endsWith('</root>')).toBe(true)
    expect(r.output).toContain('<a>1</a>')
    expect(r.output).toContain('<b>2</b>')
  })

  it('wraps a top-level array under root/item instead of numeric tag names', () => {
    const json = '[1,2,3]'
    const r = jsonToXml(json)
    expect(r.error).toBeNull()
    expect(r.output).not.toMatch(/<\d/)
    expect(r.output.trim().startsWith('<root>')).toBe(true)
    expect(r.output).toContain('<item>1</item>')
    expect(r.output).toContain('<item>2</item>')
    expect(r.output).toContain('<item>3</item>')
  })

  it('wraps a single-key object whose value is directly an array', () => {
    const json = '{"tags":["a","b"]}'
    const r = jsonToXml(json)
    expect(r.error).toBeNull()
    expect(r.output.trim().startsWith('<root>')).toBe(true)
    expect(r.output.trim().endsWith('</root>')).toBe(true)
  })

  it('wraps a bare top-level primitive', () => {
    const r = jsonToXml('"hello"')
    expect(r.error).toBeNull()
    expect(r.output.trim()).toBe('<root>hello</root>')
  })
})
