import { triggerDownload } from '../utils/download'
import { safeJsonParse } from '../utils/json'
import { useClipboard } from './useClipboard'

type JsonVal = string | number | boolean | null | JsonVal[] | JsonObj
interface JsonObj { [key: string]: JsonVal }
interface TsOpts { readonly: boolean; useType: boolean }

function tsType(value: JsonVal, depth = 0, opts: TsOpts = { readonly: false, useType: false }): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number'
  if (typeof value === 'boolean') return 'boolean'
  if (Array.isArray(value)) return tsArray(value, depth, opts)
  if (typeof value === 'object') return tsObject(value as JsonObj, depth, opts)
  return 'unknown'
}

function tsArray(arr: JsonVal[], depth: number, opts: TsOpts): string {
  if (arr.length === 0) return 'unknown[]'
  const allObjects = arr.every(el => el !== null && !Array.isArray(el) && typeof el === 'object')
  if (allObjects && arr.length > 1) {
    const merged = mergeObjects(arr as JsonObj[], depth, opts)
    return `${merged}[]`
  }
  const types = [...new Set(arr.map(el => tsType(el, depth, opts)))]
  const inner = types.length > 1 ? `(${types.join(' | ')})` : types[0]
  return `${inner}[]`
}

function mergeObjects(objects: JsonObj[], depth: number, opts: TsOpts): string {
  const allKeys = [...new Set(objects.flatMap(o => Object.keys(o)))]
  const pad = '  '.repeat(depth + 1)
  const closePad = '  '.repeat(depth)
  const ro = opts.readonly ? 'readonly ' : ''
  const fields = allKeys.map(key => {
    const values = objects.map(o => o[key])
    const presentValues = values.filter(v => v !== undefined) as JsonVal[]
    const optional = presentValues.length < objects.length
    const types = [...new Set(presentValues.map(v => tsType(v, depth + 1, opts)))]
    const typeStr = types.length > 1 ? types.join(' | ') : types[0]
    const safeName = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : `"${key}"`
    return `${pad}${ro}${safeName}${optional ? '?' : ''}: ${typeStr};`
  })
  return `{\n${fields.join('\n')}\n${closePad}}`
}

function tsObject(obj: JsonObj, depth: number, opts: TsOpts): string {
  const pad = '  '.repeat(depth + 1)
  const closePad = '  '.repeat(depth)
  const ro = opts.readonly ? 'readonly ' : ''
  const fields = Object.entries(obj).map(([key, val]) => {
    const safeName = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : `"${key}"`
    return `${pad}${ro}${safeName}: ${tsType(val, depth + 1, opts)};`
  })
  return `{\n${fields.join('\n')}\n${closePad}}`
}

function zodType(value: JsonVal, depth = 0): string {
  if (value === null) return 'z.null()'
  if (typeof value === 'string') return 'z.string()'
  if (typeof value === 'number') return 'z.number()'
  if (typeof value === 'boolean') return 'z.boolean()'
  if (Array.isArray(value)) return zodArray(value, depth)
  if (typeof value === 'object') return zodObject(value as JsonObj, depth)
  return 'z.unknown()'
}

function zodArray(arr: JsonVal[], depth: number): string {
  if (arr.length === 0) return 'z.array(z.unknown())'
  const allObjects = arr.every(el => el !== null && !Array.isArray(el) && typeof el === 'object')
  if (allObjects && arr.length > 1) {
    const merged = zodMergeObjects(arr as JsonObj[], depth)
    return `z.array(${merged})`
  }
  const types = [...new Set(arr.map(el => zodType(el, depth)))]
  if (types.length === 1) return `z.array(${types[0]})`
  return `z.array(z.union([${types.join(', ')}]))`
}

function zodMergeObjects(objects: JsonObj[], depth: number): string {
  const allKeys = [...new Set(objects.flatMap(o => Object.keys(o)))]
  const pad = '  '.repeat(depth + 1)
  const closePad = '  '.repeat(depth)
  const fields = allKeys.map(key => {
    const values = objects.map(o => o[key])
    const presentValues = values.filter(v => v !== undefined) as JsonVal[]
    const optional = presentValues.length < objects.length
    const types = [...new Set(presentValues.map(v => zodType(v, depth + 1)))]
    const inner = types.length > 1 ? `z.union([${types.join(', ')}])` : types[0]
    const zType = optional ? `${inner}.optional()` : inner
    const safeName = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : `"${key}"`
    return `${pad}${safeName}: ${zType},`
  })
  return `z.object({\n${fields.join('\n')}\n${closePad}})`
}

function zodObject(obj: JsonObj, depth: number): string {
  const pad = '  '.repeat(depth + 1)
  const closePad = '  '.repeat(depth)
  const fields = Object.entries(obj).map(([key, val]) => {
    const safeName = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : `"${key}"`
    return `${pad}${safeName}: ${zodType(val, depth + 1)},`
  })
  return `z.object({\n${fields.join('\n')}\n${closePad}})`
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

export function useJsonToTs() {
  const input = ref(SAMPLE_JSON)
  const mode = ref<'ts' | 'zod'>('ts')
  const rootName = ref('Root')

  const readonlyFields = ref(false)
  const useType = ref(false)
  const zodStrict = ref(false)

  const parseResult = computed(() => {
    if (!input.value.trim()) return { data: undefined, error: null, line: null, column: null, tip: null }
    const result = safeJsonParse<JsonVal>(input.value)
    if (result.error) return { data: undefined, error: result.error, line: result.line, column: result.column, tip: result.tip }
    return { data: result.data, error: null, line: null, column: null, tip: null }
  })

  const parsed      = computed(() => parseResult.value.data)
  const error       = computed(() => parseResult.value.error)
  const errorTip    = computed(() => parseResult.value.tip)
  const errorLine   = computed(() => parseResult.value.line)
  const errorColumn = computed(() => parseResult.value.column)

  const output = computed((): string => {
    const val = parsed.value
    if (val === undefined) return ''
    const name = rootName.value.trim() || 'Root'

    if (mode.value === 'ts') {
      const opts: TsOpts = { readonly: readonlyFields.value, useType: useType.value }
      if (Array.isArray(val)) {
        if (val.length === 0) return `type ${name} = unknown[];`
        return `type ${name} = ${tsArray(val, 0, opts)};`
      }
      if (val !== null && typeof val === 'object') {
        const body = tsObject(val as JsonObj, 0, opts)
        return opts.useType ? `type ${name} = ${body};` : `interface ${name} ${body}`
      }
      return `type ${name} = ${tsType(val, 0, opts)};`
    } else {
      const isRootObj = val !== null && !Array.isArray(val) && typeof val === 'object'
      const schema = zodType(val, 0)
      const rootSchema = zodStrict.value && isRootObj ? schema + '.strict()' : schema
      return [
        `import { z } from 'zod';\n`,
        `const ${name} = ${rootSchema};\n`,
        `type ${name} = z.infer<typeof ${name}>;`,
      ].join('\n')
    }
  })

  const { copied, copy } = useClipboard(() => output.value)

  function clear() { input.value = '' }

  function download() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'text/plain' }), 'types.ts')
  }

  return { input, mode, rootName, output, error, errorTip, errorLine, errorColumn, copied, copy, clear, readonlyFields, useType, zodStrict, download }
}
