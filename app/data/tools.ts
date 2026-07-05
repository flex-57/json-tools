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
}

export const CATEGORIES = {
  json: 'JSON',
  converters: 'Converters',
  textcode: 'Text & Code',
  security: 'Security',
  devutils: 'Dev Utils',
} as const

// Single source of truth for the 29 tools — consumed by the nav dropdown
// and the homepage grid so they never drift apart (see DUAL-PANE-SYSTEM.md).
export const TOOLS: ToolMeta[] = [
  // JSON
  { slug: 'json-formatter', name: 'JSON Formatter', short: 'Beautify & validate', category: 'json', variant: 'transform' },
  { slug: 'json-diff', name: 'JSON Diff', short: 'Compare two documents', category: 'json', variant: 'compare' },
  { slug: 'json-tree', name: 'Tree Viewer', short: 'Collapsible tree / graph', category: 'json', variant: 'explorer' },

  // Converters
  { slug: 'csv-to-json', name: 'CSV to JSON', short: 'Convert either direction', category: 'converters', variant: 'transform', navLabel: 'CSV ↔ JSON' },
  { slug: 'json-to-csv', name: 'JSON to CSV', short: 'Flatten to rows', category: 'converters', variant: 'transform', hidden: true },
  { slug: 'xml-to-json', name: 'XML to JSON', short: 'Convert either direction', category: 'converters', variant: 'transform', navLabel: 'XML ↔ JSON' },
  { slug: 'json-to-xml', name: 'JSON to XML', short: 'Convert structure', category: 'converters', variant: 'transform', hidden: true },
  { slug: 'yaml-to-json', name: 'YAML to JSON', short: 'Convert either direction', category: 'converters', variant: 'transform', navLabel: 'YAML ↔ JSON' },
  { slug: 'json-to-yaml', name: 'JSON to YAML', short: 'Readable config output', category: 'converters', variant: 'transform', hidden: true },
  { slug: 'excel-to-json', name: 'Excel to JSON', short: 'Convert either direction', category: 'converters', variant: 'transform', navLabel: 'Excel ↔ JSON' },
  { slug: 'json-to-excel', name: 'JSON to Excel', short: 'Export as .xlsx', category: 'converters', variant: 'transform', hidden: true },
  { slug: 'json-to-ts', name: 'To TypeScript', short: 'Interfaces or Zod', category: 'converters', variant: 'transform', navLabel: 'JSON → TypeScript / Zod', navDividerBefore: true },
  { slug: 'json-schema', name: 'To Schema', short: 'Infer JSON Schema', category: 'converters', variant: 'transform', navLabel: 'JSON → Schema' },

  // Text & Code
  { slug: 'text-case', name: 'Text Case', short: 'camelCase → kebab-case', category: 'textcode', variant: 'analyzer' },
  { slug: 'minifier', name: 'Minifier', short: 'CSS / HTML / JS', category: 'textcode', variant: 'transform' },
  { slug: 'sql-formatter', name: 'SQL Formatter', short: 'Readable queries', category: 'textcode', variant: 'transform' },
  { slug: 'url-encode', name: 'URL Encode', short: 'Percent-encode components', category: 'textcode', variant: 'bidirectional' },
  { slug: 'base64', name: 'Base64', short: 'Encode / decode', category: 'textcode', variant: 'bidirectional' },
  { slug: 'markdown-preview', name: 'Markdown Preview', short: 'Live rendered output', category: 'textcode', variant: 'transform' },

  // Security
  { slug: 'jwt-decoder', name: 'JWT Decoder', short: 'Inspect claims', category: 'security', variant: 'analyzer' },
  { slug: 'jwt-generator', name: 'JWT Generator', short: 'Sign a token', category: 'security', variant: 'generator' },
  { slug: 'hash', name: 'Hash Generator', short: 'MD5, SHA-1, SHA-256…', category: 'security', variant: 'analyzer' },
  { slug: 'uuid', name: 'UUID Generator', short: 'Bulk v4 identifiers', category: 'security', variant: 'generator' },
  { slug: 'password-generator', name: 'Password Generator', short: 'Cryptographically secure', category: 'security', variant: 'generator' },

  // Dev Utils
  { slug: 'regex-tester', name: 'Regex Tester', short: 'Live match highlighting', category: 'devutils', variant: 'analyzer' },
  { slug: 'cron-parser', name: 'Cron Parser', short: 'Plain-English schedules', category: 'devutils', variant: 'analyzer' },
  { slug: 'unix-timestamp', name: 'Unix Timestamp', short: 'Epoch ↔ date', category: 'devutils', variant: 'analyzer' },
  { slug: 'number-base', name: 'Number Base', short: 'Binary, octal, hex', category: 'devutils', variant: 'analyzer' },
  { slug: 'color', name: 'Color Picker', short: 'HEX / RGB / HSL + contrast', category: 'devutils', variant: 'generator' },
]

// Used by nav, footer and the homepage grid — excludes tools flagged `hidden`
// (the other direction of a converter pair, e.g. json-to-csv next to csv-to-json).
export function toolsByCategory(category: keyof typeof CATEGORIES): ToolMeta[] {
  return TOOLS.filter(t => t.category === category && !t.hidden)
}

export function toolMeta(slug: string): ToolMeta | undefined {
  return TOOLS.find(t => t.slug === slug)
}
