import { describe, it, expect } from 'vitest'
import { diffJson } from '../app/composables/useJsonDiff'

const A = JSON.stringify({ name: 'John', age: 30, city: 'Paris' }, null, 2)
const B = JSON.stringify({ name: 'John', age: 31, city: 'Lyon' }, null, 2)

describe('diffJson', () => {
  it('detects identical JSONs', () => {
    const r = diffJson(A, A)
    expect(r.same).toBe(true)
    expect(r.additions).toBe(0)
    expect(r.deletions).toBe(0)
  })

  it('detects additions and deletions', () => {
    const r = diffJson(A, B)
    expect(r.same).toBe(false)
    expect(r.additions).toBeGreaterThan(0)
    expect(r.deletions).toBeGreaterThan(0)
  })

  it('additions + deletions = changed values', () => {
    const r = diffJson(A, B)
    // age and city changed → 2 added, 2 removed
    expect(r.additions).toBe(2)
    expect(r.deletions).toBe(2)
  })

  it('detects added key', () => {
    const left = JSON.stringify({ a: 1 }, null, 2)
    const right = JSON.stringify({ a: 1, b: 2 }, null, 2)
    const r = diffJson(left, right)
    expect(r.additions).toBeGreaterThan(0)
    expect(r.same).toBe(false)
  })

  it('detects removed key', () => {
    const left = JSON.stringify({ a: 1, b: 2 }, null, 2)
    const right = JSON.stringify({ a: 1 }, null, 2)
    const r = diffJson(left, right)
    expect(r.deletions).toBeGreaterThan(0)
    expect(r.same).toBe(false)
  })

  it('returns null error on empty inputs', () => {
    const r = diffJson('', '')
    expect(r.error).toBeNull()
    expect(r.same).toBe(true)
  })

  it('returns error on invalid JSON', () => {
    const r = diffJson('{bad json}', A)
    expect(r.error).not.toBeNull()
  })

  it('all lines are typed', () => {
    const r = diffJson(A, B)
    expect(r.lines.every(l => ['added', 'removed', 'unchanged'].includes(l.type))).toBe(true)
  })

  it('unchanged lines have both lineLeft and lineRight', () => {
    const r = diffJson(A, B)
    r.lines.filter(l => l.type === 'unchanged').forEach(l => {
      expect(l.lineLeft).not.toBeNull()
      expect(l.lineRight).not.toBeNull()
    })
  })
})
