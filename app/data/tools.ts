export type ToolVariant = 'transform' | 'bidirectional' | 'compare' | 'explorer' | 'analyzer' | 'generator'

export interface ToolMeta {
  slug: string
  name: string
  short: string
  category: 'json' | 'converters' | 'textcode' | 'security' | 'devutils'
  variant: ToolVariant
  /** Overrides `name` in nav/footer/homepage listings only — keeps the page's own breadcrumb/schema name intact. */
  navLabel?: string
  /** Excluded from nav/footer/homepage listings (its inverse-direction pair is shown instead). The page itself stays live and reachable via ToolSwitch + sitemap. */
  hidden?: boolean
  /** Renders a `.nav-dropdown-divider` right before this entry in the nav (desktop + mobile) — used to separate bidirectional converter pairs from single-direction ones. */
  navDividerBefore?: boolean
  /** Last date this tool's page content meaningfully changed (YYYY-MM-DD). Feeds the sitemap's lastmod — bump it when editing the page, don't touch it otherwise. */
  updatedAt?: string
}

export const CATEGORIES = {
  json: 'JSON',
  converters: 'Converters',
  textcode: 'Text & Code',
  security: 'Security',
  devutils: 'Dev Utils',
} as const

// Single source of truth for the tools — consumed by the nav dropdown
// and the homepage grid so they never drift apart (see DUAL-PANE-SYSTEM.md).
export const TOOLS: ToolMeta[] = [
  // JSON
  { slug: 'json-formatter', name: 'JSON Formatter', short: 'Beautify & validate', category: 'json', variant: 'transform', updatedAt: '2026-08-08' },
  { slug: 'json-diff', name: 'JSON Diff', short: 'Compare two documents', category: 'json', variant: 'compare', updatedAt: '2026-08-08' },
  { slug: 'json-tree', name: 'JSON Tree Viewer', short: 'Collapsible tree / graph', category: 'json', variant: 'explorer', updatedAt: '2026-08-08' },

  // Converters
  { slug: 'csv-to-json', name: 'CSV → JSON', short: 'Convert either direction', category: 'converters', variant: 'transform', navLabel: 'CSV ↔ JSON', updatedAt: '2026-07-10' },
  { slug: 'json-to-csv', name: 'JSON → CSV', short: 'Flatten to rows', category: 'converters', variant: 'transform', hidden: true, updatedAt: '2026-07-10' },
  { slug: 'xml-to-json', name: 'XML → JSON', short: 'Convert either direction', category: 'converters', variant: 'transform', navLabel: 'XML ↔ JSON', updatedAt: '2026-08-08' },
  { slug: 'json-to-xml', name: 'JSON → XML', short: 'Convert structure', category: 'converters', variant: 'transform', hidden: true, updatedAt: '2026-07-10' },
  { slug: 'yaml-to-json', name: 'YAML → JSON', short: 'Convert either direction', category: 'converters', variant: 'transform', navLabel: 'YAML ↔ JSON', updatedAt: '2026-07-10' },
  { slug: 'json-to-yaml', name: 'JSON → YAML', short: 'Readable config output', category: 'converters', variant: 'transform', hidden: true, updatedAt: '2026-07-10' },
  { slug: 'excel-to-json', name: 'Excel → JSON', short: 'Convert either direction', category: 'converters', variant: 'transform', navLabel: 'Excel ↔ JSON', updatedAt: '2026-07-10' },
  { slug: 'json-to-excel', name: 'JSON → Excel', short: 'Export as .xlsx', category: 'converters', variant: 'transform', hidden: true, updatedAt: '2026-07-10' },
  { slug: 'toml-to-json', name: 'TOML → JSON', short: 'Convert either direction', category: 'converters', variant: 'transform', navLabel: 'TOML ↔ JSON', updatedAt: '2026-08-05' },
  { slug: 'json-to-toml', name: 'JSON → TOML', short: 'Export as config', category: 'converters', variant: 'transform', hidden: true, updatedAt: '2026-08-05' },
  { slug: 'json-to-ts', name: 'JSON → TypeScript / Zod', short: 'Interfaces or Zod', category: 'converters', variant: 'transform', navDividerBefore: true, updatedAt: '2026-07-10' },
  { slug: 'json-schema', name: 'JSON → Schema', short: 'Infer JSON Schema', category: 'converters', variant: 'transform', updatedAt: '2026-07-10' },

  // Text & Code
  { slug: 'text-case', name: 'Text Case Converter', short: 'camelCase → kebab-case', category: 'textcode', variant: 'analyzer', updatedAt: '2026-07-10' },
  { slug: 'css-minifier', name: 'CSS Minifier', short: 'Compress stylesheets', category: 'textcode', variant: 'transform', updatedAt: '2026-08-08' },
  { slug: 'html-minifier', name: 'HTML Minifier', short: 'Compress markup', category: 'textcode', variant: 'transform', updatedAt: '2026-08-08' },
  { slug: 'js-minifier', name: 'JavaScript Minifier', short: 'Compress & mangle', category: 'textcode', variant: 'transform', updatedAt: '2026-08-08' },
  { slug: 'svg-optimizer', name: 'SVG Optimizer', short: 'Compress with SVGO', category: 'textcode', variant: 'transform', updatedAt: '2026-08-07' },
  { slug: 'svg-to-jsx', name: 'SVG to JSX', short: 'React component from SVG', category: 'textcode', variant: 'transform', updatedAt: '2026-08-07' },
  { slug: 'sql-formatter', name: 'SQL Formatter', short: 'Readable queries', category: 'textcode', variant: 'transform', updatedAt: '2026-07-07' },
  { slug: 'graphql-formatter', name: 'GraphQL Formatter', short: 'Queries, mutations & SDL', category: 'textcode', variant: 'transform', updatedAt: '2026-08-07' },
  { slug: 'url-encode', name: 'URL Encoder / Decoder', short: 'Percent-encode components', category: 'textcode', variant: 'bidirectional', updatedAt: '2026-08-08' },
  { slug: 'base64', name: 'Base64 Encoder / Decoder', short: 'Binary-to-text conversion', category: 'textcode', variant: 'bidirectional', updatedAt: '2026-08-08' },
  { slug: 'string-escape', name: 'String Escaper / Unescaper', short: 'JSON & code string literals', category: 'textcode', variant: 'bidirectional', updatedAt: '2026-08-05' },
  { slug: 'markdown-preview', name: 'Markdown Preview', short: 'Live rendered output', category: 'textcode', variant: 'transform', updatedAt: '2026-07-07' },

  // Security
  { slug: 'jwt-decoder', name: 'JWT Decoder', short: 'Inspect claims', category: 'security', variant: 'analyzer', updatedAt: '2026-08-08' },
  { slug: 'jwt-generator', name: 'JWT Generator', short: 'Sign a token', category: 'security', variant: 'generator', updatedAt: '2026-08-08' },
  { slug: 'hash', name: 'Hash Generator', short: 'MD5, SHA-1, SHA-256…', category: 'security', variant: 'analyzer', updatedAt: '2026-08-08' },
  { slug: 'hmac', name: 'HMAC Generator', short: 'Sign with a secret key', category: 'security', variant: 'generator', updatedAt: '2026-08-07' },
  { slug: 'uuid', name: 'UUID Generator', short: 'v4, v7 & ULID, bulk', category: 'security', variant: 'generator', updatedAt: '2026-08-08' },
  { slug: 'password-generator', name: 'Password Generator', short: 'Cryptographically secure', category: 'security', variant: 'generator', updatedAt: '2026-08-08' },

  // Dev Utils
  { slug: 'regex-tester', name: 'Regex Tester', short: 'Live match highlighting', category: 'devutils', variant: 'analyzer', updatedAt: '2026-08-08' },
  { slug: 'cron-parser', name: 'Cron Parser', short: 'Plain-English schedules', category: 'devutils', variant: 'analyzer', updatedAt: '2026-08-08' },
  { slug: 'unix-timestamp', name: 'Unix Timestamp', short: 'Epoch ↔ date', category: 'devutils', variant: 'analyzer', updatedAt: '2026-07-07' },
  { slug: 'number-base', name: 'Number Base Converter', short: 'Binary, octal, hex', category: 'devutils', variant: 'analyzer', updatedAt: '2026-07-10' },
  { slug: 'gpt-token-counter', name: 'GPT Token Counter', short: 'o200k_base BPE tokens', category: 'devutils', variant: 'analyzer', updatedAt: '2026-08-08' },
  { slug: 'color', name: 'Color Picker', short: 'HEX / RGB / HSL + contrast', category: 'devutils', variant: 'generator', updatedAt: '2026-07-07' },
  { slug: 'gradient', name: 'CSS Gradient Generator', short: 'Linear, radial, conic', category: 'devutils', variant: 'generator', updatedAt: '2026-07-11' },
  { slug: 'og-generator', name: 'Open Graph Meta Tag Generator', short: 'og: & twitter: tags + preview', category: 'devutils', variant: 'generator', updatedAt: '2026-08-07' },
  { slug: 'box-shadow', name: 'CSS Box-Shadow Generator', short: 'Layered shadows, live preview', category: 'devutils', variant: 'generator', updatedAt: '2026-08-06' },
]

// The number of tools as a user would count them: one per card/nav entry, not
// one per route. A converter pair (csv-to-json + json-to-csv) is a single card
// with a direction toggle, same as Base64 encode/decode or the 3 Minifier
// languages are a single card each — so it's `hidden` entries that get
// excluded here, consistent with toolsByCategory below. TOOLS.length counts
// routes (32), which matters for the sitemap but overstates what "N tools"
// means to a visitor by exactly the number of hidden reverse-direction pages.
export const VISIBLE_TOOL_COUNT = TOOLS.filter(t => !t.hidden).length

// Used by nav, footer and the homepage grid — excludes tools flagged `hidden`
// (the other direction of a converter pair, e.g. json-to-csv next to csv-to-json).
export function toolsByCategory(category: keyof typeof CATEGORIES): ToolMeta[] {
  return TOOLS.filter(t => t.category === category && !t.hidden)
}

export function toolMeta(slug: string): ToolMeta | undefined {
  return TOOLS.find(t => t.slug === slug)
}
