import { useClipboard } from './useClipboard'
import { marked } from 'marked'

const SAMPLE = `# Markdown Preview

Welcome to the **Markdown Preview** tool. Paste or type any Markdown on the left and see the result instantly.

## Features

- Live preview as you type
- Supports **bold**, *italic*, \`inline code\`, and [links](https://jsontools.space)
- Tables, code blocks, and blockquotes

## Code Example

\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`
console.log(greet('World'))
\`\`\`

## Table

| Name  | Type   | Required |
|-------|--------|----------|
| id    | number | yes      |
| name  | string | yes      |
| email | string | no       |

> **Tip:** Your content stays in the browser — nothing is sent to a server.`

let purify: typeof import('dompurify')['default'] | null = null

export function useMarkdown() {
  const input  = ref(SAMPLE)
  const html   = ref('')

  async function render() {
    if (!import.meta.client) return
    if (!purify) {
      const mod = await import('dompurify')
      purify = mod.default
    }
    if (!input.value.trim()) { html.value = ''; return }
    const raw = marked.parse(input.value, { async: false }) as string
    html.value = purify.sanitize(raw)
  }

  useUrlInput(input, render)

  let timer: ReturnType<typeof setTimeout> | null = null
  watch(input, () => {
    if (!import.meta.client) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(render, 150)
  })

  onMounted(render)

  const { copied, copy } = useClipboard(() => html.value)

  function clear() { input.value = ''; html.value = '' }

  return { input, html, copied, copy, clear }
}
