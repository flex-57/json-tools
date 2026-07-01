import type { ComputedRef } from 'vue'

const DEFAULT_KEY = '__default__'

export interface UseClipboardOptions {
  /** Delay in ms before the "copied" indicator resets. Defaults to 2000. */
  resetDelay?: number
}

export interface UseClipboardSimple {
  copied: ComputedRef<boolean>
  isCopied: (key?: string) => boolean
  /** Writes the source's current value to the clipboard. Takes no arguments — safe to bind directly as `@click="copy"`. */
  copy: () => Promise<void>
}

export interface UseClipboardKeyed {
  copied: ComputedRef<boolean>
  isCopied: (key?: string) => boolean
  /** Writes `value` to the clipboard under an independent "copied" indicator for `key`. */
  copy: (key: string, value: string) => Promise<void>
}

/**
 * Shared clipboard-copy helper covering every shape used across the app:
 *
 * - Simple single-value case:
 *     const { copied, copy } = useClipboard(() => output.value)
 *     copy() // writes the source's current value — zero-arg, safe for `@click="copy"`
 *
 * - Multi-key case (independent "copied" indicators per item):
 *     const { isCopied, copy } = useClipboard()
 *     copy('header', headerJson)
 *     isCopied('header') // boolean
 *
 * The two call patterns are intentionally typed with different `copy` signatures
 * (via overloads) so each is safe to bind directly in a template without an
 * intermediate wrapper: the simple form never accidentally receives a click
 * event as an argument, and the keyed form always requires an explicit key.
 */
export function useClipboard(source: () => string, options?: UseClipboardOptions): UseClipboardSimple
export function useClipboard(source?: undefined, options?: UseClipboardOptions): UseClipboardKeyed
export function useClipboard(source?: () => string, options: UseClipboardOptions = {}): UseClipboardSimple | UseClipboardKeyed {
  const resetDelay = options.resetDelay ?? 2000
  const copiedKeys = ref<Set<string>>(new Set())
  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  function isCopied(key: string = DEFAULT_KEY): boolean {
    return copiedKeys.value.has(key)
  }

  function markCopied(key: string) {
    copiedKeys.value = new Set(copiedKeys.value).add(key)
    const existing = timers.get(key)
    if (existing) clearTimeout(existing)
    timers.set(key, setTimeout(() => {
      const next = new Set(copiedKeys.value)
      next.delete(key)
      copiedKeys.value = next
      timers.delete(key)
    }, resetDelay))
  }

  async function writeToClipboard(key: string, value: string | undefined): Promise<void> {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      markCopied(key)
    } catch {
      // Swallow clipboard failures — no elaborate error UI, just don't mark as copied.
    }
  }

  const copied = computed(() => isCopied(DEFAULT_KEY))

  if (source) {
    const copy = () => writeToClipboard(DEFAULT_KEY, source())
    return { copied, isCopied, copy }
  }

  const copy = (key: string, value: string) => writeToClipboard(key, value)
  return { copied, isCopied, copy }
}
