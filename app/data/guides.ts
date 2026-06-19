export interface GuideFaq { q: string; a: string[] }
export interface GuideToolCard { name: string; desc: string; href: string; icon: string }

export interface GuideConfig {
  slug: string
  title: string
  subtitle: string
  readTime: string
  datePublished: string
  dateModified: string
  description: string
  tools: GuideToolCard[]
  faqs: GuideFaq[]
}

export const GUIDES: Record<string, GuideConfig> = {
  'what-is-jwt': {
    slug: 'what-is-jwt',
    title: 'What is a JWT Token?',
    subtitle: 'JSON Web Tokens explained: structure, how they work, common algorithms, and security best practices.',
    readTime: '6 min read',
    datePublished: '2026-06-19',
    dateModified: '2026-06-19',
    description: 'Learn what JSON Web Tokens (JWT) are, how they work, their three-part structure (header, payload, signature), signing algorithms, and security best practices.',
    tools: [
      { name: 'JWT Decoder', desc: 'Paste any JWT to instantly inspect its header, payload, and expiration — no server, fully client-side.', href: '/tools/jwt-decoder', icon: '⟨/⟩' },
      { name: 'JWT Generator', desc: 'Create signed JWTs with custom claims and algorithm (HS256, HS384, HS512) directly in your browser.', href: '/tools/jwt-generator', icon: '⊕' },
    ],
    faqs: [
      {
        q: 'Is a JWT encrypted?',
        a: [
          'No. A JWT is base64url-encoded, not encrypted. The payload is readable by anyone who has the token — just paste it into a JWT decoder to see the contents.',
          'If you need to protect the payload from being read (not just tampered with), use a JWE (JSON Web Encryption) instead.',
        ],
      },
      {
        q: 'Where should I store a JWT on the client?',
        a: [
          'The safest option is an HttpOnly cookie — it cannot be accessed by JavaScript, so it is immune to XSS attacks. The browser sends it automatically on every request to the same domain.',
          'Storing in localStorage is common and convenient, but makes the token accessible to any JavaScript running on the page, including malicious scripts.',
        ],
      },
      {
        q: 'Can a JWT be invalidated before it expires?',
        a: [
          'Not natively — that is a known limitation of the stateless JWT model. Once issued, a token is valid until its exp timestamp, regardless of what happens server-side.',
          'Common workarounds: keep expiration times short (15 minutes), use a refresh token rotation pattern, or maintain a server-side token blocklist for critical actions like logout.',
        ],
      },
      {
        q: 'What is the difference between a JWT and a session token?',
        a: [
          'A session token is an opaque random string that maps to user state stored on the server (database or cache). Every request requires a server-side lookup to validate it.',
          'A JWT is self-contained: all the information needed to validate and identify the user is inside the token itself. The server only needs the secret key — no database call.',
        ],
      },
    ],
  },

  'what-is-base64': {
    slug: 'what-is-base64',
    title: 'What is Base64 Encoding?',
    subtitle: 'Base64 explained: how it works, why it exists, common use cases, and the difference with Base64url.',
    readTime: '5 min read',
    datePublished: '2026-06-19',
    dateModified: '2026-06-19',
    description: 'Learn what Base64 encoding is, how it converts binary data to text using 64 printable characters, when to use it, and how it differs from Base64url used in JWTs.',
    tools: [
      { name: 'Base64 Encoder / Decoder', desc: 'Encode text or binary data to Base64, or decode any Base64 string — instantly in your browser.', href: '/tools/base64', icon: '⊞' },
    ],
    faqs: [
      {
        q: 'Is Base64 the same as encryption?',
        a: [
          'No. Base64 is an encoding scheme, not encryption. Anyone can decode a Base64 string without a key — it is completely reversible.',
          'Never use Base64 to protect sensitive data. If you need to hide information, use proper encryption (AES, RSA, etc.). Base64 is only for making binary data safe to transmit through text channels.',
        ],
      },
      {
        q: 'Why does Base64 increase file size by 33%?',
        a: [
          'Base64 groups raw bytes into chunks of 3 (24 bits), then represents each chunk as 4 printable characters (6 bits each). That 3-to-4 byte ratio means every 3 bytes of input produces 4 characters of output — a 33% overhead.',
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
  },

  'how-to-validate-json': {
    slug: 'how-to-validate-json',
    title: 'How to Validate JSON',
    subtitle: 'Understand what makes JSON valid, spot the most common errors, and go further with JSON Schema.',
    readTime: '5 min read',
    datePublished: '2026-06-19',
    dateModified: '2026-06-19',
    description: 'Learn how to validate JSON: syntax rules, the most common errors (trailing commas, single quotes, unquoted keys), and how to validate structure with JSON Schema.',
    tools: [
      { name: 'JSON Formatter & Validator', desc: 'Paste any JSON to instantly validate and format it — errors are highlighted with the exact line and reason.', href: '/tools/json-formatter', icon: '{ }' },
      { name: 'JSON Schema Generator', desc: 'Generate a JSON Schema from any valid JSON value to start validating structure automatically.', href: '/tools/json-schema', icon: '⊞' },
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
          'JSON validation checks syntax — is this text a well-formed JSON document? It verifies brackets, quotes, commas, and value types.',
          'JSON Schema validation goes further — it checks structure and constraints: is "age" a number between 0 and 150? Is "email" present and a string? You define the rules in a schema document.',
        ],
      },
      {
        q: 'Are trailing commas allowed in JSON?',
        a: [
          'No. Trailing commas after the last item in an object or array are a syntax error in JSON. This is one of the most common mistakes, especially coming from JavaScript where trailing commas are allowed.',
          'Example of invalid JSON: {"name": "Jane", "age": 30,} — the comma after 30 is illegal.',
        ],
      },
    ],
  },

  'json-vs-yaml': {
    slug: 'json-vs-yaml',
    title: 'JSON vs YAML: What\'s the Difference?',
    subtitle: 'A side-by-side comparison of JSON and YAML — syntax, use cases, and when to choose one over the other.',
    readTime: '5 min read',
    datePublished: '2026-06-19',
    dateModified: '2026-06-19',
    description: 'JSON vs YAML: compare syntax, readability, comments, data types, and performance. Learn when to use JSON and when to use YAML for config files, APIs, and data exchange.',
    tools: [
      { name: 'YAML → JSON', desc: 'Convert any YAML file or snippet to JSON instantly — paste or drop a .yaml file.', href: '/tools/yaml-to-json', icon: '⇄' },
      { name: 'JSON → YAML', desc: 'Convert JSON to clean, readable YAML — paste or drop a .json file.', href: '/tools/json-to-yaml', icon: '⇄' },
    ],
    faqs: [
      {
        q: 'Is YAML a superset of JSON?',
        a: [
          'Yes — since YAML 1.2, every valid JSON document is also valid YAML. YAML parsers can read JSON directly.',
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
        q: 'Which is faster to parse — JSON or YAML?',
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
  },

  'cron-expression-examples': {
    slug: 'cron-expression-examples',
    title: 'Cron Expression Examples',
    subtitle: 'A practical reference for cron syntax: field breakdown, special characters, and ready-to-use schedules.',
    readTime: '5 min read',
    datePublished: '2026-06-19',
    dateModified: '2026-06-19',
    description: 'Learn cron expression syntax with practical examples: every minute, hourly, daily, weekly, monthly schedules, and special characters (* , - /).',
    tools: [
      { name: 'Cron Parser', desc: 'Paste any cron expression to get a plain-English description and preview the next scheduled run times.', href: '/tools/cron-parser', icon: '⏱' },
    ],
    faqs: [
      {
        q: 'Does cron support seconds?',
        a: [
          'Standard Unix cron uses 5 fields (minute, hour, day, month, weekday) and has no seconds field — the minimum resolution is 1 minute.',
          'Extended cron implementations like Quartz (Java), AWS EventBridge, and GitHub Actions support a 6th field for seconds, placed at the beginning: "seconds minute hour day month weekday".',
        ],
      },
      {
        q: 'How do I run a job every X minutes?',
        a: [
          'Use the step operator: */X in the minute field. For example, */15 * * * * runs every 15 minutes, and */5 * * * * runs every 5 minutes.',
          'Note that */15 means "at minutes 0, 15, 30, and 45" — it always starts from 0, not from when the cron daemon started.',
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
  },
}
