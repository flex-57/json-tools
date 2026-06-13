import { describe, it, expect } from 'vitest'
import { useUnixTimestamp } from '../app/composables/useUnixTimestamp'

// 1700000000 = 2023-11-14T22:13:20.000Z
const TS_SEC  = '1700000000'
const TS_MS   = '1700000000000'
const ISO_STR = '2023-11-14T22:13:20.000Z'

describe('useUnixTimestamp — parsing Unix seconds', () => {
  it('parses seconds correctly', () => {
    const { input, parsed } = useUnixTimestamp()
    input.value = TS_SEC
    expect(parsed.value).toBeInstanceOf(Date)
    expect(parsed.value!.toISOString()).toBe(ISO_STR)
  })

  it('unix computed returns seconds', () => {
    const { input, unix } = useUnixTimestamp()
    input.value = TS_SEC
    expect(unix.value).toBe(1700000000)
  })

  it('unixMs computed returns milliseconds', () => {
    const { input, unixMs } = useUnixTimestamp()
    input.value = TS_SEC
    expect(unixMs.value).toBe(1700000000000)
  })

  it('iso computed returns ISO string', () => {
    const { input, iso } = useUnixTimestamp()
    input.value = TS_SEC
    expect(iso.value).toBe(ISO_STR)
  })
})

describe('useUnixTimestamp — parsing Unix milliseconds', () => {
  it('detects and parses ms timestamp (> 1e12)', () => {
    const { input, parsed } = useUnixTimestamp()
    input.value = TS_MS
    expect(parsed.value).toBeInstanceOf(Date)
    expect(parsed.value!.toISOString()).toBe(ISO_STR)
  })

  it('unixMs matches the ms input', () => {
    const { input, unixMs } = useUnixTimestamp()
    input.value = TS_MS
    expect(unixMs.value).toBe(1700000000000)
  })
})

describe('useUnixTimestamp — parsing ISO strings', () => {
  it('parses ISO 8601 date string', () => {
    const { input, parsed } = useUnixTimestamp()
    input.value = ISO_STR
    expect(parsed.value).toBeInstanceOf(Date)
    expect(unix(input.value)).toBe(1700000000)
    function unix(v: string) {
      const { input: i, unix: u } = useUnixTimestamp()
      i.value = v
      return u.value
    }
  })

  it('parses RFC 2822-style date strings', () => {
    const { input, parsed } = useUnixTimestamp()
    input.value = 'Tue, 14 Nov 2023 22:13:20 GMT'
    expect(parsed.value).toBeInstanceOf(Date)
    expect(parsed.value!.getUTCFullYear()).toBe(2023)
  })
})

describe('useUnixTimestamp — negative timestamps', () => {
  it('parses negative unix timestamp (before epoch)', () => {
    const { input, parsed } = useUnixTimestamp()
    input.value = '-86400'
    expect(parsed.value).toBeInstanceOf(Date)
    expect(parsed.value!.getUTCFullYear()).toBe(1969)
  })
})

describe('useUnixTimestamp — empty and invalid input', () => {
  it('returns null for empty input', () => {
    const { parsed, error } = useUnixTimestamp()
    expect(parsed.value).toBeNull()
    expect(error.value).toBeNull()
  })

  it('returns null and error for unrecognized format', () => {
    const { input, parsed, error } = useUnixTimestamp()
    input.value = 'not a date at all'
    expect(parsed.value).toBeNull()
    expect(error.value).not.toBeNull()
  })
})

describe('useUnixTimestamp — relative time', () => {
  it('returns "just now" for current timestamp', () => {
    const { input, relative } = useUnixTimestamp()
    input.value = String(Math.floor(Date.now() / 1000))
    expect(['just now', 'in a few seconds']).toContain(relative.value)
  })

  it('returns "ago" for a past timestamp', () => {
    const { input, relative } = useUnixTimestamp()
    input.value = String(Math.floor(Date.now() / 1000) - 7200)
    expect(relative.value).toContain('ago')
  })

  it('returns "in " for a future timestamp', () => {
    const { input, relative } = useUnixTimestamp()
    input.value = String(Math.floor(Date.now() / 1000) + 7200)
    expect(relative.value).toContain('in ')
  })

  it('returns null for empty input', () => {
    const { relative } = useUnixTimestamp()
    expect(relative.value).toBeNull()
  })
})
