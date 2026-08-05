<template>
  <div class="guide-body">

    <section class="guide-section">
      <p>
        A <strong>token</strong> is the unit an LLM actually reads and writes: not a character, not a word, but
        a piece produced by an algorithm called <strong>Byte Pair Encoding</strong> (BPE). Before any text
        reaches the model, a tokenizer breaks it into a sequence of these pieces and converts each one to an
        integer ID, since the model's underlying math only operates on numbers.
      </p>
      <p>
        BPE is trained ahead of time on a huge corpus of text: it starts from individual bytes, then repeatedly
        merges whichever adjacent pair appears most often, until it reaches a fixed vocabulary size (100,000 to
        200,000 entries for OpenAI's models). Common English words end up as a single token; rarer words,
        misspellings, and most non-English text get split into several.
      </p>
    </section>

    <section class="guide-section">
      <h2>A real example</h2>
      <p>This is the actual token split for a short sentence, produced by OpenAI's o200k_base encoding:</p>
      <div class="token-display">
        <span class="token-chip">Token</span><span class="token-chip">ization</span><span class="token-chip">&nbsp;splits</span><span class="token-chip">&nbsp;text</span><span class="token-chip">&nbsp;into</span><span class="token-chip">&nbsp;pieces</span><span class="token-chip">&nbsp;called</span><span class="token-chip">&nbsp;tokens</span><span class="token-chip">.</span>
      </div>
      <p class="token-caption">9 tokens for 53 characters. Two things worth noticing:</p>
      <ul>
        <li>"Tokenization" splits into "Token" + "ization" (a less common word), while every other word here stays whole (all common English words).</li>
        <li>Most tokens carry their leading space as part of the token itself ("&nbsp;splits", not "splits"). This is why token counts are sensitive to whitespace and formatting, not just to the words themselves.</li>
      </ul>
      <p>Paste your own text into the <NuxtLink to="/tools/gpt-token-counter" class="guide-inline-link">GPT Token Counter</NuxtLink> to see its real count instead of estimating from the word-count rule of thumb.</p>
    </section>

    <section class="guide-section">
      <h2>Why token count matters</h2>
      <table class="cheat-table">
        <thead><tr><th>Constraint</th><th>How tokens factor in</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>API pricing</strong></td>
            <td>Billed per token, usually per million, with separate input and output rates. Token count converts directly into cost.</td>
          </tr>
          <tr>
            <td><strong>Context window</strong></td>
            <td>Every model has a fixed token budget covering prompt plus completion combined. Dense content (code, JSON, non-English text) can exceed the limit well before it "feels" long.</td>
          </tr>
          <tr>
            <td><strong>Latency</strong></td>
            <td>Generation time scales roughly with output token count, since most models generate one token at a time.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="guide-section">
      <h2>Which encoding does which model use?</h2>
      <table class="cheat-table">
        <thead><tr><th>Encoding</th><th>Vocabulary size</th><th>Used by</th></tr></thead>
        <tbody>
          <tr><td><code>o200k_base</code></td><td>~200,000</td><td>GPT-4o, o1, o3</td></tr>
          <tr><td><code>cl100k_base</code></td><td>~100,000</td><td>GPT-4, GPT-3.5</td></tr>
        </tbody>
      </table>
      <p>
        These two encodings are not interchangeable. The same input text produces a different token sequence,
        and usually a different total count, depending on which one a given model actually uses.
      </p>
    </section>

    <section class="guide-section">
      <h2>Not every model can be tokenized offline</h2>
      <p>
        Counting tokens client-side, without sending the text anywhere, requires the tokenizer's vocabulary
        data to be available to run locally. That is true for OpenAI's encodings, but not universally true
        across providers:
      </p>
      <ul>
        <li><strong>Anthropic (Claude 3 and later)</strong> ships no local tokenizer at all. The only supported method is their Count Tokens API, which needs a network call and an API key.</li>
        <li><strong>Google (Gemini)</strong> provides a local tokenizer, but only in the Python and Go SDKs, and it does not cover the newest model releases at launch.</li>
        <li><strong>Open-weight models</strong> (Kimi K2 and similar) publish their tokenizer files, but a 160,000-entry vocabulary means several megabytes of data just to load, which works against the idea of a lightweight, instant browser tool.</li>
      </ul>
      <p>This is why a tool promising accurate, offline token counts for every model at once cannot actually deliver on that promise honestly today.</p>
    </section>

  </div>
</template>

<style scoped>
.token-display {
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 2.2;
  margin: 16px 0 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.token-chip {
  padding: 3px 6px;
  border-radius: 4px;
  background: rgb(var(--c-accent-rgb) / 0.1);
  border: 1px solid rgb(var(--c-accent-rgb) / 0.3);
  color: var(--c-accent);
  white-space: pre;
}
.token-caption { font-size: 12.5px; color: var(--c-t4); margin-bottom: 6px; }
</style>
