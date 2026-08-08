import type { GuideFaq } from './guides'

export type ToolFaq = GuideFaq

// FAQ content for tool pages, kept deliberately separate from guides.ts.
// Scope per entry: this tool's own behavior, privacy, and troubleshooting
// only. Theory, comparisons, and other-language code stay in the guides
// (see AUTO_RELATED in components/SeoSection.vue for which guide each tool
// links to, and that guide's own `faqs` for what's already covered there).
export const TOOL_FAQS: Record<string, ToolFaq[]> = {
  'json-formatter': [
    {
      q: 'Is my JSON sent to a server to be formatted?',
      a: [
        'No. Formatting and validation run through the same JSON.parse your own code would call, executing in this browser tab. Nothing you paste or type here is transmitted anywhere.',
      ],
    },
    {
      q: 'Does this formatter accept trailing commas or comments, like some JSON5 tools do?',
      a: [
        'No, it enforces strict JSON: no trailing commas, no // or /* */ comments, no unquoted keys. A trailing comma and a single-quoted string are two of the specific mistakes the tool recognizes and calls out directly with a fix suggestion.',
      ],
    },
    {
      q: 'Why does the error tip disappear in Firefox or Safari but the error itself still shows?',
      a: [
        'The plain-English tip is built by pattern-matching the exact wording of Chrome/V8\'s parse error messages. Firefox and Safari phrase the same errors differently, so the tool falls back to showing just the raw error and, where available, the line and column, without guessing at a tip it can\'t verify.',
      ],
    },
    {
      q: 'Why didn\'t the tool point to a line number for my error?',
      a: [
        'V8 doesn\'t attach a numeric position to every kind of syntax error. A trailing comma inside an array, for example, only comes back with a text snippet and no offset, so the banner shows the message on its own rather than pointing at a line that might be wrong.',
      ],
    },
  ],

  'xml-to-json': [
    {
      q: 'Is my XML uploaded anywhere during conversion?',
      a: [
        'No. Parsing and building both run through fast-xml-parser inside this browser tab. Your document never leaves the page.',
      ],
    },
    {
      q: 'Why do XML attributes show up as keys starting with @ in the JSON output?',
      a: [
        'The converter prefixes attribute names with @ to keep them visually distinct from child elements and text content once everything is flattened into a single JSON object, which has no separate concept of "attribute".',
      ],
    },
    {
      q: 'Why did a numeric or boolean-looking value change type in the output?',
      a: [
        'Attribute and tag values are parsed for type, not kept as raw strings, so "123" becomes the number 123 and "true" becomes the boolean true. If you need a value to stay a string, quote it in a way your downstream code can detect, since the converter can\'t tell intent from formatting alone.',
      ],
    },
    {
      q: 'Why does a broken XML document show a line and column instead of just an error message?',
      a: [
        'The document is checked with a dedicated validator before any parsing is attempted, which returns a structured line and column for the first problem it finds, rather than parsing partway and catching whatever exception falls out.',
      ],
    },
  ],

  'jwt-decoder': [
    {
      q: 'Is it safe to paste a JWT into this decoder?',
      a: [
        'Decoding runs entirely in your browser: the header and payload segments are read with atob(), and nothing is sent to a server. The one thing to never paste anywhere, including here, is the signing secret or private key. No decoder needs it, and this one never asks for it.',
      ],
    },
    {
      q: 'Why does the tool say a token is expired when I just generated it?',
      a: [
        'Expiry is computed by comparing the token\'s exp claim against your machine\'s local clock at the moment the page renders. If exp was set to a short lifetime or a timestamp in the past, or your system clock is off, it will read as expired immediately regardless of when the token was issued.',
      ],
    },
    {
      q: 'Can this tool tell me whether a JWT\'s signature is valid?',
      a: [
        'No. Verifying a signature requires the signing key, which never appears in the token itself. This decoder only reads the first two of the token\'s three dot-separated segments, the header and payload; the signature is displayed as-is, not checked.',
      ],
    },
    {
      q: 'What happens if I paste something that isn\'t a valid JWT?',
      a: [
        'The tool expects exactly three dot-separated segments. Anything else, a missing segment, extra dots, or plain text, returns "Invalid JWT, expected 3 parts separated by dots" instead of attempting to decode it.',
      ],
    },
  ],

  uuid: [
    {
      q: 'Are the UUIDs generated here predictable, or logged anywhere?',
      a: [
        'v4 UUIDs come from crypto.randomUUID(), the browser\'s own cryptographically secure random source, not a seeded or custom algorithm. Nothing generated here is sent anywhere or kept beyond your current session.',
      ],
    },
    {
      q: 'If I generate a batch of v7 UUIDs at once, are they actually in creation order?',
      a: [
        'Yes. This generator implements RFC 9562\'s Monotonic Random method: IDs created within the same millisecond increment a running counter instead of drawing fresh random bits each time, so a batch generated back to back sorts in the order it was created.',
      ],
    },
    {
      q: 'Why does a ULID look so different from the UUIDs this tool generates?',
      a: [
        'ULID uses Crockford\'s base32 alphabet, 26 characters with no hyphens, and deliberately drops the letters I, L, O, and U to avoid confusion with 1 and 0. That\'s a different encoding from the hyphenated hexadecimal format standard UUIDs use, even though both pack the same kind of information.',
      ],
    },
  ],

  'regex-tester': [
    {
      q: 'Why does my regex behave differently here than in my Python or Go code?',
      a: [
        'This tool runs your pattern through JavaScript\'s native RegExp engine, the same one your browser uses. Syntax tied to other engines, PCRE-style possessive quantifiers and atomic groups, or Go RE2\'s lack of backreferences, won\'t behave the same way here. Treat this as a JavaScript-behavior check, not a universal validator across languages.',
      ],
    },
    {
      q: 'Why does the tool highlight every match even when I haven\'t checked the g (global) flag?',
      a: [
        'The preview always searches globally internally so it can find and mark every match in the text. The g checkbox mainly reflects what your own code would see if it used this exact pattern outside the tool.',
      ],
    },
    {
      q: 'Why don\'t some matches show up highlighted even though they\'re in the match count?',
      a: [
        'Zero-length matches, the kind a lookahead or word-boundary pattern alone can produce, are skipped in the highlighted view since there\'s no text to wrap in a highlight. They\'re still counted as real matches.',
      ],
    },
  ],

  'css-minifier': [
    {
      q: 'Is my CSS uploaded anywhere to be minified?',
      a: [
        'No. Minification runs through lightningcss compiled to WebAssembly, executing entirely in this browser tab. Your stylesheet never leaves the page.',
      ],
    },
    {
      q: 'Why doesn\'t the error message point to a line number when my CSS is invalid?',
      a: [
        'The underlying parser doesn\'t attach a usable position to any of its errors on this build, verified directly against the compiled binary rather than assumed from its API. So this tool can only show the message text here, unlike the JSON and XML tools on this site, which do get a line and column.',
      ],
    },
    {
      q: 'I got an error message I don\'t recognize. Is that a bug?',
      a: [
        'The tool rewrites the handful of error messages it has actually seen in practice (an unclosed brace, an invalid media query, a dangling combinator, a stray token) into a plainer explanation. Anything outside that set is shown as the raw message rather than a guessed fix that might be wrong.',
      ],
    },
    {
      q: 'Does this handle modern CSS like nested selectors or container queries correctly?',
      a: [
        'Yes. Minification runs through a real parser that understands CSS grammar rather than a whitespace-stripping regex, so nested selectors, custom properties, media queries, and container queries all survive intact.',
      ],
    },
  ],
}
