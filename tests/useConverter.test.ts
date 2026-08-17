import { describe, it, expect } from 'vitest'
import { useConverter } from '../app/composables/useConverter'
import type { ConvertResult } from '../app/utils/json'

function fakeConvert(input: string): ConvertResult {
  if (!input.trim()) return { output: '', error: 'empty' }
  if (input === 'bad') return { output: '', error: 'boom', line: 3, column: 5, tip: 'try again' }
  return { output: input.toUpperCase(), error: null }
}

describe('useConverter', () => {
  it('recomputes when a closed-over option ref changes', () => {
    const suffix = ref('!')
    const { input, output } = useConverter('hello', s => ({ output: s + suffix.value, error: null }))
    expect(output.value).toBe('hello!')
    suffix.value = '?'
    expect(output.value).toBe('hello?')
    input.value = 'hi'
    expect(output.value).toBe('hi?')
  })

  it('filters the "empty" sentinel out of error but lets real errors through', () => {
    const { input, error, errorLine, errorColumn, errorTip, output } = useConverter('', fakeConvert)
    expect(error.value).toBeNull()
    expect(output.value).toBe('')
    input.value = 'bad'
    expect(error.value).toBe('boom')
    expect(errorLine.value).toBe(3)
    expect(errorColumn.value).toBe(5)
    expect(errorTip.value).toBe('try again')
  })

  it('clear() empties the input', () => {
    const { input, clear } = useConverter('hello', fakeConvert)
    expect(input.value).toBe('hello')
    clear()
    expect(input.value).toBe('')
  })
})
