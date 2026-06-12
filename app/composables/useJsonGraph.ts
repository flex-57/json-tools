import type { TreeNode, NodeType } from './useJsonTree'

export const GRAPH_NODE_WIDTH = 240
const HEADER_H = 36
const ENTRY_H  = 21
const FOOTER_H = 12

export interface GraphEntry {
  key: string
  value: string
  type: NodeType
}

export interface GraphNodeData {
  label: string
  nodeType: 'object' | 'array'
  size: number
  entries: GraphEntry[]
}

export interface VfNode {
  id: string
  type: 'jsonNode'
  position: { x: number; y: number }
  data: GraphNodeData
  _height: number
}

export interface VfEdge {
  id: string
  source: string
  target: string
  label: string
  type: string
  style: object
  labelStyle: object
  labelBgPadding: [number, number]
  labelBgBorderRadius: number
  labelBgStyle: object
}

function entryHeight(entries: GraphEntry[]) {
  return HEADER_H + Math.max(entries.length, 1) * ENTRY_H + FOOTER_H
}

function formatLeafValue(child: TreeNode): string {
  if (child.type === 'null') return 'null'
  if (child.type === 'string') {
    const s = String(child.value)
    return `"${s.length > 38 ? s.slice(0, 38) + '…' : s}"`
  }
  return String(child.value)
}

function collect(node: TreeNode, nodes: VfNode[], edges: VfEdge[]) {
  if (node.type !== 'object' && node.type !== 'array') return

  const entries: GraphEntry[] = []
  const childContainers: TreeNode[] = []

  for (const child of node.children) {
    if (child.type === 'object' || child.type === 'array') {
      childContainers.push(child)
    } else {
      entries.push({ key: child.key, value: formatLeafValue(child), type: child.type })
    }
  }

  nodes.push({
    id: node.id,
    type: 'jsonNode',
    position: { x: 0, y: 0 },
    data: { label: node.key || 'root', nodeType: node.type, size: node.size, entries },
    _height: entryHeight(entries),
  })

  for (const child of childContainers) {
    edges.push({
      id: `e-${node.id}-${child.id}`,
      source: node.id,
      target: child.id,
      label: child.key,
      type: 'smoothstep',
      style: { stroke: '#3D4349', strokeWidth: 1.5 },
      labelStyle: { fill: '#E06C75', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 3,
      labelBgStyle: { fill: '#1C2330' },
    })
    collect(child, nodes, edges)
  }
}

export async function buildGraph(root: TreeNode): Promise<{ nodes: VfNode[]; edges: VfEdge[] }> {
  const nodes: VfNode[] = []
  const edges: VfEdge[] = []
  collect(root, nodes, edges)

  const dagre = (await import('@dagrejs/dagre')).default
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'LR', ranksep: 80, nodesep: 24, marginx: 40, marginy: 40 })
  g.setDefaultEdgeLabel(() => ({}))

  nodes.forEach(n => g.setNode(n.id, { width: GRAPH_NODE_WIDTH, height: n._height }))
  edges.forEach(e => g.setEdge(e.source, e.target))
  dagre.layout(g)

  return {
    nodes: nodes.map(n => {
      const { x, y } = g.node(n.id)
      return { ...n, position: { x: x - GRAPH_NODE_WIDTH / 2, y: y - n._height / 2 } }
    }),
    edges,
  }
}
