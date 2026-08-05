import { describe, it, expect } from 'vitest'
import { generateMetaTags, parseMetaTags, type OgFields } from '../app/composables/useOgGenerator'

const FIELDS: OgFields = {
  title: 'My Page',
  description: 'A short description.',
  url: 'https://example.com',
  imageUrl: 'https://example.com/og.png',
  siteName: 'Example',
  type: 'website',
  locale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterSite: '@example',
  twitterCreator: '@author',
}

describe('generateMetaTags', () => {
  it('emits the four required og: tags plus optional ones', () => {
    const html = generateMetaTags(FIELDS)
    expect(html).toContain('<meta property="og:title" content="My Page" />')
    expect(html).toContain('<meta property="og:type" content="website" />')
    expect(html).toContain('<meta property="og:url" content="https://example.com" />')
    expect(html).toContain('<meta property="og:image" content="https://example.com/og.png" />')
    expect(html).toContain('<meta property="og:description" content="A short description." />')
    expect(html).toContain('<meta property="og:site_name" content="Example" />')
  })

  it('emits twitter: tags mirroring title/description/image', () => {
    const html = generateMetaTags(FIELDS)
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />')
    expect(html).toContain('<meta name="twitter:title" content="My Page" />')
    expect(html).toContain('<meta name="twitter:site" content="@example" />')
    expect(html).toContain('<meta name="twitter:creator" content="@author" />')
  })

  it('omits empty optional fields entirely', () => {
    const html = generateMetaTags({ ...FIELDS, siteName: '', twitterSite: '', twitterCreator: '' })
    expect(html).not.toContain('og:site_name')
    expect(html).not.toContain('twitter:site')
    expect(html).not.toContain('twitter:creator')
  })

  it('HTML-escapes special characters in content values', () => {
    const html = generateMetaTags({ ...FIELDS, title: 'Fish & Chips <best>' })
    expect(html).toContain('content="Fish &amp; Chips &lt;best&gt;"')
    expect(html).not.toContain('Fish & Chips <best>')
  })
})

describe('parseMetaTags', () => {
  it('extracts og: and twitter: fields from a pasted snippet', () => {
    const html = generateMetaTags(FIELDS)
    const found = parseMetaTags(html)
    expect(found.title).toBe('My Page')
    expect(found.description).toBe('A short description.')
    expect(found.url).toBe('https://example.com')
    expect(found.imageUrl).toBe('https://example.com/og.png')
    expect(found.twitterCard).toBe('summary_large_image')
  })

  it('handles attribute order and quote style variations', () => {
    const html = `<meta content='Alt Order' property='og:title'>\n<meta name="twitter:site" content="@x">`
    const found = parseMetaTags(html)
    expect(found.title).toBe('Alt Order')
    expect(found.twitterSite).toBe('@x')
  })

  it('ignores unrelated meta tags', () => {
    const html = `<meta charset="utf-8"><meta name="viewport" content="width=device-width">`
    const found = parseMetaTags(html)
    expect(Object.keys(found)).toHaveLength(0)
  })

  it('round-trips a title containing quotes and ampersands without corruption', () => {
    const original = 'Fish & Chips "the best"'
    const html = generateMetaTags({ ...FIELDS, title: original })
    const found = parseMetaTags(html)
    expect(found.title).toBe(original)
  })

  it('round-trips generate -> parse -> generate to the same output', () => {
    const first = generateMetaTags({ ...FIELDS, title: 'Tom & Jerry <Show>' })
    const found = parseMetaTags(first)
    const second = generateMetaTags({ ...FIELDS, ...found } as OgFields)
    expect(second).toBe(first)
  })
})
