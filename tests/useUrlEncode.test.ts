import { describe, it, expect } from 'vitest'
import { useUrlEncode } from '../app/composables/useUrlEncode'

describe('useUrlEncode — encode component', () => {
  it('encodes spaces and special chars', () => {
    const { input, output, mode, variant } = useUrlEncode()
    mode.value = 'encode'
    variant.value = 'component'
    input.value = 'hello world & more'
    expect(output.value).toBe('hello%20world%20%26%20more')
  })

  it('encodes unicode characters', () => {
    const { input, output, mode, variant } = useUrlEncode()
    mode.value = 'encode'
    variant.value = 'component'
    input.value = 'café'
    expect(output.value).not.toBe('café')
    expect(output.value).toContain('%')
  })

  it('encodes slash and colon with component variant', () => {
    const { input, output, mode, variant } = useUrlEncode()
    mode.value = 'encode'
    variant.value = 'component'
    input.value = 'http://example.com'
    expect(output.value).toContain('%3A')
  })
})

describe('useUrlEncode — encode full URL', () => {
  it('preserves :// and path separators', () => {
    const { input, output, mode, variant } = useUrlEncode()
    mode.value = 'encode'
    variant.value = 'full'
    input.value = 'https://example.com/path?q=hello world'
    expect(output.value).toContain('https://example.com/path')
    expect(output.value).toContain('hello%20world')
  })
})

describe('useUrlEncode — decode component', () => {
  it('decodes percent-encoded string', () => {
    const { input, output, mode, variant } = useUrlEncode()
    mode.value = 'decode'
    variant.value = 'component'
    input.value = 'hello%20world%20%26%20more'
    expect(output.value).toBe('hello world & more')
  })

  it('decodes unicode', () => {
    const enc = useUrlEncode()
    enc.mode.value = 'encode'
    enc.variant.value = 'component'
    enc.input.value = 'café'
    const encoded = enc.output.value

    const dec = useUrlEncode()
    dec.mode.value = 'decode'
    dec.variant.value = 'component'
    dec.input.value = encoded
    expect(dec.output.value).toBe('café')
  })

  it('returns error on invalid percent sequence', () => {
    const { input, output, error, mode } = useUrlEncode()
    mode.value = 'decode'
    input.value = '%GG'
    expect(output.value).toBe('')
    expect(error.value).toBeTruthy()
  })
})

describe('useUrlEncode — round-trip', () => {
  it('encode then decode returns original', () => {
    const original = 'a=1&b=hello world!'
    const enc = useUrlEncode()
    enc.mode.value = 'encode'
    enc.variant.value = 'component'
    enc.input.value = original
    const encoded = enc.output.value

    const dec = useUrlEncode()
    dec.mode.value = 'decode'
    dec.variant.value = 'component'
    dec.input.value = encoded
    expect(dec.output.value).toBe(original)
  })
})

describe('useUrlEncode — empty input', () => {
  it('returns empty output for empty input', () => {
    const { output } = useUrlEncode()
    expect(output.value).toBe('')
  })

  it('no error on empty input', () => {
    const { error } = useUrlEncode()
    expect(error.value).toBeNull()
  })
})
