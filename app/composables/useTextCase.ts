export type CaseKey = 'camel' | 'pascal' | 'snake' | 'screaming' | 'kebab' | 'title' | 'upper' | 'lower' | 'dot'

interface CaseResult {
  key: CaseKey
  label: string
  example: string
  value: string
}

function toWords(input: string): string[] {
  if (!input.trim()) return []
  return input
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[\s_\-./\\|:\n\r]+/)
    .map(w => w.trim())
    .filter(Boolean)
    .map(w => w.toLowerCase())
}

function cap(w: string) { return w.charAt(0).toUpperCase() + w.slice(1) }

const CASES: { key: CaseKey; label: string; example: string; convert: (ws: string[]) => string }[] = [
  { key: 'camel',     label: 'camelCase',           example: 'helloWorldFoo',   convert: ws => ws[0] + ws.slice(1).map(cap).join('') },
  { key: 'pascal',    label: 'PascalCase',           example: 'HelloWorldFoo',   convert: ws => ws.map(cap).join('') },
  { key: 'snake',     label: 'snake_case',           example: 'hello_world_foo', convert: ws => ws.join('_') },
  { key: 'screaming', label: 'SCREAMING_SNAKE_CASE', example: 'HELLO_WORLD_FOO', convert: ws => ws.join('_').toUpperCase() },
  { key: 'kebab',     label: 'kebab-case',           example: 'hello-world-foo', convert: ws => ws.join('-') },
  { key: 'title',     label: 'Title Case',           example: 'Hello World Foo', convert: ws => ws.map(cap).join(' ') },
  { key: 'upper',     label: 'UPPERCASE',            example: 'HELLO WORLD FOO', convert: ws => ws.join(' ').toUpperCase() },
  { key: 'lower',     label: 'lowercase',            example: 'hello world foo', convert: ws => ws.join(' ') },
  { key: 'dot',       label: 'dot.case',             example: 'hello.world.foo', convert: ws => ws.join('.') },
]

export function useTextCase() {
  const input = ref('hello world example')
  const copiedKey = ref<CaseKey | null>(null)

  const results = computed<CaseResult[]>(() => {
    const words = toWords(input.value)
    return CASES.map(c => ({
      key: c.key,
      label: c.label,
      example: c.example,
      value: words.length ? c.convert(words) : '',
    }))
  })

  const wordCount = computed(() => toWords(input.value).length)

  async function copy(key: CaseKey, value: string) {
    if (!value) return
    await navigator.clipboard.writeText(value)
    copiedKey.value = key
    setTimeout(() => { copiedKey.value = null }, 2000)
  }

  function clear() { input.value = '' }

  return { input, results, wordCount, copiedKey, copy, clear }
}
