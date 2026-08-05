import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { useStringEscape } from '../app/composables/useStringEscape'

describe('useStringEscape — escape', () => {
  it('escapes newlines, tabs, quotes and backslashes', () => {
    const { input, output, mode } = useStringEscape()
    mode.value = 'escape'
    input.value = 'line1\nline2\t"quoted"\\path'
    expect(output.value).toBe('line1\\nline2\\t\\"quoted\\"\\\\path')
  })

  it('escapes carriage return, backspace and form feed', () => {
    const { input, output, mode } = useStringEscape()
    mode.value = 'escape'
    input.value = 'a\rb\bc\fd'
    expect(output.value).toBe('a\\rb\\bc\\fd')
  })

  it('escapes other control characters as \\u00XX', () => {
    const { input, output, mode } = useStringEscape()
    mode.value = 'escape'
    input.value = 'a\x01b'
    expect(output.value).toBe('a\\u0001b')
  })

  it('leaves non-ASCII characters untouched when escapeUnicode is off', () => {
    const { input, output, mode, escapeUnicode } = useStringEscape()
    mode.value = 'escape'
    escapeUnicode.value = false
    input.value = 'café'
    expect(output.value).toBe('café')
  })

  it('escapes non-ASCII characters as \\uXXXX when escapeUnicode is on', () => {
    const { input, output, mode, escapeUnicode } = useStringEscape()
    mode.value = 'escape'
    escapeUnicode.value = true
    input.value = 'café'
    expect(output.value).toBe('caf\\u00e9')
  })

  it('escapes astral characters as a surrogate pair when escapeUnicode is on', () => {
    const { input, output, mode, escapeUnicode } = useStringEscape()
    mode.value = 'escape'
    escapeUnicode.value = true
    input.value = '😀'
    expect(output.value).toBe('\\ud83d\\ude00')
  })
})

describe('useStringEscape — unescape', () => {
  it('unescapes newlines, tabs, quotes and backslashes', () => {
    const { input, output, mode } = useStringEscape()
    mode.value = 'unescape'
    input.value = 'line1\\nline2\\t\\"quoted\\"\\\\path'
    expect(output.value).toBe('line1\nline2\t"quoted"\\path')
  })

  it('unescapes \\uXXXX sequences', () => {
    const { input, output, mode } = useStringEscape()
    mode.value = 'unescape'
    input.value = 'caf\\u00e9'
    expect(output.value).toBe('café')
  })

  it('unescapes a surrogate pair back to the astral character', () => {
    const { input, output, mode, error } = useStringEscape()
    mode.value = 'unescape'
    input.value = '\\ud83d\\ude00'
    expect(error.value).toBeNull()
    expect(output.value).toBe('😀')
  })

  it('unescapes a lone forward-slash escape', () => {
    const { input, output, mode } = useStringEscape()
    mode.value = 'unescape'
    input.value = '\\/path'
    expect(output.value).toBe('/path')
  })

  it('errors on a trailing backslash', () => {
    const { input, output, error, mode } = useStringEscape()
    mode.value = 'unescape'
    input.value = 'abc\\'
    expect(output.value).toBe('')
    expect(error.value).toBeTruthy()
  })

  it('errors on an incomplete \\u escape', () => {
    const { input, output, error, mode } = useStringEscape()
    mode.value = 'unescape'
    input.value = '\\u12'
    expect(output.value).toBe('')
    expect(error.value).toBeTruthy()
  })

  it('errors on an unrecognized escape sequence', () => {
    const { input, output, error, mode } = useStringEscape()
    mode.value = 'unescape'
    input.value = '\\q'
    expect(output.value).toBe('')
    expect(error.value).toBeTruthy()
  })
})

describe('useStringEscape — round-trip', () => {
  it('escape then unescape returns the original string', () => {
    const original = 'Hello\n\t"World"\\ café 😀'
    const enc = useStringEscape()
    enc.mode.value = 'escape'
    enc.escapeUnicode.value = true
    enc.input.value = original

    const dec = useStringEscape()
    dec.mode.value = 'unescape'
    dec.input.value = enc.output.value
    expect(dec.output.value).toBe(original)
  })
})

describe('useStringEscape — empty input', () => {
  it('returns empty output and no error for empty input', () => {
    const { input, output, error } = useStringEscape()
    input.value = ''
    expect(output.value).toBe('')
    expect(error.value).toBeNull()
  })
})

describe('useStringEscape — mode switch keeps the sample meaningful', () => {
  it('swaps the untouched sample to its escaped form when switching to unescape', async () => {
    const { input, mode } = useStringEscape()
    const plainSample = input.value
    mode.value = 'unescape'
    await nextTick()
    expect(input.value).not.toBe(plainSample)
    expect(input.value).toContain('\\n')
  })

  it('does not touch input the user has typed themselves', async () => {
    const { input, mode } = useStringEscape()
    input.value = 'my own text, not the sample'
    mode.value = 'unescape'
    await nextTick()
    expect(input.value).toBe('my own text, not the sample')
  })
})
