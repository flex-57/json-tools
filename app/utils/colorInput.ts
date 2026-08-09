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
