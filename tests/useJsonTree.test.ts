import { describe, it, expect } from 'vitest'
import {
  parseJsonTree,
  nodeHasMatch,
  collectDeepIds,
  collectAllExpandableIds,
} from '../app/composables/useJsonTree'

describe('parseJsonTree', () => {
  it('parses a flat object', () => {
    const { root, error } = parseJsonTree('{"a":1,"b":"two","c":true}')
    expect(error).toBe('')
    expect(root).not.toBeNull()
    expect(root!.type).toBe('object')
    expect(root!.size).toBe(3)
    expect(root!.children).toHaveLength(3)
  })

  it('parses nested objects', () => {
    const { root } = parseJsonTree('{"a":{"b":{"c":1}}}')
    expect(root!.children[0]!.type).toBe('object')
    expect(root!.children[0]!.children[0]!.type).toBe('object')
  })

  it('parses arrays', () => {
    const { root } = parseJsonTree('[1,2,3]')
    expect(root!.type).toBe('array')
    expect(root!.size).toBe(3)
    expect(root!.children).toHaveLength(3)
  })

  it('parses all primitive types', () => {
    const { root } = parseJsonTree('{"s":"hello","n":42,"b":true,"nil":null}')
    const types = root!.children.map(c => c.type)
    expect(types).toContain('string')
    expect(types).toContain('number')
    expect(types).toContain('boolean')
    expect(types).toContain('null')
  })

  it('returns error on invalid JSON', () => {
    const { root, error } = parseJsonTree('{bad}')
    expect(root).toBeNull()
    expect(error).toBeTruthy()
  })

  it('assigns unique ids to all nodes', () => {
    const { root } = parseJsonTree('{"a":1,"b":2,"c":{"d":3}}')
    const ids: string[] = []
    function collect(n: typeof root) {
      if (!n) return
      ids.push(n.id)
      n.children.forEach(collect)
    }
    collect(root)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('builds correct dot-notation paths', () => {
    const { root } = parseJsonTree('{"user":{"name":"John"}}')
    const userNode = root!.children[0]!
    expect(userNode.path).toBe('user')
    expect(userNode.children[0]!.path).toBe('user.name')
  })

  it('builds correct bracket paths for arrays', () => {
    const { root } = parseJsonTree('[10,20]')
    expect(root!.children[0]!.path).toBe('[0]')
    expect(root!.children[1]!.path).toBe('[1]')
  })

  it('stores primitive values', () => {
    const { root } = parseJsonTree('{"score":42,"active":false,"label":"hi"}')
    const byKey = Object.fromEntries(root!.children.map(c => [c.key, c.value]))
    expect(byKey['score']).toBe(42)
    expect(byKey['active']).toBe(false)
    expect(byKey['label']).toBe('hi')
  })

  it('size on array node is item count', () => {
    const { root } = parseJsonTree('[1,2,3,4,5]')
    expect(root!.size).toBe(5)
  })

  it('size on object node is key count', () => {
    const { root } = parseJsonTree('{"a":1,"b":2,"c":3}')
    expect(root!.size).toBe(3)
  })
})

describe('nodeHasMatch', () => {
  it('matches by key', () => {
    const { root } = parseJsonTree('{"username":"alice"}')
    expect(nodeHasMatch(root!, 'username')).toBe(true)
    expect(nodeHasMatch(root!, 'email')).toBe(false)
  })

  it('matches by value', () => {
    const { root } = parseJsonTree('{"name":"alice"}')
    expect(nodeHasMatch(root!, 'alice')).toBe(true)
    expect(nodeHasMatch(root!, 'bob')).toBe(false)
  })

  it('is case-insensitive', () => {
    const { root } = parseJsonTree('{"Name":"Alice"}')
    expect(nodeHasMatch(root!, 'alice')).toBe(true)
    expect(nodeHasMatch(root!, 'NAME')).toBe(true)
  })

  it('matches in nested children', () => {
    const { root } = parseJsonTree('{"user":{"city":"Paris"}}')
    expect(nodeHasMatch(root!, 'paris')).toBe(true)
    expect(nodeHasMatch(root!, 'london')).toBe(false)
  })

  it('matches partial substrings', () => {
    const { root } = parseJsonTree('{"email":"alice@example.com"}')
    expect(nodeHasMatch(root!, 'example')).toBe(true)
  })
})

describe('collectDeepIds', () => {
  it('returns root id at depth 0', () => {
    const { root } = parseJsonTree('{"a":{"b":1}}')
    const ids = collectDeepIds(root!, 0)
    expect(ids).toContain(root!.id)
  })

  it('excludes shallow containers at high minDepth', () => {
    const { root } = parseJsonTree('{"a":{"b":1}}')
    const childA = root!.children[0]!
    const ids = collectDeepIds(root!, 2)
    // minDepth=2: root is depth 0 (excluded), childA is depth 1 (excluded)
    expect(ids).not.toContain(root!.id)
    expect(ids).not.toContain(childA.id)
  })

  it('collects deeply nested container ids', () => {
    const { root } = parseJsonTree('{"a":{"b":{"c":{"d":1}}}}')
    const ids = collectDeepIds(root!, 0)
    // root, a, b, c all have children
    expect(ids.length).toBeGreaterThanOrEqual(3)
  })
})

describe('collectAllExpandableIds', () => {
  it('collects all container node ids', () => {
    const { root } = parseJsonTree('{"a":{"b":1},"c":[1,2]}')
    const ids = collectAllExpandableIds(root!)
    expect(ids).toContain(root!.id)
    // a is object with children, c is array with children
    expect(ids.length).toBeGreaterThanOrEqual(3)
  })

  it('does not include primitive-only leaf arrays', () => {
    const { root } = parseJsonTree('[1,2,3]')
    const ids = collectAllExpandableIds(root!)
    // root is array with children → included
    // children 1,2,3 are primitives → not included
    expect(ids).toContain(root!.id)
    expect(ids).toHaveLength(1)
  })

  it('returns empty for flat primitive values', () => {
    const { root } = parseJsonTree('"hello"')
    const ids = collectAllExpandableIds(root!)
    expect(ids).toHaveLength(0)
  })
})
