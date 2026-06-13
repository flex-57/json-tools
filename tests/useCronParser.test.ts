import { describe, it, expect } from 'vitest'
import { useCronParser } from '../app/composables/useCronParser'

describe('useCronParser — validation', () => {
  it('accepts a standard 5-field expression', () => {
    const { expression, error } = useCronParser()
    expression.value = '0 9 * * 1-5'
    expect(error.value).toBeNull()
  })

  it('accepts wildcard-only expression', () => {
    const { expression, error } = useCronParser()
    expression.value = '* * * * *'
    expect(error.value).toBeNull()
  })

  it('accepts step expression', () => {
    const { expression, error } = useCronParser()
    expression.value = '*/15 */2 * * *'
    expect(error.value).toBeNull()
  })

  it('accepts range expression', () => {
    const { expression, error } = useCronParser()
    expression.value = '0 9-17 * * 1-5'
    expect(error.value).toBeNull()
  })

  it('accepts list expression', () => {
    const { expression, error } = useCronParser()
    expression.value = '0 8,12,18 * * *'
    expect(error.value).toBeNull()
  })

  it('rejects wrong field count', () => {
    const { expression, error } = useCronParser()
    expression.value = '0 9 * *'
    expect(error.value).not.toBeNull()
  })

  it('rejects minute > 59', () => {
    const { expression, error } = useCronParser()
    expression.value = '60 9 * * *'
    expect(error.value).not.toBeNull()
  })

  it('rejects hour > 23', () => {
    const { expression, error } = useCronParser()
    expression.value = '0 24 * * *'
    expect(error.value).not.toBeNull()
  })

  it('rejects invalid step (zero)', () => {
    const { expression, error } = useCronParser()
    expression.value = '*/0 * * * *'
    expect(error.value).not.toBeNull()
  })
})

describe('useCronParser — special expressions', () => {
  it('expands @daily', () => {
    const { expression, error, description } = useCronParser()
    expression.value = '@daily'
    expect(error.value).toBeNull()
    expect(description.value).toBeTruthy()
  })

  it('expands @hourly', () => {
    const { expression, error } = useCronParser()
    expression.value = '@hourly'
    expect(error.value).toBeNull()
  })

  it('expands @weekly', () => {
    const { expression, error } = useCronParser()
    expression.value = '@weekly'
    expect(error.value).toBeNull()
  })

  it('expands @monthly', () => {
    const { expression, error } = useCronParser()
    expression.value = '@monthly'
    expect(error.value).toBeNull()
  })

  it('expands @annually as @yearly', () => {
    const { expression, error } = useCronParser()
    expression.value = '@annually'
    expect(error.value).toBeNull()
  })
})

describe('useCronParser — description', () => {
  it('produces a non-empty description for valid expression', () => {
    const { expression, description } = useCronParser()
    expression.value = '0 9 * * 1-5'
    expect(typeof description.value).toBe('string')
    expect(description.value!.length).toBeGreaterThan(0)
  })

  it('description starts with uppercase letter', () => {
    const { expression, description } = useCronParser()
    expression.value = '30 8 * * *'
    const d = description.value!
    expect(d[0]).toBe(d[0]!.toUpperCase())
  })

  it('every-minute expression describes every minute', () => {
    const { expression, description } = useCronParser()
    expression.value = '* * * * *'
    expect(description.value!.toLowerCase()).toContain('every minute')
  })

  it('returns null description on invalid expression', () => {
    const { expression, description } = useCronParser()
    expression.value = 'not valid cron'
    expect(description.value).toBeNull()
  })
})

describe('useCronParser — nextExecutions', () => {
  it('returns 5 next dates for every-minute cron', () => {
    const { expression, nextExecutions } = useCronParser()
    expression.value = '* * * * *'
    expect(nextExecutions.value).toHaveLength(5)
  })

  it('all next executions are in the future', () => {
    const { expression, nextExecutions } = useCronParser()
    expression.value = '* * * * *'
    const now = Date.now()
    nextExecutions.value.forEach(d => expect(d.getTime()).toBeGreaterThan(now))
  })

  it('executions are sorted ascending', () => {
    const { expression, nextExecutions } = useCronParser()
    expression.value = '* * * * *'
    const times = nextExecutions.value.map(d => d.getTime())
    for (let i = 1; i < times.length; i++) {
      expect(times[i]).toBeGreaterThan(times[i - 1]!)
    }
  })

  it('returns empty list on invalid expression', () => {
    const { expression, nextExecutions } = useCronParser()
    expression.value = 'bad'
    expect(nextExecutions.value).toHaveLength(0)
  })
})
