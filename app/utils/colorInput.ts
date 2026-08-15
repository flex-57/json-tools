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
