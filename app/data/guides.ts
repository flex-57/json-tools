import { ICONS } from '~/utils/icons'
import { CATEGORIES } from './tools'

export type GuideCategory = keyof typeof CATEGORIES

// Same category keys as tools.ts (for icon/order reuse), own display labels —
// "Converters" doesn't fit guide content, these are concept explainers, not converter tools.
export const GUIDE_CATEGORY_LABELS: Record<GuideCategory, string> = {
  json: 'JSON',
  converters: 'Data Formats',
  textcode: 'Text & Code',
  security: 'Security',
  devutils: 'Dev Utils',
}

export interface GuideFaq { q: string; a: string[] }
export interface GuideToolCard { name: string; desc: string; href: string; icon: string }

export interface GuideConfig {
  slug: string
  type: 'guide' | 'reference'
  category: GuideCategory
  title: string
  subtitle: string
  readTime: string
  datePublished: string
  dateModified: string
  description: string
  tools: GuideToolCard[]
  faqs: GuideFaq[]
  related?: string[]
}

export const GUIDES: Record<string, GuideConfig> = {
  // JSON
  'what-is-json': {
    slug: 'what-is-json',
    type: 'guide',
    category: 'json',
    title: 'What is JSON?',
    subtitle: 'JSON explained: data types, syntax rules, and why it became the universal data format for APIs and config files.',
    readTime: '6 min read',
    datePublished: '2026-06-19',
    dateModified: '2026-06-19',
    description: 'Learn what JSON is, its 6 data types, syntax rules, how it compares to XML, and why it became the standard format for REST APIs, configuration files, and databases.',
    tools: [
      { name: 'JSON Formatter & Validator', desc: 'Paste any JSON to instantly validate and format it: errors are highlighted with the exact line and reason.', href: '/tools/json-formatter', icon: ICONS.formatter },
      { name: 'JSON Tree Viewer', desc: 'Visualize any JSON structure as an interactive, collapsible tree.', href: '/tools/json-tree', icon: ICONS.tree },
      { name: 'JSON Diff', desc: 'Compare two JSON documents side by side and highlight exactly what changed.', href: '/tools/json-diff', icon: ICONS.diff },
    ],
    faqs: [
      {
        q: 'Is JSON part of JavaScript?',
        a: [
          'JSON (JavaScript Object Notation) was inspired by JavaScript object literal syntax, but it is an independent, language-agnostic format defined by RFC 8259.',
          'Every major programming language has JSON support built in or available via a standard library: Python (json module), Java (Jackson, Gson), PHP (json_encode/json_decode), Go (encoding/json), Rust (serde_json), and so on.',
        ],
      },
      {
        q: 'What is the difference between JSON and a JavaScript object?',
        a: [
          'A JavaScript object is a runtime data structure. Keys can be unquoted, values can be functions, undefined, or Date objects, and you can use trailing commas.',
          'JSON is a text format for data interchange. Keys must be quoted strings, values can only be the 6 JSON types (no functions, no undefined, no Date), and trailing commas are forbidden. You convert between them with JSON.stringify() and JSON.parse().',
        ],
      },
      {
        q: 'Can JSON have comments?',
        a: [
          'No. Comments (// or /* */) are not part of the JSON specification. A parser will reject any document that contains them.',
          'If you need comments in a config file, consider JSONC (JSON with Comments, used by VS Code and TypeScript) or YAML, which supports # comments natively.',
        ],
      },
      {
        q: 'Is JSON always an object?',
        a: [
          'No. A JSON document can be any valid JSON value: an object {}, an array [], a string, a number, a boolean, or null. {"name":"Alice"} and [1,2,3] and "hello" are all valid JSON documents.',
          'In practice, most APIs return an object or an array at the top level, but the spec allows any value.',
        ],
      },
    ],
    related: ['/guides/how-to-validate-json', '/guides/json-best-practices', '/guides/json-vs-yaml'],
  },
  'how-to-validate-json': {
    slug: 'how-to-validate-json',
    type: 'guide',
    category: 'json',
    title: 'How to Validate JSON?',
    subtitle: 'Understand what makes JSON valid, spot the most common errors, and go further with JSON Schema.',
    readTime: '5 min read',
    datePublished: '2026-06-19',
    dateModified: '2026-07-10',
    description: 'Learn how to validate JSON: syntax rules, the most common errors (trailing commas, single quotes, unquoted keys), and how to validate structure with JSON Schema.',
    tools: [
      { name: 'JSON Formatter & Validator', desc: 'Paste any JSON to instantly validate and format it: errors are highlighted with the exact line and reason.', href: '/tools/json-formatter', icon: ICONS.formatter },
      { name: 'JSON Schema Generator', desc: 'Generate a JSON Schema from any valid JSON value to start validating structure automatically.', href: '/tools/json-schema', icon: ICONS.schema },
    ],
    faqs: [
      {
        q: 'Can JSON have comments?',
        a: [
          'No. Comments are not part of the JSON specification (RFC 8259). A JSON parser will reject any file that contains // or /* */ comments.',
          'If you need comments in a config file, consider JSONC (JSON with Comments, used by VS Code) or YAML, which supports # comments natively.',
        ],
      },
      {
        q: 'Is undefined a valid JSON value?',
        a: [
          'No. JSON only supports these value types: string, number, boolean (true/false), null, object, and array. undefined is a JavaScript concept that does not exist in JSON.',
          'When you JSON.stringify() an object with undefined values in JavaScript, those keys are silently omitted from the output.',
        ],
      },
      {
        q: 'What is the difference between JSON validation and JSON Schema validation?',
        a: [
          'JSON validation checks syntax: is this text a well-formed JSON document? It verifies brackets, quotes, commas, and value types.',
          'JSON Schema validation goes further: it checks structure and constraints. Is "age" a number between 0 and 150? Is "email" present and a string? You define the rules in a schema document.',
        ],
      },
      {
        q: 'Are trailing commas allowed in JSON?',
        a: [
          'No. Trailing commas after the last item in an object or array are a syntax error in JSON. This is one of the most common mistakes, especially coming from JavaScript where trailing commas are allowed.',
          'Example of invalid JSON: {"name": "Jane", "age": 30,}. The comma after 30 is illegal.',
        ],
      },
    ],
    related: ['/guides/what-is-json', '/guides/json-best-practices', '/guides/what-is-json-schema'],
  },
  'json-best-practices': {
    slug: 'json-best-practices',
    type: 'reference',
    category: 'json',
    title: 'JSON Best Practices',
    subtitle: 'Naming conventions, dates, null vs omit, large numbers, pagination, error responses, and nesting: the conventions that save debugging time.',
    readTime: '7 min read',
    datePublished: '2026-06-30',
    dateModified: '2026-06-30',
    description: 'JSON API design best practices: camelCase naming, ISO 8601 dates, null vs omitting fields, handling large integers and money, boolean values, cursor pagination, consistent error responses, and avoiding deep nesting.',
    tools: [
      { name: 'JSON Formatter & Validator', desc: 'Validate and format your JSON to check it against the conventions in this guide.', href: '/tools/json-formatter', icon: ICONS.formatter },
      { name: 'JSON Schema Generator', desc: 'Generate a JSON Schema from your JSON to enforce structure and naming conventions automatically.', href: '/tools/json-schema', icon: ICONS.schema },
    ],
    faqs: [
      {
        q: 'Should I use camelCase or snake_case for JSON keys?',
        a: [
          'camelCase is the dominant convention for JSON APIs. It matches JavaScript\'s native style and most JSON serializers in other languages (Jackson, Newtonsoft.Json, encoding/json with struct tags) default to it.',
          'snake_case is preferred when your primary consumers are Python or PostgreSQL, where snake_case is idiomatic. What matters most is consistency: pick one convention and apply it uniformly across the entire API.',
        ],
      },
      {
        q: 'How should I represent dates and times in JSON?',
        a: [
          'Always use ISO 8601: "2026-06-30" for dates, "2026-06-30T14:30:00Z" for UTC timestamps. Never use locale-dependent formats like "06/30/2026" or custom strings like "June 30, 2026": they are ambiguous and non-parseable by standard libraries.',
          'Use UTC timestamps in API responses. Consumers can convert to local time. Store epoch milliseconds as integers only for high-volume event logs where compactness matters most.',
        ],
      },
      {
        q: 'Is null the same as omitting a field in JSON?',
        a: [
          'No, they have distinct semantics. {"middleName": null} communicates "this field exists and its value is explicitly empty." Omitting the field communicates "this field is not part of this response."',
          'Never mix the two conventions in the same API. Choose one and document it. An API that sometimes returns null and sometimes omits a field for the same concept forces consumers to handle both cases defensively.',
        ],
      },
      {
        q: 'How do I handle large numbers in JSON?',
        a: [
          'JSON parsers in most languages use IEEE 754 double-precision floats, which can represent integers exactly only up to 2⁵³ (9007199254740992). Numbers beyond this lose precision silently in JavaScript.',
          'For IDs larger than 2⁵³ (Twitter/X snowflake IDs, for example), send them as strings: "id": "1234567890123456789". For money values, use integer cents ("amountCents": 1099) or fixed-decimal strings ("amount": "10.99"). Never floats.',
        ],
      },
    ],
    related: ['/guides/what-is-json', '/guides/how-to-validate-json'],
  },
  // Data Formats (converters)
  'what-is-csv': {
    slug: 'what-is-csv',
    type: 'guide',
    category: 'converters',
    title: 'What is CSV?',
    subtitle: 'CSV explained: structure, quoting and escaping rules, delimiters, and why CSV vs JSON is not a lossless conversion.',
    readTime: '5 min read',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    description: 'Learn how CSV works: row/column structure, RFC 4180 quoting and escaping rules, comma vs semicolon vs tab delimiters, CSV vs JSON, and common pitfalls like Excel auto-formatting and encoding.',
    tools: [
      { name: 'CSV to JSON', desc: 'Paste or drop a CSV/TSV file to convert it to JSON, with auto-detected delimiter and header handling.', href: '/tools/csv-to-json', icon: ICONS.csvIn },
      { name: 'JSON to CSV', desc: 'Flatten a JSON array of objects into downloadable CSV rows.', href: '/tools/json-to-csv', icon: ICONS.csvOut },
    ],
    faqs: [
      {
        q: 'Is there an official CSV standard?',
        a: [
          'Not a binding one. RFC 4180 documents the conventions most parsers follow (comma delimiter, optional double-quoting, doubled quotes for escaping), but it is informational, not a mandatory standard.',
          'In practice this means CSV files from different sources can disagree on delimiter, line-ending style, or quoting, and a parser that is strict about RFC 4180 will reject files that Excel happily opens.',
        ],
      },
      {
        q: 'Why does my CSV file open as a single column in Excel?',
        a: [
          'Excel guesses the delimiter from your system locale, not from the file. If the file was exported from a European-locale spreadsheet (semicolon-delimited, since comma is the decimal separator there) and you open it on a US/UK-locale Excel expecting commas, every row lands in one column.',
          'Fix it with Data → Text to Columns and pick the delimiter manually, or re-export the file with the delimiter your Excel locale expects.',
        ],
      },
      {
        q: 'How do I put a comma inside a CSV value?',
        a: [
          'Wrap the whole field in double quotes: "12 Rue de Paris, 3rd floor". Without the quotes, the comma inside the value is indistinguishable from a real field separator and shifts every column after it.',
          'If the value itself contains a double quote, double it: "She said ""hello""" decodes to She said "hello".',
        ],
      },
      {
        q: 'Can CSV represent nested data like JSON can?',
        a: [
          'No. CSV is strictly flat: rows and columns, no objects or arrays inside a cell. There is no standard way to represent a JSON array of objects containing nested objects as CSV without a lossy transformation.',
          'Common workarounds: flatten nested keys into dotted column names (address.city, address.country), or serialize the nested value as a JSON string inside a single cell and parse it back on the way in.',
        ],
      },
    ],
    related: ['/guides/what-is-json', '/guides/what-is-xml', '/guides/what-is-yaml'],
  },
  'what-is-xml': {
    slug: 'what-is-xml',
    type: 'guide',
    category: 'converters',
    title: 'What is XML?',
    subtitle: 'XML explained: element structure, attributes, well-formed vs valid, XML vs JSON, and where XML is still used today.',
    readTime: '5 min read',
    datePublished: '2026-06-30',
    dateModified: '2026-06-30',
    description: 'Learn what XML (eXtensible Markup Language) is, how it structures data with tags and attributes, the difference between well-formed and valid XML, and where it is still used (SOAP, RSS, SVG, Android, Office).',
    tools: [
      { name: 'XML → JSON', desc: 'Convert XML documents to clean JSON: handles attributes, nested elements, and namespaces.', href: '/tools/xml-to-json', icon: ICONS.xmlIn },
      { name: 'JSON → XML', desc: 'Convert JSON objects to valid XML with a configurable root element.', href: '/tools/json-to-xml', icon: ICONS.xmlOut },
    ],
    faqs: [
      {
        q: 'Is HTML the same as XML?',
        a: [
          'No. HTML and XML share tag-based syntax but serve different purposes. HTML has a fixed set of tags (div, p, a, img…) defined by the HTML standard. XML lets you define your own tags.',
          'XHTML is a stricter version of HTML that follows XML syntax rules: all tags must be closed, attributes must be quoted, and there must be exactly one root element. Modern HTML5 does not require this strictness.',
        ],
      },
      {
        q: 'What is the difference between a DTD and an XSD?',
        a: [
          'Both define a schema (the allowed structure) for an XML document. DTD (Document Type Definition) is the older format, with limited type support and a non-XML syntax.',
          'XSD (XML Schema Definition) is the modern alternative, written in XML itself. It supports data types (string, integer, date…), namespaces, and more complex constraints. XSD is preferred for enterprise XML like SOAP/WSDL.',
        ],
      },
      {
        q: 'What is XPath?',
        a: [
          'XPath is a query language for selecting nodes in an XML document, similar to how CSS selectors work for HTML. An expression like /users/user[@id="42"]/email selects the email element of the user whose id attribute is "42".',
          'XPath is used in XSLT (XML transformation), XML validators, and tools like Selenium for browser automation (selecting HTML elements).',
        ],
      },
      {
        q: 'Is XML still relevant in 2026?',
        a: [
          'Yes, in specific domains. XML is the foundation of SOAP web services (still dominant in banking and ERP), RSS/Atom feeds, SVG graphics, Android UI layouts, Maven build files, and Microsoft Office documents (.docx, .xlsx).',
          'For new REST APIs and data interchange, JSON has largely replaced XML due to its compactness and native JavaScript support. But XML is not going away: it remains deeply embedded in enterprise and standards-based systems.',
        ],
      },
    ],
    related: ['/guides/what-is-json', '/guides/what-is-csv', '/guides/what-is-yaml'],
  },
  'what-is-yaml': {
    slug: 'what-is-yaml',
    type: 'guide',
    category: 'converters',
    title: 'What is YAML?',
    subtitle: 'YAML explained: indentation-based syntax, scalars, sequences, anchors, and common gotchas like the Norway problem.',
    readTime: '6 min read',
    datePublished: '2026-06-30',
    dateModified: '2026-06-30',
    description: 'Learn what YAML is, how its indentation-based syntax compares to JSON, block and flow styles, anchors and aliases, and the common pitfalls that trip up developers (Norway problem, tab prohibition, implicit type coercion).',
    tools: [
      { name: 'YAML → JSON', desc: 'Convert any YAML file or snippet to JSON instantly. Paste or drop a .yaml file.', href: '/tools/yaml-to-json', icon: ICONS.yamlIn },
      { name: 'JSON → YAML', desc: 'Convert JSON to clean, readable YAML with proper indentation.', href: '/tools/json-to-yaml', icon: ICONS.yamlOut },
    ],
    faqs: [
      {
        q: 'Is YAML a superset of JSON?',
        a: [
          'Yes, since YAML 1.2 (2009). Every valid JSON document is also valid YAML, and a YAML 1.2 parser can read JSON directly.',
          'The reverse is not true: YAML supports features JSON does not, including comments (#), multi-line strings (| and >), anchors (&) and aliases (*), and implicit type coercion. A JSON parser cannot read YAML.',
        ],
      },
      {
        q: 'Why does YAML forbid tabs?',
        a: [
          'YAML uses indentation to convey structure, and the width of a tab character is ambiguous: different editors display it as 2, 4, or 8 spaces. If tab width affects meaning, documents would parse differently depending on the editor.',
          'The YAML spec simply forbids tabs in indentation to eliminate this ambiguity. Most modern editors can be configured to insert spaces when you press Tab in YAML files (often called "expand tabs").',
        ],
      },
      {
        q: 'What is the Norway problem?',
        a: [
          'In YAML 1.1, unquoted values that look like booleans are parsed as booleans. The list included: true/false, yes/no, on/off, and their capitalized variants. Norway\'s ISO country code "NO" was silently parsed as false.',
          'YAML 1.2 fixed this by limiting boolean literals to only "true" and "false". However, many parsers (Go\'s gopkg.in/yaml.v2, Python\'s PyYAML) still implement YAML 1.1 semantics. Always quote country codes and other ambiguous string values.',
        ],
      },
      {
        q: 'When should I choose YAML over JSON?',
        a: [
          'Choose YAML for configuration files that humans write and maintain: Docker Compose, Kubernetes manifests, GitHub Actions, Ansible, Helm charts. The comment support and readability make hand-editing much easier.',
          'Choose JSON for API responses, machine-generated data, package.json, tsconfig.json, and anywhere that tools or code generate and consume the data. JSON is simpler, faster to parse, and natively supported in every language runtime.',
        ],
      },
    ],
    related: ['/guides/json-vs-yaml', '/guides/what-is-json', '/guides/what-is-xml'],
  },
  'json-vs-yaml': {
    slug: 'json-vs-yaml',
    type: 'reference',
    category: 'converters',
    title: 'JSON vs YAML: What\'s the Difference?',
    subtitle: 'A side-by-side comparison of JSON and YAML: syntax, use cases, and when to choose one over the other.',
    readTime: '5 min read',
    datePublished: '2026-06-19',
    dateModified: '2026-06-19',
    description: 'JSON vs YAML: compare syntax, readability, comments, data types, and performance. Learn when to use JSON and when to use YAML for config files, APIs, and data exchange.',
    tools: [
      { name: 'YAML → JSON', desc: 'Convert any YAML file or snippet to JSON instantly. Paste or drop a .yaml file.', href: '/tools/yaml-to-json', icon: ICONS.yamlIn },
      { name: 'JSON → YAML', desc: 'Convert JSON to clean, readable YAML. Paste or drop a .json file.', href: '/tools/json-to-yaml', icon: ICONS.yamlOut },
    ],
    faqs: [
      {
        q: 'Is YAML a superset of JSON?',
        a: [
          'Yes, since YAML 1.2, every valid JSON document is also valid YAML. YAML parsers can read JSON directly.',
          'The reverse is not true: YAML features like comments, anchors, and multi-line strings have no equivalent in JSON.',
        ],
      },
      {
        q: 'Can YAML have comments?',
        a: [
          'Yes. YAML supports single-line comments with #. This is one of the most practical advantages of YAML for configuration files.',
          'JSON has no comment syntax. Some parsers accept // or /* */ comments as an extension (JSONC format), but standard JSON does not.',
        ],
      },
      {
        q: 'Which is faster to parse, JSON or YAML?',
        a: [
          'JSON is significantly faster to parse. Its grammar is simple and unambiguous, and native JSON parsers are built into every runtime (browsers, Node.js, Python, etc.).',
          'YAML has a much more complex grammar with many edge cases (especially around implicit typing), which makes parsers slower and more prone to subtle bugs.',
        ],
      },
      {
        q: 'Which should I use for configuration files?',
        a: [
          'YAML is generally preferred for human-edited config files (Docker Compose, Kubernetes, GitHub Actions, Ansible) because of its readability and comment support.',
          'JSON is better for machine-generated or machine-consumed data (APIs, package.json, tsconfig.json) where tooling support and parse speed matter more than readability.',
        ],
      },
    ],
    related: ['/guides/what-is-yaml', '/guides/what-is-json', '/guides/what-is-csv'],
  },
  'what-is-json-schema': {
    slug: 'what-is-json-schema',
    type: 'guide',
    category: 'converters',
    title: 'What is JSON Schema?',
    subtitle: 'JSON Schema explained: core keywords, composition, Draft-07 vs 2020-12, and practical validation use cases.',
    readTime: '6 min read',
    datePublished: '2026-06-30',
    dateModified: '2026-06-30',
    description: 'Learn what JSON Schema is, its core keywords (type, properties, required, enum, pattern), composition with anyOf/oneOf/allOf, the difference between Draft-07 and 2020-12, and where it is used in APIs and tooling.',
    tools: [
      { name: 'JSON Schema Generator', desc: 'Generate a JSON Schema automatically from any JSON sample, for Draft-07 or 2020-12.', href: '/tools/json-schema', icon: ICONS.schema },
      { name: 'JSON Formatter & Validator', desc: 'Validate and format your JSON documents before writing a schema for them.', href: '/tools/json-formatter', icon: ICONS.formatter },
    ],
    faqs: [
      {
        q: 'Is JSON Schema the same as TypeScript types?',
        a: [
          'No, they serve different purposes. TypeScript types exist at compile time: they are erased by the compiler and have no effect at runtime. JSON Schema validates data at runtime against a declarative schema document.',
          'Tools like zod-to-json-schema and json-schema-to-typescript bridge the two worlds: you can generate a JSON Schema from a Zod schema for runtime validation, or generate TypeScript types from a JSON Schema for static typing.',
        ],
      },
      {
        q: 'Which JSON Schema draft should I use?',
        a: [
          'For new projects, use Draft 2020-12 if your validator supports it: it has cleaner semantics, better anchor support, and modular vocabulary. For maximum ecosystem compatibility (OpenAPI 3.0, many existing validators), use Draft-07.',
          'Always declare the draft explicitly with the $schema keyword at the top of your schema so validators know which rules to apply.',
        ],
      },
      {
        q: 'Which validators implement JSON Schema?',
        a: [
          'JavaScript/Node.js: Ajv (most popular), jsonschema, @cfworker/json-schema. Python: jsonschema, fastjsonschema. Java: networknt/json-schema-validator. Go: gojsonschema. Rust: jsonschema.',
          'Ajv is the de facto standard in the JavaScript ecosystem and is used internally by many frameworks and tools (including webpack). It supports Draft-07, 2019-09, and 2020-12.',
        ],
      },
      {
        q: 'Can JSON Schema validate formats like email or date-time?',
        a: [
          'Yes, with the "format" keyword: "format": "email", "format": "date-time", "format": "uri", etc. However, format validation is optional in the spec: validators are not required to enforce it unless explicitly configured.',
          'In Ajv, enable format validation by installing ajv-formats and adding the formats option. Without explicit configuration, format keywords are collected but not validated, which can lead to false confidence.',
        ],
      },
    ],
    related: ['/guides/what-is-json', '/guides/how-to-validate-json', '/guides/json-best-practices'],
  },
  // Text & Code
  'what-is-url-encoding': {
    slug: 'what-is-url-encoding',
    type: 'guide',
    category: 'textcode',
    title: 'What is URL Encoding?',
    subtitle: 'Percent-encoding explained: which characters must be encoded, how it works, and the difference between encodeURI and encodeURIComponent.',
    readTime: '5 min read',
    datePublished: '2026-06-30',
    dateModified: '2026-06-30',
    description: 'Learn what URL encoding (percent-encoding) is, which characters are reserved, how %XX encoding works, and when to use encodeURI vs encodeURIComponent in JavaScript.',
    tools: [
      { name: 'URL Encode / Decode', desc: 'Encode special characters for URLs or decode any percent-encoded string, instantly and entirely client-side.', href: '/tools/url-encode', icon: ICONS.url },
      { name: 'Base64 Encode / Decode', desc: 'An alternative encoding scheme for binary data, often confused with URL encoding.', href: '/tools/base64', icon: ICONS.base64 },
    ],
    faqs: [
      {
        q: 'What is the difference between %20 and + for encoding spaces?',
        a: [
          'Both represent a space, but in different contexts. %20 (percent-encoding) is used in URL paths and is defined by RFC 3986.',
          '+ is used only in form data (application/x-www-form-urlencoded), the format browsers send when you submit an HTML form. When in doubt, use %20; it works everywhere. Never mix the two in the same URL.',
        ],
      },
      {
        q: 'Do I need to encode all special characters?',
        a: [
          'Not all: only characters that are not safe in a URL context. Unreserved characters (letters A-Z, digits 0-9, and - _ . ~) never need encoding.',
          'Reserved characters like / ? # & = ; : @ have special meaning in URL structure and must be encoded if they appear in a value rather than as URL delimiters.',
        ],
      },
      {
        q: 'What is the difference between encodeURI and encodeURIComponent?',
        a: [
          'encodeURI encodes a complete URL: it leaves structural characters like / ? # & = intact because they are part of the URL structure.',
          'encodeURIComponent encodes a value to be embedded inside a URL component. It encodes everything except letters, digits, and - _ . ! ~ * \' ( ). Use encodeURIComponent for query parameter values; use encodeURI for full URLs.',
        ],
      },
      {
        q: 'Is URL encoding the same as Base64?',
        a: [
          'No. They solve different problems. URL encoding represents a character as a % followed by its hexadecimal byte value. It is specifically designed to make arbitrary text safe in URLs.',
          'Base64 encodes binary data as printable ASCII text using 64 characters. It increases data size by ~33% and is used for embedding files in text contexts (HTML data URIs, email attachments). The two schemes are not interchangeable.',
        ],
      },
    ],
    related: ['/guides/what-is-base64', '/guides/encoding-vs-encryption-vs-hashing'],
  },
  'what-is-base64': {
    slug: 'what-is-base64',
    type: 'guide',
    category: 'textcode',
    title: 'What is Base64 Encoding?',
    subtitle: 'Base64 explained: how it works, why it exists, common use cases, and the difference with Base64url.',
    readTime: '5 min read',
    datePublished: '2026-06-19',
    dateModified: '2026-06-19',
    description: 'Learn what Base64 encoding is, how it converts binary data to text using 64 printable characters, when to use it, and how it differs from Base64url used in JWTs.',
    tools: [
      { name: 'Base64 Encoder / Decoder', desc: 'Encode text or binary data to Base64, or decode any Base64 string, right in your browser.', href: '/tools/base64', icon: ICONS.base64 },
    ],
    faqs: [
      {
        q: 'Is Base64 the same as encryption?',
        a: [
          'No. Base64 is an encoding scheme, not encryption. Anyone can decode a Base64 string without a key. It is completely reversible.',
          'Never use Base64 to protect sensitive data. If you need to hide information, use proper encryption (AES, RSA, etc.). Base64 is only for making binary data safe to transmit through text channels.',
        ],
      },
      {
        q: 'Why does Base64 increase file size by 33%?',
        a: [
          'Base64 groups raw bytes into chunks of 3 (24 bits), then represents each chunk as 4 printable characters (6 bits each). That 3-to-4 byte ratio means every 3 bytes of input produces 4 characters of output, a 33% overhead.',
          'Padding characters (=) are added when the input length is not a multiple of 3.',
        ],
      },
      {
        q: 'What is Base64url and how is it different?',
        a: [
          'Base64url is a URL-safe variant of Base64 used in JWTs and other web contexts. It replaces + with - and / with _ to avoid conflicts with URL syntax, and omits the = padding characters.',
          'Standard Base64 uses characters that have special meanings in URLs (+, /, =), which would require percent-encoding. Base64url avoids this entirely.',
        ],
      },
      {
        q: 'When should I use Base64 encoding?',
        a: [
          'Use Base64 when you need to transmit binary data through a channel that only supports text: embedding images in HTML or CSS (data URIs), encoding email attachments (MIME), passing binary values in JSON payloads, or storing binary data in cookies or HTTP headers.',
          'Do not use it to "compress" data (it does the opposite) or to hide data (it provides no security).',
        ],
      },
    ],
    related: ['/guides/encoding-vs-encryption-vs-hashing', '/guides/what-is-url-encoding', '/guides/what-is-jwt'],
  },
  'what-is-markdown': {
    slug: 'what-is-markdown',
    type: 'guide',
    category: 'textcode',
    title: 'What is Markdown?',
    subtitle: 'Markdown explained: why it was created, how plain text becomes HTML, the core syntax, and where it is used today.',
    readTime: '5 min read',
    datePublished: '2026-06-30',
    dateModified: '2026-06-30',
    description: 'Learn what Markdown is, how it converts plain text to HTML, the most common syntax elements, and where it is used, from GitHub READMEs to note-taking apps and documentation sites.',
    tools: [
      { name: 'Markdown Preview', desc: 'Write or paste Markdown and see the rendered HTML output instantly, live and client-side.', href: '/tools/markdown-preview', icon: ICONS.markdown },
      { name: 'Markdown Cheatsheet', desc: 'Quick reference for all Markdown syntax: headings, code blocks, tables, task lists, and more.', href: '/guides/markdown-cheatsheet', icon: ICONS.markdown },
    ],
    faqs: [
      {
        q: 'Is Markdown the same as HTML?',
        a: [
          'No. Markdown is a plain-text shorthand that converts to HTML, not HTML itself. You write # Heading and a processor turns it into <h1>Heading</h1>. The key difference is readability: raw Markdown is comfortable to read as-is, raw HTML is not.',
          'You can mix HTML directly into a Markdown document and most parsers will pass it through unchanged. The reverse is not true, though: HTML files do not understand Markdown syntax.',
        ],
      },
      {
        q: 'What is CommonMark?',
        a: [
          'CommonMark is a formal specification of Markdown syntax, published in 2014 to resolve ambiguities in the original spec. Before CommonMark, different Markdown parsers often disagreed on edge cases.',
          'Today, CommonMark is the de facto standard: GitHub, GitLab, Discourse, Reddit, and most modern tools implement it (often as a base with their own extensions). The Markdown Preview tool on this site uses the marked library, which follows CommonMark by default.',
        ],
      },
      {
        q: 'What file extension does Markdown use?',
        a: [
          'The most common extension is .md. You may also see .markdown (the original) and occasionally .mdown, .mkd, or .mdx (the latter for Markdown with JSX, used in Next.js and Astro).',
          'GitHub, VS Code, and nearly all tools recognise .md automatically. For compatibility, stick with .md unless your framework requires otherwise.',
        ],
      },
      {
        q: 'Can I write HTML inside Markdown?',
        a: [
          'Yes, most Markdown parsers allow inline HTML. If you need something Markdown cannot express, like a coloured span, a custom div, or an embedded form, you can write raw HTML and the parser will pass it through.',
          'There are two caveats: if the Markdown is sanitised before display (as in this tool, which uses DOMPurify), some HTML may be stripped for security. And some processors only support a subset of HTML inline.',
        ],
      },
    ],
    related: ['/guides/markdown-cheatsheet'],
  },
  'markdown-cheatsheet': {
    slug: 'markdown-cheatsheet',
    type: 'reference',
    category: 'textcode',
    title: 'Markdown Cheatsheet',
    subtitle: 'A quick reference for all Markdown syntax: headings, emphasis, links, code blocks, tables, task lists, and more.',
    readTime: '4 min read',
    datePublished: '2026-06-30',
    dateModified: '2026-06-30',
    description: 'Markdown syntax cheatsheet: headings, bold, italic, inline code, fenced code blocks, links, images, ordered and unordered lists, task lists, tables, blockquotes, and horizontal rules.',
    tools: [
      { name: 'Markdown Preview', desc: 'Paste any Markdown and instantly see the rendered output: try every syntax element from this cheatsheet.', href: '/tools/markdown-preview', icon: ICONS.markdown },
      { name: 'What is Markdown?', desc: 'Not yet familiar with Markdown? Start with the introductory guide to understand the basics.', href: '/guides/what-is-markdown', icon: ICONS.markdown },
    ],
    faqs: [
      {
        q: 'How do I add a line break in Markdown?',
        a: [
          'In CommonMark, a paragraph break requires a blank line between two blocks of text. A single newline within a paragraph is treated as a space.',
          'To force a line break within a paragraph without starting a new one, end the line with two or more spaces, then press Enter. Alternatively, use a backslash \\ at the end of the line (supported by most modern parsers).',
        ],
      },
      {
        q: 'How do I escape a special Markdown character?',
        a: [
          'Prefix the character with a backslash (\\). For example, \\* renders as a literal asterisk instead of starting bold or italic, and \\# renders as a hash instead of a heading.',
          'Characters that can be escaped include: \\ ` * _ { } [ ] ( ) # + - . !',
        ],
      },
      {
        q: 'What is the difference between _ and * for emphasis?',
        a: [
          'Functionally they are identical: *word* and _word_ both produce italic, **word** and __word__ both produce bold.',
          'The convention in most style guides is to use * for emphasis and ** for strong, reserving _ for cases where you need to avoid ambiguity inside words. Using _ inside a word (like un_der_score) is treated as a literal underscore by CommonMark.',
        ],
      },
      {
        q: 'Does Markdown support nested lists?',
        a: [
          'Yes. Indent nested items by two or four spaces (CommonMark accepts both). You can mix ordered and unordered lists at different nesting levels.',
          'Example: a top-level unordered list item followed by an indented ordered sub-list creates a mixed-level structure.',
        ],
      },
    ],
    related: ['/guides/what-is-markdown'],
  },
  'sql-cheatsheet': {
    slug: 'sql-cheatsheet',
    type: 'reference',
    category: 'textcode',
    title: 'SQL Cheatsheet',
    subtitle: 'A quick reference for SQL syntax: clause execution order, joins, filtering, aggregates, and where MySQL, PostgreSQL, SQLite, and T-SQL disagree.',
    readTime: '4 min read',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    description: 'A practical SQL reference: the logical clause execution order, join types, filtering operators, aggregate functions with GROUP BY/HAVING, and syntax differences between MySQL, PostgreSQL, SQLite, and T-SQL.',
    tools: [
      { name: 'SQL Formatter', desc: 'Format and beautify SQL queries for MySQL, PostgreSQL, SQLite, T-SQL, or standard SQL.', href: '/tools/sql-formatter', icon: ICONS.sql },
    ],
    faqs: [
      {
        q: 'Why can\'t my WHERE clause use a column alias from SELECT?',
        a: [
          'SQL is written SELECT-first but executed FROM-first: FROM and WHERE both run before SELECT creates any aliases, so the alias does not exist yet at the point WHERE is evaluated.',
          'ORDER BY runs last, after SELECT, which is why it can reference SELECT aliases without any issue.',
        ],
      },
      {
        q: 'What is the difference between WHERE and HAVING?',
        a: [
          'WHERE filters individual rows before grouping happens. HAVING filters groups after GROUP BY has produced them, which is the only place you can filter on an aggregate value like COUNT(*) or SUM(col).',
          'Using WHERE to try to filter on an aggregate fails, because at the point WHERE runs, no aggregation has happened yet.',
        ],
      },
      {
        q: 'Why does WHERE col = NULL never match anything?',
        a: [
          'NULL represents "unknown," not a comparable value. Any comparison against unknown (including = NULL) evaluates to unknown, not true, so the row is excluded either way.',
          'Use IS NULL or IS NOT NULL instead, which are dedicated NULL-checking predicates rather than equality comparisons.',
        ],
      },
      {
        q: 'Is LIMIT standard SQL?',
        a: [
          'No. LIMIT (MySQL, PostgreSQL, SQLite) and TOP (T-SQL) are both vendor extensions that predate the ISO/ANSI standard row-limiting syntax, FETCH FIRST n ROWS ONLY.',
          'PostgreSQL and modern SQL Server both support the standard OFFSET/FETCH form in addition to their own LIMIT/TOP syntax.',
        ],
      },
    ],
    related: ['/guides/regex-cheatsheet', '/guides/markdown-cheatsheet', '/guides/cron-expression-examples'],
  },
  // Security
  'what-is-jwt': {
    slug: 'what-is-jwt',
    type: 'guide',
    category: 'security',
    title: 'What is a JWT Token?',
    subtitle: 'JSON Web Tokens explained: structure, how they work, common algorithms, and security best practices.',
    readTime: '6 min read',
    datePublished: '2026-06-19',
    dateModified: '2026-06-19',
    description: 'Learn what JSON Web Tokens (JWT) are, how they work, their three-part structure (header, payload, signature), signing algorithms, and security best practices.',
    tools: [
      { name: 'JWT Decoder', desc: 'Paste any JWT to instantly inspect its header, payload, and expiration. Fully client-side, no server involved.', href: '/tools/jwt-decoder', icon: ICONS.jwtDec },
      { name: 'JWT Generator', desc: 'Create signed JWTs with custom claims and algorithm (HS256, HS384, HS512) directly in your browser.', href: '/tools/jwt-generator', icon: ICONS.jwtGen },
    ],
    faqs: [
      {
        q: 'Is a JWT encrypted?',
        a: [
          'No. A JWT is base64url-encoded, not encrypted. The payload is readable by anyone who has the token. Paste it into a JWT decoder to see the contents.',
          'If you need to protect the payload from being read (not just tampered with), use a JWE (JSON Web Encryption) instead.',
        ],
      },
      {
        q: 'Where should I store a JWT on the client?',
        a: [
          'The safest option is an HttpOnly cookie: it cannot be accessed by JavaScript, so it is immune to XSS attacks. The browser sends it automatically on every request to the same domain.',
          'Storing in localStorage is common and convenient, but makes the token accessible to any JavaScript running on the page, including malicious scripts.',
        ],
      },
      {
        q: 'Can a JWT be invalidated before it expires?',
        a: [
          'Not natively: that is a known limitation of the stateless JWT model. Once issued, a token is valid until its exp timestamp, regardless of what happens server-side.',
          'Common workarounds: keep expiration times short (15 minutes), use a refresh token rotation pattern, or maintain a server-side token blocklist for critical actions like logout.',
        ],
      },
      {
        q: 'What is the difference between a JWT and a session token?',
        a: [
          'A session token is an opaque random string that maps to user state stored on the server (database or cache). Every request requires a server-side lookup to validate it.',
          'A JWT is self-contained: all the information needed to validate and identify the user is inside the token itself. The server only needs the secret key, with no database lookup required.',
        ],
      },
    ],
    related: ['/guides/what-is-base64', '/guides/what-is-hash', '/guides/encoding-vs-encryption-vs-hashing'],
  },
  'what-is-hash': {
    slug: 'what-is-hash',
    type: 'guide',
    category: 'security',
    title: 'What is a Hash Function?',
    subtitle: 'Hash functions explained: one-way digests, MD5 vs SHA-256, use cases, and why you should never hash passwords with SHA.',
    readTime: '6 min read',
    datePublished: '2026-06-30',
    dateModified: '2026-06-30',
    description: 'Learn what cryptographic hash functions are, how MD5, SHA-1, SHA-256, and SHA-512 compare, their use cases (checksums, deduplication, digital signatures), and why bcrypt/Argon2 are required for passwords.',
    tools: [
      { name: 'Hash Generator', desc: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text, right in your browser.', href: '/tools/hash', icon: ICONS.hash },
    ],
    faqs: [
      {
        q: 'What is the difference between MD5 and SHA-256?',
        a: [
          'MD5 produces a 128-bit (32-character hex) digest and is fast to compute. It is considered cryptographically broken (collisions can be generated in seconds on commodity hardware), so it should never be used for security purposes.',
          'SHA-256 produces a 256-bit (64-character hex) digest and is significantly more secure. It is the standard choice for integrity verification, digital signatures, and other security-sensitive uses. Use SHA-256 or SHA-512 for new applications.',
        ],
      },
      {
        q: 'Can a hash be reversed?',
        a: [
          'No, that is the defining property of a one-way function. A hash function maps input of any size to a fixed-size digest, and the computation is designed to be infeasible to reverse.',
          'However, attackers can use precomputed rainbow tables (hash → input mappings) for common inputs like short passwords. This is why passwords need both a strong hash algorithm (bcrypt, Argon2) and a unique random salt per entry.',
        ],
      },
      {
        q: 'Why should I not use SHA-256 to hash passwords?',
        a: [
          'SHA-256 is designed to be fast, which is exactly what you do not want for password storage. An attacker with a GPU can compute billions of SHA-256 hashes per second, making brute-force attacks trivial.',
          'Password hashing algorithms like bcrypt, Argon2, and scrypt are deliberately slow and configurable. They include a work factor that lets you increase computation time as hardware gets faster. Always use one of these for passwords, never raw SHA.',
        ],
      },
      {
        q: 'What is a hash collision?',
        a: [
          'A collision occurs when two different inputs produce the same hash output. Since hash functions map arbitrary-length input to a fixed-size output, collisions are mathematically inevitable. A good hash function just makes finding one computationally infeasible.',
          'MD5 and SHA-1 have known practical collision attacks. SHA-256 has no known collisions. Collisions matter for security (digital signatures, certificates) but not for non-security uses like checksums for accidental corruption.',
        ],
      },
    ],
    related: ['/guides/encoding-vs-encryption-vs-hashing', '/guides/what-is-base64', '/guides/password-entropy-explained'],
  },
  'encoding-vs-encryption-vs-hashing': {
    slug: 'encoding-vs-encryption-vs-hashing',
    type: 'reference',
    category: 'security',
    title: 'Encoding vs Encryption vs Hashing',
    subtitle: "Three commonly confused transformations compared: what's reversible, what needs a key, and why Base64 is not encryption.",
    readTime: '4 min read',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    description: 'Encoding, encryption, and hashing compared side by side: purpose, reversibility, whether a secret key is required, and the common mistake of treating Base64 encoding as if it provided security.',
    tools: [
      { name: 'Base64 Encoder / Decoder', desc: 'Encode text to Base64 or decode it back — reversible by anyone, not a security measure.', href: '/tools/base64', icon: ICONS.base64 },
      { name: 'Hash Generator', desc: 'Compute MD5, SHA-1, SHA-256, and SHA-512 digests — one-way, for verification and integrity checks.', href: '/tools/hash', icon: ICONS.hash },
    ],
    faqs: [
      {
        q: 'Is Base64 a form of encryption?',
        a: [
          'No. Base64 has no key and no secret of any kind — decoding it back to the original data takes one line of code in any language. It exists purely so binary or special-character data can safely pass through systems that only accept a limited character set.',
          'If a value needs to stay confidential, it needs encryption. Base64-encoding a password or API key and treating it as protected is a genuine, common security bug.',
        ],
      },
      {
        q: 'Is a JWT encrypted?',
        a: [
          'A standard JWT is Base64url-encoded and signed, not encrypted. Its payload is fully readable by anyone who has the token; the signature only proves it was not tampered with.',
          'An encrypted JWT variant exists (JWE — JSON Web Encryption), but it is far less common than the standard signed JWT (JWS).',
        ],
      },
      {
        q: 'Why can\'t a hash be reversed back to the original input?',
        a: [
          'A hash function is deliberately one-way: it is designed so there is no computationally feasible inverse operation. This is exactly the property needed for password storage — the server never needs to store or read back the original password, only compare a freshly computed hash against the one on file.',
          'This is different from encryption, which is intentionally reversible for anyone holding the correct key.',
        ],
      },
      {
        q: 'When should I use encryption instead of hashing?',
        a: [
          'Use hashing when you never need the original value back — passwords, integrity checks, deduplication. Use encryption when you do need to recover the original value later — data at rest, data in transit, anything the application itself needs to read again.',
          'Storing passwords with encryption instead of hashing is itself a common mistake: it means whoever holds the decryption key can read every password in the database, which defeats the point of not storing them in plaintext.',
        ],
      },
    ],
    related: ['/guides/what-is-hash', '/guides/what-is-base64', '/guides/what-is-jwt'],
  },
  'what-is-uuid': {
    slug: 'what-is-uuid',
    type: 'guide',
    category: 'security',
    title: 'What is a UUID?',
    subtitle: 'UUIDs explained: the 5-part structure, v1 vs v4 vs v7, uniqueness guarantees, and when to choose UUID over auto-increment.',
    readTime: '5 min read',
    datePublished: '2026-06-30',
    dateModified: '2026-06-30',
    description: 'Learn what UUIDs are, how their 128-bit structure works, the differences between UUID v1, v4, v5, and v7, and when to choose UUIDs vs auto-increment integer IDs for database primary keys.',
    tools: [
      { name: 'UUID Generator', desc: 'Generate random UUID v4 identifiers, single or bulk, with multiple format options.', href: '/tools/uuid', icon: ICONS.uuid },
    ],
    faqs: [
      {
        q: 'Is UUID v4 truly unique?',
        a: [
          'In practice, yes. UUID v4 has 122 bits of randomness, giving approximately 5.3 × 10³⁶ possible values. The probability of generating a duplicate when producing 1 billion UUIDs per second for 100 years is negligible, far smaller than the probability of a hardware failure in the same period.',
          'UUID collisions happen in theory (the birthday problem applies), but the expected number of UUIDs you must generate before seeing a collision exceeds 2.7 × 10¹⁸. In practice, UUID v4 collisions do not happen.',
        ],
      },
      {
        q: 'What is the difference between UUID and ULID?',
        a: [
          'UUID (v4) generates a random 128-bit identifier with no inherent order. ULID (Universally Unique Lexicographically Sortable Identifier) encodes a 48-bit millisecond timestamp followed by 80 random bits, in a 26-character Crockford Base32 string.',
          'ULID sorts chronologically, is URL-safe (no hyphens), and is human-readable compared to UUID. UUID v7 achieves similar time-ordered sorting within the RFC 9562 standard, making ULIDs less necessary for new projects.',
        ],
      },
      {
        q: 'Should I use UUID or auto-increment as a database primary key?',
        a: [
          'It depends on your requirements. Auto-increment integers are smaller (4-8 bytes vs 16 bytes), sequential (good for B-tree indexes), and human-friendly. They expose record counts and are not globally unique across tables or databases.',
          'UUID v4 is globally unique, merge-safe across databases, and does not expose row counts. The tradeoff is B-tree fragmentation from random values. UUID v7 solves this by being time-ordered, combining global uniqueness with sequential-insert performance.',
        ],
      },
      {
        q: 'What format should I store UUIDs in a database?',
        a: [
          'Store as a 16-byte binary column (BINARY(16) in MySQL, uuid type in PostgreSQL) for maximum efficiency: both space and index performance. This is 36% smaller than storing the canonical string form.',
          'If you must store as a string (e.g. for readability or cross-system compatibility), store the full hyphenated form (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx). Avoid stripping hyphens. It makes debugging harder for no real benefit.',
        ],
      },
    ],
    related: ['/guides/what-is-hash', '/guides/password-entropy-explained'],
  },
  'password-entropy-explained': {
    slug: 'password-entropy-explained',
    type: 'reference',
    category: 'security',
    title: 'Password Strength and Entropy Explained',
    subtitle: 'How password entropy is calculated, why length matters more than character variety, and why human-invented passwords are weaker than the math suggests.',
    readTime: '4 min read',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    description: 'Learn how password entropy is calculated (length × log2 of charset size), what it means for brute-force resistance, why length beats character-class complexity, and why humans are bad at generating truly random passwords.',
    tools: [
      { name: 'Password Generator', desc: 'Generate cryptographically secure random passwords with the browser\'s crypto API, so the entropy math actually applies.', href: '/tools/password-generator', icon: ICONS.pwdGen },
    ],
    faqs: [
      {
        q: 'How is password entropy calculated?',
        a: [
          'entropy (in bits) = length × log2(charset size). An 8-character password using only lowercase letters (26 possibilities per character) has about 37.6 bits of entropy; the same 8 characters drawn from the full printable ASCII set (~94 possibilities) has about 52.4 bits.',
          'Each additional bit doubles the number of possible passwords an attacker would need to search through.',
        ],
      },
      {
        q: 'Does adding symbols help more than adding length?',
        a: [
          'No. Going from a 26-character set to a 94-character set adds roughly 2 bits per character. Adding one more character of length adds a full multiplier\'s worth of bits regardless of charset. A longer password with fewer character classes usually beats a shorter one that is forced to include every class.',
          'This is why current guidance (NIST SP 800-63B) favors encouraging length over mandating uppercase/digit/symbol composition rules.',
        ],
      },
      {
        q: 'Why is a password I invented myself weaker than its entropy score suggests?',
        a: [
          'The entropy formula assumes every character was chosen independently and uniformly at random. Humans are not random: common substitutions (@ for a, 0 for o), keyboard patterns, and dictionary words are all things password-cracking tools specifically test for first.',
          'A password generated by a cryptographically secure random number generator does not have this weakness, because it genuinely was sampled uniformly at random from the character set.',
        ],
      },
      {
        q: 'Is a high-entropy password enough to keep an account safe?',
        a: [
          'Entropy only protects against brute-force guessing of that one password. It does nothing against credential stuffing (reusing a password leaked from a different, unrelated breach) or phishing.',
          'A unique password per site (ideally from a password manager) plus two-factor authentication protects against those other attack paths that entropy alone cannot address.',
        ],
      },
    ],
    related: ['/guides/what-is-hash', '/guides/encoding-vs-encryption-vs-hashing', '/guides/what-is-uuid'],
  },
  // Dev Utils
  'what-is-regex': {
    slug: 'what-is-regex',
    type: 'guide',
    category: 'devutils',
    title: 'What is a Regular Expression?',
    subtitle: 'Regex explained: character classes, quantifiers, anchors, groups, and practical patterns for everyday use.',
    readTime: '7 min read',
    datePublished: '2026-06-19',
    dateModified: '2026-06-19',
    description: 'Learn what regular expressions are, how to read regex syntax (character classes, quantifiers, anchors, groups), and practical patterns for emails, URLs, dates, and more.',
    tools: [
      { name: 'Regex Tester', desc: 'Test any regular expression against your own strings: live match highlighting and capture group inspection, 100% client-side.', href: '/tools/regex-tester', icon: ICONS.regex },
    ],
    faqs: [
      {
        q: 'What does the dot (.) mean in regex?',
        a: [
          'The dot matches any single character except a newline. For example, a.c matches "abc", "aXc", and "a1c", but not "ac" (there must be exactly one character in between).',
          'To match a literal dot, escape it: \\.. For example, \\d+\\.\\d+ matches decimal numbers like "3.14" but not "314".',
        ],
      },
      {
        q: 'What is the difference between * and + in regex?',
        a: [
          '* means "zero or more": it matches even if the preceding element is absent. colou*r matches both "color" and "colour".',
          '+ means "one or more": at least one occurrence is required. \\d+ matches "1", "42", "2024" but not an empty string. When in doubt, + is usually what you want.',
        ],
      },
      {
        q: 'What are capturing groups used for?',
        a: [
          'A capturing group (...) remembers the text it matched so you can refer to it later: in a replacement string ($1 or \\1) or in code (match[1] in JavaScript).',
          'Use a non-capturing group (?:...) when you only need grouping for alternation or quantifiers but do not need to extract the matched text. It is slightly faster and keeps match indices clean.',
        ],
      },
      {
        q: 'When should I use regex instead of string methods?',
        a: [
          'Prefer simple string methods (includes, startsWith, split, replaceAll) when the pattern is fixed. They are more readable and avoid regex syntax errors.',
          'Use regex when you need pattern matching: variable character classes, repetition, alternation (this or that), or extraction with groups. Any time you find yourself writing a chain of string conditions, a single regex is usually cleaner.',
        ],
      },
    ],
    related: ['/guides/regex-cheatsheet'],
  },
  'regex-cheatsheet': {
    slug: 'regex-cheatsheet',
    type: 'reference',
    category: 'devutils',
    title: 'Regex Cheatsheet',
    subtitle: 'A quick reference for regular expression syntax: character classes, quantifiers, anchors, lookarounds, flags, and common patterns.',
    readTime: '4 min read',
    datePublished: '2026-06-30',
    dateModified: '2026-06-30',
    description: 'Regex syntax cheatsheet: character classes (\\d \\w \\s), quantifiers (greedy and lazy), anchors (^ $ \\b), groups, lookaheads, lookbehinds, flags, common real-world patterns, and language differences.',
    tools: [
      { name: 'Regex Tester', desc: 'Test any pattern from this cheatsheet against your own strings: live match highlighting and group inspection.', href: '/tools/regex-tester', icon: ICONS.regex },
      { name: 'What is a Regular Expression?', desc: 'New to regex? Start with the conceptual introduction before using this reference.', href: '/guides/what-is-regex', icon: ICONS.regex },
    ],
    faqs: [
      {
        q: 'What is the difference between a greedy and a lazy quantifier?',
        a: [
          'Greedy quantifiers (*, +, ?) match as much as possible. With the pattern <.*> applied to "<b>bold</b>", a greedy .* matches everything from the first < to the last >, consuming the entire string.',
          'Lazy quantifiers (*?, +?, ??) match as little as possible. The pattern <.*?> on the same input matches each tag individually: <b>, then </b>. Add a ? after any quantifier to make it lazy.',
        ],
      },
      {
        q: 'Why doesn\'t my regex match across multiple lines?',
        a: [
          'By default, the dot (.) does not match newline characters, and ^ / $ match the start and end of the entire string. This means a pattern that assumes a single line will not match a multi-line input.',
          'To fix this: use the s (dot-all) flag to make . match newlines, and the m (multiline) flag to make ^ / $ match the start and end of each line. In JavaScript: /pattern/sm.',
        ],
      },
      {
        q: 'How do I match a literal dot or special character?',
        a: [
          'Escape it with a backslash: \\. matches a literal dot, \\* matches a literal asterisk. The special characters that need escaping are: . * + ? ^ $ { } [ ] ( ) | \\',
          'Inside a character class [...], most special characters lose their special meaning: [.] matches a literal dot. The exceptions inside a class are ], \\, ^, and -.',
        ],
      },
      {
        q: 'What are the performance implications of lookaheads?',
        a: [
          'Lookaheads and lookbehinds are zero-width. They do not consume characters, so for most patterns the performance impact is negligible.',
          'Performance problems arise from catastrophic backtracking, not lookaheads per se. Patterns like (a+)+ applied to a long non-matching string cause exponential backtracking. Use atomic groups or possessive quantifiers (not available in JavaScript) to prevent this, or restructure the pattern to avoid nested quantifiers.',
        ],
      },
    ],
    related: ['/guides/what-is-regex'],
  },
  'cron-expression-examples': {
    slug: 'cron-expression-examples',
    type: 'reference',
    category: 'devutils',
    title: 'Cron Expression Examples',
    subtitle: 'A practical reference for cron syntax: field breakdown, special characters, and ready-to-use schedules.',
    readTime: '5 min read',
    datePublished: '2026-06-19',
    dateModified: '2026-06-19',
    description: 'Learn cron expression syntax with practical examples: every minute, hourly, daily, weekly, monthly schedules, and special characters (* , - /).',
    tools: [
      { name: 'Cron Parser', desc: 'Paste any cron expression to get a plain-English description and preview the next scheduled run times.', href: '/tools/cron-parser', icon: ICONS.cron },
    ],
    faqs: [
      {
        q: 'Does cron support seconds?',
        a: [
          'Standard Unix cron uses 5 fields (minute, hour, day, month, weekday) and has no seconds field: the minimum resolution is 1 minute.',
          'Extended cron implementations like Quartz (Java), AWS EventBridge, and GitHub Actions support a 6th field for seconds, placed at the beginning: "seconds minute hour day month weekday".',
        ],
      },
      {
        q: 'How do I run a job every X minutes?',
        a: [
          'Use the step operator: */X in the minute field. For example, */15 * * * * runs every 15 minutes, and */5 * * * * runs every 5 minutes.',
          'Note that */15 means "at minutes 0, 15, 30, and 45": it always starts from 0, not from when the cron daemon started.',
        ],
      },
      {
        q: 'What timezone does cron use?',
        a: [
          'Standard cron runs in the system timezone of the server it is installed on. If your server is UTC, all schedules are UTC.',
          "Some modern schedulers (GitHub Actions, AWS EventBridge, Kubernetes CronJob) let you specify a timezone explicitly. Check your platform's documentation.",
        ],
      },
      {
        q: 'What is the difference between * and ? in cron?',
        a: [
          'In standard 5-field cron, * means "every value" and ? is not a valid character.',
          'In extended cron (Quartz, Spring), ? means "no specific value" and is used to avoid conflicts when both day-of-month and day-of-week are specified. For example, "0 0 1 * ?" means "1st of every month, any weekday".',
        ],
      },
    ],
    related: ['/guides/what-is-unix-timestamp', '/guides/what-is-regex', '/guides/regex-cheatsheet'],
  },
  'what-is-unix-timestamp': {
    slug: 'what-is-unix-timestamp',
    type: 'guide',
    category: 'devutils',
    title: 'What is a Unix Timestamp?',
    subtitle: 'Unix time explained: the epoch, seconds vs milliseconds, the Year 2038 problem, and why computers store time as a plain integer.',
    readTime: '4 min read',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    description: 'Learn what a Unix timestamp is, how to tell seconds from milliseconds, common gotchas like the Year 2038 problem and leap seconds, and why time is stored as an integer instead of a formatted date string.',
    tools: [
      { name: 'Unix Timestamp Converter', desc: 'Convert between Unix timestamps and human-readable dates, both directions, seconds or milliseconds.', href: '/tools/unix-timestamp', icon: ICONS.unix },
    ],
    faqs: [
      {
        q: 'How do I know if a timestamp is in seconds or milliseconds?',
        a: [
          'Count the digits. A real near-term date in seconds is a 10-digit number (under 10,000,000,000, which is the year 2286). The same moment in milliseconds is a 13-digit number.',
          'If you see 13 digits, divide by 1000 to get seconds before treating it as seconds-based Unix time.',
        ],
      },
      {
        q: 'What is the Year 2038 problem?',
        a: [
          'Systems that store a Unix timestamp as a signed 32-bit integer overflow at 2,147,483,647 seconds after the epoch — January 19, 2038, 03:14:07 UTC. The next second wraps to a large negative number, typically read back as a date in December 1901.',
          'Modern 64-bit systems are not affected in any practical timeframe. The risk is mostly in older embedded systems, legacy file formats, and databases still using 32-bit time fields.',
        ],
      },
      {
        q: 'Does Unix time account for leap seconds?',
        a: [
          "No. Unix time defines every day as exactly 86,400 seconds. When a leap second is inserted into UTC, Unix time does not gain a matching second — most systems either repeat a second or 'smear' the extra second across a longer window using NTP.",
          'This is invisible for everyday application logic and only matters for systems requiring sub-second precision across a leap-second event.',
        ],
      },
      {
        q: 'Why do timestamps use UTC instead of a local timezone?',
        a: [
          'A Unix timestamp has no timezone at all — it is a count of seconds since a fixed instant, identical everywhere on Earth. UTC only enters the picture when converting the integer to a human-readable string.',
          'This is why storing UTC-based timestamps and converting to the viewer\'s local timezone only at display time avoids the ambiguity of a date stored as an already-localized string.',
        ],
      },
    ],
    related: ['/guides/cron-expression-examples', '/guides/understanding-number-bases', '/guides/what-is-regex'],
  },
  'understanding-number-bases': {
    slug: 'understanding-number-bases',
    type: 'guide',
    category: 'devutils',
    title: 'Understanding Number Bases',
    subtitle: 'Binary, octal, and hexadecimal explained: how positional counting systems work, why hex maps cleanly to bits, and where each base shows up in real code.',
    readTime: '4 min read',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    description: 'Learn how binary, octal, and hexadecimal number bases work, how to convert between them, why hex maps exactly to 4-bit binary groups, and where each base is used in practice: Unix permissions, colors, network addresses, and hashes.',
    tools: [
      { name: 'Number Base Converter', desc: 'Convert any number between binary, octal, decimal, and hexadecimal instantly, with automatic prefix detection.', href: '/tools/number-base', icon: ICONS.numBase },
    ],
    faqs: [
      {
        q: 'Why does hexadecimal use letters A–F?',
        a: [
          'Hex needs 16 distinct digits per position, but decimal only supplies 10 (0–9). Letters A through F stand in for the values 10 through 15, so every value a 4-bit group can hold (0–15) has a single-character digit.',
          'This is what makes hex convenient: one hex digit always represents exactly 4 bits, with no digit ever needing two characters.',
        ],
      },
      {
        q: 'Why is hex used instead of octal for bytes and colors?',
        a: [
          'A byte is 8 bits, which splits evenly into two 4-bit hex digits (e.g. 0xFF). Octal digits are 3 bits each, so a byte does not divide evenly into octal digits, making conversion messier.',
          'Octal survives mainly in Unix file permissions, where each permission triplet (read/write/execute) is naturally 3 bits — a case where octal\'s 3-bit grouping is actually the better fit.',
        ],
      },
      {
        q: 'How do I convert hex to binary without a calculator?',
        a: [
          'Substitute each hex digit with its fixed 4-bit pattern: 0xC0 becomes 1100 0000 by replacing C with 1100 and 0 with 0000. No division or multiplication needed, since 1 hex digit always equals exactly 4 bits.',
          'Decimal does not have this clean relationship with binary, which is why decimal-to-binary conversion requires actual division, while hex-to-binary is pure lookup.',
        ],
      },
      {
        q: 'What does a bare leading zero mean in a number literal?',
        a: [
          'In C, C++, and older JavaScript, a number literal starting with a plain 0 (like 0755) is interpreted as octal, not decimal — a classic source of bugs when a decimal number is zero-padded without realizing it changes the value\'s meaning.',
          'Modern languages avoid the ambiguity by requiring an explicit prefix: 0o755 for octal, 0x1F for hex, 0b101 for binary.',
        ],
      },
    ],
    related: ['/guides/understanding-color-formats', '/guides/what-is-regex'],
  },
  'understanding-color-formats': {
    slug: 'understanding-color-formats',
    type: 'reference',
    category: 'devutils',
    title: 'HEX, RGB, and HSL Explained',
    subtitle: 'Color formats compared: how HEX, RGB, and HSL represent the same color, transparency, and WCAG contrast ratios for accessible text.',
    readTime: '4 min read',
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    description: 'Learn how HEX, RGB, and HSL represent color, how to convert between them, RGBA/HSLA transparency, and WCAG 2.1 contrast ratio thresholds for accessible text.',
    tools: [
      { name: 'Color Picker & Converter', desc: 'Pick a color visually and convert instantly between HEX, RGB, HSL, and HSB. Includes a WCAG contrast checker.', href: '/tools/color', icon: ICONS.color },
    ],
    faqs: [
      {
        q: 'Why do HEX, RGB, and HSL all exist for the same color?',
        a: [
          'They are different coordinate systems for the same color space, each convenient for a different task. RGB matches how a screen actually produces light (three color channels). HEX is RGB written compactly as hexadecimal. HSL matches how people intuitively describe color adjustments (hue, how vivid, how light/dark).',
          'All three are lossless conversions of each other — there is no "more accurate" one, only more convenient for the task at hand.',
        ],
      },
      {
        q: 'How do I read a HEX shorthand like #F0F?',
        a: [
          '3-digit HEX is only valid when each channel\'s two digits repeat. Each shorthand digit is doubled, not padded with a zero: #F0F expands to #FF00FF, not #F00F0F.',
          'If a color\'s channels do not repeat like this, it has no 3-digit shorthand and must be written in full 6-digit form.',
        ],
      },
      {
        q: 'What contrast ratio do I need for accessible text?',
        a: [
          'WCAG 2.1 AA (the commonly required minimum) requires 4.5:1 for normal text and 3:1 for large text (18pt+, or 14pt+ bold). AAA (enhanced) requires 7:1 and 4.5:1 respectively.',
          'The ratio ranges from 1:1 (identical colors, unreadable) to 21:1 (pure black on pure white, maximum possible contrast).',
        ],
      },
      {
        q: 'What is the alpha channel in RGBA and 8-digit HEX?',
        a: [
          'It controls opacity: 0 is fully transparent, 1 (RGBA/HSLA) or FF (8-digit HEX) is fully opaque. rgba(255,61,143,0.5) and #FF3D8F80 both describe the same brand pink at roughly 50% opacity.',
          '8-digit HEX opacity is not directly the percentage — it is a byte value (0-255) like the other channels, so 50% opacity is 128 (0x80), not 50 or 0x50.',
        ],
      },
    ],
    related: ['/guides/understanding-number-bases'],
  },
}
