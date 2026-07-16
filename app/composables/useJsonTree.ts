import { safeJsonParse } from '../utils/json'

export type NodeType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object'

export interface TreeNode {
  id: string
  key: string
  path: string
  type: NodeType
  value?: string | number | boolean | null
  children: TreeNode[]
  size: number
}

// Hard cap on total nodes built, so a huge/flat payload can't render tens of
// thousands of DOM rows and freeze the tab. `node.size` still holds the true
// child count, so the UI can tell "children.length < size" and show how many
// were left out — see JsonTreeNode.vue's truncation row.
export const MAX_TREE_NODES = 5000

let _seq = 0
let _count = 0

function getType(v: unknown): NodeType {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  return typeof v as NodeType
}

function build(data: unknown, key: string, path: string): TreeNode {
  const type = getType(data)
  const id = `n${_seq++}`
  _count++
  if (type === 'array') {
    const arr = data as unknown[]
    const children: TreeNode[] = []
    for (let i = 0; i < arr.length; i++) {
      if (_count >= MAX_TREE_NODES) break
      children.push(build(arr[i], String(i), `${path}[${i}]`))
    }
    return { id, key, path, type, size: arr.length, children }
  }
  if (type === 'object') {
    const obj = data as Record<string, unknown>
    const entries = Object.entries(obj)
    const children: TreeNode[] = []
    for (const [k, v] of entries) {
      if (_count >= MAX_TREE_NODES) break
      children.push(build(v, k, path ? `${path}.${k}` : k))
    }
    return { id, key, path, type, size: entries.length, children }
  }
  return { id, key, path, type, value: data as string | number | boolean | null, children: [], size: 0 }
}

export function parseJsonTree(raw: string): {
  root: TreeNode | null
  error: string
  line: number | null
  column: number | null
  tip: string | null
  truncated: boolean
} {
  _seq = 0
  _count = 0
  const { data, error, line, column, tip } = safeJsonParse(raw)
  if (error) return { root: null, error, line: line ?? null, column: column ?? null, tip: tip ?? null, truncated: false }

  const root = build(data, '', '')
  return { root, error: '', line: null, column: null, tip: null, truncated: _count >= MAX_TREE_NODES }
}

export function nodeHasMatch(node: TreeNode, q: string): boolean {
  const lq = q.toLowerCase()
  if (node.key.toLowerCase().includes(lq)) return true
  if (node.value !== undefined && node.value !== null && String(node.value).toLowerCase().includes(lq)) return true
  return node.children.some(c => nodeHasMatch(c, lq))
}

export function collectDeepIds(node: TreeNode, minDepth: number, depth = 0, out: string[] = []): string[] {
  if (node.children.length) {
    if (depth >= minDepth) out.push(node.id)
    node.children.forEach(c => collectDeepIds(c, minDepth, depth + 1, out))
  }
  return out
}

export function collectAllExpandableIds(node: TreeNode, out: string[] = []): string[] {
  if (node.children.length) {
    out.push(node.id)
    node.children.forEach(c => collectAllExpandableIds(c, out))
  }
  return out
}
