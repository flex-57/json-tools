<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">GPT <span class="title-amp">Token</span> Counter</h1>
        <p class="page-subtitle">Count tokens for GPT-4o, o1 and o3 (o200k_base encoding) instantly, entirely in your browser.</p>
        <NuxtLink to="/guides/what-is-a-token" class="guide-link">What is a token, and why does it matter for cost? →</NuxtLink>
      </div>
    </div>

    <div class="input-card" :class="{ 'input-card--focused': focused }">
      <div class="input-header">
        <span class="editor-label">Text or prompt</span>
        <div class="input-header-right">
          <span class="hint">paste any text or prompt</span>
          <button v-if="input" class="btn-clear" @click="clear">Clear</button>
        </div>
      </div>
      <textarea v-model="input" class="input-textarea" placeholder="Paste a prompt or any text to count its GPT tokens…" spellcheck="false" rows="8" @focus="focused = true" @blur="focused = false" />
    </div>

    <div class="token-stat-row">
      <div class="token-stat token-stat--main">
        <span class="token-stat-value">{{ loading ? '…' : tokenCount.toLocaleString() }}</span>
        <span class="token-stat-label">tokens</span>
      </div>
      <div class="token-stat">
        <span class="token-stat-value">{{ charCount.toLocaleString() }}</span>
        <span class="token-stat-label">characters</span>
      </div>
      <div class="token-stat">
        <span class="token-stat-value">{{ charsPerToken }}</span>
        <span class="token-stat-label">chars / token</span>
      </div>
    </div>

    <div class="info-strip">No data sent to servers · OpenAI o200k_base encoding (GPT-4o, o1, o3) · not an official OpenAI count</div>

    <SeoSection :cards="seoCards" />

    <section id="faq" class="tool-faq">
      <h2>Frequently asked questions</h2>
      <FaqAccordion :items="TOOL_FAQS['gpt-token-counter']" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { countGptTokens } from '~/composables/useGptTokenCounter'
import { TOOL_FAQS } from '~/data/tool-faqs'

useToolSeo(
  'GPT Token Counter: Count Tokens for GPT-4o & o1 Online',
  'Count tokens for GPT-4o, o1 and o3 prompts instantly using the real o200k_base BPE encoding, entirely in your browser. Free, no data sent to servers.',
  TOOL_FAQS['gpt-token-counter'],
)

const input   = ref('')
useUrlInput(input)
const focused = ref(false)

const charCount  = computed(() => input.value.length)
const tokenCount = ref(0)
const loading     = ref(false)

const charsPerToken = computed(() => tokenCount.value > 0 ? (charCount.value / tokenCount.value).toFixed(1) : '—')

let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(input, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!val) { tokenCount.value = 0; loading.value = false; return }
  loading.value = true
  debounceTimer = setTimeout(async () => {
    tokenCount.value = await countGptTokens(val)
    loading.value = false
  }, 150)
}, { immediate: true })

function clear() { input.value = '' }

const seoCards = [
  {
    title: 'What counts as a token?',
    text: [
      'GPT models don\'t read text character by character or word by word — they read it as a sequence of tokens produced by Byte Pair Encoding (BPE), a compression algorithm trained on huge amounts of text to find the most common byte sequences.',
      'A token can be a whole common word ("the"), part of a longer word ("token" + "ization"), a punctuation mark, or a whitespace-prefixed word. As a rough rule of thumb, one token is about 4 characters or 0.75 words of English text, though this varies a lot by language and content.',
    ],
  },
  {
    title: 'Why token counts matter',
    text: [
      'API pricing for GPT models is per token, for both the prompt sent and the completion returned — so token count translates directly into cost.',
      'Every model also has a fixed context window measured in tokens (input + output combined). A prompt that fits comfortably as "a page of text" can still exceed the limit once code, JSON, or non-English text pushes the token-per-character ratio higher than plain English prose.',
    ],
  },
  {
    title: 'Scope of this tool',
    text: 'This counter uses OpenAI\'s real o200k_base encoding (the tokenizer used by GPT-4o, o1 and o3), so counts match what the OpenAI API actually bills for those models. It does not cover Claude or Gemini: Anthropic ships no offline tokenizer for Claude 3 and later (their Count Tokens API requires a network call and an API key), and open-weight models like Kimi K2 have no lightweight browser-compatible tokenizer available today.',
  },
]
</script>

<style scoped>
.input-textarea { width: 100%; border: none; outline: none; resize: vertical; padding: 14px 16px; font-family: var(--font-mono); font-size: 13px; background: transparent; color: var(--c-t1); line-height: 1.7; display: block; min-height: 160px; }
.input-textarea::placeholder { color: var(--c-t5); }

.btn-clear { font-family: var(--font-body); font-size: 12px; color: var(--c-t4); background: none; border: none; cursor: pointer; padding: 2px 7px; border-radius: 5px; transition: all 0.15s; }
.btn-clear:hover { color: var(--c-error); background: rgb(var(--c-error-rgb) / 0.1); }

.token-stat-row { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
.token-stat { flex: 1; min-width: 120px; display: flex; flex-direction: column; align-items: center; gap: 4px; background: var(--c-card); border: 1px solid var(--c-border); border-radius: var(--radius-card); padding: 18px 16px; }
.token-stat--main { background: rgb(var(--c-accent-rgb) / 0.06); border-color: rgb(var(--c-accent-rgb) / 0.3); }
.token-stat-value { font-family: var(--font-mono); font-size: 28px; font-weight: 700; color: var(--c-t1); line-height: 1; }
.token-stat--main .token-stat-value { color: var(--c-accent); }
.token-stat-label { font-family: var(--font-body); font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--c-t4); }

@media (max-width: 640px) { .token-stat-value { font-size: 22px; } }
</style>
