import { useClipboard } from './useClipboard'

const SAMPLE_PLAIN = 'Hello\tWorld\nLine two with a "quoted" word and a \\backslash\\'
const SAMPLE_ESCAPED = escapeString(SAMPLE_PLAIN, false)

function escapeString(input: string, escapeUnicode: boolean): string {
  let out = ''
  for (const ch of input) {
    const code = ch.codePointAt(0)!
    switch (ch) {
      case '\\': out += '\\\\'; break
      case '"': out += '\\"'; break
      case '\n': out += '\\n'; break
      case '\r': out += '\\r'; break
      case '\t': out += '\\t'; break
      case '\b': out += '\\b'; break
      case '\f': out += '\\f'; break
      default:
        if (code < 0x20) {
          out += `\\u${code.toString(16).padStart(4, '0')}`
        } else if (escapeUnicode && code > 0x7e) {
          if (code > 0xffff) {
            const c = code - 0x10000
            const hi = 0xd800 + (c >> 10)
            const lo = 0xdc00 + (c & 0x3ff)
            out += `\\u${hi.toString(16).padStart(4, '0')}\\u${lo.toString(16).padStart(4, '0')}`
          } else {
            out += `\\u${code.toString(16).padStart(4, '0')}`
          }
        } else {
          out += ch
        }
    }
  }
  return out
}

function unescapeString(input: string): { output: string; error: string | null } {
  let out = ''
  let i = 0
  while (i < input.length) {
    const ch = input[i]
    if (ch !== '\\') { out += ch; i++; continue }
    if (i + 1 >= input.length) {
      return { output: '', error: 'Trailing backslash with no escape character after it.' }
    }
    const next = input[i + 1]
    switch (next) {
      case 'n': out += '\n'; i += 2; break
      case 'r': out += '\r'; i += 2; break
      case 't': out += '\t'; i += 2; break
      case 'b': out += '\b'; i += 2; break
      case 'f': out += '\f'; i += 2; break
      case '"': out += '"'; i += 2; break
      case '\'': out += '\''; i += 2; break
      case '\\': out += '\\'; i += 2; break
      case '/': out += '/'; i += 2; break
      case 'u': {
        const hex = input.slice(i + 2, i + 6)
        if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
          return { output: '', error: `Invalid \\u escape near position ${i} — needs exactly 4 hex digits.` }
        }
        out += String.fromCharCode(parseInt(hex, 16))
        i += 6
        break
      }
      default:
        return { output: '', error: `Unrecognized escape sequence "\\${next}" at position ${i}.` }
    }
  }
  return { output: out, error: null }
}

export function useStringEscape() {
  const mode = ref<'escape' | 'unescape'>('escape')
  const escapeUnicode = ref(false)
  const input = ref(SAMPLE_PLAIN)
  const error = ref<string | null>(null)

  watch(mode, (newMode, oldMode) => {
    const oldSample = oldMode === 'escape' ? SAMPLE_PLAIN : SAMPLE_ESCAPED
    if (input.value === oldSample) {
      input.value = newMode === 'escape' ? SAMPLE_PLAIN : SAMPLE_ESCAPED
    }
  })

  const output = computed(() => {
    if (!input.value) { error.value = null; return '' }
    if (mode.value === 'escape') {
      error.value = null
      return escapeString(input.value, escapeUnicode.value)
    }
    const result = unescapeString(input.value)
    error.value = result.error
    return result.output
  })

  const { copied, copy } = useClipboard(() => output.value)

  function clear() {
    input.value = ''
    error.value = null
  }

  function swap() {
    if (!output.value) return
    input.value = output.value
  }

  return { mode, escapeUnicode, input, output, error, copied, copy, clear, swap }
}
