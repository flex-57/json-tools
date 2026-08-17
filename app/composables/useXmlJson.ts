import { triggerDownload } from '../utils/download'
import { safeJsonParse } from '../utils/json'
import type { ConvertResult } from '../utils/json'
import { useConverter } from './useConverter'
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<users>
  <user id="1">
    <name>Alice</name>
    <email>alice@example.com</email>
    <role>admin</role>
  </user>
  <user id="2">
    <name>Bob</name>
    <email>bob@example.com</email>
    <role>editor</role>
  </user>
</users>`

const SAMPLE_JSON = `{
  "id": 1,
  "name": "Alice Martin",
  "email": "alice@example.com",
  "role": "admin",
  "active": true,
  "tags": ["api", "auth"],
  "created_at": "2024-01-15T09:00:00Z"
}`

export function xmlToJson(input: string): ConvertResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty' }

  // XMLValidator gives a clean { err: { msg, line, col } } before we even
  // attempt to parse — no ASCII-art snippet, no regex-scraping a thrown
  // message. It's flagged deprecated in favor of the separate
  // 'fast-xml-validator' package, but still fully functional and avoids
  // adding a new dependency just for this.
  const validation = XMLValidator.validate(trimmed)
  if (validation !== true) {
    return { output: '', error: validation.err.msg, line: validation.err.line, column: validation.err.col }
  }

  try {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@', parseAttributeValue: true, parseTagValue: true })
    const parsed = parser.parse(trimmed)
    return { output: JSON.stringify(parsed, null, 2), error: null }
  } catch (e) {
    return { output: '', error: (e as Error).message }
  }
}

// XML documents must have exactly one root element. A JSON object with one
// key already gives XMLBuilder that naturally, UNLESS that key's own value is
// an array: XMLBuilder repeats a key once per array item, so {"tags":[...]}
// would still emit several sibling <tags> elements with nothing wrapping them.
// Anything else (0 or 2+ keys, a bare array, a bare primitive) needs an
// explicit <root> wrapper for the same reason. A top-level array additionally
// needs an <item> layer, since XMLBuilder would otherwise name each element
// after its numeric index (<0>, <1>, ...), which isn't a valid XML tag name.
function isSingleSafeRoot(data: unknown): boolean {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) return false
  const keys = Object.keys(data as Record<string, unknown>)
  return keys.length === 1 && !Array.isArray((data as Record<string, unknown>)[keys[0]!])
}

function wrapForXmlRoot(data: unknown): unknown {
  if (Array.isArray(data)) return { root: { item: data } }
  if (isSingleSafeRoot(data)) return data
  return { root: data }
}

export function jsonToXml(input: string): ConvertResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '', error: 'empty' }
  // Parses the untrimmed input on purpose: JsonEditor highlights errorLine against the
  // full v-model content, so a trimmed parse would desync the highlighted line from the
  // real error whenever the input has leading blank lines.
  const { data, error, line, column, tip } = safeJsonParse(input)
  if (error) return { output: '', error, line, column, tip }
  try {
    const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: '@', format: true, indentBy: '  ' })
    return { output: builder.build(wrapForXmlRoot(data)), error: null }
  } catch (e) {
    return { output: '', error: (e as Error).message }
  }
}

export function useXmlToJson() {
  const { input, output, error, errorLine, errorColumn, copied, copy, clear } = useConverter(SAMPLE_XML, xmlToJson)

  function download() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'application/json' }), 'converted.json')
  }

  return { input, output, error, errorLine, errorColumn, copied, copy, download, clear }
}

export function useJsonToXml() {
  const { input, output, error, errorTip, errorLine, errorColumn, copied, copy, clear } = useConverter(SAMPLE_JSON, jsonToXml)

  function download() {
    if (!output.value) return
    triggerDownload(new Blob([output.value], { type: 'application/xml' }), 'converted.xml')
  }

  return { input, output, error, errorTip, errorLine, errorColumn, copied, copy, download, clear }
}
