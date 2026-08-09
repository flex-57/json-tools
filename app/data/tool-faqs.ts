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

  'html-minifier': [
    {
      q: 'Is my HTML uploaded anywhere to be minified?',
      a: [
        'No. Minification runs in your browser through html-minifier-terser. Nothing you paste here is sent to a server.',
      ],
    },
    {
      q: 'The underlying library doesn\'t report a line number for parse errors. How does this tool show one?',
      a: [
        'When the parser gives up, the text it leaves unconsumed is always an exact suffix of your original document. This tool measures how much was consumed before that point to derive the line and column, rather than guessing.',
      ],
    },
    {
      q: 'My HTML has a broken <script> tag. Why did the rest of the page still minify?',
      a: [
        'A broken embedded script doesn\'t fail the whole document: that one block is left unminified and a warning names which script had a problem. The line number in that warning is relative to the script block itself, not the document, since that\'s what the underlying tool reports.',
      ],
    },
    {
      q: 'The tool seems stuck on a large file. Is it frozen?',
      a: [
        'It shouldn\'t hang indefinitely: minification is bounded by an internal timeout, so a rare stall in the embedded CSS/JS minification step surfaces as a clear timeout message instead of leaving the page stuck with no explanation.',
      ],
    },
  ],

  'js-minifier': [
    {
      q: 'Is my JavaScript uploaded anywhere to be minified?',
      a: [
        'No. Minification runs in your browser through terser. Nothing you paste here is sent to a server.',
      ],
    },
    {
      q: 'Why does it say "TypeScript is not supported" instead of showing a parse error?',
      a: [
        'The tool checks for common TypeScript-only syntax, interface declarations, type aliases, as casts, primitive type annotations, before attempting to minify, and returns a plain message instead of a confusing low-level parser failure. Strip the type annotations first if you need the plain JavaScript minified.',
      ],
    },
    {
      q: 'Does this handle JSX?',
      a: [
        'No, and it\'s detected and rejected the same explicit way as TypeScript. terser only understands plain JavaScript, so run JSX through your build tool\'s transpiler first.',
      ],
    },
    {
      q: 'How accurate is the line number shown for a JS error here?',
      a: [
        'It comes directly from terser\'s own SyntaxError, which carries a real line and column, so it\'s reliable, unlike this site\'s CSS minifier, whose underlying parser doesn\'t expose a position at all.',
      ],
    },
  ],

  base64: [
    {
      q: 'Is my data uploaded anywhere to be encoded or decoded?',
      a: [
        'No. Both directions run through the browser\'s own btoa/atob functions on this page. Nothing you type or paste is sent anywhere.',
      ],
    },
    {
      q: 'Does this tool handle emoji or non-English text correctly?',
      a: [
        'Yes. Plain btoa() alone breaks on anything outside Latin-1, so this tool wraps it with encodeURIComponent/decodeURIComponent first to correctly round-trip UTF-8 text, emoji included.',
      ],
    },
    {
      q: 'What does the standard/URL-safe toggle actually change in the output?',
      a: [
        'URL-safe replaces + with - and / with _, and strips the trailing = padding, which is what JWTs and query parameters expect. Switching the toggle re-encodes your current input in the other form rather than just relabeling it.',
      ],
    },
    {
      q: 'Why do I just get "Invalid Base64 input" instead of a specific reason when decoding fails?',
      a: [
        'The tool normalizes any decoding failure to that one message rather than surfacing the raw browser error, since the exact wording of that error differs between browsers and isn\'t something you can act on either way.',
      ],
    },
  ],

  'url-encode': [
    {
      q: 'Is my text sent anywhere to be encoded or decoded?',
      a: [
        'No. Both directions run through the browser\'s own encodeURIComponent/encodeURI functions on this page. Nothing is sent to a server.',
      ],
    },
    {
      q: 'Why does my output still contain a raw & or = after encoding?',
      a: [
        'Check which variant is selected. The "full URI" mode deliberately leaves structural characters like & = ? / intact since they belong to URL syntax; switch to "component" mode to encode a single value that will be placed inside a query parameter.',
      ],
    },
    {
      q: 'Why do I get "Invalid percent-encoded sequence" when decoding?',
      a: [
        'That happens when the input has a % not followed by two valid hex digits, or a truncated multi-byte UTF-8 sequence. The browser\'s decode functions throw on malformed input rather than guessing, and this tool shows that as one consistent message.',
      ],
    },
  ],

  hash: [
    {
      q: 'Is my text sent anywhere to compute these hashes?',
      a: [
        'No. SHA-1 through SHA-512 run through the browser\'s native Web Crypto API, and MD5 through a small implementation on this page, both entirely client-side.',
      ],
    },
    {
      q: 'Why does this tool implement MD5 itself instead of using the browser\'s crypto API for it too?',
      a: [
        'The Web Crypto API\'s digest() function only supports the SHA family; browsers never shipped native MD5 support. This tool includes a standalone MD5 implementation (RFC 1321) specifically to cover that gap.',
      ],
    },
    {
      q: 'Are all five hashes computed from the same input at once?',
      a: [
        'Yes, every algorithm runs on whatever text is currently in the input box, computed together rather than one at a time, so you can compare them side by side immediately.',
      ],
    },
  ],

  'password-generator': [
    {
      q: 'Are these passwords predictable, or could someone reproduce them?',
      a: [
        'No. Every character is chosen using crypto.getRandomValues(), the browser\'s cryptographically secure random source, not Math.random() or any seeded algorithm. Nothing generated here is sent anywhere.',
      ],
    },
    {
      q: 'What does "exclude ambiguous characters" actually remove?',
      a: [
        'It strips 0, O, l, 1, and I from whichever character set you\'ve enabled, the characters most likely to be misread when a password is written down or read aloud. It reduces the character set slightly, which the entropy number updates to reflect.',
      ],
    },
    {
      q: 'Why is there a minimum and maximum length?',
      a: [
        'Length is clamped between 4 and 64. Below 4 there isn\'t enough room for a meaningful character mix, and 64 is generous enough for any realistic use while keeping the field predictable to work with.',
      ],
    },
  ],

  'json-diff': [
    {
      q: 'Will differences in whitespace or indentation between my two documents show up as changes?',
      a: [
        'No. Both sides are re-serialized with the same 2-space indentation before comparing, so only actual differences in the data show up, not how either document happened to be formatted originally.',
      ],
    },
    {
      q: 'If I just reorder keys without changing any values, will that show as a difference?',
      a: [
        'Yes. The comparison works on the two documents as formatted text, line by line, not as a structural match of keys regardless of position, so a key that moved shows as one removed line and one added line even though its value never changed.',
      ],
    },
    {
      q: 'How does the tool know which side has the error when only one document is invalid?',
      a: [
        'Each side is parsed on its own rather than in one combined attempt, so a syntax error is attributed to the exact editor, left or right, where it actually is.',
      ],
    },
  ],

  'json-tree': [
    {
      q: 'Why does the tree stop showing everything on a very large file?',
      a: [
        'Rendering is capped at 5,000 nodes so an unusually large or flat payload can\'t freeze the tab with tens of thousands of DOM rows. A truncated branch still tracks its real size, so you can see how many items were left out even though they aren\'t all rendered.',
      ],
    },
    {
      q: 'Does the search box match keys, values, or both?',
      a: [
        'Both. A search term matches a node\'s own key name or its value if it\'s a leaf, and a branch counts as matching if anything inside it matches, not only its own key.',
      ],
    },
    {
      q: 'What does the path shown for a node mean?',
      a: [
        'It\'s the route from the root to that node: dot notation for object keys and bracket notation with an index for array items, for example users[0].name.',
      ],
    },
  ],

  'jwt-generator': [
    {
      q: 'Is my secret key sent anywhere when I generate a token?',
      a: [
        'No. Signing runs through the Web Crypto API\'s native HMAC implementation directly in your browser. The secret and the resulting token never leave the page.',
      ],
    },
    {
      q: 'Can this generate a token signed with RS256 or another asymmetric algorithm?',
      a: [
        'No, only the HMAC family (HS256, HS384, HS512) is supported. Those need just one shared secret this tool can hold entirely client-side; RS256 and similar need a private key pair, a different trust model than typing a secret into a browser tool.',
      ],
    },
    {
      q: 'What do the "Set iat to now" and "add exp" buttons actually do?',
      a: [
        'They edit the payload JSON directly: setting iat to the current Unix timestamp, or adding an exp a chosen number of hours after iat, rather than tracking those as separate fields outside the payload you can see and edit.',
      ],
    },
  ],

  'cron-parser': [
    {
      q: 'Does this tool understand shortcuts like @daily or @hourly?',
      a: [
        '@yearly, @annually, @monthly, @weekly, @daily, @midnight, and @hourly are all recognized and normalized to their standard 5-field equivalent before parsing; @daily becomes 0 0 * * *.',
      ],
    },
    {
      q: 'Why did the plain-English description show my job running on more days than I expected?',
      a: [
        'When both the day-of-month and day-of-week fields are restricted (neither is *), standard cron treats them as OR, not AND: a match on either field is enough. This tool follows that same rule, which surprises people since it reads like it should require both.',
      ],
    },
    {
      q: 'How far ahead does the "next executions" preview look?',
      a: [
        'Up to 5 upcoming run times, searched minute by minute across a 4-year window. An expression that only matches something further out than that comes back with an empty list rather than searching indefinitely.',
      ],
    },
  ],

  'gpt-token-counter': [
    {
      q: 'Is my text sent anywhere to count tokens?',
      a: [
        'No. Counting runs through the gpt-tokenizer library, loaded on demand and executed entirely in your browser. Nothing you paste here is transmitted.',
      ],
    },
    {
      q: 'Will this give the same count as GPT-3.5 or the original GPT-4?',
      a: [
        'No. Those models use the older cl100k_base encoding, a different vocabulary that produces different counts for identical text. This tool matches GPT-4o, o1, and o3 specifically, which all use o200k_base.',
      ],
    },
    {
      q: 'Why is this scoped to OpenAI models only, not Claude or Gemini too?',
      a: [
        'Counting those accurately isn\'t possible as a pure browser tool right now, since neither ships an offline JavaScript tokenizer comparable to OpenAI\'s. See our guide on tokens for the full breakdown of what each provider actually offers.',
      ],
    },
  ],

  hmac: [
    {
      q: 'Why isn\'t HMAC-MD5 offered, when the plain Hash Generator on this site includes MD5?',
      a: [
        'Web Crypto\'s subtle.sign only accepts a SHA-family algorithm as the underlying hash for HMAC, there\'s no MD5 option to pass it. The Hash Generator works around that same kind of gap for plain hashing with its own hand-rolled MD5, but repeating that here wasn\'t worth it: none of the schemes HMAC actually gets used for, webhook signatures, AWS SigV4, JWT HS256, ever specify MD5.',
      ],
    },
    {
      q: 'Does the signature update as I type, or do I need to click a button?',
      a: [
        'It updates on its own, about 120ms after you stop typing in either the message or the secret field. There\'s no compute button; the short delay just avoids recalculating four signatures on every keystroke.',
      ],
    },
    {
      q: 'What does switching between Hex and Base64 actually change?',
      a: [
        'Nothing about the signature itself, only how its raw bytes are displayed. Hex is longer but easy to compare character by character; Base64 is shorter and is what most APIs, Stripe and GitHub webhook headers among them, put in the header you\'re checking against.',
      ],
    },
    {
      q: 'Why do all four signatures stay blank until I fill in both fields?',
      a: [
        'An HMAC needs both a message and a secret to mean anything. With either one empty, the tool leaves all four results blank rather than computing a signature against an empty string, which would look valid but wouldn\'t match anything a real client sends.',
      ],
    },
  ],

  'unix-timestamp': [
    {
      q: 'How does the tool decide whether a plain number is seconds or milliseconds?',
      a: [
        'Anything typed as pure digits (with an optional leading minus) is compared against one cutoff: 1,000,000,000,000. Below it, the number is treated as seconds; at or above it, as milliseconds. That split holds up in practice because a seconds-based timestamp won\'t reach 13 digits until roughly the year 33,658, while a milliseconds-based timestamp for any recent date already exceeds it.',
      ],
    },
    {
      q: 'What date formats can I type besides a raw number?',
      a: [
        'Anything JavaScript\'s own Date constructor can parse. ISO 8601 (2026-06-11T14:32:00Z) parses reliably everywhere, and looser strings like June 11 2026 usually work too. That looser parsing isn\'t governed by a real standard, so an ambiguous format can be read differently across browsers, ISO 8601 or a raw Unix number are the only fully safe bets.',
      ],
    },
    {
      q: 'Does the "3 hours ago" relative time freeze once it\'s shown, or keep updating?',
      a: [
        'It keeps updating on its own: the tool re-evaluates that label every 30 seconds so a tab left open doesn\'t drift out of date, while the timestamp you entered and the other converted fields stay fixed to whatever you typed.',
      ],
    },
    {
      q: 'Why does the tool accept a negative number as input?',
      a: [
        'A negative Unix timestamp is a legitimate date before the epoch, January 1, 1970: -86400 is December 31, 1969. The parser accepts a leading minus sign for exactly that case instead of treating anything below zero as invalid.',
      ],
    },
  ],

  'number-base': [
    {
      q: 'What\'s the largest number this converter can handle?',
      a: [
        'There\'s no practical limit. Conversion runs on JavaScript\'s BigInt rather than the regular Number type, so it isn\'t capped at the usual 9,007,199,254,740,991 safe-integer boundary, a 100-digit hex value converts exactly, with no precision loss, in every base at once.',
      ],
    },
    {
      q: 'Does a negative number convert to two\'s complement binary?',
      a: [
        'No. The sign is kept separate from the magnitude: -10 converts to -1010 in binary, not the bit pattern two\'s complement would produce in a fixed-width CPU register. If you specifically need two\'s complement for a known bit width, this tool doesn\'t produce that, it\'s a plain sign-and-magnitude conversion.',
      ],
    },
    {
      q: 'Can I paste a number that already has separators, like 0xFF_A0 or 1 000 000?',
      a: [
        'Yes. Underscores and spaces are stripped from the input before it\'s parsed, so a value copied straight out of source code, which often groups digits with underscores, or written with spaced-out thousands, converts without needing to be cleaned up first.',
      ],
    },
    {
      q: 'The decimal result shows underscores between digits, will that break if I paste it into code?',
      a: [
        'No. The underscores are display-only, meant to make a long number easier to read at a glance. The Copy button copies the plain digits with no separators at all.',
      ],
    },
  ],

  'svg-optimizer': [
    {
      q: 'Why does an invalid SVG show an exact line and column instead of just an error message?',
      a: [
        'SVGO\'s own parser throws its error in a fixed shape, <input>:LINE:COL: reason, whenever it hits malformed XML. This tool reads the position straight out of that error rather than re-parsing to locate it, the same jump-to-line behavior the JSON and XML tools on this site provide from their own parsers.',
      ],
    },
    {
      q: 'Is my SVG uploaded anywhere to optimize it?',
      a: [
        'No. SVGO runs compiled for the browser, and both the optimization and the before/after preview happen entirely in this tab. Nothing you paste or drop here is sent to a server.',
      ],
    },
    {
      q: 'Why does the optimizer run the file through SVGO twice (multipass)?',
      a: [
        'Some SVGO passes create new opportunities for other passes, collapsing a group can expose an attribute another plugin would otherwise leave alone. Multipass reruns the full plugin set until a pass produces no further change, so there\'s no benefit to feeding the output back in for a second round, it\'s already been through that loop.',
      ],
    },
    {
      q: 'How does this compare to running SVGO through a build plugin like vite-plugin-svgo?',
      a: [
        'Same SVGO engine and default plugin set, so the result should be equivalent for identical input. The real difference is when it runs: a build plugin optimizes automatically as part of your bundler pipeline, while this tool is for a one-off file you\'re handling outside that pipeline, dropped into a CMS or design system, for example.',
      ],
    },
  ],

  'svg-to-jsx': [
    {
      q: 'Why do some elements come out self-closing (<circle ... />) and others expand across multiple lines?',
      a: [
        'It mirrors the source structure. An element with no children, like a typical <circle> or <path>, stays self-closing; an element that actually contains other elements gets expanded onto indented lines matching how it was nested in the original SVG.',
      ],
    },
    {
      q: 'What happens to a style="..." attribute?',
      a: [
        'It\'s converted into a JS object with every key and value written as a quoted string: style="opacity:0.5;fill:red" becomes style={{ "opacity": "0.5", "fill": "red" }}. Numeric-looking values stay quoted too, since React accepts numeric CSS values as strings anyway, and guessing which properties are meant to be unitless numbers isn\'t reliable enough to get right every time.',
      ],
    },
    {
      q: 'What if an attribute\'s value itself contains a double quote character?',
      a: [
        'The converter switches to single quotes for that one attribute instead. If the value contains both a double and a single quote, which neither quoting style can hold safely, it falls back to a JS expression with the value escaped inside, since JSX string attributes, unlike JS string literals, don\'t support backslash escaping.',
      ],
    },
    {
      q: 'What does turning off "Wrap in component" change in the output?',
      a: [
        'You get the bare JSX markup on its own, with no function declaration or return statement around it, meant for pasting directly into an existing component\'s return value rather than as a standalone file.',
      ],
    },
  ],

  color: [
    {
      q: 'Does the picker track color as RGB internally, or something else?',
      a: [
        'HSB (hue, saturation, brightness) is the source of truth, matching the picker UI directly: the square controls saturation and brightness, the rainbow strip controls hue. Every other format, HEX, RGB, HSL, is derived from that HSB state on the fly rather than stored separately, so editing any one field recalculates all four.',
      ],
    },
    {
      q: 'Why don\'t the shade swatches match my exact color\'s saturation?',
      a: [
        'They\'re generated from a fixed formula: your hue, held at a constant 65% saturation, stepped through HSL lightness values from 95% down to 15%. That produces a consistent, usable tonal ramp regardless of how saturated your starting color is, rather than a literal lighten or darken of your exact HSB values.',
      ],
    },
    {
      q: 'If I paste a 6-digit HEX or a 3-value RGB into a field, does it keep my current transparency?',
      a: [
        'No, it resets to fully opaque. Only the alpha-inclusive forms, 8-digit HEX or a 4-value RGB, HSL, or HSB, carry a transparency value; the shorter forms are read as a request for a fully opaque color.',
      ],
    },
    {
      q: 'What happens if I type something invalid into one of the format fields?',
      a: [
        'Nothing recalculates. An unparseable value stays in that field exactly as typed rather than being reverted or flagged, while the picker, preview, and the other three fields keep showing whatever the last valid color was until you correct it to something the tool can parse.',
      ],
    },
  ],

  'csv-to-json': [
    {
      q: 'Why did a column like "00501" or "true" come out as a number or boolean instead of a string?',
      a: [
        'The parser inspects every cell and converts anything that looks numeric or boolean to its real type rather than leaving everything as a string. That\'s usually what you want, but it means a value like a zip code with a leading zero loses that zero, "00501" becomes the number 501, since there\'s currently no per-column toggle to keep a specific field as text.',
      ],
    },
    {
      q: 'Why is "Auto" an option for the delimiter here, but not on the JSON to CSV page?',
      a: [
        'Auto-detection makes sense when reading real CSV data, the parser can look at the actual characters and guess whether it\'s comma, semicolon, or tab-delimited. Going the other direction, there\'s nothing to detect: you\'re choosing which delimiter to write, not guessing one from existing text.',
      ],
    },
    {
      q: 'Why does the error banner only say "around line N" instead of giving an exact line?',
      a: [
        'The underlying CSV parser reports an error as a row index into the data it already parsed, not a line number in your original file. This tool adds back the header row to approximate a source line, but a blank line skipped earlier in the file can throw that estimate off, hence "around" rather than an exact claim.',
      ],
    },
    {
      q: 'What happens to a blank line in the middle of my CSV data?',
      a: [
        'It\'s skipped silently rather than turning into an empty row of nulls in the JSON output. This matches how most spreadsheet exports already treat stray blank lines, so a file with occasional gaps doesn\'t need to be cleaned up first.',
      ],
    },
  ],

  'json-to-csv': [
    {
      q: 'What happens if my JSON is a single object instead of an array?',
      a: [
        'It\'s wrapped in a one-element array automatically, so a single object still converts to a one-row CSV instead of failing. The converter is built around arrays of records, but a lone object is treated as a record count of one rather than an error.',
      ],
    },
    {
      q: 'Why do I get "Array is empty" instead of just an empty CSV file for []?',
      a: [
        'An empty array has no keys to derive column headers from, so there\'s nothing meaningful to write. The tool says so directly rather than silently producing a header-less, content-less file that would look like the conversion had failed for no visible reason.',
      ],
    },
    {
      q: 'Does the CSV update as I type, or do I need to press a button?',
      a: [
        'It updates on every keystroke, no button and no delay. Converting JSON to CSV is a single cheap pass, not something like this site\'s HMAC generator, which debounces because it\'s recomputing four cryptographic signatures at once.',
      ],
    },
    {
      q: 'Why does this converter offer a semicolon delimiter option, not just comma?',
      a: [
        'A plain comma-delimited file opens as a single garbled column in Excel set to a European locale, where the comma is already the decimal separator (see our CSV guide for why that happens). Picking semicolon here up front produces a file that opens correctly without a manual fix afterward.',
      ],
    },
  ],

  'excel-to-json': [
    {
      q: 'What happens if a very large or corrupted file takes too long to process?',
      a: [
        'Processing is capped at 30 seconds. If it runs longer than that, the worker handling the file is terminated and a timeout error is shown, rather than leaving the page hanging with no explanation.',
      ],
    },
    {
      q: 'Why does switching between sheets take a moment instead of being instant?',
      a: [
        'Switching sheets re-runs the conversion from scratch rather than swapping between sheets already held in memory. For most spreadsheets that\'s not noticeable, but a very large workbook with many sheets will re-parse each time you switch.',
      ],
    },
    {
      q: 'Can I drop a .csv or .ods file here too, not just .xlsx or .xls?',
      a: [
        'Yes. The underlying library (SheetJS) reads OpenDocument spreadsheets and CSV files the same way it reads Excel workbooks, and the file picker accepts all four extensions even though the page focuses on Excel in its name.',
      ],
    },
    {
      q: 'What happens if my browser can\'t create the Web Worker, for example because of a restrictive extension?',
      a: [
        'The conversion fails with a clear "Worker unavailable" message rather than hanging or silently doing nothing. Nothing partially processes; either the worker starts and handles the file, or you get an explicit error.',
      ],
    },
  ],

  'json-to-excel': [
    {
      q: 'Why does the preview table update instantly, but I still have to click Download to get the actual file?',
      a: [
        'The preview runs a quick parse directly in the page just to render up to five rows. Generating the real .xlsx binary happens in a separate Web Worker and only runs when you click Download, since building a full spreadsheet file on every keystroke would be wasted work almost every time.',
      ],
    },
    {
      q: 'Does the downloaded file only contain the first 5 rows shown in the preview?',
      a: [
        'No. The preview is capped at five rows purely to keep the table on screen readable; the actual download processes and includes every row in your JSON array, however many there are.',
      ],
    },
    {
      q: 'My JSON is valid but the download still fails. What does that mean?',
      a: [
        'That\'s a separate failure from a JSON syntax error, it means the worker itself hit a problem while building the spreadsheet from otherwise-valid data. The tool keeps the two apart deliberately, so a real syntax mistake in your input isn\'t confused with a generation problem on a file that was actually fine.',
      ],
    },
    {
      q: 'Why does the preview only show columns from the first object in my array, even when a later object has an extra key?',
      a: [
        'The preview derives its column headers only from the first item in your array, purely so the table has something to render quickly. If your data has inconsistent keys across objects, check the downloaded file directly rather than relying on the five-row preview to catch every column.',
      ],
    },
  ],

  'toml-to-json': [
    {
      q: 'Why does the error banner show a short message instead of the parser\'s more detailed explanation?',
      a: [
        'The underlying parser\'s full error includes a multi-line snippet of your document with a caret pointing at the problem, useful in a terminal but redundant here. This tool keeps only the first line of that message and relies on the line/column highlight in the editor to show the actual location instead.',
      ],
    },
    {
      q: 'Why did my TOML value nan or inf turn into null in the JSON output?',
      a: [
        'TOML has real nan, inf, and -inf float literals, but JSON has no way to represent a non-finite number at all. JSON.stringify silently converts any of them to null rather than throwing, so there\'s no error for the conversion to show you. If a value in your config might be one of these, check for it separately rather than trusting the JSON output.',
      ],
    },
    {
      q: 'Does the converter handle TOML\'s hex, octal, and binary integer literals, like 0xFF or 0b1010?',
      a: [
        'Yes, along with underscore-grouped numbers like 1_000_000. All of TOML\'s integer literal formats parse correctly and come out as plain decimal numbers in the JSON output, since JSON has only one number type regardless of how the original value was written.',
      ],
    },
  ],

  'json-to-toml': [
    {
      q: 'The TOML to JSON direction turns a native TOML date into an ISO string. Does converting back turn that string into a real TOML date again?',
      a: [
        'No. This direction has no way to tell an ISO-8601-looking string apart from any other string, so it\'s written out as a quoted TOML string, "2024-01-15T09:00:00Z", not the unquoted native date-time type TOML also supports. Both read back as the same value in most tools, but it isn\'t a byte-for-byte round trip of an original TOML file.',
      ],
    },
    {
      q: 'What happens to a JSON key that isn\'t a valid bare TOML key, like one containing a space?',
      a: [
        'It gets wrapped in double quotes automatically: {"first name": "Alice"} becomes "first name" = "Alice". A key using only letters, digits, underscores, and dashes needs no quoting and is left bare, even one starting with a digit, TOML\'s bare-key rule allows that.',
      ],
    },
    {
      q: 'I need a value to come out as a TOML float, like price = 5.0, not an integer. Why does it come out as 5 instead?',
      a: [
        'JSON and JavaScript don\'t distinguish 5.0 from 5, they\'re the exact same number. That distinction is already gone by the time your JSON reaches this converter, so there\'s no way to recover whether you originally meant a float or an integer. If a downstream TOML consumer requires the float form specifically, edit the output by hand after converting.',
      ],
    },
  ],

  'json-to-xml': [
    {
      q: 'What happens if my JSON object has more than one top-level key?',
      a: [
        'It\'s wrapped in a single <root> element automatically, {"a":1,"b":2} produces <root><a>1</a><b>2</b></root>, rather than emitting each key as its own sibling element with nothing wrapping them, which would not be well-formed XML. A JSON object with exactly one key still becomes its own natural root with no extra wrapper, since that\'s already valid on its own.',
      ],
    },
    {
      q: 'What happens if I paste a top-level JSON array instead of an object?',
      a: [
        'It\'s wrapped as <root><item>...</item>...</root>, one <item> per array entry, rather than naming each element after its numeric index, which isn\'t valid XML (an element name can\'t start with a digit). [1,2,3] produces <root><item>1</item><item>2</item><item>3</item></root>.',
      ],
    },
    {
      q: 'How do I make a key become an XML attribute instead of a child element?',
      a: [
        'Prefix it with @, the same convention this site\'s XML → JSON converter uses in reverse: {"user":{"@id":1,"name":"Alice"}} produces <user id="1"><name>Alice</name></user>.',
      ],
    },
    {
      q: 'Do special characters like & or < in my JSON strings need to be escaped manually first?',
      a: [
        'No. Text content is escaped automatically to the XML entities a parser expects, & becomes &amp;, < becomes &lt;, and so on, so a string like "Tom & Jerry" comes out safely without you having to touch it.',
      ],
    },
  ],

  'yaml-to-json': [
    {
      q: 'Does this tool have the "Norway problem" our YAML guide describes, where a country code like NO gets misread as false?',
      a: [
        'No. js-yaml, the library behind this converter, only treats true and false as booleans by default, yes, no, on, and off are all left as plain strings. A country code "NO" converts to the string "NO" here, not the boolean false, unlike the older YAML 1.1 parsers the guide\'s warning is really about.',
      ],
    },
    {
      q: 'Why does the error banner give an exact line and column for badly indented YAML?',
      a: [
        'The parser throws a structured error carrying the exact position where it lost track of the document, rather than just a text message. This tool reads that position directly instead of guessing it from the text, the same reasoning behind the line/column reporting on the JSON and XML tools on this site.',
      ],
    },
    {
      q: 'Why does the converter error on a Kubernetes manifest or other file with multiple YAML documents separated by ---?',
      a: [
        'This tool parses exactly one YAML document at a time. A single leading --- at the top of a file is fine and won\'t trigger this, but two or more --- separated documents in one file raise "expected a single document in the stream" instead of converting just the first one. Split a multi-document file into individual documents and convert each one separately.',
      ],
    },
    {
      q: 'Why did an unquoted version number like 1.20 come out as 1.2 in the JSON?',
      a: [
        'YAML parses an unquoted 1.20 as the floating-point number 1.2, the trailing zero has no meaning to a number and is dropped, the same way it would be if you typed 1.20 into any calculator. This is a real, common gotcha with version-like values (a Docker tag, a Kubernetes minor version), quote the value in the source YAML, "1.20", if it needs to survive as text.',
      ],
    },
  ],

  'json-to-yaml': [
    {
      q: 'Why does a value like "yes" or the country code "NO" come out quoted in the YAML, even though this site\'s own YAML → JSON converter wouldn\'t misread them as booleans?',
      a: [
        'This direction quotes defensively for compatibility with stricter or older YAML parsers elsewhere, Python\'s PyYAML and Go\'s gopkg.in/yaml.v2 among them, which do still read yes, no, on, and off as booleans under YAML 1.1 rules. Quoting here protects your data even if it ends up read by a parser more permissive than this site\'s own.',
      ],
    },
    {
      q: 'Why does a long string value stay on one line instead of wrapping like some YAML output does?',
      a: [
        'Line wrapping is explicitly disabled for this conversion. By default many YAML writers fold a long string across multiple lines using a block-scalar marker once it passes about 80 characters, which is tidy to read but changes how the value looks on the page. Keeping every value on one line makes the output easier to diff and grep, at the cost of long lines not wrapping visually.',
      ],
    },
    {
      q: 'Will a value like a time, "10:30", break the YAML output since colon normally separates a key from its value?',
      a: [
        'No. Any string containing a colon followed by a space is automatically wrapped in quotes in the output, \'10:30\' rather than 10:30, specifically so it can\'t be misread as starting a new key. You don\'t need to pre-escape colons, or anything else, in your JSON before converting.',
      ],
    },
  ],

  'json-schema': [
    {
      q: 'If my array has objects with different shapes, does the generator produce a separate schema for each one?',
      a: [
        'No, it merges them into a single object schema instead of using oneOf. A key present in every item is marked required; a key missing from at least one item is still included in properties but left out of required, so the merged schema accepts the full range of shapes your array actually contains.',
      ],
    },
    {
      q: 'When does the generator actually use oneOf?',
      a: [
        'Only when array items are genuinely different value types, not just differently-shaped objects, a mix of strings, numbers, and objects, for example. Differently-shaped objects get merged into one combined schema instead; oneOf is reserved for cases a single object schema truly can\'t represent.',
      ],
    },
    {
      q: 'Why did an empty array produce {"type":"array","items":{}} instead of something more specific?',
      a: [
        'There\'s nothing in an empty array to infer a shape from, so items is left as an empty schema, which matches anything, rather than guessing a type it has no evidence for. Fill in a real example and regenerate once you have at least one item to base it on.',
      ],
    },
    {
      q: 'Why did a field come out typed "integer" when I know it can sometimes hold a decimal?',
      a: [
        'The generator infers each field\'s type from the one example value in your pasted JSON; if that value happens to be whole, like 5, it\'s typed integer. A schema built from a single sample only reflects what that sample looked like, so it\'s worth loosening a type by hand afterward for any field you know can vary in ways your example didn\'t show.',
      ],
    },
  ],

  'json-to-ts': [
    {
      q: 'Why does a numeric value always come out as "number" here, when the JSON Schema Generator on this site distinguishes integer from number?',
      a: [
        'TypeScript itself only has one numeric type; there\'s no separate integer type to generate even for a whole number like 5. That\'s different from JSON Schema, which does define integer and number as distinct keywords, so the schema generator keeps that distinction where this one has nothing to keep it in.',
      ],
    },
    {
      q: 'What happens if I set the "Name" field to something that isn\'t a valid TypeScript identifier, like one with a space?',
      a: [
        'It\'s sanitized rather than inserted as-is: spaces and dashes become underscores, other invalid characters are stripped, and a name starting with a digit gets an underscore prefixed onto it. "My Type" becomes My_Type, "123Foo" becomes _123Foo, so the output always compiles even if the exact name isn\'t byte-for-byte what you typed.',
      ],
    },
    {
      q: 'Does the .strict() toggle in Zod mode apply to nested objects too, or just the top-level one?',
      a: [
        'Just the top-level object. .strict() is appended once, to the outermost z.object(...) only, so a nested object several levels deep will still silently allow unknown keys even with the toggle on. Add .strict() to a nested object by hand in the generated code if you need that enforced deeper in the structure.',
      ],
    },
    {
      q: 'When an array merges objects and a key holds a nested object with different shapes across items, does that nested key get merged into one type too?',
      a: [
        'No, only the outer array level gets the smart merge. A key whose value is itself an object with two different shapes across array items comes out as a union of both full object literals, "user: { a: string } | { a: string; b: number }", rather than one combined type for that key. Simplify that field by hand if you want a single merged shape instead of a union.',
      ],
    },
  ],

  'box-shadow': [
    {
      q: 'Can I import a shadow value that uses a CSS variable for its color, like var(--shadow-color)?',
      a: [
        'Yes. The importer looks for an rgba/hsla function or a hex code first, and falls back to whatever single token in the value isn\'t a plain number, which a var(...) reference matches just as well as a named color like tomato. It\'s carried through unchanged rather than being rejected as unparseable.',
      ],
    },
    {
      q: 'What happens if I paste a shadow value with no color at all, like 10px 10px?',
      a: [
        'It\'s accepted, and the color defaults to #000000 (solid black) rather than being rejected. Only the two offset numbers are actually required, blur and spread default to 0 and color defaults to black if you don\'t specify them.',
      ],
    },
    {
      q: 'Why doesn\'t importing two layers with rgba(...) colors get cut apart at the commas inside those colors?',
      a: [
        'The importer only splits on a comma when it\'s outside any parentheses, tracking paren depth as it scans, so 0 4px 12px rgba(0,0,0,.15), inset 0 0 2px rgba(255,255,255,.5) correctly becomes two layers, not five fragments cut at every rgba() argument.',
      ],
    },
    {
      q: 'Do I need to specify all four length values, offset-x, offset-y, blur, and spread, for an import to work?',
      a: [
        'No, just the first two. offsetX and offsetY are the only required numbers; blur and spread are both assumed to be 0 if you leave them out. Fewer than two numeric values in the pasted text is what actually makes the importer give up.',
      ],
    },
  ],

  gradient: [
    {
      q: 'What happens if I keep clicking "+ Add stop" instead of dragging any sliders?',
      a: [
        'Each new stop is placed 10 percentage points past the current furthest stop, capped at 100%. Once a stop is already at 100%, every stop you add after that also lands at exactly 100%, stacking several stops on top of each other at the same position instead of spreading out automatically.',
      ],
    },
    {
      q: 'Can I set a radial or conic gradient\'s center to a custom position, like 25% 75%, instead of one of the preset positions?',
      a: [
        'Not through this tool\'s Position dropdown, it\'s limited to nine fixed keywords, center plus the four sides and corners. CSS itself accepts an arbitrary percentage or length for a gradient\'s center position; edit the at center part of the copied CSS by hand if you need one of those.',
      ],
    },
    {
      q: 'What happens if I type a stop position below 0% or above 100% directly into the number field?',
      a: [
        'It\'s passed straight through to the generated CSS with no clamping, the slider\'s 0-100 range is a UI convenience, not an enforced limit. A color stop outside 0-100% is valid CSS; it shifts where that color reaches full strength relative to the other stops rather than being ignored or capped.',
      ],
    },
  ],

  'graphql-formatter': [
    {
      q: 'Do comments in my GraphQL document survive formatting?',
      a: [
        'No. The reference parser builds an AST from your document and the printer regenerates text from that AST alone; a # comment carries no meaning in GraphQL\'s type system, so it\'s dropped rather than preserved, the same way whitespace and blank lines are also not literally preserved between passes.',
      ],
    },
    {
      q: 'Can I format a query and a mutation pasted together in the same document?',
      a: [
        'Yes, as long as each operation has its own name. GraphQL documents can contain multiple named operation definitions; the formatter prints each one in turn with a blank line separating them, the same as it would if you\'d formatted them one at a time.',
      ],
    },
    {
      q: 'Why does the arrow briefly spin before the formatted output appears?',
      a: [
        'The GraphQL parser and printer are loaded as a separate chunk on first use rather than bundled into the page upfront, and formatting itself waits about 250ms after you stop typing. The spinner covers that brief async gap so the UI doesn\'t look frozen while it works.',
      ],
    },
    {
      q: 'Does this tool validate that my query matches a real schema, like that a field actually exists?',
      a: [
        'No, only syntax is checked. Validating field names, types, and arguments against a schema requires a separate validate() step with an actual GraphQLSchema object, which this tool never loads, only parse and print are used. A syntactically valid query referencing a field that doesn\'t exist anywhere in your real schema will format cleanly with no warning.',
      ],
    },
  ],

  'markdown-preview': [
    {
      q: 'When I click "Copy HTML" on a document with a code block, do I get this tool\'s own syntax-highlighted markup or plain HTML?',
      a: [
        'Plain, portable HTML. Copy HTML captures the raw output from the Markdown parser before code-block syntax highlighting is applied to the preview, so you get a standard pre/code block with a language- class, not this site\'s internal editor rendering, safe to paste anywhere and re-highlight with your own tooling.',
      ],
    },
    {
      q: 'What happens to a fenced code block whose language isn\'t recognized, like ```brainfuck?',
      a: [
        'It still renders in the code block styling, just without any syntax coloring, rather than erroring or falling back to a default language\'s rules. The recognized language list covers around twenty common languages but isn\'t exhaustive.',
      ],
    },
    {
      q: 'Why does syntax highlighting for a code block sometimes take a moment to appear right after you paste a large snippet?',
      a: [
        'Each language\'s highlighting rules are loaded on demand, only when that language actually shows up in your Markdown, rather than bundling twenty-plus languages into the page upfront. That keeps the initial page load lighter, at the cost of a brief delay the first time a given language appears in your document.',
      ],
    },
    {
      q: 'Do GitHub-flavored features like task lists (- [ ]) and strikethrough (~~text~~) work?',
      a: [
        'Yes, both out of the box. A task list renders as real, disabled checkboxes rather than plain bullet text, and ~~text~~ renders with a proper strikethrough style, matching how GitHub itself displays the same Markdown.',
      ],
    },
  ],

  'og-generator': [
    {
      q: 'If I paste my whole <head> section instead of just the meta tags, will the import still work?',
      a: [
        'Yes. The import scans for meta tags anywhere in whatever text you paste and ignores everything else, title, script, link tags included, so pasting an entire page source works just as well as pasting only the meta lines.',
      ],
    },
    {
      q: 'Does importing an existing set of tags clear out fields that aren\'t present in what I pasted?',
      a: [
        'No, it only overwrites fields it actually finds. Import a snippet missing og:site_name, for example, and whatever is already in the Site name field stays untouched rather than being cleared, so you can top up a partial set of tags without losing what you\'d already filled in.',
      ],
    },
    {
      q: 'What happens if I import a twitter:card value this tool\'s dropdown doesn\'t offer, like player or app?',
      a: [
        'It\'s still imported as that exact value, even though the dropdown itself only lists summary_large_image and summary. Real Twitter Cards support more types than this generator\'s form covers; importing one of those isn\'t rejected, just not selectable from the dropdown afterward.',
      ],
    },
    {
      q: 'Does the tool warn me if my title or description is too long for a specific platform?',
      a: [
        'No, the character count next to each field is purely informational. Actual truncation limits vary by platform, and by feature within a platform, and change over time, so there\'s no single "too long" threshold this tool could enforce accurately; treat the count as a rough guide, not a validator.',
      ],
    },
  ],

  'sql-formatter': [
    {
      q: 'Does the "1 tab" indent option produce an actual tab character, or just one space?',
      a: [
        'A real tab character. Selecting "1 tab" switches on the formatter\'s separate useTabs setting rather than just sending it an indent width of 1, which alone would only mean "one space per level." Picking 2 or 4 spaces instead leaves useTabs off and uses that number of literal space characters.',
      ],
    },
    {
      q: 'Why is a parse error sometimes one clean line and other times an enormous wall of text?',
      a: [
        'It depends on what confuses the parser. A dialect mismatch, like backtick-quoted identifiers formatted as PostgreSQL, produces a short, specific message. A structurally broken query, like an unmatched parenthesis, can produce a dump of the parser\'s internal grammar state that runs to tens of thousands of characters. Both are the parser\'s raw error text shown as-is.',
      ],
    },
    {
      q: 'Why did an obviously incomplete query like "select from where" format without any error?',
      a: [
        'The parser only checks that the clauses it recognizes are in a valid arrangement; it doesn\'t require there to be real content between them. select from where round-trips unchanged rather than erroring, the same permissiveness that lets a T-SQL TOP clause pass through silently even when the MySQL dialect is selected instead.',
      ],
    },
    {
      q: 'Are -- line comments and /* */ block comments preserved when formatting?',
      a: [
        'Yes, both are kept in roughly their original position relative to the surrounding SQL, unlike some of the other formatters on this site (GraphQL and TOML, for example) which drop comments entirely when reprinting from a parsed structure.',
      ],
    },
  ],

  'string-escape': [
    {
      q: 'Does this tool escape a forward slash / or a single quote \' the way some other JSON tools do?',
      a: [
        'Not on the Escape side, neither character needs escaping in JSON or JavaScript, so both pass through unchanged. Unescape does accept \\/ and \\\' if you paste text that has them, since other tools sometimes produce them, this one still reads them correctly even though it never generates them itself.',
      ],
    },
    {
      q: 'What happens if I try to unescape a JavaScript-only sequence like \\x41 (hex escape)?',
      a: [
        'It\'s rejected with "Unrecognized escape sequence". This tool follows JSON\'s escape set (\\n \\r \\t \\b \\f \\" \\\\ and \\uXXXX) plus the handful of extras JavaScript accepts on top of it, not the full range of escapes a JavaScript engine understands, \\xNN hex escapes and octal escapes among them.',
      ],
    },
    {
      q: 'What happens to a raw control character, like a literal NUL byte, that has no dedicated shorthand like \\n?',
      a: [
        'It\'s still escaped automatically, just as a \\uXXXX sequence instead of a named shorthand. Anything below the printable ASCII range gets one of the two treatments, a named escape if one exists, \\uXXXX otherwise, so no control character is ever left as an invisible raw byte in the output.',
      ],
    },
    {
      q: 'If I type my own text and then click the Escape/Unescape toggle, does my text convert automatically?',
      a: [
        'No, only the ⇄ swap button does that. The Escape/Unescape toggle just switches which direction typed input is interpreted in; your text stays exactly as typed and is now read under the new mode, which can produce an error or garbled output if it wasn\'t written for that direction. Use the swap button between the two panels to actually carry the current output over as new input.',
      ],
    },
  ],

  'text-case': [
    {
      q: 'Why does an acronym like HTML come out as just "Html" in PascalCase, not staying all-caps?',
      a: [
        'Every word is lowercased during splitting, then only its first letter is capitalized when rebuilding a case that needs it, so parseHTMLString correctly splits before and after the acronym but rejoins as ParseHtmlString, not ParseHTMLString. The split point is right, the original all-caps styling of the acronym itself isn\'t carried through to camelCase, PascalCase, or Title Case output.',
      ],
    },
    {
      q: 'Why does a Python dunder name like __init__ come out as just "init" instead of keeping the double underscores?',
      a: [
        'Leading, trailing, and doubled separators collapse to nothing during splitting, the parser is only trying to find word boundaries, not preserve every separator character verbatim. __init__ produces the single word "init", the same result you\'d get from converting plain "init", so the double-underscore convention itself doesn\'t survive a round trip through this tool.',
      ],
    },
    {
      q: 'Does a number stick to the word next to it, or become its own separate word?',
      a: [
        'It sticks to whichever letters it\'s directly adjacent to rather than splitting off on its own: version2Point0 becomes the two words "version2" and "point0", not four separate tokens. Only a lowercase-to-uppercase letter transition creates a new split point; digits don\'t trigger one by themselves.',
      ],
    },
    {
      q: 'What does "auto-detect" actually mean here, does the tool guess which case I want to convert to?',
      a: [
        'No, there\'s nothing to guess on the output side, all nine cases are always generated together regardless of what you paste. "Auto-detect" refers only to correctly splitting whatever mixed format you typed, camelCase, snake_case, spaces, or any combination, into individual words before converting, not to picking one target format for you.',
      ],
    },
  ],
}
