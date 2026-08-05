// Scoped to OpenAI's o200k_base encoding only (GPT-4o, o1, o3) — deliberately
// not marketed as a general "LLM token counter": Anthropic ships no local
// tokenizer for Claude 3+ (Count Tokens API only, requires a key + network
// call), and open-weight models like Kimi K2 have multi-MB vocab files with
// no maintained JS port. Promising accurate counts for either would mean
// either lying about accuracy or breaking the site's 100%-client-side,
// no-network contract.
type CountTokensFn = typeof import('gpt-tokenizer/encoding/o200k_base')['countTokens']
let _countTokens: CountTokensFn | undefined

async function getCountTokens(): Promise<CountTokensFn> {
  if (!_countTokens) {
    _countTokens = (await import('gpt-tokenizer/encoding/o200k_base')).countTokens
  }
  return _countTokens
}

export async function countGptTokens(input: string): Promise<number> {
  if (!input) return 0
  const countTokens = await getCountTokens()
  return countTokens(input)
}
