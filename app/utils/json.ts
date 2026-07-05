export function safeJsonParse<T = unknown>(str: string): { data: T; error: null } | { data: null; error: string } {
  try {
    return { data: JSON.parse(str) as T, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}
