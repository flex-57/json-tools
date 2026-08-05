import { describe, it, expect } from 'vitest'
import { formatGraphql } from '../app/composables/useGraphqlFormatter'

describe('formatGraphql', () => {
  it('formats a compact query with proper indentation', async () => {
    const r = await formatGraphql('query GetUser($id:ID!){user(id:$id){name email}}')
    expect(r.error).toBeNull()
    expect(r.output).toBe('query GetUser($id: ID!) {\n  user(id: $id) {\n    name\n    email\n  }\n}')
  })

  it('formats a mutation', async () => {
    const r = await formatGraphql('mutation CreatePost($input:PostInput!){createPost(input:$input){id title}}')
    expect(r.error).toBeNull()
    expect(r.output).toContain('mutation CreatePost($input: PostInput!) {')
    expect(r.output).toContain('  createPost(input: $input) {')
  })

  it('formats a fragment alongside a query', async () => {
    const r = await formatGraphql('fragment F on User{id name} query{user(id:"1"){...F}}')
    expect(r.error).toBeNull()
    expect(r.output).toContain('fragment F on User {')
    expect(r.output).toContain('...F')
  })

  it('formats SDL type definitions', async () => {
    const r = await formatGraphql('type User{id:ID! name:String}')
    expect(r.error).toBeNull()
    expect(r.output).toBe('type User {\n  id: ID!\n  name: String\n}')
  })

  it('returns no error on empty input', async () => {
    const r = await formatGraphql('')
    expect(r.error).toBeNull()
    expect(r.output).toBe('')
  })

  it('returns a clean error with 1-indexed line/column on invalid syntax', async () => {
    const r = await formatGraphql('query { user(id: ) }')
    expect(r.error).not.toBeNull()
    expect(r.error).not.toContain('\n')
    expect(r.line).toBe(1)
    expect(r.column).toBe(18)
  })

  it('reports an error for an unterminated brace', async () => {
    const r = await formatGraphql('query { user { name')
    expect(r.error).not.toBeNull()
    expect(r.line).not.toBeNull()
  })
})
