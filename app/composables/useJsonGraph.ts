import type { TreeNode, NodeType } from './useJsonTree'

export type GraphNodeType = 'body' | 'header' | 'leaf'

export interface GraphEntry {
  key: string
  value: string
  type: NodeType
  isContainer?: boolean
}

export interface GraphNodeData {
  nodeType: GraphNodeType
  label: string
  size: number
  containerType?: 'object' | 'array'
  entries: GraphEntry[]
  leafValue?: string
  leafType?: NodeType
  hasOutgoing: boolean
}

export interface VfNode {
  id: string
  type: 'jsonNode'
  position: { x: number; y: number }
  data: GraphNodeData
  _w: number
  _h: number
}

export interface VfEdge {
  id: string
  source: string
  target: string
  type: string
  style: object
}

const BODY_W   = 230
const HEADER_W = 190
const LEAF_W   = 110
const ENTRY_H  = 20
const BODY_PAD = 20

let _seq = 0
function uid() { return `g${_seq++}` }

function bodyHeight(n: number) { return BODY_PAD + Math.max(n, 1) * ENTRY_H }

function formatValue(child: TreeNode): string {
  if (child.type === 'null') return 'null'
  if (child.type === 'string') {
    const s = String(child.value)
    return s.length > 36 ? s.slice(0, 36) + '…' : s
  }
  return String(child.value)
}

function edge(src: string, tgt: string): VfEdge {
  return {
    id: `e-${src}-${tgt}`,
    source: src, target: tgt,
    type: 'smoothstep',
    style: { stroke: '#3D4349', strokeWidth: 1.5 },
  }
}

function processContainer(container: TreeNode, parentId: string, nodes: VfNode[], edges: VfEdge[]) {
  const headerId = uid()
  nodes.push({
    id: headerId, type: 'jsonNode', position: { x: 0, y: 0 },
    data: { nodeType: 'header', label: container.key, size: container.size, containerType: container.type as 'object' | 'array', entries: [], hasOutgoing: true },
    _w: HEADER_W, _h: 36,
  })
  edges.push(edge(parentId, headerId))

  if (container.type === 'object') {
    const entries: GraphEntry[] = []
    const nested: TreeNode[] = []
    for (const child of container.children) {
      if (child.type === 'object' || child.type === 'array') {
        entries.push({ key: child.key, value: child.type === 'array' ? '[' + child.size + ']' : '{' + child.size + '}', type: child.type, isContainer: true })
        nested.push(child)
      } else {
        entries.push({ key: child.key, value: formatValue(child), type: child.type })
      }
    }
    if (entries.length) {
      const bodyId = uid()
      nodes.push({ id: bodyId, type: 'jsonNode', position: { x: 0, y: 0 }, data: { nodeType: 'body', label: '', size: 0, entries, hasOutgoing: nested.length > 0 }, _w: BODY_W, _h: bodyHeight(entries.length) })
      edges.push(edge(headerId, bodyId))
      for (const n of [...nested].reverse()) processContainer(n, bodyId, nodes, edges)
    }
  } else {
    // array
    for (const item of [...container.children].reverse()) {
      if (item.type === 'object' || item.type === 'array') {
        // Array item is a container — treat as anonymous body + recurse
        const entries: GraphEntry[] = []
        const nested: TreeNode[] = []
        if (item.type === 'object') {
          for (const child of item.children) {
            if (child.type === 'object' || child.type === 'array') {
              entries.push({ key: child.key, value: child.type === 'array' ? '[' + child.size + ']' : '{' + child.size + '}', type: child.type, isContainer: true })
              nested.push(child)
            } else {
              entries.push({ key: child.key, value: formatValue(child), type: child.type })
            }
          }
        }
        const bodyId = uid()
        nodes.push({ id: bodyId, type: 'jsonNode', position: { x: 0, y: 0 }, data: { nodeType: 'body', label: '', size: 0, entries, hasOutgoing: nested.length > 0 }, _w: BODY_W, _h: bodyHeight(entries.length) })
        edges.push(edge(headerId, bodyId))
        for (const n of [...nested].reverse()) processContainer(n, bodyId, nodes, edges)
      } else {
        // Primitive array item → leaf node
        const leafId = uid()
        nodes.push({ id: leafId, type: 'jsonNode', position: { x: 0, y: 0 }, data: { nodeType: 'leaf', label: '', size: 0, entries: [], leafValue: formatValue(item), leafType: item.type, hasOutgoing: false }, _w: LEAF_W, _h: 34 })
        edges.push(edge(headerId, leafId))
      }
    }
  }
}

export async function buildGraph(root: TreeNode): Promise<{ nodes: VfNode[]; edges: VfEdge[] }> {
  _seq = 0
  const nodes: VfNode[] = []
  const edges: VfEdge[] = []

  // Root node — body showing all key-value pairs
  const rootEntries: GraphEntry[] = []
  const rootContainers: TreeNode[] = []
  for (const child of root.children) {
    if (child.type === 'object' || child.type === 'array') {
      rootEntries.push({ key: child.key, value: child.type === 'array' ? '[' + child.size + ']' : '{' + child.size + '}', type: child.type, isContainer: true })
      rootContainers.push(child)
    } else {
      rootEntries.push({ key: child.key, value: formatValue(child), type: child.type })
    }
  }

  const rootId = uid()
  nodes.push({ id: rootId, type: 'jsonNode', position: { x: 0, y: 0 }, data: { nodeType: 'body', label: 'root', size: root.size, entries: rootEntries, hasOutgoing: rootContainers.length > 0 }, _w: BODY_W, _h: bodyHeight(rootEntries.length) })
  for (const c of [...rootContainers].reverse()) processContainer(c, rootId, nodes, edges)

  // Dagre layout
  const dagre = (await import('@dagrejs/dagre')).default
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'LR', ranksep: 70, nodesep: 16, marginx: 32, marginy: 32 })
  g.setDefaultEdgeLabel(() => ({}))
  nodes.forEach(n => g.setNode(n.id, { width: n._w, height: n._h }))
  edges.forEach(e => g.setEdge(e.source, e.target))
  dagre.layout(g)

  return {
    nodes: nodes.map(n => { const { x, y } = g.node(n.id); return { ...n, position: { x: x - n._w / 2, y: y - n._h / 2 } } }),
    edges,
  }
}
