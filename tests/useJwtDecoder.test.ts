import { describe, it, expect } from 'vitest'
import { decodeJwt } from '../app/composables/useJwtDecoder'

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

// Token with exp in the past (expired)
const EXPIRED = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJleHAiOjE2MDAwMDAwMDB9.signature'

describe('decodeJwt', () => {
  it('decodes a valid JWT', () => {
    const r = decodeJwt(SAMPLE)
    expect(r.error).toBeNull()
    expect(r.header.decoded).toMatchObject({ alg: 'HS256', typ: 'JWT' })
    expect(r.payload.decoded).toMatchObject({ sub: '1234567890', name: 'John Doe' })
    expect(r.signature).toBeTruthy()
  })

  it('extracts issuedAt', () => {
    const r = decodeJwt(SAMPLE)
    expect(r.issuedAt).toBeInstanceOf(Date)
    expect(r.issuedAt?.getFullYear()).toBe(2018)
  })

  it('detects expired token', () => {
    const r = decodeJwt(EXPIRED)
    expect(r.isExpired).toBe(true)
    expect(r.expiresAt).toBeInstanceOf(Date)
  })

  it('returns empty error on empty input', () => {
    expect(decodeJwt('').error).toBe('empty')
  })

  it('returns error on invalid JWT format', () => {
    const r = decodeJwt('not.a.valid.jwt.token')
    expect(r.error).not.toBeNull()
  })

  it('returns error on two-part token', () => {
    const r = decodeJwt('header.payload')
    expect(r.error).not.toBeNull()
  })

  it('handles unicode in payload', () => {
    const header = btoa(JSON.stringify({ alg: 'HS256' })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ name: 'Alizée', city: 'Paris' })))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    const r = decodeJwt(`${header}.${payload}.sig`)
    expect(r.payload.decoded).toMatchObject({ name: 'Alizée' })
  })
})
