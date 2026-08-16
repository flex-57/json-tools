// Live-formats a hex color text field as you type: strips anything that
// isn't a hex digit, keeps a leading # if one was typed, and caps the
// digits at 8, the longest a hex color ever is (#RRGGBBAA). There's no
// valid hex color past that length, so letting a field keep growing
// (e.g. #388ce065464) only produces a value nothing downstream would
// actually accept once you leave the field.
export function sanitizeHexInput(raw: string): string {
  const hadHash = raw.includes('#')
  const digits = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 8)
  return (hadHash ? '#' : '') + digits
}

// Native <input type="color"> only ever accepts/returns a plain 6-digit
// #RRGGBB — no 3-digit shorthand, no 8-digit alpha. Binding it directly to a
// value that can hold either (as the hex text field's sanitizeHexInput does)
// makes the swatch render black on anything the picker itself can't represent.
// Derives a value the native picker can always safely display.
export function toSixDigitHex(hex: string): string {
  const digits = hex.replace('#', '')
  if (digits.length === 3) return '#' + digits.split('').map(d => d + d).join('')
  if (digits.length >= 6) return '#' + digits.slice(0, 6)
  return '#000000'
}

// box-shadow.vue's shadow-layer color field accepts any CSS color string
// (rgba() by default from presets, or anything typed in), not just hex — but
// the native color picker can only ever display a plain #RRGGBB. Parses hex
// and rgb()/rgba() (the formats presets and most typed input actually use)
// with plain string matching, not the DOM (e.g. getComputedStyle) — a
// DOM-based approach only resolves client-side and would desync from the
// server-rendered value, causing a hydration mismatch. Anything else
// unparseable (hsl(), named colors) falls back to a neutral default for the
// swatch only; the stored color value itself is never touched by this.
export function cssColorToSixDigitHex(color: string): string {
  const trimmed = color.trim()
  if (trimmed.startsWith('#')) return toSixDigitHex(trimmed)
  const rgbMatch = trimmed.match(/rgba?\(\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)/i)
  if (rgbMatch) {
    const [r, g, b] = [rgbMatch[1]!, rgbMatch[2]!, rgbMatch[3]!].map(n => Math.max(0, Math.min(255, Number(n))))
    return '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('')
  }
  return '#000000'
}
