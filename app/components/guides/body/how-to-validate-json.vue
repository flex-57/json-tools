<template>
  <article class="guide-body">

    <section class="guide-section">
      <h2>What makes JSON valid?</h2>
      <p>A JSON document is <strong>valid</strong> when it follows the rules of the <a href="https://datatracker.ietf.org/doc/html/rfc8259" target="_blank" rel="noopener noreferrer">JSON specification (RFC 8259)</a>. There are two levels of correctness:</p>
      <ul>
        <li><strong>Syntax validity</strong> — the text is well-formed JSON: correct brackets, quoted keys, no trailing commas, no comments.</li>
        <li><strong>Schema validity</strong> — the data has the expected structure: required fields exist, values have the right type, numbers are within allowed ranges.</li>
      </ul>
      <p>A JSON parser validates syntax. JSON Schema validates structure. Both matter — but you need syntax to be valid first.</p>
    </section>

    <section class="guide-section">
      <h2>Common JSON errors</h2>
      <p>These are the mistakes that most often break JSON documents:</p>

      <div v-for="err in ERRORS" :key="err.title" class="error-block">
        <div class="error-title">
          <span class="error-badge error-badge--bad">✕ Common mistake</span>
          {{ err.title }}
        </div>
        <div class="error-split">
          <div class="error-col">
            <div class="error-col-label error-col-label--bad">Invalid</div>
            <div class="code-block" style="margin:0; border-radius:0; border-top:none;">
              <code>{{ err.bad }}</code>
            </div>
          </div>
          <div class="error-col">
            <div class="error-col-label error-col-label--good">Valid</div>
            <div class="code-block" style="margin:0; border-radius:0; border-top:none;">
              <code>{{ err.good }}</code>
            </div>
          </div>
        </div>
        <p class="error-note">{{ err.note }}</p>
      </div>
    </section>

    <section class="guide-section">
      <h2>JSON syntax rules — quick reference</h2>
      <div class="rules-table">
        <div class="rules-row rules-row--head">
          <span>Rule</span>
          <span>Valid</span>
          <span>Invalid</span>
        </div>
        <div v-for="rule in RULES" :key="rule.rule" class="rules-row">
          <span>{{ rule.rule }}</span>
          <span class="rules-valid"><code>{{ rule.valid }}</code></span>
          <span class="rules-invalid"><code>{{ rule.invalid }}</code></span>
        </div>
      </div>
    </section>

    <section class="guide-section">
      <h2>Validate JSON in code</h2>
      <p>Every major language has a built-in JSON parser. Wrap the parse call in a try/catch to validate:</p>

      <h3>JavaScript / Node.js</h3>
      <div class="code-block">
        <span class="code-header">javascript</span>
        <code>try {
  const data = JSON.parse(str)
  console.log('Valid JSON', data)
} catch (e) {
  console.error('Invalid JSON:', e.message)
}</code>
      </div>

      <h3>Python</h3>
      <div class="code-block">
        <span class="code-header">python</span>
        <code>import json

try:
    data = json.loads(s)
    print('Valid JSON', data)
except json.JSONDecodeError as e:
    print('Invalid JSON:', e)</code>
      </div>

      <h3>PHP</h3>
      <div class="code-block">
        <span class="code-header">php</span>
        <code>$data = json_decode($str, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo 'Invalid JSON: ' . json_last_error_msg();
}</code>
      </div>
    </section>

    <section class="guide-section">
      <h2>Go further with JSON Schema</h2>
      <p>Syntax validation only checks that the JSON is parseable. <strong>JSON Schema</strong> lets you validate the <em>content</em> — required fields, value types, formats, and ranges.</p>

      <div class="code-block">
        <span class="code-header">example JSON Schema</span>
        <code>{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["name", "age", "email"],
  "properties": {
    "name":  { "type": "string", "minLength": 1 },
    "age":   { "type": "integer", "minimum": 0, "maximum": 150 },
    "email": { "type": "string", "format": "email" }
  }
}</code>
      </div>

      <p>With this schema, <code>{"name": "Jane", "age": -5, "email": "jane@example.com"}</code> would fail validation because <code>age</code> is below the minimum of 0 — even though it's perfectly valid JSON syntax.</p>

      <div class="guide-callout guide-callout--info">
        Use the <strong>JSON Schema Generator</strong> tool to automatically create a schema from any valid JSON — then refine it to add your constraints.
      </div>
    </section>

  </article>
</template>

<script setup lang="ts">
const ERRORS = [
  {
    title: 'Trailing comma',
    bad:  '{\n  "name": "Jane",\n  "age": 30,\n}',
    good: '{\n  "name": "Jane",\n  "age": 30\n}',
    note: 'The comma after the last property is illegal in JSON. JavaScript allows it — JSON does not.',
  },
  {
    title: 'Single quotes instead of double quotes',
    bad:  "{'name': 'Jane'}",
    good: '{"name": "Jane"}',
    note: 'JSON requires double quotes for both keys and string values. Single quotes are a JavaScript convenience, not valid JSON.',
  },
  {
    title: 'Unquoted keys',
    bad:  '{name: "Jane", age: 30}',
    good: '{"name": "Jane", "age": 30}',
    note: 'All object keys must be quoted strings. This is the most common mistake for developers coming from JavaScript object literals.',
  },
  {
    title: 'Comments',
    bad:  '{\n  "timeout": 30 // seconds\n}',
    good: '{\n  "timeout": 30\n}',
    note: 'JSON has no comment syntax. Remove comments before parsing, or switch to JSONC / YAML for config files that need documentation.',
  },
  {
    title: 'undefined, NaN, Infinity',
    bad:  '{"value": undefined, "ratio": NaN}',
    good: '{"value": null, "ratio": 0}',
    note: 'JSON only allows: string, number, boolean, null, object, array. undefined, NaN, and Infinity are JavaScript values with no JSON equivalent.',
  },
]

const RULES = [
  { rule: 'String quotes',    valid: '"hello"',     invalid: "'hello'" },
  { rule: 'Object keys',      valid: '"key": 1',    invalid: 'key: 1' },
  { rule: 'Trailing comma',   valid: '[1, 2, 3]',   invalid: '[1, 2, 3,]' },
  { rule: 'Null value',       valid: '"x": null',   invalid: '"x": undefined' },
  { rule: 'Boolean',          valid: 'true / false', invalid: 'True / False' },
  { rule: 'Number',           valid: '3.14',         invalid: '.14 or 01' },
  { rule: 'Root value',       valid: '{} or []',     invalid: 'bare string' },
]
</script>

<style scoped>
/* ── Error blocks ─────────────────────────────────────────── */
.error-block {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.error-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--c-t1);
  background: var(--c-subtle);
  border-bottom: 1px solid var(--c-border);
}

.error-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  flex-shrink: 0;
}

.error-badge--bad {
  background: rgba(220, 38, 38, 0.08);
  color: #DC2626;
  border: 1px solid rgba(220, 38, 38, 0.15);
}

.error-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.error-col { display: flex; flex-direction: column; }

.error-col-label {
  padding: 6px 14px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--c-border);
}

.error-col-label--bad  { color: #DC2626; background: rgba(220, 38, 38, 0.05); border-right: 1px solid var(--c-border); }
.error-col-label--good { color: #16A34A; background: rgba(22, 163, 74, 0.05); }

.error-col .code-block code { border-right: 1px solid var(--c-border); }
.error-col:last-child .code-block code { border-right: none; }

.error-note {
  padding: 9px 14px;
  font-size: 12.5px;
  color: var(--c-t4);
  line-height: 1.6;
  border-top: 1px solid var(--c-border);
  margin: 0 !important;
}

/* ── Rules table ──────────────────────────────────────────── */
.rules-table {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  margin: 12px 0;
  font-size: 13px;
}

.rules-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  border-bottom: 1px solid var(--c-border);
}
.rules-row:last-child { border-bottom: none; }

.rules-row--head {
  background: var(--c-subtle);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-t4);
}

.rules-row > span {
  padding: 9px 14px;
  border-right: 1px solid var(--c-border);
  color: var(--c-t3);
  line-height: 1.5;
}
.rules-row > span:last-child { border-right: none; }

.rules-valid code  { font-family: var(--font-mono); font-size: 12px; color: #16A34A; background: rgba(22, 163, 74, 0.08); padding: 1px 5px; border-radius: 4px; }
.rules-invalid code { font-family: var(--font-mono); font-size: 12px; color: #DC2626; background: rgba(220, 38, 38, 0.08); padding: 1px 5px; border-radius: 4px; }

@media (max-width: 768px) {
  .error-split { grid-template-columns: 1fr; }
  .error-col-label--bad { border-right: none; }
  .error-col .code-block code { border-right: none; }
  .rules-row { grid-template-columns: 1fr; }
  .rules-row > span { border-right: none; }
  .rules-row--head > span:not(:first-child) { display: none; }
}
</style>
