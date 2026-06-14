export type BaseKey = 'bin' | 'oct' | 'dec' | 'hex'

interface BaseResult {
  key: BaseKey
  label: string
  display: string
  raw: string
}

function parseInput(raw: string): bigint | null {
  const s = raw.trim().replace(/[\s_]/g, '')
  if (!s || s === '-') return null
  try {
    const neg = s.startsWith('-')
    const abs = neg ? s.slice(1) : s
    let n: bigint
    if (/^0x/i.test(abs))      n = BigInt('0x' + (abs.slice(2) || '0'))
    else if (/^0b/i.test(abs)) n = BigInt('0b' + (abs.slice(2) || '0'))
    else if (/^0o/i.test(abs)) n = BigInt('0o' + (abs.slice(2) || '0'))
    else                       n = BigInt(abs)
    return neg ? -n : n
  } catch {
    return null
  }
}

function groupBin(s: string): string {
  const pad = s.length % 4 === 0 ? s : s.padStart(s.length + (4 - s.length % 4), '0')
  return pad.replace(/(.{4})(?!$)/g, '$1 ')
}

function groupHex(s: string): string {
  const pad = s.length % 2 === 0 ? s : '0' + s
  return pad.replace(/(.{2})(?!$)/g, '$1 ')
}

function groupDec(s: string): string {
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, '_')
}

export function useNumberBase() {
  const input = ref('255')
  const copiedKey = ref<BaseKey | null>(null)

  const parsed = computed(() => parseInput(input.value))

  const error = computed(() => {
    if (!input.value.trim()) return null
    return parsed.value === null ? 'Invalid number' : null
  })

  const detectedBase = computed(() => {
    const s = input.value.trim().replace(/[\s_]/g, '').replace(/^-/, '')
    if (/^0x/i.test(s)) return 'Hexadecimal'
    if (/^0b/i.test(s)) return 'Binary'
    if (/^0o/i.test(s)) return 'Octal'
    if (s) return 'Decimal'
    return null
  })

  const results = computed<BaseResult[]>(() => {
    const n = parsed.value
    if (n === null) return []
    const neg = n < 0n
    const abs = neg ? -n : n
    const sign = neg ? '-' : ''

    const binStr = abs.toString(2)
    const octStr = abs.toString(8)
    const decStr = abs.toString(10)
    const hexStr = abs.toString(16).toUpperCase()

    return [
      {
        key: 'bin',
        label: 'Binary (base 2)',
        display: sign + groupBin(binStr),
        raw: sign + '0b' + binStr,
      },
      {
        key: 'oct',
        label: 'Octal (base 8)',
        display: sign + '0o' + octStr,
        raw: sign + '0o' + octStr,
      },
      {
        key: 'dec',
        label: 'Decimal (base 10)',
        display: sign + groupDec(decStr),
        raw: sign + decStr,
      },
      {
        key: 'hex',
        label: 'Hexadecimal (base 16)',
        display: sign + '0x' + groupHex(hexStr),
        raw: sign + '0x' + hexStr,
      },
    ]
  })

  const bitInfo = computed(() => {
    const n = parsed.value
    if (n === null) return null
    const abs = n < 0n ? -n : n
    if (abs === 0n) return '1 bit'
    const bits = abs.toString(2).length
    const bytes = Math.ceil(bits / 8)
    return bits + ' bit' + (bits !== 1 ? 's' : '') + ' · ' + bytes + ' byte' + (bytes !== 1 ? 's' : '')
  })

  async function copy(key: BaseKey, raw: string) {
    if (!raw) return
    await navigator.clipboard.writeText(raw)
    copiedKey.value = key
    setTimeout(() => { copiedKey.value = null }, 2000)
  }

  function clear() { input.value = '' }

  return { input, results, parsed, error, detectedBase, bitInfo, copiedKey, copy, clear }
}
