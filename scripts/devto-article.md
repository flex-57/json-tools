# I Wanted to Practice Nuxt. I Accidentally Built 28 Developer Tools.

> Every single one runs without a server. No signup. No data sent anywhere. Here's how — and why that constraint made everything harder.

---

## Why I started

I kept switching between random online tools to format JSON, decode JWTs, convert between formats. Most of them showed ads everywhere, asked me to sign up, or sent my data to a server I knew nothing about.

So I built my own formatter to practice **Nuxt 4** — and then couldn't stop adding things.

---

## Why client-side only

Every tool on [jsontools.space](https://jsontools.space) runs entirely in your browser. This was a constraint I set from day one, and it shaped every technical decision:

- **No signup** — open a tool, use it, close it
- **No server** — nothing to maintain, nothing to pay for, nothing that can leak your data
- **Your data stays in your browser.** We don't see it, store it, or touch it. We use Google Analytics for aggregate traffic stats — but what you paste into the tools never leaves your machine.

The tradeoff: some things that would be trivial server-side become interesting puzzles client-side.

---

## Tech stack

| | |
|---|---|
| **Framework** | Nuxt 4 + Vue 3 + TypeScript |
| **Rendering** | Static Site Generation (SSG) |
| **Hosting** | Vercel |
| **Editors** | CodeMirror 6 |
| **UI** | No component framework — hand-crafted scoped CSS |
| **Backend** | None |

---

## Interesting challenges

### 1. Syntax highlighting across 7 languages

I started with a single `JsonEditor.vue` component using CodeMirror with `@codemirror/lang-json`. Fine for JSON tools. But when I added XML converters, YAML converters, a SQL formatter, and a TypeScript generator, each needed its own language extension.

The solution: a `lang` prop with **dynamic imports** so Vite code-splits each language — the SQL formatter doesn't load the YAML parser, and vice versa.

```ts
async function getLangExtension() {
  switch (props.lang ?? 'json') {
    case 'typescript': {
      const { javascript } = await import('@codemirror/lang-javascript')
      return javascript({ typescript: true })
    }
    case 'xml': {
      const { xml } = await import('@codemirror/lang-xml')
      return xml()
    }
    // yaml, sql, javascript...
    default: {
      const { json } = await import('@codemirror/lang-json')
      return json()
    }
  }
}
```

There was a subtler bug underneath. In Nuxt, **child components mount before the parent layout**. My dark mode state (`isDark`) was initialized to `false` and only set correctly when the layout's `onMounted` called `init()`. Every editor was flashing light-mode colors before switching to dark — no syntax colors at all for a split second.

The fix was separating the `HighlightStyle` into its own CodeMirror `Compartment`, independent from the visual theme:

```ts
const themeConfig = new Compartment()     // background, gutters, cursor
const highlightConfig = new Compartment() // syntax token colors

watch(isDark, (dark) => {
  view?.dispatch({
    effects: [
      highlightConfig.reconfigure(
        syntaxHighlighting(dark ? oneDarkHighlightStyle : defaultHighlightStyle)
      ),
      themeConfig.reconfigure(
        dark ? [oneDarkTheme, darkOverride] : lightTheme
      ),
    ],
  })
})
```

---

### 2. JSON → TypeScript code generation

Generating TypeScript interfaces from arbitrary JSON isn't trivial. Nested objects, arrays of mixed types, nullable fields, name collisions — you need to traverse the entire tree recursively and infer a type signature.

```ts
// Input:
{ "user": { "name": "Alice", "scores": [98, 100] } }

// Output:
interface Root {
  user: User
}
interface User {
  name: string
  scores: number[]
}
```

The tool also generates **Zod schemas** from the same input, which required a separate traversal strategy since Zod's API is compositional rather than declarative.

---

### 3. SEO on a static tool site

28 tools, each needing unique meta tags, Open Graph images, and structured data — without a CMS. Everything lives in the Vue pages themselves with `useSeoMeta()` and a generated sitemap.

The FAQ page uses **JSON-LD `FAQPage` schema**, which lets Google display accordion answers directly in search results. Worth the 20 minutes it took to add.

---

## The tools

*(image)*

28 tools across 5 categories:

- 🗂️ **JSON** — formatter, diff, tree viewer, schema generator, JSON → TypeScript/Zod
- 🔄 **Converters** — CSV, XML, YAML, Excel ↔ JSON
- 📝 **Text & Code** — minifier, SQL formatter, Base64, URL encode, text case
- 🔒 **Security** — JWT decoder/generator, hash generator, UUID, password generator
- 🛠️ **Dev Utils** — regex tester, cron parser, timestamp converter, color picker, number base

Everything is free, no account required.

---

## What's next

A few things I want to add:

- TOML support
- `curl` → `fetch` converter
- GraphQL formatter

---

The repo is open source if you want to take a look or contribute:
👉 **[github.com/flex-57/json-tools](https://github.com/flex-57/json-tools)**

Try it at **[jsontools.space](https://jsontools.space)**
