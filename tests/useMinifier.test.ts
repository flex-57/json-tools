import { describe, it, expect } from 'vitest'
import { minifyCSS, minifyHTML, minifyJS, humanizeCssError } from '../app/composables/useMinifier'

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

  // minifyCSS's WASM path is gated behind import.meta.client, which is never
  // truthy under Vitest's plain node environment (no Nuxt runtime) — it
  // always takes the regex fallback here and never throws, so the humanizer
  // is tested directly against real lightningcss-wasm error messages
  // (captured empirically, see useMinifier.ts) instead of through minifyCSS.
  describe('humanizeCssError', () => {
    it('rewrites known lightningcss-wasm messages into a tip, with no fake position', async () => {
      expect(humanizeCssError('Unexpected end of input')).toBe('Unexpected end of input — check for an unclosed { or a missing value.')
      expect(humanizeCssError('Invalid media query')).toBe('Invalid media query — check the feature syntax, e.g. (min-width: 600px).')
      expect(humanizeCssError('Invalid dangling combinator in selector')).toBe('Invalid dangling combinator in selector — remove the trailing >, +, or ~, or add a selector after it.')
      expect(humanizeCssError('Unexpected token CloseCurlyBracket')).toBe('Unexpected token CloseCurlyBracket — check for a stray character or misplaced bracket.')
    })

    it('leaves unrecognized messages untouched rather than guessing', async () => {
      expect(humanizeCssError('Some future lightningcss message')).toBe('Some future lightningcss message')
    })
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

  it('surfaces a non-blocking warning with the real terser message when an embedded <script> fails, instead of failing silently', async () => {
    const html = '<div>ok</div>\n<script>function foo( { return 1 } </script>'
    const { error, warning, output } = await minifyHTML(html)
    expect(error).toBeNull()
    expect(warning).toContain('1 embedded <script> block was left unminified — ')
    expect(output).toContain('function foo(')
  })

  it('lists every failing block distinctly when more than one embedded <script> fails', async () => {
    const html = '<script>function foo( { return 1 }</script><script>function bar( { return 2 }</script>'
    const { warning } = await minifyHTML(html)
    expect(warning).toMatch(/^2 embedded <script> blocks were left unminified — #1: .+; #2: .+\.$/)
  })

  it('reports no warning on a clean document', async () => {
    const { warning } = await minifyHTML('<div><script>function add(a,b){return a+b}</script></div>')
    expect(warning).toBeNull()
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

  it('derives line/column for an unclosed attribute quote from the parser\'s unconsumed remainder', async () => {
    const html = '<!DOCTYPE html>\n<html>\n<body>\n  <div class="unclosed>\n    <p>hi</p>\n  </div>\n</body>\n</html>'
    const { error, errorLine, errorColumn } = await minifyHTML(html)
    expect(error).toBe('Unclosed tag or attribute — the parser could not recover past this point.')
    expect(errorLine).toBe(4)
    expect(errorColumn).toBe(3)
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

  it('reports 1-indexed line and column from terser for a syntax error', async () => {
    const { errorLine, errorColumn } = await minifyJS('function { broken syntax')
    expect(errorLine).toBe(1)
    expect(errorColumn).toBe(10)
  })

  it('humanizes an unterminated string error', async () => {
    const { error, errorLine } = await minifyJS('const x = "unterminated')
    expect(error).toBe('Unterminated string — check for a missing closing quote.')
    expect(errorLine).toBe(1)
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
