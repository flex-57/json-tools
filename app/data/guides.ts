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
}
