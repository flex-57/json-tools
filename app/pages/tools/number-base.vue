<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Number <span class="title-amp">Base</span> Converter</h1>
        <p class="page-subtitle">Convert between binary, octal, decimal and hexadecimal — instantly.</p>
      </div>
    </div>

    <div class="input-card" :class="{ 'input-card--focused': focused, 'input-card--error': !!error }">
      <div class="input-header">
        <span class="editor-label">Input</span>
        <div class="input-header-right">
          <Transition name="fade-slot">
            <span v-if="detectedBase" class="detected-badge">{{ detectedBase }}</span>
          </Transition>
          <Transition name="fade-slot">
            <button v-if="input" @click="clear" class="btn-xs">Clear</button>
          </Transition>
        </div>
      </div>
      <input v-model="input" class="input-field" placeholder="255   or   0xFF   or   0b11111111   or   0o377" spellcheck="false" autocomplete="off" @focus="focused = true" @blur="focused = false" />
      <Transition name="fade-slot">
        <div v-if="error" class="error-line">{{ error }}</div>
      </Transition>
    </div>

    <div class="results" :class="{ 'results--empty': !results.length }">
      <div v-if="!results.length" class="results-placeholder">
        <div v-for="r in PLACEHOLDER_ROWS" :key="r.label" class="result-row result-row--empty">
          <span class="base-badge">{{ r.label }}</span>
          <span class="result-value result-value--placeholder">{{ r.example }}</span>
          <button class="btn-copy" disabled>Copy</button>
        </div>
      </div>
      <template v-else>
        <div v-for="r in results" :key="r.key" class="result-row">
          <span class="base-badge">{{ r.label }}</span>
          <span class="result-value">{{ r.display }}</span>
          <button @click="copy(r.key, r.raw)" class="btn-copy" :class="{ 'btn-copy--done': copiedKey === r.key }">{{ copiedKey === r.key ? 'Copied!' : 'Copy' }}</button>
        </div>
      </template>
    </div>

    <div class="info-strip">
      <span v-if="bitInfo">{{ bitInfo }}</span>
      <span v-else>Prefix auto-detection: <code>0x</code> hex · <code>0b</code> binary · <code>0o</code> octal · no prefix = decimal</span>
    </div>

    <SeoSection :cards="seoCards" />
  </div>
</template>

<script setup lang="ts">
import { useNumberBase } from '~/composables/useNumberBase'

useToolSeo(
  'Number Base Converter — Binary, Octal, Decimal, Hex',
  'Convert numbers between binary (base 2), octal (base 8), decimal (base 10) and hexadecimal (base 16) instantly. Supports 0x, 0b, 0o prefixes and negative numbers. Free, no data sent to servers.',
)

const { input, results, error, detectedBase, bitInfo, copiedKey, copy, clear } = useNumberBase()

const focused = ref(false)

const PLACEHOLDER_ROWS = [
  { label: 'Binary (base 2)',      example: '1111 1111' },
  { label: 'Octal (base 8)',       example: '0o377' },
  { label: 'Decimal (base 10)',    example: '255' },
  { label: 'Hexadecimal (base 16)', example: '0x FF' },
]

const seoCards = [
  {
    title: 'How number bases work',
    text: 'A number base (or radix) defines how many digits a positional numeral system uses. Decimal (base 10) uses digits 0–9 and is the everyday standard. Binary (base 2) uses only 0 and 1 — it is the native language of computers, where each digit is one bit. Octal (base 8) uses digits 0–7 and was common in early Unix permissions (chmod 755). Hexadecimal (base 16) uses digits 0–9 and letters A–F, and is the dominant format for memory addresses, color codes (#FF5733), byte values, and binary file inspection because one hex digit maps exactly to 4 bits (one nibble) and two hex digits represent one byte.',
  },
  {
    title: 'Reading binary and hex in code',
    text: 'Most programming languages support numeric literals in multiple bases. In JavaScript, Python, Rust, and Go: 0b prefix for binary (0b1010), 0o for octal (0o755), and 0x for hexadecimal (0xFF). C and C++ use 0x for hex and 0 (bare leading zero) for octal. SQL uses X\'...\' or 0x notation for hex literals. You can also separate digits with underscores for readability in many languages: 0b1111_0000, 1_000_000, 0xFF_A0. The copy button here outputs the standard prefix form ready to paste into code.',
  },
  {
    title: 'Common conversions for developers',
    text: 'Unix file permissions are written in octal: 755 means rwxr-xr-x (7=111, 5=101 in binary). CSS and HTML colors use hex: #RRGGBB where each channel is one byte (00–FF). Network masks like 255.255.255.0 are 0xFFFFFF00 in hex, or 32 ones followed by zeros in binary. ASCII and Unicode code points are typically shown in hex: the letter A is 0x41 (decimal 65, binary 0100 0001). IPv4 addresses are sometimes written as 32-bit hex integers: 192.168.1.1 = 0xC0A80101.',
  },
]
</script>

<style scoped>
.input-card { position: relative; background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden; transition: box-shadow 0.2s; }
.input-card--focused { box-shadow: inset 0 0 0 2px rgb(var(--c-accent-rgb) / 0.2); }
.input-card--error { border-color: rgb(var(--c-error-rgb) / 0.4); }

.input-header { padding: 11px 16px; border-bottom: 1px solid var(--c-border-s); display: flex; align-items: center; justify-content: space-between; min-height: 42px; }
.input-header-right { display: flex; align-items: center; gap: 8px; }
.editor-label { font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--c-t4); }

.detected-badge { font-family: var(--font-mono); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; background: rgb(var(--c-accent-rgb) / 0.1); color: var(--c-accent); border: 1px solid rgb(var(--c-accent-rgb) / 0.3); }

.input-field { width: 100%; border: none; outline: none; padding: 16px; font-family: var(--font-mono); font-size: 20px; font-weight: 500; background: transparent; color: var(--c-t1); display: block; letter-spacing: 0.02em; }
.input-field::placeholder { color: var(--c-t5); font-size: 14px; font-weight: 400; letter-spacing: 0; }

.error-line { display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-family: var(--font-body); font-size: 12.5px; color: var(--c-error); border-top: 1px solid rgb(var(--c-error-rgb) / 0.3); background: rgb(var(--c-error-rgb) / 0.06); }

.results { display: flex; flex-direction: column; border: 1px solid var(--c-border); border-radius: var(--radius-card); overflow: hidden; background: var(--c-card); }
.result-row { display: flex; align-items: center; gap: 14px; padding: 11px 20px; border-bottom: 1px solid var(--c-border-s); transition: background 0.12s; }
.result-row:last-child { border-bottom: none; }
.result-row:not(.result-row--empty):hover { background: var(--c-faint); }

.base-badge { font-family: var(--font-mono); font-size: 10.5px; font-weight: 600; color: var(--c-accent); background: rgb(var(--c-accent-rgb) / 0.08); border: 1px solid rgb(var(--c-accent-rgb) / 0.25); border-radius: 4px; padding: 2px 7px; white-space: nowrap; flex-shrink: 0; min-width: 172px; text-align: center; }
.result-value { flex: 1; font-family: var(--font-mono); font-size: 13px; color: var(--c-t1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; letter-spacing: 0.04em; }
.result-value--placeholder { color: var(--c-t5); }

.info-strip code { font-family: var(--font-mono); font-size: 11px; background: var(--c-faint); border: 1px solid var(--c-border-s); border-radius: 3px; padding: 0 4px; color: var(--c-t3); }

.fade-slot-enter-active, .fade-slot-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-slot-enter-from, .fade-slot-leave-to { opacity: 0; transform: translateY(-3px); }

@media (max-width: 768px) { .base-badge { min-width: 130px; font-size: 10px; } .result-row { gap: 10px; padding: 10px 12px; } .input-field { font-size: 16px; } }
</style>
