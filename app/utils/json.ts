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

export function safeJsonParse<T = unknown>(str: string): { data: T; error: null } | { data: null; error: string } {
  try {
    return { data: JSON.parse(str) as T, error: null }
  } catch (e) {
    const message = (e as Error).message

    // Recent V8 already appends "(line X column Y)" to most JSON syntax
    // errors — nothing to add there. The gaps are messages with no position
    // at all: "Unexpected end of JSON input" (truncated JSON, always fails
    // right at the end of the string) and a few token errors that omit it.
    if (/\(line \d+ column \d+\)/.test(message)) {
      return { data: null, error: message }
    }

    const positionMatch = message.match(/position (\d+)/)
    const offset = positionMatch ? Number(positionMatch[1]) : /unexpected end of json input/i.test(message) ? str.length : null
    if (offset === null) return { data: null, error: message }

    const { line, column } = offsetToLineColumn(str, offset)
    return { data: null, error: `${message} (Line ${line}, Column ${column})` }
  }
}
