import { useClipboard } from './useClipboard'
import type { ConvertResult } from '../utils/json'

export function useConverter<R extends ConvertResult>(sample: string, convert: (input: string) => R) {
  const input = ref(sample)
  const result = computed(() => convert(input.value))

  const output = computed(() => result.value.output)
  const error = computed(() => (result.value.error && result.value.error !== 'empty') ? result.value.error : null)
  const errorLine = computed(() => result.value.line ?? null)
  const errorColumn = computed(() => result.value.column ?? null)
  const errorTip = computed(() => result.value.tip ?? null)

  const { copied, copy } = useClipboard(() => output.value)

  function clear() { input.value = '' }

  return { input, result, output, error, errorLine, errorColumn, errorTip, copied, copy, clear }
}
