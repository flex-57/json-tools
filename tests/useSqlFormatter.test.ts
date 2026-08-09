import { describe, it, expect } from 'vitest'
import { formatSql } from '../app/composables/useSqlFormatter'

describe('formatSql', () => {
  it('formats SQL with uppercase keywords by default', async () => {
    const r = await formatSql('select a from t', { dialect: 'sql', uppercase: true, indentSize: 2 })
    expect(r.error).toBeNull()
    expect(r.output).toContain('SELECT')
    expect(r.output).toContain('FROM')
  })

  it('preserves keyword case when uppercase is false', async () => {
    const r = await formatSql('select a from t', { dialect: 'sql', uppercase: false, indentSize: 2 })
    expect(r.error).toBeNull()
    expect(r.output).toContain('select')
  })

  it('indents with the requested number of spaces', async () => {
    const r = await formatSql('select a from t', { dialect: 'sql', uppercase: true, indentSize: 4 })
    expect(r.error).toBeNull()
    expect(r.output).toContain('\n    a')
  })

  it('uses a real tab character when indentSize is 1 ("1 tab")', async () => {
    const r = await formatSql('select a from t', { dialect: 'sql', uppercase: true, indentSize: 1 })
    expect(r.error).toBeNull()
    expect(r.output).toContain('\n\ta')
    expect(r.output).not.toContain('\n a')
  })

  it('returns empty output with no error for empty input', async () => {
    const r = await formatSql('', { dialect: 'sql', uppercase: true, indentSize: 2 })
    expect(r.error).toBeNull()
    expect(r.output).toBe('')
  })

  it('returns an error message for invalid SQL', async () => {
    const r = await formatSql('select * from t where )))', { dialect: 'sql', uppercase: true, indentSize: 2 })
    expect(r.error).not.toBeNull()
    expect(r.output).toBe('')
  })
})
