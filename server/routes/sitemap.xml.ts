import { GUIDES } from '~/data/guides'
import { TOOLS } from '~/data/tools'

interface SitemapUrl {
  loc: string
  priority?: string
  changefreq?: string
  lastmod?: string
}

export default defineEventHandler((event) => {
  // Guide URLs are derived from app/data/guides.ts so a new guide can never
  // be forgotten here, and lastmod reflects each guide's real dateModified.
  const guideUrls: SitemapUrl[] = Object.values(GUIDES).map(guide => ({
    loc: `/guides/${guide.slug}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: guide.dateModified,
  }))

  // Tool URLs are derived from app/data/tools.ts so a new tool can never be
  // forgotten here. lastmod is omitted unless the tool has a real updatedAt —
  // a fake "today" default made Google treat the whole field as unreliable.
  const toolUrls: SitemapUrl[] = TOOLS.map(tool => ({
    loc: `/tools/${tool.slug}`,
    priority: tool.slug === 'json-formatter' ? '0.9' : '0.8',
    changefreq: 'monthly',
    lastmod: tool.updatedAt,
  }))

  const urls: SitemapUrl[] = [
    { loc: '/',                             priority: '1.0', changefreq: 'weekly' },
    { loc: '/faq',                          priority: '0.7', changefreq: 'monthly' },
    { loc: '/guides',                       priority: '0.7', changefreq: 'monthly' },
    ...guideUrls,
    { loc: '/terms',                        priority: '0.3', changefreq: 'yearly' },
    { loc: '/privacy',                      priority: '0.3', changefreq: 'yearly' },
    ...toolUrls,
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, priority = '0.8', changefreq = 'monthly', lastmod }) => `  <url>
    <loc>https://jsontools.space${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml')
  return xml
})
