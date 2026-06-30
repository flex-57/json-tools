# JSON Tools

**29 free browser-based developer utilities — JSON, converters, JWT, regex, and more.**

Live at **[jsontools.space](https://jsontools.space)**

All tools run entirely in your browser. No data is ever sent to a server, no signup required, no tracking.

---

## Tools

**JSON**
- JSON Formatter & Validator
- JSON Diff
- JSON Tree Viewer (tree + interactive node graph)

**Converters**
- CSV ↔ JSON
- XML ↔ JSON
- YAML ↔ JSON
- Excel ↔ JSON
- JSON → TypeScript / Zod
- JSON → Schema (Draft-07 & 2020-12)

**Text & Code**
- Text Case Converter
- CSS / HTML / JS Minifier
- SQL Formatter
- URL Encode / Decode
- Base64 Encode / Decode
- Markdown Preview

**Security**
- JWT Decoder
- JWT Generator
- Hash Generator (MD5, SHA-1, SHA-256, SHA-512)
- UUID Generator
- Password Generator

**Dev Utils**
- Regex Tester
- Cron Parser
- Unix Timestamp Converter
- Number Base Converter (binary, octal, decimal, hex)
- Color Picker & Converter (HEX, RGB, HSL, HSV)

**Guides** — `/guides`
- What is JSON?
- What is a JWT Token?
- What is Base64?
- Cron Expression Examples
- JSON vs YAML
- How to Validate JSON
- What is a Regular Expression?
- What is Markdown?
- Markdown Cheatsheet

---

## Stack

### Framework
- **[Nuxt 4](https://nuxt.com)** with **[Vue 3](https://vuejs.org)** Composition API and TypeScript
- **Static Site Generation** (`nuxt generate`) — every route pre-rendered to HTML at build time, served as static files from Vercel's edge network with `s-maxage=3600, stale-while-revalidate=86400`
- **[Vue Router 5](https://router.vuejs.org)** with strict mode (no trailing slash ambiguity)

### Styling
- **No UI framework** — custom scoped CSS throughout, with a small shared `tools.css` for cross-tool patterns (editor cards, copy buttons, toggles, drag states)
- **[Tailwind CSS](https://tailwindcss.com)** installed but used sparingly — layout utility only, no utility-class styling in templates
- **[Outfit](https://fonts.google.com/specimen/Outfit)** (UI) + **[JetBrains Mono](https://www.jetbrains.com/legalnotice/fonts/)** (code/monospace) via Google Fonts
- Dark mode via `.dark` class on `<html>`, toggled in localStorage. A synchronous inline script in `<head>` applies it before Vue hydrates to prevent flash.

### Editor & syntax highlighting
- **[CodeMirror 6](https://codemirror.net)** — used as a controlled component (`JsonEditor.vue`) with dynamic language pack loading (code splitting via Vite). Supports JSON, TypeScript, JavaScript, XML, YAML, SQL. Theme and highlight config are separate Compartments so dark/light mode switching works without re-mounting.

### JSON Tree Viewer
- **[Vue Flow](https://vueflow.dev)** — renders the node graph view
- **[Dagre](https://github.com/dagrejs/dagre)** — automatic directed graph layout for the graph mode

### Parsing & conversion libraries
| Library | Used for |
|---|---|
| [papaparse](https://www.papaparse.com) | CSV / TSV parsing |
| [fast-xml-parser](https://naturalintelligence.github.io/fast-xml-parser/) | XML ↔ JSON |
| [js-yaml](https://github.com/nodeca/js-yaml) | YAML ↔ JSON |
| [xlsx](https://github.com/SheetJS/sheetjs) | Excel read/write |
| [sql-formatter](https://github.com/sql-formatter-org/sql-formatter) | SQL formatting |
| [html-minifier-terser](https://github.com/terser/html-minifier-terser) + [terser](https://github.com/terser/terser) | HTML/JS minification |
| [marked](https://marked.js.org) + [DOMPurify](https://github.com/cure53/DOMPurify) | Markdown rendering (sanitized) |

### SEO & metadata
- `useSeoMeta` + `useHead` on every page — unique titles, descriptions, canonical URLs, Open Graph tags
- **JSON-LD structured data**: `WebSite` on homepage, `FAQPage` on `/faq`, `WebApplication` + `BreadcrumbList` + `FAQPage` on every tool page
- Custom OG images (1200×630 PNG) per page — generated with a local Playwright script (`scripts/generate-og.cjs`) and committed to `public/og/`
- `sitemap.xml` served as a Nitro server route, auto-includes all tool and guide paths
- `llms.txt` at the root for AI crawler discovery

### Security headers (via Nitro `routeRules`)
```
Content-Security-Policy   — allowlists self + Google AdSense/Analytics/Fonts
X-Frame-Options           — DENY
X-Content-Type-Options    — nosniff
Referrer-Policy           — strict-origin-when-cross-origin
X-Powered-By              — (removed)
```

### Composable architecture
Each tool lives in a `composable/use*.ts` file that owns all the logic (parsing, state, copy, error handling). Pages are thin templates that call one composable. This makes the tools independently testable.

### Tests
**[Vitest](https://vitest.dev)** — unit tests for all composables (16 test files).

```bash
npm test          # run all tests once
npm run test:watch  # watch mode
```

---

## Run locally

```bash
npm install
npm run dev       # dev server at http://localhost:3000
npm run build     # SSG build → .output/public/
npm run preview   # serve the SSG output locally
```

---

## OG images

OG images are pre-generated PNGs in `public/og/`. To regenerate (e.g. after adding a tool):

```bash
# Requires a local dev server running on :3000
node scripts/generate-og.cjs
```

The script uses Playwright to render an HTML template for each tool and screenshot it. Add new entries to the `TOOLS` array in `scripts/generate-og.cjs`, then commit the new PNGs.

---

## License

MIT — see [LICENSE](./LICENSE)
