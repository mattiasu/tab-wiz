const USAGE_KEY = 'tabUsage'

export const RECENT_THRESHOLD_MS = 30 * 60 * 1000

export interface TabUsage {
  visitCount: number
  lastVisited: number
}

export type UsageMap = Record<string, TabUsage>

export function normalizeUrl(url: string): string | null {
  try {
    const { hostname, pathname } = new URL(url)
    return (hostname + pathname).replace(/\/$/, '')
  } catch {
    return null
  }
}

export async function loadUsage(): Promise<UsageMap> {
  const result = await chrome.storage.local.get(USAGE_KEY)
  return (result[USAGE_KEY] as UsageMap | undefined) ?? {}
}

export async function recordVisit(url: string): Promise<void> {
  const key = normalizeUrl(url)
  if (!key) return
  const usage = await loadUsage()
  const entry = usage[key] ?? { visitCount: 0, lastVisited: 0 }
  usage[key] = { visitCount: entry.visitCount + 1, lastVisited: Date.now() }
  await chrome.storage.local.set({ [USAGE_KEY]: usage })
}

export function isRecentlyVisited(entry: TabUsage | undefined): boolean {
  if (!entry) return false
  return Date.now() - entry.lastVisited < RECENT_THRESHOLD_MS
}
