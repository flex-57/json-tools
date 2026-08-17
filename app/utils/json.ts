function offsetToLineColumn(input: string, offset: number): { line: number; column: number } {
  let line = 1
  let column = 1
  for (let i = 0; i < offset && i < input.length; i++) {
    if (input[i] === '\n') {
      line++
      column = 1
    } else {
      column++
    }
  }
  return { line, column }
}

function extractOffset(message: string, str: string): number | null {
  const positionMatch = message.match(/position (\d+)/)
  if (positionMatch) return Number(positionMatch[1])
  // "Unexpected end of JSON input" has no position — truncated JSON always fails at the end.
  if (/unexpected end of json input/i.test(message)) return str.length
  return null
}

// V8 gives a numeric position for most errors, but not all — e.g. a trailing
// comma inside an array ("Unexpected token ']', \"...\" is not valid JSON")
// only comes with a text snippet, no offset. Where we have an offset, inspect
// the surrounding characters directly (reliable). Where we only have the
// message text, pattern-match V8's own wording (works without a position, but
// can't point at a line — the caller degrades to a message-only banner).
// This is inherently V8-specific: Firefox/Safari phrase these differently, so
// non-Chromium browsers just fall through to `tip: null` — safe, not wrong.
function buildTip(str: string, offset: number | null, message: string): string | null {
  if (offset !== null) {
    let i = offset - 1
    while (i >= 0 && /\s/.test(str[i]!)) i--
    if (str[i] === ',' && (str[offset] === '}' || str[offset] === ']')) {
      return `Trailing comma before "${str[offset]}" — remove the comma after the last item.`
    }
    if (str[offset] === '\'' && /unexpected token|expected property name/i.test(message)) {
      return 'JSON requires double quotes — replace \' with ".'
    }
  }

  const tokenMatch = message.match(/^Unexpected token '(.)'/)
  if (tokenMatch) {
    const token = tokenMatch[1]
    if (token === ']' || token === '}') return `Unexpected "${token}" — check for a trailing comma before it, or a missing item.`
    if (token === '\'') return 'JSON requires double quotes — replace \' with ".'
  }
  if (/Expected (double-quoted )?property name/i.test(message)) {
    return 'Object keys must be quoted — e.g. "key" not key.'
  }
  if (/unexpected end of json input/i.test(message)) {
    return 'The document is cut off — check for a missing closing "}" or "]".'
  }
  if (/Unexpected non-whitespace character after JSON/i.test(message)) {
    return 'Extra content after the JSON value — check for a duplicate object or stray text.'
  }
  return null
}

export interface ConvertResult {
  output: string
  error: string | null
  line?: number | null
  column?: number | null
  tip?: string | null
}

export function safeJsonParse<T = unknown>(str: string):
  | { data: T; error: null; line?: undefined; column?: undefined; tip?: undefined }
  | { data: null; error: string; line: number | null; column: number | null; tip: string | null } {
  try {
    return { data: JSON.parse(str) as T, error: null }
  } catch (e) {
    const message = (e as Error).message
    const offset = extractOffset(message, str)
    const tip = buildTip(str, offset, message)

    // Recent V8 already appends "(line X column Y)" to most JSON syntax
    // errors — trust it rather than recompute, just extract the numbers.
    const lcMatch = message.match(/\(line (\d+) column (\d+)\)/i)
    if (lcMatch) {
      return { data: null, error: message, line: Number(lcMatch[1]), column: Number(lcMatch[2]), tip }
    }

    if (offset === null) return { data: null, error: message, line: null, column: null, tip }

    const { line, column } = offsetToLineColumn(str, offset)
    return { data: null, error: `${message} (Line ${line}, Column ${column})`, line, column, tip }
  }
}
