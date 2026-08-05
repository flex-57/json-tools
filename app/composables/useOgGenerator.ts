import { useClipboard } from './useClipboard'

export const TWITTER_CARDS = ['summary_large_image', 'summary'] as const
export type TwitterCard = typeof TWITTER_CARDS[number]

export interface OgFields {
  title: string
  description: string
  url: string
  imageUrl: string
  siteName: string
  type: string
  locale: string
  twitterCard: TwitterCard
  twitterSite: string
  twitterCreator: string
}

const DEFAULT_FIELDS: OgFields = {
  title: 'JSON Tools — Free Developer Tools Online',
  description: '33 free browser-based developer tools. JSON, regex, cron, SQL, colors, hashes and more. No account, no upload, nothing tracked.',
  url: 'https://jsontools.space',
  imageUrl: 'https://jsontools.space/og/og-image.png',
  siteName: 'JSON Tools',
  type: 'website',
  locale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterSite: '',
  twitterCreator: '',
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Reverse of escapeHtml — &amp; last so a literal "&lt;" typed by the user
// (escaped to "&amp;lt;") round-trips back to "&lt;" rather than "<".
function unescapeHtml(str: string): string {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
}

export function generateMetaTags(fields: OgFields): string {
  const lines: string[] = []
  const meta = (attr: 'property' | 'name', key: string, value: string) => {
    if (!value) return
    lines.push(`<meta ${attr}="${key}" content="${escapeHtml(value)}" />`)
  }

  meta('property', 'og:title', fields.title)
  meta('property', 'og:type', fields.type)
  meta('property', 'og:url', fields.url)
  meta('property', 'og:image', fields.imageUrl)
  meta('property', 'og:description', fields.description)
  meta('property', 'og:site_name', fields.siteName)
  meta('property', 'og:locale', fields.locale)

  meta('name', 'twitter:card', fields.twitterCard)
  meta('name', 'twitter:title', fields.title)
  meta('name', 'twitter:description', fields.description)
  meta('name', 'twitter:image', fields.imageUrl)
  meta('name', 'twitter:site', fields.twitterSite)
  meta('name', 'twitter:creator', fields.twitterCreator)

  return lines.join('\n')
}

// Attribute-order- and quote-style-agnostic on purpose: real-world pasted
// snippets vary (content before property, single quotes, self-closing or
// not). This only needs to recognize known og:/twitter: keys, not parse
// arbitrary HTML, so a small regex pass is a better fit than pulling in a
// full HTML parser (and DOMParser isn't available outside a browser).
const META_TAG_RE = /<meta\s+([^>]*)>/gi

function extractAttr(attrs: string, name: string): string | null {
  const re = new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i')
  const m = attrs.match(re)
  if (!m) return null
  return m[1] ?? m[2] ?? ''
}

const FIELD_BY_KEY: Record<string, keyof OgFields> = {
  'og:title': 'title',
  'twitter:title': 'title',
  'og:description': 'description',
  'twitter:description': 'description',
  'og:url': 'url',
  'og:image': 'imageUrl',
  'twitter:image': 'imageUrl',
  'og:site_name': 'siteName',
  'og:type': 'type',
  'og:locale': 'locale',
  'twitter:card': 'twitterCard',
  'twitter:site': 'twitterSite',
  'twitter:creator': 'twitterCreator',
}

export function parseMetaTags(html: string): Partial<OgFields> {
  const found: Partial<OgFields> = {}
  for (const match of html.matchAll(META_TAG_RE)) {
    const attrs = match[1]!
    const key = extractAttr(attrs, 'property') ?? extractAttr(attrs, 'name')
    if (!key) continue
    const field = FIELD_BY_KEY[key.toLowerCase()]
    if (!field) continue
    const content = extractAttr(attrs, 'content')
    if (content === null) continue
    ;(found[field] as string) = unescapeHtml(content)
  }
  return found
}

export function useOgGenerator() {
  const title           = ref(DEFAULT_FIELDS.title)
  const description     = ref(DEFAULT_FIELDS.description)
  const url              = ref(DEFAULT_FIELDS.url)
  const imageUrl         = ref(DEFAULT_FIELDS.imageUrl)
  const siteName         = ref(DEFAULT_FIELDS.siteName)
  const type              = ref(DEFAULT_FIELDS.type)
  const locale            = ref(DEFAULT_FIELDS.locale)
  const twitterCard      = ref<TwitterCard>(DEFAULT_FIELDS.twitterCard)
  const twitterSite      = ref(DEFAULT_FIELDS.twitterSite)
  const twitterCreator   = ref(DEFAULT_FIELDS.twitterCreator)

  const fields = computed<OgFields>(() => ({
    title: title.value, description: description.value, url: url.value, imageUrl: imageUrl.value,
    siteName: siteName.value, type: type.value, locale: locale.value,
    twitterCard: twitterCard.value, twitterSite: twitterSite.value, twitterCreator: twitterCreator.value,
  }))

  const output = computed(() => generateMetaTags(fields.value))

  const { copied, copy } = useClipboard(() => output.value)

  function importFromHtml(html: string) {
    const found = parseMetaTags(html)
    if (found.title !== undefined) title.value = found.title
    if (found.description !== undefined) description.value = found.description
    if (found.url !== undefined) url.value = found.url
    if (found.imageUrl !== undefined) imageUrl.value = found.imageUrl
    if (found.siteName !== undefined) siteName.value = found.siteName
    if (found.type !== undefined) type.value = found.type
    if (found.locale !== undefined) locale.value = found.locale
    if (found.twitterCard !== undefined) twitterCard.value = found.twitterCard
    if (found.twitterSite !== undefined) twitterSite.value = found.twitterSite
    if (found.twitterCreator !== undefined) twitterCreator.value = found.twitterCreator
  }

  return {
    title, description, url, imageUrl, siteName, type, locale, twitterCard, twitterSite, twitterCreator,
    output, copied, copy, importFromHtml,
  }
}
