type JsonVal = string | number | boolean | null | JsonVal[] | JsonObj
type JsonObj = Record<string, JsonVal>

function tsType(value: JsonVal, depth = 0): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number'
  if (typeof value === 'boolean') return 'boolean'
  if (Array.isArray(value)) return tsArray(value, depth)
  if (typeof value === 'object') return tsObject(value as JsonObj, depth)
  return 'unknown'
}

function tsArray(arr: JsonVal[], depth: number): string {
  if (arr.length === 0) return 'unknown[]'
  const allObjects = arr.every(el => el !== null && !Array.isArray(el) && typeof el === 'object')
  if (allObjects && arr.length > 1) {
    const merged = mergeObjects(arr as JsonObj[], depth)
    return `${merged}[]`
  }
  const types = [...new Set(arr.map(el => tsType(el, depth)))]
  const inner = types.length > 1 ? `(${types.join(' | ')})` : types[0]
  return `${inner}[]`
}

function mergeObjects(objects: JsonObj[], depth: number): string {
  const allKeys = [...new Set(objects.flatMap(o => Object.keys(o)))]
  const pad = '  '.repeat(depth + 1)
  const closePad = '  '.repeat(depth)
  const fields = allKeys.map(key => {
    const values = objects.map(o => o[key])
    const presentValues = values.filter(v => v !== undefined) as JsonVal[]
    const optional = presentValues.length < objects.length
    const types = [...new Set(presentValues.map(v => tsType(v, depth + 1)))]
    const typeStr = types.length > 1 ? types.join(' | ') : types[0]
    const safeName = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : `"${key}"`
    return `${pad}${safeName}${optional ? '?' : ''}: ${typeStr};`
  })
  return `{\n${fields.join('\n')}\n${closePad}}`
}

function tsObject(obj: JsonObj, depth: number): string {
  const pad = '  '.repeat(depth + 1)
  const closePad = '  '.repeat(depth)
  const fields = Object.entries(obj).map(([key, val]) => {
    const safeName = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : `"${key}"`
    return `${pad}${safeName}: ${tsType(val, depth + 1)};`
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

export function useJsonToTs() {
  const input = ref('')
  const mode = ref<'ts' | 'zod'>('ts')
  const rootName = ref('Root')
  const copied = ref(false)

  const parsed = computed(() => {
    if (!input.value.trim()) return undefined
    try { return JSON.parse(input.value) }
    catch { return undefined }
  })

  const error = computed((): string | null => {
    if (!input.value.trim()) return null
    if (parsed.value === undefined) return 'Invalid JSON'
    return null
  })

  const output = computed((): string => {
    const val = parsed.value
    if (val === undefined) return ''
    const name = rootName.value.trim() || 'Root'

    if (mode.value === 'ts') {
      if (Array.isArray(val)) {
        if (val.length === 0) return `type ${name} = unknown[];`
        return `type ${name} = ${tsArray(val, 0)};`
      }
      if (val !== null && typeof val === 'object') {
        return `interface ${name} ${tsObject(val as JsonObj, 0)}`
      }
      return `type ${name} = ${tsType(val, 0)};`
    } else {
      const schema = zodType(val, 0)
      return [
        `import { z } from 'zod';\n`,
        `const ${name} = ${schema};\n`,
        `type ${name} = z.infer<typeof ${name}>;`,
      ].join('\n')
    }
  })

  async function copy() {
    if (!output.value) return
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }

  function clear() { input.value = '' }

  return { input, mode, rootName, output, error, copied, copy, clear }
}
