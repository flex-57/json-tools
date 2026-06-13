import { describe, it, expect } from 'vitest'
import { useRegexTester } from '../app/composables/useRegexTester'

describe('useRegexTester — matches', () => {
  it('finds all matches with global flag', () => {
    const { pattern, input, matches } = useRegexTester()
    pattern.value = '[a-z]+'
    input.value = 'hello world'
    expect(matches.value).toHaveLength(2)
    expect(matches.value[0]!.value).toBe('hello')
    expect(matches.value[1]!.value).toBe('world')
  })

  it('reports correct match index', () => {
    const { pattern, input, matches } = useRegexTester()
    pattern.value = 'world'
    input.value = 'hello world'
    expect(matches.value[0]!.index).toBe(6)
  })

  it('returns empty when pattern is empty', () => {
    const { input, matches } = useRegexTester()
    input.value = 'hello'
    expect(matches.value).toHaveLength(0)
  })

  it('returns empty when input is empty', () => {
    const { pattern, matches } = useRegexTester()
    pattern.value = 'hello'
    expect(matches.value).toHaveLength(0)
  })

  it('matches numbers', () => {
    const { pattern, input, matches } = useRegexTester()
    pattern.value = '\\d+'
    input.value = 'abc 123 def 456'
    expect(matches.value).toHaveLength(2)
    expect(matches.value[0]!.value).toBe('123')
    expect(matches.value[1]!.value).toBe('456')
  })
})

describe('useRegexTester — capture groups', () => {
  it('captures positional groups', () => {
    const { pattern, input, matches } = useRegexTester()
    pattern.value = '(\\w+)@(\\w+)'
    input.value = 'user@example'
    expect(matches.value[0]!.captures).toEqual(['user', 'example'])
  })

  it('captures named groups', () => {
    const { pattern, input, matches } = useRegexTester()
    pattern.value = '(?<user>\\w+)@(?<domain>\\w+)'
    input.value = 'alice@example'
    expect(matches.value[0]!.groups).toMatchObject({ user: 'alice', domain: 'example' })
  })

  it('captures is empty array when no groups', () => {
    const { pattern, input, matches } = useRegexTester()
    pattern.value = '\\w+'
    input.value = 'hello'
    expect(matches.value[0]!.captures).toHaveLength(0)
  })
})

describe('useRegexTester — flags', () => {
  it('case-insensitive flag matches regardless of case', () => {
    const { pattern, flags, input, matches } = useRegexTester()
    pattern.value = 'hello'
    flags.value = 'gi'
    input.value = 'Hello HELLO hello'
    expect(matches.value).toHaveLength(3)
  })

  it('multiline flag matches start of each line', () => {
    const { pattern, flags, input, matches } = useRegexTester()
    pattern.value = '^\\w+'
    flags.value = 'gm'
    input.value = 'foo\nbar\nbaz'
    expect(matches.value).toHaveLength(3)
  })
})

describe('useRegexTester — errors', () => {
  it('reports error on invalid regex', () => {
    const { pattern, regexError } = useRegexTester()
    pattern.value = '[invalid'
    expect(regexError.value).not.toBeNull()
  })

  it('no error on valid regex', () => {
    const { pattern, regexError } = useRegexTester()
    pattern.value = '\\d+'
    expect(regexError.value).toBeNull()
  })

  it('no error when pattern is empty', () => {
    const { regexError } = useRegexTester()
    expect(regexError.value).toBeNull()
  })
})

describe('useRegexTester — highlightedHtml', () => {
  it('wraps matches with mark tags', () => {
    const { pattern, input, highlightedHtml } = useRegexTester()
    pattern.value = '\\d+'
    input.value = 'abc 123 def 456'
    expect(highlightedHtml.value).toContain('<mark class="rx-match">123</mark>')
    expect(highlightedHtml.value).toContain('<mark class="rx-match">456</mark>')
  })

  it('escapes HTML special chars in plain text segments', () => {
    const { pattern, input, highlightedHtml } = useRegexTester()
    pattern.value = 'x'
    input.value = '<b>hello</b>'
    expect(highlightedHtml.value).toContain('&lt;')
    expect(highlightedHtml.value).toContain('&gt;')
  })

  it('returns plain escaped text when no pattern', () => {
    const { input, highlightedHtml } = useRegexTester()
    input.value = '<b>hello</b>'
    expect(highlightedHtml.value).toBe('&lt;b&gt;hello&lt;/b&gt;')
  })

  it('returns empty string when input is empty', () => {
    const { highlightedHtml } = useRegexTester()
    expect(highlightedHtml.value).toBe('')
  })

  it('escapes ampersands', () => {
    const { input, highlightedHtml } = useRegexTester()
    input.value = 'a&b'
    expect(highlightedHtml.value).toContain('&amp;')
  })
})
