export default defineEventHandler((event) => {
  const today = new Date().toISOString().split('T')[0]

  const urls = [
    { loc: '/',                        priority: '1.0', changefreq: 'weekly' },
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
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, priority = '0.8', changefreq = 'monthly' }) => `  <url>
    <loc>https://jsontools.space${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml')
  return xml
})
