import { describe, it, expect } from 'vitest'
import { optimizeSvg } from '../app/composables/useSvgOptimizer'

const SIMPLE = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="#ff0000"/></svg>'

describe('optimizeSvg', () => {
  it('optimizes a simple SVG and reports byte savings', () => {
    const r = optimizeSvg(SIMPLE)
    expect(r.error).toBeNull()
    expect(r.output).toContain('<svg')
    expect(r.originalSize).toBe(new TextEncoder().encode(SIMPLE).length)
    expect(r.optimizedSize).toBeGreaterThan(0)
    expect(r.optimizedSize).toBeLessThanOrEqual(r.originalSize)
  })

  it('strips comments and metadata', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><!-- comment --><metadata>x</metadata><rect width="1" height="1"/></svg>'
    const r = optimizeSvg(svg)
    expect(r.output).not.toContain('<!--')
    expect(r.output).not.toContain('metadata')
  })

  it('returns empty result on empty input', () => {
    const r = optimizeSvg('')
    expect(r.error).toBeNull()
    expect(r.output).toBe('')
    expect(r.originalSize).toBe(0)
  })

  it('returns a parse error with line/column on malformed SVG', () => {
    const r = optimizeSvg('not svg at all }{')
    expect(r.error).not.toBeNull()
    expect(r.error).not.toContain('<input>')
    expect(r.line).not.toBeNull()
    expect(r.column).not.toBeNull()
  })

  it('strips <script> tags when removeScripts is true (default)', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><rect width="1" height="1"/></svg>'
    const r = optimizeSvg(svg, true)
    expect(r.output).not.toContain('<script')
    expect(r.output).not.toContain('alert')
  })

  it('strips inline event handler attributes when removeScripts is true', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect width="1" height="1" onclick="alert(2)"/></svg>'
    const r = optimizeSvg(svg, true)
    expect(r.output).not.toContain('onload')
    expect(r.output).not.toContain('onclick')
  })

  it('keeps <script> tags when removeScripts is false', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><rect width="1" height="1"/></svg>'
    const r = optimizeSvg(svg, false)
    expect(r.output).toContain('<script')
  })
})
