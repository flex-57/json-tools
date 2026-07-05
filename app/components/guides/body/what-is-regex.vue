<template>
  <div class="guide-body">

    <!-- Intro -->
    <section class="guide-section">
      <p>
        A <strong>regular expression</strong> (regex) is a sequence of characters that defines a search pattern.
        You use regex to find, validate, or replace text: check that an email looks valid, extract all URLs from a
        page, or reformat a date string. Every major programming language has built-in regex support.
      </p>
      <p>
        The syntax looks cryptic at first, but it follows a handful of rules. Once you know them, you can
        read most regex patterns in seconds.
      </p>
    </section>

    <!-- Anatomy -->
    <section class="guide-section">
      <h2>Anatomy of a regex</h2>
      <p>A regex literal is written between two forward slashes, followed by optional flags:</p>

      <div class="regex-anatomy">
        <div class="regex-display">
          <span class="rp rp--delim">/</span><span class="rp rp--anchor">^</span><span class="rp rp--class">\d</span><span class="rp rp--quant">{3}</span><span class="rp rp--literal">-</span><span class="rp rp--class">\d</span><span class="rp rp--quant">{4}</span><span class="rp rp--anchor">$</span><span class="rp rp--delim">/</span><span class="rp rp--flag">g</span>
        </div>
        <div class="regex-legend">
          <span class="rl rl--delim">/ /  delimiters</span>
          <span class="rl rl--anchor">^ $  anchors</span>
          <span class="rl rl--class">\d  character class</span>
          <span class="rl rl--quant">{n}  quantifier</span>
          <span class="rl rl--literal">-  literal</span>
          <span class="rl rl--flag">g  flag</span>
        </div>
        <p class="regex-caption">This pattern matches a 7-digit number in the format <code>123-4567</code>, from start to end of string.</p>
      </div>
    </section>

    <!-- Cheat sheet -->
    <section class="guide-section">
      <h2>Regex cheat sheet</h2>

      <h3>Character classes</h3>
      <table class="cheat-table">
        <thead><tr><th>Symbol</th><th>Matches</th><th>Example</th><th>Matches</th></tr></thead>
        <tbody>
          <tr v-for="r in CLASSES" :key="r[0]">
            <td><code>{{ r[0] }}</code></td><td>{{ r[1] }}</td><td><code>{{ r[2] }}</code></td><td class="ct-eg">{{ r[3] }}</td>
          </tr>
        </tbody>
      </table>

      <h3>Quantifiers</h3>
      <table class="cheat-table">
        <thead><tr><th>Symbol</th><th>Meaning</th><th>Example</th><th>Matches</th></tr></thead>
        <tbody>
          <tr v-for="r in QUANTIFIERS" :key="r[0]">
            <td><code>{{ r[0] }}</code></td><td>{{ r[1] }}</td><td><code>{{ r[2] }}</code></td><td class="ct-eg">{{ r[3] }}</td>
          </tr>
        </tbody>
      </table>

      <h3>Anchors &amp; boundaries</h3>
      <table class="cheat-table">
        <thead><tr><th>Symbol</th><th>Meaning</th><th>Example</th><th>Matches</th></tr></thead>
        <tbody>
          <tr v-for="r in ANCHORS" :key="r[0]">
            <td><code>{{ r[0] }}</code></td><td>{{ r[1] }}</td><td><code>{{ r[2] }}</code></td><td class="ct-eg">{{ r[3] }}</td>
          </tr>
        </tbody>
      </table>

      <h3>Groups &amp; alternation</h3>
      <table class="cheat-table">
        <thead><tr><th>Symbol</th><th>Meaning</th><th>Example</th><th>Matches</th></tr></thead>
        <tbody>
          <tr v-for="r in GROUPS" :key="r[0]">
            <td><code>{{ r[0] }}</code></td><td>{{ r[1] }}</td><td><code>{{ r[2] }}</code></td><td class="ct-eg">{{ r[3] }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Flags -->
    <section class="guide-section">
      <h2>Flags</h2>
      <p>Flags follow the closing slash and modify how the pattern is applied.</p>
      <table class="cheat-table">
        <thead><tr><th>Flag</th><th>Name</th><th>Effect</th></tr></thead>
        <tbody>
          <tr v-for="f in FLAGS" :key="f[0]">
            <td><code>{{ f[0] }}</code></td><td>{{ f[1] }}</td><td>{{ f[2] }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Common patterns -->
    <section class="guide-section">
      <h2>Common patterns</h2>
      <p>Ready-to-use regex for the most frequent validation tasks.</p>

      <div class="pattern-list">
        <div v-for="p in PATTERNS" :key="p.name" class="pattern-card">
          <div class="pattern-card-header">
            <span class="pattern-name">{{ p.name }}</span>
            <span class="pattern-tag">{{ p.flags ? `/${p.pattern}/${p.flags}` : `/${p.pattern}/` }}</span>
          </div>
          <div class="pattern-card-body">
            <div class="pattern-split">
              <div class="pattern-col">
                <span class="ps-label ps-label--ok">✅ matches</span>
                <code v-for="ex in p.ok" :key="ex" class="ps-ex">{{ ex }}</code>
              </div>
              <div class="pattern-col">
                <span class="ps-label ps-label--no">❌ rejects</span>
                <code v-for="ex in p.no" :key="ex" class="ps-ex">{{ ex }}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Greedy vs lazy -->
    <section class="guide-section">
      <h2>Greedy vs. lazy matching</h2>
      <p>
        By default, quantifiers are <strong>greedy</strong> — they match as much text as possible.
        Adding <code>?</code> after a quantifier makes it <strong>lazy</strong> — it matches as little as possible.
      </p>
      <div class="guide-steps">
        <div class="step">
          <div class="step-head">Greedy <code>.*</code></div>
          <p>Input: <code>&lt;b&gt;bold&lt;/b&gt; and &lt;i&gt;italic&lt;/i&gt;</code><br>
          Pattern: <code>&lt;.*&gt;</code> → matches the entire string from first <code>&lt;</code> to last <code>&gt;</code></p>
        </div>
        <div class="step">
          <div class="step-head">Lazy <code>.*?</code></div>
          <p>Same input.<br>
          Pattern: <code>&lt;.*?&gt;</code> → matches <code>&lt;b&gt;</code>, then <code>&lt;/b&gt;</code>, then each tag individually</p>
        </div>
      </div>
    </section>

    <section class="guide-section">
      <p>
        Ready to look up a specific token? The
        <NuxtLink to="/guides/regex-cheatsheet" class="guide-inline-link">Regex Cheatsheet</NuxtLink>
        has every character class, quantifier, anchor, lookaround, flag, and a set of common real-world patterns (email, URL, UUID, hex color, semver) in one place.
      </p>
    </section>

  </div>
</template>

<script setup lang="ts">
const CLASSES = [
  ['.', 'Any character (except newline)', 'a.c', '"abc", "aXc", "a1c"'],
  ['\\d', 'Digit 0–9', '\\d+', '"0", "42", "2024"'],
  ['\\D', 'Non-digit', '\\D', '" ", "a", "!"'],
  ['\\w', 'Word char (letter, digit, _)', '\\w+', '"hello", "a1_b"'],
  ['\\W', 'Non-word char', '\\W', '" ", "@", "-"'],
  ['\\s', 'Whitespace (space, tab, newline)', '\\s+', '" ", "\\t", "\\n"'],
  ['[abc]', 'Any char in set', '[aeiou]', '"a", "e", "i", "o", "u"'],
  ['[^abc]', 'Any char not in set', '[^0-9]', 'any non-digit'],
  ['[a-z]', 'Char range', '[a-z]{3}', '"abc", "xyz"'],
]

const QUANTIFIERS = [
  ['*', '0 or more', 'bo*', '"b", "bo", "boo"'],
  ['+', '1 or more', 'ho+', '"ho", "hoo" (not "h")'],
  ['?', '0 or 1', 'colou?r', '"color", "colour"'],
  ['{n}', 'Exactly n', '\\d{4}', '"2024", "0000"'],
  ['{n,}', 'n or more', '\\d{2,}', '"12", "123", "9999"'],
  ['{n,m}', 'Between n and m', '\\w{2,5}', '2–5 word characters'],
  ['*? +? ??', 'Lazy (shortest match)', '<.*?>', 'each tag individually'],
]

const ANCHORS = [
  ['^', 'Start of string', '^Hello', '"Hello world" (not "Say Hello")'],
  ['$', 'End of string', 'end$', '"the end" (not "endless")'],
  ['\\b', 'Word boundary', '\\bcat\\b', '"cat" but not "catch"'],
  ['\\B', 'Non-word boundary', '\\Bcat', '"catch" but not "cat"'],
]

const GROUPS = [
  ['(...)', 'Capturing group', '(\\d{4})-(\\d{2})', 'saves year and month'],
  ['(?:...)', 'Non-capturing group', '(?:ab)+', 'groups without saving'],
  ['(?=...)', 'Positive lookahead', '\\d(?= px)', '"2" in "2 px"'],
  ['(?!...)', 'Negative lookahead', '\\d(?! px)', 'digit not followed by " px"'],
  ['a|b', 'Alternation (or)', 'cat|dog', '"cat" or "dog"'],
]

const FLAGS = [
  ['g', 'Global', 'Find all matches, not just the first'],
  ['i', 'Case-insensitive', 'Treat uppercase and lowercase as equal'],
  ['m', 'Multiline', '^ and $ match start/end of each line, not just the whole string'],
  ['s', 'Dot-all', '. also matches newlines (\\n)'],
  ['u', 'Unicode', 'Enable full Unicode matching (required for \\p{} properties)'],
]

const PATTERNS = [
  {
    name: 'Email (basic)',
    pattern: '^[\\w.-]+@[\\w-]+\\.[a-z]{2,}$',
    flags: 'i',
    ok: ['user@example.com', 'first.last@sub.domain.org'],
    no: ['@example.com', 'user@', 'user @example.com'],
  },
  {
    name: 'URL (http/https)',
    pattern: 'https?:\\/\\/[\\w.-]+\\.[a-z]{2,}',
    flags: 'i',
    ok: ['https://example.com', 'http://api.site.org/path'],
    no: ['ftp://example.com', 'example.com'],
  },
  {
    name: 'ISO date (YYYY-MM-DD)',
    pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
    flags: '',
    ok: ['2024-01-31', '2000-12-01'],
    no: ['2024-13-01', '24-01-31', '2024/01/31'],
  },
  {
    name: 'Hex color',
    pattern: '^#([0-9a-f]{3}|[0-9a-f]{6})$',
    flags: 'i',
    ok: ['#fff', 'var(--c-brand)', '#000000'],
    no: ['#gg0000', 'F97316', '#12345'],
  },
  {
    name: 'Integer or decimal',
    pattern: '^-?\\d+(\\.\\d+)?$',
    flags: '',
    ok: ['42', '-7', '3.14', '-0.5'],
    no: ['3.', '.5', '1,000', 'abc'],
  },
]
</script>

<style scoped>
/* ── Regex anatomy ─────────────────────────────────── */
.regex-anatomy {
  margin: 20px 0 28px;
  background: #0D1117;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 24px 28px;
}

.regex-display {
  font-family: var(--font-mono);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 20px;
}

.rp { padding: 2px 1px; border-radius: 3px; }
.rp--delim   { color: #6B7280; }
.rp--anchor  { color: var(--c-accent); }
.rp--class   { color: #60A5FA; }
.rp--quant   { color: #4ADE80; }
.rp--literal { color: #F1F0EE; }
.rp--flag    { color: #FBBF24; }

.regex-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: 16px;
}

.rl {
  font-size: 12px;
  font-family: var(--font-mono);
  padding: 3px 10px;
  border-radius: 20px;
}
.rl--delim   { color: #6B7280; background: rgba(107,114,128,0.1); border: 1px solid rgba(107,114,128,0.2); }
.rl--anchor  { color: var(--c-accent); background: rgb(var(--c-accent-rgb) / 0.08); border: 1px solid rgb(var(--c-accent-rgb) / 0.2); }
.rl--class   { color: #60A5FA; background: rgba(96,165,250,0.08); border: 1px solid rgba(96,165,250,0.2); }
.rl--quant   { color: #4ADE80; background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2); }
.rl--literal { color: #F1F0EE; background: rgba(241,240,238,0.06); border: 1px solid rgba(241,240,238,0.12); }
.rl--flag    { color: #FBBF24; background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.2); }

.regex-caption {
  font-size: 12.5px;
  color: var(--c-t4);
  margin: 0;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

/* ── Cheat table ───────────────────────────────────── */
.cheat-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 28px;
  font-size: 13px;
}

.cheat-table thead tr {
  border-bottom: 1px solid var(--c-border);
}

.cheat-table th {
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-t4);
  padding: 8px 12px;
}

.cheat-table td {
  padding: 9px 12px;
  color: var(--c-t2);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  vertical-align: top;
}

.cheat-table td code {
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: #60A5FA;
  background: rgba(96,165,250,0.08);
  padding: 1px 5px;
  border-radius: 4px;
}

.ct-eg {
  font-size: 12.5px;
  color: var(--c-t4) !important;
}

/* ── Pattern cards ─────────────────────────────────── */
.pattern-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.pattern-card {
  border: 1px solid var(--c-border);
  border-radius: 10px;
  overflow: hidden;
}

.pattern-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: var(--c-subtle);
  border-bottom: 1px solid var(--c-border);
}

.pattern-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-t1);
}

.pattern-tag {
  font-family: var(--font-mono);
  font-size: 12px;
  color: #60A5FA;
  background: rgba(96,165,250,0.08);
  border: 1px solid rgba(96,165,250,0.18);
  padding: 2px 10px;
  border-radius: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
}

.pattern-card-body {
  padding: 14px 16px;
}

.pattern-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.pattern-col {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ps-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.ps-label--ok { color: #22C55E; }
.ps-label--no { color: #EF4444; }

.ps-ex {
  display: block;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--c-t3);
  background: var(--c-faint);
  padding: 3px 8px;
  border-radius: 5px;
}

/* ── Responsive ────────────────────────────────────── */
@media (max-width: 600px) {
  .regex-display { font-size: 20px; }
  .pattern-tag { display: none; }
  .cheat-table th:nth-child(3),
  .cheat-table td:nth-child(3),
  .cheat-table th:nth-child(4),
  .cheat-table td:nth-child(4) { display: none; }
}
</style>
