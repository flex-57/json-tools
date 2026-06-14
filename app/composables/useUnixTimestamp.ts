export function useUnixTimestamp() {
  const input = ref('')
  const copied = ref<string | null>(null)
  const _tick = ref(Date.now())

  const parsed = computed((): Date | null => {
    const raw = input.value.trim()
    if (!raw) return null
    if (/^-?\d+$/.test(raw)) {
      const n = parseInt(raw, 10)
      const ms = Math.abs(n) > 1e12 ? n : n * 1000
      const d = new Date(ms)
      return isNaN(d.getTime()) ? null : d
    }
    const d = new Date(raw)
    return isNaN(d.getTime()) ? null : d
  })

  const error = computed((): string | null => {
    if (!input.value.trim()) return null
    return parsed.value ? null : 'Unrecognized format — try a Unix timestamp or ISO 8601 date'
  })

  const unix   = computed(() => parsed.value ? Math.floor(parsed.value.getTime() / 1000) : null)
  const unixMs = computed(() => parsed.value ? parsed.value.getTime() : null)
  const iso    = computed(() => parsed.value?.toISOString() ?? null)
  const utc    = computed(() => parsed.value?.toUTCString() ?? null)
  const local  = computed(() =>
    parsed.value?.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' }) ?? null
  )

  const relative = computed((): string | null => {
    if (!parsed.value) return null
    const diff = (parsed.value.getTime() - _tick.value) / 1000
    const abs  = Math.abs(diff)
    const past = diff < 0
    const fmt  = (n: number, unit: string) =>
      past ? `${n} ${unit}${n > 1 ? 's' : ''} ago` : `in ${n} ${unit}${n > 1 ? 's' : ''}`
    if (abs < 45)           return past ? 'just now' : 'in a few seconds'
    if (abs < 3600)         return fmt(Math.round(abs / 60), 'minute')
    if (abs < 86400)        return fmt(Math.round(abs / 3600), 'hour')
    if (abs < 86400 * 30)   return fmt(Math.round(abs / 86400), 'day')
    if (abs < 86400 * 365)  return fmt(Math.round(abs / (86400 * 30)), 'month')
    return fmt(Math.round(abs / (86400 * 365)), 'year')
  })

  function setNow() {
    input.value = String(Math.floor(Date.now() / 1000))
  }

  function clear() {
    input.value = ''
    copied.value = null
  }

  function refresh() {
    _tick.value = Date.now()
  }

  async function copyValue(value: string, key: string) {
    await navigator.clipboard.writeText(value)
    copied.value = key
    setTimeout(() => { copied.value = null }, 2000)
  }

  onMounted(setNow)

  return { input, parsed, error, unix, unixMs, iso, utc, local, relative, copied, setNow, clear, refresh, copyValue }
}
