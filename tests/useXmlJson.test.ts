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
})
