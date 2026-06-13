export type DiffLineType = 'added' | 'removed' | 'unchanged'

export interface DiffLine {
  type: DiffLineType
  line: string
  lineLeft: number | null
  lineRight: number | null
}

export interface DiffResult {
  lines: DiffLine[]
  additions: number
  deletions: number
  same: boolean
  error: string | null
}

function lcsMatrix(a: string[], b: string[]): number[][] {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i]![j]! = a[i - 1]! === b[j - 1]! ? dp[i - 1]![j - 1]! + 1 : Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!)
  return dp
}

function computeDiffLines(a: string[], b: string[]): DiffLine[] {
  const dp = lcsMatrix(a, b)
  const result: DiffLine[] = []
  let i = a.length
  let j = b.length
  let leftLine = i
  let rightLine = j

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1]! === b[j - 1]!) {
      result.unshift({ type: 'unchanged', line: a[i - 1]!, lineLeft: i, lineRight: j })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i]![j - 1]! >= dp[i - 1]![j]!)) {
      result.unshift({ type: 'added', line: b[j - 1]!, lineLeft: null, lineRight: j })
      j--
    } else {
      result.unshift({ type: 'removed', line: a[i - 1]!, lineLeft: i, lineRight: null })
      i--
    }
  }
  return result
}

export function diffJson(left: string, right: string): DiffResult {
  const leftTrim = left.trim()
  const rightTrim = right.trim()

  if (!leftTrim && !rightTrim) return { lines: [], additions: 0, deletions: 0, same: true, error: null }

  try {
    const leftFormatted = leftTrim ? JSON.stringify(JSON.parse(leftTrim), null, 2) : ''
    const rightFormatted = rightTrim ? JSON.stringify(JSON.parse(rightTrim), null, 2) : ''
    const leftLines = leftFormatted ? leftFormatted.split('\n') : []
    const rightLines = rightFormatted ? rightFormatted.split('\n') : []

    const lines = computeDiffLines(leftLines, rightLines)
    const additions = lines.filter(l => l.type === 'added').length
    const deletions = lines.filter(l => l.type === 'removed').length

    return { lines, additions, deletions, same: additions === 0 && deletions === 0, error: null }
  } catch (e) {
    return { lines: [], additions: 0, deletions: 0, same: false, error: (e as Error).message }
  }
}

export function useJsonDiff() {
  const left = ref('')
  const right = ref('')

  const result = computed<DiffResult | null>(() => {
    if (!left.value.trim() && !right.value.trim()) return null
    return diffJson(left.value, right.value)
  })

  function swap() {
    const tmp = left.value
    left.value = right.value
    right.value = tmp
  }

  function clear() {
    left.value = ''
    right.value = ''
  }

  return { left, right, result, swap, clear }
}
