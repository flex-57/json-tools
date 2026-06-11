function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export interface RegexMatch {
  index: number
  value: string
  groups: Record<string, string | undefined> | null
  captures: (string | undefined)[]
}

export function useRegexTester() {
  const pattern = ref('')
  const flags   = ref('g')
  const input   = ref('')

  const regexError = computed((): string | null => {
    if (!pattern.value) return null
    try { new RegExp(pattern.value, flags.value); return null }
    catch (e) { return (e as Error).message }
  })

  const regex = computed((): RegExp | null => {
    if (!pattern.value || regexError.value) return null
    const f = flags.value.includes('g') ? flags.value : flags.value + 'g'
    return new RegExp(pattern.value, f)
  })

  const matches = computed((): RegexMatch[] => {
    if (!regex.value || !input.value) return []
    try {
      return [...input.value.matchAll(regex.value)].map(m => ({
        index:    m.index!,
        value:    m[0],
        groups:   m.groups ?? null,
        captures: Array.from(m).slice(1) as (string | undefined)[],
      }))
    } catch { return [] }
  })

  const highlightedHtml = computed((): string => {
    if (!input.value) return ''
    if (!regex.value || regexError.value) return escapeHtml(input.value)
    try {
      let result = ''
      let last = 0
      for (const m of matches.value) {
        if (m.value.length === 0) continue
        result += escapeHtml(input.value.slice(last, m.index))
        result += `<mark class="rx-match">${escapeHtml(m.value)}</mark>`
        last = m.index + m.value.length
      }
      result += escapeHtml(input.value.slice(last))
      return result
    } catch { return escapeHtml(input.value) }
  })

  function clear() {
    pattern.value = ''
    input.value   = ''
  }

  return { pattern, flags, input, regexError, regex, matches, highlightedHtml, clear }
}
