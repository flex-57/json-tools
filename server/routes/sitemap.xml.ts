import { GUIDES } from '~/data/guides'

interface SitemapUrl {
  loc: string
  priority?: string
  changefreq?: string
  lastmod?: string
}

export default defineEventHandler((event) => {
  const today = new Date().toISOString().split('T')[0]

  // Guide URLs are derived from app/data/guides.ts so a new guide can never
  // be forgotten here, and lastmod reflects each guide's real dateModified.
  const guideUrls: SitemapUrl[] = Object.values(GUIDES).map(guide => ({
    loc: `/guides/${guide.slug}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: guide.dateModified,
  }))

  const urls: SitemapUrl[] = [
    { loc: '/',                             priority: '1.0', changefreq: 'weekly' },
    { loc: '/faq',                          priority: '0.7', changefreq: 'monthly' },
    { loc: '/guides',                       priority: '0.7', changefreq: 'monthly' },
    ...guideUrls,
    { loc: '/terms',                        priority: '0.3', changefreq: 'yearly' },
    { loc: '/privacy',                      priority: '0.3', changefreq: 'yearly' },
    { loc: '/tools/json-formatter',         priority: '0.9', changefreq: 'monthly' },
    { loc: '/tools/csv-to-json' },
    { loc: '/tools/json-to-csv' },
    { loc: '/tools/xml-to-json' },
    { loc: '/tools/json-to-xml' },
    { loc: '/tools/yaml-to-json' },
    { loc: '/tools/json-to-yaml' },
    { loc: '/tools/excel-to-json' },
    { loc: '/tools/json-to-excel' },
    { loc: '/tools/jwt-decoder' },
    { loc: '/tools/base64' },
    { loc: '/tools/json-diff' },
    { loc: '/tools/url-encode' },
    { loc: '/tools/unix-timestamp' },
    { loc: '/tools/regex-tester' },
    { loc: '/tools/cron-parser' },
    { loc: '/tools/json-tree' },
    { loc: '/tools/json-to-ts' },
    { loc: '/tools/hash' },
    { loc: '/tools/uuid' },
    { loc: '/tools/json-schema' },
    { loc: '/tools/minifier' },
    { loc: '/tools/sql-formatter' },
    { loc: '/tools/text-case' },
    { loc: '/tools/number-base' },
    { loc: '/tools/jwt-generator' },
    { loc: '/tools/color' },
    { loc: '/tools/password-generator' },
    { loc: '/tools/markdown-preview' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, priority = '0.8', changefreq = 'monthly', lastmod = today }) => `  <url>
    <loc>https://jsontools.space${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml')
  return xml
})
