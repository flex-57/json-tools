import { describe, it, expect } from 'vitest'
import { sanitizeHexInput, toSixDigitHex, cssColorToSixDigitHex } from '../app/utils/colorInput'

describe('sanitizeHexInput', () => {
  it('strips non-hex characters', () => {
    expect(sanitizeHexInput('#ff-3d/8f!')).toBe('#ff3d8f')
  })

  it('caps at 8 digits', () => {
    expect(sanitizeHexInput('#388ce065464')).toBe('#388ce065')
  })

  it('preserves absence of a leading #', () => {
    expect(sanitizeHexInput('ff3d8f')).toBe('ff3d8f')
  })
})

describe('toSixDigitHex', () => {
  it('passes through a 6-digit hex unchanged', () => {
    expect(toSixDigitHex('#ff3d8f')).toBe('#ff3d8f')
  })

  it('truncates an 8-digit alpha hex to 6', () => {
    expect(toSixDigitHex('#ff3d8f80')).toBe('#ff3d8f')
  })

  it('expands a 3-digit shorthand', () => {
    expect(toSixDigitHex('#fff')).toBe('#ffffff')
  })

  it('falls back to black for an incomplete value', () => {
    expect(toSixDigitHex('#ff')).toBe('#000000')
  })
})

describe('cssColorToSixDigitHex', () => {
  it('passes a hex value through toSixDigitHex', () => {
    expect(cssColorToSixDigitHex('#ff3d8f')).toBe('#ff3d8f')
  })

  it('converts rgb() to hex', () => {
    expect(cssColorToSixDigitHex('rgb(255, 61, 143)')).toBe('#ff3d8f')
  })

  it('converts rgba() to hex, ignoring the alpha component', () => {
    expect(cssColorToSixDigitHex('rgba(0, 0, 0, 0.15)')).toBe('#000000')
    expect(cssColorToSixDigitHex('rgba(255, 61, 143, 0.65)')).toBe('#ff3d8f')
  })

  it('clamps out-of-range rgb components', () => {
    expect(cssColorToSixDigitHex('rgb(300, -10, 61)')).toBe('#ff003d')
  })

  it('falls back to black for unparseable formats (hsl, named colors)', () => {
    expect(cssColorToSixDigitHex('hsl(330, 100%, 62%)')).toBe('#000000')
    expect(cssColorToSixDigitHex('cornflowerblue')).toBe('#000000')
  })
})
