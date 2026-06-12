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

let _seq = 0

function getType(v: unknown): NodeType {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  return typeof v as NodeType
}

function build(data: unknown, key: string, path: string): TreeNode {
  const type = getType(data)
  const id = `n${_seq++}`
  if (type === 'array') {
    const arr = data as unknown[]
    return { id, key, path, type, size: arr.length, children: arr.map((v, i) => build(v, String(i), `${path}[${i}]`)) }
  }
  if (type === 'object') {
    const obj = data as Record<string, unknown>
    return { id, key, path, type, size: Object.keys(obj).length, children: Object.entries(obj).map(([k, v]) => build(v, k, path ? `${path}.${k}` : k)) }
  }
  return { id, key, path, type, value: data as string | number | boolean | null, children: [], size: 0 }
}

export function parseJsonTree(raw: string): { root: TreeNode | null; error: string } {
  try {
    _seq = 0
    return { root: build(JSON.parse(raw), '', ''), error: '' }
  } catch (e: any) {
    return { root: null, error: e.message }
  }
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
