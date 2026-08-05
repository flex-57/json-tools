<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Password <span class="title-amp">Generator</span></h1>
        <p class="page-subtitle">Generate cryptographically secure passwords in your browser. No data is ever sent to a server.</p>
        <NuxtLink to="/guides/password-entropy-explained" class="guide-link">What makes a password strong? Read our guide →</NuxtLink>
      </div>
    </div>

    <div class="editor-card pw-card">
      <div class="pw-display">
        <code class="pw-output" :class="{ 'pw-output--empty': !password }" aria-live="polite">{{ password || 'Select at least one character type' }}</code>
        <div class="pw-action-btns">
          <button class="icon-btn" title="Regenerate" @click="regen">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M13.5 8A5.5 5.5 0 112.5 5.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M2.5 2v3.5H6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="copy-btn" :class="{ 'copy-btn--done': copied }" :disabled="!password" @click="doCopy">{{ copied ? 'Copied!' : 'Copy' }}</button>
        </div>
      </div>

      <div class="strength-row">
        <div class="strength-track"><div class="strength-fill" :class="'s' + strength.level" :style="{ width: (strength.level / 4 * 100) + '%' }" /></div>
        <span class="strength-label" :class="'s' + strength.level">{{ strength.label }}</span>
        <span v-if="password" class="entropy-label">· {{ entropy }} bits</span>
      </div>

      <div class="pw-divider" />

      <div class="pw-config">
        <div class="cfg-row">
          <span class="cfg-label">Length</span>
          <div class="length-controls">
            <input v-model.number="length" type="range" min="4" max="64" class="pw-slider" >
            <input v-model.number="length" type="number" min="4" max="64" class="len-num" @blur="clampLength" >
          </div>
        </div>

        <div class="cfg-row">
          <span class="cfg-label">Include</span>
          <div class="opts-grid">
            <label class="opt-label"><input v-model="useUpper" type="checkbox" class="opt-cb" ><span>Uppercase (A-Z)</span></label>
            <label class="opt-label"><input v-model="useLower" type="checkbox" class="opt-cb" ><span>Lowercase (a-z)</span></label>
            <label class="opt-label"><input v-model="useNums" type="checkbox"  class="opt-cb" ><span>Numbers (0-9)</span></label>
            <label class="opt-label"><input v-model="useSyms" type="checkbox"  class="opt-cb" ><span>Symbols (!@#$…)</span></label>
          </div>
        </div>

        <div class="cfg-row">
          <span class="cfg-label" />
          <label class="opt-label opt-label--wide">
            <input v-model="excludeAmbig" type="checkbox" class="opt-cb" >
            <span>Exclude ambiguous characters (0 / O, 1 / l / I)</span>
          </label>
        </div>
      </div>
    </div>

    <div class="editor-card">
      <div class="editor-card-header">
        <span class="editor-label">Bulk generate</span>
        <div class="bulk-header-controls">
          <input v-model.number="bulkCount" type="number" min="2" max="20" class="bulk-count-input" >
          <button class="btn btn-primary" :disabled="!charset" @click="generateBulk">Generate {{ bulkCount }}</button>
        </div>
      </div>

      <div v-if="bulkPasswords.length" class="bulk-list" aria-live="polite">
        <div v-for="(pw, i) in bulkPasswords" :key="i" class="bulk-item">
          <code class="bulk-pw">{{ pw }}</code>
          <button class="copy-btn" :class="{ 'copy-btn--done': copiedBulk === i }" @click="copyBulkItem(pw, i)">{{ copiedBulk === i ? 'Copied!' : 'Copy' }}</button>
        </div>
      </div>
      <p v-else class="bulk-hint">Click "Generate" to create multiple passwords at once.</p>
    </div>

    <SeoSection :cards="cards" />
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '../../composables/useClipboard'

useToolSeo(
  'Password Generator: Secure Random Passwords, Custom Length',
  'Generate strong, random passwords with custom length, uppercase, lowercase, numbers and symbols. Uses crypto.getRandomValues, 100% client-side, nothing sent to servers.',
)

const length       = ref(16)
const useUpper     = ref(true)
const useLower     = ref(true)
const useNums      = ref(true)
const useSyms      = ref(false)
const excludeAmbig = ref(false)

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUMS  = '0123456789'
const SYMS  = '!@#$%^&*()_+-=[]{}|;:,.<>?'
const AMBIG = /[0Ol1I]/g

const charset = computed(() => {
  let cs = ''
  if (useUpper.value) cs += UPPER
  if (useLower.value) cs += LOWER
  if (useNums.value)  cs += NUMS
  if (useSyms.value)  cs += SYMS
  if (excludeAmbig.value) cs = cs.replace(AMBIG, '')
  return cs
})

function clampLength() {
  length.value = Math.max(4, Math.min(64, length.value || 4))
}

function makePassword(len: number, cs: string): string {
  if (!cs) return ''
  const arr = new Uint32Array(len)
  crypto.getRandomValues(arr)
  return Array.from(arr, v => cs[v % cs.length]).join('')
}

const password  = ref('')
const regenKey  = ref(0)

watchEffect(() => {
  const _ = regenKey.value
  const cs  = charset.value
  const len = length.value
  password.value = makePassword(len, cs)
})

function regen() { regenKey.value++ }

useToolShortcut(regen)

const entropy = computed(() => {
  const cs = charset.value.length
  return cs ? Math.floor(length.value * Math.log2(cs)) : 0
})

const strength = computed(() => {
  if (!charset.value) return { label: '—', level: 0 }
  const e = entropy.value
  if (e < 40) return { label: 'Weak',   level: 1 }
  if (e < 60) return { label: 'Fair',   level: 2 }
  if (e < 80) return { label: 'Good',   level: 3 }
  return              { label: 'Strong', level: 4 }
})

const { isCopied, copy: copyKeyed } = useClipboard()
const copied = computed(() => isCopied('single'))

function doCopy() {
  if (!password.value) return
  copyKeyed('single', password.value)
}

const bulkCount     = ref(5)
const bulkPasswords = ref<string[]>([])
const copiedBulk    = computed<number | null>(() => {
  const idx = bulkPasswords.value.findIndex((_, i) => isCopied('bulk-' + i))
  return idx === -1 ? null : idx
})

function generateBulk() {
  if (!charset.value) return
  bulkPasswords.value = Array.from(
    { length: Math.max(2, Math.min(20, bulkCount.value)) },
    () => makePassword(length.value, charset.value)
  )
}

function copyBulkItem(pw: string, i: number) {
  copyKeyed('bulk-' + i, pw)
}

const cards = [
  {
    title: 'Why use a browser-based password generator?',
    text: [
      'This generator runs entirely in your browser using the Web Cryptography API (crypto.getRandomValues), which produces cryptographically secure random numbers using the same standard operating systems use for key generation.',
      'Because nothing is sent to a server, you are protected from network interception and server breaches. Compare this to some online generators that log generated passwords server-side, intentionally or not.',
    ],
  },
  {
    title: 'How long and complex should a password be?',
    text: [
      'Password strength is measured in bits of entropy: log₂(charsetSize ^ length). A 16-character password mixing uppercase, lowercase and numbers yields ~95 bits, enough to resist all known brute-force attacks.',
      'For high-value accounts (email, banking, password manager master password) aim for 20+ characters and at least 3 character types. Using a password manager lets you use a unique strong password for every site without memorising them.',
    ],
  },
  {
    title: 'What do the character set options mean?',
    text: 'The charset size directly drives entropy: toggling symbols on a 16-char password raises entropy from ~95 to ~105 bits. "Exclude ambiguous" removes characters that look similar in certain fonts, like 0/O and 1/l/I.',
    table: [
      { label: 'Uppercase', value: '26 characters — A-Z' },
      { label: 'Lowercase', value: '26 characters — a-z' },
      { label: 'Numbers', value: '10 characters — 0-9' },
      { label: 'Symbols', value: '~28 printable special characters' },
    ],
  },
]
</script>

<style scoped>
.pw-card { padding: 0; }

.pw-display { display: flex; align-items: center; gap: 12px; padding: 16px 20px; }
.pw-output { flex: 1; font-family: var(--font-mono); font-size: 15px; font-weight: 500; color: var(--c-t1); word-break: break-all; letter-spacing: 0.03em; line-height: 1.6; }
.pw-output--empty { color: var(--c-t4); font-size: 13px; font-weight: 400; }
.pw-action-btns { display: flex; gap: 8px; flex-shrink: 0; }

.icon-btn { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border: 1px solid var(--c-border); border-radius: 7px; background: var(--c-subtle); color: var(--c-t3); cursor: pointer; transition: background 0.1s, color 0.1s; }
.icon-btn:hover { background: var(--c-faint); color: var(--c-t1); }

.copy-btn { display: flex; align-items: center; gap: 5px; font-family: var(--font-body); font-size: 12px; font-weight: 500; padding: 4px 10px; border: 1px solid var(--c-border); border-radius: 7px; background: var(--c-subtle); color: var(--c-t3); cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.1s; }
.copy-btn:hover { background: var(--c-faint); color: var(--c-t1); }
.copy-btn--done { background: rgb(var(--c-valid-rgb) / 0.12); border-color: rgb(var(--c-valid-rgb) / 0.35); color: var(--c-valid); }
.copy-btn:disabled { opacity: 0.4; cursor: default; }

.strength-row { display: flex; align-items: center; gap: 10px; padding: 0 20px 14px; }
.strength-track { flex: 1; height: 4px; background: var(--c-border); border-radius: 2px; overflow: hidden; }
.strength-fill { height: 100%; border-radius: 2px; transition: width 0.25s ease, background 0.25s ease; }
.strength-fill.s0 { background: var(--c-border); }
.strength-fill.s1 { background: var(--c-error); }
.strength-fill.s2 { background: var(--c-accent); }
.strength-fill.s3 { background: var(--type-bool); }
.strength-fill.s4 { background: var(--c-valid); }

.strength-label { font-family: var(--font-body); font-size: 12px; font-weight: 600; min-width: 44px; }
.strength-label.s0 { color: var(--c-t4); }
.strength-label.s1 { color: var(--c-error); }
.strength-label.s2 { color: var(--c-accent); }
.strength-label.s3 { color: var(--type-bool); }
.strength-label.s4 { color: var(--c-valid); }

.entropy-label { font-family: var(--font-mono); font-size: 12px; color: var(--c-t4); }

.pw-divider { height: 1px; background: var(--c-border); margin: 0 20px; }

.pw-config { display: flex; flex-direction: column; gap: 14px; padding: 16px 20px; }
.cfg-row { display: flex; align-items: center; gap: 16px; }
.cfg-label { font-family: var(--font-body); font-size: 11px; font-weight: 700; color: var(--c-t4); letter-spacing: 0.04em; width: 52px; flex-shrink: 0; }

.length-controls { display: flex; align-items: center; gap: 12px; flex: 1; }
.pw-slider { flex: 1; accent-color: var(--c-accent); cursor: pointer; height: 4px; }
.len-num { width: 56px; height: 32px; padding: 0 8px; border: 1px solid var(--c-border); border-radius: 7px; background: var(--c-subtle); font-family: var(--font-mono); font-size: 13px; color: var(--c-t1); text-align: center; outline: none; transition: border-color 0.15s; }
.len-num:focus { border-color: var(--c-accent); }

.opts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px; }
.opt-label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-family: var(--font-body); font-size: 13px; color: var(--c-t2); }
.opt-label--wide { grid-column: 1 / -1; }
.opt-cb { accent-color: var(--c-accent); width: 14px; height: 14px; cursor: pointer; flex-shrink: 0; }

.bulk-header-controls { display: flex; align-items: center; gap: 8px; }
.bulk-count-input { width: 60px; height: 30px; padding: 0 8px; border: 1px solid var(--c-border); border-radius: 7px; background: var(--c-subtle); font-family: var(--font-mono); font-size: 13px; color: var(--c-t1); text-align: center; outline: none; }

.bulk-list { padding: 0 16px 16px; display: flex; flex-direction: column; gap: 6px; }
.bulk-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--c-subtle); border: 1px solid var(--c-border); border-radius: 8px; }
.bulk-pw { flex: 1; font-family: var(--font-mono); font-size: 13px; color: var(--c-t1); word-break: break-all; }
.bulk-hint { padding: 16px 20px; font-family: var(--font-body); font-size: 13px; color: var(--c-t4); }

@media (max-width: 600px) {
  .opts-grid { grid-template-columns: 1fr; }
  .cfg-row { flex-direction: column; align-items: flex-start; gap: 8px; }
  .cfg-label { width: auto; }
  .length-controls { width: 100%; }
}
</style>
