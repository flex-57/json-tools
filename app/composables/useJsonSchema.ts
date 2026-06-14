type JsonVal = string | number | boolean | null | JsonVal[] | JsonObj
interface JsonObj { [key: string]: JsonVal }

const DRAFTS = {
  'draft-07': 'http://json-schema.org/draft-07/schema#',
  '2020-12':  'https://json-schema.org/draft/2020-12/schema',
} as const

export type SchemaDraft = keyof typeof DRAFTS

export interface SchemaOptions {
  required: boolean
  draft: SchemaDraft
}

type SchemaNode = Record<string, unknown>

function buildNode(val: JsonVal, opts: SchemaOptions): SchemaNode {
  if (val === null)             return { type: 'null' }
  if (typeof val === 'boolean') return { type: 'boolean' }
  if (typeof val === 'number')  return { type: Number.isInteger(val) ? 'integer' : 'number' }
  if (typeof val === 'string')  return { type: 'string' }
  if (Array.isArray(val))       return buildArray(val, opts)
  return buildObject(val as JsonObj, opts)
}

function buildArray(arr: JsonVal[], opts: SchemaOptions): SchemaNode {
  if (arr.length === 0) return { type: 'array', items: {} }
  const schemas = arr.map(v => buildNode(v, opts))
  return { type: 'array', items: unify(schemas, opts) }
}

function buildObject(obj: JsonObj, opts: SchemaOptions): SchemaNode {
  const properties: Record<string, SchemaNode> = {}
  for (const [k, v] of Object.entries(obj)) properties[k] = buildNode(v, opts)
  const node: SchemaNode = { type: 'object', properties }
  if (opts.required) {
    const keys = Object.keys(obj)
    if (keys.length) node.required = keys
  }
  return node
}

function unify(schemas: SchemaNode[], opts: SchemaOptions): SchemaNode {
  const seen = new Set<string>()
  const unique: SchemaNode[] = []
  for (const s of schemas) {
    const key = JSON.stringify(s)
    if (!seen.has(key)) { seen.add(key); unique.push(s) }
  }

  if (unique.length === 1) return unique[0]!

  if (unique.every(s => s['type'] === 'object')) {
    return mergeObjects(unique as Array<{ type: 'object'; properties: Record<string, SchemaNode>; required?: string[] }>, opts)
  }

  return { oneOf: unique }
}

function mergeObjects(
  schemas: Array<{ type: 'object'; properties: Record<string, SchemaNode>; required?: string[] }>,
  opts: SchemaOptions,
): SchemaNode {
  const allKeys = [...new Set(schemas.flatMap(s => Object.keys(s.properties)))]
  const requiredKeys = allKeys.filter(k => schemas.every(s => k in s.properties))

  const properties: Record<string, SchemaNode> = {}
  for (const key of allKeys) {
    const vals = schemas.flatMap(s => key in s.properties ? [s.properties[key]!] : [])
    properties[key] = unify(vals, opts)
  }

  const node: SchemaNode = { type: 'object', properties }
  if (opts.required && requiredKeys.length) node.required = requiredKeys
  return node
}

export function buildSchema(val: unknown, opts: SchemaOptions): SchemaNode {
  return { $schema: DRAFTS[opts.draft], ...buildNode(val as JsonVal, opts) }
}

const SAMPLE_JSON = `{
  "id": 1,
  "name": "Alice Martin",
  "email": "alice@example.com",
  "role": "admin",
  "active": true,
  "tags": ["api", "auth"],
  "created_at": "2024-01-15T09:00:00Z"
}`

export function useJsonSchema() {
  const input   = ref(SAMPLE_JSON)
  const draft   = ref<SchemaDraft>('draft-07')
  const required = ref(true)
  const copied  = ref(false)

  const result = computed((): { output: string; error: string | null } => {
    if (!input.value.trim()) return { output: '', error: null }
    try {
      const schema = buildSchema(JSON.parse(input.value), { draft: draft.value, required: required.value })
      return { output: JSON.stringify(schema, null, 2), error: null }
    } catch (e) {
      return { output: '', error: (e as Error).message }
    }
  })

  const output = computed(() => result.value.output)
  const error  = computed(() => result.value.error)

  async function copy() {
    if (!output.value) return
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }

  function clear() { input.value = '' }

  return { input, draft, required, output, error, copied, copy, clear }
}
