const STORAGE_KEY = 'jt-recent'
const MAX = 5

export function useRecentTools() {
  function getRecent(): string[] {
    if (!import.meta.client) return []
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    } catch {
      return []
    }
  }

  function addRecent(slug: string): void {
    if (!import.meta.client) return
    const items = getRecent().filter(s => s !== slug)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([slug, ...items].slice(0, MAX)))
  }

  return { getRecent, addRecent }
}
