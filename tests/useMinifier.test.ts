import { describe, it, expect } from 'vitest'
import { minifyCSS, minifyHTML, minifyJS } from '../app/composables/useMinifier'

describe('minifyCSS', () => {
  it('collapses whitespace and removes braces spacing', async () => {
    const { output, error } = await minifyCSS('body { color: red; }')
    expect(error).toBeNull()
    expect(output).toBe('body{color:red}')
  })

  it('removes comments', async () => {
    const { output } = await minifyCSS('/* comment */ a { color: blue; }')
    expect(output).not.toContain('comment')
    expect(output).toContain('color')
  })

  it('returns empty for blank input', async () => {
    const { output, error } = await minifyCSS('   ')
    expect(output).toBe('')
    expect(error).toBeNull()
  })

  it('reports savings > 0 for real CSS', async () => {
    const { savings, originalSize, minifiedSize } = await minifyCSS('body {\n  color: red;\n  margin: 0;\n}')
    expect(savings).toBeGreaterThan(0)
    expect(minifiedSize).toBeLessThan(originalSize)
  })

  it('handles multiple selectors', async () => {
    const src = 'h1, h2 { font-weight: bold; } p { margin: 0; }'
    const { output, error } = await minifyCSS(src)
    expect(error).toBeNull()
    expect(output.length).toBeLessThan(src.length)
  })

  it('measures bytes not chars', async () => {
    const src = 'body { color: red; }'
    const { originalSize } = await minifyCSS(src)
    expect(originalSize).toBe(new TextEncoder().encode(src).length)
  })
})

describe('minifyHTML', () => {
  it('collapses whitespace', async () => {
    const { output, error } = await minifyHTML('<p>Hello    World</p>')
    expect(error).toBeNull()
    expect(output).not.toMatch(/\s{2,}/)
  })

  it('removes HTML comments', async () => {
    const { output } = await minifyHTML('<div><!-- my comment -->content</div>')
    expect(output).not.toContain('my comment')
    expect(output).toContain('content')
  })

  it('minifies embedded CSS', async () => {
    const { output } = await minifyHTML('<style>body { color: red; }</style>')
    expect(output).toContain('color:red')
    expect(output).not.toContain('  ')
  })

  it('minifies embedded JS', async () => {
    const src = '<script>function add(a, b) { return a + b; }</script>'
    const { output } = await minifyHTML(src)
    expect(output.length).toBeLessThan(src.length)
  })

  it('returns empty for blank input', async () => {
    const { output, error } = await minifyHTML('  ')
    expect(output).toBe('')
    expect(error).toBeNull()
  })

  it('reports savings for multi-line HTML', async () => {
    const html = '<html>\n  <head>\n    <title>Test</title>\n  </head>\n  <body>\n    <p>Hello World</p>\n  </body>\n</html>'
    const { savings } = await minifyHTML(html)
    expect(savings).toBeGreaterThan(0)
  })
})

describe('minifyJS', () => {
  it('removes whitespace and newlines', async () => {
    const { output, error } = await minifyJS('var x = 1;\nvar y = 2;\n')
    expect(error).toBeNull()
    expect(output).not.toContain('\n')
  })

  it('renames local variables', async () => {
    const { output } = await minifyJS('function hello(longVarName) { return longVarName + 1; }')
    expect(output.length).toBeLessThan('function hello(longVarName) { return longVarName + 1; }'.length)
  })

  it('returns empty for blank input', async () => {
    const { output, error } = await minifyJS('   ')
    expect(output).toBe('')
    expect(error).toBeNull()
  })

  it('returns error for invalid JS', async () => {
    const { error } = await minifyJS('function { broken syntax')
    expect(error).not.toBeNull()
    expect(typeof error).toBe('string')
  })

  it('reports savings for real code', async () => {
    const code = 'function calculateTotal(price, quantity, taxRate) {\n  var subtotal = price * quantity;\n  var tax = subtotal * taxRate;\n  return subtotal + tax;\n}'
    const { savings, originalSize, minifiedSize } = await minifyJS(code)
    expect(savings).toBeGreaterThan(0)
    expect(minifiedSize).toBeLessThan(originalSize)
  })

  it('handles arrow functions', async () => {
    const { output, error } = await minifyJS('const add = (a, b) => a + b;')
    expect(error).toBeNull()
    expect(output).toBeTruthy()
  })
})
