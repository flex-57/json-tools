<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        A quick-reference for regular expression syntax. For a conceptual introduction, see the
        <NuxtLink to="/guides/what-is-regex" class="guide-inline-link">What is a Regular Expression?</NuxtLink> guide.
      </p>
    </section>

    <section class="guide-section">
      <h2>Character classes</h2>
      <table class="cheat-table">
        <thead><tr><th>Token</th><th>Matches</th></tr></thead>
        <tbody>
          <tr v-for="r in CLASSES" :key="r[0]"><td><code>{{ r[0] }}</code></td><td>{{ r[1] }}</td></tr>
        </tbody>
      </table>
    </section>

    <section class="guide-section">
      <h2>Quantifiers</h2>
      <table class="cheat-table">
        <thead><tr><th>Token</th><th>Meaning</th><th>Note</th></tr></thead>
        <tbody>
          <tr v-for="r in QUANTIFIERS" :key="r[0]"><td><code>{{ r[0] }}</code></td><td>{{ r[1] }}</td><td class="ct-note">{{ r[2] }}</td></tr>
        </tbody>
      </table>
      <p>Add <code>?</code> after any quantifier to make it <strong>lazy</strong> (match as few as possible): <code>.*?</code> <code>.+?</code> <code>{n,m}?</code></p>
    </section>

    <section class="guide-section">
      <h2>Anchors &amp; boundaries</h2>
      <table class="cheat-table">
        <thead><tr><th>Token</th><th>Matches at</th></tr></thead>
        <tbody>
          <tr v-for="r in ANCHORS" :key="r[0]"><td><code>{{ r[0] }}</code></td><td>{{ r[1] }}</td></tr>
        </tbody>
      </table>
    </section>

    <section class="guide-section">
      <h2>Groups &amp; alternation</h2>
      <table class="cheat-table">
        <thead><tr><th>Token</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr v-for="r in GROUPS" :key="r[0]"><td><code>{{ r[0] }}</code></td><td>{{ r[1] }}</td></tr>
        </tbody>
      </table>
    </section>

    <section class="guide-section">
      <h2>Lookaheads &amp; lookbehinds</h2>
      <table class="cheat-table">
        <thead><tr><th>Token</th><th>Meaning</th><th>Example</th></tr></thead>
        <tbody>
          <tr v-for="r in LOOKAROUNDS" :key="r[0]">
            <td><code>{{ r[0] }}</code></td><td>{{ r[1] }}</td><td><code>{{ r[2] }}</code></td>
          </tr>
        </tbody>
      </table>
      <p>Lookarounds are <strong>zero-width</strong> — they assert a condition without consuming characters.</p>
    </section>

    <section class="guide-section">
      <h2>Flags</h2>
      <table class="cheat-table">
        <thead><tr><th>Flag</th><th>Name</th><th>Effect</th></tr></thead>
        <tbody>
          <tr v-for="r in FLAGS" :key="r[0]"><td><code>{{ r[0] }}</code></td><td>{{ r[1] }}</td><td>{{ r[2] }}</td></tr>
        </tbody>
      </table>
    </section>

    <section class="guide-section">
      <h2>Common patterns</h2>
      <table class="cheat-table cheat-table--patterns">
        <thead><tr><th>Pattern</th><th>Regex</th><th>Notes</th></tr></thead>
        <tbody>
          <tr v-for="r in PATTERNS" :key="r[0]">
            <td>{{ r[0] }}</td><td><code class="pat">{{ r[1] }}</code></td><td class="ct-note">{{ r[2] }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="guide-section">
      <h2>Language differences</h2>
      <table class="cheat-table">
        <thead><tr><th>Feature</th><th>JavaScript</th><th>Python</th><th>Go</th><th>Java</th></tr></thead>
        <tbody>
          <tr v-for="r in LANGS" :key="r[0]">
            <td>{{ r[0] }}</td>
            <td><code>{{ r[1] }}</code></td>
            <td><code>{{ r[2] }}</code></td>
            <td><code>{{ r[3] }}</code></td>
            <td><code>{{ r[4] }}</code></td>
          </tr>
        </tbody>
      </table>
    </section>

  </div>
</template>

<script setup lang="ts">
const CLASSES = [
  ['.', 'Any character except newline (use /s flag to include newline)'],
  ['\\d', 'Digit — [0-9]'],
  ['\\D', 'Non-digit — [^0-9]'],
  ['\\w', 'Word character — [a-zA-Z0-9_]'],
  ['\\W', 'Non-word character'],
  ['\\s', 'Whitespace — space, tab, newline, carriage return'],
  ['\\S', 'Non-whitespace'],
  ['[abc]', 'Character class — a, b, or c'],
  ['[^abc]', 'Negated class — any character except a, b, or c'],
  ['[a-z]', 'Range — any lowercase letter'],
  ['[a-zA-Z0-9]', 'Alphanumeric'],
]

const QUANTIFIERS = [
  ['*', 'Zero or more', 'Greedy'],
  ['+', 'One or more', 'Greedy'],
  ['?', 'Zero or one', 'Greedy'],
  ['{n}', 'Exactly n times', ''],
  ['{n,}', 'At least n times', 'Greedy'],
  ['{n,m}', 'Between n and m times', 'Greedy'],
  ['*?', 'Zero or more', 'Lazy'],
  ['+?', 'One or more', 'Lazy'],
]

const ANCHORS = [
  ['^', 'Start of string (or start of line with /m flag)'],
  ['$', 'End of string (or end of line with /m flag)'],
  ['\\b', 'Word boundary — between \\w and \\W'],
  ['\\B', 'Non-word boundary'],
  ['\\A', 'Start of string (Python/Java — no /m effect)'],
  ['\\Z', 'End of string (Python/Java — no /m effect)'],
]

const GROUPS = [
  ['(abc)', 'Capturing group — captures the match as group 1, 2, …'],
  ['(?:abc)', 'Non-capturing group — groups without capturing'],
  ['(?<name>abc)', 'Named capturing group — accessible as match.groups.name'],
  ['\\1', 'Backreference to group 1'],
  ['\\k<name>', 'Backreference to named group'],
  ['a|b', 'Alternation — matches a or b'],
]

const LOOKAROUNDS = [
  ['(?=...)', 'Positive lookahead', 'foo(?=bar) — "foo" followed by "bar"'],
  ['(?!...)', 'Negative lookahead', 'foo(?!bar) — "foo" NOT followed by "bar"'],
  ['(?<=...)', 'Positive lookbehind', '(?<=\\$)\\d+ — digits preceded by "$"'],
  ['(?<!...)', 'Negative lookbehind', '(?<!un)happy — "happy" NOT preceded by "un"'],
]

const FLAGS = [
  ['g', 'Global', 'Find all matches, not just the first'],
  ['i', 'Case-insensitive', '[a-z] also matches [A-Z]'],
  ['m', 'Multiline', '^ and $ match start/end of each line'],
  ['s', 'Dot-all', '. also matches newline characters'],
  ['u', 'Unicode', 'Enables full Unicode matching and \\u{XXXX} escapes'],
  ['y', 'Sticky', 'Matches only at lastIndex position (JS)'],
]

const PATTERNS = [
  ['Email (simple)', '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}', 'Not RFC 5322 compliant — use a library for strict validation'],
  ['URL (http/https)', 'https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\._~:/?#[\\]@!$&\'()*+,;=%]*)?', 'Simple — does not handle all edge cases'],
  ['IPv4 address', '(?:\\d{1,3}\\.){3}\\d{1,3}', 'Does not validate range (0-255)'],
  ['IPv4 address (strict)', '(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)', 'Validates 0-255 range'],
  ['Phone (intl)', '\\+?[\\d\\s\\-().]{7,20}', 'Flexible — adapt to your requirements'],
  ['Date (YYYY-MM-DD)', '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])', 'Does not check calendar validity'],
  ['Hex color', '#(?:[0-9a-fA-F]{3}){1,2}', 'Matches #rgb and #rrggbb'],
  ['Slug (URL-safe)', '[a-z0-9]+(?:-[a-z0-9]+)*', 'Lowercase alphanumeric + hyphens'],
  ['Semver', '\\d+\\.\\d+\\.\\d+(?:-[\\w.]+)?(?:\\+[\\w.]+)?', 'Simplified — see official semver regex for full spec'],
  ['UUID v4', '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}', 'Case-insensitive — add i flag'],
  ['Credit card (Luhn)', '(?:4\\d{12}(?:\\d{3})?|5[1-5]\\d{14}|3[47]\\d{13})', 'Structural only — use Luhn algorithm for real validation'],
]

const LANGS = [
  ['Syntax', '/pattern/flags', 're.compile()', 'regexp.MustCompile()', 'Pattern.compile()'],
  ['Lookahead', '✓', '✓', '✗', '✓'],
  ['Lookbehind', '✓', '✓', '✗', '✓'],
  ['Named groups', '(?<name>)', '(?P<name>)', '(?P<name>)', '(?<name>)'],
  ['Non-greedy', '.*?', '.*?', '.*?', '.*?'],
  ['Unicode class', '\\p{L} (with v flag)', '\\p{L}', '\\p{L}', '\\p{L}'],
]
</script>

<style scoped>
.ct-note { color: var(--c-t4); font-size: 12px; }
.cheat-table--patterns td:nth-child(2) { min-width: 280px; }
.pat { font-size: 11px; word-break: break-all; }
</style>
