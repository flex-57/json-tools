const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DOW_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

const SPECIAL: Record<string, string> = {
  '@yearly': '0 0 1 1 *', '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *', '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *', '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
}

function parseField(expr: string, min: number, max: number): number[] | null {
  const result = new Set<number>()
  for (const part of expr.split(',')) {
    if (part === '*') {
      for (let i = min; i <= max; i++) result.add(i)
    } else if (part.includes('/')) {
      const [r, s] = part.split('/')
      const step = parseInt(s, 10)
      if (isNaN(step) || step < 1) return null
      const base = r === '*'
        ? Array.from({ length: max - min + 1 }, (_, i) => min + i)
        : parseRange(r, min, max)
      if (!base) return null
      base.forEach((v, i) => { if (i % step === 0) result.add(v) })
    } else if (part.includes('-')) {
      const r = parseRange(part, min, max)
      if (!r) return null
      r.forEach(v => result.add(v))
    } else {
      const n = parseInt(part, 10)
      if (isNaN(n) || n < min || n > max) return null
      result.add(n)
    }
  }
  return [...result].sort((a, b) => a - b)
}

function parseRange(expr: string, min: number, max: number): number[] | null {
  const [a, b] = expr.split('-').map(Number)
  if (isNaN(a) || isNaN(b) || a < min || b > max || a > b) return null
  return Array.from({ length: b - a + 1 }, (_, i) => a + i)
}

function pad2(n: number) { return String(n).padStart(2, '0') }

function describeCron(expr: string): string {
  const [min, hr, dom, mon, dow] = expr.split(/\s+/)

  const timePart = (): string => {
    if (hr === '*' && min === '*') return 'every minute'
    if (hr === '*') {
      if (min.startsWith('*/')) return `every ${min.slice(2)} minutes`
      return `at minute ${min} of every hour`
    }
    if (min === '*') return `every minute past ${hr.startsWith('*/') ? `every ${hr.slice(2)} hours` : `${hr}:xx`}`
    const h = parseInt(hr.split(',')[0], 10)
    const m = parseInt(min.split(',')[0], 10)
    return `at ${pad2(h)}:${pad2(m)}`
  }

  const dowPart = (): string => {
    if (dow === '*') return ''
    if (dow.includes('-')) {
      const [a, b] = dow.split('-').map(Number)
      return `${DOW_NAMES[a]} through ${DOW_NAMES[b === 7 ? 0 : b]}`
    }
    return dow.split(',').map(d => DOW_NAMES[+d === 7 ? 0 : +d]).join(', ')
  }

  const domPart = (): string => {
    if (dom === '*') return ''
    if (dom.includes('-')) { const [a, b] = dom.split('-'); return `day ${a}–${b}` }
    return `day ${dom.split(',').join(', ')}`
  }

  const monPart = (): string => {
    if (mon === '*') return ''
    if (mon.includes('-')) {
      const [a, b] = mon.split('-').map(Number)
      return `${MONTH_NAMES[a-1]} through ${MONTH_NAMES[b-1]}`
    }
    return mon.split(',').map(m => MONTH_NAMES[+m - 1]).join(', ')
  }

  const parts: string[] = [timePart()]
  const dp = domPart(), wp = dowPart(), mp = monPart()

  if (dp && wp) parts.push(`on ${dp} and ${wp}`)
  else if (dp) parts.push(`on ${dp} of every month`)
  else if (wp) parts.push(`on ${wp}`)

  if (mp) parts.push(`in ${mp}`)

  const result = parts.join(', ')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export function useCronParser() {
  const expression = ref('0 9 * * 1-5')

  const normalised = computed(() => SPECIAL[expression.value.trim()] ?? expression.value.trim())

  const error = computed((): string | null => {
    const parts = normalised.value.split(/\s+/)
    if (parts.length !== 5) return 'Expected 5 fields: minute hour day-of-month month day-of-week'
    const [min, hr, dom, mon, dow] = parts
    if (!parseField(min, 0, 59)) return 'Invalid minute field (0–59)'
    if (!parseField(hr, 0, 23))  return 'Invalid hour field (0–23)'
    if (!parseField(dom, 1, 31)) return 'Invalid day-of-month field (1–31)'
    if (!parseField(mon, 1, 12)) return 'Invalid month field (1–12)'
    if (!parseField(dow, 0, 7))  return 'Invalid day-of-week field (0–7)'
    return null
  })

  const description = computed((): string | null => {
    if (error.value) return null
    return describeCron(normalised.value)
  })

  const nextExecutions = computed((): Date[] => {
    if (error.value) return []
    const [minE, hrE, domE, monE, dowE] = normalised.value.split(/\s+/)

    const minuteSet = new Set(parseField(minE, 0, 59)!)
    const hourSet   = new Set(parseField(hrE, 0, 23)!)
    const domSet    = new Set(parseField(domE, 1, 31)!)
    const monthSet  = new Set(parseField(monE, 1, 12)!)
    const dowSet    = new Set(parseField(dowE, 0, 7)!.map(d => d === 7 ? 0 : d))

    const domRestricted = domE !== '*'
    const dowRestricted = dowE !== '*'

    const results: Date[] = []
    const cur = new Date()
    cur.setSeconds(0, 0)
    cur.setMinutes(cur.getMinutes() + 1)

    const limit = new Date(cur)
    limit.setFullYear(limit.getFullYear() + 4)

    while (results.length < 5 && cur < limit) {
      const dayMatch = domRestricted && dowRestricted
        ? domSet.has(cur.getDate()) || dowSet.has(cur.getDay())
        : domRestricted ? domSet.has(cur.getDate())
        : dowRestricted ? dowSet.has(cur.getDay())
        : true

      if (
        monthSet.has(cur.getMonth() + 1) && dayMatch &&
        hourSet.has(cur.getHours()) && minuteSet.has(cur.getMinutes())
      ) {
        results.push(new Date(cur))
      }
      cur.setMinutes(cur.getMinutes() + 1)
    }
    return results
  })

  return { expression, error, description, nextExecutions }
}
